import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Link from '@material-ui/core/Link';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';

import TagsTable from './TagsTable';

import './DwvComponent.css';
import dwv from 'dwv';
import { slice } from 'lodash';
import { Grid, Row, Col } from 'react-flexbox-grid';

// gui overrides

// get element
dwv.gui.getElement = dwv.gui.base.getElement;
dwv.gui.displayProgress = function(percent) {};

// Image decoders (for web workers)
// dwv.image.decoderScripts = {
// 	jpeg2000: 'assets/dwv/decoders/pdfjs/decode-jpeg2000.js',
// 	'jpeg-lossless': 'assets/dwv/decoders/rii-mango/decode-jpegloss.js',
// 	'jpeg-baseline': 'assets/dwv/decoders/pdfjs/decode-jpegbaseline.js',
// 	rle: 'assets/dwv/decoders/dwv/decode-rle.js'
// };

//debug
dwv.image.decoderScripts = {
	jpeg2000: 'dwv/decoders/pdfjs/decode-jpeg2000.js',
	'jpeg-lossless': 'dwv/decoders/rii-mango/decode-jpegloss.js',
	'jpeg-baseline': 'dwv/decoders/pdfjs/decode-jpegbaseline.js',
	rle: 'dwv/decoders/dwv/decode-rle.js'
};

const styles = theme => ({
	button: {
		margin: theme.spacing.unit
	},
	appBar: {
		position: 'relative'
	},
	title: {
		flex: '0 0 auto'
	},
	tagsDialog: {
		minHeight: '90vh',
		maxHeight: '90vh',
		minWidth: '90vw',
		maxWidth: '90vw'
	},
	iconSmall: {
		fontSize: 20
	}
});

function TransitionUp(props) {
	return <Slide direction="up" {...props} />;
}

class DwvComponent extends React.Component {
	constructor(props) {
		console.log(props)
		super(props);
		this.state = {
			versions: {
				dwv: dwv.getVersion(),
				react: React.version
			},
			tools: {
				Scroll: {},
				ZoomAndPan: {},
				WindowLevel: {},
				Draw: {
					options: ['Ruler'],
					type: 'factory',
					events: ['draw-create', 'draw-change', 'draw-move', 'draw-delete']
				}
			},
			selectedTool: 'Select Tool',
			loadProgress: 0,
			dataLoaded: false,
			dwvApp: null,
			metaData: [],
			showDicomTags: false,
			toolMenuAnchorEl: null,
			dropboxClassName: 'dropBox',
			borderClassName: 'dropBoxBorder',
			hoverClassName: 'hover',
			range: null,
			slide: 1,
			frames: 0
		};
	}

	render() {
		const { classes } = this.props;
		const {
			versions,
			tools,
			loadProgress,
			dataLoaded,
			metaData,
			toolMenuAnchorEl,
			range,
			slide,
			frames
		} = this.state;

		const toolsMenuItems = Object.keys(tools).map(tool => (
			<MenuItem onClick={this.handleMenuItemClick.bind(this, tool)} key={tool} value={tool}>
				{tool}
			</MenuItem>
		));

		return (
			<div id="dwv">
				<LinearProgress variant="determinate" value={loadProgress} />
				<div className="button-row">
					<Button
						variant="contained"
						color="primary"
						aria-owns={toolMenuAnchorEl ? 'simple-menu' : null}
						aria-haspopup="true"
						onClick={this.handleMenuButtonClick}
						disabled={!dataLoaded}
						className={classes.button}
						size="medium"
					>
						{this.state.selectedTool}
						<ArrowDropDownIcon className={classes.iconSmall} />
					</Button>
					<Menu
						id="simple-menu"
						anchorEl={toolMenuAnchorEl}
						open={Boolean(toolMenuAnchorEl)}
						onClose={this.handleMenuClose}
					>
						{toolsMenuItems}
					</Menu>

					<Button variant="contained" color="primary" disabled={!dataLoaded} onClick={this.onReset}>
						Reset
					</Button>

					<Button
						variant="contained"
						color="primary"
						onClick={this.handleTagsDialogOpen}
						disabled={!dataLoaded}
						className={classes.button}
						size="medium"
					>
						Tags
					</Button>
					<Dialog
						open={this.state.showDicomTags}
						onClose={this.handleTagsDialogClose}
						TransitionComponent={TransitionUp}
						classes={{ paper: classes.tagsDialog }}
					>
						<AppBar className={classes.appBar}>
							<Toolbar>
								<IconButton color="inherit" onClick={this.handleTagsDialogClose} aria-label="Close">
									<CloseIcon />
								</IconButton>
								<Typography variant="h6" color="inherit" className={classes.flex}>
									DICOM Tags
								</Typography>
							</Toolbar>
						</AppBar>
						<TagsTable data={metaData} />
					</Dialog>
				</div>

				<div className="layerContainer">
					<div className="dropBox dropBoxBorder">
						<Typography>Drag and drop data here.</Typography>
					</div>
					<canvas className="imageLayer">Only for HTML5 compatible browsers...</canvas>
					<div className="drawDiv"></div>
				</div>
				<div className="ranges" style={{ marginLeft: '40%', width: '50%', marginTop: '2%' }}>
					<input type="range" id="sliceRange" value="0" align="center" style={{ marginLeft: '28px' }}></input>
					<Row>
						<Button
							variant="contained"
							color="primary"
							disabled={!dataLoaded}
							className={classes.button}
							size="medium"
						>
							Slice: {this.state.slide}/{this.state.frames}
						</Button>
						<Button
							variant="contained"
							color="primary"
							disabled={!dataLoaded}
							className={classes.button}
							onClick={this.onTest}
							size="medium"
						>
							{' '}
							hit me
						</Button>
					</Row>
				</div>
				{/* <div><p className="legend">
          <Typography variant="caption">Powered by <Link
              href="https://github.com/ivmartel/dwv"
              title="dwv on github">dwv
            </Link> {versions.dwv} and React {versions.react}
          </Typography>
        </p></div> */}
			</div>
		);
	}

	componentDidMount() {
		// create app
		var app = new dwv.App();

		this.range = document.getElementById('sliceRange');
		this.range.min = 0;

		// initialise app
		app.init({
			containerDivId: 'dwv',
			tools: this.state.tools
		});
		// load urls
		let { fileURL } = this.props;
		app.loadURLs(fileURL, '');

		// load events
		let nReceivedError = null;
		let nReceivedAbort = null;
		app.addEventListener('load-start', (/*event*/) => {
			nReceivedError = 0;
			nReceivedAbort = 0;
		});
		app.addEventListener('load-progress', event => {
			this.setState({ loadProgress: event.loaded });
		});
		app.addEventListener('load', (/*event*/) => {
			// set dicom tags
			this.setState({ metaData: dwv.utils.objectToArray(app.getMetaData()) });
			// set the selected tool
			let selectedTool = 'Scroll';
			if (app.isMonoSliceData() && app.getImage().getNumberOfFrames() === 1) {
				selectedTool = 'ZoomAndPan';
			}
			this.onChangeTool(selectedTool);
			// hide dropBox
			this.hideDropbox();
			// set data loaded flag
			this.setState({ dataLoaded: true });
		});
		app.addEventListener('load-end', event => {
			this.range.max =
				app
					.getImage()
					.getGeometry()
					.getSize()
					.getNumberOfSlices() - 1;
			this.setState({ frames: parseInt(this.range.max) + 1 });

			//alert(this.range.max);
			if (nReceivedError) {
				this.setState({ loadProgress: 0 });
				alert('Received errors during load. Check log for details.');
			}
			if (nReceivedAbort) {
				this.setState({ loadProgress: 0 });
				alert('Load was aborted.');
			}
		});

		app.addEventListener('slice-change', event => {
			this.range.value = app.getViewController().getCurrentPosition().k;
		});
		this.range.oninput = (event, pos = 10) => {
			console.log(pos);
			var pos = app.getViewController().getCurrentPosition();
			pos.k = this.range.value;
			this.setState({ slide: parseInt(pos.k) + 1 });
			//alert(pos.k)
			app.getViewController().setCurrentPosition(pos);
		};
		app.addEventListener('error', event => {
			console.error(event.error);
			++nReceivedError;
		});
		app.addEventListener('abort', (/*event*/) => {
			++nReceivedAbort;
		});

		// handle key events
		app.addEventListener('keydown', event => {
			app.defaultOnKeydown(event);
		});
		// handle window resize
		// window.addEventListener('resize', app.onResize);

		// store
		this.setState({ dwvApp: app });

		// setup drop box
		this.setupDropbox(app);

		// possible load from location
		dwv.utils.loadFromUri(window.location.href, app);
	}

	/**
	 * Handle a change tool event.
	 * @param tool The new tool name.
	 */
	onChangeTool = (tool: string) => {
		if (this.state.dwvApp) {
			this.setState({ selectedTool: tool });
			this.state.dwvApp.setTool(tool);
			if (tool === 'Draw') {
				this.onChangeShape(this.state.tools.Draw.options[0]);
			}
		}
	};

	/**
	 * Handle a change draw shape event.
	 * @param shape The new shape name.
	 */
	onChangeShape = (shape: string) => {
		if (this.state.dwvApp) {
			this.state.dwvApp.setDrawShape(shape);
		}
	};

	/**
	 * Handle a reset event.
	 */
	onReset = tool => {
		if (this.state.dwvApp) {
			this.state.dwvApp.resetDisplay();
		}
	};

	/**
	 * it's a test event
	 */
	onTest = event => {
		this.range.value = 2;
		this.range.oninput(0);
	};

	/**
	 * Open the DICOM tags dialog.
	 */
	handleTagsDialogOpen = () => {
		this.setState({ showDicomTags: true });
	};

	/**
	 * Close the DICOM tags dialog.
	 */
	handleTagsDialogClose = () => {
		this.setState({ showDicomTags: false });
	};

	/**
	 * Menu button click.
	 */
	handleMenuButtonClick = event => {
		this.setState({ toolMenuAnchorEl: event.currentTarget });
	};

	/**
	 * Menu cloase.
	 */
	handleMenuClose = event => {
		this.setState({ toolMenuAnchorEl: null });
	};

	/**
	 * Menu item click.
	 */
	handleMenuItemClick = tool => {
		this.setState({ toolMenuAnchorEl: null });
		this.onChangeTool(tool);
	};

	// drag and drop [begin] -----------------------------------------------------

	/**
	 * Setup the data load drop box: add event listeners and set initial size.
	 */
	setupDropbox = app => {
		// start listening to drag events on the layer container
		const layerContainer = app.getElement('layerContainer');
		if (layerContainer) {
			layerContainer.addEventListener('dragover', this.onDragOver);
			layerContainer.addEventListener('dragleave', this.onDragLeave);
			layerContainer.addEventListener('drop', this.onDrop);
		}
		// set the initial drop box size
		const box = app.getElement(this.state.dropboxClassName);
		if (box) {
			const size = app.getLayerContainerSize();
			const dropBoxSize = (2 * size.height) / 3;
			box.setAttribute('style', 'width:' + dropBoxSize + 'px;height:' + dropBoxSize + 'px');
		}
	};

	/**
	 * Handle a drag over.
	 * @param event The event to handle.
	 */
	onDragOver = (event: DragEvent) => {
		// prevent default handling
		event.stopPropagation();
		event.preventDefault();
		// update box border
		const box = this.state.dwvApp.getElement(this.state.borderClassName);
		if (box && box.className.indexOf(this.state.hoverClassName) === -1) {
			box.className += ' ' + this.state.hoverClassName;
		}
	};

	/**
	 * Handle a drag leave.
	 * @param event The event to handle.
	 */
	onDragLeave = (event: DragEvent) => {
		// prevent default handling
		event.stopPropagation();
		event.preventDefault();
		// update box class
		const box = this.state.dwvApp.getElement(this.borderClassName + ' hover');
		if (box && box.className.indexOf(this.state.hoverClassName) !== -1) {
			box.className = box.className.replace(' ' + this.state.hoverClassName, '');
		}
	};

	/**
	 * Hide the data load drop box.
	 */
	hideDropbox = () => {
		// remove box
		const box = this.state.dwvApp.getElement(this.state.dropboxClassName);
		if (box) {
			box.parentNode.removeChild(box);
		}
	};

	/**
	 * Handle a drop event.
	 * @param event The event to handle.
	 */
	onDrop = (event: DragEvent) => {
		// prevent default handling
		event.stopPropagation();
		event.preventDefault();
		// load files
		this.state.dwvApp.loadFiles(event.dataTransfer.files);
		// hide drop box
		this.hideDropbox();
	};

	// drag and drop [end] -------------------------------------------------------
} // DwvComponent

DwvComponent.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DwvComponent);
