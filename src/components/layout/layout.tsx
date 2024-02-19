import MainNavigation from "./main-navigation";
import { useContext } from "react";
import NotificationContext from "@/store/notification-context";
import { ChildrenPropsType } from "@/lib/types/common";
import Notification from "@/components/ui/notification";

export default function Layout({ children }: ChildrenPropsType) {
  const ctx = useContext(NotificationContext);
  const activeNotification = ctx.notification;
  return (
    <>
      <MainNavigation />
      <main>{children}</main>
      {activeNotification && (
        <Notification
          title={activeNotification.title}
          message={activeNotification.message}
          status={activeNotification.status}
        />
      )}
    </>
  );
}
