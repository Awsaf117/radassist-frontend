import i18next from 'i18next';
import Example from './Example';
import XrayView from './components/pages/XrayView';
import Fuselogin from './components/login/Login';
import Fuseregister from './components/register/Register';
import Upload from './components/pages/Upload';
import Admin from './components/pages/Admin';
import Home from './components/pages/Home';
import Index from './components/pages/Index';
import ReportList from './components/pages/ReportList';
import ReportViewer from './components/pages/ReportViewer';
import ControlledExpansionPanels from './components/pages/FeedbackList';
import AdminFeedbackList from './components/pages/AdminFeedbackList';
import Contact from './components/pages/Contact';
import About from './components/pages/About';
import Tutorial from './components/pages/Tutorial';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
import UserList from './components/pages/UserList';
import Profile from './components/pages/Profile';
import HospitalUserList from './components/pages/HospitalUserList';
import DWVComponentPage from './components/pages/DWVComponentPage';
import Calibration from './components/pages/Calibration';
import SurveyDashboard from './components/pages/SurveyDashboard';
import ImageSlider from './components/xray_viewer/ImageSlider';
import FaceAuth from './components/face_auth/FaceAuth';
import FaceAuthRegister from './components/face_auth/FaceAuthRegister';
import FaceAuthRegisterOwn from './components/face_auth/FaceAuthRegisterOwn';
import ReportViewerPublic from './components/pages/ReportViewerPublic';

i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
i18next.addResourceBundle('ar', 'examplePage', ar);

const ExampleConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: '/example',
			component: Example
		},
		{
			path: '/xrayviewer',
			component: XrayView
		},
		{
			path: '/login',
			component: Fuselogin
		},
		{
			path: '/faceauth/:referrer?',
			component: FaceAuth
		},
		{
			path: '/faceauthregister/:phone?',
			component: FaceAuthRegister
		},
		{
			path: '/faceauthregister-own',
			component: FaceAuthRegisterOwn
		},
		{
			path: '/signup',
			component: Fuseregister
		},
		{
			path: '/report/:reportId?',
			component: ReportViewer
		},
		{
			path: '/report-public/:reportId?',
			component: ReportViewerPublic
		},
		{
			path: '/upload',
			component: Upload
		},
		{
			path: '/home',
			component: Home
		},
		{
			path: '/index',
			component: Index
		},
		{
			path: '/report-list',
			component: ReportList
		},
		{
			path: '/feedback-list',
			component: ControlledExpansionPanels
		},
		{
			path: '/about',
			component: About
		},
		{
			path: '/contact',
			component: Contact
		},
		{
			path: '/tutorial',
			component: Tutorial
		},
		{
			path: '/user-list',
			component: UserList
		},
		{
			path: '/profile/:id',
			component: Profile
		},
		{
			path: '/feedback-list-admin',
			component: AdminFeedbackList
		},
		{
			path: '/admin',
			component: Admin
		},
		{
			path: '/admin/users/:id',
			component: HospitalUserList
		},
		{
			path: '/xray/:reportId?',
			component: DWVComponentPage
		},
		{
			path: '/calibration',
			component: Calibration
		},
		{
			path: '/survey-dashboard',
			component: SurveyDashboard
		},
		{
			path: '/visualize-heatmap',
			component: ImageSlider
		}
	]
};

export default ExampleConfig;

/**
 * Lazy load Example
 */
/*
import React from 'react';

const ExampleConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/example',
            component: React.lazy(() => import('./Example'))
        }import ReportViewer from './components/pages/ReportViewer';

    ]
};

export default ExampleConfig;

*/
