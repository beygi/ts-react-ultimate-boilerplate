import axios from "axios";
import { lstat } from "fs";
import * as React from "react";
import { Redirect } from "react-router";
import Block from "../../components/Holder";
import t from "../../services/trans/i18n";
import USER from "./../../lib/user";
import "./style.less";
const user = USER.getInstance();

interface IProps {
}

interface IState {
    userData: {name: {first: string, last: string} , picture: {large: string}};
}

class UserContainer extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {userData : null};
    }

    public componentDidMount() {
        axios.get("https://randomuser.me/api/")
        .then((response) => {
          console.log(response.data.results[0]);
          this.setState({userData : response.data.results[0]});
        });
    }

    public render() {
        if (this.state.userData === null) { return <div className="users"><Block centerTitle >Loading</Block></div>; }
        return <div className="users"><Block title={`${this.state.userData.name.first} ${this.state.userData.name.last}`} centerTitle >
            <img src={this.state.userData.picture.large} alt=""/>
        </Block></div> ;
    }
}

export default UserContainer;
