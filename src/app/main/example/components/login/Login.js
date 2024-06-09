import FuseAnimate from '@fuse/core/FuseAnimate';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import { darken } from '@material-ui/core/styles/colorManipulator';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import JWTLoginTab from './tabs/JWTLoginTab';
import SnackbarAlert from '../subComponent/SnackbarAlert';

import { Button, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	root: {
		background: 'white',
		color: theme.palette.primary.contrastText
	}
}));

function Login() {
	const classes = useStyles();
	const [selectedTab, setSelectedTab] = useState(0);
	const [errorMessages, setErrorMessages] = useState([]);

	function handleTabChange(event, value) {
		setSelectedTab(value);
	}



	return (
		<div className={clsx(classes.root, 'flex flex-col flex-1 flex-shrink-0 p-24 md:flex-row md:p-0')}>
			<div
				className="flex flex-col flex-grow-0 items-center text-white p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left">
				<FuseAnimate animation="transition.expandIn">
					<div>
						<img style={{float: 'left'}} className="w-256" src="assets/images/logos/radassist_logo.svg" alt="logo"/>
						{/* <div  style={{float: 'right', 'position':'relative', 'margin':'10px', 'width': '130px'}}>
							<h1>RadAssist</h1>
							<p>AI-Based Teleradiology Solution</p>
						</div> */}
					</div>
				</FuseAnimate>
					<div>
						<h1 style={{color:'black', width: '100%'}} className="w-256" > 
						RadAssist is a web-based and Artificial Intelligence enabled tele-radiology solution developed in Bangladesh. 
						Our platform allows radiologists to provide their reports remotely and makes the reporting more efficient and accurate with the help of AI. 
						The platform supports all types of radiological images including X-ray, CT, and MRI. 
						</h1>
					</div>
			</div>

			

			<FuseAnimate animation={{ translateX: [0, '100%'] }}>
				<Card className="w-full max-w-400 mx-auto m-16 md:m-0" square>
					{
						errorMessages &&
						errorMessages.map(msg => <SnackbarAlert severity="error">{msg}</SnackbarAlert>)
					}
					<CardContent className="flex flex-col items-center justify-center p-32 md:p-48 md:pt-128 ">
						

						
						<JWTLoginTab showErrors={setErrorMessages}/>

					

						<div className="flex flex-col items-center justify-center pt-32">
							<span className="font-medium">Don't have an account?</span>
							<Link className="font-medium" to="/signup">
								Create an account
							</Link>
							<Link className="font-medium mt-8" to="/">
								Back to Dashboard
							</Link>
						</div>
					</CardContent>
				</Card>
			</FuseAnimate>
		</div>
	);
}

export default Login;
