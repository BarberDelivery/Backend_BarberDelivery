"use strict";
const { Model } = require("sequelize");
const { hash } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.hasMany(models.Transaction, { onDelete: "cascade", onUpdate: "cascade", hooks: true });
    }
  }
  Customer.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Username can't be null",
          },
          notEmpty: {
            msg: "Username can't be empty",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: {
          msg: "Email must be unique",
        },
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Email can't be null",
          },
          notEmpty: {
            msg: "Email can't be empty",
          },
          isEmail: {
            args: true,
            msg: "Your email not correct format",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Password can't be null",
          },
          notEmpty: {
            msg: "Password can't be empty",
          },
        },
      },
      isOnline: DataTypes.BOOLEAN,
      isStudent: DataTypes.BOOLEAN,
      lastCut: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Customer",
    }
  );
  Customer.beforeCreate((customer) => {
    customer.password = hash(customer.password);
  });
  return Customer;
};
