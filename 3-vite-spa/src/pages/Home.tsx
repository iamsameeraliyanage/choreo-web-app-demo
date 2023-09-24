import { Link } from "react-router-dom";
import { useGetTodos } from "../apis/todo_queries";

export function Home() {
  const todosQuery = useGetTodos();
  return (
    <div>
      <h1>Home</h1>
      {todosQuery.isLoading && <p>Loading...</p>}
      {todosQuery.isError && <p>Something went wrong</p>}
      {todosQuery.isSuccess && todosQuery.data?.length > 0 && (
        <>
          <p>You have a total of {todosQuery.data?.length} todo items.</p>{" "}
          <Link to="/todos">View all</Link>
        </>
      )}
      {todosQuery.isSuccess && todosQuery.data?.length === 0 && (
        <>
          <p>You have no todo items.</p> <Link to="/todos">Create one now</Link>
        </>
      )}
    </div>
  );
}
