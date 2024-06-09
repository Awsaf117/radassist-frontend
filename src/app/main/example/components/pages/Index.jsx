import React, { Component } from 'react';
import { validateAccessToken } from "../../api/utilities"

class Index extends Component {
    componentWillMount() {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken || !validateAccessToken()) {
            return this.props.history.push('/login');
        } else {
            return this.props.history.push('/home');
        }
    }

    render() {
        return <div></div>
    }
}

export default Index;