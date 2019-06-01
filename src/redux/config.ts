import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import { applyMiddleware, createStore, Store } from "redux";
import rootReducer, { IRootState } from "./reducers";

const history = createBrowserHistory();
const middleware = routerMiddleware(history);

declare var window: any;

function logger() {
    return (next: any) => (action: any) => {
        return next(action);
    };
}

/**
 *  initial store with middleware
 *  @func
 *
 *  @param {IRootState}  initialState
 *
 * @returns {Store}
 */
export default function configureStore(initialState?: IRootState): Store<IRootState> {
    const create = window.devToolsExtension
        ? window.devToolsExtension()(createStore)
        : createStore;

    // Add middleware
    const createStoreWithMiddleware = applyMiddleware(logger, middleware)(create);

    // Create store with initial object
    const store = createStoreWithMiddleware(rootReducer(history), initialState) as Store<IRootState>;

    if (module.hot) {
        module.hot.accept("./reducers", () => {
            const nextReducer = require("./reducers");
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}
