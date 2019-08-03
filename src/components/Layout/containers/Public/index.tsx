/**
 * @module Components/Layout/PublicLayout
 */
import * as React from "react";
import Translate from "../../../../components/Translate";

interface IProp {
    /** react element which is filled the layout */
    children?: JSX.Element;
}

/**
 * public layout to represent public pages that don't need a loggined user
 */
export default class PublicLayout extends React.Component {
    public render() {
        return (
            <div>
                <div id="header-icons">
                    <Translate />
                </div>
                {this.props.children}
            </div>
        );
    }
}
