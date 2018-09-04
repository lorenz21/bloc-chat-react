import React, { Component } from 'react';
import './MessageList.css'

class MessageList extends Component {
  constructor(props){
    super(props);

    this.state = {
      messages: [],
      content: '',
      roomId: '',
      sentAt: '',
    };
    this.messagesRef = this.props.firebase.database().ref('messages');
    this.createMessage = this.createMessage.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      this.setState({ messages: this.state.messages.concat(message)});
    });
  }

  handleUserInput(e){
    this.setState({
      content: e.target.value
    });
  }

  createMessage() {

    if(this.props.activeRoom){
      const username = this.props.user ? this.props.user.displayName : "Guest"
      const timestamp = this.props.firebase.database.ServerValue.TIMESTAMP
      this.messagesRef.push({
        content: this.state.content,
        sentAt: timestamp,
        roomId: this.props.activeRoom.key,
        username: username
      });
      this.setState({
        content: '',
        sentAt: timestamp
      });
    }
    else{
      alert("Please select a room before sending a message")
      this.setState({
        content: ''
      });
    }

  }


  render() {
    return (
      <div className="col-7 message-list">
        <div className="row text-center h-100">
          <div className="col-12">
            <h2>Messages</h2>
          </div>
          {this.state.messages.filter(message => message.roomId === this.props.activeRoom.key).map((message, index) =>
            <div key={index} className="col-12 messsages">
              <p>{message.content}</p>
              <p>{this.props.formatTime(message.sentAt)}</p>
              <p>{message.username}</p>
            </div>

          )}
          <div className="col-12 fixed-bottom bottom-column">
            <div className="input-group">
              <input className="mdl-textfield__input bottom" type="text" value={this.state.content} placeholder="Enter a message..." onChange={this.handleUserInput}/>
              <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={this.createMessage}>Send</button>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default MessageList;
