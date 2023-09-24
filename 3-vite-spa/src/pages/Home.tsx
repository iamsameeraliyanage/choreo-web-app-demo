import { Link } from "react-router-dom";
import { useGetTodos } from "../apis/todo_queries";
import OutletContainer from "../layout/OutletContainer";

import NoDataImage from "../assets/no-data.svg";
import NotificationCard from "../components/NotificationCard/NotificationCard";
import { Button } from "@mui/material";

export function Home() {
    const todosQuery = useGetTodos();
    return (
        <OutletContainer
            title="Home"
            isLoading={todosQuery.isLoading}
            breadcrumbs={[{ label: "Home", link: "/" }]}
        >
            {todosQuery.isError && <p>Something went wrong</p>}
            {todosQuery.isSuccess && todosQuery.data?.length > 0 && (
                <>
                    <p>
                        You have a total of {todosQuery.data?.length} todo
                        items.
                    </p>{" "}
                    <Link to="/todos">View all</Link>
                </>
            )}
            {todosQuery.isSuccess && todosQuery.data?.length === 0 && (
                <NotificationCard
                    title="You have no todo items."
                    description={
                        <Link to="/todos">
                            <Button variant="outlined">Create new one</Button>
                        </Link>
                    }
                    imgUrl={NoDataImage}
                />
            )}
        </OutletContainer>
    );
}
