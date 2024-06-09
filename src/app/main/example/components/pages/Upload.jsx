import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import AWS from 'aws-sdk';
import RichTextEditor from '../text-editor/RichTextEditor';
import { EditorState } from 'draft-js';
import { Checkbox, notification } from 'antd';
import Symptoms from '../subComponent/Symptoms';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import DwvComponent from '../xrayViewerReport/DwvComponent';
import XRayApi from '../../api/backend';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SnackbarAlert from '../subComponent/SnackbarAlert';
import { flattenErrorMessages, formatDate } from '../../api/utilities';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Grid from '@material-ui/core/Grid';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { Chip, Icon, ListItemText } from '@material-ui/core';
import draftToHtml from 'draftjs-to-html';
// import TemplateComponent from '../template/Template';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Modal from '@material-ui/core/Modal';
import { convertFromRaw } from 'draft-js';
import CloseIcon from '@material-ui/icons/Close';
import Dropzone from 'react-dropzone';
import { stringify } from 'qs';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Row, Col } from 'react-flexbox-grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {S3_BUCKET_NAME} from '../../api/backend';

const content = {
	entityMap: {},
	blocks: []
};
const styles = theme => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3)
	}
});

AWS.config.update({
	accessKeyId: 'AKIAYEIDZNBBWWBMCZHL',
	secretAccessKey: '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',
	region: 'ap-southeast-2',
	signatureVersion: 'v4',
	});

const { Option } = Select;

// app.loadURLs(["https://xraydiacombucket.s3-ap-southeast-1.amazonaws.com/livingroom-34d8be33-7ce5-4fec-a4e8-cddf2753adf1.jpeg"], "")

class UploadComponent extends Component {

	s3 = new AWS.S3();

	constructor(props) {
		super(props);
		// this.handleTemplateSave = this.handleTemplateSave.bind(this);
	}

	state = {
		editorState: undefined,
		contentState: undefined,
		exposure: {
			status: false,
			description: ''
		},
		smoking: {
			status: false,
			description: ''
		},
		pneumonia: {
			status: false,
			description: ''
		},
		items: ['exposure', 'smoking', 'pneumonia'],
		name: '',
		age: 17,
		gender: 'male',
		uploadStatus: false,
		uploadUrls: [],
		data: [],
		value: undefined,
		uniqueId: undefined,
		report: {},
		errorMessages: [],
		showModal: false,
		templateName: null,
		templates: {},
		open: false,
		openModal: false,
		allDcms:['a','b']
	};

	componentDidMount() {
		this.setState({ dwvModalIsOpen: false });
		this.s3.listObjects({
			Bucket: 'openbucketbdnew',
			Delimiter: '',
			Prefix: '',
		  }, (err, data) => {
			if (err) {
			  console.log(err, err.stack);
			} else {
				const state = { ...this.state }
				var list=data.Contents.map(c=>{return {name:c.Key,link:`https://openbucketbdnew.s3.ap-southeast-2.amazonaws.com/${c.Key}`}})
			  	state.allDcms=list
				this.setState(state);
			}
		  })
	}

	


	apiResponse = apiResponse => {
		const report = apiResponse.response.data.result;
		if (apiResponse.response.status === 200) {
			console.log("report-urls: ", report.url);
			this.setState({
				editorState: EditorState.createEmpty(),
				contentState: null,
				exposure: {
					status: false,
					description: ''
				},
				smoking: {
					status: false,
					description: ''
				},
				pneumonia: {
					status: false,
					description: ''
				},
				
				items: ['exposure', 'smoking', 'pneumonia'],
				name: report.patient_name,
				age: report.age,
				gender: report.gender,
				uploadStatus: true,
				uploadUrl: report.url,
				data: [],
				value: undefined,
				uniqueId: undefined,
				phone: undefined,
				report: report
			});
		} else {
			this.setState({ error: true, errorMessage: '' });
			this.openNotificationWithIcon('error', 'Login Failed', apiResponse.response.data.error.msg);
		}
	};

	// templateApiResponse = templateApiResponse => {
	// 	const template = templateApiResponse.response.data.result;

	// 	if (templateApiResponse.response.status === 200) {
	// 		this.setState({
	// 			author: {
	// 				designation: ['Doctor', 'Radiologist'],
	// 				id: undefined,
	// 				name: undefined,
	// 				phone_number: undefined
	// 			},

	// 			template_content: template.template_content,
	// 			template_id: undefined,
	// 			template_name: template.template_name
	// 		});
	// 	} else {
	// 		this.setState({ error: true, errorMessage: '' });
	// 		this.openNotificationWithIcon('error', 'Login Failed', templateApiResponse.response.data.error.msg);
	// 	}
	// };

	getReportById = id => {
		XRayApi.getReportById(id, this.apiResponse);
	};

	onEditorStateChange = editorState => {
		this.setState({
			editorState
		});
	};

	onContentStateChange = contentState => {
		this.setState({
			contentState
		});
		// console.log('FROM CONTENTSTATECHANGE', contentState);
	};

	// GetContent = e => {
	// 	e.persist();
	// 	const content_value = JSON.parse(e.target.value);
	// 	console.log(content_value)
		
	// 	const contentState = convertFromRaw(content_value.blocks ? content_value : content);
	// 	const editorState = EditorState.createWithContent(contentState,null);
		
	// 	this.setState({
	// 		contentState: contentState,
	// 		editorState: editorState
	// 	});
		
	// };

	// onTemplateNameChange = e => {
	// 	e.persist();
	// 	const templateName = e.target.value;
	// 	this.setState({
	// 		templateName
	// 	});
	// };

	genderFieldOnChange = e => {
		this.setState({ gender: e.target.value });
	};

	dcmFieldOnChange = e => {
		console.log(e.target.value)
		var state={...this.state}
		state.uploadUrls=e.target.value
		this.setState(state)
	};

	onNameFieldChange = e => {
		e.persist();
		const name = e.target.value;
		this.setState({ name });
	};

	ageFieldOnChange = e => {
		e.persist();
		const age = parseInt(e.target.value);
		this.setState({ age });
	};

	onPhoneNumberChange = e => {
		e.persist();
		const phone = e.target.value;
		this.setState({ phone });
	};

	onUniqueIDFieldChange = e => {
		e.persist();
		const uniqueId = e.target.value;
		this.setState({ uniqueId });
	};

	handleCheck = e => {
		e.persist();
		const state = { ...this.state };
		state[e.target.name]['status'] = e.target.checked;
		state[e.target.name]['description'] = e.target.checked ? state[e.target.name]['description'] : '';
		this.setState(state);
	};

	handleInputField = prop => e => {
		e.persist();
		const state = { ...this.state };
		state[e.target.name.toLowerCase()]['description'] = e.target.value;
		this.setState(state);
	};

	formSubmitApiCallback = apiResponse => {
		if (apiResponse.response.status === 201) {
			setTimeout(() => {
				this.props.history.push('/report-list');
			}, 1000);
		} else {
			const errorMessages = flattenErrorMessages(apiResponse);
			this.setState({ errorMessages });
		}
	};

	handleSubmit = e => {
		
		const data = {
			// reviewers: [this.state.value],
			patient_name: this.state.name,
			patient_age: this.state.age,
			patient_gender: this.state.gender,
			patient_phone_number: this.state.phone,
			unique_id: this.state.uniqueId,
			urls: this.state.uploadUrls,
			metadata: {
				previous_history: {
					exposure: this.state.exposure,
					smoking: this.state.smoking,
					pneumonia: this.state.pneumonia,
					detail_report: this.state.contentState
				}
			},
			status: 'Unreported'
		};
		this.setState({
			openModal: true
		});
		console.log('OPENED');
		XRayApi.createReport(data, this.formSubmitApiCallback);
	};

	// templateSubmitApiCallback = templateApiResponse => {
	// 	if (templateApiResponse.response.status === 201) {
	// 		this.props.history.push('/upload');
	// 	} else {
	// 		const errorMessages = flattenErrorMessages(templateApiResponse);
	// 		this.setState({ errorMessages });
	// 	}
	// };

	// handleTemplateSave = e => {
	// 	// console.log("TEMPLATE IS CLICKED", this.state.showModal)
	// 	const data = {
	// 		template_content: this.state.contentState,

	// 		template_name: this.state.templateName
	// 	};
	// 	XRayApi.createTemplate(data, this.templateSubmitApiCallback);
	// };

	// getTemplatesApiResponse = apiResponse => {
	// 	const statusCode = apiResponse.response.status;
	// 	if (statusCode === 200) {
	// 		console.log(apiResponse.response.data.result)
	// 		this.setState({ templates: apiResponse.response.data.result });
	// 	} else {
	// 		this.setState({ error: true, errorMessage: '' });
	// 		this.openNotificationWithIcon('error', 'No Templates found', apiResponse.response.data.error.msg);
	// 	}
	// };

	GetTemplates = e => {
		XRayApi.getTemplates(this.getTemplatesApiResponse);
	};

	handleDialogClose = e => {
		this.setState = { showModal: false };
	};

	downloadReport = e => {
		var header =
			"<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
			"xmlns:w='urn:schemas-microsoft-com:office:word' " +
			"xmlns='http://www.w3.org/TR/REC-html40'>" +
			"<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
		var footer = '</body></html>';
		var sourceHTML = header + draftToHtml(this.state.contentState) + footer;

		var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
		var fileDownload = document.createElement('a');
		document.body.appendChild(fileDownload);
		fileDownload.href = source;
		fileDownload.download = 'document.doc';
		fileDownload.click();
		document.body.removeChild(fileDownload);
	};

	openNotificationWithIcon = (type, message, description) => {
		notification[type]({
			message: message,
			description: description
		});
	};

	radiologistSearchApiCallback = apiResponse => {
		const data = apiResponse.response.data.result.map(item => {
			return { value: item.id, title: item.name };
		});
		this.setState({ data });
	};

	onRadiologistSearch = name => {
		XRayApi.userSearch(name, this.radiologistSearchApiCallback);
	};

	onRadiologistSearchHandleChange = title => {
		const value = this.state.data.filter(item => item.title === title)[0].value;
		this.setState({ value });
	};

	onIDFieldChange = e => {
		e.persist();
		const uniqueId = e.target.value;
		this.setState({ uniqueId });
	};

	handleClose = () => {
		this.setState({ dwvModalIsOpen: false });
	};
	handleOpen = () => {
		this.setState({ dwvModalIsOpen: true });
	};

	loadMetaData = () => {
		var dwv = window.dwv;
		var app = new dwv.App();
		// initialise app
		app.init({
			containerDivId: 'x',
			tools: {}
		});
		app.loadURLs([this.state.uploadUrls], '');
		app.addEventListener('load-progress', function (event) {
			// console.log({ loadProgress: event.loaded });
		});
		app.addEventListener('load', function (event) {
			setTimeout(() => {
				console.log({ tags: dwv.utils.objectToArray(app.getMetaData()) });
			}, 5000);
		});
	};

	getSignedUrlAPICallback = async (apiResponse, file) => {
		const statusCode = apiResponse.response.status;
		//console.log("see: " , apiResponse.response.data.fields.key);

		

		if (statusCode === 200) {

			try{
				const state = { ...this.state };

				const params = { 
					Bucket: 'openbucketbdnew', 
					Key: `${uuidv4()}.DCM`, 
					Body: file 
				  };
				  const { Location } = await this.s3.upload(params).promise()

		
	
				  state['uploadUrls'].push(
					Location
				);
	
				  this.openNotificationWithIcon('success', 'Success!', 'Your file has been uploaded');
					
				 
				 
				  state['uploadStatus'] = true;
					this.setState(state);
			}catch(err){
				this.openNotificationWithIcon('error', 'Failed!', 'File upload failed');
				console.log(err);
			}

			
			// var key = apiResponse.response.data.fields.key;
			// var ext = key.split('.').pop();
			// if(ext==="undefined"){
			// 	key = key.replace(".undefined", "");
			// 	//console.log("key: ", key);
			// }
			// const formData = new FormData();
			// const state = { ...this.state };

			// state['uploadUrls'].push(
			// 	`https://${S3_BUCKET_NAME}.s3-ap-southeast-1.amazonaws.com/` + key
			// );

			
			// Object.keys(apiResponse.response.data.fields).forEach(key => {
			// 	formData.append(key, apiResponse.response.data.fields[key]);
			// });
			// formData.append('file', file);

			// const config = {
			// 	headers: {
			// 		'Content-Type': 'multipart/form-data'
			// 	}
			// };
			// const bucketName = S3_BUCKET_NAME;
			// let s3Url = 'https://' + bucketName + '.s3-accelerate.amazonaws.com';
			// //state['uploadUrl'] = "https://xbulktest.s3-ap-southeast-1.amazonaws.com/" + response.data.fields.key;
			// axios
			// 	.post(s3Url, formData, config)
			// 	.then(response => {
			// 		this.openNotificationWithIcon('success', 'Success!', 'Your file has been uploaded');
			// 		state['uploadStatus'] = true;
			// 		this.setState(state);
			// 	})
			// 	.catch(error => {
			// 		this.openNotificationWithIcon('error', 'Failed!', 'File upload failed');
			// 		console.log(error.response);
			// 	});
		} else {
			this.setState({ error: true, errorMessage: '' });
			this.openNotificationWithIcon(
				'error',
				'Image URL is not working at this moment.',
				apiResponse.response.data.error.msg
			);
		}
	};
	saveHeatmapAPICallback(){
		console.log('Gaze data upload successful');
	}
	saveGazeHeatmapAPICallback = async (apiResponse, file) => {
		const statusCode = apiResponse.response.status;
		console.log(apiResponse.response);
		if (statusCode === 200) {
			
			const params = { 
				Bucket: 'radassist-dev', 
				Key: apiResponse.response.data.fields.key, 
				Body: file 
			  };
			  const { Location } = await this.s3.upload(params).promise()
			
			
			
			// const formData = new FormData();
			// Object.keys(apiResponse.response.data.fields).forEach(key => {
			// 	//if(key!=='signature')
			// 		formData.append(key, apiResponse.response.data.fields[key]);
			// 	//else
			// 		//formData.append('x-amz-signature', apiResponse.response.data.fields[key]);
			// });
			// formData.append('file', file);
			// const config = {
			// 	headers: {
			// 		'Content-Type': 'multipart/form-data'
			// 	}
			// };

			// console.log(apiResponse.response.data.fields)

			
			// let s3Url = apiResponse.response.data.url;
			// axios
			// 	.post(s3Url, formData, config)
			// 	.then(response => {
			// 		console.log(response);
			// 	})
			// 	.catch(error => {
			// 		console.log(error);
			// 	});
			const data ={
				view_url : '/upload',
				s3_url : Location
			}
			XRayApi.saveHeatmap(data,this.saveHeatmapAPICallback)
		}
		else {
			console.log('Heatmap upload failed!');
		}
	}



	onDropGetSignedURL = file => {
		XRayApi.getSignedUrl(file, this.getSignedUrlAPICallback);
		XRayApi.saveGazeHeatmap(file, this.saveGazeHeatmapAPICallback);
	};

	render() {
		const {
			uploadStatus,
			uploadUrls: uploadUrls,
			value,
			data: options,
			errorMessages,
			editorState,
			open
		} = this.state;
		// editorState = this.state.editorState
		const templates = this.state.templates;
		const { classes } = this.props;

		return (
			<FusePageSimple
				header={
					<div className="p-24">
						<h4>{'Upload Xray'}</h4>
					</div>
				}
				contentToolbar={
					<div className="px-24">
						<h4>Upload DICOM, DCM, PNG, JPEG</h4>
					</div>
				}
				content={
					<div className="p-24">
						<div style={{ maxWidth: '70%' }}>
							{errorMessages &&
								errorMessages.map((index, msg) => (
									<SnackbarAlert key={index} severity="error">
										{msg}
									</SnackbarAlert>
								))}
						</div>

						<div style={{ marginBottom: '20px' }}>
							<h1>Fill out Patient's Information</h1>
							<h6>Field marked with * are mandatory</h6>
						</div>

						<div style={{ textAlign: 'left', marginBottom: '20px', marginTop: '10px' }}>
							<div style={{ maxWidth: '70%', marginBottom: '20px' }}>
								<TextField
									label={`Patient's Fullname`}
									variant="outlined"
									name={'name'}
									onChange={this.onNameFieldChange}
									fullWidth
									required
								/>
							</div>

							<div style={{ maxWidth: '70%', marginBottom: '20px' }}>
								<TextField
									label={`Unique ID / NID / Report ID`}
									variant="outlined"
									name={'uniqueId'}
									onChange={this.onUniqueIDFieldChange}
									fullWidth
									required
								/>
							</div>

							<div style={{ marginBottom: '20px' }}>
								<TextField
									style={{ marginRight: '5px' }}
									label={`Age`}
									type="number"
									variant="outlined"
									name={'age'}
									onChange={this.ageFieldOnChange}
									required
								/>
								<Select
									size="small"
									defaultValue="male"
									variant="outlined"
									onChange={this.genderFieldOnChange}
									required
								>
									<MenuItem value="male">Male</MenuItem>
									<MenuItem value="female">Female</MenuItem>
								</Select>
							</div>

							<div style={{ maxWidth: '70%', marginBottom: '20px' }}>
								<TextField
									label={`Patient's Contact Number`}
									variant="outlined"
									name={'phone'}
									onChange={this.onPhoneNumberChange}
									fullWidth
								/>
							</div>
						</div>

						<div>
							{this.state.items && (
								<div style={{ textAlign: 'left', marginBottom: '5px', marginTop: '50px' }}>
									<span style={{ fontSize: '18px' }}>Patient's Previous History</span>
								</div>
							)}
							{this.state.items.map(item => (
								<div key={item}>
									<Symptoms
										name={item}
										handleCheck={this.handleCheck}
										handleInputField={this.handleInputField}
										checkboxName={item.toUpperCase()}
										showDraft={this.state[item]['status']}
										description={this.state[item]['description']}
									/>
								</div>
							))}
						</div>

						<div>
							<div style={{ textAlign: 'left', marginBottom: '2px', marginTop: '50px' }}>
								<span style={{ fontSize: '18px' }}>Select XRay</span>
							</div>
							<div style={{ textAlign: 'left' }}>
							
								<Select
									fullWidth
									label='Select A DCM File'
									variant="outlined"
									multiple
									renderValue={(selected) => (
										<div>
											{this.state.uploadUrls.map((value) => (
												<Chip
													key={value}
													label={value.split('/')[value.split('/').length-1]}
												/>
											))}
										</div>
										)}
									value={this.state.uploadUrls}
									onChange={this.dcmFieldOnChange}
									required
								>
									{
										this.state.allDcms.map(d=>{
											return (
												<MenuItem value={d.link} key={d.link}>
													<Checkbox checked={this.state.uploadUrls.indexOf(d.link) > -1} />
              										<ListItemText primary={d.name} />
												</MenuItem>
											)
										})
									}
								</Select>
							</div>
						</div>
						<hr />

						{uploadStatus && (
							<div>
								<Modal
									open={this.state.dwvModalIsOpen}
									onClose={this.handleClose}
									aria-labelledby="simple-modal-title"
									aria-describedby="simple-modal-description"
								>
									{
										<div style={{ width: '100%', height: '100%' }}>
											<IconButton
												style={{ position: 'absolute', right: '0px' }}
												aria-label="close"
												color="red"
												size="big"
												onClick={this.handleClose}
											>
												<CloseIcon style={{ color: 'red' }} fontSize="inherit" />
											</IconButton>
											<DwvComponent fileURL={uploadUrls} />
										</div>
									}
								</Modal>
								<Button color="primary" variant="contained" onClick={this.handleOpen}>
									Open Xray Viewer
								</Button>
								{uploadUrls.map(link => (
									<div>
										<br />
										<a style={{ 'margin-left': '10px' }} href={link} target="_blank">
											Download Xray - {link.split('/')[link.split('/').length - 1]}
										</a>
									</div>
								))}
							</div>
						)}

						<div>
							<div style={{ textAlign: 'left', marginBottom: '10px', marginTop: '50px' }}>
								<span style={{ fontSize: '18px' }}>Write Details</span>
							</div>

							{/* <div style={{ marginTop: '1em', marginBottom: '2em' }}>
								<FormControl variant="standard" style={{ width: '25em', marginRight: '15em' }}>
									<InputLabel htmlFor="outlined-age-native-simple">
										Select from Your Hospital Templates
									</InputLabel>
									<Select
										native
										label="Select-Template"
										onClick={this.GetTemplates}
										onChange={this.GetContent}
										inputProps={{
											
											id: 'outlined-age-native-simple',
										  }}
									>
										{templates.length &&
											templates.map(x => (
												<option
													key={x.template_id}
													value={JSON.stringify(x.template_content)}
													style={{ border: 'solid' }}
													// onClick={this.handleGetContent}
												>
													{x.template_name}
												</option>
											))}
									</Select>
								</FormControl>
								<TextField
									onChange={this.onTemplateNameChange}
									id="filled-basic"
									label="Enter template name here"
									variant="filled"
									required
									style={{ marginLeft: '15px' }}
								/>

								<Button
									style={{ marginLeft: '25px', marginTop: '10px' }}
									color="primary"
									variant="contained"
									onClick={this.handleTemplateSave}
								>
									Save as template
								</Button>
							</div> */}

							{/* <RichTextEditor
								onEditorStateChange={this.onEditorStateChange}
								editorState={editorState}
								onContentStateChange={this.onContentStateChange}
							/> */}
							<Editor
								editorClassName={"report-editor"}
								onEditorStateChange={this.onEditorStateChange}
								editorState={editorState}
								onContentStateChange={this.onContentStateChange}
							/>
						</div>

						<div
							style={{
								marginTop: '30px',
								textAlign: 'left',
								display: 'none'
							}}
						>
							<div style={{ textAlign: 'left', marginBottom: '10px', marginTop: '50px' }}>
								<span style={{ fontSize: '18px' }}>Select Radiologist for review</span>
							</div>
							<Autocomplete
								onInputChange={(e, value) => {
									this.onRadiologistSearch(value);
								}}
								onChange={e => this.onRadiologistSearchHandleChange(e.target.innerText)}
								options={options}
								getOptionLabel={option => option.title}
								style={{ width: 400 }}
								renderInput={params => (
									<TextField {...params} label="Type Radiologist Name" variant="outlined" />
								)}
								clearOnEscape
							/>
						</div>

						<Button
							style={{ marginTop: '50px', left: -150, marginLeft: '50%', minWidth: '300px' }}
							color="primary"
							variant="contained"
							onClick={this.handleSubmit}
						>
							Submit
						</Button>

						<Dialog aria-labelledby="simple-dialog-title" open={open}>
							<DialogTitle id="simple-dialog-title">Template is Saved</DialogTitle>
						</Dialog>
						<Modal
							aria-labelledby="transition-modal-title"
							aria-describedby="transition-modal-description"
							className={classes.modal}
							open={this.state.openModal}
							onClose={this.state.openModal}
							BackdropComponent={Backdrop}
							BackdropProps={{
								timeout: 10000
							}}
						>
							<Fade in={this.state.openModal}>
								<div className={classes.paper}>
									<Row>
										<CheckCircleIcon style={{ marginRight: '2%' }} />
										<h2 id="transition-modal-title">Success!</h2>
									</Row>
									<Row>
										<p id="transition-modal-description">Report has been created successfully.</p>
									</Row>
								</div>
							</Fade>
						</Modal>
					</div>
				}
			></FusePageSimple>
		);
	}
}
UploadComponent.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UploadComponent);
