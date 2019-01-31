import * as React from "react";
import { Redirect } from "react-router";
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
        if (user.getCurrent()) {
            return (
                <Redirect to="/dashboard" />
            );
        }
        return (
            <div>Example</div>
        );
    }
}

export default LandingContainer;
