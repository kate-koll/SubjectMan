const ManCrudError = require("../man-crud-use-case-error.js");

//ERRORS FOR getSubjectById//
const getSubjectById = {
  UC_CODE: `${ManCrudError.ERROR_PREFIX}subject/get/`,

  InvalidDtoIn: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${getSubjectById.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  SubjectDaoFindFailed: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${getSubjectById.UC_CODE}SubjectDaoFindFailed`;
      this.message = "Finding of subject by Dao failed.";
    }
  },

  DuplicationValuesDtoIn: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${getSubjectById.UC_CODE}DuplicationValuesDtoIn`;
      this.message = "Duplication values in DtoIn.";
    }
  }
};

module.exports = { getSubjectById };
