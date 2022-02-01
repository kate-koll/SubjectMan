const ManCrudError = require("../man-crud-use-case-error.js");

const createTopicOfSubject = {
  UC_CODE: `${ManCrudError.ERROR_PREFIX}topic/create/`,

  AuthError: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${createTopicOfSubject.UC_CODE}AuthError`;
      this.message = "Unauthorized user.";
    }
  },

  InvalidDtoIn: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${createTopicOfSubject.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  CantFindSubject: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${createTopicOfSubject.UC_CODE}CantFindSubject`;
      this.message = "Subject you are trying to open up does not exist.";
    }
  },

  DuplicitNameOfTopic: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${createTopicOfSubject.UC_CODE}DuplicitNameOfTopic`;
      this.message = "Topic already exists or there is topic with same name.";
    }
  },
  SubjectDaoCreateFailed: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${createTopicOfSubject.UC_CODE}TopicDaoCreateFailed`;
      this.message = "Creating of Topic by Dao failed.";
    }
  },
};

module.exports = { createTopicOfSubject };
