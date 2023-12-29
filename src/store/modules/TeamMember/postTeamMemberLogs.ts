import { Dispatch } from "redux";
import { AppThunk } from "../..";

import { apiList } from "../../ActionNames";
import initDefaultAction, { APIResponseDetail } from "../../helper/default-action";
import initDefaultReducer from "../../helper/default-reducer";
import initialState from "../../helper/default-state";


type RequestData = {
  username: any;
}

const apiDetails = Object.freeze(apiList.TeamMemberLog.postTeamMemberLogs);

export default function postTeamMemberLogsReducer(state = initialState, action: DefaultAction): DefaultState<RequestData> {
    const stateCopy = Object.assign({}, state);
    const actionName = apiDetails.actionName;

    return initDefaultReducer(actionName, action, stateCopy);
}

export const postTeamMemberLogsAction = (requestData: RequestData): AppThunk<APIResponseDetail<RequestData>> => async (dispatch: Dispatch) => {
    return await initDefaultAction(apiDetails, dispatch, { requestData, disableToast: true })
}