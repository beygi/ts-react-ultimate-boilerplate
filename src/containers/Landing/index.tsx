import * as React from "react";
import { Redirect } from "react-router";
import t from "../../services/trans/i18n";
import USER from "./../../lib/user";
import "./style.less";
const user = USER.getInstance();

interface IProps {
}
// this.props.match.params
interface IState {
}

class LandingContainer extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        if (user.getCurrent().email) {
            return (
                <Redirect to="/dashboard" />
            );
        }
        return (
            <div>{t.t("Example")}</div>
        );
    }
}

export default LandingContainer;
