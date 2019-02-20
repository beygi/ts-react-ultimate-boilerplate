import { connectRouter } from "connected-react-router";
import { History } from "history";
import { combineReducers, Reducer } from "redux";
import appReducer from "./app/reducer";
import { IAppStoreState , IRouterStoreState } from "./app/store";

export interface IRootState {
    app: IAppStoreState;
    router: IRouterStoreState;
}

export default (history: History) => combineReducers<IRootState>({
    app: appReducer,
    router: connectRouter(history),
  });
