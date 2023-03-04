"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.Customer, { onDelete: "cascade", onUpdate: "cascade" });
      Transaction.belongsTo(models.Barber, { onDelete: "cascade", onUpdate: "cascade" });
      Transaction.hasMany(models.ServicesTransaction, { onDelete: "cascade", onUpdate: "cascade", hooks: true });
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
      },
      duration: DataTypes.INTEGER,
      date: DataTypes.DATE,
      longLatCustomer: DataTypes.STRING,
      tripPrice: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
