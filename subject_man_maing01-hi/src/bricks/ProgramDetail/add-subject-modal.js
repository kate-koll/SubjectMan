//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useDataObject } from "uu5g04-hooks";
import Config from "../config/config";

import Calls from "calls";
import Lsi from "../../config/lsi";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "AddSubjectModal",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const AddSubjectModal = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const subjectDataObject = useDataObject({
      handlerMap: {
        load: Calls.getSubjectById,
        create: Calls.createSubject,
      },
    });
    let { state, data, errorData, pendingData, handlerMap } = subjectDataObject;

    const programDataObject = useDataObject({
      handlerMap: {
        add: Calls.addSubjectToProgram,
      }
    })


    async function onSave(values){
      try {
        const createSubjectResponse = await subjectDataObject.handlerMap.create({name: values.values.name, credits: values.values.credits, degree: values.values.degree, supervisor: values.values.garant, description: values.values.description});
        const addSubjectResponse = await programDataObject.handlerMap.add({idOfProgram: props.programId, subjects: [{id: createSubjectResponse.id, mandatory: values.values.mandatory}]})
        showSuccess("Saved");
        props.setShow(false);
      props.setRender(true)
      } catch (e){
        showError(JSON.stringify(e.message));
        values.component.setValues(values.values)
      }
      
    }

    function onCancel(){
      props.setShow(false);
      props.setRender(true)
    }

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
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <div {...attrs}>
        <UU5.Bricks.Modal forceRender={true} shown={props.shown} sticky ={true} size={"auto"} offsetTop={"auto"} >
          <UU5.Forms.Form header={props.programName} onSave={onSave} onCancel={onCancel}>
          <UU5.Forms.Text
              label={<UU5.Bricks.Lsi lsi={Lsi.subjectAdd.name}/>}
              name="name"
              placeholder="Subject Name"
              required
              style={{ textAlign: "left" }}
            />
            <UU5.Forms.Text
              label={<UU5.Bricks.Lsi lsi={Lsi.subjectAdd.credits}/>}
              name="credits"
              placeholder="Credits"
              required
              style={{ textAlign: "left" }}
            />
            <UU5.Forms.Select
              label={<UU5.Bricks.Lsi lsi={Lsi.subjectAdd.degree}/>}
              name="degree"
              placeholder="Degree"
              required
              style={{ textAlign: "left" }}
            ><UU5.Forms.Select.Option value="Bc" />
            <UU5.Forms.Select.Option value="Mgr" /></UU5.Forms.Select>
            <UU5.Forms.Text
              label={<UU5.Bricks.Lsi lsi={Lsi.subjectAdd.garant}/>}
              name="garant"
              placeholder="Supervisor"
              required
              style={{ textAlign: "left" }}
            />
            <UU5.Forms.Text
              label={<UU5.Bricks.Lsi lsi={Lsi.subjectAdd.description}/>}
              name="description"
              placeholder="description"
              required
              style={{ textAlign: "left" }}
            />
            <UU5.Forms.Select required label="mandatory" name="mandatory">
              <UU5.Forms.Select.Option value="obligatory" />
              <UU5.Forms.Select.Option value="obligatory-selective" />
              <UU5.Forms.Select.Option value="selective" />
            </UU5.Forms.Select>
            <UU5.Forms.Controls buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.material.saveButton} /> }} />
          </UU5.Forms.Form>
        </UU5.Bricks.Modal>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default AddSubjectModal;
