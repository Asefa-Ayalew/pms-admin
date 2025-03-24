import axios from "axios";
import { setLoading } from "../auth-slice/auth-slice";
import { notifications } from "@mantine/notifications";
import Cookies from "js-cookie";
import { getSession } from "next-auth/react";

export let loading = false;

// async function getAccessToken(account: any) {
//   store.dispatch(setLoading(true));
//   await axios
//     .post(`${process.env.NEXT_PUBLIC_APP_API}/auth/login`, account)
//     .then((response) => {
//       Cookies.set("accessToken", response.data?.accessToken);
//       Cookies.set(
//         "currentRole",
//         JSON.stringify(
//           response?.data?.profile?.userRoles?.map((role: any) => role.role?.key)
//         )
//       );
//       localStorage.setItem("accessToken", response.data?.accessToken);
//       localStorage.setItem("refreshToken", response.data?.refreshToken);
//       localStorage.setItem("userInfo", JSON.stringify(response?.data?.profile));
//       return response.data?.access_token;
//     })
//     .catch(function (error) {
//       store.dispatch(setLoading(false));
//       if (error.response) {
//         notifications.show({
//           title: "Error",
//           color: "red",
//           message: error.response.data.message,
//         });
//       } else if (error.request) {
//         notifications.show({
//           title: "Error",
//           color: "red",
//           message: "Check your internet connection",
//         });
//       } else {
//         console.log("Error", error.message);
//       }
//     });
// }

// export async function userInfo(account: any) {
//   store.dispatch(setLoading(true));
//   await getAccessToken(account);
//   store.dispatch(setLoading(false));
//   return JSON.parse(localStorage.getItem("userInfo") || "{}");
// }

export async function switchRole(roleId: string) {
  const session = await getSession();
  return axios
    .get(`${process.env.NEXT_PUBLIC_APP_API}/auth/switch-role/${roleId}`, {
      headers: {
        Authorization: `Bearer ${
          session?.accessToken ? session?.accessToken : ""
        }`,
      },
    })
    .then((response) => {
      Cookies.set("accessToken", response.data?.accessToken);
      Cookies.set(
        "currentRole",
        JSON.stringify(
          response?.data?.profile?.userRoles?.map((role: any) => role.role?.key)
        )
      );
      localStorage.setItem("accessToken", response.data?.accessToken);
      localStorage.setItem("refreshToken", response.data?.refreshToken);
      localStorage.setItem(
        "currentRole",
        JSON.stringify(
          response?.data?.profile?.userRoles?.map((role: any) => role.role?.key)
        )
      );
      localStorage.setItem(
        "userRolePermissions",
        JSON.stringify(response?.data?.permissions)
      );
      return response.data;
    })
    .catch(function (error) {
      if (error.response) {
      } else if (error.request) {
        notifications.show({
          title: "Error",
          color: "red",
          message: "Check your internet connection",
        });
      } else {
        console.log("Error", error.message);
      }
    });
}
