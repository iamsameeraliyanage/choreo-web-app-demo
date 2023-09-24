import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
} from "@mui/material";
import { useGetTodos } from "../apis/todo_queries";
import { useCreateTodo } from "../apis/todo_mutations";
import { useReducer, useState } from "react";
import { Link } from "react-router-dom";
import OutletContainer from "../layout/OutletContainer";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export function TodoListPage() {
    const todosQuery = useGetTodos();
    const [formKey, resetForm] = useReducer((x) => x + 1, 0);

    const [checked, setChecked] = useState([0]);
    if (todosQuery.isError) {
        return <Alert severity="error">Something went wrong</Alert>;
    }

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };
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
                <Box mt={3}>
                    <Card variant="outlined">
                        <CardContent>
                            <List>
                                {todosQuery.data.map((todo) => {
                                    const labelId = `checkbox-list-label-${todo.id}`;
                                    const isItemChecked =
                                        checked.indexOf(todo.id) !== -1;
                                    return (
                                        <ListItem
                                            key={todo.id}
                                            disablePadding
                                            secondaryAction={
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    rowGap={3}
                                                    columnGap={3}
                                                >
                                                    <Link
                                                        to={`/todos/${todo.id}`}
                                                    >
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="edit"
                                                            color="primary"
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Link>

                                                    <IconButton
                                                        edge="end"
                                                        aria-label="delete"
                                                        color="error"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            }
                                        >
                                            <ListItemButton
                                                role={undefined}
                                                onClick={handleToggle(todo.id)}
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
                                                            "aria-labelledby":
                                                                labelId,
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
                                                            textDecoration:
                                                                isItemChecked
                                                                    ? "line-through"
                                                                    : "none",
                                                        },
                                                    }}
                                                    secondaryTypographyProps={{
                                                        variant: "body2",
                                                        style: {
                                                            textDecoration:
                                                                isItemChecked
                                                                    ? "line-through"
                                                                    : "none",
                                                        },
                                                    }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </CardContent>
                    </Card>
                </Box>
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
