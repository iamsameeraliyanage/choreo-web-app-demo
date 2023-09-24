import { useAuthContext } from "@asgardeo/auth-react";
import { useQuery } from "react-query";
import { listTodosForUser } from "./todos";

export function useGetTodos() {
  const ctx = useAuthContext();
  return useQuery({
    queryKey: "todos",
    queryFn: async () => {
      return listTodosForUser(ctx);
    },
  });
}
