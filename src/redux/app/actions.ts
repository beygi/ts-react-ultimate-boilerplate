import { createAction } from "redux-actions";
import * as Actions from "./constants";

export const logOut = createAction(Actions.LOG_OUT);
export const updateUser = createAction<any>(Actions.UPDATE_USER);
