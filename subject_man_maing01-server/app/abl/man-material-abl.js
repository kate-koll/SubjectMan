//VALIDATION IMPORT//
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { BinaryStoreError } = require("uu_appg01_binarystore");

const path = require("path");

const ManSubjectAbl = require("../abl/man-subject-abl.js");


//DAO IMPORT//
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
//CUSTOM FUNCTIONS//
function getId() {
  let result = Date.now() * Math.random();
  result = result.toString();
  return result;
}
const {throwAuthError} = require("../api/controllers/profiles.js")
//ERRORS//
const Errors_addMaterialOfTopic = require("../api/errors/materials/man-addMaterialOfTopic-error.js");
const Errors_removeMaterialOfTopic = require("../api/errors/materials/man-removeMaterialOfTopic-error.js");

const WARNINGS = {
  addMaterialOfTopic: {
    createUnsupportedKeys: {
      code: `${Errors_addMaterialOfTopic.addMaterialOfTopic.UC_CODE}unsupportedKeys`,
    },
  },
  removeMaterialOfTopic: {
    createUnsupportedKeys: {
      code: `${Errors_removeMaterialOfTopic.removeMaterialOfTopic.UC_CODE}unsupportedKeys`,
    },
  },
};

class ManMaterialAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao1 = DaoFactory.getDao("subjects");
    this.dao2 = DaoFactory.getDao("binaries");
  }

  async addMaterialOfTopic(awid, dtoIn, role) {
    /////////////////////////////////////////////////////////////////////////////////
    //VALIDATION DTOIN//
    let validationResult = this.validator.validate("addMaterialDtoInType");

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.addMaterialOfTopic.createUnsupportedKeys.code,
      Errors_addMaterialOfTopic.addMaterialOfTopic.InvalidDtoIn
    );
     /////////////////////////////////////////////////////////////////////////////////
    //AUTH//
    try{
      console.log("role:-------")
      console.log(role)
      let authResult = throwAuthError(role.profile,"Executives")
      console.log(authResult)
      if(authResult.authorized === false){
        throw new Errors_addMaterialOfTopic.addMaterialOfTopic.AuthError({uuAppErrorMap})
      }
    } catch(e){
      throw e
    }
    /////////////////////////////////////////////////////////////////////////////////
    let dbObject;
    let dtoOut;
    //DEFINED BOTH??
    try {
      if (dtoIn.materialData !== undefined && dtoIn.materialUrl !== undefined) {
        throw new Errors_addMaterialOfTopic.addMaterialOfTopic.OnlyOneKey({ uuAppErrorMap });
      }
      if (dtoIn.materialData === undefined && dtoIn.materialUrl === undefined) {
        throw new Errors_addMaterialOfTopic.addMaterialOfTopic.BinaryOrUrldNotDefined({ uuAppErrorMap });
      }
    } catch (e) {
      throw e;
    }
    //URL??
    try {
      if (dtoIn.materialData === undefined && dtoIn.materialUrl !== undefined) {
        dtoOut = await insertURLMaterial(dtoIn);
      }
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors_addMaterialOfTopic.addMaterialOfTopic.URLValidationError({ uuAppErrorMap }, e);
      }
      throw e;
    }
    //BINARY??
    try {
      if (dtoIn.materialData !== undefined && dtoIn.materialUrl === undefined) {
        dtoOut = await insertBinaryMaterial(dtoIn, this.dao2);
      }
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors_addMaterialOfTopic.addMaterialOfTopic.BinaryValidationError({ uuAppErrorMap }, e);
      }
      throw e;
    }

    //DB functions
    async function insertURLMaterial(dtoIn) {
      //GET SUBJECT BY ID
      let subjectId = dtoIn.idOfSubject
      dbObject = await ManSubjectAbl.getSubjectById(awid,{id:[subjectId]})
      //INSERT MATERIAL
      let foundTopic
      try{
        dbObject.subjects[0].studyTopics.forEach((topic)=>{
          if(topic.id === dtoIn.idOfTopic){
            topic.materials.push({
              id: getId(),
              name: dtoIn.materialName,
              type: "URL",
              data: dtoIn.materialUrl
            })
            foundTopic = topic
          }
        })
      //ERROR HANDLE
      if(foundTopic === undefined){
        throw new Errors_addMaterialOfTopic.addMaterialOfTopic.TopicDoesntExist({ uuAppErrorMap })
      }
      }catch(e){
        throw e;
      } 
      //UPDATE SUBJECT
      let resultFromDb = await ManSubjectAbl.editSubject(awid,dbObject.subjects[0],subjectId, role)
      //RETURN OBJECT
      return resultFromDb;
    }
    
    //NOT WORKING
    async function insertBinaryMaterial(dtoIn, dao2) {
        //GET SUBJECT BY ID
        let subjectId = dtoIn.idOfSubject
        dbObject =  await ManSubjectAbl.getSubjectById(awid,{id:[subjectId]})
        let topicArray = dbObject.subjects[0].studyTopics
        //INSERT MATERIAL
        let foundTopic = undefined
        let addToBinary

        //ERROR HANDLE
        try {
          dbObject.subjects[0].studyTopics.forEach((topic)=>{
            if(topic.id === dtoIn.idOfTopic){
              foundTopic = topic
            }
          })
          if(foundTopic === undefined){
            throw new Errors_addMaterialOfTopic.addMaterialOfTopic.TopicDoesntExist({ uuAppErrorMap })
          }  
        } catch (e) {  
        } 
        let myPromise = new Promise((resolve,reject)=>{
          topicArray.forEach(async (topic)=>{
            if(topic.id === dtoIn.idOfTopic){
              //ADD TO BINARY DB
              addToBinary = await dao2.create({awid},dtoIn.materialData)
              
              await topic.materials.push({
                id: addToBinary.id,
                name: dtoIn.materialName,
                type: "BINARY",
                data: addToBinary.code
              })
            }
          })
          resolve(topicArray)
        }).then((value)=>{
          dbObject.studyTopics = value
          return dbObject
        }).then((value)=>{
          let resultFromDb = ManSubjectAbl.editSubject(awid,value.subjects[0],subjectId, role)
          return resultFromDb
        })

        let test = myPromise
        return test
        
        //UPDATE SUBJECT
      // let resultFromDb = await ManSubjectAbl.editSubject(awid,dbObject.subjects[0],subjectId)
        //RETURN OBJECT
        //return dbObject;
    }
    /////////////////////////////////////////////////////////////////////////////////
    //OUTPUT
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
  async removeMaterialOfTopic(awid, dtoIn, role) {
    /////////////////////////////////////////////////////////////////////////////////
    //VALIDATION//
    let validationResult = this.validator.validate("removeMaterialDtoInType", dtoIn);

    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.removeMaterialOfTopic.createUnsupportedKeys.code,
      Errors_removeMaterialOfTopic.removeMaterialOfTopic.InvalidDtoIn
    );
     /////////////////////////////////////////////////////////////////////////////////
    //AUTH//
    try{
      let authResult = throwAuthError(role.profile,"Executives")
      if(authResult.authorized === false){
        throw new Errors_removeMaterialOfTopic.removeMaterialOfTopic.AuthError({uuAppErrorMap})
      }
    } catch(e){
      throw e
    }
    /////////////////////////////////////////////////////////////////////////////////
    //FIND SUBJECT
    let idOfSubject = dtoIn.idOfSubject
    let dbSubject
    try{
      dbSubject = await ManSubjectAbl.getSubjectById(awid,{id:[idOfSubject]})
      dbSubject=dbSubject.subjects[0]

    }catch(e){
      throw e
    }
    //FIND TOPIC
    let idOfTopic = dtoIn.idOfTopic
    let dbTopic = dbSubject.studyTopics
    let topicWeWant = undefined
    try{
      dbTopic.forEach((topic)=>{
        if(idOfTopic === topic.id){
          topicWeWant = topic
        }
      })

      if(topicWeWant === undefined){
        throw new Errors_removeMaterialOfTopic.removeMaterialOfTopic.WrongTopicID({uuAppErrorMap})
      }
    }catch(e){
      throw e
    }
    //FIND MATERIAL AND REMOVE
    let idOfMaterial = dtoIn.idOfMaterial
    let materialToDelete
    let newMaterialArray = []
    try{
      topicWeWant.materials.map((material)=>{
        if(material.id === idOfMaterial){
          materialToDelete = material

        } else {
          newMaterialArray.push(material)
        }
      })
      //ERROR HANDLE
      if(materialToDelete === undefined){
        throw new Errors_removeMaterialOfTopic.removeMaterialOfTopic.WrongMaterialID({uuAppErrorMap}) 
      }
    }catch(e){
      throw e
    }

    //OBJ CONSTRUCTION
    topicWeWant.materials = newMaterialArray
    let newStudyTopics = dbSubject.studyTopics.map((topic)=>{
      if(topic.id === topicWeWant.id){
        return topicWeWant
      } else {
        return topic
      }
    })
    dbSubject.studyTopics = newStudyTopics
    /////////////////////////////////////////////////////////////////////////////////
    //DB CALL//
    let dtoOut = await ManSubjectAbl.editSubject(awid,dbSubject,idOfSubject, role)
    /////////////////////////////////////////////////////////////////////////////////
    //OUTPUT//
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

}

module.exports = new ManMaterialAbl();
