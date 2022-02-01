"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class SubjectsMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1 }, { unique: true });
  }

  async create(subject) {
    return await super.insertOne(subject);
  }

  async get(awid, id) {
    let filter = {
      awid: awid,
      id: id,
    };
    return await super.findOne(filter);
  }

  async getAll(awid) {
    let filter = { awid: awid };
    return await super.find(filter);
  }

  async update(newObject) {
    let filter = {
      awid: newObject.awid,
      id: newObject.id,
    };
    return await super.findOneAndUpdate(filter, newObject, "NONE");
  }

  async remove(awid, id) {
    let filter = {
      awid: awid,
      id: id,
    };
    return await super.deleteOne(filter);
  }

  async returnParams(awid, params) {
    let filter = { awid: awid };
    return await super.find(filter, {}, {}, params);
  }
}

module.exports = SubjectsMongo;
