const ManCrudError = require("../man-crud-use-case-error.js");

//ERRORS FOR getProgramById//
const getProgramById = {
  UC_CODE: `${ManCrudError.ERROR_PREFIX}program/get/`,

  InvalidDtoIn: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${getProgramById.UC_CODE}ProgramDaoFindFailed`;
      this.message = "Finding program by Dao failed.";
    }
  },

  ProgramDaoFindFailed: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${getProgramById.UC_CODE}ProgramDaoFindFailed`;
      this.message = "Finding program by Dao failed.";
    }
  },
};

module.exports = { getProgramById };
