//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useDataObject, useState } from "uu5g04-hooks";
import Config from "../config/config";

import SubjectDetail from "../../routes/subject-detail";
import Calls from "calls";
import Lsi from "../../config/lsi";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "SubjectEditForm",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const SubjectEditForm = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
const [error, setError] = useState(false);


    const subjectDataObject = useDataObject({
      handlerMap: {
        load: Calls.getSubjectById,
        update: Calls.editSubject,
      },
      initialDtoIn: {
        id: [props.subjectId],
      },
    });
    let { state, data, errorData, pendingData, handlerMap } = subjectDataObject;


    const topicDataObject = useDataObject({
      handlerMap: {
        create: Calls.createTopicOfSubject,
      },
    });
    let { tState, tData, tErrorData, tPendingData, tHandlerMap } = topicDataObject;

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

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

    async function onSave (opt) {
      try {
        if(opt.values.Topic) {
          await topicDataObject.handlerMap.create({idOfSubject: props.subjectId, nameOfTopic: [opt.values.Topic]})
        }
        const sub = await subjectDataObject.handlerMap.update({id: props.subjectId, name: props.subjectName, description: opt.values.Description, credits: opt.values.Kredity, degree: opt.values.Titul, supervisor: opt.values.Garant});  
        setError(false)   
        showSuccess("Saved");
        UU5.Environment.getRouter().setRoute({
          component: <SubjectDetail programId={props.programId} subjectId = {props.subjectId} subjectName={props.subjectName} programName={props.programName} />,
          url: { useCase: "subject/detail", parameters: { name: props.subjectName } },
        });
      } catch (e) {
        showError(JSON.stringify(e.message));
        setError(true)
        opt.component.cancel();       
      }
    };

    const onCancel = () => {
      if(!error) {
        UU5.Environment.getRouter().setRoute({
        component: <SubjectDetail programId={props.programId} subjectId = {props.subjectId} subjectName={props.subjectName} programName={props.programName} />,
        url: { useCase: "subject/detail", parameters: { name: props.subjectName } },
      });
      }        
    };

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
          const newData = subjectDataObject.data.subjects[0];
          return (
            <UU5.Bricks.Container>
              <UU5.Forms.Form
                header={<UU5.Bricks.Lsi lsi={Lsi.subjectEditForm.edit} />}
                onSave={onSave}
                onCancel={onCancel}
              >
                <UU5.Bricks.Header level="2" content={props.subjectName} style={{ marginTop: 0 }} />
                <UU5.Forms.TextArea
                  label={<UU5.Bricks.Lsi lsi={Lsi.subjectDetailCard.description} />}
                  name="Description"
                  placeholder="Description"
                  required
                  style={{ textAlign: "left" }}
                  value={newData.description}
                />
                <UU5.Forms.Text
                  label={<UU5.Bricks.Lsi lsi={Lsi.subjectDetailCard.supervisor} />}
                  name="Garant"
                  placeholder="Garant"
                  required
                  value={newData.supervisor}
                />
                <UU5.Forms.Select
                  label={<UU5.Bricks.Lsi lsi={Lsi.subjectDetailCard.degree} />}
                  name="Titul"
                  placeholder="Titul"
                  required
                  value={newData.degree}
                ><UU5.Forms.Select.Option value="Bc" />
                <UU5.Forms.Select.Option value="Mgr" /></UU5.Forms.Select>
                <UU5.Forms.Text
                  label={<UU5.Bricks.Lsi lsi={Lsi.subjectDetailCard.credits} />}
                  name="Kredity"
                  placeholder="Kredity"
                  required
                  value={newData.credits}
                />
                <UU5.Forms.Text
                  label={<UU5.Bricks.Lsi lsi={Lsi.subjectDetailCard.topics} />}
                  name="Topic"
                  placeholder="Topic"
                />
                <UU5.Forms.Controls buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.material.saveButton} /> }} />
              </UU5.Forms.Form>
            </UU5.Bricks.Container>
          );
      }
    };

    return currentNestingLevel ? <div {...attrs}>{getDetails()}</div> : null;
    //@@viewOff:render
  },
});

export default SubjectEditForm;
