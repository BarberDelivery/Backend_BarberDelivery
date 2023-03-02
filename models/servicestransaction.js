"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ServicesTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ServicesTransaction.belongsTo(models.Transaction, { onDelete: "cascade", onUpdate: "cascade" });
      ServicesTransaction.belongsTo(models.Service, { onDelete: "cascade", onUpdate: "cascade" });
    }
  }
  ServicesTransaction.init(
    {
      ServiceId: DataTypes.INTEGER,
      TransactionId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ServicesTransaction",
    }
  );
  return ServicesTransaction;
};
