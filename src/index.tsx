/**
 * @module MainEntryPoint
 */
import { ConnectedRouter } from "connected-react-router";
import { createBrowserHistory } from "history";
import * as _ from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router";
import AppContainer from "./containers/app";
import USER from "./lib/user";
import { store } from "./redux/store";
import "./theme/application.less";

require("./lib/icon");

import { VERSION } from "./constants";

// we need a history object to hold browsers history
const history = createBrowserHistory();
const user = USER.getInstance();
// an unique user instance returned from an statc method in user class

console.log("version: " + VERSION);
ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Switch>
                <Route path="/" component={AppContainer} />
            </Switch>
        </ConnectedRouter>
    </Provider>,
    document.getElementById("root"),
);
