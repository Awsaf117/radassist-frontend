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

const styles = theme => ({});

class HospitalUserList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	getUserbyHospitalIDAPICallBack = apiResponse => {
		const result = apiResponse.response.data.result;
		console.log('userlistbyhospital', result);
	};

	componentDidMount() {
		XRayApi.getUserbyHospitalID(this.props.match.params.hospitalID, this.getUserbyHospitalIDAPICallBack);
	}

	render() {
		return (
			<div>
				<Grid fluid>
					<Row>
						<Col xs={12}>HELO FROM USERLIST</Col>
					</Row>
				</Grid>
			</div>
		);
	}
}

HospitalUserList.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(HospitalUserList);
