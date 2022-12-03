import Document, { Html, Head, Main, NextScript } from "next/document";
const config: any = {};

class NextDocument extends Document {
  render = () => (
    <Html lang="en">
      <Head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@200,700,500,600,300&display=swap"
          rel="stylesheet"
        />

        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="description" content={config.description} />

        <meta property="og:url" content="https://to-do/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={config.title} />
        <meta property="og:description" content={config.description} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image" content="/banner_image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="to-do" />
        <meta property="twitter:url" content="https://to-do" />
        <meta name="twitter:title" content={config.title} />
        <meta name="twitter:description" content={config.description} />
        <meta name="twitter:image" content="/banner_image.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default NextDocument;
