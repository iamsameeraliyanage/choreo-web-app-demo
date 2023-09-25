import Layout from "@/components/Layouts";
import AppLayout from "@/layout/Layout";
import { TodoResponse, getTodoByIdForUser } from "@/svc/backend.client";
import { redirectToLogin } from "@/utils/redirect";
import { getNextAuthServerSession } from "@/utils/session";
import { Alert, Box, Button, TextField } from "@mui/material";
import axios from "axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { todo } from "node:test";
import { FormEvent, useState } from "react";

type TodosItemPageProps =
  | {
      itemIdParam: string;
      todo: TodoResponse;
      error: null;
    }
  | {
      itemIdParam: string;
      todo: null;
      error: "not-found" | "internal-error";
    };

export const getServerSideProps = (async (
  context: GetServerSidePropsContext<any, any>
) => {
  let session;
  try {
    session = await getNextAuthServerSession(context);
  } catch (error) {
    return redirectToLogin();
  }
  if (!session) {
    return redirectToLogin();
  }
  const itemId = `${context.params?.id || ""}`;
  const parsedItemId = parseInt(itemId);
  if (isNaN(parsedItemId)) {
    return {
      props: {
        itemIdParam: itemId,
        error: "not-found",
        todo: null,
      },
    };
  }
  try {
    const todo = await getTodoByIdForUser(
      (session as any)?.user?.id!,
      parsedItemId
    );
    return {
      props: { todo, itemIdParam: itemId, error: null },
    };
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return {
        props: {
          itemIdParam: itemId,
          error: "not-found",
          todo: null,
        },
      };
    }
    return {
      props: {
        itemIdParam: itemId,
        error: "internal-error",
        todo: null,
      },
    };
  }
}) satisfies GetServerSideProps<TodosItemPageProps>;

function TodoDetailPage(props: TodosItemPageProps) {
  if (props.error === "not-found") {
    return (
      <Layout>
        <Alert>No todo item available with id {props.itemIdParam}</Alert>
      </Layout>
    );
  }
  if (props.error === "internal-error") {
    return (
      <Layout>
        <Alert>Something went wrong</Alert>
      </Layout>
    );
  }
  const todo = props.todo!;
  return (
    <AppLayout>
      <h1>Todo Detail for ID: {todo.id}</h1>
      <TodoEditForm item={todo} />
    </AppLayout>
  );
}

export default TodoDetailPage;

function TodoEditForm({ item }: { item: TodoResponse }) {
  const router = useRouter();
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [serverError, setServerError] = useState(false);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await fetch(`/api/todos/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({ title, description }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      router.push("/todos");
    } else {
      setServerError(true);
    }
  };
  return (
    <Box>
      <Box>
        {serverError && <Alert severity="error">Something went wrong</Alert>}
        <h1>Edit item</h1>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          id="todo-add-title"
          label="Outlined"
          variant="outlined"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          id="todo-add-description"
          label="Outlined"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button onClick={() => router.push("/todos")} type="button">
          Go to list
        </Button>
        <Button disabled={title.length == 0} type="submit">
          Save
        </Button>
      </form>
    </Box>
  );
}
