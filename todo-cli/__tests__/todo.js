/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("TodoList Test Suites", () => {
  const formattedDate = (d) => {
    return d.toISOString().split("T")[0];
  };
  let dateToday = new Date();
  const today = formattedDate(dateToday);
  const yesterday = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() - 1))
  );
  const tomorrow = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() + 1))
  );

  beforeAll(() => {
    add({ title: "Submit assignment", dueDate: yesterday, completed: false });
    add({ title: "Pay rent", dueDate: today, completed: true });
    add({ title: "Service Vehicle", dueDate: today, completed: false });
    add({ title: "File taxes", dueDate: tomorrow, completed: false });
    add({ title: "Pay electric bill", dueDate: tomorrow, completed: false });
  });

  test("A test that checks creating a new todo.", () => {
    const todoIC = all.length;
    add({ title: "Creating a new Todo", dueDate: tomorrow, completed: false });
    expect(all.length).toBe(todoIC + 1);
  });

  test("A test that checks marking a todo as completed.", () => {
    expect(all[4]["completed"]).toBe(false);
    markAsComplete(4);
    expect(all[4]["completed"]).toBe(true);
  });

  test("A test that checks retrieval of overdue items.", () => {
    const overDue = overdue();
    expect(overDue.length).toBe(1);
  });

  test("A test that checks retrieval of due today items.", () => {
    const dueT = dueToday();
    expect(dueT.length).toBe(2);
  });

  test("A test that checks retrieval of due later items.", () => {
    const dueL = dueLater();
    expect(dueL.length).toBe(3);
  });
});
