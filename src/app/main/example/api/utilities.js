import jwt_decode from 'jwt-decode';

const ACCESS_TOKEN_KEY = 'accessToken';

const validateAccessToken = () => {
	try {
		const dateobj = new Date();
		const time = Math.floor(dateobj.getTime() / 1000);
		const jwtdata = parseInt(jwt_decode(getAccessToken()).exp);
		if (jwtdata < time) {
			clearLocalStorage();
			return false;
		}
		return true;
	} catch (err) {
		clearLocalStorage();
		return false;
	}
};

const _flattenArray = a => {
	return a.flat(10);
};

const _flattenObject = o => {
	let errors = [];
	Object.values(o).forEach(value => {
		if (Array.isArray(value)) errors.push(..._flattenArray(value));
		else if (typeof value === 'object') errors.push(..._flattenObject(value));
		else errors.push(value);
	});
	return errors;
};

const flattenErrorMessages = response => {
	console.log(response);
	const errorMessage = response.response.response.data.error.msg;

	if (typeof errorMessage === 'string') {
		return [errorMessage];
	}

	if (typeof errorMessage === 'object') {
		let errors = [];
		Object.values(errorMessage).forEach(value => {
			if (Array.isArray(value)) errors.push(..._flattenArray(value));
			else if (typeof value === 'object') errors.push(..._flattenObject(value));
			else errors.push(value);
		});
		return errors.length > 0 ? [errors[0]] : [];
	}
};

const formatDate = dateTime => {
	return dateTime.getDate() + '/' + (dateTime.getMonth() + 1) + '/' + dateTime.getFullYear();
};

const setAccessToken = accessToken => {
	localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
};

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

const clearLocalStorage = () => localStorage.clear();

const downloadReport = data => {
	var header =
		"<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
		"xmlns:w='urn:schemas-microsoft-com:office:word' " +
		"xmlns='http://www.w3.org/TR/REC-html40'>" +
		"<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
	var footer = '</body></html>';
	var sourceHTML = header + data + footer;

	var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
	var fileDownload = document.createElement('a');
	document.body.appendChild(fileDownload);
	fileDownload.href = source;
	fileDownload.download = 'document.doc';
	fileDownload.click();
	document.body.removeChild(fileDownload);
};

export {
	validateAccessToken,
	getAccessToken,
	setAccessToken,
	clearLocalStorage,
	flattenErrorMessages,
	formatDate,
	downloadReport
};
