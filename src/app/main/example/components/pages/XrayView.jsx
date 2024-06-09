import React, { Component } from 'react';
import DwvComponent from "../xray_viewer/DwvComponent";
import Button from '@material-ui/core/Button';
class XrayView extends Component {
    state = {}

    componentDidMount() {
    }

    render() {
        return (
            <div className="button-row">
                <DwvComponent
                    fileURL = {`https://dev-radassist.s3-ap-southeast-1.amazonaws.com/image-00000-90ae26da-90e6-4cf7-b770-84a60846083f.dcm`}
                />
               
            </div>
        );
    }
}

export default XrayView;