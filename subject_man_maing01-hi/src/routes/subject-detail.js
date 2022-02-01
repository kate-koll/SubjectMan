//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useState, useContext } from "uu5g04-hooks";
import Config from "./config/config";

import SubjectManInstanceContext from "../bricks/subjectMan-instance-context.js";
import SubjectDetailComponent from "../bricks/SubjectDetail/subject-detail-component";
import SubjectEdit from "./subject-edit";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "SubjectDetail",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const SubjectDetail = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private

    const [subjectName, setSubjectName] = useState(props.subjectName ? props.subjectName : props.params.name);

    const profile = useContext(SubjectManInstanceContext);
    const isAuthority = profile === "Authorities";

    function handleBackClick() {
      if (props.programName)
        UU5.Environment.getRouter().setRoute("program/detail", { id: props.programId, name: props.programName });
      else UU5.Environment.getRouter().setRoute("programs");
    }
    function handleEditClick() {
      UU5.Environment.getRouter().setRoute({
        component: (
          <SubjectEdit
            subjectId={props.subjectId}
            subjectName={props.subjectName}
            programName={props.programName}
            programId={props.programId}
          />
        ),
        url: { useCase: "subject/detail/edit", parameters: { name: props.subjectName } },
      });
    }

    //@@viewOff:private

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <div {...attrs}>
        {" "}
        <UU5.Bricks.Container>
          <UU5.Bricks.Row>
            <UU5.Bricks.Column colWidth={"xs-6 s-6 m-6 l-10 xl-10"}>
              <UU5.Bricks.Button bgStyle="transparent" size="xl" colorSchema="" onClick={handleBackClick}>
                <UU5.Bricks.Icon icon="mdi-arrow-left-bold-box" />
              </UU5.Bricks.Button>
            </UU5.Bricks.Column>
            {isAuthority && (
              <UU5.Bricks.Column colWidth={"xs-6 s-6 m-6 l-1 xl-1"}>
                <UU5.Bricks.Button bgStyle="transparent" size="xl" colorSchema="primary" onClick={handleEditClick}>
                  <UU5.Bricks.Icon icon="mdi-pencil" />
                </UU5.Bricks.Button>
              </UU5.Bricks.Column>
            )}
          </UU5.Bricks.Row>

          <UU5.Bricks.Row style={{ textAlign: "center" }}>
            <UU5.Bricks.Header level="1">{subjectName}</UU5.Bricks.Header>
          </UU5.Bricks.Row>
          <SubjectDetailComponent
            programName={props.programName}
            subjectName={subjectName}
            subjectId={props.subjectId}
            programId={props.programId}
          ></SubjectDetailComponent>
        </UU5.Bricks.Container>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default SubjectDetail;
