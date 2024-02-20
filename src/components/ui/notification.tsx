import { useContext } from "react";

import classes from "./notification.module.css";
import NotificationContext, {
  NotificationType,
} from "@/store/notification-context";
import { createPortal } from "react-dom";

function Notification(props: PropsType) {
  const notificationCtx = useContext(NotificationContext);

  const { title, status, message } = props;

  let statusClasses = "";

  if (status === "success") {
    statusClasses = classes.success;
  }

  if (status === "error") {
    statusClasses = classes.error;
  }

  if (status === "pending") {
    statusClasses = classes.pending;
  }

  const activeClasses = `${classes.notification} ${statusClasses}`;
  const target = document.getElementById("notificationPortalTarget");
  return (
    target &&
    createPortal(
      <div className={activeClasses} onClick={notificationCtx.hideNotification}>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>,
      target,
    )
  );
}

export default Notification;

type PropsType = NotificationType;
