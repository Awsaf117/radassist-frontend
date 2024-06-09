import axios from 'axios';
import { getAccessToken } from '../../../example/api/utilities';
import { API_BASE_URL_LOCAL } from '../../../example/api/backend';

export const GET_FILES = '[FILE MANAGER APP] GET FILES';

export function getFiles() {
	const request = axios.get(API_BASE_URL_LOCAL + '/report', {
		headers: {
			Authorization: getAccessToken()
		}
	});

	return dispatch =>
		request.then(response =>
			dispatch({
				type: GET_FILES,
				payload: response.data
			})
		);
}
