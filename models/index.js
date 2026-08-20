const sequelize = require("../config/db");
const User = require("./User");
const Province = require("./Province");
const Destination = require("./Destination");
const Ticket = require("./Ticket");
const Transaction = require("./Transaction");
const Comment = require("./Comment");

// Province - Destination (1..N)
Province.hasMany(Destination, { foreignKey: "provinceId", as: "destinations" });
Destination.belongsTo(Province, { foreignKey: "provinceId", as: "province" });

// Destination - Ticket (1..N)
Destination.hasMany(Ticket, { foreignKey: "destinationId", as: "tickets" });
Ticket.belongsTo(Destination, { foreignKey: "destinationId", as: "destination" });

// User - Transaction (1..N)
User.hasMany(Transaction, { foreignKey: "userId", as: "transactions" });
Transaction.belongsTo(User, { foreignKey: "userId", as: "user" });

// Ticket - Transaction (1..N)
Ticket.hasMany(Transaction, { foreignKey: "ticketId", as: "transactions" });
Transaction.belongsTo(Ticket, { foreignKey: "ticketId", as: "ticket" });

// User - Comment (1..N)
User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });

// Destination - Comment (1..N)
Destination.hasMany(Comment, { foreignKey: "destinationId", as: "comments" });
Comment.belongsTo(Destination, { foreignKey: "destinationId", as: "destination" });

module.exports = {
  sequelize,
  User,
  Province,
  Destination,
  Ticket,
  Transaction,
  Comment,
};
