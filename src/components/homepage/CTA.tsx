import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {ArrowIcon, GitHubIcon, GhostButton, PrimaryButton} from './shared';
import {DOCS_GITHUB_URL} from '@site/src/constants/github';

export default function CTA(): ReactNode {
  return (
    <section className="tw-px-4 tw-pt-20 tw-pb-28">
      <div className="tw-relative tw-mx-auto tw-max-w-4xl tw-overflow-hidden tw-rounded-3xl tw-border tw-border-slate-200 tw-bg-white tw-px-8 tw-py-16 tw-text-center dark:tw-border-slate-700 dark:tw-bg-slate-900">
        <div className="homepage-cta-glow" aria-hidden="true" />
        <h2 className="tw-relative tw-font-display tw-text-3xl tw-font-bold tw-tracking-tight tw-text-slate-900 dark:tw-text-white md:tw-text-4xl">
          Run your own inbound filter.
        </h2>
        <p className="tw-relative tw-mx-auto tw-mt-3.5 tw-max-w-xl tw-text-base tw-leading-relaxed tw-text-slate-500 dark:tw-text-slate-400">
          Free, open source, and built in the open. Star the repo to follow along — or
          open an issue and shape what ships next.
        </p>
        <div className="tw-relative tw-mt-8 tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-gap-3.5">
          <PrimaryButton to="/docs">
            Read the docs <ArrowIcon />
          </PrimaryButton>
          <GhostButton to={DOCS_GITHUB_URL}>
            <GitHubIcon /> Star on GitHub
          </GhostButton>
        </div>
        <p className="tw-relative tw-mt-6 tw-text-sm tw-text-slate-400 dark:tw-text-slate-500">
          Serious contributors get rewarded —{' '}
          <Link
            to="/open-source"
            className="tw-font-semibold tw-text-amber-700 dark:tw-text-amber-400">
            see how
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
