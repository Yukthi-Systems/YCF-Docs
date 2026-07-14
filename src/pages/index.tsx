import type {ReactNode} from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Hero from '@site/src/components/homepage/Hero';
import TechStack from '@site/src/components/homepage/TechStack';
import Features from '@site/src/components/homepage/Features';
import QuickStart from '@site/src/components/homepage/QuickStart';
import CTA from '@site/src/components/homepage/CTA';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="An open-source Go SMTP filter that applies spoof detection, SPF/DKIM scoring, and per-domain policy to inbound mail before it reaches an inbox.">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Hero />
      <TechStack />
      <main>
        <Features />
        <QuickStart />
        <CTA />
      </main>
    </Layout>
  );
}
