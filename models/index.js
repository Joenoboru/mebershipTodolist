var Sequelize = require('sequelize');

var settings = {
  user: 'postgres',
  password: '1qaz2wsx',
  databaseIp: '192.168.1.160',
  databasePort: '5432',
  databaseName: 'todolist'
};

// const sequelizeConnection = new Sequelize('todolist', settings.user, settings.password, {
//   host: settings.Ip,
//   dialect: settings.dialect,
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   },
// },

// );



const sequelizeConnection = new Sequelize(
  'postgres://'+settings.user+':'+settings.password+'@'+settings.databaseIp+
  ':'+settings.databasePort+'/'+settings.databaseName
);



var db = {
  sequelize: sequelizeConnection
};

db.Members = db.sequelize.import('./members.js');
db.TodoList= db.sequelize.import('./todoList.js');

db.Members.hasMany(db.TodoList, { foreignKey: 'accountName', targetKey: 'account' });
db.TodoList.belongsTo(db.Members, { foreignKey: 'accountName', targetKey: 'account' });


module.exports = db;