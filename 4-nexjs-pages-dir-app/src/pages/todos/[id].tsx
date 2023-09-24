import Layout from "@/components/Layouts";
import { TodoResponse, getTodoByIdForUser } from "@/svc/backend.client";
import { redirectToLogin } from "@/utils/redirect";
import { getNextAuthServerSession } from "@/utils/session";
import { Box, Button, TextField } from "@mui/material";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

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

export const getServerSideProps = (async (context: any) => {
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
        <h1>No todo item available with id {props.itemIdParam}</h1>
      </Layout>
    );
  }
  if (props.error === "internal-error") {
    return (
      <Layout>
        <h1>Something went wrong</h1>
      </Layout>
    );
  }
  const todo = props.todo!;
  return (
    <Layout>
      <h1>Todo Detail for ID: {todo.id}</h1>
      <TodoEditForm item={todo} />
    </Layout>
  );
}

export default TodoDetailPage;

function TodoEditForm({ item }: { item: TodoResponse }) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  return (
    <Box>
      <Box>
        <h1>Add item</h1>
      </Box>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
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
        <Button onClick={() => {}} type="button">
          Go to list
        </Button>
        <Button disabled={title.length == 0} type="submit">
          Save
        </Button>
      </form>
    </Box>
  );
}
