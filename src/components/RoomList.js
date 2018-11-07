import React, { Component } from 'react';
import './RoomList.css'

class RoomList extends Component {
  constructor(props){
    super(props);

    this.state = {
      rooms: [],
      newRoomName: '',
      editRoomName: '',
      updateButton: true,
      newButton: false
    };

    this.roomsRef = this.props.firebase.database().ref('rooms');
    this.createRoom = this.createRoom.bind(this);
    this.setActiveRoom = this.props.setActiveRoom.bind(this);
    this.updateRoom = this.updateRoom.bind(this);
    this.handleNewInput = this.handleNewInput.bind(this);
    this.handleEditInput= this.handleEditInput.bind(this);
  }

  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({
        rooms: this.state.rooms.concat(room)
      });
    });
    this.setState({
      activeRoom: '',
    });
    this.roomsRef.on('child_removed', snapshot => {
      const previousRooms = this.state.rooms;

      for(let i=0; i < previousRooms.length; i++){
        if(previousRooms[i].key === snapshot.key) {
          previousRooms.splice(i, 1);
        }
      }

      this.setState({
        rooms: previousRooms
      });
    });

    this.roomsRef.on('child_changed', snapshot => {
      const previousRooms = this.state.rooms;
      for(let i=0; i < previousRooms.length; i++){
        if(previousRooms[i].key === snapshot.key) {
          previousRooms[i].name = snapshot.val().name;
        }
      }

      this.setState({
        rooms: previousRooms
      });

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

  updateRoom (){
    const roomId = this.props.activeRoom.key;
    const newRoomName = this.state.editRoomName;

    if(this.state.editRoomName.trim() !== ""){
      this.roomsRef.child(roomId).update({
        name: newRoomName
      });
      this.setState({
        editRoomName: '',
        updateButton: true,
        newButton: false
      });
    }
    else{
      alert("Please enter a Room Name");
      this.setState({
        editRoomName: '',
        newRoomName: '',
      });
    }
  }

  handleNewInput(e){
    this.setState({
      newRoomName: e.target.value,
    });
  }

  handleEditInput(e){
    this.setState({
      editRoomName: e.target.value
    });
  }

  handleRoomSelect(room) {
    this.props.setActiveRoom(room);
  }

  handleRemoveRoom(roomId) {
    return this.props.firebase.database().ref('rooms').child(roomId).remove();
  }

  handleEditRoom(room) {
    this.props.setActiveRoom(room);
    const roomName = room.name;
    this.setState({
      editRoomName: roomName,
      updateButton: false,
      newButton: true
    });
  }

  render() {
    return (

      <div className="mdl-layout__drawer grid room-list">
        <span className="mdl-layout-title top">{this.props.activeRoom ? this.props.activeRoom.name : 'Select a Chat Room'}</span>
            <nav className="mdl-navigation">
            {this.state.rooms.map( room =>
                <li key={room.key} className="list-group-item">
                  {this.state.editRoomName && room.key === this.props.activeRoom.key ?
                    <nav className="mdl-navigation">
                      <input className="mdl-textfield__input bottom" type="text" placeholder="Update room name..." value={this.state.editRoomName} onChange={this.handleEditInput}/>
                      <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary" type="button" onClick={this.updateRoom} disabled={this.state.updateButton}>Update</button>
                    </nav>
                  :
                    <nav className="mdl-navigation">
                      <a className="mdl-navigation__link create-room" onClick={(e) => this.handleRoomSelect(room,e)}>{room.name}</a>
                      <span className="ion-md-trash" onClick={() => this.handleRemoveRoom(room.key)}></span>
                      <span className="ion-md-create" onClick={(e) => this.handleEditRoom(room,e)}></span>
                    </nav>
                  }
                </li>
            )}
          </nav>
            <div className="input-group">
              <input className="mdl-textfield__input" type={this.state.newButton ? 'hidden' : 'text'} placeholder="Enter new room name..." value={this.state.newRoomName} onChange={this.handleNewInput} onKeyPress={event => {if (event.key === 'Enter'){this.createRoom();}}}/>
              <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary" type="button" onClick={this.createRoom} disabled={this.state.newButton}>New Room</button>
            </div>
      </div>
    );
  }
}

export default RoomList;
