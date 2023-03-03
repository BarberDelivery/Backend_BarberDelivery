"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      Service.hasMany(models.ServicesTransaction);
    }
  }
  Service.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Name of Service can't be null",
          },
          notEmpty: {
            msg: "Name of Service can't be empty",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Price of Service can't be null",
          },
          notEmpty: {
            msg: "Price of Service can't be empty",
          },
        },
      },
      duration: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Service",
    }
  );
  return Service;
};
