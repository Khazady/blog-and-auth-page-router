import ProfileForm from "./profile-form";
import styles from "./user-profile.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function UserProfile() {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <h1 className={styles.profile}>Loading...</h1>;
  }

  if (status === "unauthenticated") {
    router.push("/auth");
  }

  return (
    <section className={styles.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
}

export default UserProfile;
