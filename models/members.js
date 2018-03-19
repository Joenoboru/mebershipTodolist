var Sequelize = require('sequelize');

module.exports = function(sequelize) {
  var MembersModel = sequelize.define(
    'members',
    {
      account: { type: Sequelize.STRING },
      password: { type: Sequelize.STRING },
      createdAt: { type: Sequelize.DATE },

    },
    {
      timestamps: false,
    }
  );

  return MembersModel;
};