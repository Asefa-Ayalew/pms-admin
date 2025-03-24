import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { signOut } from "next-auth/react";
import { auth } from "../../../auth";

const handleLogout = async () => {
  try {
    const session = await auth(); // Fetch session in NextAuth v5

    if (session?.user?.accessToken) {
      await fetch(`${process.env.NEXT_PUBLIC_APP_API}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      });

      await signOut();
      notifications.show({
        title: "Logout successful",
        message: "You have been logged out",
        color: "green",
      });
      return true;
    }

    modals.closeAll();
    return false;
  } catch (error) {
    modals.closeAll();
    notifications.show({
      title: "Logout failed",
      message: "Please try again later",
      color: "red",
    });
    return false;
  }
};

export default handleLogout;
