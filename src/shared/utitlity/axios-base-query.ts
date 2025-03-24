import { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { auth } from "../../../auth";

export const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: "" }
  ): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      headers?: AxiosRequestConfig["headers"];
      params?: AxiosRequestConfig["params"];
      responseType?: AxiosRequestConfig["responseType"];
      permission?: string;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, headers, responseType }) => {
    try {
      const session = await auth(); // Fetch session in NextAuth v5
      const accessToken = session?.user?.accessToken; // Adjust structure

      if (!accessToken) throw new Error("No access token available");

      const config: AxiosRequestConfig = {
        url: baseUrl + url,
        method,
        data,
        params,
        responseType,
        headers: {
          ...headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const result = await axios(config);
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      if (err.response?.status === 401) {
        try {
          const session = await auth();
          const refreshToken = session?.user?.refreshToken;

          if (!refreshToken) throw new Error("No refresh token available");

          const result = await axios({
            ...err.config,
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              "Content-Type": "application/json",
            },
          });

          return { data: result.data };
        } catch (refreshError) {
          return {
            error: { status: 401, data: "Session expired. Please log in again." },
          };
        }
      }

      return {
        error: { status: err.response?.status, data: err.response?.data },
      };
    }
  };
