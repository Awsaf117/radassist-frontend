import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

import { notification, Typography } from 'antd';
import { TextFieldFormsy } from '@fuse/core/formsy';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import * as authActions from 'app/auth/store/actions';
import Formsy from 'formsy-react';
import XRayApi, { FACE_AUTH_URL } from '../../../api/backend';
import history from '@history';
import { flattenErrorMessages, clearLocalStorage, setAccessToken } from '../../../api/utilities';
import Webcam from 'react-webcam'
import { CameraOptions, useFaceDetection } from 'react-use-face-detection';
import FaceDetection from '@mediapipe/face_detection';
import { Camera } from '@mediapipe/camera_utils';
import { DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import Axios from 'axios';

const JWTLoginTab = (props) => {
	const dispatch = useDispatch();
	const login = useSelector(({ auth }) => auth.login);

	const [imageSource, setImageSource] = useState(null)

	const [isFormValid, setIsFormValid] = useState(false);

	const [forgotWindow, setForgotWindow] = useState(0)


	const [loading, setLoading] = useState(false)

	const formRef = useRef(null);


	var width = window.innerWidth / 7
	var height = window.innerWidth / 7
	width = Math.min(width, height)
	height = width

	const { webcamRef, boundingBox, isLoading, detected, facesDetected } = useFaceDetection({
		faceDetectionOptions: {
			model: 'short',
		},
		faceDetection: new FaceDetection.FaceDetection({
			locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
		}),
		camera: ({ mediaSrc, onFrame }) =>
			new Camera(mediaSrc, {
				onFrame,
				width,
				height,
			}),
	});


	function dataURLtoFile(dataurl, filename) {
		var arr = dataurl.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[arr.length - 1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new File([u8arr], filename, { type: mime });
	}

	useEffect(() => {
		clearLocalStorage();
		if (login.error && (login.error.email || login.error.password)) {
			formRef.current.updateInputsWithError({
				...login.error
			});
			setIsFormValid(false);
		}
	}, [login.error]);

	const [savedPhone,setSavedPhone]=useState('')

	const handleSubmit = (values) => {
		if (forgotWindow === 0) {
			const { phone: phone_number, password } = values;
			const imageSrc = webcamRef.current.getScreenshot();
			if (facesDetected === 1) {
				var formData = new FormData();
				var imagefile = dataURLtoFile(imageSrc, "image.jpeg")
				formData.append("image", imagefile);
				setLoading(true)
				Axios.post(`${FACE_AUTH_URL}/verify-face/${phone_number}`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}).then(res => {
					XRayApi.userLogin({ phone_number, password }, apiResponse);

				}).catch(err => {
					toast.error('Face doesnot match')
					setLoading(false)
				})
				//XRayApi.userfaceAuth({imageSource}, apiResponse);

			}
			else if (facesDetected === 0)
				toast.error('No face found')
			else if (facesDetected > 1)
				toast.error('Multiple face error')
			else
				toast.error('Camera is not ready yet')
		}else if(forgotWindow===1){
			const { phone: phone_number} = values;
			const imageSrc = webcamRef.current.getScreenshot();
			if (facesDetected === 1) {
				var formData = new FormData();
				var imagefile = dataURLtoFile(imageSrc, "image.jpeg")
				formData.append("image", imagefile);
				setLoading(true)
				Axios.post(`${FACE_AUTH_URL}/verify-face/${phone_number}`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				}).then(res => {
					setLoading(false)
					setSavedPhone(phone_number)
					setForgotWindow(2)

				}).catch(err => {
					toast.error('Face doesnot match')
					setLoading(false)
				})
				//XRayApi.userfaceAuth({imageSource}, apiResponse);

			}
			else if (facesDetected === 0)
				toast.error('No face found')
			else if (facesDetected > 1)
				toast.error('Multiple face error')
			else
				toast.error('Camera is not ready yet')
		}else if(forgotWindow===2){
			const { password } = values;
			setLoading(true)
			XRayApi.userForgotPassword({ phone_number:savedPhone, password }, apiResponseForgotPassword);
		}
	};

	const apiResponse = (apiResponse) => {
		if (apiResponse.response.status === 200) {
			const accessToken = apiResponse.response.data.result.access_token;
			const isAdmin = apiResponse.response.data.result.admin;
			setAccessToken(`Bearer ${accessToken}`);
			history.push(isAdmin ? '/user-list' : '/home');
		} else {
			toast.error('phone_number/password combination is invalid')
		}
		setLoading(false)
	};

	const apiResponseForgotPassword = (apiResponse) => {
		if (apiResponse.response.status === 200) {
			toast.success('Password is reset successfully...')
			setForgotWindow(0)
		} else {
			toast.error('Error occured in resetting password')
		}
		setLoading(false)
	};

	const openNotificationWithIcon = (type, message, description) => {
		notification[type]({
			message,
			description
		});
	};

	return (
		<div className="w-full">
			<Typography variant="h2" style={{
				fontSize: '1.6em'
			}} className="text-center md:w-full mb-48">
				{forgotWindow === 0 && 'LOGIN TO YOUR ACCOUNT'}
				{forgotWindow === 1 && 'VERIFY OWNERSHIP'}
				{forgotWindow === 2 && 'ENTER NEW PASSWORD'}
			</Typography>
			<Formsy
				onValidSubmit={handleSubmit}
				onValid={() => setIsFormValid(true)}
				onInvalid={() => setIsFormValid(false)}
				ref={formRef}
				className="flex flex-col justify-center w-full"
			>
				{
					(forgotWindow === 0 || forgotWindow === 1) && <TextFieldFormsy
						className="mb-16"
						type="number"
						name="phone"
						label="Phone"
						validations={{
							minLength: 11,
							maxLength: 11
						}}
						validationErrors={{
							minLength: 'Phone number must be of length 11',
							maxLength: 'Phone number must be of length 11'
						}}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Icon className="text-20" color="action">phone</Icon>
								</InputAdornment>
							)
						}}
						variant="outlined"
						required
					/>
				}

				{
					(forgotWindow === 0 || forgotWindow === 2) && <TextFieldFormsy
						className="mb-16"
						type="password"
						name="password"
						label="Password"
						validations={{ minLength: 8 }}
						validationErrors={{ minLength: 'Min character length is 8' }}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<Icon className="text-20" color="action">vpn_key</Icon>
								</InputAdornment>
							)
						}}
						variant="outlined"
						required
					/>
				}

				{
					forgotWindow === 2 && <TextFieldFormsy
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
									<Icon className="text-20" color="action">vpn_key</Icon>
								</InputAdornment>
							)
						}}
						variant="outlined"
						required
					/>
				}


				{
					(forgotWindow === 0 || forgotWindow === 1) && <center>
						<div style={{ marginTop: '-20px', marginBottom: '-10px' }}>

							<DialogContent>
								<div style={{ width, height, position: 'relative', overflow: 'hidden' }}>
									{boundingBox.map((box, index) => (
										<div
											key={`${index + 1}`}
											style={{
												border: '4px solid red',
												position: 'absolute',
												top: `${box.yCenter * 100}%`,
												left: `${box.xCenter * 100}%`,
												width: `${box.width * 100}%`,
												height: `${box.height * 100}%`,
												zIndex: 1,
											}}
										/>
									))}
									<Webcam
										ref={webcamRef}
										forceScreenshotSourceSize
										screenshotFormat="image/jpeg"
										style={{
											height,
											width,
											position: 'absolute',
										}}
									/>
								</div>
							</DialogContent>
						</div>
					</center>
				}

				<Button
					type="submit"
					variant="contained"
					color="primary"
					className="w-full mx-auto mt-16 normal-case"
					aria-label="LOG IN"
					disabled={loading || (!isFormValid || (forgotWindow !== 2 && facesDetected !== 1))}
					value="legacy"
				>
					{forgotWindow === 0 && 'Login'}
					{forgotWindow === 1 && 'Verify'}
					{forgotWindow === 2 && 'Update Password'}
				</Button>

				<Button
					onClick={() => {
						setForgotWindow(forgotWindow === 0 ? 1 : 0)
					}}
					disabled={loading}
					color="primary"
					className="w-full mx-auto mt-16 normal-case"
					aria-label="BACK"
				>
					{forgotWindow === 0 && 'Forgot Password ?'}
					{forgotWindow !== 0 && 'Back to Login'}
				</Button>
			</Formsy>

		</div>
	);
};

export default JWTLoginTab;

