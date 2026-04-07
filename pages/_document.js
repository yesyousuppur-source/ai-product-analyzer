import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="YesYouPro — AI product analyzer for Indian ecommerce sellers. Analyze any product in 30 seconds. Get viral hooks, keywords, competitor analysis & more. Free to try!" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yesyoupro.com" />
        <meta property="og:title" content="YesYouPro — AI Product Analyzer" />
        <meta property="og:description" content="Analyze any product in 30 seconds! Viral hooks, keywords, competitor analysis & more." />
        <meta property="og:image" content="https://yesyoupro.com/og-image.png" />
        <meta property="og:url" content="https://yesyoupro.com" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
