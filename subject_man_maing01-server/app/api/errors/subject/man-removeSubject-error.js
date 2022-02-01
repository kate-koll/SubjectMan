const ManCrudError = require("../man-crud-use-case-error.js");

//ERRORS FOR createSubject//
const removeSubject = {
  UC_CODE: `${ManCrudError.ERROR_PREFIX}subject/remove/`,

  AuthError: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeSubject.UC_CODE}AuthError`;
      this.message = "Unauthorized user.";
    }
  },

  InvalidDtoIn: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeSubject.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  SubjectDaoRemoveFailed: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeSubject.UC_CODE}SubjectDaoRemoveFailed`;
      this.message = "Removing of subject by Dao failed.";
    }
  },
};

module.exports = { removeSubject };
