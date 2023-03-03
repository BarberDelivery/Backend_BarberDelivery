"use strict";
const { Model } = require("sequelize");
const { hash } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class Barber extends Model {
    static associate(models) {
      Barber.hasMany(models.Transaction, { onDelete: "cascade", onUpdate: "cascade", hooks: true });
      Barber.hasMany(models.Schedule, { onDelete: "cascade", onUpdate: "cascade", hooks: true });
    }
  }
  Barber.init(
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
      activityStatus: DataTypes.STRING,
      yearOfExperience: DataTypes.INTEGER,
      rating: DataTypes.FLOAT,
      price: DataTypes.BIGINT,
      description: DataTypes.TEXT,
      longLatBarber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Barber",
    }
  );
  Barber.beforeCreate((barber) => {
    barber.password = hash(barber.password);
  });
  return Barber;
};
