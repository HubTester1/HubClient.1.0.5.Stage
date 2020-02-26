import axios from 'axios';

export default class NesoHttpClient {
	static ReturnNesoData(endpoint) {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// get a promise to retrieve the data
			axios({
				method: 'get',
				url: endpoint,
				timeout: 10000,
			})
				// if the promise is resolved with the docs, then resolve this promise with the docs
				.then((result) => { resolve(result.data.docs); })
				// if the promise is rejected with an error
				.catch((error) => {
					// set up error container
					const errorToReport = {
						config: error.config,
					};
					if (error.response) {
						// set reporting error's properties
						errorToReport.summary = 'Response status code is not 2xx';
						errorToReport.details.data = error.response.data;
						errorToReport.details.status = error.response.status;
						errorToReport.details.headers = error.response.headers;
					} else if (error.request) {
						// set reporting error's properties; note: error.request is
						//  	an instance of XMLHttpRequest in the browser and 
						// 		an instance of http.ClientRequest in node.js
						errorToReport.summary = 'No response';
						errorToReport.details = error.request;
					} else {
						// set reporting error's properties
						errorToReport.summary = 'Request could not be made';
						errorToReport.details = error.message;
					}
					// reject this promise with an error
					reject({
						error: true,
						nesoAxiosError: errorToReport,
					});
				});
		}));
	}
	static SendNesoJSONAndReceiveResponse(endpoint, jsonObject, config) {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// get a promise to post the data
			axios.post(endpoint, jsonObject, config)
				// if the promise is resolved with the docs, then resolve this promise with the docs
				.then((result) => { resolve(result); })
				// if the promise is rejected with an error
				.catch((returnedError) => {
					// reject this promise with an error
					reject({
						error: true,
						nesoAxiosError: returnedError,
					});
				});
		}));
	}
}
