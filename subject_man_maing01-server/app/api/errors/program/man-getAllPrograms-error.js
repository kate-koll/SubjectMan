const ManCrudError = require("../man-crud-use-case-error.js");

//ERRORS FOR getAllPrograms//
const getAllPrograms = {
  UC_CODE: `${ManCrudError.ERROR_PREFIX}program/get/all/`,

  ProgramDaoFindFailed: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${getAllPrograms.UC_CODE}ProgramDaoFindFailed`;
      this.message = "Finding program by Dao failed.";
    }
  },
};

module.exports = { getAllPrograms };
