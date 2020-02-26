
// ----- IMPORTS

import NesoHTTPClient from './NesoHTTPClient';


// ----- DATA

export default class NesoAvailability {
	static ReturnNesoAvailability() {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// get a promise to retrieve the health data from Neso
			NesoHTTPClient
				.ReturnNesoData('https://neso.mos.org/health/check')
				// if the promise is resolved with the data
				.then((result) => {
					// interpret the data and resolve the promise with the interpretation
					if (result && result[0] && result[0].healthy) {
						resolve({ available: true });
					} else {
						resolve({ available: false });
					}
				})
				// if the promise is rejected with an error
				.catch((error) => {
					reject({ available: false });
				});
		}));
	}
}
