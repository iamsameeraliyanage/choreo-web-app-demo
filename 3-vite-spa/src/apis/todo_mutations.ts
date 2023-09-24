import { useMutation, useQueryClient } from "react-query";
import {
  TodoRequest,
  createTodoForUser,
  deleteTodoForUser,
  updateTodoForUser,
} from "./todos";
import { useAuthContext } from "@asgardeo/auth-react";

export function useCreateTodo(onSuccess: () => void) {
  const queryClient = useQueryClient();
  const ctx = useAuthContext();
  return useMutation({
    mutationKey: "createTodo",
    mutationFn: async (todoData: TodoRequest) => {
      return createTodoForUser(ctx, todoData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
      onSuccess();
    },
  });
}

export function useUpdateTodo(todoId: number) {
  const queryClient = useQueryClient();
  const ctx = useAuthContext();
  return useMutation({
    mutationKey: "updateTodo",
    mutationFn: async (todoData: TodoRequest) => {
      return updateTodoForUser(ctx, todoId, todoData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  const ctx = useAuthContext();
  return useMutation({
    mutationKey: "deleteTodo",
    mutationFn: async (todoId: number) => {
      return deleteTodoForUser(ctx, todoId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
    },
  });
}
