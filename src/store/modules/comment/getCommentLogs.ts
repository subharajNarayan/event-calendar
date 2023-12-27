import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../ActionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type CommentType = {
  id: number,
  comment: string,
  title: string,
  username: string,
  created_at: string
}[]

const apiDetails = Object.freeze(apiList.CommentLog.getCommentLogs);

export default function getCommentLogsReducer(state = initialState, action: DefaultAction): DefaultState<CommentType> {
  const stateCopy = Object.assign({}, state);
  const actionName = apiDetails.actionName;

  return initDefaultReducer(actionName, action, stateCopy);
}

export const getCommentLogsAction = (): AppThunk<APIResponseDetail<CommentType>> => async (dispatch: Dispatch) => {
  return await initDefaultAction(apiDetails, dispatch, { disableSuccessToast: true });
};