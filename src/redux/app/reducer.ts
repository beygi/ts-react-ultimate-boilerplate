import { handleActions } from "redux-actions";
import IAction from "../IActions";
import * as Actions from "./constants";
import { IAppStoreState } from "./store";

const initialState: IAppStoreState = {
    user: null,
};

export default handleActions<IAppStoreState, any>({
    [Actions.UPDATE_USER]: (state: any, action: IAction<any>) => {
        return {
            ...state,
            user: { ...state.user, ...action.payload },
        };
    },
    [Actions.LOG_OUT]: (state: any) => {
        document.cookie = "token=; path=/";
        return {
            ...state,
            user: {
            },
        };
    },
}, initialState);
