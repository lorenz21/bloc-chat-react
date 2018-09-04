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

      <div className="col-5 room-list">
        <div className="row text-center h-100">
          <div className="col-12">
            <h2 className="top">{this.props.activeRoom ? this.props.activeRoom.name : 'Select a Chat Room'}</h2>
          </div>
          <div className="col-12 rooms">
            <ul className="btn-group-vertical">
            {this.state.rooms.map( room =>
                <li className="list-group-item">
                  <button key={room.key} className="mdl-button mdl-js-button mdl-button--primary create-room" onClick={(e) => this.handleRoomSelect(room,e)}>{room.name}</button>
                </li>
            )}
            </ul>
          </div>
          <div className="col-12 fixed-bottom bottom-column" >
            <div className="input-group">
              <input className="mdl-textfield__input bottom" type="text" placeholder="Enter new room name..." value={this.state.newRoomName} onChange={this.handleUserInput}/>
              <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary" type="button" onClick={this.createRoom}>New Room</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RoomList;
