const ManCrudError = require("../man-crud-use-case-error.js");

//ERRORS FOR getAllSubjects//
const getAllSubjects = {
  UC_CODE: `${ManCrudError.ERROR_PREFIX}subject/get/all`,

  SubjectDaoFindFailed: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${getAllSubjects.UC_CODE}SubjectDaoFindFailed`;
      this.message = "Finding subjects by Dao failed.";
    }
  },
};

module.exports = { getAllSubjects };
