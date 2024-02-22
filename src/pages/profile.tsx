import UserProfile from "../components/profile/user-profile";
import { getServerSession } from "next-auth";
import { GetServerSideProps } from "next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

function ProfilePage() {
  return <UserProfile />;
}

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        // not permanent, only when user is not authenticated
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}) satisfies GetServerSideProps;

export default ProfilePage;
