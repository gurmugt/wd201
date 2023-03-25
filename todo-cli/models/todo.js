// models/todo.js
'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static formattedDate = (d) => {
      return d.toISOString().split('T')[0]
    }

    static async addTask (params) {
      try {
        return await Todo.create({
          title: params.title,
          dueDate: params.dueDate.toISOString(),
          completed: params.completed
        })
      } catch (error) {
        console.log(error)
      }
    }

    static associate (models) {
      // define association here
    }

    static showList = async () => {
      console.log('My Todo-list\n')

      console.log('Overdue')
      const overdueArray = await Todo.overdue()
      let todosString = overdueArray
        .map((todo) => todo.displayableString())
        .join('\n')
        .trim()
      console.log(todosString)

      console.log('\nDue Today')
      const todayArray = await Todo.overdue()
      todosString = todayArray
        .map((todo) => todo.displayableString())
        .join('\n')
        .trim()
      console.log(todosString)

      console.log('\nDue Later')
      const laterArray = await Todo.overdue()
      todosString = laterArray
        .map((todo) => todo.displayableString())
        .join('\n')
        .trim()
      console.log(todosString)
    }

    static async overdue () {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      try {
        const todos = await Todo.findAll()
        const overdue = todos.filter(
          (todo) => todo.dueDate < Todo.formattedDate(new Date())
        )
        return overdue
      } catch (error) {
        console.log(error)
      }
    }

    static async dueToday () {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      try {
        const todos = await Todo.findAll()
        const todayTasks = todos.filter(
          (todo) => todo.dueDate === Todo.formattedDate(new Date())
        )
        return todayTasks
      } catch (error) {
        console.log(error)
      }
    }

    static async dueLater () {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      try {
        const todos = await Todo.findAll()
        const later = todos.filter(
          (todo) => todo.dueDate > Todo.formattedDate(new Date())
        )
        return later
      } catch (error) {
        console.log(error)
      }
    }

    static async markAsComplete (id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      try {
        await Todo.update(
          {
            completed: true
          },
          {
            where: {
              id
            }
          }
        )
      } catch (error) {
        console.log(error)
      }
    }

    displayableString () {
      return `${this.id}. ${this.completed ? '[x]' : '[ ]'} ${this.title} ${
        this.dueDate === new Date().toISOString().split('T')[0]
          ? ''
          : this.dueDate
      }`.trim()
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: 'Todo'
    }
  )
  return Todo
}
