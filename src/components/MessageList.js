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

  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      this.setState({ messages: this.state.messages.concat(message)});
    });
  }



  render() {
    return (
      <div className="col-7 message-list">
        <div className="row text-center h-100">
          <div className="col-12">
            <h2>Messages</h2>
          </div>
          {this.state.messages.filter(message => message.roomId === this.props.activeRoom.key).map((message, index) =>
            <div className="col-12 messsages">
              <p>{message.content}</p>
              <p>{message.sentAt}</p>
              <p>{message.username}</p>
            </div>

          )}
          <div className="col-12 fixed-bottom bottom-column">
            <div className="input-group">
              <input className="mdl-textfield__input bottom" type="text" placeholder="Enter a message..." />
              <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">Send</button>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default MessageList;
