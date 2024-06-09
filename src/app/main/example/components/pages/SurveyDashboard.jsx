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
import moment from 'moment';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { dateFnsLocalizer } from 'react-big-calendar';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DWVComponentPage from './DWVComponentPage';
import './ReportViewer.css';
import { CheckboxFormsy, TextFieldFormsy } from '@fuse/core/formsy';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Radio from '@material-ui/core/Radio';
import Formsy from 'formsy-react';
import { useRef, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import { createRef } from 'react';
import jsZip from 'jszip' ;
const styles = theme => ({
	root: {
		flexGrow: 1,
		maxWidth: 752
	},
	demo: {
		backgroundColor: theme.palette.background.paper
	},
	title: {
		margin: theme.spacing(4, 0, 2)
	}
});

class SurveyDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isFormValid: false,
			dense: false,
			secondary: false,
			checked: undefined,
			update: false,
			surveyList: [],
			file: null
		};

		this.updateCheckBox = createRef();
		this.handleUpdateSurvey = this.handleUpdateSurvey.bind(this);
		this.handleCreateSurvey = this.handleCreateSurvey.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	getSurveyList() {
		XRayApi.getSurveyList(this.getSurveyApiCallback);
	}

	handleCreateSurvey (e) {
		let surveyName = localStorage.getItem("surveyName");
		XRayApi.createSurvey(surveyName, this.state.file, this.createSurveyApiCallback);
	}
	
	handleUpdateSurvey(survey_id, surveyName) {
		let data = this.updateCheckBox.current.getModel();
		this.setState({
			update: true
		});
		XRayApi.updateSurvey(survey_id, surveyName, data, this.updateSurveyApiCallback);
	};

	handleDeleteSurvey(survey_id) {
		XRayApi.deleteSurvey(survey_id,this.deleteSurveyApiCallback);
	}

	createSurveyApiCallback = apiResponse => {
		if (apiResponse.response.status === 201) {
			this.getSurveyList();
			console.log(apiResponse.response.data)
		} else {
			console.log(apiResponse.response)
		}
	}
	updateSurveyApiCallback = apiResponse => {
		if (apiResponse.response.status === 201) {
			this.getSurveyList();
			console.log(apiResponse.response)
		} else {
			console.log(apiResponse.response)
		}
	}

	deleteSurveyApiCallback = apiResponse => {
		if (apiResponse.response.status === 201) {
			this.getSurveyList();
			console.log(apiResponse.response)
		} else {
			console.log(apiResponse.response)
		}
	}

	getSurveyApiCallback = apiResponse => {
		if (apiResponse.response.status === 201) {
			this.setState({surveyList: apiResponse.response.data.result});
		} else {
			console.log(apiResponse.response)
		}
	}

	componentDidMount() {
		this._handleUpload();
		this.getSurveyList();
	}

	enableButton = event => {
        this.setState({isFormValid: true});
	}
	
	onChange(e) {
		
		var file = e.target.files[0];
		jsZip.loadAsync(file).then(function (zip) {
			Object.keys(zip.files).forEach(function (filename) {
				if (filename.split('.')[1] === 'json') {
					zip.files[filename].async('string').then(function (fileData) {
						let data = JSON.parse(fileData);
						localStorage.setItem("surveyName", data["survey_name"]);
					})
				}
			
			})
		})
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			this.setState({file: reader.result});
		}.bind(this);
		reader.onerror = function (error) {
			console.log("Error: ", error);
		};
		
	}

	_handleUpload() {
		var fileInputTextDiv = document.getElementById('file_input_text_div');
		var fileInput = document.getElementById('file_input_file');
		var fileInputText = document.getElementById('file_input_text');

		fileInput.addEventListener('change', changeInputText);
		fileInput.addEventListener('change', changeState);

		function changeInputText() {
			var str = fileInput.value;
			var i;
			if (str.lastIndexOf('\\')) {
				i = str.lastIndexOf('\\') + 1;
			} else if (str.lastIndexOf('/')) {
				i = str.lastIndexOf('/') + 1;
			}
			fileInputText.value = str.slice(i, str.length);
			localStorage.setItem("surveyFolderName", str.slice(i, str.length));
		}

		function changeState() {
			if (fileInputText.value.length != 0) {
				if (!fileInputTextDiv.classList.contains('is-focused')) {
					fileInputTextDiv.classList.add('is-focused');
				}
			} else {
				if (fileInputTextDiv.classList.contains('is-focused')) {
					fileInputTextDiv.classList.remove('is-focused');
				}
			}
		}
	}

	render() {
		let { dense, secondary, checked, update } = this.state;
		const { classes } = this.props;
		return (
			<div>
				<Grid fluid>
					<Row center="xs">
						<Col xs={6}>
							<Typography variant="h4" style={{ paddingTop: '25px' }}>
								Survey Dashboard
							</Typography>
						</Col>
					</Row>
					<Row>
						<Grid item xs={12} md={6}>
							<Typography className="h2 mb-24" style={{ paddingTop: '25px' }}>
								Create a new survey
							</Typography>
							<Formsy className="flex flex-col justify-center"
							        onValid={this.enableButton}
									ref="form">
								<Row style={{ marginLeft: '40px' }}>
									{/* <TextFieldFormsy
										className="mb-16"
										type="text"
										name="name"
										label="Survey data"
										validations={{
											minLength: 4
										}}
										validationErrors={{
											minLength: 'Min character length is 4'
										}}
										required
									/> */}
									<div class="file_input_div">
										<div class="file_input">
											<label class="image_input_button mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-js-ripple-effect mdl-button--colored">
												<i class="material-icons">file_upload</i>
												<input id="file_input_file" class="none" type="file" onChange={this.onChange}/>
											</label>
										</div>
										<div
											id="file_input_text_div"
											class="mdl-textfield mdl-js-textfield textfield-demo"
										>
											<input
												class="file_input_text mdl-textfield__input"
												type="text"
												disabled
												readonly
												id="file_input_text"
												
											/>
											<label class="mdl-textfield__label" for="file_input_text"></label>
										</div>
									</div>
								</Row>

								<Row style={{ marginLeft: '40px' }}>
									

									<Button
										type="submit"
										variant="contained"
										color="primary"
										className="mx-auto mt-32 mb-80"
										aria-label="LOG IN"
										style={{
											marginBottom: '1rem',
											marginTop: '2rem',
											marginLeft: 'none',
											marginRight: 'none'
										}}
										onClick={this.handleCreateSurvey}
									>
										Create Survey
									</Button>
								</Row>
							</Formsy>
						</Grid>
					</Row>
					<Row>
						<Grid item xs={12} md={6}>
							<Typography variant="h4" className={classes.title}>
								Survey List
							</Typography>
							<div className={classes.demo}>
								<List dense={dense}>
									<ListItem>
										<Grid fluid>
											{this.state.surveyList.map((survey, i) => (	
											<Row>
												<Col>
													<ListItemAvatar>
														<Avatar>
															<FolderIcon />
														</Avatar>
													</ListItemAvatar>
												</Col>
												<Col xs={1} key={i}>
													<ListItemText
													    primary={survey["surveyName"]}
														secondary={secondary ? 'Secondary text' : null}
													/>
												</Col>

												<Col key={i}>
													<Formsy ref={this.updateCheckBox} onChange={() => this.handleUpdateSurvey(survey["id"],survey["surveyName"])}>
														<CheckboxFormsy
															name="showImage"
															value={survey["showImage"]}
															label="show image"
														/>
														<CheckboxFormsy
															name="showFreeTextInput"
															value={survey["showFreeTextInput"]}
															label="show free text input"
														/>
														<CheckboxFormsy
															name="enableDrawFrame"
															value={survey["enableDrawFrame"]}
															label="enable drawing"
														/>
														<CheckboxFormsy
															name="enablePrediction"
															value={survey["enablePrediction"]}
															label="enable prediction"
														/>
														<CheckboxFormsy
															name="enableSurveyQuestions"
															value={survey["enableSurveyQuestions"]}
															label="enable survey questions"
														/>
													</Formsy>
												</Col>
												<Col key={i}>

													<IconButton edge="end" aria-label="delete" onClick={() => this.handleDeleteSurvey(survey["id"])}>
														<DeleteIcon />
													</IconButton>
												</Col>
												
											</Row>
											))}
										</Grid>
									</ListItem>
								</List>
							</div>
						</Grid>
					</Row>
				</Grid>
			</div>
		);
	}
}

SurveyDashboard.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SurveyDashboard);
