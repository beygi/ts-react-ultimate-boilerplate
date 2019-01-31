/**
 * @module Components/Layout/DashboardPrivateLayout
 */
import { Layout } from "antd";
import * as React from "react";

import { connect } from "react-redux";
import { IRootState } from "../../../../redux/reducers";
import "./style.less";

const { Content } = Layout;

interface IProps {
    /** react element which is filled the layout */
    children: JSX.Element;
    /** specify admin status */
    isAdmin: boolean;
    /** specify dark or light theme, read from redux */
    theme?: string;
}

interface IState {
    collapsed: boolean;
    menuClass: string; // normal or mini
}

/**
 * private layout to represent pages that needs a loggined user
 */
class DashboardPrivateLayout extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        let AdminClass: string = this.state.menuClass;
        if (this.props.isAdmin) {
            AdminClass = "admin-menu " + this.state.menuClass;
        }
        return (
            <Layout className={`${AdminClass} ${this.props.children.props.location.pathname.split("/")[1]}-page ${this.props.theme}`} style={{ minHeight: "100vh" }}>
                <Layout id="privateContent" className="private-content">
                    <Content>
                        {this.props.children}
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

function mapStateToProps(state: IRootState) {
    return {
        theme: state.app.user.theme,
    };
}

export default connect(mapStateToProps, null, null)(DashboardPrivateLayout);
