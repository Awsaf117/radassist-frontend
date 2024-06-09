import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';


const SnackbarAlert = (props) => {
	return <MuiAlert elevation={6} variant="filled" style={{ marginBottom: '2px' }} {...props} key={'top, center'} />;
};


export default SnackbarAlert;
