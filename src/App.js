import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import User from './components/User';

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCMQJkCwEauA-Wl7ma3StPEqX39uOcL7-A",
    authDomain: "bloc-chat-react-2121.firebaseapp.com",
    databaseURL: "https://bloc-chat-react-2121.firebaseio.com",
    projectId: "bloc-chat-react-2121",
    storageBucket: "bloc-chat-react-2121.appspot.com",
    messagingSenderId: "111946694590"
  };
  firebase.initializeApp(config);


class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      activeRoom: '',
      user: null,
    };

    this.setActiveRoom = this.setActiveRoom.bind(this);
    this.setUser = this.setUser.bind(this);
  }


  setActiveRoom(room) {

    this.setState({
      activeRoom: room
    });

  }

  setUser(user) {
    this.setState({
      user:user
    });
  }


  render() {
    return (
      <div className="container-fluid h-100">
        <User
        firebase={firebase}
        setUser={this.setUser}
        user={this.state.user}
        />
        <div className="row h-100">
          <RoomList
          firebase={firebase}
          activeRoom={this.state.activeRoom}
          setActiveRoom={this.setActiveRoom}
          />
          <MessageList
          firebase={firebase}
          activeRoom={this.state.activeRoom}
          />
        </div>
      </div>
    );
  }
}

export default App;
