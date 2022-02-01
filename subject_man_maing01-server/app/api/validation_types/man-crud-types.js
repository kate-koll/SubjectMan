/* eslint-disable */

/////////////////////////////////////////////////////////////
//SUBJECTS//
const getSubjectByIdDtoInTypeArray = shape({
  id: array(id().isRequired()).isRequired(),
}).isRequired();

const createSubjectDtoInType = shape({
  name: string(50).isRequired(),
  credits: string(2).isRequired(),
  degree: string(3).isRequired(),
  supervisor: string(50).isRequired(),
  description: string(500).isRequired(),
});

const editSubjectDtoInType = shape({
  id: id().isRequired(),
  name: string(50),
  credits: string(2),
  degree: string(3),
  supervisor: string(50),
  description: string(500),
  studyTopics: array(
    shape({
      id: string(150),
      nameOfTopic: string(250),
      materials: array(
        shape({
          id: string(150),
          name: string(250),
          type: string(20),
          data: string()
        })
      ),
    })
  ),
});

const removeSubjectDtoInType = shape({
  id: id().isRequired(),
});

/////////////////////////////////////////////////////////////
//PROGRAMS//
const getProgramByIdDtoInType = shape({
  id: id().isRequired(),
});

const createProgramDtoInType = shape({
  name: string(100).isRequired(),
  organisation: string(100).isRequired(),
  description: string(500).isRequired(),
  subjectsOfProgram: array(
    shape({
      id: id().isRequired(),
      mandatory: string(30).isRequired(),
    })
  ),
});

const addSubjectToProgramDtoInType = shape({
  idOfProgram: id().isRequired(),
  subjects: array(
    shape({
      id: id().isRequired(),
      mandatory: string(30).isRequired(),
    }).isRequired()
  ).isRequired(),
});

const removeSubjectFromProgramDtoInType = shape({
  idOfProgram: id().isRequired(),
  subjectsOfProgramIds: array(id().isRequired()).isRequired(),
}).isRequired();

/////////////////////////////////////////////////////////////
//TOPICS//
const createTopicOfSubjectDtoInType = shape({
  idOfSubject: string().isRequired(),
  nameOfTopic: array(string(250).isRequired()),
});

const updateTopicOfSubjectType = shape({
  idOfSubject: id().isRequired(),
  idOfTopicToUpdate: string().isRequired(),
  nameOfTopic: string(250).isRequired(),
});

const removeTopicOfSubjectType = shape({
  idOfSubject: id().isRequired(),
  idOfTopic: string().isRequired(),
});

//MATERIALS//
const addMaterialDtoInType = shape({
  idOfSubject: string().isRequired(),
  idOfTopic: string().isRequired(),
  materialName: string(250).isRequired(),
  materialData: binary(),
  materialUrl: string(250),
});

const removeMaterialDtoInType = shape({
  idOfSubject: id().isRequired(),
  idOfTopic: string(255).isRequired(),
  idOfMaterial: string(255).isRequired()
}).isRequired()
