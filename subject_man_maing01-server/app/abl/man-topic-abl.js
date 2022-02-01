//VALIDATION IMPORT//
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
//DAO IMPORT//
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;

const path = require("path");

//SUBJECT ABL METHODS//
const ManSubjectAbl = require("./man-subject-abl.js");
//CUSTOM FUNCTIONS//
function getId() {
  let result = Date.now() * Math.random();
  result = result.toString();
  return result;
}
const {throwAuthError} = require("../api/controllers/profiles.js")
//ERRORS//
const Errors_createTopicOfSubject = require("../api/errors/topics/man-createTopicOfSubject-error.js");
const Errors_updateTopicOfSubject = require("../api/errors/topics/man-updateTopicOfSubject-error.js");
const Errors_removeTopicOfSubject = require("../api/errors/topics/man-removeTopicOfSubject-error.js");


const WARNINGS = {
  createTopicOfSubject: {
    createUnsupportedKeys: {
      code: `${Errors_createTopicOfSubject.createTopicOfSubject.UC_CODE}unsupportedKeys`,
    },
  },
  updateTopicOfSubject: {
    createUnsupportedKeys: {
      code: `${Errors_updateTopicOfSubject.updateTopicOfSubject.UC_CODE}unsupportedKeys`,
    },
  },
  removeTopicOfSubject: {
    createUnsupportedKeys: {
      code: `${Errors_removeTopicOfSubject.removeTopicOfSubject.UC_CODE}unsupportedKeys`,
    },
  },
};

class ManTopicAbl {
  constructor() {
    this.validator = Validator.load();
    //COLLECTION REGISTRATION//
    this.dao1 = DaoFactory.getDao("subjects");
  }

  async createTopicOfSubject(awid, dtoIn, role) {
    /////////////////////////////////////////////////////////////////////////////////
    //VALIDATION DTOIN//
    let validationResult = this.validator.validate("createTopicOfSubjectDtoInType");

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createTopicOfSubject.createUnsupportedKeys.code,
      Errors_createTopicOfSubject.createTopicOfSubject.InvalidDtoIn
    );
    /////////////////////////////////////////////////////////////////////////////////
    //AUTH//
    try{
      console.log("role:-------")
      console.log(role)
      let authResult = throwAuthError(role.profile,"Executives")
      console.log(authResult)
      if(authResult.authorized === false){
        throw new Errors_createTopicOfSubject.createTopicOfSubject.AuthError({uuAppErrorMap})
      }
    } catch(e){
      throw e
    }
    /////////////////////////////////////////////////////////////////////////////////
    let idOfSubject = dtoIn.idOfSubject;
    let nameOfTopic = dtoIn.nameOfTopic;
    let subject;
    let dtoOut;

    //FIND SUBJECT//
    try {
      subject = await this.dao1.get(awid, idOfSubject);
      if (subject == null) {
        throw new Errors_createTopicOfSubject.createTopicOfSubject.CantFindSubject({ uuAppErrorMap });
      }
    } catch (e) {
      throw e;
    }

    let studyTopicsOfSubject = subject.studyTopics;

    //UNIQUE NAME OF TOPIC//
    try {
      studyTopicsOfSubject.forEach((oldTopic) => {
        let nameOfOldTopic = oldTopic.nameOfTopic;
        nameOfTopic.forEach((newTopic) => {
          if (newTopic.toString() === nameOfOldTopic.toString()) {
            throw new Errors_createTopicOfSubject.createTopicOfSubject.DuplicitNameOfTopic({ uuAppErrorMap }, e);
          }
        });
      });
    } catch (e) {
      throw e;
    }
    //OBJECT CREATE//
    nameOfTopic.forEach((topic) => {
      return studyTopicsOfSubject.push({ id: getId(), nameOfTopic: topic, materials: [] });
    });
    subject.studyTopics = studyTopicsOfSubject;
    //UPDATE SUBJECT//
    try {
      dtoOut = await ManSubjectAbl.editSubject(
        awid,
        {
          id: subject.id,
          name: subject.name,
          credits: subject.credits,
          degree: subject.degree,
          supervisor: subject.supervisor,
          description: subject.description,
          studyTopics: subject.studyTopics,
        },
        idOfSubject,
        role
      );
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors_createTopicOfSubject.createTopicOfSubject.SubjectDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }
    /////////////////////////////////////////////////////////////////////////////////
    //OUTPUT//
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async updateTopicOfSubject(awid, dtoIn, role) {
    /////////////////////////////////////////////////////////////////////////////////
    //VALIDATION//
    let validationResult = this.validator.validate("updateTopicOfSubjectType", dtoIn);

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateTopicOfSubject.createUnsupportedKeys.code,
      Errors_updateTopicOfSubject.updateTopicOfSubject.InvalidDtoIn
    );
    /////////////////////////////////////////////////////////////////////////////////
    //AUTH//
    try{
      let authResult = throwAuthError(role.profile,"Executives")
      if(authResult.authorized === false){
        throw new Errors_updateTopicOfSubject.updateTopicOfSubject.AuthError({uuAppErrorMap})
      }
    } catch(e){
      throw e
    }
    /////////////////////////////////////////////////////////////////////////////////
    //FIND SUBJECT//
    let idOfSubject = dtoIn.idOfSubject;
    let idOfTopicToUpdate = dtoIn.idOfTopicToUpdate;
    let subject;
    let dtoOut;

    try {
      subject = await ManSubjectAbl.getSubjectById(awid, { id: [idOfSubject] });
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors_updateTopicOfSubject.updateTopicOfSubject.CantFindSubject({ uuAppErrorMap }, e);
      }
      throw e;
    }

    subject = subject.subjects[0];
    subject.studyTopics.forEach((topic) => {
      if (topic.id.toString() === idOfTopicToUpdate.toString()) {
        return (topic.nameOfTopic = dtoIn.nameOfTopic);
      }
    });
    /////////////////////////////////////////////////////////////////////////////////
    //DB CALL//
    let newSubject = {
      id: subject.id,
      name: subject.name,
      credits: subject.credits,
      degree: subject.degree,
      supervisor: subject.supervisor,
      description: subject.description,
      studyTopics: subject.studyTopics,
    };

    try {
      dtoOut = await ManSubjectAbl.editSubject(awid, newSubject, newSubject.id, role);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors_updateTopicOfSubject.updateTopicOfSubject.SubjectUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }
    /////////////////////////////////////////////////////////////////////////////////
    //OUTPUT//
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async removeTopicOfSubject(awid, dtoIn, role) {
    /////////////////////////////////////////////////////////////////////////////////
    //VALIDATION//
    let validationResult = this.validator.validate("removeTopicOfSubjectType", dtoIn);

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.removeTopicOfSubject.createUnsupportedKeys.code,
      Errors_removeTopicOfSubject.removeTopicOfSubject.InvalidDtoIn
    );
    /////////////////////////////////////////////////////////////////////////////////
    //AUTH//
    try{
      let authResult = throwAuthError(role.profile,"Executives")
      if(authResult.authorized === false){
        throw new Errors_removeTopicOfSubject.removeTopicOfSubject.AuthError({uuAppErrorMap})
      }
    } catch(e){
      throw e
    }
    /////////////////////////////////////////////////////////////////////////////////
    //FIND SUBJECT//
    let idOfSubject = dtoIn.idOfSubject;
    let idOfTopic = dtoIn.idOfTopic;
    let subject;
    let topics;
    try {
      subject = await ManSubjectAbl.getSubjectById(awid, { id: [idOfSubject] });
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors_removeTopicOfSubject.removeTopicOfSubject.FindSubjectFailed({ uuAppErrorMap }, e);
      }
    }

    topics = subject.subjects[0].studyTopics;
    let updatedTopics = [];

    //REMOVE TOPIC//
    try {
      topics.forEach((topic) => {
        if (topic.id !== idOfTopic) {
          updatedTopics.push(topic);
        }
      });

      if (updatedTopics.length === topics.length) {
        throw new Errors_removeTopicOfSubject.removeTopicOfSubject.FindTopicFailed({ uuAppErrorMap });
      }
    } catch (e) {
      throw e;
    }
    subject = subject.subjects[0];
    subject.studyTopics = updatedTopics;

    //UPDATE OBJ IN DB//
    let dtoOut;
    try {
      dtoOut = await ManSubjectAbl.editSubject(
        awid,
        {
          id: subject.id,
          name: subject.name,
          credits: subject.credits,
          degree: subject.degree,
          supervisor: subject.supervisor,
          description: subject.description,
          studyTopics: subject.studyTopics,
        },
        idOfSubject,
        role
      );
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors_removeTopicOfSubject.removeTopicOfSubject.RemoveTopicFailed({ uuAppErrorMap }, e);
      }
    }
    /////////////////////////////////////////////////////////////////////////////////
    //OUTPUT//
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new ManTopicAbl();
