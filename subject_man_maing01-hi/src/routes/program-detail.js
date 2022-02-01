//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useState, useContext} from "uu5g04-hooks";
import Config from "./config/config";

import SubjectManInstanceContext from "../bricks/subjectMan-instance-context.js";
import ProgramDetailComponent from "../bricks/ProgramDetail/program-detail-component";
import AddSubjectModal from "../bricks/ProgramDetail/add-subject-modal";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ProgramDetail",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const ProgramDetail = createVisualComponent({
  ...STATICS,
  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const [programName, setProgramName] = useState(props.params.name);
    const [programId, setProgrmId] = useState(props.params.id);
    const [modalShow, setModalShow] = useState();
    const [render, setRender] = useState(true);

    const profile = useContext(SubjectManInstanceContext);
    const isAuthority = profile === "Authorities";

    //@@viewOn:private
    function handleBackClick() {
      UU5.Environment.getRouter().setRoute("programs")
    }
    function handleAddClick() {
      setModalShow(true);
      setRender(false)
      
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
        <UU5.Bricks.Container>
        <UU5.Bricks.Row>
            <UU5.Bricks.Column colWidth={"xs-6 s-6 m-6 l-11 xl-11"}>
              <UU5.Bricks.Button bgStyle="transparent" size = "xl" colorSchema="" onClick={handleBackClick}>
                <UU5.Bricks.Icon icon="mdi-arrow-left-bold-box"/>
              </UU5.Bricks.Button>
            </UU5.Bricks.Column>
            {isAuthority&& (
              <UU5.Bricks.Column colWidth={"xs-6 s-6 m-6 l-1 xl-1"}>
              <UU5.Bricks.Button bgStyle="transparent" size="xl" colorSchema="primary" onClick={handleAddClick}>
                  <UU5.Bricks.Icon icon="mdi-plus-box-outline" />
                </UU5.Bricks.Button>
            </UU5.Bricks.Column>
             )}
            
          </UU5.Bricks.Row>
          <UU5.Bricks.Row style={{ textAlign: "center" }}>
            <UU5.Bricks.Header level="1">{programName}</UU5.Bricks.Header>
          </UU5.Bricks.Row>
          <UU5.Bricks.Row>
            {render&&<ProgramDetailComponent programId={programId} programName={programName}></ProgramDetailComponent>}
          </UU5.Bricks.Row>
          
        </UU5.Bricks.Container>
        <AddSubjectModal setRender={setRender} programId={programId} programName={programName} shown={modalShow} setShow={setModalShow}></AddSubjectModal>
        
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default ProgramDetail;
