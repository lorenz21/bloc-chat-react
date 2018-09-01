import React, { Component } from 'react';

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
      <div className="message-list">

      {this.state.messages.filter(message => message.roomId === this.props.activeRoom.key).map((message, index) =>
        <div key={index} className="messages">
          <p>{message.content}</p>
          <p>{message.sentAt}</p>
          <p>{message.username}</p>
        </div>

      )}
        <input type="text" placeholder="Enter a message..." />
        <button>Send</button>
      </div>

    );
  }
}

export default MessageList;
