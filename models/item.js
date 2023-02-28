"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.hasMany(models.Transaction);
    }
  }
  Item.init(
    {
      TransactionId: DataTypes.INTEGER,
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Name of Product can't be null",
          },
          notEmpty: {
            msg: "Name of Product can't be empty",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Price of Product can't be null",
          },
          notEmpty: {
            msg: "Price of Product can't be empty",
          },
        },
      },
      isPaid: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Item",
    }
  );
  return Item;
};
