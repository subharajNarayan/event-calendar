import { Dispatch } from "redux";
import { AppThunk } from "../../index";
import { apiList } from "../../../store/ActionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";

export type MemberType = {
  id: number;
  username: string,
  address: string,
  contactnumber: string,
  email: string,
  password: string,
  color: string

}[]

const apiDetails = Object.freeze(apiList.TeamMemberLog.getMemberLogs);

export default function getMemberLogsReducer(state = initialState, action: DefaultAction): DefaultState<MemberType> {
  const stateCopy = Object.assign({}, state);
  const actionName = apiDetails.actionName;

  return initDefaultReducer(actionName, action, stateCopy);
}

export const getMemberLogsAction = (): AppThunk<APIResponseDetail<any>> => async (dispatch: Dispatch) => {
  return await initDefaultAction(apiDetails, dispatch, { disableToast: true });
};

