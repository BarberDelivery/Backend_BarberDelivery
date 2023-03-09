const { ObjectId } = require("mongodb");
const { getDatabase } = require("../configMongodb/mongoConnection");
const { hash } = require("../helpers/bcrypt");

class Admin {
  static getCollections() {
    const db = getDatabase();
    const admins = db.collection("Admins");
    return admins;
  }

  static async addAdmin(admin) {
    try {
      if (!admin.email) {
        throw { name: "email-notNull", message: { message: "email is required" } };
      }
      if (!admin.password) {
        throw { name: "password-notNull", message: { message: "password is required" } };
      }

      return this.getCollections().insertOne({
        username: admin.username,
        email: admin.email,
        password: hash(admin.password),
      });
    } catch (err) {
      throw err;
    }
  }

  static async getByUsernameEmail(username, email) {
    return this.getCollections().findOne({
      username: username,
      email: email,
    });
  }

  static async getByAdminId(objectId) {
    return this.getCollections().findOne({
      _id: new ObjectId(objectId),
    });
  }
}

module.exports = Admin;
