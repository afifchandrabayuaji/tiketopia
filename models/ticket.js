'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ticket.hasOne(models.Transaction, {
        foreignKey: "TicketId"
      })
      Ticket.belongsToMany(models.Destination, {
        foreignKey: "DestinationId"
      })
    }
  }
  Ticket.init({
    name: DataTypes.STRING,
    DestinationId: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    validDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};