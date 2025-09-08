import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Logo from "./logo";
import styles from "./main-navigation.module.css";

export default function MainNavigation() {
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated" && session;
  const isLoading = status === "loading";

  function logoutHandler() {
    // no need to handle result, as we already have a useSession here for updating UI
    signOut();
  }

  return (
    <header className={styles.header}>
      <Link href="/">
        <Logo />
      </Link>
      <nav>
        <ul>
          <li>
            <Link href="/posts">Posts</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
          {!isSignedIn && !isLoading && (
            <li>
              <Link href="/auth">Login</Link>
            </li>
          )}
          {isSignedIn && (
            <>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
