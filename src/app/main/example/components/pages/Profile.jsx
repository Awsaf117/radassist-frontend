import React, { useEffect } from 'react';
import { validateAccessToken } from '../../api/utilities';
import XRayApi from '../../api/backend';
import { Spin } from 'antd';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ReportIcon from '@material-ui/icons/Report';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import Grid from '@material-ui/core/Grid';
import FusePageSimple from '@fuse/core/FusePageSimple';
import * as authActions from 'app/auth/store/actions';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import CallEndIcon from '@material-ui/icons/CallEnd';
import HomeIcon from '@material-ui/icons/Home';
import { flattenErrorMessages, formatDate } from '../../api/utilities';
import SnackbarAlert from '../subComponent/SnackbarAlert';

const useStyles = makeStyles(theme => ({
	margin: {
		margin: theme.spacing(5),
		display: 'flex',
		alignItems: 'center'
	}
}));

function Profile(props) {
	const dispatch = useDispatch();
	const user = useSelector(({ auth }) => auth.user);

	const classes = useStyles();
	const uid = props.match.params.id;
	// console.log('FROM PROFILE', uid);
	const [address, setAddress] = useState('');
	const [designation, setDesignation] = useState('');
	const [email, setEmail] = useState('');
	const [phone_number, setPhoneNumber] = useState('');
	const [qualification, setQualification] = useState('');
	const [secondary_phone_number, setSecondaryPhoneNumber] = useState('');
	const [errormessage, setErrormessage] = useState('');
	const [updatedPassword, setNewPassword] = useState('');
	const [name, setName] = useState('');

	const handlePhoneNumberChange = event => setPhoneNumber(event.target.value);
	const handleSecondaryPhoneNumberChange = event => setSecondaryPhoneNumber(event.target.value);
	const handleEmailChange = event => setEmail(event.target.value);
	const handleAddressChange = event => setAddress(event.target.value);
	const handleQualificationChange = event => setQualification(event.target.value);
	const handlePassChange = event => setNewPassword(event.target.value);

	const getProfileByIdApiCallback = apiResponse => {
		const result = apiResponse.response.data.result;
		// console.log('FROMPROFILECALLBACK', result);
		setPhoneNumber(result.phone_number);
		setSecondaryPhoneNumber(result.secondary_phone_number);
		setEmail(result.email);
		setDesignation(result.designation);
		setAddress(result.address);
		setQualification(result.qualification);
		setName(result.name);
	};

	useEffect(() => {
		XRayApi.getProfileById(uid, getProfileByIdApiCallback);
	}, []);

	const postProfileUpdateCallback = apiResponse => {
		if (apiResponse.response.status === 201) {
			props.history.push('/home');
		} else {
			const errorMessage = flattenErrorMessages(apiResponse);
			setErrormessage(errorMessage);
		}
	};

	const SaveChanges = event => {
		// console.log('SAVED');
		const data = {
			address: address,
			designation: ['Doctor', 'Radiologist'],
			email: email,
			phone_number: phone_number,
			qualification: qualification,
			secondary_phone_number: secondary_phone_number,
			password: updatedPassword
		};
		XRayApi.postProfileUpdate(uid, data, postProfileUpdateCallback);
	};

	return (
		<FusePageSimple
			header={
				<div className="p-24">
					<h4>{'User Profile'}</h4>
				</div>
			}
			contentToolbar={
				<div className="px-24">
					<div> </div>
				</div>
			}
			content={
				<div container style={{ textAlign: 'center' }}>
					<div style={{ maxWidth: '70%' }}>
						{errormessage &&
							errormessage.map((index, msg) => (
								<SnackbarAlert key={index} severity="error">
									{msg}
								</SnackbarAlert>
							))}
					</div>
					<div>
						<h1>{name}</h1>
					</div>
					<div>
						<h5>Edit User Information</h5>
					</div>
					<div className={classes.margin}>
						<Grid container spacing={1} alignItems="flex-end">
							<Grid item>
								<CallEndIcon />
							</Grid>
							<Grid item>
								<TextField
									id="input-with-icon-grid"
									label="Edit Mobile number"
									value={phone_number}
									onChange={handlePhoneNumberChange}
								/>
							</Grid>
						</Grid>
					</div>
					<div className={classes.margin}>
						<Grid container spacing={1} alignItems="flex-end">
							<Grid item>
								<AssignmentIndIcon />
							</Grid>
							<Grid item>
								<TextField
									id="input-with-icon-grid"
									label="Add Another Phone "
									value={secondary_phone_number}
									onChange={handleSecondaryPhoneNumberChange}
								/>
							</Grid>
						</Grid>
					</div>

					<div className={classes.margin}>
						<Grid container spacing={1} alignItems="flex-end">
							<Grid item>
								<MailOutlineIcon />
							</Grid>
							<Grid item>
								<TextField
									id="input-with-icon-grid"
									label="Edit Email Address"
									value={email}
									onChange={handleEmailChange}
								/>
							</Grid>
						</Grid>
					</div>
					<div className={classes.margin}>
						<Grid container spacing={1} alignItems="flex-end">
							<Grid item>
								<AssignmentIndIcon />
							</Grid>
							<Grid item>
								<TextField
									id="input-with-icon-grid"
									label="Update Password"
									type="password"
									value={updatedPassword}
									onChange={handlePassChange}
								/>
							</Grid>
						</Grid>
					</div>

					<div className={classes.margin}>
						<Grid container spacing={1} alignItems="flex-end">
							<Grid item>
								<HomeIcon />
							</Grid>
							<Grid item>
								<TextField
									id="standard-textarea"
									label="Add Address"
									/* placeholder="Add Address" */
									multiline
									value={address}
									onChange={handleAddressChange}
								/>
							</Grid>
						</Grid>
					</div>
					<div className={classes.margin}>
						<Grid container spacing={1} alignItems="flex-end">
							<Grid item>
								<HomeIcon />
							</Grid>
							<Grid item>
								<TextField
									id="standard-textarea"
									label="Add Qualifications"
									/* placeholder="Add Qualifications" */
									value={qualification}
									onChange={handleQualificationChange}
									multiline
								/>
							</Grid>
						</Grid>
					</div>
					<Button
						variant="contained"
						color="primary"
						size="small"
						className={classes.button}
						startIcon={<SaveIcon />}
						onClick={SaveChanges}
					>
						Save Changes
					</Button>
				</div>
			}
		></FusePageSimple>
	);
}

export default Profile;
