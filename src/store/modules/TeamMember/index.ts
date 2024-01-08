import { combineReducers } from "redux";
import postTeamMemberLogs from "./postTeamMemberLogs";
import getTeamMemberLogs from "./getTeamMemberLogs";
import deleteTeamMemberLogs from "./deleteTeamMemberLogs";
import updateTeamMemberLogs from "./updateTeamMemberLogs";
import getMemberLogs from "./getMemberLogs";

const TeamMemberActions = combineReducers({
  postTeamMemberLogs,
  getTeamMemberLogs,
  deleteTeamMemberLogs,
  updateTeamMemberLogs,
  getMemberLogs
})

export default TeamMemberActions;