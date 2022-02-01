//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useContext, useDataObject, useState} from "uu5g04-hooks";
import Config from "../../config/config";
import Lsi from "../../config/lsi";
import Calls from "calls";

import SubjectManInstanceContext from "../../bricks/subjectMan-instance-context.js";
import MaterialCard from "./material-card";
import SubjectDetailCard from "./subject-detail-card";
import PlusCard from "./plus-card";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "SubjectDetailComponent",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const SubjectDetailComponent = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
const [subjectID, setSubjectID] = useState(props.subjectId);
    const subjectDataObject = useDataObject({
      handlerMap: {
        load: Calls.getSubjectById,
      },
      initialDtoIn: {
        id: [subjectID],
      },
    });
    let { state, data, errorData, pendingData, handlerMap } = subjectDataObject;

    let studyTopics = [];

    const profile = useContext(SubjectManInstanceContext);
    const isExecutive = profile === "Authorities" || profile === "Executives";

    const getTopics = () => { 
      switch (state) {
        case "readyNoData":
          return <UU5.Common.Loader />;
        case "pendingNoData":
          return <UU5.Common.Loader />;
        case "errorNoData":
          return <UU5.Common.Error />;
        case "pending":
          return <UU5.Common.Loader />;
        case "error":
          return <UU5.Common.Error />;
        case "ready":
          studyTopics = data.subjects[0].studyTopics;
          return studyTopics.map((topic) => {
            return (
              <UU5.Bricks.Panel
                key={topic.id}
                colorSchema="teal"
                iconExpanded="mdi-chevron-up"
                iconCollapsed="mdi-chevron-down"
                bgStyle="underline"
                header={topic.nameOfTopic}
                content={
                  
                  <UU5.Bricks.Row style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                  {topic.materials.map((material) => {
                    return (
                      <MaterialCard
                        key={material.id}
                        programName={props.programName}
                        subjectName={props.subjectName}
                        subjectId={props.subjectId}
                        name={material.name}
                        src={material.data}
                        topicId={topic.id}
                        materialId={material.id}
                      />
                    );
                  })}
                  { isExecutive&& <PlusCard topicId={topic.id} subjectId={props.subjectId} subjectName={props.subjectName} programId={props.programId} programName={props.programName} />}
                </UU5.Bricks.Row>
                }
              />
                
            );
          });
      }
    };

    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <div {...attrs}>
        <UU5.Bricks.Container>
          <UU5.Bricks.Accordion onClickNotCollapseOthers>
            <UU5.Bricks.Panel
              colorSchema="teal"
              iconExpanded="mdi-chevron-up"
              iconCollapsed="mdi-chevron-down"
              header={<UU5.Bricks.Lsi lsi={Lsi.subjectDetail.info} />} //Informace
              expanded={true}
              content={<SubjectDetailCard subjectId={props.subjectId} />}
            />
            <UU5.Bricks.Panel
              colorSchema="teal"
              iconExpanded="mdi-chevron-up"
              iconCollapsed="mdi-chevron-down"
              header={<UU5.Bricks.Lsi lsi={Lsi.subjectDetail.topics} />} //Temata a meterialy
              expanded={true}
              content={getTopics()}
            />
          </UU5.Bricks.Accordion>
        </UU5.Bricks.Container>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default SubjectDetailComponent;
