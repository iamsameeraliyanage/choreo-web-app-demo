import { Link } from "react-router-dom";
import { useGetTodos } from "../apis/todo_queries";
import OutletContainer from "../layout/OutletContainer";
import ToDoListImage from "../assets/to-do-list.svg";
import NotificationCard from "../components/NotificationCard/NotificationCard";
import { Alert, Box, Button, Typography } from "@mui/material";

export function Home() {
    const todosQuery = useGetTodos();
    return (
        <OutletContainer isLoading={todosQuery.isLoading}>
            {todosQuery.isError && (
                <Alert severity="error">Something went wrong</Alert>
            )}
            {todosQuery.isSuccess && (
                <Box textAlign="center">
                    <Typography variant="h4">Welcome to Todo App</Typography>
                </Box>
            )}

            {todosQuery.isSuccess && todosQuery.data?.length > 0 && (
                <NotificationCard
                    imgUrl={ToDoListImage}
                    title={`You have a total of 
                            ${todosQuery.data?.length} 
                            todo 
                            ${todosQuery.data?.length === 1 ? "item" : "items"}.
                         `}
                    description={
                        <Link to="/todos">
                            <Button variant="outlined">View all</Button>
                        </Link>
                    }
                />
            )}
            {todosQuery.isSuccess && todosQuery.data?.length === 0 && (
                <NotificationCard
                    title="You have no todo items."
                    description={
                        <Link to="/todos">
                            <Button variant="outlined">Create new one</Button>
                        </Link>
                    }
                    imgUrl={ToDoListImage}
                />
            )}
        </OutletContainer>
    );
}
