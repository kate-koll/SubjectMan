//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useDataObject, useDataList } from "uu5g04-hooks";
import Config from "./config/config";

import Calls from "calls";
import StudyProgramCard from "../bricks/Programs/study-program-card";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Programs",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const Programs = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //get the program list
    const programDataList = useDataList({
      handlerMap: {
        load: Calls.getPrograms,
      },
    });
    const { state, data, newData, pendingData, errorData, handlerMap, pageSize } = programDataList;
    let programListArray = [];

    const getPrograms = () => {
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
          for (let index = 0; index < data.length; index++) {
            programListArray.push({
              programName: data[index].data.name,
              id: data[index].data.id,
            });
          }
          return (
            programListArray.map((program) => (
              <StudyProgramCard name={program.programName} id={program.id} key={program.id}/>
            ))
          );
      }
    }

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <div {...attrs}>
        <UU5.Bricks.Container>
          <UU5.Bricks.Row style={{ textAlign: "center" }}>
            <UU5.Bricks.Header level={1} colorSchema="black">
              Studijní programy na Dragon University
            </UU5.Bricks.Header>
          </UU5.Bricks.Row>
          <UU5.Bricks.Row>
            <br />
          </UU5.Bricks.Row>
          <UU5.Bricks.Row display="flex">
            {getPrograms()}
          </UU5.Bricks.Row>
        </UU5.Bricks.Container>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default Programs;
