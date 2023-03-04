const { decodeToken } = require("../helpers/jwt");
const { Admin } = require("../models/index");

const cmsAuthentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;

    if (!access_token) {
      throw { name: "invalid-token" };
    }

    const dataToken = decodeToken(access_token);

    const dataAdmin = await Admin.findByPk(dataToken.id);

    if (!dataAdmin) {
      throw { name: "invalid-token" };
    }

    req.admin = dataAdmin;

    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { cmsAuthentication };
