import { combineReducers } from "redux";
import postTeamMemberLogs from "./postTeamMemberLogs";
import getTeamMemberLogs from "./getTeamMemberLogs";
import deleteTeamMemberLogs from "./deleteTeamMemberLogs";
import updateTeamMemberLogs from "./updateTeamMemberLogs";

const TeamMemberActions = combineReducers({
  postTeamMemberLogs,
  getTeamMemberLogs,
  deleteTeamMemberLogs,
  updateTeamMemberLogs,
})

export default TeamMemberActions;