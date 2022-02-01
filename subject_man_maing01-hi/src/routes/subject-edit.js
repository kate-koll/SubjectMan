//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "./config/config";

import SubjectEditForm from "../bricks/SubjectDetail/subject-edit-form"
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "SubjectEdit",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const SubjectEdit = createVisualComponent({
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
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(
      props,
      STATICS
    );

    return currentNestingLevel ? (
      <div {...attrs}>
        <SubjectEditForm programId={props.programId} programName={props.programName} subjectId={props.subjectId} subjectName={props.subjectName}/>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default SubjectEdit;
