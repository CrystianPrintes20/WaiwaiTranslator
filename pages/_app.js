import "../styles/scss/style.scss";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Waiwai Translator| O seu tradutor de linguas maternas.</title>
        <meta
          name="description"
          content="Waiwai Translator| O seu tradutor de linguas maternas"
        />
        <link rel="icon" href="/tapotaIcon.png" />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
