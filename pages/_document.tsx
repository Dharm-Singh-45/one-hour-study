import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Custom Font Awesome CSS - Only includes icons we actually use */}
        {/* This reduces CSS from 18.2 KiB to ~2-3 KiB by only including used icons */}
        <link rel="stylesheet" href="/styles/fontawesome-custom.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

