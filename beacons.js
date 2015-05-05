var React = require('react-native');
var Beacons = require('react-native-ibeacon');

var {
  DeviceEventEmitter,
  PushNotificationIOS,
  AsyncStorage
} = React;

var LocalNotifications = require('NativeModules').LocalNotifications;

LocalNotifications.registerForNotification(function() {});
Beacons.startUpdatingLocation();

//Subscribe to the notification action
DeviceEventEmitter.addListener(
    'EventReminder',
    (reminder) => console.log("Join meeting!", reminder)
);

// Request for authorization while the app is open
Beacons.requestAlwaysAuthorization();


function proximityToInt(proximity) {
	switch (proximity) {
		case "immediate": return 5;
		case "near": return 4;
		case "far": return 3;
		case "unknown": return 2;
		default: return 1;
	}
}

function scoreProximityForBeacons(beacons) {
	var score = 0;
	beacons.forEach((b) => score =+ proximityToInt(b.proximity));
	return score/beacons.length;
}

function findNearestRegion (regionA, regionB) {
	if (!regionA) return regionB;
	if (!regionB) return regionA;
	var scoreA = scoreProximityForBeacons(regionA.beacons);
	var scoreB = scoreProximityForBeacons(regionB.beacons);
	return scoreA >= scoreB ? regionA : regionB;
}
/*DeviceEventEmitter.addListener(
      'regionDidEnter',
      (data) => { console.log('Enter region', data); }
);

DeviceEventEmitter.addListener(
      'regionDidExit',
      (data) => { console.log('Exit region', data); }
);*/

DeviceEventEmitter.addListener(
	'beaconsDidRange',
	(data) => {
		var region = regions.filter( (r) => r.uuid === data.region.uuid);
		if (data.beacons.length && region.length) { //Matching region and we're in it
			if (currentRegion && currentRegion.uuid === region[0].uuid) {
				//This is current region
				currentRegion.beacons = data.beacons;
				//console.log('Still in region', currentRegion.beacons);
			} else {
				//We're in a new region , that's not the current, so switch
				console.log("New region!", region[0], data);
				if (findNearestRegion(data, currentRegion) === data) {
					currentRegion = region[0];
					currentRegion.beacons = data.beacons;	
				}
			}
		} else {
			if (currentRegion && region.length && region[0].uuid === currentRegion.uuid) {
				console.log("Left region!", region[0], data);
				currentRegion = undefined;
			}
		}
	}
);

//Example to show notification
//LocalNotifications.showMessage("Meeting", "Join meeting!", "Slide to join meeting", { custom: "DATA" });

var regions = [];
var currentRegion;

module.exports = {
	addRegion: function(uuid, identifier) {
		identifier = identifier || 'Estimotes';
		if (regions.some(r => r.uuid === uuid)) {
			return;
		}
		var region = {
			identifier: identifier,
    		uuid: uuid
		};

		regions.push(region);
		Beacons.startMonitoringForRegion(region);
		Beacons.startRangingBeaconsInRegion(region);
		console.log("Monitoring region", region);
	},

	removeRegion: function(uuid) {
		var region = regions.filter(r => r.uuid === uuid);
		if (region.length) {
			region = region[0];
			regions.splice(regions.indexOf(region), 1);
			Beacons.stopMonitoringForRegion(region);
			Beacons.stopRangingBeaconsInRegion(region);		
		}

	}
}

