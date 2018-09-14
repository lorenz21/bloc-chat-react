import React, { Component } from 'react';
import './MessageList.css'

class MessageList extends Component {
  constructor(props){
    super(props);

    this.state = {
      messages: [],
      roomId: '',
      sentAt: '',
      newMessage: '',
      editMessageContent: '',
      editMessage: '',
      updateButton: true,
      newButton: false
    };
    this.messagesRef = this.props.firebase.database().ref('messages');
    this.createMessage = this.createMessage.bind(this);
    this.handleNewInput = this.handleNewInput.bind(this);
    this.handleEditMessage = this.handleEditMessage.bind(this);
    this.handleEditInput = this.handleEditInput.bind(this);
    this.updateRoom = this.updateRoom.bind(this);
  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({ messages: this.state.messages.concat(message)});
    });

    this.messagesRef.on('child_removed', snapshot => {
      const previousMessages = this.state.messages;

      for(let i=0; i < previousMessages.length; i++){
        if(previousMessages[i].key === snapshot.key) {
          previousMessages.splice(i, 1);
        }
      }

      this.setState({
        rooms: previousMessages
      });
    });

    this.messagesRef.on('child_changed', snapshot => {
      const previousMessages = this.state.messages;
      for(let i=0; i < previousMessages.length; i++){
        if(previousMessages[i].key === snapshot.key) {
          previousMessages[i].content = snapshot.val().content;
        }
      }

      this.setState({
        messages: previousMessages
      });

    });
  }

  createMessage() {
    if(this.props.activeRoom){
      const username = this.props.user ? this.props.user.displayName : "Guest"
      const timestamp = this.props.firebase.database.ServerValue.TIMESTAMP
      this.messagesRef.push({
        content: this.state.newMessage,
        sentAt: timestamp,
        roomId: this.props.activeRoom.key,
        username: username
      });
      this.setState({
        newMessage: '',
        sentAt: timestamp
      });
    }
    else{
      alert("Please select a room before sending a message")
      this.setState({
        newMessage: ''
      });
    }
  }

  updateRoom (){
    const messageId = this.state.editMessage.key;
    const newMessage = this.state.editMessageContent;

    if(newMessage.trim() !== ""){
      this.messagesRef.child(messageId).update({
        content: newMessage
      });
      this.setState({
        editMessageContent: '',
        editMessage: '',
        updateButton: true,
        newButton: false
      });
    }
    else{
      alert("Please enter a Room Name");
      this.setState({
        editMessageContent: '',
        newMessage: '',
      });
    }
  }

  handleNewInput(e){
    this.setState({
      newMessage: e.target.value,
    });
  }

  handleEditInput(e){
    this.setState({
      editMessageContent: e.target.value
    });
  }

  handleRemoveMessage(messageId) {
    return this.props.firebase.database().ref('messages').child(messageId).remove();
  }

  handleEditMessage(message) {
    const messageContent = message.content;
    this.setState({
      editMessage: message,
      editMessageContent: messageContent,
      updateButton: false,
      newButton: true
    });
  }


  render() {
    return (
      <main className="mdl-layout__content message-list">
          <div className="mdl-grid">
            <h2 className="mdl-cell mdl-cell--12-col">Messages</h2>
            {this.state.messages.filter(message => message.roomId === this.props.activeRoom.key).map((message, index) =>
              <div key={index} className="col-12 messsages">
                {this.state.editMessage && message.key === this.state.editMessage.key  ?
                <div>
                  <input className="mdl-textfield__input bottom" type="text" value={this.state.editMessageContent} onChange={this.handleEditInput}/>
                  <p>{this.props.formatTime(message.sentAt)}</p>
                  <p>{message.username}</p>
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--primary" type="button" onClick={this.updateRoom} disabled={this.state.updateButton}>Update</button>
                </div>
                :
                <div>
                  <p>{message.content}</p>
                  <p>{this.props.formatTime(message.sentAt)}</p>
                  <p>{message.username}</p>
                  <span className="ion-md-trash" onClick={() => this.handleRemoveMessage(message.key)}></span>
                  <span className="ion-md-create" onClick={() => this.handleEditMessage(message)}></span>
                </div>
              }
            </div>

            )}
              <div className="input-group">
                <input className="mdl-textfield__input bottom" type="text" value={this.state.newMessage} placeholder="Enter a message..." onChange={this.handleNewInput} onKeyPress={event => {if (event.key === 'Enter'){this.createMessage();}}}/>
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={this.createMessage}>Send</button>
              </div>
          </div>
      </main>

    );
  }
}

export default MessageList;
