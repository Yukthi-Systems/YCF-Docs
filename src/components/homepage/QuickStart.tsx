import {useState, type ReactNode} from 'react';
import {AccentText, SectionHead, GhostButton, ArrowIcon} from './shared';
import {YCF_RELAYIN_REPO_URL} from '@site/src/constants/github';

type Tab = {
  id: 'docker' | 'source';
  label: string;
  commands: string[];
  note: string;
};

const TABS: Tab[] = [
  {
    id: 'docker',
    label: 'Docker',
    commands: [
      `git clone ${YCF_RELAYIN_REPO_URL}.git`,
      'cd YCF-RelayIn',
      'docker compose up -d',
    ],
    note: 'Starts the filter container. It still needs Postfix relaying inbound mail to it, a reachable Postgres with the policy tables, and RabbitMQ — see the docs for wiring those up.',
  },
  {
    id: 'source',
    label: 'From source',
    commands: [
      `git clone ${YCF_RELAYIN_REPO_URL}.git`,
      'cd YCF-RelayIn',
      'go build -o server ./cmd/server',
      './server',
    ],
    note: 'Needs libgmime-3.0-dev, pkg-config, and a C compiler installed first — the EML parser is a CGo binding to GMime, not pure Go.',
  },
];

export default function QuickStart(): ReactNode {
  const [active, setActive] = useState<Tab['id']>('docker');
  const [copied, setCopied] = useState(false);
  const tab = TABS.find((t) => t.id === active)!;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tab.commands.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <section className="tw-border-y tw-border-slate-200 tw-bg-slate-50 tw-px-4 tw-py-24 dark:tw-border-slate-800 dark:tw-bg-slate-900/40">
      <div className="tw-mx-auto tw-grid tw-max-w-6xl tw-items-center tw-gap-12 md:tw-grid-cols-[44%_56%]">
        <div>
          <SectionHead
            eyebrow="Self-host it yourself"
            title={
              <>
                From clone to <AccentText>filtering mail</AccentText>
              </>
            }
            lede="Docker is the realistic path — the docs cover Postfix relaying, the Postgres schema each plugin expects, and every environment variable."
          />
          <GhostButton to="/docs/deployment">
            Read the deployment guide <ArrowIcon />
          </GhostButton>
        </div>

        <div className="tw-overflow-hidden tw-rounded-2xl tw-border tw-border-slate-200 tw-bg-white tw-shadow-2xl tw-shadow-slate-900/10 dark:tw-border-slate-700 dark:tw-bg-slate-900 dark:tw-shadow-black/40">
          <div className="tw-flex tw-items-center tw-gap-1.5 tw-border-b tw-border-slate-200 tw-bg-slate-50 tw-px-3.5 tw-py-2.5 dark:tw-border-slate-700 dark:tw-bg-slate-800/60">
            <span className="tw-h-2.5 tw-w-2.5 tw-rounded-full tw-bg-slate-300 dark:tw-bg-slate-600" />
            <span className="tw-h-2.5 tw-w-2.5 tw-rounded-full tw-bg-slate-300 dark:tw-bg-slate-600" />
            <span className="tw-h-2.5 tw-w-2.5 tw-rounded-full tw-bg-slate-300 dark:tw-bg-slate-600" />
            <div className="tw-ml-2.5 tw-flex tw-gap-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActive(t.id)}
                  className={
                    'tw-appearance-none tw-rounded-md tw-border-0 tw-px-2.5 tw-py-1 tw-font-mono tw-text-xs tw-font-medium tw-transition ' +
                    (active === t.id
                      ? 'tw-bg-white tw-text-amber-700 tw-shadow-sm dark:tw-bg-slate-900 dark:tw-text-amber-300'
                      : 'tw-bg-transparent tw-text-slate-400 hover:tw-text-slate-600 dark:tw-text-slate-500 dark:hover:tw-text-slate-300')
                  }>
                  {t.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={copy}
              className="tw-ml-auto tw-appearance-none tw-rounded-md tw-border tw-border-slate-300 tw-bg-transparent tw-px-3 tw-py-1 tw-font-mono tw-text-xs tw-font-semibold tw-text-amber-700 tw-transition hover:tw-border-amber-400 dark:tw-border-slate-600 dark:tw-bg-transparent dark:tw-text-amber-300">
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
          <pre className="tw-m-0 tw-overflow-x-auto tw-p-5 tw-font-mono tw-text-sm tw-leading-loose tw-text-slate-700 dark:tw-text-slate-200">
            {tab.commands.map((c) => (
              <div key={c}>
                <span className="tw-mr-2 tw-select-none tw-font-semibold tw-text-amber-700 dark:tw-text-amber-300">
                  $
                </span>
                {c}
              </div>
            ))}
          </pre>
          <p className="tw-m-0 tw-border-t tw-border-slate-100 tw-px-5 tw-py-3.5 tw-text-xs tw-leading-relaxed tw-text-slate-400 dark:tw-border-slate-800 dark:tw-text-slate-500">
            {tab.note}
          </p>
        </div>
      </div>
    </section>
  );
}
