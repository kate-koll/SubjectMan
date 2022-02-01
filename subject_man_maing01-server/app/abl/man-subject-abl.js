//VALIDATION IMPORT//
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
//DAO IMPORT//
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;

const path = require("path");

//ERRORS//
const Errors_getSubjectById = require("../api/errors/subject/man-getSubjectById-error.js");
const Errors_createSubject = require("../api/errors/subject/man-createSubject-error.js");
const Error_getAllSubjects = require("../api/errors/subject/man-getAllSubjects-error.js");
const Errors_editSubject = require("../api/errors/subject/man-editSubject-error.js");
const Errors_removeSubject = require("../api/errors/subject/man-removeSubject-error.js");


const {throwAuthError} = require("../api/controllers/profiles.js")

const WARNINGS = {
  getSubjectById: {
    createUnsupportedKeys: {
      code: `${Errors_getSubjectById.getSubjectById.UC_CODE}unsupportedKeys`,
    },
  },
  createSubject: {
    createUnsupportedKeys: {
      code: `${Errors_createSubject.createSubject.UC_CODE}unsupportedKeys`,
    },
  },
  editSubject: {
    createUnsupportedKeys: {
      code: `${Errors_editSubject.editSubject.UC_CODE}unsupportedKeys`,
    },
  },
  removeSubject: {
    createUnsupportedKeys: {
      code: `${Errors_removeSubject.removeSubject.UC_CODE}unsupportedKeys`,
    },
  },
};

//LOGGER//
const {AuditLog} = require("uu_appg01_auditlog");

class ManSubjectAbl {
  constructor() {
    this.validator = Validator.load();
    //COLLECTION REGISTRATION//
    this.dao1 = DaoFactory.getDao("subjects");
    this.dao2 = DaoFactory.getDao("programs");
  }

  ////////////////////////////////////////////////////////////////////////////////////
  //SUBJECT ABL//
  async getSubjectById(awid, dtoIn) {
    /////////////////////////////////////////////////////////////////////////////////
    //VALIDATION//
    let validationResult;
    validationResult = this.validator.validate("getSubjectByIdDtoInTypeArray", { id: dtoIn.id });

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getSubjectById.createUnsupportedKeys.code,
      Errors_getSubjectById.getSubjectById.InvalidDtoIn
    );

    //UNIQUE VALUES VALIDATION
    try {
      let uniqueIdResult = [];
      for (let i = 0; i < dtoIn.id.length; i++) {
        dtoIn.id.filter((id, index) => {
          if (dtoIn.id[i] === id && i !== index) {
            uniqueIdResult.push(id);
          }
        });
      }
      if (uniqueIdResult.length > 0) {
        throw new Errors_getSubjectById.getSubjectById.DuplicationValuesDtoIn({ uuAppErrorMap });
      }
    } catch (e) {
      throw e;
    }
    /////////////////////////////////////////////////////////////////////////////////
    //AUDIT LOG//
    await AuditLog.log("INFO", "GET_SUBJECT_BY_ID", "Get subject log", {name:"getSubjectById"})
    /////////////////////////////////////////////////////////////////////////////////
    //DB CALL - ARRAY//
    let dtoOut;
    dtoOut = { subjects: undefined, uuAppErrorMap: uuAppErrorMap };

    try {
      function getFromDB(id, dao) {
        return new Promise(async (resolve, reject) => {
          resolve(await dao.get(awid, id));
        });
      }

      async function returnValues(dao) {
        const result = async () => {
          let fnArray = [];
          for (let i = 0; i < dtoIn.id.length; i++) {
            fnArray.push(await getFromDB(dtoIn.id[i], dao));
          }
          return await fnArray;
        };
        return await result();
      }
      dtoOut.subjects = await returnValues(this.dao1);
      /////////////////////////////////////////////////////////////////////////////////
      //AUDIT LOG//
      await AuditLog.log("INFO", "GET_SUBJECT_BY_ID_DB_CALL", "Get subject database called", {subjects: dtoOut.subjects})
      /////////////////////////////////////////////////////////////////////////////////
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors_getSubjectById.getSubjectById.SubjectDaoFindFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }
    //OUTPUT
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async createSubject(awid, dtoIn, role) {
    /////////////////////////////////////////////////////////////////////////////////
    //VALIDATION//
    let validationResult = this.validator.validate("createSubjectDtoInType", dtoIn);

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createSubject.createUnsupportedKeys.code,
      Errors_createSubject.createSubject.InvalidDtoIn
    );
    /////////////////////////////////////////////////////////////////////////////////
    //AUTH//
    try{
      let authResult = throwAuthError(role.profile,"Authorities")
      if(authResult.authorized === false){
        throw new Errors_createSubject.createSubject.AuthError({uuAppErrorMap})
      }
    } catch(e){
      throw e
    }
    /////////////////////////////////////////////////////////////////////////////////
    //AUDIT LOG//
    await AuditLog.log("INFO", "CREATE_SUBJECT", "Create subject log", {name:dtoIn})
    /////////////////////////////////////////////////////////////////////////////////
    //UNIQUE SUBJECTS NAME VALIDATION
    try {
      let subjectsName = await this.dao1.returnParams(awid, { name: 1, description: 1 });
      subjectsName.itemList.forEach((el) => {
        if (el.name === dtoIn.name) {
          throw new Errors_createSubject.createSubject.DuplicitName({ uuAppErrorMap });
        }
        if (el.description === dtoIn.description) {
          throw new Errors_createSubject.createSubject.DuplicitDescriptions({ uuAppErrorMap });
        }
      });
    } catch (e) {
      throw e;
    }
    /////////////////////////////////////////////////////////////////////////////////
    //DB OBJECT CONSTRUCTION
    let subject = {
      awid: awid,
      name: dtoIn.name,
      credits: dtoIn.credits,
      degree: dtoIn.degree,
      supervisor: dtoIn.supervisor,
      description: dtoIn.description,
      studyTopics: [],
    };

    let dtoOut;
    //DB CALL//
    try {
      dtoOut = await this.dao1.create(subject);
      /////////////////////////////////////////////////////////////////////////////////
      //AUDIT LOG//
      await AuditLog.log("INFO", "CREATE_SUBJECT_DB_CALL", "Create subject log", {subject:dtoOut})
      /////////////////////////////////////////////////////////////////////////////////
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors_createSubject.createSubject.SubjectDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async getAllSubjects(awid) {
    let uuAppErrorMap = {};
    /////////////////////////////////////////////////////////////////////////////////
    //AUDIT LOG//
    await AuditLog.log("INFO", "GET_ALL_SUBJECTS", "Get all subjects log", {name:"getAllSubjects"})
    /////////////////////////////////////////////////////////////////////////////////
    //DB CALL
    let dtoOut;
    try {
      dtoOut = await this.dao1.getAll(awid);
      /////////////////////////////////////////////////////////////////////////////////
      //AUDIT LOG//
      await AuditLog.log("INFO", "GET_ALL_SUBJECTS", "Get all subjects log", {subjects:dtoOut})
      /////////////////////////////////////////////////////////////////////////////////
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Error_getAllSubjects.getAllSubjects.SubjectDaoFindFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async editSubject(awid, dtoIn, subjectId, role) {
    /////////////////////////////////////////////////////////////////////////////////
    //VALIDATION//
    let validationResult = this.validator.validate("editSubjectDtoInType", dtoIn);

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.editSubject.createUnsupportedKeys.code,
      Errors_editSubject.editSubject.InvalidDtoIn
    );
    /////////////////////////////////////////////////////////////////////////////////
    //AUTH//
    try{
      let authResult = throwAuthError(role.profile,"Executives")
      if(authResult.authorized === false){
        throw new Errors_editSubject.editSubject.AuthError({uuAppErrorMap})
      }
    } catch(e){
      throw e
    }
    /////////////////////////////////////////////////////////////////////////////////
    //AUDIT LOG//
    await AuditLog.log("INFO", "EDIT_SUBJECT", "Edit subject log", {name:dtoIn})
    /////////////////////////////////////////////////////////////////////////////////
    //FIND OLD SUBJECT BY ID
    let oldSubject;
    try {
      oldSubject = await this.dao1.get(awid, subjectId);
      /////////////////////////////////////////////////////////////////////////////////
      //AUDIT LOG//
      await AuditLog.log("INFO", "GET_OLD_SUBJECT", "Get old subject from DB", {oldSubject:oldSubject})
      /////////////////////////////////////////////////////////////////////////////////
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors_editSubject.editSubject.SubjectDaoFindFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    //UPDATE OBJECT
    let newSubject = oldSubject;
    newSubject.name = dtoIn.name ? dtoIn.name : newSubject.name;
    newSubject.credits = dtoIn.credits ? dtoIn.credits : newSubject.credits;
    newSubject.degree = dtoIn.degree ? dtoIn.degree : newSubject.degree;
    newSubject.supervisor = dtoIn.supervisor ? dtoIn.supervisor : newSubject.supervisor;
    newSubject.description = dtoIn.description ? dtoIn.description : newSubject.description;
    newSubject.studyTopics = dtoIn.studyTopics ? dtoIn.studyTopics : newSubject.studyTopics;

    let dtoOut;
    try {
      dtoOut = await this.dao1.update(newSubject);
      /////////////////////////////////////////////////////////////////////////////////
      //AUDIT LOG//
      await AuditLog.log("INFO", "UPDATE_SUBJECT", "Subject update DB call", {newSubject:dtoOut})
      /////////////////////////////////////////////////////////////////////////////////
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors_editSubject.editSubject.SubjectDaoEditFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }
    //OUTPUT
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async removeSubject(awid, dtoIn, role) {
    /////////////////////////////////////////////////////////////////////////////////
    //VALIDATION//
    let validationResult = this.validator.validate("removeSubjectDtoInType", dtoIn);

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.removeSubject.createUnsupportedKeys.code,
      Errors_removeSubject.removeSubject.InvalidDtoIn
    );
    /////////////////////////////////////////////////////////////////////////////////
    //AUTH//
    /*
    try{
      console.log("role:-------")
      console.log(role)
      let authResult = throwAuthError(role.profile,"Authorities")
      console.log(authResult)

      if(authResult.authorized === false){
        throw new Errors_removeSubject.removeSubject.AuthError({uuAppErrorMap})
      }
    } catch(e){
      throw e
    }*/
    /////////////////////////////////////////////////////////////////////////////////
    //AUDIT LOG//
    await AuditLog.log("INFO", "REMOVE_SUBJECT", "Remove subject log", {name:dtoIn})
    /////////////////////////////////////////////////////////////////////////////////
    //DB CALL
    let dtoOut;
    //remove from subjects collection
    try {
      dtoOut = await this.dao1.remove(awid, dtoIn.id);
      dtoOut = { deleted: true };
      /////////////////////////////////////////////////////////////////////////////////
      //AUDIT LOG//
      await AuditLog.log("INFO", "DELETE_SUBJECT_DB_CALL", "Delete subject call", {state: dtoOut})
      /////////////////////////////////////////////////////////////////////////////////
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors_removeSubject.removeSubject.SubjectDaoRemoveFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    //remove from program collection
    /////////////////////////////////////////////////////////////////////////////////
    //AUDIT LOG//
    await AuditLog.log("INFO", "REMOVE_SUBJECT_FROM_PROGRAM_DB", "Removing subject from program collection", {})
    /////////////////////////////////////////////////////////////////////////////////
    async function removeFromProgramCollection(dao2) {
      console.log("here");
      let allPrograms = await dao2.getAll(awid);
      allPrograms = allPrograms.itemList;

      allPrograms.forEach(async (program) => {
        let newProgram = program;
        let newSubjectsArray = [];
        let edited = false;

        program.subjectsOfProgram.forEach(async (subject) => {
          if (subject.id.toString() !== dtoIn.id.toString()) {
            newSubjectsArray.push(subject);
          } else {
            edited = true;
          }
        });

        if (edited === true) {
          newProgram.subjectsOfProgram = newSubjectsArray;
          await dao2.update(newProgram);
        }
      });
    }

    await removeFromProgramCollection(this.dao2);
    //OUTPUT
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new ManSubjectAbl();
