import { axiosBaseQuery } from "../shared/utitlity/axios-base-query";
import { createApi } from "@reduxjs/toolkit/query/react";

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Users","UserInfo"],
  endpoints: () => ({}),
});
