import FuseSearch from '@fuse/core/FuseSearch';
import FuseShortcuts from '@fuse/core/FuseShortcuts';
import AppBar from '@material-ui/core/AppBar';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import NavbarMobileToggleButton from 'app/fuse-layouts/shared-components/NavbarMobileToggleButton';
import QuickPanelToggleButton from 'app/fuse-layouts/shared-components/quickPanel/QuickPanelToggleButton';
import { useSelector } from 'react-redux';
import LanguageSwitcher from '../../shared-components/LanguageSwitcher';
import UserMenu from 'app/fuse-layouts/shared-components/UserMenu';
import XRayApi from 'app/main/example/api/backend';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation hook


const useStyles = makeStyles(theme => ({
	separator: {
		width: 1,
		height: 64,
		backgroundColor: theme.palette.divider
	}
}));

function ToolbarLayout2(props) {
	const location = useLocation(); // Use the useLocation hook to access the current location

	const config = useSelector(({ fuse }) => fuse.settings.current.layout.config);
	const toolbarTheme = useSelector(({ fuse }) => fuse.settings.toolbarTheme);
	// const [userInfo, setUserInfo] = useState('');

	// const apiResponseCallback = apiResponse => {
	// 	const userInfo = apiResponse.response.data.result;
	// 	setUserInfo(userInfo);
	// };

	// useEffect(() => {
	// 	XRayApi.userInfo(apiResponseCallback);
	// }, []);

	const shouldHideHeader = location.pathname.includes("report-public");


	const classes = useStyles(props);

	if (shouldHideHeader) {
		return null;
	  }

	return (
		<ThemeProvider theme={toolbarTheme}>
			<AppBar

				id="fuse-toolbar"
				className="flex relative z-10"
				color="default"
				style={{ zIndex:10,backgroundColor: toolbarTheme.palette.background.default }}
			>
				<Toolbar className="container p-0 lg:px-24">
					{config.navbar.display && (
						<div>
							<a style={{ marginLeft: '10px' }} href={'/home'}>
								Home
							</a>
							<a style={{ marginLeft: '10px' }} href={'/about'}>
								About
							</a>
							<a style={{ marginLeft: '10px' }} href={'/contact'}>
								Contact
							</a>
							<a style={{ marginLeft: '10px' }} href={'/tutorial'}>
								Tutorial
							</a>
							{/* <a style={{ marginLeft: '10px' }} href={'/admin'}>
								User Management Panel
							</a> */}
						</div>
					)}

					<div className="flex flex-1">
						<Hidden mdDown>
							<FuseShortcuts />
						</Hidden>
					</div>

					<div className="flex">
						<UserMenu />
						{/* <div className={classes.separator} />

						<FuseSearch />

						<div className={classes.separator} />

						<LanguageSwitcher />

						<div className={classes.separator} />

						<QuickPanelToggleButton /> */}
					</div>
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default React.memo(ToolbarLayout2);
