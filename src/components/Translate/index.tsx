/**
 * @module Components/TranslateComponent
 */
import { Dropdown, Icon, Menu } from "antd";
import * as React from "react";
import t from "../../services/trans/i18n";
import languages from "../../services/trans/languages";
import "./style.less";

interface IProps {
}
interface IState {
}

/**
 * translation select tool, it will dispatch global "changeLanguage" event with language code
 */
class TranslateComponent extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
    }

    public render() {
        console.log(t.language);
        const buttons = Object.keys(languages).map((key) => {
            return (
                <Menu.Item key={key}>
                    <a onClick={() => { document.body.dispatchEvent(new CustomEvent("changeLanguage", { bubbles: true, detail: { code: key } })); }}>{languages[key].name}</a>
                </Menu.Item>
            );
        },
        );
        const menu =
            <Menu>
                {buttons}
            </Menu>;

        return (
            <Dropdown getPopupContainer={() => document.getElementById("header-icons")} className="change-language" overlay={menu} trigger={["click"]}>
                <a className="ant-dropdown-link">
                    {languages[t.language].name}
                    <Icon type="down" />
                </a>
            </Dropdown>
        );
    }
}

export default TranslateComponent;
