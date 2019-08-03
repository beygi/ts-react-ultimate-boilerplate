import { Avatar, List, Skeleton } from "antd";
import axios from "axios";
import { lstat } from "fs";
import * as React from "react";
import { Redirect } from "react-router";
import Block from "../../components/Holder";
import t from "../../services/trans/i18n";
import USER from "./../../lib/user";
import "./style.less";

interface IProps {
}

interface IState {
    users: [{name: {first: string, last: string} , picture: {large: string}, email: string }];
}

class UserContainer extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {users : null};
    }

    public componentDidMount() {
        axios.get("https://randomuser.me/api?results=4")
        .then((response) => {
          console.log(response.data.results[0]);
          this.setState({users : response.data.results});
        });
    }

    public render() {
        const loading = (this.state.users === null) ? true : false;

        return (
         <div className="users">
             {
                 (loading) ?
                        [...Array(4)].map((n) => <Block><Skeleton loading={loading} active avatar={{size: "large", shape: "square"}} title={false}  paragraph={{rows: 2}}/></Block>) :
                        <List
                        itemLayout="horizontal"
                        dataSource={this.state.users}
                        renderItem={(user) => (
                          <Block>
                          <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar size="large" shape="square" src={user.picture.large} />
                                }
                                title={`${user.name.first} ${user.name.last}`}
                                description={user.email}
                            />
                          </List.Item>
                          </Block>
                        )}
                      />
             }
          </div>
             );
    }
}

export default UserContainer;
