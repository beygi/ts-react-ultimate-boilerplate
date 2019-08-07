/**
 * @module Components/Layout
 */
import * as React from "react";
import Translate from "../Translate";
import USER from "./../../lib/user";
import DashboardPrivateLayout from "./containers/DashboardPrivate";
import PublicLayout from "./containers/Public";

const userObject = USER.getInstance();
export interface IProps {
    /** is this i private layout? default is false  */
    private: boolean;
    /** react component which is filled the layout  */
    children?: any;
}

/**
 * basic parent layout component for public and private pages
 */
export default class Layout extends React.Component<IProps> {
    private admin: boolean;

    constructor(props: IProps) {
        super(props);
        this.admin = false;
    }

    public render() {
        // decide if user is admin or not
        this.admin = false;
        if (this.props.children.props.location && this.props.children.props.location.pathname.startsWith("/admin/")) {
            this.admin = true;
        }

        if (this.admin && !userObject.hasRealmRole("app_admin")) {
            // we have some rats here
            this.admin = false;
            return (<PublicLayout><h1>404. not found</h1></PublicLayout>);
        }
        return (
            this.props.private ?
                <DashboardPrivateLayout isAdmin={this.admin}>{this.props.children}</DashboardPrivateLayout>
                :
                <PublicLayout>
                {this.props.children}
                </PublicLayout>
        );
    }
}
