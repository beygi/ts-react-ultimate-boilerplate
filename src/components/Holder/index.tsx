/**
 * @module Components/BlockComponent
 */
import { Collapse } from "antd";
import * as React from "react";
import "./style.less";

const Panel = Collapse.Panel;
interface IProps {
    /** react element wich is rendered in block */
    children?: any;
    /** remove padding from block if sets to true */
    noPadding?: boolean;
    /** css class name of final div */
    className?: string;
    /** blocks will be render in collapsable mode if sets to true */
    collapse?: boolean;
    /** collpase enabled block renders in collpassed mode if sets to true */
    collapseClosed?: boolean;
    /** title of the block */
    title?: string | JSX.Element;
    /** icon of the block */
    icon?: JSX.Element;
    /** icon position, default is left */
    iconPosition?: string;
    /** block renders transpoarent if true given */
    transparent?: boolean;
    /** display arrow in collapsable mode */
    showArrow?: boolean;
    /** title will be rendered in center */
    centerTitle?: boolean;
    /** remove margin of the title */
    noTitleMargin?: boolean;
}

interface IState {
}

/**
 * thats a block component. it holds other components in page,
 * bocks can be collapsed or transparent
 */
class BlockComponent extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    public render() {
        let cssClass = this.props.className || "";
        const transparentClass = (this.props.transparent) ? "transparent" : "";
        let title: JSX.Element;
        const icon: JSX.Element = (this.props.icon) ? <span className={`${this.props.iconPosition || "left"}`}>{this.props.icon}</span> : null;
        const disabled = (this.props.collapseClosed) ? ["0"] : ["1"];
        const showArrow = (this.props.showArrow !== undefined) ? this.props.showArrow : true;
        const centerTitle = (this.props.centerTitle !== undefined && this.props.centerTitle) ? "center-title" : "";

        // handle no-padding block
        cssClass += " block";
        cssClass += " " + transparentClass;
        if (this.props.noPadding || this.props.collapse) {
            cssClass += " no-padding";
        }

        let titleCssClass = `block-title block-title-${this.props.className}`;
        if (this.props.noTitleMargin) {
            titleCssClass += " no-title-margin";
        }

        if (this.props.collapse) {
            title = <div className="block-title-collapse">{icon} {this.props.title || <span>&nbsp;</span>}</div>;
            return (
                <div className={cssClass} >
                    <Collapse defaultActiveKey={[disabled[0]]} className="block-collapse" bordered={false}  >
                        <Panel header={title} key="1" showArrow={showArrow} >
                            {this.props.children}
                        </Panel>
                    </Collapse>
                </div>
            );
        }

        title = (this.props.title) ? <div className={`${titleCssClass}`}>{icon}<span className={centerTitle}>{this.props.title}</span></div> : null;
        return (
            <div className={cssClass} >
                {title}
                {this.props.children}
            </div >
        );
    }

}

export default BlockComponent;
