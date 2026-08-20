const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Ticket = sequelize.define(
  "Ticket",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destinationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "destination_id",
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    validDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "valid_date",
    },
  },
  {
    tableName: "tickets",
    timestamps: true,
  }
);

module.exports = Ticket;
