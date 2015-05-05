var React = require('react-native');
var Config = require('./config.js');
var Resources = require('./resources.js');
var {
  AppRegistry,
  Text,
  View,
  AsyncStorage
} = React;

var Meetings = React.createClass({
  getInitialState: function() {
  	return {
      meetings: []
    };
  },

  componentDidMount: function() {
    this.fetchMeetings();
  },

  fetchMeetings () {
    Resources.getResource('/meetings').then((meetings) => {
      console.log("Meetings", meetings);
      this.setState({ meetings: meetings });      
    });
  },

  render: function() {
    return (
    	<View>
        <Text>Meetings:</Text>
        { this.state.meetings.map((meeting) => <Text>{ meeting }</Text>) }  
      </View> 
    );
  }
});

module.exports = Meetings;
AppRegistry.registerComponent('Meetings', () => Login);