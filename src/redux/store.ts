import {Store} from "redux";
import configureStore from "./config";
import {loadState, saveState} from "./localStorage";
import {IRootState} from "./reducers";

// Load initial state from local storage if exist
const initialState: IRootState = loadState();

// Pass initial state to store config
export const store: Store<IRootState> = configureStore(initialState);

// Sync store with local storage
store.subscribe(() => {
    saveState(store.getState());
});
