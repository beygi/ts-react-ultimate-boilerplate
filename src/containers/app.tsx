/**
 * @module AppContainer
 */
import { LocaleProvider } from "antd";
import * as React from "react";
import { hot } from "react-hot-loader";
import { Route, Switch } from "react-router";
import { BRANCH, DEPLOY_TYPE, VERSION } from "../constants";
import { updateUser } from "../redux/app/actions";
import { store } from "../redux/store";
import t from "../services/trans/i18n";
import Languages from "../services/trans/languages";
import Layout from "./../components/Layout";
import Config from "./../config";
import "./app.less";
import LandingContainer from "./Landing";
import NotFoundContainer from "./NotFound";
import UserContainer from "./Users";

interface IProps {
}

interface IState {
}

/**
 * this is our root component wich is route app to containers
 * based on browsers path
 */
class AppContainer extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        // console.log(store.getState());
        if (store.getState().app.user && store.getState().app.user.language) {
            document.body.dir = Languages[store.getState().app.user.language].dir;
            if (t.language !== store.getState().app.user.language) {
                t.changeLanguage(store.getState().app.user.language);
            }
        } else {
            document.body.dir = Config.language.dir;
            store.dispatch(updateUser({ language: Config.language.codeName, theme: "light" }));
        }
    }

    public componentDidMount() {
        if (DEPLOY_TYPE === "sandbox") {
            document.body.style.backgroundColor = "rgb(154, 189, 154)";
        }
        if (DEPLOY_TYPE === "development") {
            document.getElementById("develop").style.display = "block";
            document.getElementById("develop").innerHTML = DEPLOY_TYPE + " " + `<b>${VERSION} ${BRANCH}</b>`;
        }

        document.body.addEventListener("changeLanguage", (event: CustomEvent) => {
            document.body.dir = Languages[event.detail.code].dir;
            t.changeLanguage(event.detail.code, () => {
                store.dispatch(updateUser({ language: event.detail.code }));
                this.forceUpdate();
            });
        });
    }

    public componentWillUnmount() {
        // Make sure to remove the DOM listener when the component is unmounted.
        document.body.removeEventListener("changeLanguage", this.handleChangeLanguage);
    }

    public handleChangeLanguage() {
        // hande change
    }

    public render() {
        // console.log(t.language);
        return (
            <LocaleProvider locale={Config.languages[t.language].antLocale}>
                <Switch>
                    {/* Private routes */}

                    {/* <PrivateRoute path={`/dashboard`} component={DashboardContainer} /> */}
                    {/* sample page with parameters */}
                    {/* <PrivateRoute path={`/static/:name`} component={LandingContainer} /> */}

                    {/* Private admin routes */}
                    {/* <PrivateRoute path={`/admin/dashboard`} component={LandingContainer} /> */}

                    {/* Public routes */}
                    <Route exact path={`/`} render={() => <Layout private={false}><LandingContainer /></Layout>} />
                    <Route path={`/random`} render={() => <Layout private={false}><UserContainer /></Layout>} />
                    {/* not Not Founded routes */}
                    <Route component={NotFoundContainer} />
                </Switch>
            </LocaleProvider>
        );
    }
}

export default hot(module)(AppContainer);
