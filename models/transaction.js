"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.Customer, { onDelete: "cascade", onUpdate: "cascade" });
      Transaction.belongsTo(models.Barber, { onDelete: "cascade", onUpdate: "cascade" });
      Transaction.hasMany(models.ServicesTransantion, { onDelete: "cascade", onUpdate: "cascade", hooks: true });
    }
  }
  Transaction.init(
    {
      CustomerId: DataTypes.INTEGER,
      BarberId: DataTypes.INTEGER,
      status: DataTypes.STRING,
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
      duration: DataTypes.INTEGER,
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
