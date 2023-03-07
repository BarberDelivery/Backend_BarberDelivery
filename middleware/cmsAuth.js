const { decodeToken } = require("../helpers/jwt");
const Admin = require("../modelsMongo/adminModel");

const cmsAuthentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;

    if (!access_token) {
      throw { name: "invalid-token" };
    }

    const dataToken = decodeToken(access_token);

    console.log(dataToken.id, ">>>>>>>>>>>>");
    const dataAdmin = await Admin.getByAdminId(dataToken.id);

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
