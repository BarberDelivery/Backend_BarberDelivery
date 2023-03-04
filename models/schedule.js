"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule.belongsTo(models.Barber, { onDelete: "cascade", onUpdate: "cascade" });
    }
  }
  Schedule.init(
    {
      BarberId: DataTypes.INTEGER,
      timeStart: {
        type: DataTypes.DATE,
      },
      timeEnd: {
        type: DataTypes.DATE,
      },
      status: DataTypes.STRING,
      TransactionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Schedule",
    }
  );
  return Schedule;
};
