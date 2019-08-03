import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";
import { Layout } from "antd";
import * as React from "react";
import { Redirect } from "react-router";
import {Link} from "react-router-dom";
import t from "../../services/trans/i18n";
import USER from "./../../lib/user";
import "./style.less";

const user = USER.getInstance();
const { Header, Footer, Sider, Content } = Layout;

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
            <Layout>
                <Content className="intro">
                    <div>
                        <h1>{t.t("TypeScript,React Boilerplate")}</h1>
                        <div>
                            <Link to="/random" >
                                <Button type="primary">
                                    <FontAwesomeIcon icon={["fas", "user"]}/>
                                    {t.t("Random User")}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Content>
          </Layout>

        );
    }
}

export default LandingContainer;
