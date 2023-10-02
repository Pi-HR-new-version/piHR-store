import { apiShell } from "./apiService";

const userApi = apiShell.injectEndpoints({
  endpoints: (build) => ({
    allUser: build.query({
      query: () => ({
        url: "https://jsonplaceholder.typicode.com/users",
        method: "GET",
      }),
      // invalidatesTags
      providesTags: ["Users"],
    }),
  }),
  //   overrideExisting: false,
});
// .enhanceEndpoints({ addTagTypes: ["Users"] });

export const { useAllUserQuery } = userApi;
