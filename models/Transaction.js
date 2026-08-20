const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "ticket_id",
    },
    orderDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "order_date",
    },
    // --- Kolom tambahan di luar ERD awal, dibutuhkan form pembelian ---
    quantityAdult: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "quantity_adult",
    },
    quantityChild: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "quantity_child",
    },
    totalAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "total_amount",
    },
    status: {
      type: DataTypes.ENUM("pending", "paid", "cancelled"),
      allowNull: false,
      defaultValue: "paid", // simulasi: langsung paid karena potong saldo
    },
  },
  {
    tableName: "transactions",
    timestamps: true,
  }
);

module.exports = Transaction;
