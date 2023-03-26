const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const { Todo } = require("./models");
const path = require("path");

//This line code is to style our web app using css
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));

//Rendering our todos using ejs template
app.set("view engine", "ejs");
app.get("/", async (request, response) => {
  const allTodos = await Todo.getTodos();
  if (request.accepts("html")) {
    response.render("index", { allTodos });
  } else {
    response.json({ allTodos });
  }
});

// eslint-disable-next-line no-unused-vars
app.get("/todos", async (request, response) => {
  console.log("Todo List");
  try {
    const todo = await Todo.todoList();
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async (request, response) => {
  console.log("Creating a list", request.body);
  try {
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (request, response) => {
  console.log("We have to update a todo with an ID:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);

  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async (request, response) => {
  console.log("Delete a todo by an ID:", request.params.id);
  const reqeustedID = request.params.id;
  try {
    const deletedRow = await Todo.destroy({ where: { id: reqeustedID } });
    return response.json(deletedRow ? true : false);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
