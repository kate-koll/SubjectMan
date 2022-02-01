//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useContext, useDataObject, useState } from "uu5g04-hooks";
import Config from "../../config/config";

import Calls from "calls";
import SubjectDetail from "../../routes/subject-detail"
import SubjectManInstanceContext from "../../bricks/subjectMan-instance-context.js";
import MaterialEdit from "../../routes/material-edit";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "MaterialCard",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const MaterialCard = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [deleted, setDeleted] = useState(false);
    const materialDataObject = useDataObject({
      handlerMap: {
        delete: Calls.removeMaterialOfTopic,
      },
    });

    function showError(content) {
      UU5.Environment.getPage().getAlertBus().addAlert({
        content,
        colorSchema: "red",
      });
    }
    function showSuccess(content) {
      UU5.Environment.getPage().getAlertBus().addAlert({
        content,
        colorSchema: "success",
      });
    }
    function handleEditClick(component, event) {
      UU5.Environment.getRouter().setRoute({
        component: <MaterialEdit programName={props.programName} subjectName={props.subjectName} />,
        url: { useCase: "material/edit" },
      });
    }
    async function handleDeleteClick(opt) {
      try{
        const response =await materialDataObject.handlerMap.delete({idOfSubject: props.subjectId, idOfTopic: props.topicId, idOfMaterial: props.materialId}) 
        if (response.id) {
          setDeleted(true)   
        showSuccess("Deleted")
        }
      }
      catch{
        showError('Delete failed')
      }
    }

    const profile = useContext(SubjectManInstanceContext);
    const isExecutive = profile === "Authorities" || profile === "Executives";
    //@@viewOff:private

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <div {...attrs}>
        {!deleted&&<UU5.Bricks.Card
          bgStyle="filled"
          colorSchema="blue-grey"
          width={290}
          minWidth={290}
          elevationHover={3}
          inline={true}
        >
          <UU5.Bricks.Row style={{ textAlign: "right" }}>
            {isExecutive && (
              <UU5.Bricks.Button onClick={handleDeleteClick} bgStyle="transparent" colorSchema="danger">
                <UU5.Bricks.Icon icon="mdi-delete" />
              </UU5.Bricks.Button>
            )}

            {false && (
              <UU5.Bricks.Button onClick={handleEditClick} bgStyle="transparent" colorSchema="primary">
                <UU5.Bricks.Icon icon="mdi-pencil" />
              </UU5.Bricks.Button>
            )}
          </UU5.Bricks.Row>

          <UU5.Bricks.Header level="3" content={props.name} style={{ textAlign: "center", marginTop: "16px" }} />

          <UU5.Bricks.TouchIcon
            icon="mdi-note"
            style={{ display: "flex", fontSize: "55px", justifyContent: "center" }}
            href={`https://www.${props.src}`}
            target="_blank"
            colorSchema="teal"
          />
        </UU5.Bricks.Card>}
        
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default MaterialCard;
