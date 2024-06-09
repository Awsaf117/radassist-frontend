import React, { Component } from 'react';
import { validateAccessToken } from "../../api/utilities"
import XRayApi from "../../api/backend"
import { Spin } from 'antd';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ReportIcon from '@material-ui/icons/Report';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import Grid from '@material-ui/core/Grid';
import FusePageSimple from '@fuse/core/FusePageSimple';

class Contact extends Component {


    render() {

        return (
            <FusePageSimple
                header={
                    <div className="p-24">
                        <h4>{'Contact'}</h4>
                    </div>
                }
                contentToolbar={
                    <div className="px-24">
                        <p dir="ltr"><span>We are providing 24x7 assistance to a limited number of clients. We are also constantly modifying our platform based on user feedback. If you are interested to use our system in your hospital or have any concerns please contact us at:</span></p>
                    </div>
                }
                content={
                    <Grid container spacing={3} className="p-24">
                        <Grid item xs={12} sm={6} >
                            <div>
                            
<p dir="ltr"><span><span>&nbsp;</span></span></p>
<p dir="ltr"><span>RadAssist Support</span></p>
<p dir="ltr"><span>Contact Number: +8801645800509</span></p>
<p dir="ltr"><span>Mail Address: </span><a href="mailto:contact@radassist.net"><span>contact@radassist.net</span></a><span>&nbsp;</span></p>
<p dir="ltr"><span>Mailing Address: mHealth lab, BME, 10th floor, 1111 ECE Building, BUET, Dhaka</span></p>
<p><span>&nbsp;</span></p>
                            </div>
                        </Grid>
                    </Grid>

                }>
            </FusePageSimple>
        );
    }
}

export default Contact;