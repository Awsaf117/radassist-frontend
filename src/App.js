import React from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from 'app/main/example/components/pages/Login';
import Home from 'app/main/example/components/pages/Home';
import SignUp from 'app/main/example/components/pages/SignUp';
import XrayView from 'app/main/example/components/pages/XrayView';
import Index from 'app/main/example/components/pages/Index';
import Upload from 'app/main/example/components/pages/Upload';
import Profile from 'app/main/example/components/pages/Profile';
import Admin from 'app/main/example/components/pages/Admin';
import Calibration from 'app/main/example/components/pages/Calibration';
import HospitalUserList from 'app/main/example/components/pages/HospitalUserList';
import ImageSlider from 'app/main/example/components/xray_viewer/ImageSlider';

var showToast;

function App() {

	

	return (
		<Router>
			<div className="App">
				<Switch>
					<React.Fragment>
						<Route exact path="/" component={Index} />
						<Route path="/login" component={Login} />
						<Route path="/home" component={Home} />
						<Route path="/signup" component={SignUp} />
						<Route path="/xrayView" component={XrayView} />
						<Route path="/upload" component={Upload} />
						<Route path="/profile/:id" component={Profile} />
						<Route path="/admin" component={Admin} />
						<Route path="/calibration" component={Calibration} />
						<Route path="/visualize-heatmap" component={ImageSlider}></Route>
					</React.Fragment>
				</Switch>
				
			</div>
		</Router>
	);
}

export default App;
export { showToast};
