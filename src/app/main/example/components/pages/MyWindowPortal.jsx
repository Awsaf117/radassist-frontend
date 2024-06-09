import React, { Component } from 'react';
import { validateAccessToken } from '../../api/utilities';
import XRayApi from '../../api/backend';
import { Spin } from 'antd';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import ReportIcon from '@material-ui/icons/Report';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';
import axios from 'axios';
import FusePageSimple from '@fuse/core/FusePageSimple';
import IconButton from '@material-ui/core/IconButton';
import UserMenu from 'app/fuse-layouts/shared-components/UserMenu';
import { API_BASE_URL_LOCAL } from '../../api/backend';
import ReactDOM from 'react-dom';
import DwvComponent from '../xrayViewerReport/DwvComponent';

class MyWindowPortal extends React.PureComponent {
	constructor(props) {
		super(props);
		// STEP 1: create a container <div>
		this.containerEl = document.createElement('div');
		this.externalWindow = null;
	}

	render() {
		// STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
		return ReactDOM.createPortal(this.props.children, this.containerEl);
	}

	componentDidMount() {
		console.log('HELOOOOOOOOOOOOO', this.props.url);
		// STEP 3: open a new browser window and store a reference to it
		this.externalWindow = window.open(
			'src/app/main/example/components/xrayViewerReport/DwvComponent',
			'',
			'width=600,height=400,left=200,top=200'
		);

		// STEP 4: append the container <div> (that has props.children appended to it) to the body of the new window
		this.externalWindow.document.body.appendChild(this.containerEl);
	}

	componentWillUnmount() {
		// STEP 5: This will fire when this.state.showWindowPortal in the parent component becomes false
		// So we tidy up by closing the window
		this.externalWindow.close();
	}
}

export default MyWindowPortal;
