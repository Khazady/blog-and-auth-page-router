import { changePassword } from "@/lib/repos/user-requests/change-password";
import NotificationContext from "@/store/notification-context";
import classes from "./profile-form.module.css";
import { FormEvent, useContext, useState } from "react";

function ProfileForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { showNotification, showSuccessNotification, showErrorNotification } =
    useContext(NotificationContext);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    //add client-side validation, e.g zod

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
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          autoComplete='new-password'
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
