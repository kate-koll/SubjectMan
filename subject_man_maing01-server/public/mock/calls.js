import Calls from "../src/calls.js";
import HttpClient from "./http-client.js";

const appAssetsBaseUri = (
  document.baseURI ||
  (document.querySelector("base") || {}).href ||
  location.protocol + "//" + location.host + location.pathname
).replace(/^(.*)\/.*$/, "$1/"); // strip what's after last slash

/**
 * Mocks
 */
Calls.call = (method, url, dtoIn) => {
  let mockUrl = (process.env.MOCK_DATA_BASE_URI || appAssetsBaseUri) + "mock/data/" + url + ".json";
  let responsePromise = HttpClient.get(mockUrl);
  return dtoIn != null ? responsePromise.then(dtoIn.done, dtoIn.fail) : responsePromise;
};

Calls.getCommandUri = (aUseCase) => {
  return aUseCase;
};
Calls.getPrograms=(dtoInData) => {
  let commandUri = Calls.getCommandUri("program/get/all");
  return Calls.call("get", commandUri, dtoInData);
}

Calls.getProgramById=(dtoInData) => {
  let commandUri = Calls.getCommandUri("program/get");
  return Calls.call("get", commandUri, dtoInData);
}
Calls.getSubjectById=(dtoInData) => {
  let commandUri = Calls.getCommandUri("subject/get");
  return Calls.call("get", commandUri, dtoInData);
}
Calls.editSubject=(dtoInData) => {
  let commandUri = Calls.getCommandUri("subject/edit");
  return Calls.call("post", commandUri, dtoInData);
}

Calls.loadSubjectManInstance = (dtoIn) => {
  let commandUri = Calls.getCommandUri("subjectManInstance/load");
  return Calls.call("get", commandUri, dtoIn);
}


//todelete
Calls.getUser=(dtoInData) => {
  let commandUri = Calls.getCommandUri("program/getUser");
  return Calls.call("get", commandUri, dtoInData);
}



export default Calls;
