"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      Chat.belongsTo(models.Customer, { onDelete: "cascade", onUpdate: "cascade" });
      Chat.belongsTo(models.Barber, { onDelete: "cascade", onUpdate: "cascade" });
    }
  }
  Chat.init(
    {
      CustomerId: DataTypes.INTEGER,
      BarberId: DataTypes.INTEGER,
      message: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Chat",
    }
  );
  return Chat;
};
