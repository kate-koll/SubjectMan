const ManCrudError = require("../man-crud-use-case-error.js");

const addMaterialOfTopic = {
  UC_CODE: `${ManCrudError.ERROR_PREFIX}material/add/`,

  AuthError: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${addMaterialOfTopic.UC_CODE}AuthError`;
      this.message = "Unauthorized user.";
    }
  },

  InvalidDtoIn: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${addMaterialOfTopic.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  OnlyOneKey: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${addMaterialOfTopic.UC_CODE}OnlyOneKey`;
      this.message = "You can add binary file or url/text not both.";
    }
  },
  BinaryOrUrldNotDefined: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${addMaterialOfTopic.UC_CODE}BinaryOrUrldNotDefined`;
      this.message = "Wrong DtoIn.";
    }
  },

  URLValidationError: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${addMaterialOfTopic.UC_CODE}URLValidationError`;
      this.message = "Somethin is wrong in URL validation.";
    }
  },

  BinaryValidationError: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${addMaterialOfTopic.UC_CODE}BinaryValidationError`;
      this.message = "Somethin is wrong in Binary validation.";
    }
  },

  TopicDoesntExist: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${addMaterialOfTopic.UC_CODE}TopicDoesntExist`;
      this.message = "Topic does not exist on this subject, or your id of topic is wrong.";
    }
  },
};

module.exports = { addMaterialOfTopic };
