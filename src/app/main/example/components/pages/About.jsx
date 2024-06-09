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

class About extends Component {


    render() {

        return (
            <FusePageSimple
                header={
                    <div className="p-24">
                        <h4>{'About'}</h4>
                    </div>
                }
                contentToolbar={
                    <div className="p-24">
                        <h1>Overview</h1>
                    </div>
                }
                content={
                    <div className="p-24">
                        <p dir="ltr"><span>RadAssist is the first AI-assisted teleradiology solution developed in Bangladesh. Our platform consists of a standard Picture Archiving and Communication System (PACS) that supports communication between hospitals and remote radiologists. Hospitals &amp; diagnostic centers can upload radiological images (X-ray, CT scan, MRI) in DICOM format to the RadAssist server using the web-app. Radiologists can view the images and provide reports through the service. We are currently providing our support to three hospitals.&nbsp;</span></p>
                        <p dir="ltr"><span id="docs-internal-guid-6efd1ad9-7fff-39a1-f35b-c38fdd5b07ab"><br /><span>RadAssist is a spin-off from the </span><a href="http://bme.buet.ac.bd/"><span>Department of Biomedical Engineering, BUET</span></a><span>. The project was first initiated through a &ldquo;Special Grant&rdquo; from the ICT ministry, Bangladesh for fundamental research at the </span><a href="https://mhealth.buet.ac.bd/"><span>mHealth Lab (Biomedical Engineering, BUET)</span></a><span>. The ongoing research focuses on developing anatomically aware deep learning algorithms for automated diagnosis from X-ray images. Due to the Covid-19 crisis, we are aggressively scaling up the project with the support of </span><a href="https://brainstation-23.com/"><span>Brainstation-23</span></a><span> and </span><a href="https://ictd.gov.bd/"><span>ICT ministry, Bangladesh</span></a><span>. </span></span></p>
                    
                            <div>
                                <div>
                                    <h1>Contributors</h1>
                                    <p>The RadAssist platform was developed in a very short time with the help of students of BUET, engineers of Brainstation-23, 
                                        and support from several volunteers. 
                                        The list of contributors are provided below.</p>
                                    <br />
                                    <p dir="ltr"><span>Asit Shahriar Sushmit</span></p>
                                    <p dir="ltr"><span>Rifat Jahan Azad</span></p>
                                    <p dir="ltr"><span>Proteeti Prova Rawshan</span></p>
                                    <p dir="ltr"><span>Tahmid Choyon</span></p>
                                    <p dir="ltr"><span>Shajal Ahamed</span></p>
                                    <p dir="ltr"><span>Shahed Mehbub</span></p>
                                    <p dir="ltr"><span>Fahad Amin Shovon</span></p>
                                    <p dir="ltr"><span>Shahad Ishrak</span></p>
                                    <p dir="ltr"><span>Fatima Tasnim</span></p>
                                    <p dir="ltr"><span>Pulak Kanti Bhowmick</span></p>
                                    <p dir="ltr"><span>Syeda Sifat Hasnain</span></p>
                                    <p><span>&nbsp;</span></p>
                                    <h3>DWV viewer credit: <a href="https://github.com/ivmartel" target="_blank">ivmartel</a></h3>
                                </div>
                            </div>
                    </div>

                }>
            </FusePageSimple>
        );
    }
}

export default About;