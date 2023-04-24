"use strict";
// eslint-disable-next-line no-unused-vars
const { response } = require("express");
const { Model } = require("sequelize");
const { Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: 'userId'
      })
      // define association here
    }

    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }

    setCompletionStatus(status) {
      return this.update({ completed: status });
    }

    static todoList() {
      return this.findAll();
    }

    static getOverdue() {
      return this.findAll({
        where: { completed: false, dueDate: { [Op.lt]: new Date() } },
      });
    }

    static getDueToday() {
      return this.findAll({
        where: {
          completed: false,
          dueDate: {
            [Op.gte]: new Date().setHours(0, 0, 0, 0),
            [Op.lte]: new Date().setHours(23, 59, 59, 999),
          },
        },
      });
    }

    static getDueLater() {
      return this.findAll({
        where: {
          completed: false,
          dueDate: { [Op.gt]: new Date().setHours(23, 59, 59, 999) },
        },
      });
    }

    static getCompletedItems() {
      return this.findAll({
        where: { completed: "true" },
      });
    }

    static async remove(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
