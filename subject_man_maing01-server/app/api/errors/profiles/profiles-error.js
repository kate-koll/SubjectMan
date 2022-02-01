const ManCrudError = require("../man-crud-use-case-error.js");

const authorization = {
    UC_CODE: `${ManCrudError.ERROR_PREFIX}authorization`,

    UnauthorizedUser: class extends ManCrudError{
        constructor() {
            super(...arguments);
            this.code = `${addSubjectToProgram.UC_CODE}UnauthorizedUser`;
            this.message = "Unauthorized user for this use case.";
          }
    }
}

module.exports = { authorization }