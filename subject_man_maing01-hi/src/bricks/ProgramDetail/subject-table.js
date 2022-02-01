//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useState } from "uu5g04-hooks";
import Config from "../../config/config";
import Lsi from "../../config/lsi";

import SubjectDetail from "../../routes/subject-detail";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "SubjectTable",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const SubjectTable = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    programName: "name of the program",
    subjectsOfProgram: [],
  },
  //@@viewOff:defaultProps

  render(props) {
    let currentSubjectId = "";

    const getSubjects = () => {
      return props.subjectsOfProgram.map((subject) => {
        currentSubjectId = subject.id;
        return (
          <UU5.Bricks.Table.Tr key={subject.id}>
            <UU5.Bricks.Table.Td>
              <UU5.Bricks.Link colorSchema="black" onClick={handleSubjectClick} subjectId={subject.id}>
                {subject.name}
              </UU5.Bricks.Link>
            </UU5.Bricks.Table.Td>
            <UU5.Bricks.Table.Td content={subject.credits} />
          </UU5.Bricks.Table.Tr>
        );
      });
    };

    function handleSubjectClick(component, event) {
      UU5.Environment.getRouter().setRoute({
        component: (
          <SubjectDetail
            subjectId={component.props.subjectId}
            subjectName={component.props.children}
            programId={props.programId}
            programName={props.programName}
          />
        ),
        url: { useCase: "subject/detail", parameters: { id: currentSubjectId, name: component.props.children } },
      });
    }

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <div {...attrs}>
        <UU5.Bricks.Table>
          <UU5.Bricks.Table.THead>
            <UU5.Bricks.Table.Tr>
              <UU5.Bricks.Table.Th content={<UU5.Bricks.Lsi lsi={Lsi.programDetail.subject} />} />
              <UU5.Bricks.Table.Th content={<UU5.Bricks.Lsi lsi={Lsi.programDetail.credits} />} />
            </UU5.Bricks.Table.Tr>
          </UU5.Bricks.Table.THead>

          <UU5.Bricks.Table.TBody>{getSubjects()}</UU5.Bricks.Table.TBody>
        </UU5.Bricks.Table>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default SubjectTable;
