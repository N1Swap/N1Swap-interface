import Document, { Head, Main, NextScript, Html} from 'next/document';

import { GA_TRACKING_ID } from 'helper/gtag'

export default class extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Global Site Tag (gtag.js) - Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@pixelschain" />
          <meta name="twitter:creator" content="@pixelschain" />
          <meta property="og:url" content="https://www.n1swap.com" />
          <meta property="og:title" content="N1Swap - Free airdrop" />
          <meta property="og:description" content="A better working decentralized exchange based on the Trx network" />
          <meta property="og:image" content="https://www.n1swap.com/img/coming/card.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}