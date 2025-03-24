import { UserRoles } from "@/models/role.model";
import { User } from "@/models/user.model";
import {
  Collection,
  CollectionQuery,
} from "@/shared/models/collection.model";
import { collectionQueryBuilder } from "@/shared/utitlity/collection-query-builder";
import { appApi } from "@/store/app.api";
import { notifications } from "@mantine/notifications";
import { USER_ENDPOINT } from "./user.endpoint";

let userCollection: CollectionQuery;
export const userQuery = appApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${USER_ENDPOINT.detail}/${data?.id}`,
        method: "get",
        params: collectionQueryBuilder(data),
      }),
    }),
    getUsers: builder.query<Collection<User>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: USER_ENDPOINT.list,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      providesTags: ["Users"],
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            userCollection = param;
          }
        } catch (error: any) {
          notifications.show({
            title: "Error",
            message: error?.error?.data?.message
              ? error?.error?.data?.message
              : "Error try again",
            color: "red",
          });
        }
      },
    }),
    createUser: builder.mutation<User, User>({
      query: (newData: any) => ({
        url: `${USER_ENDPOINT.create}`,
        method: "post",
        data: newData,
      }),
      invalidatesTags: ["Users"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            notifications.show({
              title: "Success",
              message: "Successfully created",
              color: "green",
            });
            dispatch(
              userQuery.util.updateQueryData(
                "getUsers",
                userCollection,
                (draft) => {
                  if (data) {
                    draft.data.push(data);
                    draft.count += 1;
                  }
                }
              )
            );
          }
        } catch (error: any) {
          notifications.show({
            title: "error",
            message: error?.error?.data?.message
              ? error?.error?.data?.message
              : "Error try again",
            color: "red",
          });
        }
      },
    }),
    updateUser: builder.mutation<User, User>({
      query: (newData: User) => ({
        url: `${USER_ENDPOINT.update}`,
        method: "PUT",
        data: newData,
      }),
      invalidatesTags: ["UserInfo"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              userQuery.util.updateQueryData(
                "getUsers",
                userCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((user) => {
                      if (user.id === data.id) {
                        return data;
                      } else {
                        return user;
                      }
                    });
                  }
                }
              )
            );
            notifications.show({
              title: "Success",
              message: "Successfully updated",
              color: "green",
            });
          }
        } catch (error: any) {
          notifications.show({
            title: "Error",
            message: error?.error?.data?.message
              ? error?.error?.data?.message
              : "Error try again",
            color: "red",
          });
        }
      },
    }),
    archiveUser: builder.mutation<User, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${USER_ENDPOINT.archive}/${data?.id}`,
        method: "DELETE",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              userQuery.util.updateQueryData(
                "getUsers",
                userCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((user) => {
                      if (user.id === data.id) return data;
                      else {
                        return user;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              userQuery.util.updateQueryData("getUser", param, (draft) => {
                if (data) {
                  draft.archivedAt = data?.archivedAt;
                }
              })
            );
            notifications.show({
              title: "Success",
              message: "Successfully archived",
              color: "green",
            });
          }
        } catch (error: any) {
          notifications.show({
            title: "Error",
            message: error?.error?.data?.message
              ? error?.error?.data?.message
              : "Error try again",
            color: "red",
          });
        }
      },
    }),
    restoreUser: builder.mutation<User, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: `${USER_ENDPOINT.restore}/${data?.id}`,
        method: "POST",
      }),

      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              userQuery.util.updateQueryData(
                "getUsers",
                userCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.map((user) => {
                      if (user.id === data.id)
                        return { ...data, archivedDate: null };
                      else {
                        return user;
                      }
                    });
                  }
                }
              )
            );
            dispatch(
              userQuery.util.updateQueryData("getUser", param, (draft) => {
                if (data) {
                  draft.archivedAt = "";
                }
              })
            );
            notifications.show({
              title: "Success",
              message: "Successfully restored",
              color: "green",
            });
          }
        } catch (error: any) {
          notifications.show({
            title: "Error",
            message: error?.error?.data?.message
              ? error?.error?.data?.message
              : "Error try again",
            color: "red",
          });
        }
      },
    }),
    deleteUser: builder.mutation<boolean, string>({
      query: (id: string) => ({
        url: `${USER_ENDPOINT.delete}/${id}`,
        method: "delete",
      }),
      invalidatesTags: ["Users"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            dispatch(
              userQuery.util.updateQueryData(
                "getUsers",
                userCollection,
                (draft) => {
                  if (data) {
                    draft.data = draft?.data?.filter(
                      (user) => user.id?.toString() !== id
                    );
                    draft.count -= 1;
                  }
                }
              )
            );
            notifications.show({
              title: "Success",
              message: "Successfully deleted",
              color: "green",
            });
          }
        } catch (error: any) {
          notifications.show({
            title: "Error",
            message: error?.error?.data?.message
              ? error?.error?.data?.message
              : "Error try again",
            color: "red",
          });
        }
      },
    }),
    getDepartments: builder.query<Collection<any>, CollectionQuery>({
      query: (data: CollectionQuery) => ({
        url: USER_ENDPOINT.department_list,
        method: "GET",
        params: collectionQueryBuilder(data),
      }),
      async onQueryStarted(param, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            //
          }
        } catch (error: any) {
          notifications.show({
            title: "Error",
            message: error?.error?.data?.message
              ? error?.error?.data?.message
              : "Error try again",
            color: "red",
          });
        }
      },
    }),
    getUserInfo: builder.query<User, void>({
      query: () => ({
        url: `${USER_ENDPOINT.user_info}`,
        method: "get",
      }),
      providesTags: ["UserInfo"],
    }),

    createUserRole: builder.mutation<UserRoles, UserRoles>({
      query: (newData: UserRoles) => ({
        url: `${USER_ENDPOINT.create_role}`,
        method: "post",
        data: newData,
      }),
      invalidatesTags: ["Users"],
      async onQueryStarted(param, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) {
            notifications.show({
              title: "Success",
              message: "Role is Assigned for the user",
              color: "green",
            });
            dispatch(
              userQuery.util.updateQueryData(
                "getUsers",
                userCollection,
                (draft) => {
                  // if (data) {
                  //   draft.data.push(data);
                  //   draft.count += 1;
                  // }
                }
              )
            );
          }
        } catch (error: any) {
          notifications.show({
            title: "error",
            message: error?.error?.data?.message
              ? error?.error?.data?.message
              : "Error try again",
            color: "red",
          });
        }
      },
    }),
  }),
  overrideExisting: true,
});
export const {
  useLazyGetUserQuery,
  useGetUserQuery,
  useLazyGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useArchiveUserMutation,
  useRestoreUserMutation,
  useLazyGetDepartmentsQuery,
  useGetUserInfoQuery,
  useLazyGetUserInfoQuery,
  useCreateUserRoleMutation,
} = userQuery;
