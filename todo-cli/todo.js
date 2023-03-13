/* eslint-disable no-undef */
const todoList = () => {
  all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    const OverDue = all.filter(
      (items) =>
        items.dueDate.split("-")[2] <
        new Date().toISOString().split("T")[0].split("-")[2]
    );
    return OverDue;
  };

  const dueToday = () => {
    const DueToday = all.filter(
      (items) =>
        items.dueDate.split("-")[2] ===
        String(new Date().toISOString().split("T")[0].split("-")[2])
    );
    return DueToday;
  };

  const dueLater = () => {
    const DueLater = all.filter(
      (items) =>
        items.dueDate.split("-")[2] >
        new Date().toISOString().split("T")[0].split("-")[2]
    );
    return DueLater;
  };

  const toDisplayableList = (list) => {
    const final = list.map((items) => {
      const checkIfCompleted = items.completed === true ? "[x]" : "[ ]";
      const displayDueDate =
        items.dueDate === new Date().toISOString().split("T")[0]
          ? ""
          : ` ${items.dueDate}`;
      return `${checkIfCompleted} ${items.title}${displayDueDate}`;
    });
    return final.join("\n");
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;
