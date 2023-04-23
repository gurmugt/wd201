const express = require("express");
var csrf = require("tiny-csrf");
const app = express();
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser("ssh! some secret string"));
app.use(csrf("this_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
const { Todo } = require("./models");
const path = require("path");

//This line code is to style our web app using css
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", async (request, response) => {
  const overdue = await Todo.getOverdue();
  const dueToday = await Todo.getDueToday();
  const dueLater = await Todo.getDueLater();
  const completedItems = await Todo.getCompletedItems();

  if (request.accepts("html")) {
    response.render("index", {
      overdue,
      dueToday,
      dueLater,
      completedItems,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.status(200).json({ overdue, dueToday, dueLater });
    //response.json("index", { overdue, dueToday, dueLater });
  }
});

/*app.get("/", async (request, response) => {
  const allTodos = await Todo.getTodos();
  if (request.accepts("html")) {
    response.render("index", { allTodos,});
  } else {
    response.json({ allTodos});
  }
});*/

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
    await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async (request, response) => {
  console.log("We have to update a todo with an ID:", request.params.id);
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.setCompletionStatus(!todo.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

/* app.put("/todos/:id/markAsIncomplete", async (request, response) => {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodoIncomplete= await todo. setCompletionStatus(!todo.completed);
    return response.json(updatedTodoIncomplete);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
}); */

app.delete("/todos/:id", async (request, response) => {
  console.log("Delete a todo by an ID:", request.params.id);
  try {
    await Todo.remove(request.params.id);
    return response.json({ success: true });
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

module.exports = app;
