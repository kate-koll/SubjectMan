const ManCrudError = require("../man-crud-use-case-error.js");

//ERRORS FOR createSubject//
const createSubject = {
  UC_CODE: `${ManCrudError.ERROR_PREFIX}subject/create/`,

  AuthError: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${createSubject.UC_CODE}AuthError`;
      this.message = "Unauthorized user.";
    }
  },

  InvalidDtoIn: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${createSubject.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  DuplicitName: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${createSubject.UC_CODE}DuplicitSubject`;
      this.message = "You are trying to add subject with name which is already assigned.";
    }
  },

  DuplicitDescriptions: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${createSubject.UC_CODE}DuplicitDescriptions`;
      this.message = "You are trying to add subject with description which is already assigned.";
    }
  },

  SubjectDaoCreateFailed: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${createSubject.UC_CODE}SubjectDaoCreateFailed`;
      this.message = "Creating of subject by Dao failed.";
    }
  },
};

module.exports = { createSubject };
