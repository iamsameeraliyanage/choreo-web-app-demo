import { useAuthContext } from "@asgardeo/auth-react";
import { Button } from "@mui/material";
import { useQuery } from "react-query";
import styles from "./Layout.module.css";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className={styles.container}>
      <nav className={styles.sideMenu}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/todos">Todos</Link>
          </li>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <User />
        </ul>
      </nav>
      <div className={styles.content}>
        <h1>Todo List App</h1>
        <Outlet />
      </div>
    </div>
  );
}

function User() {
  const authCtx = useAuthContext();
  const basicUerInfoQuery = useQuery("basicUserInfo", () => {
    return authCtx.getBasicUserInfo();
  });
  if (!basicUerInfoQuery.isSuccess) {
    return null;
  }
  const user = basicUerInfoQuery.data;
  return (
    <>
      Signed in as {user.email} <br />
      <Button onClick={() => authCtx.signOut()}>Sign out</Button>
    </>
  );
}
