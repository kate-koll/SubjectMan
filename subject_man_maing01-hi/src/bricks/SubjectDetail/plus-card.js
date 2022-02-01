//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "../../config/config";

import MaterialAdd from "../../routes/material-add";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "PlusCard",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const PlusCard = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    function hadndleAddClick(component, event) {
      //UU5.Environment.getRouter().setRoute("material/add")
      UU5.Environment.getRouter().setRoute({
        component: <MaterialAdd topicId={props.topicId} programId={props.programId} programName={props.programName} subjectId={props.subjectId} subjectName={props.subjectName} />,
        url: { useCase: "material/add" },
      });
    }

    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <div {...attrs}>
        <UU5.Bricks.Card
          bgStyle="filled"
          colorSchema="blue-grey"
          width={290}
          minWidth={290}
          elevationHover={3}
          elevation={1}
          inline={true}
          style={{ height: "188.391px", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <UU5.Bricks.Button
            onClick={hadndleAddClick}
            bgStyle="transparent"
            colorSchema="primary"
            size="xl"
            style={{ width: "280px", height: "180px", backgroundColor: "transparent" }}
          >
            <UU5.Bricks.Icon
              icon="mdi-plus-box-outline"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></UU5.Bricks.Icon>
          </UU5.Bricks.Button>
        </UU5.Bricks.Card>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default PlusCard;
