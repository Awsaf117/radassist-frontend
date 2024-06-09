import React from 'react';
import XRayApi from '../../api/backend';
import UserInfo from './UserInfo/UserInfo';
import draftToHtml from 'draftjs-to-html';
import { Container } from '@material-ui/core';
import RichTextEditor from '../text-editor/RichTextEditor';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Editor } from 'react-draft-wysiwyg';
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
import QRCode from 'react-qr-code';

const styles = theme => ({
	root: {
		backgroundColor: theme.palette.background.paper
	},
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

const options = ['Drafted', 'Reviewed', 'Signed off'];

const content = {
    "blocks": [
        {
            "key": "8n2m3",
            "text": "Images provided:",
            "type": "header-four",
            "depth": 0,
            "inlineStyleRanges": [
                {
                    "offset": 0,
                    "length": 16,
                    "style": "color-rgb(0,0,0)"
                },
                {
                    "offset": 0,
                    "length": 16,
                    "style": "bgcolor-rgb(255,255,255)"
                },
                {
                    "offset": 0,
                    "length": 16,
                    "style": "fontsize-medium"
                },
                {
                    "offset": 0,
                    "length": 16,
                    "style": "fontfamily-Roboto, sans-serif"
                },
                {
                    "offset": 0,
                    "length": 16,
                    "style": "color-rgb(102,102,102)"
                },
                {
                    "offset": 0,
                    "length": 16,
                    "style": "BOLD"
                },
                {
                    "offset": 0,
                    "length": 16,
                    "style": "UNDERLINE"
                }
            ],
            "entityRanges": [],
            "data": {
                "text-align": "start"
            }
        },
        {
            "key": "ds0d0",
            "text": "",
            "type": "unstyled",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [],
            "data": {}
        },
        {
            "key": "96q5g",
            "text": "Clinical History:",
            "type": "header-four",
            "depth": 0,
            "inlineStyleRanges": [
                {
                    "offset": 0,
                    "length": 17,
                    "style": "color-rgb(0,0,0)"
                },
                {
                    "offset": 0,
                    "length": 17,
                    "style": "bgcolor-rgb(255,255,255)"
                },
                {
                    "offset": 0,
                    "length": 17,
                    "style": "fontsize-medium"
                },
                {
                    "offset": 0,
                    "length": 17,
                    "style": "fontfamily-Roboto, sans-serif"
                },
                {
                    "offset": 0,
                    "length": 17,
                    "style": "color-rgb(51,51,51)"
                },
                {
                    "offset": 0,
                    "length": 17,
                    "style": "fontsize-1.2em"
                },
                {
                    "offset": 0,
                    "length": 17,
                    "style": "BOLD"
                },
                {
                    "offset": 0,
                    "length": 17,
                    "style": "UNDERLINE"
                }
            ],
            "entityRanges": [],
            "data": {}
        },
        {
            "key": "6irt",
            "text": "",
            "type": "unstyled",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [],
            "data": {}
        },
        {
            "key": "clljn",
            "text": "Clinical Notes: Pathology Report",
            "type": "header-four",
            "depth": 0,
            "inlineStyleRanges": [
                {
                    "offset": 0,
                    "length": 32,
                    "style": "color-rgb(0,0,0)"
                },
                {
                    "offset": 0,
                    "length": 32,
                    "style": "bgcolor-rgb(255,255,255)"
                },
                {
                    "offset": 0,
                    "length": 32,
                    "style": "fontsize-medium"
                },
                {
                    "offset": 0,
                    "length": 32,
                    "style": "fontfamily-Roboto, sans-serif"
                },
                {
                    "offset": 0,
                    "length": 32,
                    "style": "color-rgb(51,51,51)"
                },
                {
                    "offset": 0,
                    "length": 32,
                    "style": "fontsize-1.2em"
                },
                {
                    "offset": 0,
                    "length": 32,
                    "style": "UNDERLINE"
                },
                {
                    "offset": 0,
                    "length": 32,
                    "style": "BOLD"
                }
            ],
            "entityRanges": [],
            "data": {}
        },
        {
            "key": "8ilaa",
            "text": "",
            "type": "unordered-list-item",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [],
            "data": {
                "text-align": "start"
            }
        },
        {
            "key": "3lqqk",
            "text": "Findings:",
            "type": "header-four",
            "depth": 0,
            "inlineStyleRanges": [
                {
                    "offset": 0,
                    "length": 9,
                    "style": "color-rgb(0,0,0)"
                },
                {
                    "offset": 0,
                    "length": 9,
                    "style": "bgcolor-rgb(255,255,255)"
                },
                {
                    "offset": 0,
                    "length": 9,
                    "style": "fontsize-medium"
                },
                {
                    "offset": 0,
                    "length": 9,
                    "style": "fontfamily-Roboto, sans-serif"
                },
                {
                    "offset": 0,
                    "length": 9,
                    "style": "color-rgb(51,51,51)"
                },
                {
                    "offset": 0,
                    "length": 9,
                    "style": "fontsize-1.2em"
                },
                {
                    "offset": 0,
                    "length": 9,
                    "style": "BOLD"
                },
                {
                    "offset": 0,
                    "length": 9,
                    "style": "UNDERLINE"
                }
            ],
            "entityRanges": [],
            "data": {}
        },
        {
            "key": "4lh3m",
            "text": "",
            "type": "unordered-list-item",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [],
            "data": {}
        },
        {
            "key": "550hd",
            "text": "Radiographic Impression:",
            "type": "header-four",
            "depth": 0,
            "inlineStyleRanges": [
                {
                    "offset": 0,
                    "length": 24,
                    "style": "color-rgb(0,0,0)"
                },
                {
                    "offset": 0,
                    "length": 24,
                    "style": "bgcolor-rgb(255,255,255)"
                },
                {
                    "offset": 0,
                    "length": 24,
                    "style": "fontsize-medium"
                },
                {
                    "offset": 0,
                    "length": 24,
                    "style": "fontfamily-Roboto, sans-serif"
                },
                {
                    "offset": 0,
                    "length": 24,
                    "style": "color-rgb(51,51,51)"
                },
                {
                    "offset": 0,
                    "length": 24,
                    "style": "fontsize-1.2em"
                },
                {
                    "offset": 0,
                    "length": 24,
                    "style": "BOLD"
                },
                {
                    "offset": 0,
                    "length": 24,
                    "style": "UNDERLINE"
                }
            ],
            "entityRanges": [],
            "data": {}
        },
        {
            "key": "c847u",
            "text": "",
            "type": "unstyled",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [],
            "data": {}
        }
    ],
    "entityMap": {}
}

class ReportViewer extends React.Component {
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

	handleClickListItem = event => {
		this.setState({
			anchorEl: event.currentTarget,
			unreported: false
		});
		// console.log('FROM SETSTATUS BUTTON', this.state.anchorEl);
	};

	handleMenuItemClick = (event, index, value) => {
		this.setState({
			selectedIndex: index,
			anchorEl: null,
			status: value
		});
		this.state.selectedIndex = index;
		this.state.status = value;
		// console.log('FROM MENUITEM BUTTON', this.state.selectedIndex, this.state.status);
	};

	handleClosestatus = () => {
		this.setState({
			anchorEl: null
		});
	};

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

		// console.log('after setting state onload', this.state.contentState);

		// this.onContentStateChange(contentState);

		if (options.indexOf(result.status) >= 0) {
			// console.log('status found from api', options.indexOf(result.status));
			this.setState({
				selectedIndex: options.indexOf(result.status)
			});
		} else {
			// console.log('status not found from api', options.indexOf(result.status));
			this.setState({
				unreported: true
			});
		}
	};

	componentDidMount() {
		// 	var contentState = stateFromHTML(props.input.value);
		// editorState = EditorState.createWithContent(contentState);
		// this.state = {editorState: editorState};
		XRayApi.getReportById(this.props.match.params.reportId, this.getReportApiCallback);
		this.setState({ dwvModalIsOpen: false, reportId: this.props.match.params.reportId });
	}

	handleClose = () => {
		this.setState({ dwvModalIsOpen: false });
	};
	handleOpen = () => {
		// this.setState({ dwvModalIsOpen: true });
		window.open(
			`/xray/${this.state.reportId}`,
			'_blank',
			`location,height=${window.screen.height},width=${window.screen.width /
				2},scrollbars=yes,status=yes,left=0,top=0`
		);
	};

	onEditorStateChange = editorState => {
		this.setState({
			editorState
		});
		// console.log(editorState);
	};

	onContentStateChange = contentState => {
		console.log(contentState);
		this.setState({
			contentState
		});
	};

	downloadReport = e => {
		downloadReport(
			`
			<br />
			<br />
			<br />
			<br />
			<br />
			<br />

			<h2>ID : ${this.state.patientInfo.unique_id}</h2>
			<table style="width:100%">
			<tr>
				<td>Name:</td>
				<td>${this.state.patientInfo.name}</td>
				<td>Age:</td>
				<td>${this.state.patientInfo.age}</td>
				

			</tr>
			<tr>
				<td>Created:</td>
				<td>${new Date()}</td>
				<td>Gender:</td>
				<td>${this.state.patientInfo.gender}</td>
			</tr>
			</table>

			<br />
			<br />
			<br />
			<br />
			` +
				draftToHtml(this.state.contentState) +
				'</br>' +
				`<h4>Feedback by: ${this.state.author.name}</h4>` +
				`<h4>Designation: ${this.state.author.designation}</h4>` +
				'</br>' +
				'signature' +
				'<br />' +
				`<img src="data:image/png;base64, ${this.state.author.signature}"></img>`
		);
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

	// templateSubmitApiCallback = templateApiResponse => {
	// 	if (templateApiResponse.response.status === 201) {
	// 		this.props.history.push('/report-list');
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
	// onTemplateNameChange = e => {
	// 	e.persist();
	// 	const templateName = e.target.value;
	// 	this.setState({
	// 		templateName
	// 	});
	// };

	handleSubmit = e => {
		const data = {
			report: this.state.contentState,
			status: this.state.status
		};
		this.setState({
			openModal: true
		});

		// console.log('ON FEEEDBACKSUBMIT', data);

		XRayApi.postReportFeedback(this.props.match.params.reportId, data, this.formSubmitApiCallback);
	};

	// GetContent = e => {
	// 	e.persist();
	// 	const content_value = JSON.parse(e.target.value);
	// 	const contentState = convertFromRaw(content_value.blocks ? content_value : content);
	// 	const editorState = EditorState.createWithContent(contentState);
	// 	this.setState({
	// 		contentState: contentState,
	// 		editorState: editorState
	// 	});
	// };

	// getTemplatesApiResponse = apiResponse => {
	// 	const statusCode = apiResponse.response.status;
	// 	if (statusCode === 200) {
	// 		this.setState({ templates: apiResponse.response.data.result });
	// 	} else {
	// 		this.setState({ error: true, errorMessage: '' });
	// 		this.openNotificationWithIcon('error', 'No Templates found', apiResponse.response.data.error.msg);
	// 	}
	// };

	// GetTemplates = e => {
	// 	XRayApi.getTemplates(this.getTemplatesApiResponse);
	// };

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
			reportId
		} = this.state;

		// const templates = this.state.templates;
		const { classes } = this.props;
		return (
			<div className="ReportContainer">
				<Grid fluid>
					<Row>
						<Col xs={6}>
							<div className="LeftContent">
								{xrayUrl.length ? <DwvComponent fileURL={xrayUrl} /> : ''}
							</div>
						</Col>

						<Col xs={6} className="Rightcontent">
							<div>
								<Row>
									<Col xs={12}>
										<Row center="xs">
											<Typography
												variant="h3"
												color="textSecondary"
												gutterBottom
												style={{ marginTop: '5%', width: 'auto' }}
											>
												Patient's Information
											</Typography>
										</Row>
									</Col>
								</Row>
								<Container style={{ marginBottom: '5%', width: 'auto' }}>
									<Card>
										<CardContent>
											<Row>
												{patientInfo && (
													<UserInfo
														userInfo={patientInfo}
														metadata={metadata}
														contentState={reportContent}
														xrayUrl={xrayUrl}
														handleOpen={this.handleOpen.bind(this)}
													/>
												)}
											</Row>

											<Row style={{ marginTop: '20px',marginLeft:'20px' }}>
											<ExpansionPanel>
														<ExpansionPanelSummary
															expandIcon={<ExpandMoreIcon />}
															aria-controls="panel1a-content"
															id="panel1a-header"
														>
															<Typography style={{ fontSize: '20px' }}>
																Previous Reports
															</Typography>
														</ExpansionPanelSummary>
														<ExpansionPanelDetails>
															<Typography>
																{report_feedback.map(itm => (
																	<span>
																		<p style={{ marginTop: '15px' }}>
																			{itm.reviewer.name} -{' '}
																			{moment(itm.created_at).format(
																				'YYYY-MM-DD HH:mm:ss'
																			)}
																		</p>
																		<Card>
																			<CardContent>
																				{parse(
																					draftToHtml(itm.feedback_report)
																				)}
																			</CardContent>
																			
																		</Card>
																	</span>
																))}
															</Typography>
														</ExpansionPanelDetails>
													</ExpansionPanel>

											

												</Row>
												<Row style={{ marginTop: '20px',marginLeft:'20px' }}>
													<div>
														<ExpansionPanel>
															<ExpansionPanelSummary
																expandIcon={<ExpandMoreIcon />}
																aria-controls="panel1a-content"
																id="panel1a-header"
															>
																<Typography style={{ fontSize: '20px' }}>
																	Xray Links
																</Typography>
															</ExpansionPanelSummary>
															<ExpansionPanelDetails>
																<Typography>
																	{xrayUrl.map(link => (
																		<a href={link} target="_blank">
																			<Typography
																				className={clsx(
																					xrayUrl.classes,
																					'flex items-center'
																				)}
																				style={{ fontSize: '12px' }}
																			>
																				{
																					link.split('/')[
																						link.split('/').length - 1
																					]
																				}
																			</Typography>
																			<br />
																		</a>
																	))}
																</Typography>
															</ExpansionPanelDetails>
														</ExpansionPanel>
													</div>
												
											</Row>
										</CardContent>
									</Card>
								</Container>
								<Container style={{ marginBottom: '5%', width: 'auto' }}>
									<Card>
										<CardContent>
											<div style={{ margin: '0%' }}>
												<Grid
													fluid
													style={{
														textAlign: 'left',
														marginBottom: '10px',
														marginTop: '0px'
													}}
												>
													<Row>
														<Col xs={5} style={{ fontSize: '18px', marginTop: '35px' }}>
															Write Report
														</Col>
														<Col xs={6} className={classes.root}>
															<List component="nav" aria-label="Device settings">
																<ListItem
																	button
																	aria-haspopup="true"
																	aria-controls="lock-menu"
																	aria-label="when device is locked"
																	onClick={this.handleClickListItem}
																	style={{
																		border: '2px solid #707070',
																		borderRadius: '25px'
																	}}
																>
																	{unreported ? (
																		<ListItemText
																			style={{}}
																			primary="Set Report Status"
																			secondary="Unreported"
																		/>
																	) : (
																		<ListItemText
																			style={{}}
																			primary="Set Report Status"
																			secondary={options[selectedIndex]}
																		/>
																	)}

																	<ArrowDropDownIcon />
																</ListItem>
															</List>
															<Menu
																id="lock-menu"
																anchorEl={anchorEl}
																keepMounted
																open={Boolean(anchorEl)}
																onClose={this.handleClosestatus}
															>
																{options.map((option, index) => (
																	<MenuItem
																		key={option}
																		selected={index === selectedIndex}
																		onClick={event =>
																			this.handleMenuItemClick(
																				event,
																				index,
																				options[index]
																			)
																		}
																	>
																		{option}
																	</MenuItem>
																))}
															</Menu>
														</Col>
													</Row>
												</Grid>
												<Editor
													editorClassName={"report-editor"}
													editorState={this.state.editorState}
													onEditorStateChange={this.onEditorStateChange}
													onContentStateChange={this.onContentStateChange}
												/>
												{/* <RichTextEditor
													editorState={editorState}
													onEditorStateChange={this.onEditorStateChange}
													onContentStateChange={this.onContentStateChange}
												/> */}
												<Row >
													
													<Col xs={12}>
														<center>
															<Button
																style={{
																	
																	minWidth: '100px'
																}}
																color="primary"
																variant="contained"
																onClick={this.handleSubmit}
															>
																Submit
															</Button>
														</center>
													</Col>
												</Row>
											
											</div>
										</CardContent>
									</Card>
								</Container>
							</div>
						</Col>
					</Row>
				</Grid>
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
								<p id="transition-modal-description">
									Report feedback has been submitted successfully.
								</p>
							</Row>
						</div>
					</Fade>
				</Modal>
			</div>
		);
	}
}

ReportViewer.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ReportViewer);




