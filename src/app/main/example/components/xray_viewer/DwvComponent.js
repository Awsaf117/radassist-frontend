import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import TagsTable from './TagsTable';
import './DwvComponent.scss';
import RichTextEditor from '../text-editor/RichTextEditor';
import { Icon } from '@material-ui/core';
import draftToHtml from 'draftjs-to-html';
import XRayApi from '../../api/backend';
import { Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import { Layout } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import { API_BASE_URL_LOCAL } from '../../api/backend';
import {capture, OutputType} from 'html-screen-capture-js';
import domtoimage from 'dom-to-image';
import config from 'app/fuse-layouts/layout3/Layout3Config';
import Modal from 'react-bootstrap/Modal'
import Joyride, { ACTIONS, CallBackProps, STATUS, Step, StoreHelpers } from 'react-joyride';
import { includes } from 'lodash';
var dwv = window.dwv;
var app = new dwv.App();
var urlParams = '';
var inc = '500px';
window.screenshots = [];
//import queryString from 'query-string';
// decode query
// dwv.utils.decodeQuery = dwv.utils.base.decodeQuery;
dwv.utils.decodeQuery = dwv.utils.decodeQuery;
// progress
dwv.gui.displayProgress = function() {};
// get element
dwv.gui.getElement = dwv.gui.base.getElement;
// // refresh element
dwv.gui.refreshElement = dwv.gui.base.refreshElement;

// Image decoders (for web workers)
dwv.image.decoderScripts = {
	jpeg2000: 'node_modules/dwv/decoders/pdfjs/decode-jpeg2000.js',
	'jpeg-lossless': 'node_modules/dwv/decoders/rii-mango/decode-jpegloss.js',
	'jpeg-baseline': 'node_modules/dwv/decoders/pdfjs/decode-jpegbaseline.js',
	rle: 'node_modules/dwv/decoders/dwv/decode-rle.js'
};

var redirectURL;
const firstStep = [
	{
		target: 'body',
		content: 'Welcome to survey tool! Click the red dot to get instructions!!',
		placement: 'center'
	},
	{
		target: '.joyrideFullscreen',
		content: 'Enter full screen and wait for the video feed to apear.',
		title: 'Initiate survey!'
	}
]
const lastStep = [
	{
		target: 'body',
		content: 'At the top you can see the correct diagnosis.',
		placement: 'center'
	}
]

const steps = [
	{
	  target: '.joyrideSelect',
      content: 'Select the type of Haemorrhage based on your examination.',
	},
	{
		target: '.joyrideSave',
		content: 'Save your decision and see AI prediction.',
	},
	{
		target: '.joyridePred',
		content: 'Click to toggle.',
	},
	{
		target: '.joyrideShowNext',
		content: 'Go for the next survey item.',
	}
  ];
const styles = theme => ({
	button: {
		margin: theme.spacing.y
	},
	appBar: {
		position: 'relative'
	},
	title: {
		flex: '0 0 auto'
	},
	tagsDialog: {
		minHeight: '90vh',
		maxHeight: '90vh',
		minWidth: '90vw',
		maxWidth: '90vw'
	},
	iconSmall: {
		fontSize: 20
	}
});

function TransitionUp(props) {
	return <Slide direction="up" {...props} />;
}

class DwvComponent extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			userInfo: null,
			versions: {
				dwv: dwv.getVersion(),
				react: React.version
			},
			tools: {
				Scroll: {},
				ZoomAndPan: {},
				WindowLevel: {},
				// Draw: {
				//   options: ['Ruler'],
				//   type: 'factory',
				//   events: ['draw-create', 'draw-change', 'draw-move', 'draw-delete']
				// },
				Floodfill: {
					events: ['draw-create', 'draw-change', 'draw-move', 'draw-delete']
				},
				Draw: {}
			},
			types: {
				Intraparenchymal: {},
				Intraventricular: {},
				Subarachnoid: {},
				Subdural: {},
				Epidural: {},
				Normal: {}
			},

			selectedTool: 'Select Tool',
			loadProgress: 0,
			dataLoaded: false,
			dwvApp: null,
			tags: [],
			showDicomTags: false,
			toolMenuAnchorEl: null,
			toggle_count: 0,
			dropboxClassName: 'dropBox',
			borderClassName: 'dropBoxBorder',
			hoverClassName: 'hover',
			window_size: null,
			newHeight: null,
			enableDraw: false,
			toggle_feedback: 0,
			feedback_path: '',
			guided_tour: null,
			feedback_haemType: '',
			typesMenuAnchorEl: null,
			selectedType: 'Select Haemorrhage Type',
			showFeature: false,
			hasURLParams: false,
			hasURLParams: false,
			isSurveyTool: false,
			isDraw: 1,
			feedbackEditor: false,
			isAlertOpen: false,
			alertMessage: 'Blank message',
			alertSeverity: 'success',
			isTourOpen: true,
			run: false,
			Step: [],
			stepIndex: 0,
			showSelect: false,
			runLastStep: false,
			runFirstStep: false,
			open: false
		};
		
	}
	getHelpers = (helpers: StoreHelpers) => {
		this.helpers = helpers;
		console.log(this.helpers)
	};
	handleClose=()=>{
		this.setState({open: false});
		this.setState({run: true});
	}

	handleJoyrideCallback = (data: CallBackProps) => {
	let { action, index, status, type } = data;
	let finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
	
	}

	alertOpen = openStatus => {
		this.setState({ isAlertOpen: openStatus });
		setTimeout(() => {
			this.setState({ isAlertOpen: false });
		}, 5000);
	};

	showAlert = (msg, severity = 'success') => {
		this.alertOpen(true);
		this.setState({ alertMessage: msg });
		this.setState({ alertSeverity: severity });
	};
	getHelpers = (helpers: StoreHelpers) => {
		this.helpers = helpers;
		console.log(this.helpers)
	};
	handleClose=()=>{
		this.setState({open: false});
		this.setState({run: true});
	}

	handleJoyrideCallback = (data: CallBackProps) => {
	let { action, index, status, type } = data;
	let finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
	
	// if(action===ACTIONS.NEXT) {
	// 	// alert(this.state.stepIndex)
	// 	// if(this.state.stepIndex==2 || this.state.stepIndex==4 || this.state.stepIndex==5) this.setState({ run: false });
	// 	if(this.state.stepIndex==0 || this.state.stepIndex==4) this.setState({stepIndex: this.state.stepIndex+1});
	// }
		
	if (finishedStatuses.includes(status)) {
		this.setState({ run: false });
		
	}

	// tslint:disable:no-console
	console.groupCollapsed(type);
	console.log(data);
	console.groupEnd();
	// tslint:enable:no-console
	};
	handleClickStart = (e) => {
		// e.preventDefault();
	var dcmNum = localStorage.getItem('count');
	
	// if(dcmNum==0){
		this.setState({
			// stepIndex: this.state.stepIndex+1,
			run: true
		});
	// }
	  };
	render() {
		const { classes } = this.props;

		const {
			versions,
			tools,
			loadProgress,
			dataLoaded,
			tags,
			toolMenuAnchorEl,
			toggle_count,
			enableDraw,
			toggle_feedback,
			feedback_path,
			feedback_haemType,
			typesMenuAnchorEl,
			types,
			showFeature,
			isSurveyTool,
			isDraw,
			feedbackEditor
		} = this.state;

		// const toolsMenuItems = Object.keys(tools).map(tool => (
		// 	<MenuItem onClick={this.handleMenuItemClick.bind(this, tool)} key={tool} value={tool}>
		// 		{tool}
		// 	</MenuItem>
		// ));

		const typesMenuItems = Object.keys(types).map(type => (
			<MenuItem onClick={this.handleMenuTypeClick.bind(this, type)} key={type} value={type}>
				{type}
			</MenuItem>
		));

		console.log('In code');
		// console.log(this.state.showFeature);
		let dcmNum = localStorage.getItem('count');

		return (
			
			<div>
				<div style={{backgroundColor: "transparent"}}>
				 <Modal
					show={this.state.open}
					onHide={x=>{this.handleClose();}}
					dialogClassName="modal-90w"
					aria-labelledby="example-custom-modal-styling-title"
					centered
				>
					<Modal.Header closeButton>
					<Modal.Title id="example-custom-modal-styling-title">
						Eye Tracker Guide
					</Modal.Title>
					</Modal.Header>
					<Modal.Body>
					<img src='calibration.png'></img>
					</Modal.Body>
				</Modal>
				</div>
				<Joyride
				continuous={true}
				run={this.state.runFirstStep}
				scrollToFirstStep={true}
				showProgress={true}
				showSkipButton={true}
				steps={firstStep}
				// stepIndex={this.state.stepIndex}
				styles={{
					options: {
					zIndex: 10000,
					},
				}}
				/>
				<Joyride
				callback={this.handleJoyrideCallback}
				continuous={true}
				getHelpers={this.getHelpers}
				run={this.state.run}
				scrollToFirstStep={true}
				showProgress={true}
				showSkipButton={true}
				steps={steps}
				// stepIndex={this.state.stepIndex}
				styles={{
					options: {
					zIndex: 10000,
					},
				}}
				/>
				<Joyride
				continuous={true}
				run={this.state.runLastStep}
				scrollToFirstStep={false}
				showProgress={false}
				showSkipButton={true}
				steps={lastStep}
				// stepIndex={this.state.stepIndex}
				styles={{
					options: {
					zIndex: 10000,
					},
				}}
				/>
				
				<div style={{ position: 'absolute', width: '100%', 'z-index': '100000' }}>
					<Collapse in={this.state.isAlertOpen}>
						<Alert
							severity={this.state.alertSeverity}
							action={
								<IconButton
									aria-label="close"
									color="inherit"
									size="small"
									onClick={() => {
										this.alertOpen(false);
									}}
								>
									<CloseIcon fontSize="inherit" />
								</IconButton>
							}
						>
							{this.state.alertMessage}
						</Alert>
					</Collapse>
				</div>
				<Button variant="contained" color="primary">
					{dcmNum} of 55
				</Button>
				<Layout>
					<Sider>
						<Grid container>
							<Grid>
								<div
									id="dwv"
									className="dwv-main"
									style={{
										position: 'absolute',
										visibility: this.state.feedbackEditor ? 'hidden' : undefined
									}}
								>
									<div style={{ top: 0 }}>
										{/* {console.log('visibility: ', this.state.feedbackEditor)} */}
										<LinearProgress variant="determinate" value={loadProgress} />
										<div>
											{this.state.showFeature || !this.state.hasURLParams ? (
												<div className="button-row">
													<div>{this.state.toggle_count === 1 ? <ToggleCanvas /> : null}</div>

													<div>
														{this.state.toggle_feedback ? (
															<div className="overlay">
																<img src={this.feedback_path}></img>
															</div>
														) : null}
													</div>
													<Dialog
														open={this.state.showDicomTags}
														onClose={this.handleTagsDialogClose}
														TransitionComponent={TransitionUp}
														classes={{ paper: classes.tagsDialog }}
													>
														<AppBar className={classes.appBar}>
															<Toolbar>
																<IconButton
																	color="inherit"
																	onClick={this.handleTagsDialogClose}
															
																	aria-label="Close"
																>
																	<CloseIcon />
																</IconButton>
																<Typography
																	variant="h6"
																	color="inherit"
																	className={classes.flex}
																>
																	DICOM Tags
																</Typography>
															</Toolbar>
														</AppBar>
														<TagsTable data={tags} />
													</Dialog>
												</div>
											) : null}
										</div>

										<div className="layerContainer">
											<div className="dropBox dropBoxBorder">
												<Typography>Drag and drop data here.</Typography>
											</div>
											<canvas className="imageLayer">
												Only for HTML5 compatible browsers...
											</canvas>
											<div className="drawDiv"></div>
											<div
												style={{
													visibility:
														this.state.selectedTool === 'Draw' ? undefined : 'hidden',
													zindex: this.state.selectedTool === 'Draw' ? 55 : -100
												}}
												className="overlay"
											>
												<div className="drawCanvas">
													<canvas id="draw"></canvas>
												</div>
											</div>
										</div>
										<div>
											{this.state.hasURLParams ? (
												<div style={{ position: 'absolute', top: '0px', left: inc }}>
													{/* <Button variant="contained" color="primary"
                            aria-owns={toolMenuAnchorEl ? 'simple-menu' : null}
                            aria-haspopup="true"
                            onClick={this.handleMenuButtonClick}
                            disabled={!dataLoaded}
                            className={classes.button}
                            size="medium"
                          >{this.state.selectedTool}
                            <ArrowDropDownIcon className={classes.iconSmall} /></Button> */}
													{/* <Menu
                            id="simple-menu"
                            anchorEl={toolMenuAnchorEl}
                            open={Boolean(toolMenuAnchorEl)}
                            onClose={this.handleMenuClose}
                          >
                            {toolsMenuItems}
                          </Menu> */}
{this.state.hasURLParams && (
	<div>
													

							{/* <Button variant="contained" color="primary"
							onClick={x => {this.handleTagsDialogOpen();
										   this.handleCaptureWebpage();
										}}
                            disabled={!dataLoaded}
                            className={classes.button}
                            size="medium">Tags</Button>
							<br />
							<br /> */}
							{/* <Button variant="contained" color="primary"
							disabled={!dataLoaded}
							onClick={x => {this.handleCaptureWebpage();this.handleDraw();}}
							>Draw</Button>
							<br />
							<br />
							<Button variant="contained" color="primary"
                            disabled={!dataLoaded}
							onClick={x => {this.onReset();this.handleCaptureWebpage();}}
							className={classes.button}
							size="medium"
							>Reset</Button>
							<br />
							<br /> */}
															{!this.state.showSelect ? (
															<Button
															
																color="primary"
																variant="contained"
																className={classes.button, 'joyrideFullscreen'}
																size="medium"
																onClick={x => {
																	
																	this.openFullscreen();
																}}
															>
																Enter Full Screen
															</Button>
															): null }
															<Button
																style={{
																	opacity: this.state.toggle_count === 1 ? 0.5 : null
																}}
																variant="contained"
																color="primary"
																onClick={x => {this.handleToggle();this.handleCaptureWebpage();}}
																disabled={
																	this.state.selectedType === 'Select Haemorrhage Type' ||
																	this.state.showFeature === false
																}
																className={classes.button,'joyridePred'}
																size="medium"
															>
																AI Prediction
															</Button>
															{/* <br />
															<br /> */}

															
															{/* <Button
																variant="contained"
																color="primary"
																onClick={x => {this.handleFeedback();this.handleCaptureWebpage();}}
																disabled={!dataLoaded}
																className={classes.button}
																size="medium"
															>
																Feedback List
															</Button>
															<br />
															<br /> */}
														</div>
													)}

													{/* {(this.feedback_path) ?
                            <Button variant="contained" color="primary"
                              onClick={x => {this.handleToggleFeedback();this.handleCaptureWebpage();}}
                              disabled={!dataLoaded}
                              className={classes.button}
                              size="medium">Toggle Feedback</Button> : null
                          } */}

													{/* <div>
														{this.state.toggle_feedback ? (
															<div className="overlay">
																<img src={this.feedback_path}></img>
															</div>
														) : null}
													</div> */}
													{/* <Dialog
														open={this.state.showDicomTags}
														onClose={this.handleTagsDialogClose}
														TransitionComponent={TransitionUp}
														classes={{ paper: classes.tagsDialog }}
													>
														<AppBar className={classes.appBar}>
															<Toolbar>
																<IconButton
																	color="inherit"
																	onClick={this.handleTagsDialogClose}
																	aria-label="Close"
																>
																	<CloseIcon />
																</IconButton>
																<Typography
																	variant="h6"
																	color="inherit"
																	className={classes.flex}
																>
																	DICOM Tags
																</Typography>
															</Toolbar>
														</AppBar>
														<TagsTable data={tags} />
													</Dialog> */}
												</div>
											) : null}

											{this.state.hasURLParams && (
												<div>
													<Button
														disabled={!this.state.showSelect}
														variant="contained"
														color="primary"
														aria-owns={typesMenuAnchorEl ? 'simple-menu' : null}
														aria-haspopup="true"
														onClick={this.handleTypesMenuButtonClick}
														// disabled={!dataLoaded}
														className={classes.button,'joyrideSelect'}
														size="medium"
													>
														{this.state.selectedType}
														<ArrowDropDownIcon className={classes.iconSmall} />
													</Button>
													<Menu
														id="simple-menu"
														anchorEl={typesMenuAnchorEl}
														open={Boolean(typesMenuAnchorEl)}
														onClose={this.handleTypesMenuClose}
													>
														{typesMenuItems}
													</Menu>
													<Button
														disabled={this.state.selectedType === 'Select Haemorrhage Type'}
														color="primary"
														variant="contained"
														className={classes.button, 'joyrideSave'}
														size="medium"
														onClick={x => {
															this.handleCaptureWebpage();
															this.onSaveFolder();
															this.showAlert('Your feedback is saved');
															this.setState({ showFeature: true });
															this.setState({ toggle_count: 1 });
															const pic = document.querySelector('.layerContainer .imageLayer');
															this.root = document.getElementsByClassName("camOverlayId");
															
															document.documentElement.style.setProperty(heightvar, pic.height + 'px');
															document.documentElement.style.setProperty(widthvar, pic.width + 'px');
															document.documentElement.style.setProperty(hvarm, pic.height + 'px');
															document.documentElement.style.setProperty(wvarm, pic.width + 'px');
															this.root = document.getElementsByClassName("camOverlay");
															const heightvar = '--hpx';
															const widthvar = '--wpx';
															const hvarm = '--hpxm';
															const wvarm = '--wpxm';

															document.documentElement.style.setProperty(heightvar, pic.height + 'px');
															document.documentElement.style.setProperty(widthvar, pic.width + 'px');
															document.documentElement.style.setProperty(hvarm, pic.height + 'px');
															document.documentElement.style.setProperty(wvarm, pic.width + 'px');
															// 
															
															
														}}
													>
														Save
													</Button>
													{!this.feedback_path && (
														<Button
														    className="joyrideShowNext"
															disabled={
																this.state.selectedType === 'Select Haemorrhage Type' ||
																this.state.showFeature === false
															}
															color="primary"
															variant="contained"
															onClick={x => { 
																//
																{ 
																	/* console.log(this.state.showFeature);  */
																} 
																if(this.guided_tour==="true") this.state.runLastStep = true;
																let dcmType = localStorage.getItem('dcmType');
																let selType = this.state.selectedType.toLowerCase();
																if (selType === dcmType) {
																	let rightCount = localStorage.getItem('rightCount');
																	rightCount++;
																	localStorage.setItem('rightCount', rightCount);
																	this.showAlert(
																		'Great! Your selected Haemorrhage type is Correct!'
																	);
																} else {
																	this.showAlert(
																		`Sorry your selection was not right. Right choice was ${dcmType}`,
																		'error'
																	);
																} 
																this.handleCaptureWebpage();
																this.onsurveyAgain(); 
															}} 
														 > 
															 Show Next Survey 
														 </Button> 
														 
													  )} 
													  {/* <br />
														 <br /> */}
														 {/* <div
					classname="feedbackBox"
					style={{ top: 0, left: 0, visibility: this.state.feedbackEditor ? undefined : 'hidden' }}
				>
					<div>
						{this.state.showFeature && this.state.hasURLParams ? (
							<div
								className=""
								style={{
									textAlign: 'center',
									paddingLeft: '20%',
									paddingRight: '20%',
									marginBottom: '20px',
									marginTop: '10px',
									zindex: 13
								}}
							>
								<div style={{ textAlign: 'center', marginBottom: '10px', marginTop: '50px' }}>
									<span style={{ fontSize: '18px' }}>Write Feedback</span>
									{this.state.feedbackEditor ? (
										<RichTextEditor
											onEditorStateChange={this.onEditorStateChange}
											editorState={this.state.editorState}
											onContentStateChange={this.onContentStateChange}
										/>
									) : null}
								</div> */}
													{/* <Button variant="contained" color="primary"
														className={classes.button}
														size="medium"
													  disabled={this.state.selectedType === "Select Haemorrhage Type"}
													  onClick={x => {
														  this.onNext();
														  this.handleCaptureWebpage();
														}}
													>NEXT</Button> */}
													
													
												</div>
											)}
										</div>
									</div>

									{/* <div><p className="legend">
          <Typography variant="caption">Powered by <Link
            href="https://github.com/ivmartel/dwv"
            title="dwv on github">dwv
            </Link> {versions.dwv} and React {versions.react}
          </Typography>
        </p></div> */}
								</div>
							</Grid>
						</Grid>
					</Sider>
					<Sider>
						<Grid container>
							<Grid>
								{!this.state.feedbackEditor ? (
									<div>
										{/* <h1>
											<b>
												<u>Instructions</u>
											</b>
										</h1>
										<p>
											<h2>
												<b>Step 1:</b> Select the type of Haemorrhage based on your examination.
											</h2>{' '}
											<strong style={{ color: 'red' }}>
												{' '}
												Warning: without save button press no feedback will be saved
											</strong>
										</p>
										<br />
										<p>
											<h2>
												<b>Step 2:</b> AI prediction region will be shown. If you want to change
												your decision then change the dropdown again and save it.
											</h2>
										</p>
										<br />
										<p>
											<h2>
												<b>Step 3:</b> Go for the next survey item
											</h2>
										</p> */}
										
									</div>
									
								) : null}
							</Grid>
						</Grid>
					</Sider>
				</Layout>

				
								{/* <Button color="primary" variant="contained" onClick={x =>{this.onPrev();this.handleCaptureWebpage();}}>
									PREV
								</Button>
								<br />
								<br />
								<br /> */}
								{/* <Button
														disabled={this.state.selectedType === 'Select Haemorrhage Type'}
														color="primary"
														variant="contained"
														className={classes.button}
														size="medium"
														onClick={x => {
															this.onSaveFolder();
															this.showAlert('Your feedback is saved');
															// this.setState({ toggle_count: 1 });
															this.handleCaptureWebpage();
														}}
													>
														Save Feedback
													</Button>

								<br />
								<br />
								<br /> */}
							
						
					</div>
				
		);
	}
	//   checkUserRole = () => {
	// 		if ( this.state.userInfo.role !== 'surveyor' && this.state.userInfo.role !== 'admin') {
	//         alert("You aren't given access to survey tool. Please contact with Admin")
	//         window.location.replace('/home');
	//       }
	// 	}
	//   apiResponseUserInfo = apiResponse => {
	//     if (apiResponse.response.status === 200) {
	//         const userInfo = apiResponse.response.data.result;
	//         this.setState({ userInfo });
	//         this.checkUserRole();
	//     } else {
	//         window.location.replace('/login');
	//     }
	// }

	componentDidMount() {
		// create app
		// XRayApi.userInfo(this.apiResponseUserInfo);
		// console.log(window.location.search);
		// this.openFullscreen();
		
		var dcmNum = localStorage.getItem('count');
		
		const queryString = window.location.search;
		urlParams = new URLSearchParams(queryString);
		// console.log(urlParams);
		this.feedback_path = urlParams.get('feedback');
		this.guided_tour = localStorage.getItem('guidedTour');
		console.log(this.guided_tour)
		this.feedback_haemType = urlParams.get('haemType');
		this.setState({ hasURLParams: !!urlParams.get('input') });
		if(this.guided_tour==="true") this.state.runFirstStep = true;
		// console.log(this.state.feedback_haemType);
		if (this.feedback_path) {
			this.setState({ selectedType: this.feedback_haemType });
			this.setState({ showFeature: true });
			this.setState({ toggle_count: 1 });
			this.setState({ toggle_feedback: 1 });
		}

		// else
		//   this.setState({ selectedType: 'Select Haemorrhage Type' });
		//console.log(this.feedback_path);

		// var app = new dwv.App();
		var location = window.location.pathname;
		//console.log(window.location.pathname);
		this.state.isSurveyTool = location.search('xrayviewer') > -1 ? true : false;

		const flag = false;
		// initialise app
		if (this.state.isSurveyTool >= 0) {
			const flag = true;
			const surveyTool = {
				Scroll: {},
				WindowLevel: {},
				Floodfill: {
					events: ['draw-create', 'draw-change', 'draw-move', 'draw-delete']
				}
				//Draw: {}
			};
			this.state.tools = surveyTool;
		}
		app.init({
			containerDivId: 'dwv',
			tools: this.state.tools
		});
		let { fileURL } = this.props;
		if (urlParams.get('input')) {
			fileURL = urlParams.get('input');
		}

		// app.loadURLs(["https://xraydiacombucket.s3-ap-southeast-1.amazonaws.com/livingroom-34d8be33-7ce5-4fec-a4e8-cddf2753adf1.jpeg"], "")
		app.loadURLs([fileURL], '');
		// progress
		var self = this;
		app.addEventListener('load-progress', function(event) {
			self.setState({ loadProgress: event.loaded });
		});
		app.addEventListener('load', function(event) {
			self.setState({ tags: dwv.utils.objectToArray(app.getMetaData()) });
			// set the selected tool
			self.window_size = app.getLayerContainerSize();
			let elementsHeader = document.getElementsByClassName('MuiToolbar-root-50');
			while(elementsHeader.length > 0){
				elementsHeader[0].parentNode.removeChild(elementsHeader[0]);
			}
			let elements = document.getElementsByClassName('MuiToolbar-root-168');
			while(elements.length > 0){
				elements[0].parentNode.removeChild(elements[0]);
			}
			console.log(self.window_size)
			if (app.isMonoSliceData() && app.getImage().getNumberOfFrames() === 1) {
				self.setState({ selectedTool: 'WindowLevel' });
			} else {
				self.setState({ selectedTool: 'Scroll' });
			}
			const emptyCanvas = document.querySelector('.drawDiv div canvas');
			// self.onChangeTool(selectedTool);
			self.hideDropbox();
			// set data loaded flag
			self.setState({ dataLoaded: true });
		});
		// handle key events
		app.addEventListener('keydown', event => {
			app.defaultOnKeydown(event);
		});
		// handle window resize
		window.addEventListener('resize', app.onResize);

		// store
		self.setState({ dwvApp: app });

		// setup drop box
		// self.setupDropbox(app);

		// possible load from location
		dwv.utils.loadFromUri(window.location.href, app);
		// this.handleCaptureWebpage();
	}
	hideDropbox = () => {
		// remove box
		const box = this.state.dwvApp.getElement(this.state.dropboxClassName);
		if (box) {
			box.parentNode.removeChild(box);
		}
	};

	// onChangeTool = tool => {
	// 	if (this.state.dwvApp) {
	// 		this.setState({ selectedTool: tool });
	// 		if (tool === 'Draw') {
	// 			//document.getElementsByClassName("one")[0].disabled = false;
	// 			// this.enableDraw = true;
	// 			this.onDraw();
	// 		} else {
	// 			//document.getElementsByClassName(".drawCanvas")[0].disabled = true;
	// 			//this.enableDraw = false;
	// 			this.state.dwvApp.setTool(tool);
	// 			if (tool === 'Floodfill') {
	// 				this.onChangeColor('#FFFF80');
	// 			} else if (tool === 'Draw') {
	// 				this.onChangeShape(this.state.tools.Draw.options[0]);
	// 			}
	// 		}
	// 	}
	// };

	onChangeShape = shape => {
		if (this.state.dwvApp) {
			this.state.dwvApp.setDrawShape(shape);
		}
	};

	onChangeColor = color => {
		if (this.state.dwvApp) {
			this.state.dwvApp.setDrawLineColour(color);
		}
	};
	onNext = () => {
		this.state.feedbackEditor = true;
		this.setState({ feedbackEditor: true });
	};

	onPrev = () => {
		this.state.feedbackEditor = false;
		this.setState({ feedbackEditor: false });
	};
	// onDraw = () => {
	// 	this.state.isDraw ^= true;
	// 	// console.log('draw again ', this.isDraw);
	// 	const pic = document.querySelector('.layerContainer .imageLayer');
	// 	//this.root = document.getElementsByClassName("overlay");
	// 	const heightvar = '--hpx';
	// 	const widthvar = '--wpx';
	// 	const hvarm = '--hpxm';
	// 	const wvarm = '--wpxm';

	// 	const canv = document.getElementById('draw');
	// 	canv.style.cursor = 'pointer';

	// 	document.documentElement.style.setProperty(heightvar, pic.height + 'px');
	// 	document.documentElement.style.setProperty(widthvar, pic.width + 'px');
	// 	document.documentElement.style.setProperty(hvarm, pic.height + 'px');
	// 	document.documentElement.style.setProperty(wvarm, pic.width + 'px');

	// 	const canvas = document.querySelector('.drawCanvas canvas');
	// 	var rect = canvas.getBoundingClientRect();

	// 	if (canvas && this.state.isDraw) {
	// 		const ctx1 = canvas.getContext('2d');
	// 		var paint = false;
	// 		this.painting = true;
	// 		ctx1.lineWidth = 0.2;
	// 		ctx1.lineCap = 'round';
	// 		ctx1.strokeStyle = '#8B0000';
	// 		canvas.addEventListener('mousedown', function() {
	// 			this.painting = true;
	// 			paint = true;
	// 		});
	// 		canvas.addEventListener('mouseup', function() {
	// 			this.painting = false;
	// 			ctx1.beginPath();
	// 			paint = false;
	// 		});
	// 		canvas.addEventListener('mousemove', function(e) {
	// 			if (!e) e = window.event;
	// 			if (!paint) return;
	// 			var x = ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
	// 			var y = ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height;
	// 			ctx1.lineTo(x, y);
	// 			ctx1.moveTo(x, y);
	// 			ctx1.stroke();
	// 		});
	// 	}
	// };

	onFeedback = () => {
		return this.state.toggle_feedback;
	};

	onReset = tool => {
		if (this.state.dwvApp) {
			this.state.dwvApp.resetDisplay();
			this.state.dwvApp.deleteDraws();
		}
		var drawing = document.querySelector('.drawCanvas canvas');
		if (drawing) {
			const context = drawing.getContext('2d');
			context.clearRect(0, 0, drawing.width, drawing.height);
		}
	};
	onYes = () => {
		console.log('Loaded');
	};
	onToggle = () => {
		console.log('toggled');
	};
	onSave = () => {
		console.log('Drawing Image saved');
		var pic = document.querySelector('.drawCanvas canvas');
		if (window.navigator.msSaveBlob) {
			window.navigator.msSaveBlob(pic.msToBlob(), 'xray.png');
		} else {
			const a = document.createElement('a');

			document.body.appendChild(a);
			a.href = pic.toDataURL('image/png');
			a.download = 'xray.png';
			a.click();
			document.body.removeChild(a);
		}
	};
	apiResponse = apiResponse => {
		if (apiResponse.response.status === 200) {
			console.log('OK!!');
		} else {
			console.log('Failed!!!');
		}
	};
	apiResponseQuickFeedbackTrack = apiResponse => {
		if (apiResponse.response.status === 200) {
			console.log('OK!!');
			setTimeout(() => {
				window.location.replace(redirectURL);
			}, 1000);
		} else {
			console.log('Failed!!!');
		}
	};
	apiResponseCheck = apiResponse => {
		if (apiResponse.response.status === 200) {
			console.log('OK');
		} else {
			console.log('Something going wrong');
		}
	};

	apiResponseFeed = apiResponse => {
		if (apiResponse.response.status === 200) {
			// alert("Feedback is saved!!");
		} else {
			this.showAlert('Feedback is could not be saved. Try again.');
		}
	};
	// apiResponseFeedBack = apiResponse => {
	//   const statusCode = apiResponse.response.status;
	// 	if (statusCode === 201) {
	//     alert("You have Feedback to show.");
	//   } else {
	//     var url = '/feedback-list';
	//     window.location.replace(url);
	//   }
	// }
	apiResponseDCM = apiResponse => {
		if (apiResponse.response.status === 200) {
			// console.log(apiResponse.response.data.result);

			let data = apiResponse.response.data.result;
			let dcmStr = data['dcmId'];
			let res = dcmStr.split(' ');
			let dcmId = res[0];
			let dcmType = res[1];
			let count = data['count'];
			localStorage.setItem('dcmId', dcmId);
			localStorage.setItem('count', count);
			localStorage.setItem('dcmType', dcmType);
			if (!localStorage.getItem('rightCount')) localStorage.setItem('rightCount', 0);

			let dcmUrl = API_BASE_URL_LOCAL + '/report/1/servedcm/ID_' + dcmId + '.dcm';
			let maskUrl = API_BASE_URL_LOCAL + '/report/1/servedcm/ID_' + dcmId + '.png';
			XRayApi.trackFeedback({ dcmId, dcmUrl, maskUrl }, this.apiResponseQuickFeedbackTrack);
			localStorage.setItem('maskUrl', maskUrl);
			redirectURL = '/xrayviewer?input=' + API_BASE_URL_LOCAL + '/report/1/servedcm/ID_' + dcmId + '.dcm';
		} else {
			this.showAlert(`Thank you!Your survey is complete. You Got Correct ${localStorage.getItem('rightCount')}`);
			setTimeout(() => {
				window.location.replace('/home');
			}, 2000);
		}
	};

	onSaveDB = () => {
		var name = localStorage.getItem('userName');
		var dcmId = localStorage.getItem('dcmId');
		var draw = 'to be fixed';
		XRayApi.saveDrawing({ name, dcmId, draw }, this.apiResponse);
	};
	onSaveFolder = () => {
		function dataURLtoFile(dataurl, filename) {
			var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new File([u8arr], filename, { type: mime });
		}
		var imgName = 'ID_' + localStorage.getItem('dcmId') + '_' + Date.now() + '.png';
		var draw = document.querySelector('.drawCanvas canvas');
		var dataurl = draw.toDataURL('image/png');
		var file = dataURLtoFile(dataurl, imgName);
		// console.log(dataurl);
		XRayApi.saveDrawing(file, this.apiResponseCheck);
		var header =
			"<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
			"xmlns:w='urn:schemas-microsoft-com:office:word' " +
			"xmlns='http://www.w3.org/TR/REC-html40'>" +
			"<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
		var footer = '</body></html>';
		var sourceHTML = header + draftToHtml(this.state.contentState) + footer;
		var richText = draftToHtml(this.state.contentState);
		var data = window.btoa(richText);
		// console.log(data);

		var dataurl = 'data:application/vnd.ms-word;charset=utf-8,' + data;
		var textName = 'ID_' + localStorage.getItem('dcmId') + '_' + Date.now() + '.doc';
		var file = dataURLtoFile(dataurl, textName);

		// console.log(file);
		XRayApi.saveText(file, this.apiResponse);
		let dcmId = localStorage.getItem('dcmId');
		let name = localStorage.getItem('userName');
		let haemType = this.state.selectedType;
		let url = API_BASE_URL_LOCAL + '/report/1/servedcm/';
		let drawImageUrl = url + imgName;
		let textUrl = url + textName;
		let webgazerPredictions = window.predictions
		let screenshots = window.screenshots
		console.log(screenshots)
		window.predictions = []
		window.screenshots = []
		let h = document.querySelector('.imageLayer').getBoundingClientRect();
		let screenWidth = window.screen.width.toString();
		let screenHeight = window.screen.height.toString();
		let xrayviewerCoodinates = {
			topLeftX: h.x.toString(),
			topLeftY: h.y.toString(),
			bottomRightX: h.right.toString(),
			bottomRightY: h.bottom.toString()
		}
		
		XRayApi.saveFeedback({ name, dcmId, haemType, drawImageUrl, textUrl, webgazerPredictions, screenshots, screenWidth, screenHeight, xrayviewerCoodinates }, this.apiResponseFeed);
		// XRayApi.saveGazeData(window.predictions,dcmId);
		// XRayApi.captureWebpage(dcmId, window.screenshots);
	};

	onsurveyAgain = () => {
		// this.openFullscreen();
		localStorage.setItem('guidedTour',false);
		var dcmId = localStorage.getItem('dcmId');
		XRayApi.getDcmId(this.apiResponseDCM);
	};
	videoFeed=() =>{
		setTimeout(() => {
			
			let videoElement = document.getElementById('webgazerVideoFeed');
			let faceOverlay = document.getElementById('webgazerFaceOverlay');
			let faceFeedbackBox = document.getElementById('webgazerFaceFeedbackBox');
			if(videoElement===null || faceFeedbackBox===null || faceOverlay===null) this.videoFeed();
			else {
				videoElement.style.removeProperty("left");
				videoElement.style.right = '0px';
				faceOverlay.style.removeProperty("left");
				faceOverlay.style.right = '0px';
				faceFeedbackBox.style.removeProperty("left");
				faceFeedbackBox.style.right = '0px';
				
				window.webgazer
				.showVideo(!window.webgazer.params.showVideo)
				.showPredictionPoints(!window.webgazer.params.showGazeDot)
				.showFaceOverlay(!window.webgazer.params.showFaceOverlay)
				.showFaceFeedbackBox(!window.webgazer.params.showFaceFeedbackBox);
			}
			
		}, 2000);
	}
	openFullscreen() {
		
		// alert(document.fullscreenEnabled);
		var elem = document.body;
		// elem.dispatchEvent(new KeyboardEvent('keypress',{'key':'F11'}));
		if (elem.mozRequestFullScreen) { /* Firefox */
		  elem.mozRequestFullScreen();
		} else if (document.body.webkitRequestFullscreen) {/* Chrome, Safari & Opera */
			document.body.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) { /* IE/Edge */
		  elem.msRequestFullscreen();
		}
		
		let h = window.screen.height - 100
		let size = app.getLayerContainerSize();
		app.fitToSize({width: 900, height: h});
		let newSize = app.getLayerContainerSize();
		inc = (newSize.width).toString()+'px';
		if(this.guided_tour==="true") this.setState({run: true});
		this.handleCaptureWebpage();
		
		// window.webgazer.params.showVideo = false;
		window.webgazer.params.showGazeDot = true;
		// window.webgazer.params.showFaceOverlay = false;
		// window.webgazer.params.showFaceFeedbackBox = false;
		window.webgazer
			.begin();
		// // this.state.run=true;
		// this.videoFeed();
		
		// clearTimeout(timer);
		
		this.setState({showSelect: true});
		
		
	  }

	downloadReport = e => {
		function dataURLtoFile(dataurl, filename) {
			var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new File([u8arr], filename, { type: mime });
		}
		var header =
			"<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
			"xmlns:w='urn:schemas-microsoft-com:office:word' " +
			"xmlns='http://www.w3.org/TR/REC-html40'>" +
			"<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
		var footer = '</body></html>';
		var sourceHTML = header + draftToHtml(this.state.contentState) + footer;
		var richText = draftToHtml(this.state.contentState);
		var data = window.btoa(richText);
		// console.log(data);

		var dataurl = 'data:application/vnd.ms-word;charset=utf-8,' + data;

		var file = dataURLtoFile(dataurl, 'text.doc');

		// console.log(file);
		XRayApi.saveText(file, this.apiResponse);

		//var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
		/*
    var fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'document.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
    */
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
	};

	handleTagsDialogOpen = () => {
		this.setState({ showDicomTags: true });
	};

	handleTagsDialogClose = () => {
		this.setState({ showDicomTags: false });
	};

	handleMenuButtonClick = event => {
		this.setState({ toolMenuAnchorEl: event.currentTarget });
		
	};
	handleTypesMenuButtonClick = event => {
		this.handleCaptureWebpage();
		this.setState({ typesMenuAnchorEl: event.currentTarget });
		// this.setState({ toggle_count: 1 });
		//this.handleToggle();
		
	};

	handleMenuClose = event => {
		this.setState({ toolMenuAnchorEl: null });
	};
	handleTypesMenuClose = event => {
		this.handleCaptureWebpage();
		this.setState({ typesMenuAnchorEl: null });
	};
	handleTypesMenuEnter = event => {
		this.setState({ typesMenuAnchorEl: this.state.feedback_haemType });
	};
	handleToggle = event => {
		
		const pic = document.querySelector('.layerContainer .imageLayer');
		this.root = document.getElementsByClassName('overlay');
		const heightvar = '--hpx';
		const widthvar = '--wpx';
		const hvarm  = '--hpxm';
		const wvarm = '--wpxm';

		document.documentElement.style.setProperty(heightvar, pic.height + 'px');
		document.documentElement.style.setProperty(widthvar, pic.width + 'px');
		document.documentElement.style.setProperty(hvarm, pic.height + 'px');
		document.documentElement.style.setProperty(wvarm, pic.width + 'px');
		this.setState({ toggle_count: this.state.toggle_count ^ 1 });
	};

	handleDraw = event => {
		// this.state.isDraw ^= true;
		this.setState({ isDraw: this.state.isDraw ^ 1 })
		// console.log('draw again1 ', this.state.isDraw);
		this.state.selectedTool = 'Draw';

		const pic = document.querySelector('.layerContainer .imageLayer');
		//this.root = document.getElementsByClassName("overlay");
		const heightvar = '--hpx';
		const widthvar = '--wpx';
		const hvarm = '--hpxm';
		const wvarm = '--wpxm';

		const canv = document.getElementById('draw');
		canv.style.cursor = 'pointer';

		document.documentElement.style.setProperty(heightvar, pic.height + 'px');
		document.documentElement.style.setProperty(widthvar, pic.width + 'px');
		document.documentElement.style.setProperty(hvarm, pic.height + 'px');
		document.documentElement.style.setProperty(wvarm, pic.width + 'px');

		const canvas = document.querySelector('.drawCanvas canvas');
		var rect = canvas.getBoundingClientRect();

		if (canvas) {
			const ctx1 = canvas.getContext('2d');
			var paint = false;
			this.painting = true;
			ctx1.lineWidth = 0.2;
			ctx1.lineCap = 'round';
			ctx1.strokeStyle = '#8B0000';
			canvas.addEventListener('mousedown', function() {
				this.painting = true;
				paint = true;
			});
			canvas.addEventListener('mouseup', function() {
				this.painting = false;
				ctx1.beginPath();
				paint = false;
			});
			canvas.addEventListener('mousemove', function(e) {
				if (!e) e = window.event;
				if (!paint) return;
				var x = ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width;
				var y = ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height;
				ctx1.lineTo(x, y);
				ctx1.moveTo(x, y);
				ctx1.stroke();
			});
		}
	};

	handleToggleFeedback = event => {
		const pic = document.querySelector('.layerContainer .imageLayer');
		const heightvar = '--hpx';
		const widthvar = '--wpx';
		const hvarm = '--hpxm';
		const wvarm = '--wpxm';

		document.documentElement.style.setProperty(heightvar, pic.height + 'px');
		document.documentElement.style.setProperty(widthvar, pic.width + 'px');
		document.documentElement.style.setProperty(hvarm, pic.height + 'px');
		document.documentElement.style.setProperty(wvarm, pic.width + 'px');
		if (this.feedback_path) {
			this.setState({ toggle_feedback: this.state.toggle_feedback ^ 1 });
			// this.setState({ selectedType: this.state.feedback_haemType });
		} else {
			this.showAlert('No Feedback Selected. Please Select a feedback first', 'warn');
		}
		// need to move it
	};

	handleMenuItemClick = tool => {
		this.setState({ toolMenuAnchorEl: null });
		// this.onChangeTool(tool);
	};

	handleMenuTypeClick = type => {
		// console.log(this.state.showFeature);
		this.setState({ typesMenuAnchorEl: null });
		this.setState({ selectedType: type });
		// this.setState({ showFeature: true });
		// console.log(this.state.showFeature);
		let dcmType = localStorage.getItem('dcmType');
		let selType = type.toLowerCase();
		// if (selType === dcmType) {
		//   alert("Great! Your selected Haemorrhage type is Correct!");
		// }
		// this.onSaveFolder();
	};
	handleFeedback = () => {
		// XRayApi.serveFeedback(this.apiResponseFeedBack);
		var url = '/feedback-list';
		window.location.replace(url);
	};

	handleCaptureWebpage = () => {
		function dataURLtoFile(dataurl, filename) {
			var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new File([u8arr], filename, { type: mime });
		}
		
		var url = API_BASE_URL_LOCAL + '/report/1/servedcm/';
		
		setTimeout(x=>{
		var dcmId = localStorage.getItem('dcmId');
		var doc = document.body;
		var timestamp = Date.now().toString();
		domtoimage.toPng(doc)
		.then(function (dataUrl) {
			var img = new Image();
			img.src = dataUrl;
			console.log("screenshot taken");
			var imgName = 'screenshot_' + localStorage.getItem('dcmId') + '_' + Date.now() + '.png';
			var file = dataURLtoFile(dataUrl, imgName);
			

			var screenshotUrl = url + imgName;
			window.screenshots.push({screenshot: screenshotUrl, timestamp: timestamp});
			XRayApi.saveScreenshot(file);
		})
		.catch(function (error) {
			console.error('oops, something went wrong!', error);
		});	
		}, 1500)	
	}
}

DwvComponent.propTypes = {
	classes: PropTypes.object.isRequired
};

class ToggleCanvas extends React.Component {
	render() {
		let maskUrl = localStorage.getItem('maskUrl');
		return (
			<div className="camOverlay">
				<img className="camOverlayId" src={maskUrl}></img>
			</div>
		);
	}
}

export default withStyles(styles)(DwvComponent);
