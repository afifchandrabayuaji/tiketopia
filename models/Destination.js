const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Destination = sequelize.define(
  "Destination",
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    provinceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "province_id",
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // --- Kolom tambahan di luar ERD awal, dibutuhkan oleh fitur CREATE/READ ---
    location: {
      type: DataTypes.STRING, // contoh: "Ciwidey, Bandung, Jawa Barat"
      allowNull: true,
    },
    altitude: {
      type: DataTypes.INTEGER, // dalam mdpl
      allowNull: true,
    },
    openHours: {
      type: DataTypes.STRING, // contoh: "07.00 - 17.00 WIB"
      allowNull: true,
    },
    history: {
      type: DataTypes.TEXT, // narasi sejarah
      allowNull: true,
    },
    flora: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    fauna: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: [],
    },
    uniqueFacts: {
      type: DataTypes.TEXT, // fakta unik, boleh multi-paragraf / pisah baris baru
      allowNull: true,
      field: "unique_facts",
    },
  },
  {
    tableName: "destinations",
    timestamps: true,
  }
);

module.exports = Destination;
