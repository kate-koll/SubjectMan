//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, useState, useDataObject } from "uu5g04-hooks";
import Plus4U5 from "uu_plus4u5g01";
import "uu_plus4u5g01-app";

import Config from "./config/config";
import Left from "./left";
import Bottom from "./bottom";
import Home from "../routes/home";
import Programs from "../routes/programs";
import ProgramDetail from "../routes/program-detail";
import SubjectDetail from "../routes/subject-detail";
import SubjectEdit from "../routes/subject-edit";
import MaterialEdit from "../routes/material-edit";
import MaterialAdd from "../routes/material-add";
import SubjectManInstanceContext from "../bricks/subjectMan-instance-context";
import Calls from "calls";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "SpaAuthenticated",
  //@@viewOff:statics
};

const About = UU5.Common.Component.lazy(() => import("../routes/about"));
const InitAppWorkspace = UU5.Common.Component.lazy(() => import("../routes/init-app-workspace"));
const ControlPanel = UU5.Common.Component.lazy(() => import("../routes/control-panel"));

const DEFAULT_USE_CASE = "home";
const ROUTES = {
  notFound: { component: <Home /> },
  "": DEFAULT_USE_CASE,
  home: { component: <Home /> },
  about: { component: <About /> },
  "sys/uuAppWorkspace/initUve": { component: <InitAppWorkspace /> },
  controlPanel: { component: <ControlPanel /> },
  programs: { component: <Programs /> },
  "program/detail": { component: <ProgramDetail /> },
  "subject/detail": { component: <SubjectDetail /> },
  "subject/detail/edit": { component: <SubjectEdit /> },
  "material/edit": { component: <MaterialEdit /> },
  "material/add": { component: <MaterialAdd /> },
};

export const SpaAuthenticated = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    // const contextState = useDataObject({
    //   handlerMap: {
    //     load: handleLoad,
    //   },
    // });
    // async function handleLoad() {
    //   const dtoOut = await Calls.loadSubjectManInstance();
    //   return { ...dtoOut.data, authorizedProfileList: dtoOut.sysData.profileData.uuIdentityProfileList };
    // }

    const authorizationObject = useDataObject({
      handlerMap: {
        load: Calls.authorization,
      },
    });
    let { state, data, errorData, pendingData, handlerMap } = authorizationObject;
    let rights;
    if(state=="ready") {rights = data.profile}
    
    
    // let profileArray = "";
    // let highestRights = "";
    // if (contextState.state === "ready") {
    //   profileArray = contextState.data.authorizedProfileList;
    //   if (profileArray.includes("Authorities")) {
    //     highestRights = "Authorities";
    //   } else if (profileArray.includes("Executives")) {
    //     highestRights = "Executives";
    //   } else highestRights = "Readers";
    // }

    //@@viewOn:private
    let [initialActiveItemId] = useState(() => {
      let url = UU5.Common.Url.parse(window.location.href);
      return url.useCase || DEFAULT_USE_CASE;
    });
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <SubjectManInstanceContext.Provider value={rights}>
        <Plus4U5.App.MenuProvider activeItemId={initialActiveItemId}>
          <Plus4U5.App.Page
            {...props}
            top={<Plus4U5.App.TopBt />}
            topFixed="smart"
            bottom={<Bottom />}
            type={3}
            displayedLanguages={["cs", "en"]}
            left={<Left />}
            leftWidth="!xs-300px !s-300px !m-288px !l-288px !xl-288px"
            leftFixed
            leftRelative="m l xl"
            leftResizable="m l xl"
            leftResizableMinWidth={220}
            leftResizableMaxWidth={500}
            isLeftOpen="m l xl"
            showLeftToggleButton
            fullPage
          >
            <Plus4U5.App.MenuConsumer>
              {({ setActiveItemId }) => {
                let handleRouteChanged = ({ useCase, parameters }) => setActiveItemId(useCase || DEFAULT_USE_CASE);
                return (
                  <UU5.Common.Router
                    routes={ROUTES}
                    controlled={false}
                    onRouteChanged={handleRouteChanged}
                    notFoundRoute="notFound"
                    showNotFoundRouteInUrl={true}
                  />
                );
              }}
            </Plus4U5.App.MenuConsumer>
          </Plus4U5.App.Page>
        </Plus4U5.App.MenuProvider>
      </SubjectManInstanceContext.Provider>
    );
    //@@viewOff:render
  },
});

export default SpaAuthenticated;
