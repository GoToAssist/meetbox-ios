var React = require('react-native');
var Config = require('./config.js');
var {
  AsyncStorage
} = React;

module.exports = {
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