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
        foreignKey: "userId",
      });
      // define association here
    }

    static addTodo({ title, dueDate, userId }) {
      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userId,
      });
    }

    setCompletionStatus(status) {
      return this.update({ completed: status });
    }

    static todoList() {
      return this.findAll();
    }

    static getOverdue(userId) {
      return this.findAll({
        where: { completed: false, dueDate: { [Op.lt]: new Date() }, userId },
      });
    }

    static getDueToday(userId) {
      return this.findAll({
        where: {
          completed: false,
          dueDate: {
            [Op.gte]: new Date().setHours(0, 0, 0, 0),
            [Op.lte]: new Date().setHours(23, 59, 59, 999),
          },
          userId,
        },
      });
    }

    static getDueLater(userId) {
      return this.findAll({
        where: {
          completed: false,
          dueDate: { [Op.gt]: new Date().setHours(23, 59, 59, 999) },
          userId,
        },
      });
    }

    static getCompletedItems(userId) {
      return this.findAll({
        where: { completed: "true", userId },
      });
    }

    static async remove(id, userId) {
      return this.destroy({
        where: {
          id,
          userId,
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