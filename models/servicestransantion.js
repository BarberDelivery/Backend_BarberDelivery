"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ServicesTransantion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Transaction, { onDelete: "cascade", onUpdate: "cascade" });
      Transaction.belongsTo(models.Service, { onDelete: "cascade", onUpdate: "cascade" });
    }
  }
  ServicesTransantion.init(
    {
      ServicesId: DataTypes.INTEGER,
      TransactionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ServicesTransantion",
    }
  );
  return ServicesTransantion;
};
