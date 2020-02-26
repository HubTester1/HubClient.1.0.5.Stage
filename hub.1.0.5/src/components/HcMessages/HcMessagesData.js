
// ----- IMPORTS

import moment from 'moment';
import NesoHTTPClient from '../../services/NesoHTTPClient';

const shortid = require('shortid');

// ----- DATA

export default class HcMessagesData {
	constructor() {
		this.UploadMessagesFiles = this.UploadMessagesFiles.bind(this);
	}
	static ReturnHcMessagesTags() {
		// return a new promise
		return new Promise((resolve, reject) => {
			// get a promise to retrieve the settings
			NesoHTTPClient
				.ReturnNesoData('https://neso.mos.org/hcMessages/settings')
			// if the promise is resolved with the settings
				.then((settingsResults) => {
					// set up var to receive all tags
					const allMessageTags = [];
					// iterate over the results and push them to allListItems
					settingsResults[0].tags.forEach((tagValue) => {
						const tagFormatted = {
							name: '',
							camlName: '',
							key: '',
						};
						if (tagValue.name) {
							tagFormatted.name = tagValue.name;
							tagFormatted.camlName = tagValue.camlName;
							tagFormatted.key = shortid.generate();

							allMessageTags.push(tagFormatted);
						}
					});
					// sort allListItems by name properties
					allMessageTags.sort((a, b) => {
						if (a.name < b.name) return -1;
						if (a.name > b.name) return 1;
						return 0;
					});
					// resolve this promise with the requested items
					resolve(allMessageTags);
				});
		});
	}
	static ReturnHcMessagesAllMessages() {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// get a promise to retrieve the settings
			NesoHTTPClient
				.ReturnNesoData('https://neso.mos.org/hcMessages/descending')
			// if the promise is resolved with the settings
				.then((messagesResults) => {
					// set up var to receive all messages
					const allMessagesMessages = [];
					// iterate over the results and push them to allListItems
					messagesResults.forEach((messageValues) => {
						const messageFormatted = {
							tags: [],
							subject: '',
							created: '',
							modified: '',
							creator: '',
							body: '',
							images: [],
							expiration: '',

							key: '',
						};
						if (messageValues.messageBody) {
							allMessagesMessages
								.push(this.ReturnFormattedMessage(messageValues, messageFormatted));
						}
					});
					// sort messages according to modified property
					// allMessagesMessages.sort((a, b) => {
					// 	if (moment(a.modified).isBefore(moment(b.modified))) {
					// 		return 1;
					// 	}
					// 	return -1;
					// });
					// resolve this promise with the requested items
					resolve(allMessagesMessages);
				});
		}));
	}
	static ReturnFormattedMessage(messageValues, messageFormatted) {
		const messageFormattedCopy = messageFormatted;
		messageFormattedCopy.messageID = messageValues.messageID;
		messageFormattedCopy.tags = messageValues.messageTags;
		messageFormattedCopy.subject = messageValues.messageSubject;
		messageFormattedCopy.created = messageValues.messageCreated;
		messageFormattedCopy.modified = messageValues.messageModified;
		messageFormattedCopy.creator = messageValues.messageCreator;
		messageFormattedCopy.body = messageValues.messageBody;
		messageFormattedCopy.expiration = messageValues.messageExpiration;
		messageFormattedCopy.key = shortid.generate();

		if (messageValues.messageImages && messageValues.messageImages[0]) {
			messageValues.messageImages.forEach((imageValue) => {
				const imageValueCopy = imageValue;
				// add a separate, unique key for use solely in displaying inside in full message
				imageValueCopy.imageKey = shortid.generate();
				// this is leftover from when it was anticiapted that message previews would show images
				// imageValueCopy.previewKey = shortid.generate();
				messageFormattedCopy.images.push(imageValueCopy);
			});
		}
		return messageFormattedCopy;
	}
	static ReturnHcMessagesTopMessages() {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// get a promise to retrieve the settings
			NesoHTTPClient
				.ReturnNesoData('https://neso.mos.org/hcMessages/descending/limit4')
			// if the promise is resolved with the settings
				.then((messagesResults) => {
					// set up var to receive all messages
					const allMessagesMessages = [];
					// iterate over the results and push them to allListItems
					messagesResults.forEach((messageValues) => {
						const messageFormatted = {
							tags: [],
							subject: '',
							created: '',
							modified: '',
							creator: '',
							body: '',
							images: [],
							expiration: '',

							key: '',
						};
						if (messageValues.messageBody) {
							allMessagesMessages
								.push(this.ReturnFormattedMessage(messageValues, messageFormatted));
						}
					});
					// sort messages according to modified property
					// allMessagesMessages.sort((a, b) => {
					// 	if (moment(a.modified).isBefore(moment(b.modified))) {
					// 		return 1;
					// 	}
					// 	return -1;
					// });
					// resolve this promise with the requested items
					resolve(allMessagesMessages);
				});
		}));
	}
	static ReturnHcMessagesAllMessagesWSpecifiedTag(name, camlName) {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// get a promise to retrieve the settings
			NesoHTTPClient
				.ReturnNesoData(`https://neso.mos.org/hcMessages/descending/tagged/${name}/${camlName}`)
			// if the promise is resolved with the settings
				.then((messagesResults) => {
					// set up var to receive all messages
					const allMessagesMessages = [];
					// iterate over the results and push them to allListItems
					messagesResults.forEach((messageValues) => {
						const messageFormatted = {
							tags: [],
							subject: '',
							created: '',
							modified: '',
							creator: '',
							body: '',
							images: [],
							expiration: '',

							key: '',
						};
						if (messageValues.messageBody) {
							allMessagesMessages
								.push(this.ReturnFormattedMessage(messageValues, messageFormatted));
						}
					});
					// sort messages according to modified property
					allMessagesMessages.sort((a, b) => {
						if (moment(a.modified).isBefore(moment(b.modified))) {
							return 1;
						}
						return -1;
					});
					// resolve this promise with the requested items
					resolve(allMessagesMessages);
				});
		}));
	}
	static SendSaveErrorEmail(stateData) {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// get a promise to send the email
			NesoHTTPClient.SendNesoJSONAndReceiveResponse(
				'https://neso.mos.org/email/send',
				{
					to: 'hubhelp@mos.org',
					from: 'The Hub <noreply@mos.org>',
					subject: 'HcMessages Save Error',
					html: JSON.stringify(stateData),
					system: 'hub',
					type: 'HcMessages Save Error',
					event: 'HcMessages Save Error',
				},
			)
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		}));
	}
	static SendNesoMessagesMessage(newMessageProperties) {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// get a promise to send the email
			NesoHTTPClient.SendNesoJSONAndReceiveResponse(
				'https://neso.mos.org/hcMessages/addMessage',
				newMessageProperties,
			)
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		}));
	}
	static SendNesoMessagesMessageUpdate(newMessageProperties) {
		// return a new promise
		return new Promise(((resolve, reject) => {
			// get a promise to send the email
			NesoHTTPClient.SendNesoJSONAndReceiveResponse(
				'https://neso.mos.org/hcMessages/updateMessage',
				newMessageProperties,
			)
				.then((response) => {
					resolve(response);
				})
				.catch((error) => {
					reject(error);
				});
		}));
	}
	static ReturnNesoNextMessageID() {
		// return a new promise
		return new Promise((resolve, reject) => {
			// get a promise to retrieve the settings
			NesoHTTPClient
				.ReturnNesoData('https://neso.mos.org/hcMessages/nextMessageID')
			// if the promise is resolved with the ID
				.then((nextMessageIDResults) => {
					// resolve this promise with the requested items
					resolve(nextMessageIDResults);
				})
				.catch((nesoAxiosError) => {
					reject(nesoAxiosError); 
				});
		});
	}
	static UploadMessagesFiles(messageID, filesArray) {
		// return a promise to upload the fies
		return new Promise((resolve, reject) => {
			// prep data and config for file upload
			const filesUploadEndPoint = 'https://neso.mos.org/hcMessages/addMessageImages';
			const filesUploadConfig = {
				headers: { 'content-type': 'multipart/form-data' },
			};
			const filesUploadData = new FormData();
			filesUploadData.append('messageID', messageID);
			// for each file in filesArray
			filesArray.forEach((fileValue, fileIndex) => {
				// append to filesUploadData
				filesUploadData.append(`image[${fileIndex}]`, fileValue);
			});
			// get promise to upload message files to Neso
			// note: filesUploadConfig doesn't seem to be needed, but leaving it defined and passed
			// 		for now in case a need is discovered; FUNCTION DOES NOT CURRENTLY RECEIVE AND USE IT
			NesoHTTPClient
				.SendNesoJSONAndReceiveResponse(filesUploadEndPoint, filesUploadData, filesUploadConfig)
				.then((fileUploadResults) => {
					// resolve the top level promise with the file upload results
					resolve(fileUploadResults);
				})
				// if the promise is rejected with an error, then reject this promise with an error
				.catch((error) => { reject(error); });
		});
	}
}
