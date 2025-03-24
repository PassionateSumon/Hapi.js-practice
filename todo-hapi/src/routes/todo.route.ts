import { ServerRoute } from "@hapi/hapi";
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controllers/todo.controller";

const todoRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/add-todo",
    handler: addTodo,
    options: {
      tags: ["api", "todo"],
      description: "Add a new todo.",
      auth: "jwt",
    },
  },
  {
    method: "GET",
    path: "/get-todos",
    handler: getTodos,
    options: {
      tags: ["api", "todo"],
      description: "Get all todos.",
      auth: "jwt",
    },
  },
  {
    method: "PUT",
    path: "/update-todo/{id}",
    handler: updateTodo,
    options: {
      tags: ["api", "todo"],
      description: "Update a todo.",
      auth: "jwt",
    },
  },
  {
    method: "DELETE",
    path: "/delete-todo/{id}",
    handler: deleteTodo,
    options: {
      tags: ["api", "todo"],
      description: "Delete a todo.",
      auth: "jwt",
    },
  },
];

export default todoRoutes;
