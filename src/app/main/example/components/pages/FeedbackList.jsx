import { notification } from 'antd';
import React, { Component } from 'react';
import { Fragment } from 'react';
import XRayApi from '../../api/backend';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { API_BASE_URL_LOCAL } from '../../api/backend';

export default class ControlledExpansionPanels extends Component {
	constructor(props) {
		super(props);
		this.state = {
			feedbacks: [],
			length: [],
			error: {},
			expanded: false,
			userInfo: null
		};
		this.widget = {
			title: 'Budget Details',
			table: {
				columns: [
					{
						id: 'dcmID',
						title: 'DCM ID'
					},
					{
						id: 'radiologistName',
						title: 'Radiologist Name'
					},
					{
						id: 'createdAt',
						title: 'Created at'
					}
				],
				rows: []
			}
		};
	}
	handleChange = panel => (event, isExpanded) => {
		if (isExpanded) {
			this.setState({ expanded: panel });
		} else {
			this.setState({ expanded: false });
		}
	};
	onFinishFailed = errorInfo => {
		// console.log('Failed:', errorInfo);
	};

	checkUserRole = () => {
		if (this.state.userInfo.role !== 'surveyor' && this.state.userInfo.role !== 'admin') {
			alert("You aren't given access to survey tool. Please contact with Admin");
			return this.props.history.push('/home');
		}
	};
	apiResponseUserInfo = apiResponse => {
		if (apiResponse.response.status === 200) {
			const userInfo = apiResponse.response.data.result;
			this.setState({ userInfo });
			this.checkUserRole();
		} else {
			return this.props.history.push('/login');
		}
	};
	componentWillMount() {
		XRayApi.userInfo(this.apiResponseUserInfo);
	}
	componentDidMount() {
		this.getFeedbacks();
	}

	// TODO: getFeedback()
	getFeedbacks = () => {
		XRayApi.serveFeedback(this.apiResponse);
	};
	apiResponse = apiResponse => {
		const statusCode = apiResponse.response.status;
		if (statusCode === 200) {
			// console.log(apiResponse.response.data.result);
			this.setState({ feedbacks: apiResponse.response.data.result });
			// this.setState({ length:max(this.state.feedbacks.name,this.state.feedbacks.createdAt)});
		} else {
			console.log(apiResponse.response);
		}
	};
	apiResponseSave = apiResponse => {
		if (apiResponse.response.status === 200) {
			// console.log(apiResponse.response);
		} else {
			console.log('NOT OK!!!!');
		}
	};
	handleRowClick(row) {
		var dcmId = row.dcmId;
		var haemType = row.fbl.haemType;
		var drawImageUrl = row.fbl.drawImageUrl;
		var textUrl = row.fbl.textUrl;
		var dcmUrl = API_BASE_URL_LOCAL + '/report/1/servedcm/ID_' + dcmId + '.dcm';
		var maskUrl = API_BASE_URL_LOCAL + '/report/1/servecam/ID_' + dcmId + '.png';
		// var url = '/xrayviewer?input=' + dcmUrl + '&feedback=' + drawImageUrl + '&haemType=' + haemType;
		var url = '/visualize-heatmap'
		localStorage.setItem('dcmId', dcmId);
		localStorage.setItem('feedbackid', row.fbl.id);
		localStorage.setItem('maskUrl', maskUrl);
		this.props.history.push(url);
	}

	render() {
		// console.log(this.state.feedbacks);//change
		const groupBy = (array, key) => {
			// Return the end result
			return array.reduce((result, currentValue) => {
				// If an array already present for key, push it to the array. Else create an array and push the object
				(result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
				// Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
				return result;
			}, {}); // empty object is the initial value for result object
		};
		const feedbacksList = groupBy(this.state.feedbacks, 'dcmId');
		const feedbacks = Object.values(feedbacksList);

		const feed = new Array();
		var index = 0;

		for (let j = 0; j < feedbacks.length; j++) {
			for (let k = 0; k < feedbacks[j].length; k++) {
				feed[index] = feedbacks[j][k];
				index++;
			}
		}
console.log(feed)
		return (
			<Paper className="w-full rounded-8 shadow-none border-1">
				<div className="flex items-center justify-between px-16 h-64 border-b-1">
					<Typography className="text-16">
						{(!!this.state.feedbacks
							? 'Feedback on ' + this.state.feedbacks.length + ' dcm file'
							: 'No feedbacks') + ' to show'}
					</Typography>
				</div>
				<div className="table-responsive">
					<Table className="w-full min-w-full">
						<TableHead>
							<TableRow>
								<TableCell className="whitespace-no-wrap">DCM ID</TableCell>
								<TableCell className="whitespace-no-wrap">Radiologist Name</TableCell>
								<TableCell className="whitespace-no-wrap">Date</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{feed.map((item, i) => (
								// {Object.keys(feedbacks[key][index]).map(function(k, j) {
								// {this.state.feedbacks.map((feedback,i) => (

								<Fragment>
									{/* {feedback.i.map((feed,i) => ( */}
									<TableRow key={i} hover onClick={() => this.handleRowClick(item)} k>
										<TableCell>ID_{item.dcmId}.dcm</TableCell>

										{/* <ExpansionPanel>
											<ExpansionPanelSummary
											expandIcon={<ExpandMoreIcon />}
											aria-controls="panel1a-content"
											id="panel1a-header">	 */}
										<TableCell key={i}>{item.name}</TableCell>

										<TableCell key={i}>{item.fbl.createdAt}</TableCell>
									</TableRow>
									{/* </ExpansionPanelSummary>
											<ExpansionPanelDetails> */}
									{/* <TableRow key={i}> */}
									{/* {Object.keys(feedback.fbl).map((itd,num) => (
													<TableRow key={num}>
													{itd[num].map((d,n) => (
												<TableCell hover onClick={()=>this.handleRowClick(feedback,n)} key={n}>{d}<br></br>
												</TableCell>))}
												</TableRow>
												))} */}
									{/* </TableRow> */}
									{/* </ExpansionPanelDetails>
										</ExpansionPanel> */}
									{/* ))}  */}
								</Fragment>
							))}
						</TableBody>
					</Table>
				</div>
			</Paper>
		);
	}
}
