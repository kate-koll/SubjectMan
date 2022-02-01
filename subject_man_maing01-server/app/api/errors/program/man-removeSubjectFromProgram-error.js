const ManCrudError = require("../man-crud-use-case-error.js");

//ERRORS FOR addSubjectToProgram//
const removeSubjectFromProgram = {
  UC_CODE: `${ManCrudError.ERROR_PREFIX}program/remove/subject/`,

  InvalidDtoIn: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeSubjectFromProgram.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  
  InvalidIdOfProgram: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeSubjectFromProgram.UC_CODE}InvalidIdOfProgram`;
      this.message = "Id of program does not exist in collection of programs.";
    }
  },

  InvalidIdsOfSubjects: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeSubjectFromProgram.UC_CODE}InvalidIdsOfSubjects`;
      this.message = "You are trying remove subjects that does not exist in subjects collection.";
    }
  },

  SubjectDoesnExistInProgram: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeSubjectFromProgram.UC_CODE}SubjectDoesnExistInProgram`;
      this.message = "You are trying remove subjects that does not exist in program you are trying to find.";
    }
  },

  SubjectDoesnExist: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeSubjectFromProgram.UC_CODE}SubjectDoesnExist`;
      this.message = "Id of subject you want to remove does not exist in collection of subjects.";
    }
  },

  RemoveSubjectDaoFailed: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeSubjectFromProgram.UC_CODE}RemoveSubjectDaoFailed`;
      this.message = "Removing subject from program failed.";
    }
  }
};

module.exports = { removeSubjectFromProgram };
