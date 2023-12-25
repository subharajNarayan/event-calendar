import { combineReducers } from "redux";
import postTaskLogs from "./postTaskLogs";
import getTaskLogs from "./getTaskLogs";
import deleteTaskLogs from "./deleteTaskLogs";
import updateTaskLogs from "./updateTaskLogs";

const TaskActions = combineReducers({
  postTaskLogs,
  getTaskLogs,
  deleteTaskLogs,
  updateTaskLogs,
})

export default TaskActions;