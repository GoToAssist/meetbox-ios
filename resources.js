var React = require('react-native');
var Config = require('./config.js');
var {
  AsyncStorage
} = React;

module.exports = {
	postToResource: function(resource, data) {
		console.log("PrepareToPost", resource, data);
		return AsyncStorage.getItem("Auth").then((access) => {
			var auth = JSON.parse(access);
			//console.log('Fetch', resource.replace(/{user_id}/gi, auth.ref.id ));
			var accessToken = auth.access_token;
			console.log("DoPost", Config.rootUrl + resource.replace(/{user_id}/gi, auth.ref.id ), JSON.stringify(data));
			return fetch(Config.rootUrl + resource.replace(/{user_id}/gi, auth.ref.id ), {
				method: 'POST',
				headers: {
					"Authorization": "OAuth2 " + accessToken,
					"content-type": "application/json"
				},
				body: JSON.stringify(data)
			})
			.then((response) => response.text())
			.then((responseText) => {
				//console.log("Fetched resource", responseText);
				return JSON.parse(responseText);
			})
			.catch((error) => {
				console.warn(error);
			});

		});
	},
	getResource: function (resource) {
		console.log('Fetch', resource);
		return AsyncStorage.getItem("Auth").then((access) => {
			var auth = JSON.parse(access);
			//console.log('Fetch', resource.replace(/{user_id}/gi, auth.ref.id ));
			var accessToken = auth.access_token;
			
			return fetch(Config.rootUrl + resource.replace(/{user_id}/gi, auth.ref.id ), {
				method: 'GET',
				headers: { "Authorization": "OAuth2 " + accessToken }
			})
			.then((response) => response.text())
			.then((responseText) => {
				//console.log("Fetched resource", responseText);
				return JSON.parse(responseText);
			})
			.catch((error) => {
				console.warn(error);
			});

		});
	}
};