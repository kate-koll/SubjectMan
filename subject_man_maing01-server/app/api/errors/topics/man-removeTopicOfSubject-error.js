const ManCrudError = require("../man-crud-use-case-error.js");

const removeTopicOfSubject = {
  UC_CODE: `${ManCrudError.ERROR_PREFIX}topic/remove/`,

  AuthError: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeTopicOfSubject.UC_CODE}AuthError`;
      this.message = "Unauthorized user.";
    }
  },

  InvalidDtoIn: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeTopicOfSubject.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  FindSubjectFailed: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeTopicOfSubject.UC_CODE}FindSubjectFailed`;
      this.message = "Subject you are trying to find does no exist.";
    }
  },

  FindTopicFailed: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeTopicOfSubject.UC_CODE}FindTopicFailed`;
      this.message = "Topic you are trying to find does no exist.";
    }
  },

  RemoveTopicFailed: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeTopicOfSubject.UC_CODE}RemoveTopicFailed`;
      this.message = "Remove topic operation failed.";
    }
  },
};

module.exports = { removeTopicOfSubject };
