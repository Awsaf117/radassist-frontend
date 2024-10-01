import axios from 'axios';
import { getAccessToken } from './utilities';
import { v4 as uuidv4 } from 'uuid';
import { last } from 'lodash';

// export const FACE_AUTH_URL = 'https://6mqh9yo521.execute-api.ca-central-1.amazonaws.com/face';
export const FACE_AUTH_URL = 'http://103.94.135.157:5001/face';
// export const FACE_AUTH_URL='https://api.brainlytic.org/face'
// export const FACE_AUTH_URL = 'http://localhost:5002';

let API_BASE_URL = process.env.API_BASE_URL;
let _S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

if (!API_BASE_URL) {
	API_BASE_URL = 'https://m5qzbbj3rd.execute-api.ca-central-1.amazonaws.com/a';
	// API_BASE_URL = 'http://103.94.135.157:5000';
}

if (!_S3_BUCKET_NAME) {
	_S3_BUCKET_NAME = 'radassist-dev';
}

const USER_SIGNUP = '/user';
const USER_LOGIN = '/user/auth/login';
const USER_FORGOT_PASSWORD = '/user/auth/forgotPassword';
const USER_FACE = '/user/auth/face';
const USER_INFO = '/user/me';
const PRESIGNED_URL = '/file/pre-signed-url';
const USER_SEARCH = '/user/search';
const REPORT_CREATE = '/report';
const REPORT_FEEDBACK = '/feedback';
const HOSPITALS = '/user/allhospitals';
const REPORT_LIST = REPORT_CREATE;
const TEMPLATE_CREATE = '/template';
const USER_LIST = '/report/userlist';
const UPDATE_ROLE = '/user/update-role';
const FEEDBACK = '/report/1/savefeedback';
const TRACK_FEEDBACK = '/report/1/trackfeedback';
const UPDATE_FEEDBACK = '/report/1/updatefeedback';
const SAVEDRAW = '/report/1/savedrawing';
const SERVE_DCM = '/report/1/servedcm/<filename>';
const SERVE_FEEDBACK = '/report/1/servefeedback';
const SERVE_FEEDBACK_ADMIN = '/report/1/servefeedback/admin';
const SERVE_SURVEYOR_LIST = '/report/1/servesurveyorlist/admin';
const SERVE_CAM = '/report/1/servecam/<filename>';
const SAVETEXT = '/report/1/savetext';
const DCM_LIST = '/report/1/serve-dcmid';
const SEARCH_REPORT = '/report/search';
const USER_PROFILE = '/profile';
const USER_SIGNATURE = '/user/signature';
const ADMIN_HOME = '/admin';
const SAVE_GAZE_HEATMAP = '/file/save-gaze-heatmap';
const SAVE_HEATMAP = '/user/save-heatmap';
const COUNT_SURVEYOR = '/report/1/countsurveyor/admin';
const GAZE_DATA = '/report/1/save-gaze-data';
const CAPTURE_WEBPAGE = '/report/1/capture-webpage';
const SERVE_FEEDBACK_BY_ID = '/report/1/servefeedback-by-id';
const SAVESCREENSHOT = '/report/1/savescreenshot';
const SURVEY_CREATE = '/survey-dashboard';
const SURVEY_UPDATE = '/survey-dashboard/update';
const SURVEY_DELETE = '/survey-dashboard/delete';
const SURVEY_LIST = '/survey-dashboard/surveylist';
export default class XRayApi {
	static getPresignedUrl = filename => {
		const url = API_BASE_URL + PRESIGNED_URL;

		return axios({
			method: 'GET',
			url: url,
			params: {
				filename: filename
			},
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		});
	};

	static userInfo = callbackFunc => {
		const url = API_BASE_URL + USER_INFO;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'GET',
			url: url,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callbackFunc(apiResponse);
			});
	};

	static userSignup = (data, callback) => {
		const url = API_BASE_URL + USER_SIGNUP;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: data,
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};

	static userForgotPassword = (data, callback) => {
		const url = API_BASE_URL + USER_FORGOT_PASSWORD;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: data,
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};

	static userLogin = (data, callback) => {
		const url = API_BASE_URL + USER_LOGIN;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: {
				phone_number: data.phone_number,
				password: data.password
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};

	static userfaceAuth = (data, callback) => {
		const url = API_BASE_URL + USER_FACE;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: data,
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};

	static userSearch = (name, callback) => {
		const url = API_BASE_URL + USER_SEARCH;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'GET',
			url: url,
			params: {
				name: name
			},
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};

	static getSignedUrl = (file, callback) => {
		const fileExtension = file.name.split('.')[1];
		let fileName = file.name.split('.')[0] + '-' + uuidv4() + '.' + fileExtension;
		fileName = fileName.replace(/[^\w\d_\-.]+/gi, '');
		let apiResponse = { response: null, error: false, msg: '' };
		const url = API_BASE_URL + PRESIGNED_URL;

		axios({
			method: 'GET',
			url: url,
			params: {
				filename: fileName
			},
			headers: {
				Authorization: localStorage.getItem('accessToken')
			}
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse, file);
			});
	};

	static getHospitals = callback => {
		const url = API_BASE_URL + HOSPITALS;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'GET',
			url: url,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			//.then(console.log("apiResponse"))
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};

	static createReport = (data, callback) => {
		const url = API_BASE_URL + REPORT_CREATE;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: {
				...data
			},
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};

	static getReport = callback => {
		const url = API_BASE_URL + REPORT_LIST;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'GET',
			url: url,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
	static getUser = callback => {
		const url = API_BASE_URL + USER_LIST;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'GET',
			url: url,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};

	static getReportById = (reportId, callbackFunc) => {
		const url = API_BASE_URL + REPORT_LIST + '/' + reportId;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'GET',
			url: url,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callbackFunc(apiResponse);
			});
	};

	static postReportFeedback = (reportId, data, callbackFunc) => {
		const url = API_BASE_URL + REPORT_CREATE + '/' + reportId + REPORT_FEEDBACK;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: data,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callbackFunc(apiResponse);
			});
	};

	static createTemplate = (data, callback) => {
		const url = API_BASE_URL + TEMPLATE_CREATE;
		let apiResponse = { response: null, error: false, msg: '' };
		axios({
			method: 'POST',
			url: url,
			data: data,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};

	static getTemplates = callback => {
		const url = API_BASE_URL + TEMPLATE_CREATE;
		let apiResponse = { response: null, error: false, msg: '' };
		axios({
			method: 'GET',
			url: url,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};

	static updateRole = (data, callback) => {
		const url = API_BASE_URL + UPDATE_ROLE;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			params: {
				phone_number: data.value,
				role: data.role
			},
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};

	static getDcmId = callback => {
		const url = API_BASE_URL + DCM_LIST;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'GET',
			url: url,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};

	static trackFeedback = (data, callback) => {
		const url = API_BASE_URL + TRACK_FEEDBACK;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: {
				dcmId: data.dcmId,
				dcmUrl: data.dcmUrl,
				maskUrl: data.maskUrl
			},
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
	static saveFeedback = (data, callback) => {
		const url = API_BASE_URL + FEEDBACK;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: {
				dcmId: data.dcmId,
				name: data.name,
				haemType: data.haemType,
				drawImageUrl: data.drawImageUrl,
				textUrl: data.textUrl,
				gazeData: data.webgazerPredictions,
				screenshots: data.screenshots,
				screenWidth: data.screenWidth,
				screenHeight: data.screenHeight,
				xrayviewerCoodinates: data.xrayviewerCoodinates,
				createdAt: data.createdAt
			},
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
	static saveGazeData = (data, dcmId) => {
		const url = API_BASE_URL + GAZE_DATA;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: {
				data: data,
				dcmId: dcmId
			},
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			});
	};
	static updateFeedback = (data, callback) => {
		const url = API_BASE_URL + UPDATE_FEEDBACK;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: {
				dcmId: data.dcmId,
				dcmUrl: data.dcmUrl,
				maskUrl: data.maskUrl
			},
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
	static saveDrawing = (data, callback) => {
		const url = API_BASE_URL + SAVEDRAW;
		let apiResponse = { response: null, error: false, msg: '' };

		let file = data;
		console.log(file);

		let formdata = new FormData();

		formdata.append('image', file);
		axios({
			method: 'POST',
			url: url,
			data: formdata,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
	static saveScreenshot = data => {
		const url = API_BASE_URL + SAVESCREENSHOT;
		let apiResponse = { response: null, error: false, msg: '' };

		let file = data;
		console.log(file);

		let formdata = new FormData();

		formdata.append('image', file);
		axios({
			method: 'POST',
			url: url,
			data: formdata,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			});
	};
	static saveText = (data, callback) => {
		const url = API_BASE_URL + SAVETEXT;
		let apiResponse = { response: null, error: false, msg: '' };

		let file = data;
		console.log(file);

		let formdata = new FormData();

		formdata.append('text', file);
		axios({
			method: 'POST',
			url: url,
			data: formdata,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
	static serveDcm = callback => {
		const url = API_BASE_URL + SERVE_DCM;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'GET',
			url: url,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
	static serveFeedback = callback => {
		const url = API_BASE_URL + SERVE_FEEDBACK;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'GET',
			url: url,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
	static serveFeedbackById = (feedbackId, callback) => {
		const url = API_BASE_URL + SERVE_FEEDBACK_BY_ID;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: {
				feedbackId: feedbackId
			},
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
	static serveFeedbackAdmin = (surveyor_uuid, callback) => {
		const url = API_BASE_URL + SERVE_FEEDBACK_ADMIN;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: {
				surveyor_uuid: surveyor_uuid
			},
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
	static countSurveyor = callback => {
		const url = API_BASE_URL + COUNT_SURVEYOR;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'GET',
			url: url,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
	static serveSurveyorListAdmin = (nextPage, id, limit, callback) => {
		const url = API_BASE_URL + SERVE_SURVEYOR_LIST;
		let apiResponse = { response: null, error: false, msg: '' };
		console.log(id);
		axios({
			method: 'POST',
			url: url,
			data: {
				nextPage: nextPage,
				id: id,
				limit: limit
			},
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
	static serveCam = callback => {
		const url = API_BASE_URL + SERVE_CAM;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'GET',
			url: url,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
	static searchReport = (data, callback) => {
		const url = API_BASE_URL + SEARCH_REPORT;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: {
				patient_name: data.name,
				report_id: data.reportId,
				start_date: data.startDate,
				end_date: data.endDate
			},
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};

	static uploadSignature = (file, callback) => {
		const url = API_BASE_URL + USER_SIGNATURE;
		let apiResponse = { response: null, error: false, msg: '' };
		const formData = new FormData();
		formData.append('signature', file);
		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: getAccessToken()
			}
		};

		axios
			.post(url, formData, config)
			.then(response => (apiResponse.response = response))
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};

	static getProfileById = (userId, callbackFunc) => {
		const url = API_BASE_URL + USER_PROFILE + '/' + userId;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'GET',
			url: url,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callbackFunc(apiResponse);
			});
	};

	static postProfileUpdate = (userId, data, callbackFunc) => {
		const url = API_BASE_URL + USER_PROFILE + '/' + userId;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: data,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callbackFunc(apiResponse);
			});
	};

	static HospitalList = callbackFunc => {
		const url = API_BASE_URL + ADMIN_HOME;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'GET',
			url: url,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callbackFunc(apiResponse);
			});
	};

	static getUserbyHospitalID = (hospitalID, callbackFunc) => {
		const url = API_BASE_URL + ADMIN_HOME + '/' + hospitalID;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'GET',
			url: url,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callbackFunc(apiResponse);
			});
	};
	static saveGazeHeatmap = (file, callback) => {
		const fileExtension = file.name.split('.')[1];
		let fileName = file.name.split('.')[0] + '-' + uuidv4() + '.' + fileExtension;
		fileName = fileName.replace(/[^\w\d_\-.]+/gi, '');
		let apiResponse = { response: null, error: false, msg: '' };
		const url = API_BASE_URL + SAVE_GAZE_HEATMAP;

		axios({
			method: 'GET',
			url: url,
			params: {
				filename: fileName
			},
			headers: {
				Authorization: localStorage.getItem('accessToken')
			}
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse, file);
			});
	};
	static saveHeatmap = (data, callback) => {
		const url = API_BASE_URL + SAVE_HEATMAP;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: {
				view_url: data.view_url,
				s3_url: data.s3_url
			},
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
	static onCloseSaveHeatmap = data => {
		const url = API_BASE_URL + SAVE_HEATMAP;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: {
				view_url: data.view_url,
				s3_url: data.s3_url
			},
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			});
	};
	static captureWebpage = (dcmId, data) => {
		const url = API_BASE_URL + CAPTURE_WEBPAGE;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: {
				dcmId: dcmId,
				screenshot: data
			},
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			});
	};
	static createSurvey = (data, file, callback) => {
		const url = API_BASE_URL + SURVEY_CREATE;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: {
				surveyName: data,
				file: file
			},
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
	static updateSurvey = (survey_id, surveyName, data, callback) => {
		const url = API_BASE_URL + SURVEY_UPDATE + '/' + survey_id;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			data: {
				surveyName: surveyName,
				showImage: data.showImage,
				showFreeTextInput: data.showFreeTextInput,
				enableDrawFrame: data.enableDrawFrame,
				enablePrediction: data.enablePrediction,
				enableSurveyQuestions: data.enableSurveyQuestions
			},
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
	static deleteSurvey = (survey_id, callback) => {
		const url = API_BASE_URL + SURVEY_DELETE + '/' + survey_id;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'POST',
			url: url,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
	static getSurveyList = callback => {
		const url = API_BASE_URL + SURVEY_LIST;
		let apiResponse = { response: null, error: false, msg: '' };

		axios({
			method: 'GET',
			url: url,
			headers: {
				Authorization: getAccessToken()
			},
			responseType: 'json',
			responseEncoding: 'utf8'
		})
			.then(response => {
				apiResponse.response = response;
			})
			.catch(error => {
				apiResponse.response = error;
				apiResponse.error = true;
			})
			.finally(() => {
				callback(apiResponse);
			});
	};
}

export var API_BASE_URL_LOCAL = API_BASE_URL;
export var S3_BUCKET_NAME = _S3_BUCKET_NAME;
