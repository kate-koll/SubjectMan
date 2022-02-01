//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "../../config/config";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "StudyProgramCard",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const StudyProgramCard = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    id: "1",
    name: "Název studijního programu",
    degree: "Bc./Ing.",
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    function handleProgramClick() {
      UU5.Environment.setRoute("program/detail", { id: props.id, name: props.name});
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
          width={330}
          minWidth={300}
          elevationHover={3}
          inline={true}
        >
          <UU5.Bricks.Header level="3" content={props.name} style={{ textAlign: "center" }} />
          <UU5.Bricks.TouchIcon
            icon="mdi-book-open-page-variant"
            style={{ display: "flex", fontSize: "55px", justifyContent: "center" }}
            onClick={handleProgramClick}
            colorSchema="teal"
          />
        </UU5.Bricks.Card>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default StudyProgramCard;
