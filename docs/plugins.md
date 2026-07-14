---
id: plugins
title: Plugin Reference
sidebar_position: 4
---

# Plugin Reference

The default `PLUGINS` chain, in the order they run (from `docker-compose.yml` /
`config.go`'s built-in default):

```text
digest_check, add_euid, validate_from, archive, spoof_check, spf_dkim_check,
add_caution, filter_policies, general_policies, forwarding_policies,
attachment_policies, distribution_policies, spam_destination
```

Each entry below gives the env-var name used in `PLUGINS`, the Go plugin name
(`Name()`), and the source folder under `plugins/`.

## 1. Digest Check

`digest_check` · folder: `digest`

Some mail gets re-queued and re-sent through the pipeline on purpose (retries,
re-injection loops) and shouldn't be filtered a second time. If a message already
carries both `X-YSPL-DIGEST` and `X-YSPL-ID` headers, this plugin accepts it
immediately and nothing else in the chain runs. It's first in the default order for
exactly that reason — everything after it assumes the mail hasn't already been through
the filter.

## 2. Add EUID

`add_euid` · folder: `addeuid`

Stamps an `X-YSPL-ID` header onto the mail, set to the message's `QueueID`. This is the
`euid` value every plugin's log lines carry — grep the log for one `euid` and you get
the full trace of what happened to that specific message. If the parser hasn't been
wired up or the mail body is empty, this plugin just logs it and returns `CONTINUE`
rather than failing the transaction — a missing trace ID isn't worth rejecting mail
over.

## 3. Validate From

`validate_from` · folder: `from`

`MAIL FROM` can legitimately arrive empty over SMTP (bounce messages, for instance).
When that happens this plugin substitutes a placeholder,
`invalid-from-id@mailservice25.com`, so downstream plugins always have something to
work with, and adds to `SpamScore` accordingly. Note that `spoof_check` explicitly
skips this placeholder address rather than trying to look up spoof status for it.

## 4. Archive

`archive` · folder: `archive`

Publishes the mail to RabbitMQ so a separate consumer can persist it. This plugin does
not write to storage itself — archiving is decoupled from the filter's request path on
purpose, so a slow or down storage backend can't make mail delivery slow.

## 5. Spoof Check

`spoof_check` · folder: `spoofcheck`

Runs per `EnvelopeFrom` address (there can be more than one — `AllFrom`). For each,
looks up the sending domain and classifies it:

| Domain state | Result | What happens |
|---|---|---|
| Domain not found in `domains` | `nspoof` | Accept |
| Domain found but `is_active = FALSE` | `nspoof` | Accept |
| Domain's organization is `is_active = FALSE` | `nspoof` | Accept |
| Domain found, `is_hybrid = FALSE` | `spoof` | **Discard** — non-hybrid domains never send externally under their own name |
| Domain found, `is_hybrid = TRUE`, sender exists as an enabled local mailbox | `spoof` | **Discard** — a locally hosted mailbox shouldn't be arriving as if from outside |
| Domain found, `is_hybrid = TRUE`, sender does *not* exist as a local mailbox | `hybrid` | Accept, continue — legitimate external sender on a hybrid domain |

```sql
SELECT
    CASE
        WHEN d.domain_name IS NULL THEN 'nspoof'
        WHEN d.is_active = FALSE THEN 'nspoof'
        WHEN o.is_active = FALSE THEN 'nspoof'
        WHEN d.is_hybrid = FALSE THEN 'spoof'
        WHEN d.is_hybrid = TRUE AND m.email IS NOT NULL THEN 'spoof'
        WHEN d.is_hybrid = TRUE AND m.email IS NULL THEN 'hybrid'
        ELSE 'nspoof'
    END AS spoof_status
FROM (SELECT $2::text AS domain_name) input
LEFT JOIN domains d ON d.domain_name = input.domain_name
LEFT JOIN organizations o ON o.organization_id = d.managed_by
LEFT JOIN mailboxes m
    ON m.domain_name = d.domain_name AND m.email = $1 AND m.is_enabled = TRUE
LIMIT 1;
```

A lookup error breaks out of the loop and logs, rather than rejecting — same
fail-open reasoning as elsewhere in this filter: a Postgres hiccup shouldn't itself
become a reason to bounce legitimate mail.

## 6. SPF and DKIM Check

`spf_dkim_check` · folder: `spfdkimcheck`

Reads the `Authentication-Results` header Postfix/Amavis already attached upstream —
this plugin doesn't do its own SPF/DKIM verification, it scores whatever verdict is
already in that header:

```text
Authentication-Results: v3-test-ri1.yukthi.net; spf=pass (sender IP is
 52.103.43.54) smtp.mailfrom=yukthisystem1@outlook.com; dkim=pass
 header.d=outlook.com
```

- SPF result in `fail`, `softfail`, `permerror`, `temperror` → add `SPF_FAIL_SPAM_SCORE`
  (default `2.0`) to `SpamScore`
- DKIM result in `fail`, `policy`, `neutral`, `permerror` → add `DKIM_FAIL_SPAM_SCORE`
  (default `4.0`)
- DKIM result `temperror` specifically → add a smaller, separate temp-error weight

## 7. Filter Policies

`filter_policies` · folder: `filters`

Domain-level allow/block list. Blocklist is checked first: if the connection-from or
envelope-from address is on it, the recipient gets added to `FilterBlackEntries` (which
`spam_destination`, later in the chain, treats as blacklisted regardless of spam
score). Whitelist runs second — if the envelope `From` or a recipient is whitelisted,
the spam score is reduced and the loop breaks on the first match rather than checking
every recipient.

```go
type FilterPolicies struct {
	WhiteEntries []string `db:"white_entries"`
	BlackEntries []string `db:"black_entries"`
}
```

```sql
SELECT fp.white_entries, fp.black_entries
FROM domains d
JOIN filter_policies fp ON fp.policy_id = d.filter_policy_id
WHERE fp.is_active = TRUE AND d.domain_name = 'domain.com';
```

## 8. General Policies

`general_policies` · folder: `general`

An org-wide kill switch: if `block_all_incoming_emails` or `block_all_incoming_domains`
is set, everything gets blocked *except* addresses/domains on the corresponding
exception list.

```go
type GeneralPolicies struct {
	BlockAllIncomingEmails   bool     `db:"block_all_incoming_emails"`
	BlockAllIncomingDomains  bool     `db:"block_all_incoming_domains"`
	IncomingExceptionDomains []string `db:"incoming_exception_domains"`
	IncomingExceptionEmails  []string `db:"incoming_exception_emails"`
}
```

## 9. Forwarding Policies

`forwarding_policies` · folder: `forwarding`

If the subject or from-address matches a configured pattern, the mail also gets
forwarded to a separate list of addresses.

```go
type ForwordingPolicies struct {
	SubjectContains []string `db:"subject_contains"`
	FromContains    []string `db:"from_emails"`
	ForwordToEmails []string `db:"forward_to_emails"`
}
```

(Yes, the struct name and field names have the "forword" typo in the actual source —
documented here as it exists, not as it should be spelled.)

## 10. Attachment Policies

`attachment_policies` · folder: `attachment`

Per-domain allow/block list of attachment file types, keyed off the recipient's
domain.

```go
type AttachmentPolicies struct {
	BlockedAttachmentTypes []string `db:"blocked_file_types"`
	AllowedAttachmentTypes []string `db:"allowed_file_types"`
}
```

## 11. Mail Manager Caution

`add_caution` · folder: `caution`

Injects a caution banner (HTML and plain-text versions) into mail arriving from
outside the recipient's own domain, via the same GMime-backed `Modify` call
`add_euid` uses for headers — except this one rewrites the body, not a header.

```go
type CautionDetails struct {
	CautionName string `db:"caution_name"`
	CautionHtml string `db:"html_content"`
	CautionText string `db:"text_content"`
}
```

## 12. Distribution Policies

`distribution_policies` · folder: `distribution`

Controls who's allowed to post to a distribution-list mailbox (a "group" address):

| Rule | Meaning |
|---|---|
| `ANYONE` | Anyone can send to this group |
| `GROUP_MEMBER` | Only members of the group itself |
| `DOMAIN_MEMBER` | Anyone on the same domain |
| `SPECIFIC_EMAILS` | Only an explicit address list |

```go
type RuleType string

const (
	RuleTypeAnyone         RuleType = "ANYONE"
	RuleTypeGroupMember    RuleType = "GROUP_MEMBER"
	RuleTypeDomainMember   RuleType = "DOMAIN_MEMBER"
	RuleTypeSpecificEmails RuleType = "SPECIFIC_EMAILS"
)
```

If the sender doesn't satisfy the rule, that recipient is stripped out of the RCPT
list rather than the whole transaction being rejected — other valid recipients on the
same message still get it.

## 13. Spam Destination

`spam_destination` · folder: `spamdestination`

The last plugin in the default chain, and the one that turns `SpamScore` into an
actual outcome. It doesn't literally move mail between folders itself — that's an
IMAP/mailbox-store concern outside this service. What it does is rewrite each
recipient address using plus-addressing, and let final delivery route on that suffix:

- `SpamScore <= SPAM_THRESHOLD_1` (default `8.0`) → inbox, recipient address
  untouched — unless that recipient is in `FilterBlackEntries` from the blocklist
  check earlier, in which case it's treated as if it landed in the second tier below
- `SPAM_THRESHOLD_1 < SpamScore < SPAM_THRESHOLD_2` (default `12.0`) → destination
  looked up per-domain and the recipient rewritten accordingly:
  - `INBOX` → address unchanged
  - `SPAM` → `user+Spam@domain`
  - `TRASH` → `user+Trash@domain`
  - `FOLDER` → `user+<FolderName>@domain` (falls back to plain inbox if no folder name
    is configured)
  - `DELETE` → the recipient is removed from the RCPT list entirely
  - `SEND_DIGEST` → not implemented yet; currently just returns the address unchanged
- `SpamScore >= SPAM_THRESHOLD_2` → discarded outright, no destination lookup, an
  admin-log entry is written recording why

If every recipient ends up removed from `mail.To` (all `DELETE`, or a domain lookup
that failed), the whole message is discarded rather than reinjected with zero
recipients.

```sql
SELECT spam_destination, spam_destination_properties
FROM domains
WHERE domain_name = 'domain.com';
```
