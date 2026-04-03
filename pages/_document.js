import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>YesYouPro — AI Product Analyzer</title>
        <meta name="description" content="YesYouPro — AI product analyzer for Indian ecommerce sellers. Get viral hooks, keywords, competitor analysis & more. Free to try!" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta property="og:title" content="YesYouPro — AI Product Analyzer" />
        <meta property="og:description" content="Analyze any product in 30 seconds! Used by Indian ecommerce sellers." />
        <meta property="og:image" content="https://yesyoupro.com/favicon.png" />
        <meta property="og:url" content="https://yesyoupro.com" />
        <meta name="robots" content="index, follow" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
