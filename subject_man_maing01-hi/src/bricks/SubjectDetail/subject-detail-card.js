//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useDataObject } from "uu5g04-hooks";
import Config from "../../config/config";

import Lsi from "../../config/lsi";
import Calls from "calls";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "SubjectDetailCard",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const SubjectDetailCard = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const subjectDataObject = useDataObject({
      handlerMap: {
        load: Calls.getSubjectById,
      },
      initialDtoIn: {
        id: [props.subjectId],
      },
    });
    let { state, data, errorData, pendingData, handlerMap } = subjectDataObject;

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    const getDetails = () => {
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
          return (
            <UU5.Bricks.Ul>
              <UU5.Bricks.Li>
                <UU5.Bricks.Lsi lsi={Lsi.subjectDetailCard.description} />: {data.subjects[0].description}
              </UU5.Bricks.Li>
              <UU5.Bricks.Li>
                <UU5.Bricks.Lsi lsi={Lsi.subjectDetailCard.supervisor} />: {data.subjects[0].supervisor}
              </UU5.Bricks.Li>
              <UU5.Bricks.Li>
                <UU5.Bricks.Lsi lsi={Lsi.subjectDetailCard.degree} />: {data.subjects[0].degree}
              </UU5.Bricks.Li>
              <UU5.Bricks.Li>
                <UU5.Bricks.Lsi lsi={Lsi.subjectDetailCard.credits} />: {data.subjects[0].credits}
              </UU5.Bricks.Li>
            </UU5.Bricks.Ul>
          );
      }
    };

    return currentNestingLevel ? <div {...attrs}>{getDetails()}</div> : null;
    //@@viewOff:render
  },
});

export default SubjectDetailCard;
