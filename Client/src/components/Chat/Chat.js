import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useLocation, useHistory } from "react-router-dom";


import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';
// Socket variable to establish the communication between client and server
let socket;

const Chat = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'localhost:5000';  
  const history = useHistory();
  // useLocation() hook returns the location object that represents the current URL
  const location = useLocation();
  // useEffect() hook used to perform side effects in function components
  useEffect(() => {

    socket = io(ENDPOINT);
    const abort = new AbortController(); // To clean up resources after unmount
    const variable = location.state;
    // This condition is to ensure that the user logins and redirected from join page to this page
    if (variable) {
      const name = variable.name;
      const room = variable.room;
      const email = variable.email;
      setName(name);
      setRoom(room);
      // This request to server is to add the user in the server side (socket.emit => sending an event)
      socket.emit('join', { name, room, email }, (error) => {
        if(error) {
          alert(error);
          history.push('/');      // If something goes wrong, user will be redirected to home page
          return abort.abort();
        }
      });
    } else {                      // If something goes wrong, user will be redirected to home page
      history.push('/');
      return abort.abort();
    }
  }, [ENDPOINT, location.state, history]);
  

  useEffect(() => {
    // Receive request from server for displaying message in the chat (socket.on => receiving an event)
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    // Receive users data from server
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);
  // This is invoked when user sends some message
  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
      <div className="outerContainer">
        <div className="container">
            <InfoBar room={room} />
            <Messages messages={messages} name={name} />
            <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
        </div>
        <TextContainer users={users} />
      </div>
    );
  }

export default Chat;
