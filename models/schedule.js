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
        timestamps: true,
      },
      timeEnd: {
        type: DataTypes.DATE,
        timestamps: true,
      },
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Schedule",
    }
  );
  return Schedule;
};
