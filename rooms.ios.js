var React = require('react-native');
var Config = require('./config.js');
var Resources = require('./resources.js');
var beacons = require('./beacons');
var LocalNotifications = require('NativeModules').LocalNotifications;
var {
  AppRegistry,
  Text,
  View,
  AsyncStorage,
  DeviceEventEmitter
} = React;

var Meetings = React.createClass({
  getInitialState: function() {
  	return {
      rooms: [],
      error: undefined,
      loading: true
    };
  },

  componentDidMount: function() {
    this.fetchRooms();
    DeviceEventEmitter.addListener('EnterRegion', this.onRoomEntered);
    DeviceEventEmitter.addListener('LeaveRegion', this.onRoomLeft);
  },

  onRoomEntered: function(region) {
    console.log("Room entered", region);
    var room = this.state.rooms.filter((r) => r.Region === region.uuid);
    if (room.length) {
      this.setState({ activeRoom: room[0] });
      //Example to show notification
      LocalNotifications.showMessage(room[0]["Room Name"], "Join meeting!", "Slide to join meeting", room[0]);
    }
  },

  onRoomLeft: function(region) {
    console.log("Room left", region);
    var room = this.state.rooms.filter((r) => r.Region === region.uuid);
    if (room.length && room[0].Region === this.state.activeRoom.Region) {
      this.setState({ activeRoom: null });
    }
  },

  monitorRooms: function(allRooms) {
    allRooms.forEach((room) => beacons.addRegion(room.Region));
  },

  fetchRooms () {
    this.setState({ loading: true, rooms: this.state.rooms, error: undefined });

    Resources.getResource('/spaces/{user_id}').then((spaces) => {
      var space = spaces.filter((s) => s.name === "MeetBox");
      if (!space.length) {
        this.setState({ error: "You don't have access to the MeetBox workspace", rooms: [], loading: false });
      } else {
        Resources.getResource('/rooms/' + space[0].space_id).then((rooms) => {
          this.monitorRooms(rooms);
          this.setState({ rooms: rooms, error: undefined, loading: false });
        });
      }
    });
  },

  joinCurrentRoom: function() {
    Resources.postToResource('/join', {room: this.state.activeRoom, meeting: { url: 'http://g2m.me/bak' }}).then((response) => console.log("Posted", response));
    console.log("Join Room", this.state.activeRoom);
  },

  getCurrentRoom: function() {
    if (this.state.activeRoom) {
      return (<Text style={{
          width: 200, height: 40, backgroundColor: "#D3D3D3" }} onPress={this.joinCurrentRoom}>You are now in { this.state.activeRoom["Room Name"] }</Text>);
    } else {
      return (<Text>You are not currently in a meeting room</Text>);
    }
  },

  render: function() {
    return (
    	<View>{this.state.loading ? (<Text>Loading Rooms</Text>) : this.getCurrentRoom() }
        
        <Text>All available rooms:</Text>
        { this.state.rooms.map((room) =>
          <Text>{ room["Room Name"] }</Text>
        )}
      </View>
    );
  }
});

module.exports = Meetings;
AppRegistry.registerComponent('Meetings', () => Login);