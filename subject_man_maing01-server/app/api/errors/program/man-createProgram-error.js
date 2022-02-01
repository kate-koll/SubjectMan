const ManCrudError = require("../man-crud-use-case-error.js");

//ERRORS FOR createProgram//
const createProgram = {
  UC_CODE: `${ManCrudError.ERROR_PREFIX}program/create/`,

  InvalidDtoIn: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${createProgram.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  DuplicitValues: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${createProgram.UC_CODE}DuplicitValues`;
      this.message = "Values of key 'name' or 'description' are duplicit with one of objects in database.";
    }
  },

  SubjectDoesntExistsInCollection: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${createProgram.UC_CODE}SubjectDoesntExistsInCollection`;
      this.message = "One of subjects in your program does not exist in collection of subjects.";
    }
  },

  WrongMandatoryValues: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${createProgram.UC_CODE}WrongMandatoryValues`;
      this.message = "Prop 'mandatory' can have only 'selective','obligatory','obligatory-selective' values";
    }
  },

  ProgramDaoCreateFailed: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${createProgram.UC_CODE}ProgramDaoCreateFailed`;
      this.message = "Creating program by Dao failed.";
    }
  },
};

module.exports = { createProgram };
