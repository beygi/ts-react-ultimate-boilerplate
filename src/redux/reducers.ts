import { routerReducer } from "react-router-redux";
import { combineReducers, Reducer } from "redux";
import appReducer from "./app/reducer";
import { IAppStoreState , IRouterStoreState } from "./app/store";

export interface IRootState {
    app: IAppStoreState;
    router: IRouterStoreState;
}

export default combineReducers<IRootState>({
    app: appReducer,
    router: routerReducer,
});
