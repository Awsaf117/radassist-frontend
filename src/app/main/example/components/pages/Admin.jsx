import React from 'react';
import XRayApi from '../../api/backend';
import UserInfo from './UserInfo/UserInfo';
import draftToHtml from 'draftjs-to-html';
import { Container } from '@material-ui/core';
import RichTextEditor from '../text-editor/RichTextEditor';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { Icon } from '@material-ui/core';
import { flattenErrorMessages, formatDate, downloadReport } from '../../api/utilities';
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import parse from 'html-react-parser';
import DwvComponent from '../xrayViewerReport/DwvComponent';
import Modal from '@material-ui/core/Modal';
import { convertFromRaw } from 'draft-js';
import moment from 'moment';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { dateFnsLocalizer } from 'react-big-calendar';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import LocalHospitalSharpIcon from '@material-ui/icons/LocalHospitalSharp';
import history from '@history';
// import { createBrowserHistory } from 'history';

const styles = theme => ({
	root: {
		display: 'flex',
		'& > *': {
			margin: theme.spacing(1)
		}
	}
});

class Admin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hospitals: {}
		};
	}

	componentDidMount() {
		this.getHospitalList();
	}

	apiResponseHospitalListCallback = apiResponse => {
		if (apiResponse.response.status === 200) {
			const HospitalList = apiResponse.response.data.result;
			this.setState({
				hospitals: HospitalList
			});
			console.log(this.state.hospitals);
		} else {
			return this.props.history.push('/home');
		}
	};

	getHospitalList() {
		XRayApi.HospitalList(this.apiResponseHospitalListCallback);
	}

	// getUserList = id => {
	// 	this.props.history.push(`/admin/${id}`);
	// 	// React.cloneElement(this.props, { hospitals: this.state.hospitals[id], setData: this.state.hospitals[id] });
	// };

	render() {
		let { hospitals } = this.state;
		hospitals = Array.from(hospitals);

		// const templates = this.state.templates;
		const { classes } = this.props;
		return (
			<div>
				<Grid fluid>
					<Row>
						<Col xs={12}>
							<Row center="xs">
								<Col xs={6}>
									<div style={{ fontSize: '30px', marginTop: '2rem', marginBottom: '2rem' }}>
										All the registered hospital's list:
									</div>

									<div>
										<Col center="xs">
											<ButtonGroup
												orientation="vertical"
												color="primary"
												aria-label="vertical outlined primary button group"
												style={{ width: '100%' }}
											>
												{hospitals.map((hospital, index) => (
													<Button
														onClick={() =>
															this.props.history.push(`/admin/users/${hospital.id}`)
														}
													>
														<Col xs={1}>
															<LocalHospitalSharpIcon />
														</Col>
														<Col xs={11}>
															<p key={index}>{hospital.name}</p>
														</Col>
													</Button>
												))}
											</ButtonGroup>
										</Col>
									</div>
								</Col>
							</Row>
						</Col>
					</Row>
				</Grid>
			</div>
		);
	}
}

Admin.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Admin);
