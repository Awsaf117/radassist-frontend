import { notification } from 'antd';
import React, { Component } from 'react';
import XRayApi from '../../api/backend';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import history from '@history';
import moment from 'moment';
import Button from '@material-ui/core/Button';
import { downloadReport } from '../../api/utilities';
import draftToHtml from 'draftjs-to-html';
import Checkbox from '@material-ui/core/Checkbox';

class UserList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			users: {}
		};
		this.widget = {
			title: 'Budget Details',
			table: {
				columns: [
					{
						id: 'userName',
						title: 'Full Name'
					},
					{
						id: 'phoneNo',
						title: 'Contact No.'
					},
					{
						id: 'accessStatus',
						title: 'Access Status'
					},
					{
						id: 'surveyPermit',
						title: 'Survey Permission'
					},
					{
						id: 'registerFace',
						title: 'Face Registration'
					}
				],
				rows: []
			}
		};
	}

	componentDidMount() {
		this.getUserInfo();
		this.getUsers();
	}

	checkUserRole = () => {
		if (this.state.userInfo.role !== 'admin') {
			console.log(this.state.userInfo)
			this.props.history.push('/home');
		}
	};
	getUserInfo() {
		XRayApi.userInfo(this.apiResponseUserInfoCallback);
	}

	apiResponseUserInfoCallback = apiResponse => {
		if (apiResponse.response.status === 200) {
			const userInfo = apiResponse.response.data.result;
			const userName = apiResponse.response.data.result.name;
			localStorage.setItem('userName', userName);
			this.setState({ userInfo });
			this.checkUserRole();
		} else {
			return this.props.history.push('/login');
		}
	};

	apiResponse = apiResponse => {
		const statusCode = apiResponse.response.status;
		if (statusCode === 200) {
			this.setState({ users: apiResponse.response.data.result });
		} else {
			this.setState({ error: true, errorMessage: '' });
		}
	};
	apiCallResponse = apiResponse => {
		const statusCode = apiResponse.response.status;
		if (statusCode === 200) {
			console.log('OK');
		} else {
			console.log('Something going wrong!!!');
		}
	};

	getUsers = () => {
		XRayApi.getUser(this.apiResponse);
	};
	onCheckBoxChange = e => {
		const { value, checked } = e.target;
		// console.log(value);
		// console.log(checked);
		var role = '';
		if (checked) {
			role = 'visitor';
		}
		XRayApi.updateRole({ value, role }, this.apiCallResponse);
	};
	onSurveyCheckBoxChange = e => {
		const { value, checked } = e.target;
		// console.log(value);
		// console.log(checked);
		var role = '';
		if (checked) {
			role = 'surveyor';
		}
		XRayApi.updateRole({ value, role }, this.apiCallResponse);
	};
	render() {
		if (!(JSON.stringify(this.state.users) === JSON.stringify({}))) {
			var rows = this.state.users.map(user => {
				var flag = false;
				if (user.role === 'visitor' || user.role === 'admin') {
					flag = true;
				}
				var surveyFlag = false;
				if (user.role === 'surveyor') {
					surveyFlag = true;
				}
				let userStatusClass = userStatus => {
					switch (userStatus) {
						case 0:
							return 'bg-red text-white';
						case 1:
							return 'bg-blue text-white';
						default:
							return 'bg-green text-white';
					}
				};

				return {
					id: user.id,
					cells: [
						{
							id: 'userName',
							value: user.name,
							classes: 'font-bold',
							icon: ''
						},
						{
							id: 'phoneNo',
							value: user.phone_number,
							classes: 'font-bold',
							icon: ''
						},
						{
							id: 'accessStatus',
							value: (
								<Checkbox
									id={user.phone_number}
									defaultChecked={flag}
									value={user.phone_number}
									onChange={this.onCheckBoxChange}
								>
									{' '}
								</Checkbox>
							),
							classes: '',
							icon: ''
						},
						{
							id: 'surveyPermit',
							value: (
								<Checkbox
									id={user.phone_number}
									defaultChecked={surveyFlag}
									value={user.phone_number}
									onChange={this.onSurveyCheckBoxChange}
								>
									{' '}
								</Checkbox>
							),
							classes: '',
							icon: ''
						}
					]
				};
			});
			this.widget.table.rows = rows;
		}

		// console.log(rows);
		console.warn(this.state.users);
		return (
			<Paper className="w-full rounded-8 shadow-none border-1">
				<div className="flex items-center justify-between px-16 h-64 border-b-1">
					<Typography className="text-16">
						{(!!this.state.users ? this.state.users.length : 'No users') + ' users to show'}
					</Typography>
				</div>
				<div className="table-responsive">
					<Table className="w-full min-w-full">
						<TableHead>
							<TableRow>
								{this.widget.table.columns.map(column => (
									<TableCell key={column.id} className="whitespace-no-wrap">
										{column.title}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{this.widget.table.rows.map(row => (
								<TableRow
									key={row.id}
									hover
									role="checkbox"
									aria-checked={true}
									tabIndex={-1}
									key={row.id}
									selected={true}
								>
									{row.cells.map(cell => {
										switch (cell.id) {
											case 'userName': {
												return (
													<TableCell key={cell.id} component="th" scope="row">
														<Typography
															className={clsx(
																cell.classes,
																'inline text-11 font-500 px-8 py-4 rounded-4'
															)}
														>
															{cell.value}
														</Typography>
													</TableCell>
												);
											}
											case 'phoneNo': {
												return (
													<TableCell key={cell.id} component="th" scope="row">
														<Typography className={clsx(cell.classes, 'flex items-center')}>
															{cell.value}
															<Icon className="text-14 mx-4">{cell.icon}</Icon>
														</Typography>
													</TableCell>
												);
											}
											case 'accessStatus': {
												return (
													<TableCell key={cell.id} component="th" scope="row">
														<Typography className={clsx(cell.classes, 'flex items-center')}>
															{cell.value}
															<Icon className="text-14 mx-4">{cell.icon}</Icon>
														</Typography>
													</TableCell>
												);
											}
											case 'surveyPermit': {
												return (
													<TableCell key={cell.id} component="th" scope="row">
														<Typography className={clsx(cell.classes, 'flex items-center')}>
															{cell.value}
															<Icon className="text-14 mx-4">{cell.icon}</Icon>
														</Typography>
													</TableCell>
												);
											}
											default: {
												return (
													<TableCell key={cell.id} component="th" scope="row">
														<Typography className={cell.classes}>{cell.value}</Typography>
													</TableCell>
												);
											}
										}
									})}
									<TableCell component="th" scope="row">
										<Button
											variant='contained'
											color='primary'
											onClick={()=>{
												this.props.history.push(`/faceauthregister/${row.cells[1].value}`)
											}}
											>
												Register
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</Paper>
		);
	}
}

export default UserList;
