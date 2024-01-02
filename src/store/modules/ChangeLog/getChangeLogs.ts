import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../ActionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


export type ChangeType = {
  id: number,
  field_name: string,
  old_value: string,
  new_value: string,
  timestamp: string
}[]

const apiDetails = Object.freeze(apiList.ChangeLog.getChangeLogs);

export default function getChangeLogsReducer(state = initialState, action: DefaultAction): DefaultState<ChangeType> {
  const stateCopy = Object.assign({}, state);
  const actionName = apiDetails.actionName;

  return initDefaultReducer(actionName, action, stateCopy);
}

export const getChangeLogsAction = (): AppThunk<APIResponseDetail<ChangeType>> => async (dispatch: Dispatch) => {
  return await initDefaultAction(apiDetails, dispatch, { disableSuccessToast: true });
};