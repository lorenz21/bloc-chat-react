import React, { Component } from 'react';
import './RoomList.css'

class RoomList extends Component {
  constructor(props){
    super(props);

    this.state = {
      rooms: [],
      newRoomName: '',
    };

    this.roomsRef = this.props.firebase.database().ref('rooms');
    this.handleUserInput = this.handleUserInput.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.setActiveRoom = this.props.setActiveRoom.bind(this);
  }

  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat(room)});
    });
  }

  handleUserInput(e){
    this.setState({
      newRoomName: e.target.value
    });

  }

  createRoom() {
    if(this.state.newRoomName.trim() !== ""){
      this.roomsRef.push({
        name: this.state.newRoomName
      });
      this.setState({
        newRoomName: '',
      });
    }
    else{
      alert("Please enter a Room Name");
      this.setState({
        newRoomName: '',
      });
    }
  }

  handleRoomSelect (room) {
    this.props.setActiveRoom(room);
  }

  render() {
    return (

      <div className="room-list">
        <h1>{this.props.activeRoom ? this.props.activeRoom.name : 'Select a Chat Room'}</h1>
        <ul>
        {this.state.rooms.map( room =>
          <li key={room.key}>
          <button className="create-room" onClick={(e) => this.handleRoomSelect(room,e)}>{room.name}</button>
          </li>

        )}
        </ul>

        <input type="text" placeholder="Enter new room name..." value={this.state.newRoomName} onChange={this.handleUserInput}/>
        <button onClick={this.createRoom}>Create New Room</button>
      </div>
    );
  }
}

export default RoomList;
