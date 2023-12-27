import { combineReducers } from "redux";
import postCommentLogs from "./postCommentLogs";
import getCommentLogs from "./getCommentLogs";

const CommentActions = combineReducers({
  postCommentLogs,
  getCommentLogs,
})

export default CommentActions;