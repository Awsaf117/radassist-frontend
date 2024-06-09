import { Helmet } from "react-helmet";
import { Editor } from 'react-draft-wysiwyg';
import QRCode from "react-qr-code";
import React from 'react';
import XRayApi from '../../api/backend';
import UserInfo from './UserInfo/UserInfo';
import draftToHtml from 'draftjs-to-html';
import { Container } from '@material-ui/core';
import RichTextEditor from '../text-editor/RichTextEditor';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { Icon } from '@material-ui/core';
import { flattenErrorMessages, formatDate, downloadReport } from '../../api/utilities';
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import parse from 'html-react-parser';
import DwvComponent from '../xrayViewerReport/DwvComponent';
import Modal from '@material-ui/core/Modal';
import { convertFromRaw } from 'draft-js';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

// import './publicreport.css';




const content = {
	entityMap: {},
	blocks: []
};

class ReportViewerPublic extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			patientInfo: undefined,
			reportContent: undefined,
			metadata: undefined,
			xrayUrl: [],
			editorState: EditorState.createEmpty(),
			contentState: undefined,
			report_feedback: [],
			anchorEl: null,
			unreported: false,
			openModal: false
			// templates: {},
			// templateName: null
		};
	}




	getReportApiCallback = apiResponse => {
		const result = apiResponse.response.data.result;
		// console.log('onload', result.report);
		const contentState = convertFromRaw(result.report.blocks ? result.report : content);
		const editorState = EditorState.createWithContent(contentState);
		this.setState({
			patientInfo: result.patient_info,
			metadata: result.metadata,
			reportContent: draftToHtml(result.metadata.previous_history.detail_report),
			xrayUrl: result.url ? [result.url] : result.urls,
			report: result.report,
			contentState: contentState,
			editorState: editorState,
			report_feedback: result.report_feedback,
			author: result.author,
			createdAt: result.created_at,
			status: result.status
		});

	console.log({
			patientInfo: result.patient_info,
			metadata: result.metadata,
			reportContent: draftToHtml(result.metadata.previous_history.detail_report),
			xrayUrl: result.url ? [result.url] : result.urls,
			report: result.report,
			contentState: contentState,
			editorState: editorState,
			report_feedback: result.report_feedback,
			author: result.author,
			createdAt: result.created_at,
			status: result.status
		})

	
	};

	componentDidMount() {
		XRayApi.getReportById(this.props.match.params.reportId, this.getReportApiCallback);
		this.setState({ dwvModalIsOpen: false, reportId: this.props.match.params.reportId });
	}

	


	render() {
		let {
			patientInfo,
			metadata,
			reportContent,
			xrayUrl,
			editorState,
			report,
			report_feedback,
			anchorEl,
			selectedIndex,
			status,
			unreported,
			reportId,
			createdAt
		} = this.state;

		if(!patientInfo)return <h2 style={{width:'100vw',height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading Report...</h2>
		return (
			<div className="no-tailwind">
				<Helmet>
         <link rel="stylesheet" href="public_report.css" />
     </Helmet>
<div className="report-container">
        <img src="radassist_logo.svg" alt="RadAssist Logo" className="logo"/>
		
		<QRCode value={'https://radassist.net/report-public/'+this.props.match.params.reportId} size={window.innerWidth>=830?130:80} className="qr"/>
        <header className="report-header">
            <h1>Radassist</h1>
            <div className="report-details">
                <p><b><u>Patient:</u></b> <br/>{patientInfo.name}</p>
                <p>Age: {patientInfo.age} years</p>
                <p>Gender: {patientInfo.gender}</p>
                <p>{report_feedback[report_feedback.length-1].created_at}</p>

            </div>
        </header>
        <section className="report-body">
            <div className="referring-doctor">
                <p><b><u>Referring Doctor:</u></b> {report_feedback[report_feedback.length-1].reviewer.name}</p>
            </div>
            <div className="scan-details">
                <p><b><u>Date of Scan:</u></b> {createdAt}</p>
            </div>
            <Editor
				editorState={editorState}
				readOnly={true}
				toolbarClassName='hide-toolbar'


			/>
        </section>
        <footer className="report-footer">
            <p>Radiologist name and signature:</p>
            <img className="signature" src={report_feedback[report_feedback.length-1].reviewer.signature}/>
            <p>{report_feedback[report_feedback.length-1].reviewer.name}</p>
            <p>{report_feedback[report_feedback.length-1].reviewer.qualification}</p>
        </footer>
    </div>
			</div>
			
		);
	}
}



export default ReportViewerPublic
