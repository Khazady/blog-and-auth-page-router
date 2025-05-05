import NotificationContext from "@/store/notification-context";
import { FormEvent, useContext, useState } from "react";
import classes from "./auth-form.module.css";
import { createUser } from "@/lib/repos/user-requests/create-user";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { showNotification, showSuccessNotification, showErrorNotification } =
    useContext(NotificationContext);

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);

    showNotification({
      title: "Please wait...",
      message: "Your request is being processed...",
      status: "pending",
    });

    //add client-side validation, e.g zod

    if (isLogin) {
      // redirect: false means don't redirect when auth fails (when throw error in authorize function)
      //no sense to try-catch here, it's always return object event if it fails
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      setIsLoading(false);
      if (result?.ok) {
        showSuccessNotification({
          message: "User logged in successfully.",
        });
        router.replace("/profile");
      }
      if (result?.error) {
        showErrorNotification({
          message: result.error || "Something went wrong.",
        });
      }
    } else {
      try {
        const result = await createUser({ email, password });
        showSuccessNotification({
          message: result.message || "User created successfully.",
        });
      } catch (error) {
        showErrorNotification({
          message: (error as Error).message || "Something went wrong.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            required
            autoComplete='username'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={classes.actions}>
          <button disabled={isLoading}>
            {isLoading ? "Loading..." : isLogin ? "Login" : "Create Account"}
          </button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
            disabled={isLoading}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
