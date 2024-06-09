import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Container } from '@material-ui/core';
import PatientHistory from './History/History';
import parse from 'html-react-parser';
import Button from '@material-ui/core/Button';
import { useState } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';

const UserInfo = ({ handleOpen, userInfo, metadata, contentState, xrayUrl }) => {
	const { exposure, pneumonia, smoking } = metadata.previous_history;
	// const [dwvModalIsOpen, setdwvModalIsOpen] = useState('');
	// const handleOpen = event => setdwvModalIsOpen(true);
	// console.log('XRAY', dwvModalIsOpen);

	return (
		<Container>
			<Card style={{ width: 'auto' }}>
				<CardContent>
					<Grid fluid>
						<Row>
							<Col xs={8}>
								<Typography variant="h4" component="h4">
									{userInfo.name}
								</Typography>
								<Typography variant="caption" display="block" gutterBottom>
									ID: {userInfo.unique_id}
								</Typography>
								<Typography color="textSecondary">
									<strong>{userInfo.age}</strong> years old{' '}
									<strong>{userInfo.gender.toUpperCase()}</strong>
								</Typography>
								<Typography color="textSecondary" style={{ marginTop: '5px' }}>
									Patient's Contact: {userInfo.phone_number}
								</Typography>
							</Col>
							<Col xs={4}>
								{/* <Button
									color="primary"
									variant="contained"
									onClick={handleOpen}
									style={{ marginTop: '20px' }}
								>
									Open Xray Viewer
								</Button> */}
							</Col>
						</Row>
					</Grid>
					<br />
					<hr />
					<br />
					<Container>
						<PatientHistory enabled={!exposure.status} title={'Exposure'} details={exposure.description} />
						<PatientHistory enabled={!smoking.status} title={'Smoking'} details={smoking.description} />
						<PatientHistory
							enabled={!pneumonia.status}
							title={'Pneumonia'}
							details={pneumonia.description}
						/>
					</Container>
					<br />
					<hr />
					<br />
					<Container>
						<div>{parse(contentState)}</div>
					</Container>
					<br />
					<hr />
					<br />
					<Container>
						<div></div>
					</Container>
				</CardContent>
			</Card>
		</Container>
	);
};

export default UserInfo;
