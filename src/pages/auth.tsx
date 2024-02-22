import AuthForm from "../components/auth/auth-form";
import { getServerSession } from "next-auth";
import { GetServerSideProps } from "next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

function AuthPage() {
  return <AuthForm />;
}

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/profile",
        // not permanent, only when user is not authenticated
        permanent: false,
      },
      props: { session },
    };
  }

  return {
    props: { session },
  };
}) satisfies GetServerSideProps;

export default AuthPage;
