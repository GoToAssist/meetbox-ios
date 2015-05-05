var React = require('react-native');
var Config = require('./config.js');
var {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  Button,
  View,
  AsyncStorage
} = React;

var Login = React.createClass({
  getInitialState: function() {
  	return {};
  },

  componentDidMount: function() {

  },

  usernameChange (text) {
  	this.setState({username: text});
  },

  passwordChange (text) {
  	this.setState({password: text});
  },

  login () {
  	fetch('https://podio.com/oauth/token', {
  		method: 'POST',
  		body: 'grant_type=password&username=' + this.state.username + '&password=' + this.state.password + '&client_id=' + Config.appName + '&redirect_uri=' + Config.callbackUrl + '&client_secret=' + Config.apiKey
  	}).then((response) => response.text())
	  .then((responseText) => {
	    return AsyncStorage.setItem("Auth", responseText);
	  }).then(() => {
	  	this.props.onAuthenticated && this.props.onAuthenticated();
	  })
	  .catch((error) => {
	    console.warn(error);
	  });
  	console.log("Do login", this.state.username, this.state.password);
  },

  render: function() {
    return (
    	<View>
        <Text>Username</Text><TextInput onChangeText={this.usernameChange} style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 300}} />
        <Text>Password</Text><TextInput onChangeText={this.passwordChange} style={{height: 40, borderColor: 'gray', borderWidth: 1, width: 300}} password={true} />
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#dd00dd', width: 100, height: 40}}>
        	<Text onPress={ this.login }>Login</Text></View>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

module.exports = Login;
AppRegistry.registerComponent('Login', () => Login);