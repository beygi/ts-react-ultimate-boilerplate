import {IRootState} from "./reducers";

/**
 * Load store from local storage
 * @func
 *
 * @returns {IRootState | undefined}
 */
export const loadState = (): IRootState => {
    try {
        const serializedState = localStorage.getItem("state");
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (e) {
        return undefined;
    }
};

/**
 * Write store to local storage
 * @func
 *
 * @param  {IRootState} state
 *
 */
export const saveState = (state: IRootState): void => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("state", serializedState);
    } catch (e) {
        // console.log(e);
    }
};
