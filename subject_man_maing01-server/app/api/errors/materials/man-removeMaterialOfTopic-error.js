const ManCrudError = require("../man-crud-use-case-error.js");

const removeMaterialOfTopic = {
  UC_CODE: `${ManCrudError.ERROR_PREFIX}material/remove/`,

  AuthError: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeMaterialOfTopic.UC_CODE}AuthError`;
      this.message = "Unauthorized user.";
    }
  },

  InvalidDtoIn: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeMaterialOfTopic.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  }, 

  WrongTopicID: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeMaterialOfTopic.UC_CODE}WrongTopicID`;
      this.message = "Id of topic you want to find does not exist.";
    }
  },

  WrongMaterialID: class extends ManCrudError {
    constructor() {
      super(...arguments);
      this.code = `${removeMaterialOfTopic.UC_CODE}WrongMaterialID`;
      this.message = "Id of material you want to find does not exist.";
    }
  },
};

module.exports = { removeMaterialOfTopic };
