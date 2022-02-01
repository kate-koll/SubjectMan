//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "./config/config";

import MaterialForm from "../bricks/MaterialEdit/material-form";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "MaterialAdd",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const MaterialAdd = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <div {...attrs}>
        <MaterialForm topicId={props.topicId} view="add" programId={props.programId} programName={props.programName} subjectId={props.subjectId} subjectName={props.subjectName}></MaterialForm>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default MaterialAdd;
