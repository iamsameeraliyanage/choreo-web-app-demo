import { listTodosForUser, TodoResponse } from "@/svc/backend.client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { redirectToLogin } from "@/utils/redirect";
import { getNextAuthServerSession } from "@/utils/session";
import AppLayout from "@/layout/Layout";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OutletContainer from "@/layout/OutletContainer";
import { TodoAddForm } from "@/components/TodoAddForm";
import { FormEvent } from "react";
import { useRouter } from "next/router";

type TodosPageProps = {
  todos: TodoResponse[];
  error: boolean;
};

export const getServerSideProps = (async (context: any) => {
  try {
    const session = await getNextAuthServerSession(context);
    if (!session) {
      return redirectToLogin();
    }
    const todos = await listTodosForUser((session as any)?.user?.id!);
    return { props: { todos, error: false } };
  } catch (error) {
    return { props: { todos: [], error: true } };
  }
}) satisfies GetServerSideProps<TodosPageProps>;

function TodosPage({
  todos,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  if (error) {
    return (
      <AppLayout>
        <OutletContainer title="To Do List" isLoading={false}>
          <p>There was an error while loading your todos.</p>
        </OutletContainer>
      </AppLayout>
    );
  }
  return (
    <AppLayout>
      <OutletContainer title="To Do List" isLoading={false}>
        <TodoAddForm key={"add-item-form"} />
        {todos.length > 0 && (
          <Box mt={3}>
            <Card variant="outlined">
              <CardContent>
                <List>
                  {todos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} />
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        )}
        {todos.length === 0 && (
          <Alert severity="info">You have no pending items.</Alert>
        )}
      </OutletContainer>
    </AppLayout>
  );
}

function TodoItem({ todo }: { todo: TodoResponse }) {
  const router = useRouter();
  const labelId = `checkbox-list-label-${todo.id}`;
  const isItemChecked = !!todo.completed;
  const updateState = async (completed: boolean) => {
    const response = await fetch(`/api/todos/${todo.id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: todo.title,
        description: todo.description,
        completed: completed,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      router.push("/todos");
    } else {
    }
  };
  return (
    <ListItem
      key={todo.id}
      disablePadding
      secondaryAction={
        <Box display="flex" alignItems="center" rowGap={3} columnGap={3}>
          <Link href={`/todos/${todo.id}`}>
            <IconButton edge="end" aria-label="edit" color="primary">
              <EditIcon />
            </IconButton>
          </Link>

          <IconButton edge="end" aria-label="delete" color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
      }
    >
      <ListItemButton
        role={undefined}
        onClick={() => updateState(!isItemChecked)}
        dense
        disableRipple
        disableTouchRipple
      >
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={isItemChecked}
            tabIndex={-1}
            disableRipple
            inputProps={{
              "aria-labelledby": labelId,
            }}
          />
        </ListItemIcon>
        <ListItemText
          id={labelId}
          primary={todo.title}
          secondary={todo.description}
          primaryTypographyProps={{
            variant: "body1",
            style: {
              textDecoration: isItemChecked ? "line-through" : "none",
            },
          }}
          secondaryTypographyProps={{
            variant: "body2",
            style: {
              textDecoration: isItemChecked ? "line-through" : "none",
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}

export default TodosPage;
