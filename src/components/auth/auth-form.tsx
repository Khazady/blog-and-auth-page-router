import { FormEvent, useState } from "react";
import classes from "./auth-form.module.css";
import { createUser } from "@/lib/api/user-request";
import { signIn } from "next-auth/react";

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    //add client-side validation, e.g zod

    if (isLogin) {
      // redirect: false means don't redirect when auth fails (when throw error in authorize function)
      //no sense to try-catch here, it's always return object event if it fails
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
    } else {
      try {
        const result = await createUser({ email, password });
        console.log(result);
      } catch (error) {
        console.log(error);
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
