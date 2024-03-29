const { decodeToken } = require("../helpers/jwt");
const { Customer } = require("../models/index");

const customerAuthentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;

    if (!access_token) {
      throw { name: "invalid-token" };
    }

    const dataToken = decodeToken(access_token);

    const dataCustomer = await Customer.findByPk(dataToken.id);

    if (!dataCustomer) {
      throw { name: "invalid-token" };
    }
    console.log(dataCustomer.id, "??????????");
    req.customer = dataCustomer;

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { customerAuthentication };
