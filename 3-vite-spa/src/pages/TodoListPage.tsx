import { Box, Button, List, ListItem, TextField } from "@mui/material";
import { useGetTodos } from "../apis/todo_queries";
import { useCreateTodo } from "../apis/todo_mutations";
import { useReducer, useState } from "react";
import { Link } from "react-router-dom";

export function TodoListPage() {
  const todosQuery = useGetTodos();
  const [formKey, resetForm] = useReducer((x) => x + 1, 0);
  if (todosQuery.isLoading) {
    return <p>Loading...</p>;
  }
  if (todosQuery.isError) {
    return <p>Something went wrong</p>;
  }
  return (
    <Box>
      <TodoAddForm key={formKey} onAdd={resetForm} />
      <h1>Pending items</h1>
      {todosQuery.isSuccess && todosQuery.data?.length > 0 && (
        <List>
          {todosQuery.data.map((todo) => (
            <ListItem key={todo.id}>
              {todo.title}
              {todo.description && ` - ${todo.description}`}
              <Link to={`/todos/${todo.id}`}>
                <Button variant="outlined">Edit</Button>
              </Link>
            </ListItem>
          ))}
        </List>
      )}
      {todosQuery.isSuccess && todosQuery.data?.length === 0 && (
        <p>You have no pending items.</p>
      )}
    </Box>
  );
}

function TodoAddForm({ onAdd }: { onAdd: () => void }) {
  const addTodo = useCreateTodo(onAdd);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  return (
    <Box>
      <Box>
        <h1>Add item</h1>
      </Box>
      {addTodo.isError && <p>Something went wrong</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTodo.mutate({ title, description });
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
        <Button disabled={title.length == 0} type="submit">
          Add
        </Button>
      </form>
    </Box>
  );
}
