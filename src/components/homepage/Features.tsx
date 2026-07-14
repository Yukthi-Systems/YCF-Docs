import type {ReactNode} from 'react';
import {AccentText, SectionHead} from './shared';

const MORE_POLICIES = [
  'Forwarding rules',
  'General block-all switch',
  'External-sender caution banners',
  'Per-recipient blocklist',
  'Digest bypass for re-queued mail',
];

const cardBase =
  'tw-flex tw-flex-col tw-gap-2.5 tw-rounded-2xl tw-border tw-border-slate-200 tw-bg-white tw-p-6 tw-transition hover:-tw-translate-y-1 hover:tw-border-amber-300 dark:tw-border-slate-800 dark:tw-bg-slate-900 dark:hover:tw-border-amber-500/50';

export default function Features(): ReactNode {
  return (
    <section className="tw-mx-auto tw-max-w-6xl tw-px-4 tw-py-24">
      <SectionHead
        eyebrow="Thirteen plugins, one pipeline"
        title={
          <>
            The policy layer <AccentText>above the spam filter</AccentText>
          </>
        }
        lede="Amavis and ClamAV already caught the obvious stuff upstream. YCF is what runs after that — per-domain, per-org rules, applied to every message in order."
      />

      <div className="tw-grid tw-grid-cols-12 tw-gap-4">
        <article className={`${cardBase} tw-col-span-12 md:tw-col-span-7`}>
          <h3 className="tw-m-0 tw-font-display tw-text-lg tw-font-bold tw-tracking-tight tw-text-slate-900 dark:tw-text-white">
            Spoof detection, per domain
          </h3>
          <p className="tw-m-0 tw-text-sm tw-leading-relaxed tw-text-slate-500 dark:tw-text-slate-400">
            Every hybrid domain gets checked against its own mailbox list — mail
            claiming to be from a locally hosted address, arriving from outside, gets
            discarded before anything else runs.
          </p>
          <pre className="tw-mt-2 tw-overflow-x-auto tw-rounded-lg tw-border tw-border-slate-100 tw-bg-slate-50 tw-p-4 tw-font-mono tw-text-xs tw-leading-relaxed tw-text-slate-700 dark:tw-border-slate-800 dark:tw-bg-slate-800/50 dark:tw-text-slate-200">
            {`WHEN d.is_hybrid = TRUE
 AND m.email IS NOT NULL
   THEN 'spoof'  -- discard`}
          </pre>
        </article>

        <article className={`${cardBase} tw-col-span-12 md:tw-col-span-5`}>
          <h3 className="tw-m-0 tw-font-display tw-text-lg tw-font-bold tw-tracking-tight tw-text-slate-900 dark:tw-text-white">
            SPF / DKIM, scored not just pass/fail
          </h3>
          <p className="tw-m-0 tw-text-sm tw-leading-relaxed tw-text-slate-500 dark:tw-text-slate-400">
            Reads the <code>Authentication-Results</code> header Amavis already
            attached, and adds a configurable weight to the running spam score instead
            of a blunt accept/reject.
          </p>
        </article>

        <article className={`${cardBase} tw-col-span-12 md:tw-col-span-4`}>
          <h3 className="tw-m-0 tw-font-display tw-text-lg tw-font-bold tw-tracking-tight tw-text-slate-900 dark:tw-text-white">
            Spam score decides the address, not just accept/reject
          </h3>
          <p className="tw-m-0 tw-text-sm tw-leading-relaxed tw-text-slate-500 dark:tw-text-slate-400">
            Two thresholds split every message into inbox, a per-domain destination
            (spam / trash / a named folder — via plus-addressing), or discarded.
          </p>
        </article>

        <article className={`${cardBase} tw-col-span-12 md:tw-col-span-4`}>
          <h3 className="tw-m-0 tw-font-display tw-text-lg tw-font-bold tw-tracking-tight tw-text-slate-900 dark:tw-text-white">
            Group mailboxes, four ways to gate them
          </h3>
          <p className="tw-m-0 tw-text-sm tw-leading-relaxed tw-text-slate-500 dark:tw-text-slate-400">
            Distribution lists can be open to anyone, restricted to group members,
            scoped to a domain, or locked to a specific address list.
          </p>
        </article>

        <article className={`${cardBase} tw-col-span-12 md:tw-col-span-4`}>
          <h3 className="tw-m-0 tw-font-display tw-text-lg tw-font-bold tw-tracking-tight tw-text-slate-900 dark:tw-text-white">
            Attachment and block-list rules, per domain
          </h3>
          <p className="tw-m-0 tw-text-sm tw-leading-relaxed tw-text-slate-500 dark:tw-text-slate-400">
            Allowed/blocked file-extension lists and a block/allow list checked before
            anything else touches spam scoring at all.
          </p>
        </article>
      </div>

      <ul className="tw-mx-auto tw-mt-7 tw-flex tw-list-none tw-flex-wrap tw-gap-2.5 tw-p-0">
        {MORE_POLICIES.map((f) => (
          <li
            key={f}
            className="tw-rounded-full tw-border tw-border-slate-200 tw-bg-white tw-px-3.5 tw-py-1.5 tw-text-sm tw-font-medium tw-text-slate-500 dark:tw-border-slate-800 dark:tw-bg-slate-900 dark:tw-text-slate-400">
            {f}
          </li>
        ))}
      </ul>
    </section>
  );
}
