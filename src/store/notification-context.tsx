import { createContext, useEffect, useState } from "react";
import { ChildrenPropsType } from "@/lib/types/common";

const NotificationContext = createContext({
  notification: {} as NotificationType | null,
  showNotification: (notificationData: NotificationType) => {},
  hideNotification: () => {},
});

export function NotificationContextProvider(props: ChildrenPropsType) {
  const { children } = props;
  const [activeNotification, setActiveNotification] =
    useState<NotificationType | null>(null);

  useEffect(() => {
    if (
      activeNotification &&
      (activeNotification.status === "success" ||
        activeNotification.status === "error")
    ) {
      const timer = setTimeout(() => {
        setActiveNotification(null);
        clearTimeout(timer);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeNotification]);

  function showNotificationHandler(notificationData: NotificationType) {
    setActiveNotification(notificationData);
  }

  function hideNotificationHandler() {
    setActiveNotification(null);
  }

  const contextValue = {
    notification: activeNotification,
    showNotification: showNotificationHandler,
    hideNotification: hideNotificationHandler,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;

export type NotificationType = {
  status: "success" | "error" | "pending";
  title: string;
  message: string;
};
