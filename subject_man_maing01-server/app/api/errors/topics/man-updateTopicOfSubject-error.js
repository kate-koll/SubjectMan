const ManCrudError = require("../man-crud-use-case-error.js");

const updateTopicOfSubject = {
  UC_CODE: `${ManCrudError.ERROR_PREFIX}topic/update/`,

  AuthError: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${updateTopicOfSubject.UC_CODE}AuthError`;
      this.message = "Unauthorized user.";
    }
  },

  InvalidDtoIn: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${updateTopicOfSubject.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  CantFindSubject: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${updateTopicOfSubject.UC_CODE}CantFindSubject`;
      this.message = "Subject you are trying to find does not exist.";
    }
  },

  SubjectUpdateFailed: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${updateTopicOfSubject.UC_CODE}SubjectUpdateFailed`;
      this.message = "Subject you are trying to update failed.";
    }
  },
};

module.exports = { updateTopicOfSubject };
