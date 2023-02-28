"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.Customer, { onDelete: "cascade", onUpdate: "cascade" });
      Transaction.belongsTo(models.Barber, { onDelete: "cascade", onUpdate: "cascade" });
      Transaction.belongsTo(models.Item);
    }
  }
  Transaction.init(
    {
      CustomerId: DataTypes.INTEGER,
      BarberId: DataTypes.INTEGER,
      isPaid: DataTypes.BOOLEAN,
      cutRating: DataTypes.INTEGER,
      totalPrice: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Total Price of Product can't be null",
          },
          notEmpty: {
            msg: "Total Price of Product can't be empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
