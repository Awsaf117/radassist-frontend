import AppBar from '@material-ui/core/AppBar';
import { ThemeProvider } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom'; // Import useLocation hook


function FooterLayout2(props) {
	const footerTheme = useSelector(({ fuse }) => fuse.settings.footerTheme);
	const location = useLocation(); 

	const shouldHideHeader = location.pathname.includes("report-public");
	if (shouldHideHeader) {
		return null;
	  }
	return (
		<ThemeProvider theme={footerTheme}>
			<AppBar
				id="fuse-footer"
				className="relative z-10"
				color="default"
				style={{ backgroundColor: 'white' }}
			>
				<Toolbar className="px-16 py-0 flex items-center">
						<div style={{margin:'auto'}}>
							<img style={{float:'left', 'margin':'10px', height:'20px'}} src="assets/images/logos/buet.png" alt="logo"/>
							<img style={{float:'left', 'margin':'10px', height:'20px'}} src="assets/images/logos/brainstation.svg" alt="logo"/>
							<img style={{float:'left', 'margin':'10px', height:'20px'}} src="assets/images/logos/ict.png" alt="logo"/>
						</div>
				</Toolbar>
			</AppBar>
		</ThemeProvider>
	);
}

export default React.memo(FooterLayout2);
