import Link from "next/link";
import styles from "./main-navigation.module.css";
import Logo from "./logo";
import { useSession } from "next-auth/react";

export default function MainNavigation() {
  const { data: session, status } = useSession();
  const isSignedIn = status === "authenticated" && session;
  const isLoading = status === "loading";
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
                <button>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
