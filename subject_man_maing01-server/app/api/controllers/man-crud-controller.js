"use strict";
const ManSubjectAbl = require("../../abl/man-subject-abl.js");
const ManProgramAbl = require("../../abl/man-program-abl.js");
const ManTopicAbl = require("../../abl/man-topic-abl.js");
const ManMaterialAbl = require("../../abl/man-material-abl.js");

//////////////////////////////////////////////////////
const {resolveAuthority} = require("./profiles.js")
//////////////////////////////////////////////////////
class ManCrudController {
  /////////////////////////////////////////////////////
  //SUBJECT CONTROLLER//
  //DONE
  async getSubjectById(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    /*Na vstupu {id: string[]}*/
    let awid = ucEnv.getUri().getAwid();
    let result = await ManSubjectAbl.getSubjectById(awid, dtoIn);
    return result;
  }
  //DONE
  async createSubject(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    /*Na vstupu 
      {
        name:string,
        credits:string,
        degree:Bc|Mgr,
        supervisor:string,
        description:string,
      } 
    */
    let awid = ucEnv.getUri().getAwid()
  
    let result = await ManSubjectAbl.createSubject(awid, dtoIn, resolveAuthority(ucEnv));
    return result;
  }

  //DONE
  async getAllSubjects(ucEnv) {
    /*Na vstupu {}*/
    let awid = ucEnv.getUri().getAwid();
    let result = await ManSubjectAbl.getAllSubjects(awid);
    return result;
  }

  //DONE
  async editSubject(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    /*Na vstupu 
      {
        id: string,
        name:string,
        credits:string,
        degree:Bc|Mgr,
        supervisor:string,
        description:string,
      } 
    */
    let awid = ucEnv.getUri().getAwid();
    let subjectId = dtoIn.id;
    let result = await ManSubjectAbl.editSubject(awid, dtoIn, subjectId, resolveAuthority(ucEnv));
    return result;
  }
  //DONE
  async removeSubject(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    /*Na vstupu {id:string}*/
    let awid = ucEnv.getUri().getAwid();
    let result = await ManSubjectAbl.removeSubject(awid, dtoIn, resolveAuthority(ucEnv));
    return result;
  }
  /////////////////////////////////////////////////////
  //PROGRAM CONTROLLER//
  //DONE
  async getAllPrograms(ucEnv) {
    /*Na vstupu {awid:string}*/
    let awid = ucEnv.getUri().getAwid();
    let result = await ManProgramAbl.getAllPrograms(awid);
    return result;
  }
  //DONE
  async getProgramById(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    /*Na vstupu {id:string}*/
    let awid = ucEnv.getUri().getAwid();
    let result = await ManProgramAbl.getProgramById(awid, dtoIn);
    return result;
  }
  //DONE
  async createProgram(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    /* Na vstupu
      {
        name:string,
        organisation: string,
        description: string,
        subjectsOfProgram: [{id: string, mandatory: "obligatory" | "selective" | "obligatory-selective"}] 
        
        PS.: "subjectsOfProgram" není povinné - lze při založení jen založit array (subjectsOfProgram:[])
      }
    */
    let awid = ucEnv.getUri().getAwid();
    let result = await ManProgramAbl.createProgram(awid, dtoIn);
    return result;
  }
  //DONE
  async addSubjectToProgram(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    /*Na vstupu {idOfProgram: string, subjects: [{id: string, mandatory: string}]} */
    let awid = ucEnv.getUri().getAwid();
    let result = await ManProgramAbl.addSubjectToProgram(awid, dtoIn);
    return result;
  }
  //DONE
  async removeSubjectFromProgram(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    /*Na vstupu {idOfProgram: string, subjectsOfProgramIds:[string]}*/
    let awid = ucEnv.getUri().getAwid();
    let result = await ManProgramAbl.removeSubjectFromProgram(awid, dtoIn);
    return result;
  }
  /////////////////////////////////////////////////////
  //TOPIC//
  /*
  idea : subject => studyTopics
          [{
            id: mongoID
            nameOfTopic: string,
            materials: [
                        { 
                          id: mongoID ???
                          name:string, 
                          type:"URL || binary"
                        }
                      ],
          }]
  */
  //DONE//
  async createTopicOfSubject(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    /*Na vstupu {idOfSubject: string, nameOfTopic: [string]}*/
    let awid = ucEnv.getUri().getAwid();
    let result = await ManTopicAbl.createTopicOfSubject(awid, dtoIn, resolveAuthority(ucEnv));
    return result;
  }
  //DONE//
  async updateTopicOfSubject(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    /*
      Na vstupu {
                  idOfSubject: string,
                  idOfTopicToUpdate: string,
                  nameOfTopic: string,
                } 
    */
    let awid = ucEnv.getUri().getAwid();
    let result = await ManTopicAbl.updateTopicOfSubject(awid, dtoIn, resolveAuthority(ucEnv));
    return result;
  }
  //DONE//
  async removeTopicOfSubject(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    /*
      Na vstupu {
                  idOfSubject: string,
                  idOfTopic: string,
                } 
    */
    let awid = ucEnv.getUri().getAwid();
    let result = await ManTopicAbl.removeTopicOfSubject(awid, dtoIn, resolveAuthority(ucEnv));
    return result;
  }
  /////////////////////////////////////////////////////
  //LEARNING MAATERIAL//
  async addMaterialOfTopic(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    /* multipart form
      {
        idOfSubject: string
        idOfTopic: string,
        materialName: string,
        materialData: data,
        materialUrl: string
      }
    */
    let awid = ucEnv.getUri().getAwid();
    let result = await ManMaterialAbl.addMaterialOfTopic(awid, dtoIn, resolveAuthority(ucEnv));
    return result;
  }

  async removeMaterialOfTopic(ucEnv) {
    let dtoIn = ucEnv.getDtoIn();
    /* NA VSTUPU
      {
        idOfSubject: string
        idOfTopic: string,
        idOfMaterial:string
      }
    */
    let awid = ucEnv.getUri().getAwid();
    let result = await ManMaterialAbl.removeMaterialOfTopic(awid, dtoIn,resolveAuthority(ucEnv));
    return result;
  }

  async authorization(ucEnv){
    return resolveAuthority(ucEnv)
  }
}

module.exports = new ManCrudController();
