const request = require("supertest");

const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("responds with json at /todos", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });

  test("Mark a todo as complete", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      completed: false,
    });
    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse.id;
    expect(parsedResponse.completed).toBe(false);
    const markCompletedResponse = await agent
      .put(`/todos/${todoID}/markAsCompleted`)
      .send();
    const parsedUpdateResponse = JSON.parse(markCompletedResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  test("Delete a todo by ID", async () => {
    const createResp = await agent.post("/todos").send({
      title: "Buy milk",
      completed: false,
    });
    const createdTodo = JSON.parse(createResp.text);
    const deleteResp = await agent.delete(`/todos/${createdTodo.id}`).send();
    expect(deleteResp.statusCode).toBe(200);
    expect(deleteResp.body).toBe(true);
  });
});
