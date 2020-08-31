import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useLocation, useHistory } from "react-router-dom";


import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket;

const Chat = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  // const [email, setEmail] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'localhost:5000';  
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {

    socket = io(ENDPOINT);
    const abort = new AbortController();
    const variable = location.state;

    if (variable) {
      const name = variable.name;
      const room = variable.room;
      const email = variable.email;
      console.log(name);
      console.log(room);
      console.log(email);
      setName(name);
      setRoom(room);
      // setEmail(email);
      socket.emit('join', { name, room, email }, (error) => {
        if(error) {
          alert(error);
          history.push('/');
          return abort.abort();
        }
      });
    } else {
      history.push('/');
      return abort.abort();
    }
  }, [ENDPOINT, location.state, history]);
  

  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);

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
