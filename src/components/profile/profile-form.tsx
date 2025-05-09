import { changePassword } from "@/lib/repos/user-requests/change-password";
import { validateOrNotify } from "@/lib/utils";
import { changePasswordSchema } from "@/schemas/changePasswordSchema";
import NotificationContext from "@/store/notification-context";
import { useSession } from "next-auth/react";
import { FormEvent, useContext, useState } from "react";
import classes from "./profile-form.module.css";

function ProfileForm() {
  const { data: session } = useSession();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { showNotification, showSuccessNotification, showErrorNotification } =
    useContext(NotificationContext);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const validation = changePasswordSchema.safeParse({
      oldPassword,
      newPassword,
    });

    if (!validateOrNotify(validation, showErrorNotification)) return;

    showNotification({
      title: "Please wait...",
      message: "Your request is being processed...",
      status: "pending",
    });

    try {
      const result = await changePassword({ oldPassword, newPassword });
      showSuccessNotification({
        message: result.message || "Password changed successfully.",
      });
    } catch (error) {
      showErrorNotification({
        message: (error as Error).message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        autoComplete="username"
        value={session?.user?.email ?? "username@example.com"}
        readOnly
        hidden
      />
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input
          type="password"
          id="old-password"
          autoComplete="old-password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>
      <div className={classes.action}>
        <button disabled={isLoading}>
          {isLoading ? "Changing..." : "Change Password"}
        </button>
      </div>
    </form>
  );
}

export default ProfileForm;
