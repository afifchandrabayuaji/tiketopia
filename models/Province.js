const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Province = sequelize.define(
  "Province",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "provinces",
    timestamps: true,
  }
);

module.exports = Province;
