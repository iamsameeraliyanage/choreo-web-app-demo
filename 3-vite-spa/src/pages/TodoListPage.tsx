import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    TextField,
} from "@mui/material";
import { useGetTodos } from "../apis/todo_queries";
import { useCreateTodo } from "../apis/todo_mutations";
import { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import OutletContainer from "../layout/OutletContainer";

export function TodoListPage() {
    const todosQuery = useGetTodos();
    const [formKey, resetForm] = useReducer((x) => x + 1, 0);

    if (todosQuery.isError) {
        return <Alert severity="error">Something went wrong</Alert>;
    }
    return (
        <OutletContainer
            title="To Do List"
            isLoading={todosQuery.isLoading}
            breadcrumbs={[
                { label: "Home", link: "/" },
                { label: "To Do List", link: "#" },
            ]}
        >
            <TodoAddForm key={formKey} onAdd={resetForm} />
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
                <Alert severity="info">You have no pending items.</Alert>
            )}
        </OutletContainer>
    );
}

function TodoAddForm({ onAdd }: { onAdd: () => void }) {
    const addTodo = useCreateTodo(onAdd);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    return (
        <Box>
            {addTodo.isError && (
                <Alert severity="error">Something went wrong</Alert>
            )}
            <Card variant="outlined">
                <CardContent>
                    <Box p={3}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                addTodo.mutate({ title, description });
                            }}
                        >
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} md={5}>
                                    <TextField
                                        id="todo-add-title"
                                        label="Task Name"
                                        variant="outlined"
                                        required
                                        value={title}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <TextField
                                        id="todo-add-description"
                                        label="Description"
                                        variant="outlined"
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid item flexGrow={1}>
                                    <Button
                                        disabled={title.length == 0}
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                    >
                                        Add
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
