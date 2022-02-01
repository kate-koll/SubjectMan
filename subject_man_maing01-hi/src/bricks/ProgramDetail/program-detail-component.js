//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useDataObject } from "uu5g04-hooks";

import Config from "../../config/config";
import Lsi from "../../config/lsi";
import Calls from "calls";

import SubjectTable from "./subject-table";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ProgramDetailComponent",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const ProgramDetailComponent = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes

  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    programName: "Nazev programu",
    programId: "159",
  },
  //@@viewOff:defaultProps

  render(props) {
    const programDataObject = useDataObject({
      handlerMap: {
        load: Calls.getProgramById,
      },
      initialDtoIn: {
        id: props.programId,
      },
    });
    let { state, data, errorData, pendingData, handlerMap } = programDataObject;

    const getSubjects = (obligation) => {
      let subjectsArray = [];
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
          for (let index = 0; index < data.subjectsOfProgram.length; index++) {
            if (data.subjectsOfProgram[index].mandatory === obligation) {
              subjectsArray.push({
                credits: data.subjectsOfProgram[index].credits,
                degree: data.subjectsOfProgram[index].degree,
                description: data.subjectsOfProgram[index].description,
                id: data.subjectsOfProgram[index].id,
                mandatory: data.subjectsOfProgram[index].mandatory,
                name: data.subjectsOfProgram[index].name,
                //studyTopics
              });
            }
          }
          return (
            <SubjectTable
              subjectsOfProgram={subjectsArray}
              programId={props.programId}
              programName={props.programName}
            />
          );
      }
    };

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <div {...attrs}>
        <UU5.Bricks.Container>
          <UU5.Bricks.Accordion onClickNotCollapseOthers>
            <UU5.Bricks.Panel
              iconExpanded="mdi-chevron-up"
              iconCollapsed="mdi-chevron-down"
              header={<UU5.Bricks.Lsi lsi={Lsi.programDetail.mandatory} />}
              expanded={true}
              colorSchemaHeader="teal"
              bgStyle="filled"
              colorSchemaContent="white"
              bgStyleContent="filled"
              content={getSubjects("obligatory")}
            />
            <UU5.Bricks.Panel
              iconExpanded="mdi-chevron-up"
              iconCollapsed="mdi-chevron-down"
              header={<UU5.Bricks.Lsi lsi={Lsi.programDetail.compulsory} />}
              expanded={true}
              colorSchemaHeader="teal"
              bgStyle="filled"
              colorSchemaContent="white"
              bgStyleContent="filled"
              content={getSubjects("obligatory-selective")}
            />
            <UU5.Bricks.Panel
              iconExpanded="mdi-chevron-up"
              iconCollapsed="mdi-chevron-down"
              header={<UU5.Bricks.Lsi lsi={Lsi.programDetail.optional} />}
              expanded={true}
              colorSchemaHeader="teal"
              bgStyle="filled"
              colorSchemaContent="white"
              bgStyleContent="filled"
              content={getSubjects("selective")}
            />
          </UU5.Bricks.Accordion>
        </UU5.Bricks.Container>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default ProgramDetailComponent;
