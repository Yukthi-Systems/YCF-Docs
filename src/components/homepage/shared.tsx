import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';

export function GitHubIcon({size = 18}: {size?: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function AccentText({children}: {children: ReactNode}) {
  return <span className="tw-text-amber-600 dark:tw-text-amber-400">{children}</span>;
}

export function SectionHead({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
}) {
  return (
    <header className="tw-mb-11 tw-max-w-2xl">
      <p className="tw-mb-0 tw-font-mono tw-text-xs tw-font-semibold tw-uppercase tw-tracking-widest tw-text-amber-600 dark:tw-text-amber-300">
        {eyebrow}
      </p>
      <h2 className="tw-mt-2 tw-font-display tw-text-3xl tw-font-bold tw-tracking-tight tw-text-slate-900 dark:tw-text-white md:tw-text-4xl">
        {title}
      </h2>
      {lede ? (
        <p className="tw-mt-3.5 tw-text-base tw-leading-relaxed tw-text-slate-500 dark:tw-text-slate-400">
          {lede}
        </p>
      ) : null}
    </header>
  );
}

export function PrimaryButton({to, children}: {to: string; children: ReactNode}) {
  return (
    <Link
      to={to}
      className="tw-inline-flex tw-items-center tw-gap-2 tw-rounded-lg tw-bg-amber-700 tw-px-6 tw-py-3 tw-font-semibold tw-text-white tw-no-underline tw-shadow-lg tw-shadow-amber-700/25 tw-transition hover:tw--translate-y-0.5 hover:tw-bg-amber-800 hover:tw-text-white hover:tw-no-underline hover:tw-shadow-amber-700/40 dark:tw-bg-amber-500 dark:tw-shadow-amber-500/20 dark:hover:tw-bg-amber-400">
      {children}
    </Link>
  );
}

export function GhostButton({to, children}: {to: string; children: ReactNode}) {
  return (
    <Link
      to={to}
      className="tw-inline-flex tw-items-center tw-gap-2 tw-rounded-lg tw-border tw-border-slate-300 tw-bg-white tw-px-6 tw-py-3 tw-font-semibold tw-text-slate-700 tw-no-underline tw-transition hover:tw--translate-y-0.5 hover:tw-border-amber-400 hover:tw-text-amber-700 hover:tw-no-underline dark:tw-border-slate-700 dark:tw-bg-slate-900 dark:tw-text-slate-200 dark:hover:tw-border-amber-400 dark:hover:tw-text-amber-300">
      {children}
    </Link>
  );
}
