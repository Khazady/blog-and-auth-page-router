import "../styles/globals.css";
import Layout from "../components/layout/layout";
import { NotificationContextProvider } from "../store/notification-context";
import MainHead from "../components/metadata/main-head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <MainHead />
      <NotificationContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NotificationContextProvider>
    </>
  );
}

export default MyApp;
