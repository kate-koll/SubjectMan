"use strict";
const { UuBinaryDao } = require("uu_appg01_binarystore");

class BinariesMongo extends UuBinaryDao {
  async createSchema() {
    await super.createIndex({ awid: 1 }, { unique: true });
    await super.createIndex({ awid: 1, code: 1 }, { unique: true });
  }

  async create(uuBinary, data) {
    return await super.insertFromStream(uuBinary, data);
  }

  async deleteByCode(awid, code) {
    return await super.deleteOne({ awid, code });
  }

  async getDataByCode(awid, code) {
    return await super.openDownloadStream({
      awid: awid,
      code: code,
    });
  }
}

module.exports = BinariesMongo;
