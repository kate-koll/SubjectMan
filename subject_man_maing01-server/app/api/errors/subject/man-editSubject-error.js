const ManCrudError = require("../man-crud-use-case-error.js");

//ERRORS FOR editSubject//
const editSubject = {
  UC_CODE: `${ManCrudError.ERROR_PREFIX}subject/edit/`,

  AuthError: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${editSubject.UC_CODE}AuthError`;
      this.message = "Unauthorized user.";
    }
  },

  InvalidDtoIn: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${editSubject.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  SubjectDaoEditFailed: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${editSubject.UC_CODE}SubjectDaoEditFailed`;
      this.message = "Editing of subject by Dao failed.";
    }
  },

  SubjectDaoFindFailed: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${editSubject.UC_CODE}SubjectDaoFindFailed`;
      this.message = "Finding of old subject by Dao failed.";
    }
  },
};

module.exports = { editSubject };
