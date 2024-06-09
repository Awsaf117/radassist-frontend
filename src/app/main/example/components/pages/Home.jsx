import React, { Component } from 'react';
import { validateAccessToken } from '../../api/utilities';
import { Card, CardActionArea, CardContent, Typography, CardActions } from '@material-ui/core';
import AWS from 'aws-sdk';

import XRayApi from '../../api/backend';
import { Spin } from 'antd';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ReportIcon from '@material-ui/icons/Report';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import axios from 'axios';
import FusePageSimple from '@fuse/core/FusePageSimple';
import IconButton from '@material-ui/core/IconButton';
import UserMenu from 'app/fuse-layouts/shared-components/UserMenu';
import { API_BASE_URL_LOCAL } from '../../api/backend';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import InputIcon from '@material-ui/icons/Input';
import toast, { Toaster } from 'react-hot-toast';

// window.saveDataAcrossSessions = true;
// window.webgazer.setTracker('clmtrackr')
// .setGazeListener(function(data, clock) {
// 	console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */
// 	console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
// })
// .begin()
// .showVideo(window.webgazer.params.showVideo)
// .showPredictionPoints(!window.webgazer.params.showGazeDot)
// .showFaceOverlay(window.webgazer.params.showFaceOverlay)
// .showFaceFeedbackBox(window.webgazer.params.showFaceFeedbackBox);

// document.addEventListener("keydown", event => {
// 	if (event.isComposing ||  event.keyCode === 80) {
		
// 		console.log(event.key);
// 		window.webgazer.params.showVideo = !window.webgazer.params.showVideo;
// 		window.webgazer.params.showFaceOverlay = !window.webgazer.params.showFaceOverlay;
// 		window.webgazer.params.showFaceFeedbackBox = !window.webgazer.params.showFaceFeedbackBox;
// 		// window.webgazer.params.showGazeDot = !window.webgazer.params.showGazeDot;
// 		window.webgazer.showVideo(window.webgazer.params.showVideo)
// 		// .showPredictionPoints(window.webgazer.params.showGazeDot)
// 		.showFaceOverlay(window.webgazer.params.showFaceOverlay)
// 		.showFaceFeedbackBox(window.webgazer.params.showFaceFeedbackBox);
// 		// showVideo = !showVideo;
// 		var video = document.getElementById('webgazerVideoFeed');
// 		video.style.zIndex = 99999;
// 		// localStorage.setItem('eyeTrack', window.webgazer.params.showVideo);
// 		var video = document.getElementById('webgazerFaceFeedbackBox');
// 		video.style.zIndex = 99999;
// 		var video = document.getElementById('webgazerVideoCanvas');
// 		video.style.zIndex = 99999;
// 		var video = document.getElementById('webgazerFaceOverlay');
// 		video.style.zIndex = 99999;
// 	}
// 	else if(event.isComposing ||  event.keyCode === 82) {
// 		window.webgazer.showPredictionPoints(!window.webgazer.params.showGazeDot);
// 	}
// });





AWS.config.update({
	accessKeyId: 'AKIAYEIDZNBBWWBMCZHL',
	secretAccessKey: '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',
	region: 'ap-southeast-2',
	signatureVersion: 'v4',
	});

class Home extends Component {

	s3 = new AWS.S3();

	state = {
		userInfo: null,
		userSignature: '',
		id: ''
	};

	apiResponseCallback = apiResponse => {
		if (apiResponse.response.status === 200) {
			const userInfo = apiResponse.response.data.result;
			const userName = apiResponse.response.data.result.name;
			localStorage.setItem('userName', userName);
			this.setState({ userInfo });
			this.setState({
				id: userInfo.id
			});
		} else {
			return this.props.history.push('/login');
		}
	};
	apiResponse = apiResponse => {
		if (apiResponse.response.status === 200) {
			localStorage.setItem('userName', this.state.userInfo.name);
		} else {
			console.log('NOT OK!!!!');
		}
	};

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

			let dcmUrl = API_BASE_URL_LOCAL + '/report/1/servedcm/ID_' + dcmId + '.dcm';
			let maskUrl = API_BASE_URL_LOCAL + '/report/1/servedcm/ID_' + dcmId + '.png';
			XRayApi.trackFeedback({ dcmId, dcmUrl, maskUrl }, this.apiResponse);
			localStorage.setItem('maskUrl', maskUrl);
			let url = '/xrayviewer?input=' + API_BASE_URL_LOCAL + '/report/1/servedcm/ID_' + dcmId + '.dcm';
			// console.log(url);
			this.props.history.push(
				'/calibration'
			)
			// this.props.history.push(url);
		} else {
			alert('Thank you!Your survey is complete.');
			// return this.props.history.push('/feedback-list');
		}
	};

	componentDidMount() {
		const accessToken = localStorage.getItem('accessToken');
		if (!accessToken || !validateAccessToken()) {
			return this.props.history.push('/login');
		} else {
			this.getUserInfo();
		}
		
	}

	getUserInfo() {
		XRayApi.userInfo(this.apiResponseCallback);
	}

	handleUpload = () => {
		this.props.history.push('/upload');
		// this.props.history.push('/faceauth/upload');
	};

	handleReportList = () => {
		if (this.state.userInfo.role === 'visitor' || this.state.userInfo.role === 'admin') {
			// this.props.history.push('/faceauth/view');
			this.props.history.replace('/report-list');
		} else {
			alert("You aren't given access to Report list. Please contact with Admin");
		}
	};

	handleSurveyTool = () => {
		XRayApi.getDcmId(this.apiResponseDCM);
	};

	render() {
		const { userInfo, id } = this.state;
		// style={{ display: "flex", flexDirection: "row", justifyItems: "space-between"}}
		
		return (
			<FusePageSimple
				header={<h4 stule={{ marginTop: '5%' }}>{'Home'}</h4>}
				//rightSidebarHeader={<UserMenu {...userInfo} />}

				content={
					<div className="p-24">
						<Grid fluid>
							<Row>
								<Col xs={12}>
									<Row center="xs">
										<Col xs={6}>
											<div style={{ margin: 'auto', textAlign: 'center' }}>
												{userInfo ? (
													<div>
														<h1>Welcome {userInfo.name}</h1>
														<h2
															onClick={() => this.props.history.push(`/profile/${id}`)}
															style={{ cursor: 'pointer' }}
														>
															Edit Profile <AccountBoxIcon /> <InputIcon />{' '}
														</h2>

														<div style={{ marginTop: '20px' }}>
															{userInfo.designation.includes('Doctor') &&
																userInfo.role !== 'surveyor' && (
																	<div
																		style={{
																			maxWidth: '200px',
																			textAlign: 'center',
																			margin: 'auto'
																		}}
																	>
																		<Button
																			variant="contained"
																			color="secondary"
																			className={'button'}
																			startIcon={<SaveIcon />}
																			onClick={this.handleUpload}
																			style={{ margin: '10px' }}
																		>
																			Upload XRay
																		</Button>
																	</div>
																)}
															{userInfo.role !== 'surveyor' && (
																<div
																	style={{
																		maxWidth: '200px',
																		textAlign: 'center',
																		margin: 'auto'
																	}}
																>
																	<Button
																		variant="contained"
																		color="secondary"
																		className={'button'}
																		startIcon={<ReportIcon />}
																		onClick={this.handleReportList}
																		style={{ margin: '10px' }}
																	>
																		View Reports
																	</Button>
																</div>
															)}
															{(userInfo.role === 'surveyor' ||
																userInfo.role === 'admin') && (
																<div>
																	<div
																		style={{
																			maxWidth: '200px',
																			textAlign: 'center',
																			margin: 'auto'
																		}}
																	>
																		<Button
																			variant="contained"
																			color="secondary"
																			className={'button'}
																			startIcon={<ReportIcon />}
																			onClick={this.handleSurveyTool}
																			style={{ margin: '10px' }}
																		>
																			Survey Tool
																		</Button>
																	</div>
																	<div
																		style={{
																			maxWidth: '200px',
																			textAlign: 'center',
																			margin: 'auto'
																		}}
																	>
																		<Button
																			variant="contained"
																			color="secondary"
																			className={'button'}
																			startIcon={<ReportIcon />}
																			onClick={x =>
																				this.props.history.push(
																					'/feedback-list'
																				)
																			}
																			style={{ margin: '10px' }}
																		>
																			Survey List
																		</Button>
																		<Button
																			variant="contained"
																			color="secondary"
																			className={'button'}
																			startIcon={<ReportIcon />}
																			onClick={x =>
																				this.props.history.push(
																					'/calibration'
																				)
																			}
																			style={{ margin: '10px' }}
																		>
																			Calibrate Eye Tracker
																		</Button>
																		</div>
																		<div
																		style={{
																			maxWidth: '200px',
																			textAlign: 'center',
																			margin: 'auto'
																		}}
																	>
																	</div>
																</div>
															)}
														</div>

														<div
															style={{
																position: 'absolute',
																right: '0px',
																'margin-right': '10px'
															}}
														>
															<div
																style={{
																	textAlign: 'left',
																	marginBottom: '2px',
																	marginTop: '50px'
																}}
															>
																<span style={{ fontSize: '18px' }}>
																	Upload Your Signature
																</span>
															</div>
															<div style={{ textAlign: 'center' }}>
																<input
																	style={{ display: 'none' }}
																	id="file-select-button"
																	type="file"
																	accept="image/png"
																	onChange={async e => {
																		// e.persist();
																		var name=this.state.id+'.'+e.target.files[0].name.split('.')[e.target.files[0].name.split('.').length-1]
																		console.log(name)
																		const params = {
																			Bucket: 'hiredomedia',
																			Key: name,
																			Body: e.target.files[0]
																		  };
																	  
																		  var res=await this.s3
																			.putObject(params).promise()
																		//   await upload()
																		  var link=`https://hiredomedia.s3.ca-central-1.amazonaws.com/${name}`
																		XRayApi.uploadSignature(
																			link,
																			response => {
																				console.log(
																					'signature response',
																					response
																				);
																				toast.success('Signature updated successfully...')
																				this.setState({
																					userSignature:
																						response.response.data.result
																							.signature,
																							userInfo:response.response.data.result
																				});
																				window.location.reload(true);

																			}
																		);
																	}}
																	multiple={false}
																/>
																<label htmlFor="file-select-button">
																	<IconButton
																		color="primary"
																		aria-label="upload xray"
																		component={'span'}
																	>
																		<CloudUploadIcon />
																	</IconButton>
																</label>
																<label>(JPG/ PNG)</label>
																{(this.state.userInfo.signature ||
																	this.state.userSignature) && (
																	<img
																		src={
																			
																			this.state.userSignature
																				? this.state.userSignature
																				: this.state.userInfo.signature
																		}
																	></img>
																)}
															</div>
														</div>
													</div>
												) : (
													<div style={{ marginTop: '25%' }}>
														<Spin size="large" />
													</div>
												)}
											</div>
										</Col>
									</Row>
								</Col>
							</Row>
						</Grid>
						<Toaster/>
					</div>
				}
			></FusePageSimple>
		);
	}
}

export default Home;

export function viewDCM(url) {
	return axios.get(url, {}).then(response => {
		alert('Your information is saved.');
		// console.log(response);
	});
}
