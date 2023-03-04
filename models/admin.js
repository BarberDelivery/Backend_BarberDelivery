"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Admin.init(
    {
      username: {
        type: DataTypes.STRING,
        unique: {
          msg: "username must be unique",
        },
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
    },
    {
      sequelize,
      modelName: "Admin",
    }
  );
  return Admin;
};
