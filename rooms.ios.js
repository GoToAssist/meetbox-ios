var React = require('react-native');
var Config = require('./config.js');
var Resources = require('./resources.js');
var beacons = require('./beacons');

var {
  AppRegistry,
  Text,
  View,
  AsyncStorage
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

  render: function() {
    return (
    	<View>{this.state.loading ? (<Text>Loading Rooms</Text>) : (
        <Text>Rooms:</Text>
        )}
        { this.state.rooms.map((room) =>
          <Text>{ room["Room Name"] }</Text>
        )}
      </View>
    );
  }
});

module.exports = Meetings;
AppRegistry.registerComponent('Meetings', () => Login);