import { combineReducers } from "redux";
import getChangeLogs from "./getChangeLogs";

const ChangeActions = combineReducers({
  getChangeLogs,
})

export default ChangeActions;