//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useDataObject } from "uu5g04-hooks";
import "uu5g04-bricks";
import "uu5g04-forms";
import Config from "../../config/config";
import Lsi from "../../config/lsi";
import Calls from "calls";
import SubjectDetail from "../../routes/subject-detail";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "MaterialForm",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const MaterialForm = createVisualComponent({
  ...STATICS,
  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    function getHeader() {
      if (props.view == "edit") {
        return <UU5.Bricks.Lsi lsi={Lsi.material.edit} />;
      } else if (props.view == "add") {
        return <UU5.Bricks.Lsi lsi={Lsi.material.add} />;
      }
    }

    const materialDataObject = useDataObject({
      handlerMap: {
        create: Calls.addMaterialOfTopic,
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

    async function onSave(values) { 
      try {
        await materialDataObject.handlerMap.create({idOfSubject: props.subjectId, idOfTopic: props.topicId, materialName: values.values.nazev, materialUrl: values.values.url})
        showSuccess("Saved")
        UU5.Environment.getRouter().setRoute({
          component: <SubjectDetail programId={props.programId} subjectId = {props.subjectId} subjectName={props.subjectName} programName={props.programName} />,
          url: { useCase: "subject/detail", parameters: { name: props.subjectName } },
        });
      }
      catch{
        showError("Error")
      }
    }

    function onCancel() {
      UU5.Environment.getRouter().setRoute({component: <SubjectDetail subjectId = {props.subjectId} subjectName={props.subjectName} programName={props.programName} programId={props.programId}/>, url: {useCase: "subject/detail", parameters:{ name: props.subjectName } }})
    }

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <div {...attrs}>
        <UU5.Bricks.Container>
          <UU5.Forms.Form header={getHeader} onSave={onSave} onCancel={onCancel}>

            <UU5.Forms.Text
              label={<UU5.Bricks.Lsi lsi={Lsi.material.name} />}
              name="nazev"
              placeholder="Hooks podcast"
              required
              style={{ textAlign: "left" }}
            />
            <UU5.Forms.Text
              label={<UU5.Bricks.Lsi lsi={Lsi.material.url} />}
              name="url"
              placeholder="youtube.com"
              required
            />
            <UU5.Forms.Controls buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.material.saveButton} /> }} />
          </UU5.Forms.Form>
        </UU5.Bricks.Container>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default MaterialForm;
