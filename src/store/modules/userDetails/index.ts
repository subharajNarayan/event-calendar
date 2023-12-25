import { Dispatch } from "redux";

const initialState = {
    id: null,
    firstname: "",
    // slug: "",
    tokens: {
        access: "",
        refresh: "",
    },
    // username: "",
    // water_scheme: "",
    // help_url: "",
}

type IUserDetails = {
    id: number | null
    firstname: string
    // slug: string
    tokens: {
        access: string
        refresh: string
    },
    // username: string
    // water_scheme: string
    // help_url: string
}

export const userDetailsReducer = (state: IUserDetails = initialState, action: DefaultAction): IUserDetails => {
    switch (action.type) {
        case "ADD_USER_DETAILS":
            return {
                ...state,
                ...action.payload
            }

        default:
            return state;
    }
}

export default userDetailsReducer


export const addUserDetails = (data: any) => (dispatch: Dispatch) => {
    dispatch({
        type: "ADD_USER_DETAILS",
        payload: data
    })
}