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
import "./Tutorial.scss"

class Tutorial extends Component {


    render() {

        return (
            <FusePageSimple
                header={
                    <div className="p-24">
                        <h4>{'Tutorial'}</h4>
                    </div>
                }
                contentToolbar={
                    <div className="px-24">
                        <h1>How to use rad assist</h1>
                    </div>
                }
                content={
                    <div container spacing={3} className="p-24">
                        <div>

                            <h1>Tutorials</h1>
                            <a target="_blank" href="https://onedrive.live.com/embed?cid=875228A9FEB48179&resid=875228A9FEB48179%21534145&authkey=AE6DuB6PMkEfZ2g">As a technician</a>
                            <br />
                            <a target="_blank" href="https://onedrive.live.com/embed?cid=875228A9FEB48179&resid=875228A9FEB48179%21534144&authkey=AMTBln7aSs8Noao">As a radiologist</a>

                        </div>
                        <br />
                        <br />
                        <div>

                            <h1>Keyboard Shortcuts</h1>
                            <a target="_blank">- Press Shift+v to show eye tracker video feed for adjusting face detection</a>
                            <br />
                            <a target="_blank">- Press Shift+r to show gaze dots</a>

                        </div>
                        <br />
                        <br />
                        <div>
                            <h1>Use as a technician</h1>
                                RadAssist is a platform for secure transmission and distribution of radiological data. This platform is designed in a simple way both for technicians and radiologists.
                                <br />
                            <br />
                            <p dir="ltr"><span>If you are a </span><span>medical technician</span><span> then follow the instructions given below:</span></p>
                            <ul>
                                <li dir="ltr">
                                    <p dir="ltr"><span>First, you need to register your account. For registration, just go to the website and click on the &ldquo;USER MENU&rdquo; and select the &ldquo;Register&rdquo; option. If you are registered already then select the &ldquo;LOG In&rdquo; option.</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>To register, you will need to fill out your name and contact number. You must select the technician option for registering as a medical technician. A 8 digit(or more) password must be generated and confirmed by rewriting. If you want to log in, then you will just need your phone number and password.</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>After registration/login, you will find two options. One is to upload x-ray files and the other one is to view the previous reports.</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>To upload x-ray reports, select the &ldquo;Upload-Xray&rdquo; option.</span></p>
                                    <br/>
                                    <ul>
                                <li dir="ltr">
                                    <p dir="ltr"><span>You will get the options to fill up patient information (Patient name, Unique ID/ NID/ Report ID, Age, Gender, Birthdate, Contact number, Previous history).</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>Then you will upload the X-ray report by clicking </span><span><span><img src="https://lh4.googleusercontent.com/pSsrxdIbfrZQKVAUFupa4FwDEJ8XGuSTV4_-o4I4lLrt9r1kwcUVyKTZFdC989whLaP3-V7YIUL29IssBKB2_g37DvhcgcHFTma0w7B446-ttuZeLk-iH7lzQ-AvpeyHDnG_Ujcm" alt="" width="20" height="25" /></span></span><span>&nbsp; upload option.</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>You can write about the details in the &ldquo;Write Details&rdquo; section and can download it if required.</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>When completed just click on the &ldquo;Submit&rdquo; button.</span></p>
                                </li>
                            </ul>
                                </li>
                            </ul>
                            
                            <p dir="ltr"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
                            <ul>
                                <li dir="ltr">
                                    <p dir="ltr"><span>To check the uploaded report, just go back and click the &ldquo;View reports&rdquo; options. There you will find all the reports and corresponding patient&rsquo;s information. You can download the source and report from there if necessary.&nbsp;&nbsp;&nbsp;</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>If you want the details of an individual patient, just click on the name.&nbsp;</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>There you will find the patient&rsquo;s information and medical history.&nbsp;</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>You will get the x-ray report on this page. There are several options (Zoomandpan,&nbsp; &nbsp; &nbsp; reset, tags) for better visualization.&nbsp;</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>You can also check previous reports of the patients.</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>&nbsp;In the &ldquo;Write Report&rdquo; section you can write the report using different tools. You also can download it if required.</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>&nbsp;After completing just click on &ldquo;Submit&rdquo; for submission.</span></p>
                                </li>
                            </ul>
                            <p><span><span><br /><br /></span></span></p>
                            <h1>Use as a radiologist</h1>
                            <p dir="ltr"><span>If you are a </span><span>radiologist</span><span> then follow the instructions given below:</span></p>
                            <br/>
                            <ul>
                                <li dir="ltr">
                                    <p dir="ltr"><span>First, you need to register. For registration, just go to the website and click on the &ldquo;USER MENU&rdquo; and select the &ldquo;Register&rdquo; option. If you are registered already then select the &ldquo;LOG In&rdquo; option.</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>To register, you will need to fill out your name and contact number. You must select the radiologist option for registering as a radiologist. An 8 digit (or more) password must be generated and confirmed by rewriting. If you want to log in, then you will just need your phone number and password.</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>After registration/login, you will find an option to view reports.</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>Select the &ldquo;View Reports&rdquo; option and you will find all the reports with the patient&rsquo;s information and source.</span></p>
                                    <br/>
                                    <ul>
                                <li dir="ltr">
                                    <p dir="ltr"><span>If you want the details of an individual patient, just click on the name.&nbsp;</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>There you will find the patient&rsquo;s information and medical history.&nbsp;</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>You will get the x-ray report on this page. There are several options (Zoomandpan, reset, tags) for better visualization.&nbsp;</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>You can also check previous reports of the patients.</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>In the &ldquo;Write Report&rdquo; section you can write the report using different tools. You also can download it if required.</span></p>
                                </li>
                                <li dir="ltr">
                                    <p dir="ltr"><span>After completing just click on &ldquo;Submit&rdquo; for submission.</span></p>
                                </li>
                            </ul>
                                </li>
                            </ul>
                    
                            <p><span><span>&nbsp;</span></span></p>
                            <ul>
                                <li dir="ltr">
                                    <p dir="ltr"><span>To check the uploaded report, just go back and click the &ldquo;View reports&rdquo; options. There you will find all the reports and corresponding patient information. You can download the source and report from there if necessary.&nbsp;&nbsp;&nbsp;</span></p>
                                </li>
                            </ul>

                        </div>
                    </div>

                }>
            </FusePageSimple>
        );
    }
}

export default Tutorial;