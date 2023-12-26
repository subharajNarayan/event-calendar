import { combineReducers } from "redux";
import postCommentLogs from "./postCommentLogs";

const CommentActions = combineReducers({
  postCommentLogs,
})

export default CommentActions;