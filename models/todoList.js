var Sequelize = require('sequelize');

module.exports = function(sequelize) {
  var TodoListModel = sequelize.define(
    'todolist',
    {
      accountName: { type: Sequelize.STRING },
      todoEvent: { type: Sequelize.STRING },
      todoContent: { type: Sequelize.STRING },
      isFinished: { type: Sequelize.BOOLEAN },
      createdAt: { type: Sequelize.DATE },

    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  return TodoListModel;
};