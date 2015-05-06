/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var Beacons = require('react-native-ibeacon');
var {
  DeviceEventEmitter,
  AlertIOS,
  PushNotificationIOS,
  AsyncStorage
} = React;

var LocalNotifications = require('NativeModules').LocalNotifications;

var Login = require('./login.ios.js');
var Meetings = require('./meetings.ios.js');
var Rooms = require('./rooms.ios.js');

//AsyncStorage.setItem("Auth", "");

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var Meetbox = React.createClass({
  getInitialState: function() {
    return {
      beacon: null,
      evHap: "Nothing",
      authState: 'checking'
    };
  },

  componentDidMount: function() {
    // Request for authorization while the app is open
    //Beacons.requestAlwaysAuthorization();
    //Beacons.startMonitoringForRegion(region);
    //Beacons.startMonitoringForRegion(region2);
    //Beacons.startRangingBeaconsInRegion(region);
    //Beacons.startRangingBeaconsInRegion(region2);

    //LocalNotifications.registerForNotification(function() {});

    //var subscription = DeviceEventEmitter.addListener(
      //'EventReminder',
      //(reminder) => console.log("REMINDER!", reminder)
    //);

    //PushNotificationIOS.requestPermissions();
    //PushNotificationIOS.addEventListener('notification', this._onNotification);
     
    //Beacons.startUpdatingLocation();

    var last = new Date().getTime();
    this.counter = 0;
/*
    var subscription = DeviceEventEmitter.addListener(
      'beaconsDidRange',
      (data) => {

        if (new Date().getTime() - last > 5000 ) {
          last = new Date().getTime();

          //PushNotificationIOS.setApplicationIconBadgeNumber(this.counter);
        
          LocalNotifications.showMessage("TitleX", "Show notification!", "Slide to join meeting", { custom: "DATA" });

        }
        this.setState({'beacon': data, evHap: "Found!", count: this.counter++});

        // data.region - The current region 
        // data.region.identifier 
        // data.region.uuid 
     
        // data.beacons - Array of all beacons inside a region 
        //  in the following structure: 
        //    .uuid 
        //    .major - The major version of a beacon 
        //    .minor - The minor version of a beacon 
        //    .rssi - RSSI value (between -100 and 0) 
        //    .proximity - Proximity value, can either be "unknown", "far", "near" or "immediate" 
        //    .accuracy - The accuracy of a beacon 
      }
    );*/
    
    console.log("Check Auth!");
    AsyncStorage.getItem("Auth").then((access) => {
      if (access) {
        this.setState({ authState: 'authenticated' });
        console.log("Auth", this.state.authState);
      } else {
        this.setState({ authState: 'login' });
      }
    });
  },

  onAuthenticated () {
    this.setState({authState: 'authenticated'});
    AsyncStorage.getItem("Auth").then((access) => {
      console.log('AUTH', JSON.parse(access));  
    });
  },

  getMainView(authState) {
    switch (authState) {
      case 'login':
        return (<Login onAuthenticated={this.onAuthenticated}/>);
      case 'authenticated':
        return (<Meetings></Meetings>);
      default:
        return (<Text>Checking...</Text>);
    }
  },

  render: function() {
    
    return (
      <View style={styles.container}>
        { this.getMainView(this.state.authState) }
        <Rooms></Rooms>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

});

AppRegistry.registerComponent('Meetbox', () => Meetbox);
