"use strict";
const ManMainAbl = require("../../abl/man-main-abl.js");

class ManMainController {
  init(ucEnv) {
    return ManMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new ManMainController();
