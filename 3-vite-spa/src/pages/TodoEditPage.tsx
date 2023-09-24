import { useNavigate, useParams } from "react-router";
import { useGetTodoById } from "../apis/todo_queries";
import { TodoResponse } from "../apis/todos";
import { useState } from "react";
import { useUpdateTodo } from "../apis/todo_mutations";
import { Box, Button, TextField } from "@mui/material";

export function TodoEditPage() {
  const param = useParams()["id"];
  const todoId = parseInt(param || "", 10);
  const query = useGetTodoById(todoId);
  return (
    <div>
      <h1>Edit item</h1>
      {query.isLoading && <p>Loading...</p>}
      {query.isError && <p>Something went wrong</p>}
      {query.isSuccess && query.data && <TodoEditForm item={query.data} />}
    </div>
  );
}

function TodoEditForm({ item }: { item: TodoResponse }) {
  const navigate = useNavigate();
  const updateMutation = useUpdateTodo(item.id);
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  return (
    <Box>
      <Box>
        <h1>Add item</h1>
      </Box>
      {updateMutation.isError && <p>Something went wrong</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateMutation.mutate({ title, description });
          navigate("/todos");
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
        <Button onClick={() => navigate("/todos")} type="button">
          Go to list
        </Button>
        <Button disabled={title.length == 0} type="submit">
          Save
        </Button>
      </form>
    </Box>
  );
}
