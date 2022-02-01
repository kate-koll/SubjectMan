const ManCrudError = require("../man-crud-use-case-error.js");

//ERRORS FOR addSubjectToProgram//
const addSubjectToProgram = {
  UC_CODE: `${ManCrudError.ERROR_PREFIX}program/add/subject/`,

  InvalidDtoIn: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${addSubjectToProgram.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  ProgramGetByIdFailed: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${addSubjectToProgram.UC_CODE}ProgramGetByIdFailed`;
      this.message = "Get program by Dao failed.";
    }
  },
  ProgramDaoAddFailed: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${addSubjectToProgram.UC_CODE}ProgramDaoAddFailed`;
      this.message = "Adding subject to program by Dao failed.";
    }
  },
  DuplicationValues: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${addSubjectToProgram.UC_CODE}DuplicationValues`;
      this.message = "You are trying to add already assigned subject.";
    }
  },
  DtoInDuplicationValues: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${addSubjectToProgram.UC_CODE}DtoInDuplicationValues`;
      this.message = "Your DtoIn includes duplication values.";
    }
  },

  MandatoryWrongValues: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${addSubjectToProgram.UC_CODE}MandatoryWrongValues`;
      this.message = "Wron mandatory values.";
    }
  },

  SubjectDoesnExists: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${addSubjectToProgram.UC_CODE}SubjectDoesnExist`;
      this.message = "One of subjects,you are trying to add does not exists in subjects store.";
    }
  },
};

module.exports = { addSubjectToProgram };
