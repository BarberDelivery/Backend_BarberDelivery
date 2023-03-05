const { ObjectId } = require("mongodb");
const { getDatabase } = require("../configMongodb/mongoConnection");

class Catalogue {
  static getCollections() {
    const db = getDatabase();
    const catalogues = db.collection("Catalogues");
    return catalogues;
  }

  static async getAllCatalogue() {
    return this.getCollections().find().toArray();
  }

  static async addCatalogue(catalogue) {
    try {
      if (!catalogue.image) {
        throw { name: "image-notNull", message: "image is required" };
      }

      return this.getCollections().insertOne({
        image: catalogue.image,
      });
    } catch (err) {
      throw err;
    }
  }

  static async deleteCatalogueById(objectId) {
    return this.getCollections().deleteOne({
      _id: new ObjectId(objectId),
    });
  }
}

module.exports = Catalogue;
