// JWTRegisterTab.js
import React, { useState, useEffect, useRef } from 'react';
import { notification } from 'antd';
import XRayApi from '../../../api/backend';
import { CheckboxFormsy, TextFieldFormsy, SelectFormsy } from '@fuse/core/formsy';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import Formsy from 'formsy-react';
import history from '@history';
import { flattenErrorMessages } from '../../../api/utilities';
import MenuItem from '@material-ui/core/MenuItem';

const JWTRegisterTab = props => {
	const [isFormValid, setIsFormValid] = useState(false);
	const [hospitals, setHospitals] = useState([{ name: '', id: '' }]);
	const [selectedHospital, setSelectedHospital] = useState({});

	const userPhoneRef=useRef(null)

	const formRef = useRef(null);

	useEffect(() => {
		XRayApi.getHospitals(handleGetHospitalsResponse);
	}, []);

	const handleGetHospitalsResponse = (apiResponse) => {
		const statusCode = apiResponse.response.status;
		if (statusCode === 200) {
			setHospitals(apiResponse.response.data.result);
		} else {
			openNotificationWithIcon('error', 'No Hospitals to show', apiResponse.response.data.error.msg);
		}
	};

	const apiResponse = (apiResponse) => {
		if (apiResponse.response.status === 201) {
			history.push(`faceauthregister/${userPhoneRef.current}`);
		} else {
			props.showErrors(flattenErrorMessages(apiResponse));
		}
	};

	const onFinish = (values) => {
		const { name, phone: phone_number, password, reg_no, conPassword: confirm_password, designation_doc, designation_rad } = values;
		userPhoneRef.current=phone_number
		if (password !== confirm_password) {
			openNotificationWithIcon('error', 'Validation failed', 'Password does not match');
			return;
		}

		const designation = [];
		if (designation_doc) designation.push('Doctor');
		if (designation_rad) designation.push('Radiologist');

		const hospital = selectedHospital;
		XRayApi.userSignup({ name, phone_number, password, designation, hospital }, apiResponse);
	};

	const openNotificationWithIcon = (type, message, description) => {
		notification[type]({
			message: message,
			description: description,
		});
	};

	return (
		<div className="w-full">
			<Formsy
				onValidSubmit={onFinish}
				onValid={() => setIsFormValid(true)}
				onInvalid={() => setIsFormValid(false)}
				ref={formRef}
				className="flex flex-col justify-center w-full"
			>
				<TextFieldFormsy
					className="mb-16"
					type="text"
					label="Full name"
					name="name"
					validations={{ minLength: 1 }}
					validationErrors={{ minLength: 'This field can not be empty' }}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">person</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>
				<TextFieldFormsy
					className="mb-16"
					type="text"
					label="Registration No"
					name="reg_no"
					validations={{
						minLength: 4
					}}
					validationErrors={{
						minLength: 'Registration number must be 4 characters long'
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									code
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>
				<TextFieldFormsy
					className="mb-16"
					type="number"
					label="Phone"
					name="phone"
					validations={{
						minLength: 11,
						maxLength:11
					}}
					validationErrors={{
						minLength: 'Phone number must be of length 11',
						maxLength: 'Phone number must be of length 11'
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									phone
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>

				<TextFieldFormsy
					className="mb-16"
					type="password"
					name="password"
					label="Password"
					validations={{
						minLength: 8
					}}
					validationErrors={{
						minLength: 'Min character length is 8'
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									vpn_key
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>

				<TextFieldFormsy
					className="mb-16"
					type="password"
					name="conPassword"
					label="Confirm Password"
					validations="equalsField:password"
					validationErrors={{
						equalsField: 'Passwords do not match'
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Icon className="text-20" color="action">
									vpn_key
								</Icon>
							</InputAdornment>
						)
					}}
					variant="outlined"
					required
				/>
				<div className="flex flex-col sm:flex sm:flex-row">
					<CheckboxFormsy
						className="mb-16"
						type="checkbox"
						name="designation_doc"
						label="Doctor"
						value={false}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Icon className="text-20" color="action">
										vpn_key
									</Icon>
								</InputAdornment>
							)
						}}
						variant="outlined"
					/>

					<CheckboxFormsy
						className="mb-16"
						type="checkbox"
						name="designation_rad"
						label="Radiologist"
						value={false}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Icon className="text-20" color="action">
										vpn_key
									</Icon>
								</InputAdornment>
							)
						}}
						variant="outlined"
					/>
				</div>        <SelectFormsy
					className="mb-16"
					name="selectedHospital"
					label="Select Hospital"
					value={selectedHospital}
					onChange={(e) => setSelectedHospital(e.target.value)}
					variant="outlined"
					required
				>
					{hospitals.map((itm, index) => (
						<MenuItem key={index} value={itm}>{itm.name}</MenuItem>
					))}
				</SelectFormsy>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					className="w-full mx-auto mt-16 normal-case"
					aria-label="REGISTER"
					disabled={!isFormValid}
					value="legacy"
				>
					Register
				</Button>
			</Formsy>
		</div>
	);
};

export default JWTRegisterTab;



// import { notification } from 'antd';
// import XRayApi from '../../../api/backend';
// import { CheckboxFormsy, TextFieldFormsy, SelectFormsy } from '@fuse/core/formsy';
// import Button from '@material-ui/core/Button';
// import Icon from '@material-ui/core/Icon';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import Formsy from 'formsy-react';
// import React, { Component } from 'react';
// import history from '@history';
// import { flattenErrorMessages } from '../../../api/utilities';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';

// const layout = {
// 	labelCol: {
// 		span: 8
// 	},
// 	wrapperCol: {
// 		span: 16
// 	}
// };

// const tailLayout = {
// 	wrapperCol: {
// 		offset: 8,
// 		span: 16
// 	}
// };

// class JWTRegisterTab extends Component {
// 	constructor(props, context) {
// 		super(props);
// 		this.dispatch = null;
// 		this.login = null;
// 		this.isFormValid = null;
// 		this.setIsFormValid = null;
// 		this.formRef = null;
// 		this.hospitals = null;
// 		this.selectedHospital = null;
// 	}

// 	state = {
// 		isFormValid: false,
// 		hospitals: [
// 			{
// 				name: '',
// 				id: ''
// 			}
// 		],
// 		selectedHospital: {}
// 	};

// 	componentDidMount() {
// 		// console.log(this.hospitals);
// 		XRayApi.getHospitals(this.handleGetHospitalsResponse);
// 	}

// 	hospitalFieldOnChange = e => {
// 		e.persist();
// 		this.setState({ selectedHospital: e.target.value });
// 	};

// 	handleGetHospitalsResponse = apiResponse => {
// 		const statusCode = apiResponse.response.status;
// 		if (statusCode === 200) {
// 			this.setState({ hospitals: apiResponse.response.data.result });
// 		} else {
// 			this.setState({ error: true, errorMessage: '' });
// 			this.openNotificationWithIcon('error', 'No Hospitals to show', apiResponse.response.data.error.msg);
// 		}
// 	};

// 	apiResponse = apiResponse => {
// 		if (apiResponse.response.status === 201) {
// 			return history.push('/login');
// 		} else {
// 			this.props.showErrors(flattenErrorMessages(apiResponse));
// 		}
// 	};

// 	onFinish = values => {
// 		const {
// 			name,
// 			phone: phone_number,
// 			password,
// 			reg_no,
// 			conPassword: confirm_password,
// 			designation_doc,
// 			designation_rad,
// 			selectedHospital
// 		} = values;
// 		if (password !== confirm_password) {
// 			this.openNotificationWithIcon('error', 'Validation failed', 'Password does not match');
// 			return;
// 		}

// 		const designation = [];
// 		if (designation_doc) designation.push('Doctor');
// 		if (designation_rad) designation.push('Radiologist');

// 		const hospital = selectedHospital;
// 		XRayApi.userSignup({ name, phone_number,/*reg_no,*/ password, designation, hospital }, this.apiResponse);
// 	};

// 	openNotificationWithIcon = (type, message, description) => {
// 		notification[type]({
// 			message: message,
// 			description: description
// 		});
// 	};

// 	enableButton = () => {
// 		this.setState({ isFormValid: true });
// 	};

// 	disableButton = () => {
// 		this.setState({ isFormValid: false });
// 	};

// 	render() {
// 		return (
// 			<div className="w-full">
// 				<Formsy
// 					onValidSubmit={this.onFinish}
// 					onValid={this.enableButton}
// 					onInvalid={this.disableButton}
// 					ref={this.formRef}
// 					className="flex flex-col justify-center w-full"
// 				>
// 					<TextFieldFormsy
// 						className="mb-16"
// 						type="text"
// 						label="Full name"
// 						name="name"
// 						validations={{
// 							minLength: 1
// 						}}
// 						validationErrors={{
// 							minLength: 'This field can not be empty'
// 						}}
// 						InputProps={{
// 							endAdornment: (
// 								<InputAdornment position="end">
// 									<Icon className="text-20" color="action">
// 										person
// 									</Icon>
// 								</InputAdornment>
// 							)
// 						}}
// 						variant="outlined"
// 						required
// 					/>

// 					<TextFieldFormsy
// 						className="mb-16"
// 						type="text"
// 						label="Registration No"
// 						name="reg_no"
// 						validations={{
// 							minLength: 4
// 						}}
// 						validationErrors={{
// 							minLength: 'Registration number must be 4 characters long'
// 						}}
// 						InputProps={{
// 							endAdornment: (
// 								<InputAdornment position="end">
// 									<Icon className="text-20" color="action">
// 										code
// 									</Icon>
// 								</InputAdornment>
// 							)
// 						}}
// 						variant="outlined"
// 						required
// 					/>

// 					<TextFieldFormsy
// 						className="mb-16"
// 						type="text"
// 						label="Phone"
// 						name="phone"
// 						validations={{
// 							minLength: 11
// 						}}
// 						validationErrors={{
// 							minLength: 'Min character length is 11'
// 						}}
// 						InputProps={{
// 							endAdornment: (
// 								<InputAdornment position="end">
// 									<Icon className="text-20" color="action">
// 										phone
// 									</Icon>
// 								</InputAdornment>
// 							)
// 						}}
// 						variant="outlined"
// 						required
// 					/>

// 					<TextFieldFormsy
// 						className="mb-16"
// 						type="password"
// 						name="password"
// 						label="Password"
// 						validations={{
// 							minLength: 8
// 						}}
// 						validationErrors={{
// 							minLength: 'Min character length is 8'
// 						}}
// 						InputProps={{
// 							endAdornment: (
// 								<InputAdornment position="end">
// 									<Icon className="text-20" color="action">
// 										vpn_key
// 									</Icon>
// 								</InputAdornment>
// 							)
// 						}}
// 						variant="outlined"
// 						required
// 					/>

// 					<TextFieldFormsy
// 						className="mb-16"
// 						type="password"
// 						name="conPassword"
// 						label="Confirm Password"
// 						validations="equalsField:password"
// 						validationErrors={{
// 							equalsField: 'Passwords do not match'
// 						}}
// 						InputProps={{
// 							endAdornment: (
// 								<InputAdornment position="end">
// 									<Icon className="text-20" color="action">
// 										vpn_key
// 									</Icon>
// 								</InputAdornment>
// 							)
// 						}}
// 						variant="outlined"
// 						required
// 					/>
// 					<div className="flex flex-col sm:flex sm:flex-row">
// 						<CheckboxFormsy
// 							className="mb-16"
// 							type="checkbox"
// 							name="designation_doc"
// 							label="Technician"
// 							value={false}
// 							InputProps={{
// 								endAdornment: (
// 									<InputAdornment position="end">
// 										<Icon className="text-20" color="action">
// 											vpn_key
// 										</Icon>
// 									</InputAdornment>
// 								)
// 							}}
// 							variant="outlined"
// 						/>

// 						<CheckboxFormsy
// 							className="mb-16"
// 							type="checkbox"
// 							name="designation_rad"
// 							label="Radiologist"
// 							value={false}
// 							InputProps={{
// 								endAdornment: (
// 									<InputAdornment position="end">
// 										<Icon className="text-20" color="action">
// 											vpn_key
// 										</Icon>
// 									</InputAdornment>
// 								)
// 							}}
// 							variant="outlined"
// 						/>
// 					</div>

// 					<SelectFormsy
// 						className="mb-16"
// 						name="selectedHospital"
// 						label="Select Hospital"
// 						value="none"
// 						InputProps={{
// 							endAdornment: (
// 								<InputAdornment position="end">
// 									<Icon className="text-20" color="action">
// 										vpn_key
// 									</Icon>
// 								</InputAdornment>
// 							)
// 						}}
// 						validationErrors={{
// 							equalsField: 'Hospital Must be selected'
// 						}}
// 						variant="outlined"
// 					>
// 						{this.state.hospitals.map(itm => (
// 							<MenuItem value={itm}>{itm.name}</MenuItem>
// 						))}
// 					</SelectFormsy>

// 					<Button
// 						type="submit"
// 						variant="contained"
// 						color="primary"
// 						className="w-full mx-auto mt-16 normal-case"
// 						aria-label="REGISTER"
// 						disabled={!this.state.isFormValid}
// 						value="legacy"
// 					>
// 						Register
// 					</Button>
// 				</Formsy>
// 			</div>
// 		);
// 	}
// }

// export default JWTRegisterTab;
