import { notification } from 'antd';
import React, { Component } from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import Pagination from '@material-ui/lab/Pagination';
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import _ from 'lodash'
import moment from 'moment'

export default class AdminFeedbackList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			feedbacks: [],
			surveyorList: [],
			length: [],
			error: {},
			expanded: false,
			userInfo: null,
			page: 0,
			rowsPerPage: 10,
			last_id: "9999", //to keep track of db entry for backend pagination 
			start_id: "9999", //to keep track of db entry for backend pagination and move to previous page in fe
			limits: [1,2,3],
			count: 0
		};
		this.widget = {
			title: 'Budget Details',
			table: {
				columns: [
					{
						id: 'radiologistName',
						title: 'Radiologist Name'
					}
				],
				rows: []
			}
		};
	}
    
	useStyles = makeStyles((theme) => ({
		root: {
		  '& > *': {
			marginTop: theme.spacing(2),
		  },
		},
	  }));
	  
	// on pagination page change
	handleChangePage = (event, newPage) => {
		event.preventDefault();
		let currentPage = this.state.page;
		let len = this.state.surveyorList.length
		let last_id = this.state.surveyorList[len-1].id;
		let start_id = this.state.surveyorList[0].id;
		
		this.setState({start_id: start_id});
		this.setState({last_id: last_id});

		console.log(newPage);
		console.log(currentPage);
		
		let limit = this.state.rowsPerPage;
		this.setState({page: newPage}); 
		
		// to keep track of previous or next page button click
		if (currentPage<newPage) {
		
		this.getSurveyorList(true, last_id, limit);
		}
		else {
		this.getSurveyorList(false, start_id, limit);
		}
		  	
		  
		};
	
	// on rows per page change
	handleChangeRowsPerPage = (event) => {
		event.preventDefault();
		let limit = parseInt(event.target.value, 10);
		this.setState({rowsPerPage: limit});

		this.setState({page: 0}); // on changing rows per page move to the first page 
	
		console.log(this.state.rowsPerPage);
		console.log(limit);
		this.getSurveyorList(true, '9999', limit);
		// this.setState({page: 0});
		
		};
	handleChange = panel => (event, isExpanded) => {
		if (isExpanded) {
			this.setState({ expanded: panel })
		} else {
			this.setState({ expanded: false })
		}

	}
	onFinishFailed = errorInfo => {
		// console.log('Failed:', errorInfo);
	};

	checkUserRole = () => {
		if (this.state.userInfo.role !== 'admin') {
			alert("You aren't given access to survey tool. Please contact with Admin")
			return this.props.history.push('/home');
		}
	}
	apiResponseUserInfo = apiResponse => {
		if (apiResponse.response.status === 200) {
			const userInfo = apiResponse.response.data.result;
			this.setState({ userInfo });
			this.checkUserRole();
		} else {
			return this.props.history.push('/login');
		}
	}
	componentWillMount() {
		XRayApi.userInfo(this.apiResponseUserInfo);
	}
	componentDidMount() {
		
		this.getCountSurveyor(); 
		let limit = this.state.rowsPerPage; 
		
		this.getSurveyorList(true, '9999', limit); 
		this.setState({page: 0});
	}

	// TODO: getFeedback()

	// gets feedbacks of a single user to make downlodable csv link
	getFeedbacks = (surveyor_uuid) => {
		XRayApi.serveFeedbackAdmin(surveyor_uuid, this.apiResponseFeedBacks);
	};
	// gets list of users participated in survey a/c to rows per page
	getSurveyorList = (nextPage, id, limit) => {
		let count = parseInt(localStorage.getItem('count'),10);
		// to handle ui issue check if total no of users in db < rows per page
		if(count<limit) {
			// limit = count;
			XRayApi.serveSurveyorListAdmin(nextPage, id, count, this.apiResponse);
		}
		else 
			XRayApi.serveSurveyorListAdmin(nextPage, id, limit, this.apiResponse);
	};
	// gets total no of users participated in survey
	getCountSurveyor = () => {
		
		XRayApi.countSurveyor(this.apiResponseCount);
	};
	apiResponse = apiResponse => {
		const statusCode = apiResponse.response.status;
		if (statusCode === 200) {
			console.log(apiResponse.response.data.result);
			this.setState({ surveyorList: apiResponse.response.data.result });
			
			// this.setState({ length:max(this.state.feedbacks.name,this.state.feedbacks.createdAt)});
		} else {
			console.log(apiResponse.response);

		}
	};
	apiResponseCount = apiResponse => {
		const statusCode = apiResponse.response.status;
		if (statusCode === 200) {
			console.log(apiResponse.response.data.result);
			localStorage.setItem('count', apiResponse.response.data.result);
			this.setState({ count: apiResponse.response.data.result });
			
			// this.setState({ length:max(this.state.feedbacks.name,this.state.feedbacks.createdAt)});
		} else {
			console.log(apiResponse.response);

		}
	};
	apiResponseFeedBacks = apiResponse => {
		const statusCode = apiResponse.response.status;
		if (statusCode === 200) {
			console.log(apiResponse.response.data.result);
			this.setState({ feedbacks: apiResponse.response.data.result });
			this.createCSV();
			// this.setState({ length:max(this.state.feedbacks.name,this.state.feedbacks.createdAt)});
		} else {
			alert("No feedback found")
			console.log(apiResponse.response);

		}
	};
	apiResponseSave = apiResponse => {
		if (apiResponse.response.status === 200) {
			console.log(apiResponse.response);
		} else {
			console.log("NOT OK!!!!");
		}

	}
	groupBy = (array, key) => {
		// Return the end result
		return array.reduce((result, currentValue) => {
			// If an array already present for key, push it to the array. Else create an array and push the object
			(result[currentValue[key]] = result[currentValue[key]] || []).push(
				currentValue
			);
			// Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
			return result;
		}, {}); // empty object is the initial value for result object
	};

	handleRowClick(surveyor) {
		this.getFeedbacks(surveyor.id);
	}
	

	createCSV() {
		// let row = _.groupBy(this.state.feedbacks, 'name');
		let row = this.state.feedbacks;
		console.log(row[0].feedbackList);
		let data = [];
		this.state.feedbacks.map(feedback=>{

		});
		var gazeData = row[0].feedbackList[0]["gazeData"];
		var screenshots = row[0].feedbackList[0]["screenshots"];
		delete row[0].feedbackList[0]["gazeData"];
		delete row[0].feedbackList[0]["screenshots"]
		console.log(gazeData)
		var gazepointWithTimestamp = []
		gazeData.map(data => {
			gazepointWithTimestamp.push([data.x, data.y, data.timestamp])
		})
		var screenshotWithTimestamp = []
		screenshots.map(data => {
			screenshotWithTimestamp.push([data.screenshot, data.timestamp])
		})
		let columns = Object.keys(row[0].feedbackList[0]);
		console.log(columns);
		columns.push("gaze_data");
		columns.push("screenshots");
		columns.push("name");
		columns.push("dcm_id");
		columns.push("dcm_id_was_servedAt");
		columns.push("actual_hem_type");
		data.push(columns)
		row.map(feedback=>{
			feedback.feedbackList.map(feedbackListData=>{
				let values = Object.values(feedbackListData)
				values[1] = moment(values[1]).format();
				values.push(gazepointWithTimestamp.toString());
				values.push(screenshotWithTimestamp.toString());
				values.push(feedback.name);
				values.push(feedback.dcmId);
				values.push(feedback.relation[0]?moment( feedback.relation[0].serveAt).format():"" );
				values.push(feedback.actual_hem_type);
				data.push(values);
			});
		});

		console.log(data);
		let csvContent = "data:text/csv;charset=utf-8," 
    	+ data.map(e => e.join(",")).join("\n");
		var encodedUri = encodeURI(csvContent);
		var link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", `${row[0].name}.csv`);
		document.body.appendChild(link); // Required for FF

		link.click(); 
	}

	render() {
		// const [page, setPage] = React.useState(2);
		// const [rowsPerPage, setRowsPerPage] = React.useState(10);

		// console.log(this.state.feedbacks);//change
		// const groupBy = (array, key) => {
		// 	// Return the end result
		// 	return array.reduce((result, currentValue) => {
		// 		// If an array already present for key, push it to the array. Else create an array and push the object
		// 		(result[currentValue[key]] = result[currentValue[key]] || []).push(
		// 			currentValue
		// 		);
		// 		// Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
		// 		return result;
		// 	}, {}); // empty object is the initial value for result object
		// };
		// let feedbacks = _.groupBy(this.state.feedbacks, 'name');
		// feedbacks = Object.values(feedbacks)
		
		const classes = makeStyles((theme) => ({
			root: {
			  '& > *': {
				marginTop: theme.spacing(2),
			  },
			},
		  }));
		
		return (
			
			<Paper className="w-full rounded-8 shadow-none border-1">
				<div className="flex items-center justify-between px-16 h-64 border-b-1">
					<Typography
						className="text-16">{(!!this.state.surveyorList ? 'Feedback on ' + this.state.surveyorList.length + ' radiologist' : 'No feedbacks') + ' to show'}</Typography>
				</div>
				<TablePagination
				component="Paper"
				count={this.state.count}
				page={this.state.page}
				onChangePage={this.handleChangePage}
				rowsPerPage={this.state.rowsPerPage}
				onChangeRowsPerPage={this.handleChangeRowsPerPage}
				rowsPerPageOptions={[10,20,30]}
				// labelDisplayedRows={() => {
				// 	return <div className={classes.root}><Pagination count={10} onChangePage={this.handleChangePage} /></div>
				//   }}
			/>
			
				<div className="table-responsive">
					<Table className="w-full min-w-full">
						<TableHead>
							<TableRow>
								<TableCell className="whitespace-no-wrap">
									Radiologist Name
								</TableCell>
								<TableCell className="whitespace-no-wrap">
									Download
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{this.state.surveyorList.map((item, i) => (

								// {Object.keys(feedbacks[key][index]).map(function(k, j) {
								// {this.state.feedbacks.map((feedback,i) => (

								<Fragment>
									<TableRow key={i} hover onClick={() => this.handleRowClick(item)} k>
										<TableCell key={i}>{item.name}
										</TableCell>

										<TableCell component="th" scope="row">
											<a>
												<Typography>
													<Icon className="text-14 mx-4">cloud-download</Icon>
												</Typography>
											</a>
										</TableCell>
									</TableRow>
								</Fragment>
							))}
						</TableBody>
					</Table>
				</div>
			</Paper>
		
		);
	}
}

