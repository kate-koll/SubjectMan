//VALIDATION IMPORT//
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
//DAO IMPORT//
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;

const path = require("path");

//ERRORS//
const Errors_getAllPrograms = require("../api/errors/program/man-getAllPrograms-error.js");
const Errors_createProgram = require("../api/errors/program/man-createProgram-error.js");
const Errors_getProgramById = require("../api/errors/program/man-getProgramById-error.js");
const Errors_addSubjectToProgram = require("../api/errors/program/man-addSubjectToProgram-error.js");
const Errors_removeSubjectFromProgram = require("../api/errors/program/man-removeSubjectFromProgram-error.js");

//SUBJECT ABL METHODS//
const ManSubjectAbl = require("./man-subject-abl.js");

const WARNINGS = {
  getAllPrograms: {
    createUnsupportedKeys: {
      code: `${Errors_getAllPrograms.getAllPrograms.UC_CODE}unsupportedKeys`,
    },
  },
  getProgramById: {
    createUnsupportedKeys: {
      code: `${Errors_getProgramById.getProgramById.UC_CODE}unsupportedKeys`,
    },
  },
  createProgram: {
    createUnsupportedKeys: {
      code: `${Errors_createProgram.createProgram.UC_CODE}unsupportedKeys`,
    },
  },
  addSubjectToProgram: {
    createUnsupportedKeys: {
      code: `${Errors_addSubjectToProgram.addSubjectToProgram.UC_CODE}unsupportedKeys`,
    },
  },
  removeSubjectFromProgram: {
    createUnsupportedKeys: {
      code: `${Errors_removeSubjectFromProgram.removeSubjectFromProgram.UC_CODE}unsupportedKeys`,
    },
  },
};

class ManProgramAbl {
  constructor() {
    this.validator = Validator.load();
    //COLLECTION REGISTRATION//
    this.dao1 = DaoFactory.getDao("subjects");
    this.dao2 = DaoFactory.getDao("programs");
  }
  ////////////////////////////////////////////////////////////////////////////////////
  //STUDY PROGRAMM ABL//
  async getAllPrograms(awid) {
    /////////////////////////////////////////////////////////////////////////////////
    //VALIDATION//
    let uuAppErrorMap = {};
    /////////////////////////////////////////////////////////////////////////////////
    //DB CALL//
    let dtoOut;
    try {
      //get all programs db call
      dtoOut = await this.dao2.getAll(awid);
      //remove empty subjectsOfPrgram arrays
      let setupObjArray = dtoOut.itemList.filter((el) => {
        if (el.subjectsOfProgram.length !== 0) {
          return el;
        }
      });
      //find subjects for filtered array
      async function setupObject(array) {
        //looping array of programs
        for (let j = 0; j < array.length; j++) {
          let resultOfLoop = [];
          //loopping array of subjects from actual program
          for (let i = 0; i < array[j].subjectsOfProgram.length; i++) {
            //array of ids for actual iteration
            let subjects = array[j].subjectsOfProgram;
            let dbCallResult = await ManSubjectAbl.getSubjectById(awid, { id: [subjects[i].id] });
            //asign mandatory prop
            dbCallResult.subjects[0].mandatory = subjects[i].mandatory;
            //push to result array of array
            resultOfLoop.push(dbCallResult.subjects[0]);
          }
          //asign subjects to correct array
          array[j].subjectsOfProgram = resultOfLoop;
        }
        return array;
      }
      await setupObject(setupObjArray);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors_getAllPrograms.getAllPrograms.ProgramDaoFindFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }
    /////////////////////////////////////////////////////////////////////////////////
    //OUTPUT//
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async getProgramById(awid, dtoIn) {
    /////////////////////////////////////////////////////////////////////////////////
    //VALIDATION OF DTOIN
    let validationResult = this.validator.validate("getProgramByIdDtoInType", dtoIn);

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getProgramById.createUnsupportedKeys.code,
      Errors_getProgramById.getProgramById.InvalidDtoIn
    );

    /////////////////////////////////////////////////////////////////////////////////
    //DB CALL//
    let dtoOut;
    try {
      //get program by ID
      dtoOut = await this.dao2.get(awid, dtoIn.id);
      //get array of subjectsOfProgram
      let IDs = dtoOut.subjectsOfProgram;
      //find all subjects from collection
      async function setupObject() {
        let result = [];
        //loop over array of subjectsOfProgram
        for (let i = 0; i < IDs.length; i++) {
          let dbCallResult = await ManSubjectAbl.getSubjectById(awid, { id: [IDs[i].id] });
          //assign mandatory prop
          dbCallResult.subjects[0].mandatory = IDs[i].mandatory;
          result.push(dbCallResult.subjects[0]);
        }
        return result;
      }
      dtoOut.subjectsOfProgram = await setupObject();
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors_getProgramById.getProgramById.ProgramDaoFindFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }
    /////////////////////////////////////////////////////////////////////////////////
    //OUTPUT//
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async createProgram(awid, dtoIn) {
    /////////////////////////////////////////////////////////////////////////////////
    //VALIDATION//
    let validationResult = this.validator.validate("createProgramDtoInType", dtoIn);

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createProgram.createUnsupportedKeys.code,
      Errors_createProgram.createProgram.InvalidDtoIn
    );

    let program;
    if (dtoIn.subjectsOfProgram.length > 0) {
      program = {
        awid: awid,
        name: dtoIn.name,
        organisation: dtoIn.organisation,
        description: dtoIn.description,
        subjectsOfProgram: dtoIn.subjectsOfProgram,
      };
    } else {
      program = {
        awid: awid,
        name: dtoIn.name,
        organisation: dtoIn.organisation,
        description: dtoIn.description,
        subjectsOfProgram: [],
      };
    }

    //DUPLICITE VALUES CHECK
    try {
      let dbValues = await this.dao2.returnParams(awid, { name: 1, description: 1 });
      dbValues.itemList.forEach((el) => {
        if (el.name === program.name || el.description === program.description) {
          throw new Errors_createProgram.createProgram.DuplicitValues({ uuAppErrorMap });
        }
      });
    } catch (e) {
      throw e;
    }

    //MANDATORY VALUES CHECK
    try {
      let subjectsOfProgram = dtoIn.subjectsOfProgram;
      subjectsOfProgram.forEach((subject) => {
        let mandatory = subject.mandatory;
        if (mandatory === "selective" || mandatory === "obligatory" || mandatory === "obligatory-selective") {
          throw new Errors_createProgram.createProgram.WrongMandatoryValues({ uuAppErrorMap });
        }
      });
    } catch (e) {
      throw e;
    }

    //SUBJECTS EXISTENCE CHECK
    if (dtoIn.subjectsOfProgram.length > 0) {
      try {
        let subjectsOfProgram = dtoIn.subjectsOfProgram;
        let allSubjectsArray = await this.dao1.returnParams(awid, { id: 1 });
        allSubjectsArray = allSubjectsArray.itemList.map((subject) => {
          return subject.id.toString();
        });

        for (let i = 0; i < subjectsOfProgram.length; i++) {
          let id = subjectsOfProgram[i].id.toString();
          let includes = allSubjectsArray.includes(id);
          if (includes === false) {
            throw new Errors_createProgram.createProgram.SubjectDoesntExistsInCollection({ uuAppErrorMap });
          }
        }
      } catch (e) {
        throw e;
      }
    }
    /////////////////////////////////////////////////////////////////////////////////
    //DB CALL
    let dtoOut;
    try {
      dtoOut = await this.dao2.create(program);
      let subjectsOfProgram = dtoOut.subjectsOfProgram;

      async function setupObjects() {
        let result = [];
        for (let i = 0; i < subjectsOfProgram.length; i++) {
          let id = subjectsOfProgram[i].id;
          let dbCall = await ManSubjectAbl.getSubjectById(awid, { id: [id] });
          dbCall.subjects[0].mandatory = subjectsOfProgram[i].mandatory;
          result.push(dbCall.subjects[0]);
        }
        dtoOut.subjectsOfProgram = result;
      }
      await setupObjects();
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors_createProgram.createProgram.ProgramDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }
    /////////////////////////////////////////////////////////////////////////////////
    //OUTPUT//
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async addSubjectToProgram(awid, dtoIn) {
    /////////////////////////////////////////////////////////////////////////////////
    //VALIDATION OF DTOIN
    let validationResult = this.validator.validate("addSubjectToProgramDtoInType", dtoIn);

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.addSubjectToProgram.createUnsupportedKeys.code,
      Errors_addSubjectToProgram.addSubjectToProgram.InvalidDtoIn
    );

    let subjectsAddArray = dtoIn.subjects;
    let programId = dtoIn.idOfProgram;
    let program;
    let dtoOut;

    //VALIDATE MANDATORY VALUES
    try {
      subjectsAddArray.forEach((obj) => {
        if (obj.mandatory !== "selective" || obj.mandatory !== "obligatory" || obj.mandatory !== "obligatory-selective") {
          new Errors_addSubjectToProgram.addSubjectToProgram.MandatoryWrongValues({ uuAppErrorMap });
        }
      });
    } catch (e) {
      throw e;
    }
    /////////////////////////////////////////////////////////////////////////////////
    //DB - GET PROGRAM
    try {
      program = await this.dao2.get(awid, programId);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors_addSubjectToProgram.addSubjectToProgram.ProgramGetByIdFailed({ uuAppErrorMap });
      }
      throw e;
    }
    //DB - UPDATE PROGRAM
    try {
      try {
        //DUPLICATION VALUES CHECK (snažíš se přidat subject který je již k programu přidán)
        for (let i = 0; i < program.subjectsOfProgram.length; i++) {
          for (let j = 0; j < subjectsAddArray.length; j++) {
            if (program.subjectsOfProgram[i].id === subjectsAddArray[j].id) {
              throw new Errors_addSubjectToProgram.addSubjectToProgram.DuplicationValues({ uuAppErrorMap });
            }
          }
        }
        //DUPLICATIONS IN DTOIN ARRAY CHECK (dtoIn má duplicitní hodnoty)
        let dtoInDuplication = subjectsAddArray;
        subjectsAddArray.forEach((obj) => {
          let result = dtoInDuplication.filter((el) => {
            if (el.id == obj.id) {
              return el;
            }
          });
          if (result.length > 1) {
            throw new Errors_addSubjectToProgram.addSubjectToProgram.DtoInDuplicationValues({ uuAppErrorMap });
          }
        });
        //SUBJECT ID INTEGRITY CHECK (kontrola zda subject existuje v kolekci předmětů - dao1)
        let subjectsIds;
        subjectsIds = await this.dao1.returnParams(awid, { id: 1 });

        subjectsAddArray.forEach((obj) => {
          let found = subjectsIds.itemList.find((el) => {
            if (el.id == obj.id) {
              return true;
            }
          });
          if (found === undefined) {
            throw new Errors_addSubjectToProgram.addSubjectToProgram.SubjectDoesnExists({ uuAppErrorMap });
          }
        });
      } catch (e) {
        throw e;
      }

      //ACTUALISATION OF SUBJECTS ARRAY
      await subjectsAddArray.forEach((obj) => {
        program.subjectsOfProgram.push({ id: obj.id, mandatory: obj.mandatory });
      });
      //DB CALL
      dtoOut = await this.dao2.update(program);

      
      //RETURN PROGRAM WITH LOADED SUBJECTS
      async function setupObjects() {
        let result = [];
        for (let i = 0; i < dtoOut.subjectsOfProgram.length; i++) {
          let id = dtoOut.subjectsOfProgram[i].id;
          let dbCall = await ManSubjectAbl.getSubjectById(awid, { id: [id] });
          dbCall.subjects[0].mandatory = dtoOut.subjectsOfProgram[i].mandatory;
          result.push(dbCall.subjects[0]);
        }
        dtoOut.subjectsOfProgram = result;
      }
      await setupObjects();
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors_addSubjectToProgram.addSubjectToProgram.ProgramDaoAddFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }
    /////////////////////////////////////////////////////////////////////////////////
    //OUTPUT//
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async removeSubjectFromProgram(awid, dtoIn) {
    /////////////////////////////////////////////////////////////////////////////////
    //VALIDATION OF DTOIN
    let validationResult = this.validator.validate("removeSubjectFromProgramDtoInType", dtoIn);

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.removeSubjectFromProgram.createUnsupportedKeys.code,
      Errors_removeSubjectFromProgram.removeSubjectFromProgram.InvalidDtoIn
    );
    //VALIDATE EXISTENCE OF PROGRAM
    try {
      let programIds = await this.dao2.returnParams(awid, { id: 1 });
      programIds = programIds.itemList.map((el) => {
        return el.id.toString();
      });
      let result = programIds.includes(dtoIn.idOfProgram.toString());
      if (result !== true) {
        throw new Errors_removeSubjectFromProgram.removeSubjectFromProgram.InvalidIdOfProgram({ uuAppErrorMap });
      }
    } catch (e) {
      throw e;
    }

    //VALIDATE EXISTENCE OF SUBJECT IDs
    try {
      let subjectsIDs = await this.dao1.returnParams(awid, { id: 1 });
      subjectsIDs = subjectsIDs.itemList.map((el) => {
        return el.id.toString();
      });
      let wantToRemove = dtoIn.subjectsOfProgramIds;
      wantToRemove.forEach((removeId, i) => {
        let result = subjectsIDs.includes(removeId.toString());
        if (result === false) {
          throw new Errors_removeSubjectFromProgram.removeSubjectFromProgram.InvalidIdsOfSubjects({ uuAppErrorMap });
        }
      });
    } catch (e) {
      throw e;
    }

    //VALIDATE EXISTENCE OF SUBJECTS IN SEARCHED PROGRAM
    try {
      let program = await this.dao2.get(awid, dtoIn.idOfProgram)
      let programSubjectsIds = program.subjectsOfProgram.map((el)=>{return el.id})
      let wantToRemove = dtoIn.subjectsOfProgramIds;

      wantToRemove.forEach((id)=>{
        let result = programSubjectsIds.includes(id)
        if(result === false){
          throw new Errors_removeSubjectFromProgram.removeSubjectFromProgram.SubjectDoesnExistInProgram({ uuAppErrorMap });
        }
      })
    } catch(e) {
      throw e
    }

    /////////////////////////////////////////////////////////////////////////////////
    //DB CALL//
    let wantToRemove = dtoIn.subjectsOfProgramIds;
    let newObject;
    let dtoOut;
    try {
      //get program
      newObject = await this.dao2.get(awid, dtoIn.idOfProgram);
      //get subjectsOfProgram
      let idsOfProgram = newObject.subjectsOfProgram;
      let arrayOfNewSubjects = [];
      //filter subjects I want to remove
      idsOfProgram.forEach((el)=>{
        for(let i = 0; i < wantToRemove.length; i++){
          if(wantToRemove[i].toString() !== el.id.toString()){
            arrayOfNewSubjects.push(el)
          }
        }
      })
      //final object setup
      newObject.subjectsOfProgram = arrayOfNewSubjects;
      //db call
      dtoOut = await this.dao2.update(newObject)

    } catch(e) {
      if(e instanceof ObjectStoreError){
        throw new Errors_removeSubjectFromProgram.removeSubjectFromProgram.RemoveSubjectDaoFailed({ uuAppErrorMap }, e);
      }
      throw e
    }
    /////////////////////////////////////////////////////////////////////////////////
    //OUTPUT//
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
  ////////////////////////////////////////////////////////////////////////////////////
}

module.exports = new ManProgramAbl();
