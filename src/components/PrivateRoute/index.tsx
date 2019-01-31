/**
 * @module Components/PrivateRoute
 */
import * as React from "react";
import { Redirect, Route } from "react-router";
import { store } from "../../redux/store";
import Layout from "./../../components/Layout";

/**
 * private routing component
 */
const PrivateRoute = ({ component: Component, ...rest }): JSX.Element => {
    // every private page will be redirect to login page when user does not exist in store
    return (
        <Route {...rest} render={(props) => (
            store.getState().app.user ? (
                <Layout private={true}><Component {...props} /></Layout>
            ) : (
                    <Redirect to={{
                        pathname: "/",
                        state: { from: props.location },
                    }} />
                )
        )} />
    );
};
export default PrivateRoute;
