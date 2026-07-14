import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {AccentText, ArrowIcon, GitHubIcon, PrimaryButton, GhostButton} from './shared';
import {DOCS_GITHUB_URL} from '@site/src/constants/github';

const TRACE = [
  {plugin: 'digest_check', ms: '0.1ms', verdict: 'CONTINUE', note: ''},
  {plugin: 'add_euid', ms: '0.4ms', verdict: 'CONTINUE', note: 'X-YSPL-ID: 7f3a2c1b'},
  {plugin: 'validate_from', ms: '0.1ms', verdict: 'CONTINUE', note: ''},
  {plugin: 'archive', ms: '2.1ms', verdict: 'CONTINUE', note: '-> RabbitMQ'},
  {plugin: 'spoof_check', ms: '3.8ms', verdict: 'CONTINUE', note: 'hybrid'},
  {plugin: 'spf_dkim_check', ms: '0.2ms', verdict: 'CONTINUE', note: 'spf=pass dkim=pass'},
  {plugin: 'filter_policies', ms: '0.3ms', verdict: 'CONTINUE', note: ''},
  {plugin: 'attachment_policies', ms: '0.4ms', verdict: 'CONTINUE', note: ''},
  {plugin: 'spam_destination', ms: '0.2ms', verdict: 'ACCEPT', note: 'score 3.0 -> inbox'},
];

function HeroMock() {
  return (
    <div
      role="img"
      aria-label="Mock trace of a message moving through the YCF plugin chain, ending in ACCEPT"
      className="tw-relative tw-overflow-hidden tw-rounded-2xl tw-border tw-border-slate-200 tw-bg-white tw-text-sm tw-shadow-2xl tw-shadow-slate-900/10 dark:tw-border-slate-700 dark:tw-bg-slate-900 dark:tw-shadow-black/40">
      <div className="tw-flex tw-items-center tw-gap-1.5 tw-border-b tw-border-slate-200 tw-bg-slate-50 tw-px-3.5 tw-py-2.5 dark:tw-border-slate-700 dark:tw-bg-slate-800/60">
        <span className="tw-h-2.5 tw-w-2.5 tw-rounded-full tw-bg-slate-300 dark:tw-bg-slate-600" />
        <span className="tw-h-2.5 tw-w-2.5 tw-rounded-full tw-bg-slate-300 dark:tw-bg-slate-600" />
        <span className="tw-h-2.5 tw-w-2.5 tw-rounded-full tw-bg-slate-300 dark:tw-bg-slate-600" />
        <span className="tw-ml-2.5 tw-rounded-full tw-border tw-border-slate-200 tw-bg-white tw-px-3 tw-py-0.5 tw-font-mono tw-text-xs tw-text-slate-400 dark:tw-border-slate-700 dark:tw-bg-slate-900 dark:tw-text-slate-500">
          logs/app.log
        </span>
      </div>

      <div className="tw-p-3.5 tw-font-mono tw-text-[0.72rem] tw-leading-relaxed">
        <div className="tw-mb-1.5 tw-text-slate-400 dark:tw-text-slate-500">
          postfix → ycf&nbsp;&nbsp;queued as 7f3a2c1b
        </div>
        {TRACE.map((t) => (
          <div key={t.plugin} className="tw-flex tw-items-center tw-gap-2.5">
            <span className="tw-w-[132px] tw-flex-none tw-truncate tw-text-slate-600 dark:tw-text-slate-300">
              {t.plugin}
            </span>
            <span
              className={
                'tw-w-16 tw-flex-none tw-font-semibold ' +
                (t.verdict === 'ACCEPT'
                  ? 'tw-text-emerald-600 dark:tw-text-emerald-400'
                  : 'tw-text-amber-600 dark:tw-text-amber-400')
              }>
              {t.verdict}
            </span>
            <span className="tw-w-12 tw-flex-none tw-text-slate-400 dark:tw-text-slate-500">
              {t.ms}
            </span>
            <span className="tw-truncate tw-text-slate-400 dark:tw-text-slate-500">{t.note}</span>
          </div>
        ))}
        <div className="tw-mt-1.5 tw-text-slate-400 dark:tw-text-slate-500">
          ycf → postfix&nbsp;&nbsp;250 2.6.0 Ok: queued
        </div>
      </div>

      {/* Score card, floating over the corner — same trick as a mail-hover-card would be,
          just showing the number that actually decided the outcome above. */}
      <div
        aria-hidden="true"
        className="tw-absolute -tw-bottom-6 -tw-right-5 tw-hidden tw-w-52 tw-rounded-xl tw-border tw-border-slate-200 tw-bg-white tw-p-3.5 tw-shadow-2xl tw-shadow-slate-900/10 dark:tw-border-slate-700 dark:tw-bg-slate-900 dark:tw-shadow-black/40 sm:tw-block">
        <div className="tw-flex tw-items-center tw-justify-between">
          <span className="tw-font-mono tw-text-[0.68rem] tw-uppercase tw-tracking-wide tw-text-slate-400 dark:tw-text-slate-500">
            X-Spam-Score
          </span>
          <strong className="tw-font-mono tw-text-sm tw-text-emerald-600 dark:tw-text-emerald-400">
            3.0
          </strong>
        </div>
        <div className="tw-mt-2 tw-h-1.5 tw-overflow-hidden tw-rounded-full tw-bg-slate-100 dark:tw-bg-slate-800">
          <div className="tw-h-full tw-w-[25%] tw-rounded-full tw-bg-emerald-500" />
        </div>
        <div className="tw-mt-1.5 tw-flex tw-justify-between tw-font-mono tw-text-[0.6rem] tw-text-slate-400 dark:tw-text-slate-500">
          <span>0</span>
          <span>T1 · 8.0</span>
          <span>T2 · 12.0</span>
        </div>
      </div>
    </div>
  );
}

export default function Hero(): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  return (
    <header className="tw-relative tw-isolate tw-overflow-hidden tw-px-4 tw-pb-24 tw-pt-24 md:tw-pt-32">
      <div className="homepage-hero-bg" aria-hidden="true" />

      <div className="tw-mx-auto tw-grid tw-max-w-6xl tw-items-center tw-gap-14 md:tw-grid-cols-[46%_54%]">
        <div>
          <Link
            to={DOCS_GITHUB_URL}
            className="tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-border tw-border-slate-300 tw-bg-white tw-px-3.5 tw-py-1.5 tw-font-mono tw-text-xs tw-text-slate-700 tw-no-underline tw-transition hover:tw-border-amber-400 hover:tw-text-amber-700 hover:tw-no-underline dark:tw-border-slate-700 dark:tw-bg-slate-900 dark:tw-text-slate-200">
            <span className="tw-relative tw-flex tw-h-1.5 tw-w-1.5">
              <span className="tw-absolute tw-inline-flex tw-h-full tw-w-full tw-animate-ping tw-rounded-full tw-bg-emerald-400 tw-opacity-75" />
              <span className="tw-relative tw-inline-flex tw-h-1.5 tw-w-1.5 tw-rounded-full tw-bg-emerald-500" />
            </span>
            Open source
            <ArrowIcon />
          </Link>

          <h1 className="tw-mt-5 tw-font-display tw-text-4xl tw-font-extrabold tw-leading-[1.06] tw-tracking-tight tw-text-slate-900 dark:tw-text-white md:tw-text-6xl">
            Decide what happens
            <br />
            <AccentText>to mail before it lands.</AccentText>
          </h1>

          <p className="tw-mt-4 tw-max-w-md tw-text-base tw-leading-relaxed tw-text-slate-500 dark:tw-text-slate-400">
            {siteConfig.tagline} A Go SMTP relay that sits after Postfix and Amavis —
            spoof detection, SPF/DKIM scoring, block lists, attachment rules, and a spam
            score that decides inbox, spam, or nothing at all.
          </p>

          <div className="tw-mt-7 tw-flex tw-flex-wrap tw-gap-3.5">
            <PrimaryButton to="/docs">
              Read the docs <ArrowIcon />
            </PrimaryButton>
            <GhostButton to={DOCS_GITHUB_URL}>
              <GitHubIcon /> View on GitHub
            </GhostButton>
          </div>

          <p className="tw-mt-5 tw-font-mono tw-text-xs tw-tracking-wide tw-text-slate-400 dark:tw-text-slate-500">
            Plain SMTP, not a milter · Runs on your own mail servers · Go + Postgres + RabbitMQ
          </p>
        </div>

        <div>
          <HeroMock />
        </div>
      </div>
    </header>
  );
}
