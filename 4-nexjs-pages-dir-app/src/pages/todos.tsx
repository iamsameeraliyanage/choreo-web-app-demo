import Layout from "@/components/Layouts";
import { listTodosForUser, TodoResponse } from "@/svc/backend.client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { getSession, SessionContext } from "next-auth/react";
import Link from "next/link";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirectTo, redirectToLogin } from "@/utils/redirect";
import { getNextAuthServerSession } from "@/utils/session";

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
      <Layout>
        <div>
          <h1>Todos List</h1>
          <p>There was an error while loading your todos.</p>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div>
        <h1>Todos List</h1>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <Link href={`/todo/${todo.id}`}>{todo.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

export default TodosPage;
