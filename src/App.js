import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
import RoomList from './components/RoomList';


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
  render() {
    return (
      <div className="App">
        <RoomList firebase={firebase} />
      </div>
    );
  }
}

export default App;
