import Axios, { AxiosRequestConfig, AxiosResponse, CancelTokenSource, Method } from 'axios';
import initDispatchTypes from './default-action-type';
import initApiRequest from '../../services/api-request/api-request';
import { apiDetailType } from '../ActionNames';
import { FailToast, SuccessToast } from '../../components/Notifier/Notifier';
import { requestTimeoutLanguage, noConnectionLanguage } from '../../i18n/i18n';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

/**
 * Request details for XMLHTTP request
 */
interface APIRequestDetail {
    requestData?: any;
    requestMethod?: Method;
    pathVariables?: { [key: string]: Primitive };
    params?: { [key: string]: Primitive };
    cancelSource?: CancelTokenSource;
    disableSuccessToast?: boolean;
    disableFailureToast?: boolean;
    disableToast?: boolean;
}

interface CustomResponse<TData = any> extends AxiosResponse {
    message: string;
    data: TData | null;
    status: number;
    noconnection: boolean;
    config: AxiosRequestConfig;
    isAxiosError: boolean;
}

export type APIResponseDetail<TData = any> = Promise<CustomResponse<TData>>

let timeoutLanguageCount = 0;
let noServerConnectionLanguageCount = 0;
let noConnectionLanguageCount = 0;
const axiosCancelSource = Axios.CancelToken.source();

const handleError = (responseData: CustomResponse, dispatchTypes: any, disableFailureToast: boolean, disableToast: boolean) => {
    
    // const dispatch = useDispatch();
    // Failure Dispatch
    dispatch({ type: dispatchTypes.failureDispatch, payload: responseData.data });

    if (!(disableFailureToast || disableToast)) {
        responseData.data.message && FailToast(responseData.data.message);
    }

    // Check if responseData.config exists before accessing its properties
    if (responseData.config) {
        // Axios Timeout
        // Use responseData.status instead of responseData.config.code
        if (responseData.status === 504) {
            if (!timeoutLanguageCount) {
                timeoutLanguageCount++;
                FailToast(requestTimeoutLanguage());
            }
        }

        // Check if responseData.noconnection exists before accessing its properties
        if (responseData.noconnection) {
            // No Server Connection
            if (responseData.message === 'Server could not be reached') {
                if (!noServerConnectionLanguageCount) {
                    noServerConnectionLanguageCount++;
                    FailToast(noConnectionLanguage());
                }
            }
            // No Connection
            else if (responseData.status !== 504) {
                if (!noConnectionLanguageCount) {
                    noConnectionLanguageCount++;
                    FailToast(noConnectionLanguage());
                }
            }
        }
    }
};

export default async function initDefaultAction(apiDetails: apiDetailType, dispatch: Dispatch, apiRequestDetails: APIRequestDetail = {}) {
    const { requestData, requestMethod, params, cancelSource, disableSuccessToast = false, disableFailureToast, pathVariables, disableToast = false } = apiRequestDetails;

    // Init Dispatch Types
    const dispatchTypes = initDispatchTypes(apiDetails.actionName);

    // Progress Dispatch
    dispatch({ type: dispatchTypes.progressDispatch, payload: null });

    // Check for path variables in controllername
    const sanitizedApiDetails = sanitizeController(apiDetails, pathVariables);

    let responseData: any;

    try {
        responseData = await initApiRequest(sanitizedApiDetails, requestData, requestMethod || sanitizedApiDetails.requestMethod || "GET", params, cancelSource || axiosCancelSource);
    
        // Check if responseData and responseData.data exist
        if (responseData && responseData.data) {
          console.log(responseData.data, "responseData");
    
          // Success Dispatch
          dispatch({ type: dispatchTypes.successDispatch, payload: responseData.data });
    
          if (!(disableSuccessToast || disableToast)) {
            if (requestMethod !== "GET") {
              SuccessToast(responseData.data?.message);
            }
          }
        } else {
          console.error('Invalid API response structure:', responseData);
          // Handle the error appropriately
        }
      } catch (customThrownError) {
        responseData = customThrownError;
    
        // Check if responseData and responseData.data exist
        if (responseData && responseData.data) {
          handleError(responseData, dispatchTypes, disableFailureToast || disableToast, disableToast);
        } else {
          console.error('Invalid API response structure:', responseData);
          // Handle the error appropriately
        }
      }
    
      return responseData as APIResponseDetail | Promise<any>;
    }

function sanitizeController(
    apiDetail: apiDetailType,
    pathVariables?: { [key: string]: Primitive }
) {
    return pathVariables && Object.keys(pathVariables).length
        ? {
            ...apiDetail,
            controllerName: Object.entries(pathVariables).reduce(
                (acc, [key, value]) =>
                    (acc = acc.replace(`{${key}}`, value?.toString())),
                apiDetail.controllerName
            ),
        }
        : apiDetail;
}
function dispatch(arg0: { type: any; payload: any; }) {
    throw new Error('Function not implemented.');
}

