import "../styles/globals.css";
import Layout from "../components/layout/layout";
import { NotificationContextProvider } from "../store/notification-context";
import MainHead from "../components/metadata/main-head";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session} refetchInterval={180 * 60}>
      <MainHead />
      <NotificationContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NotificationContextProvider>
    </SessionProvider>
  );
}

export default MyApp;
