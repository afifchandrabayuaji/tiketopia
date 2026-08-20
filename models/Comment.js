const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Tabel tambahan di luar ERD awal — dibutuhkan untuk fitur komentar/ulasan
const Comment = sequelize.define(
  "Comment",
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
    destinationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "destination_id",
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      validate: { min: 1, max: 5 },
    },
  },
  {
    tableName: "comments",
    timestamps: true,
  }
);

module.exports = Comment;
