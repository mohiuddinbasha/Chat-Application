import React, { useState, useEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import io from "socket.io-client";
import './Admin.css';
import '../Chat/Chat'

let socket;

const Admin = () => {
    const [userName, setUserName] = useState('');
    const [gmailId, setGmailId] = useState('');
    const [adminName, setAdminName] = useState('');
    const [adminGmailId, setAdminGmailId] = useState('');
    const ENDPOINT = 'localhost:5000';
    const location = useLocation();
    const history = useHistory();
    const [links, setLinks] = useState([]);

    useEffect(() => {
        const abort = new AbortController();
        const variable = location.state;
        // Receiving state props from url
        if (variable) {
            setAdminName(variable.name);
            setAdminGmailId(variable.email);
        } else {
            history.push('/admin-login');
            return abort.abort();
        }
    }, [ENDPOINT, location.state, history])

    
    useEffect(() => {
        socket = io(ENDPOINT);
        // Invoking server to get users list data
        socket.emit('getInfo', () => {
            console.log("Connected");
        })
        const timer = setTimeout(() => {
            window.location.reload(true);
        }, 30000);
        return () => clearTimeout(timer);
    }, [ENDPOINT]);

    function sendDetails() {
        if (userName.length === 0 || gmailId.length === 0) {
            alert('Fill the fields')
        } else {
            // Sending request to server for new admin
            socket.emit('newAdmin', {name: userName, email: gmailId}, (error) => {
                if (error) {
                    alert(`${gmailId} successfully registered`); 
                } else {
                    alert('Enter a valid google id');
                }
            })
        }
    }


    useEffect(() => {
        // Receiving the user list data
        socket.on('userData', (data) => {
            console.log(data);
            setLinks([]);
            data['users'].map((item) => (setLinks(links => [ ...links, { name: item.name, room: item.room, status: item.status }])));
        })
    }, [ENDPOINT, links]);

    const renderLinks = (link, index) => {
        return (
            <tr key={index}>
                <td>{index}</td>
                <td><Link to={{
                                pathname:'/chat',
                                state: { name: adminName,
                                         room: link.room,
                                         email: adminGmailId
                                       }
                }}>{link.name}</Link></td>
                <td>{link.status}</td>
            </tr>
        )
    }

    return (
        <div>
            <div>
                <h2 className="headingOne">Add New Admin</h2>
            </div>
            <form className="inputDiv">
                <input placeholder="UserName" className="userNameInput" type="text" required onChange={(event) => setUserName(event.target.value)} />
                <input placeholder="Gmail Id" className="userGmailIdInput" type="email" required onChange={(event) => setGmailId(event.target.value)} />
                <button className="buttonAdmin" type="submit" onClick={sendDetails}>Add</button>
            </form>
            <div>
                <h2 className="headingTwo">Status Table</h2>
            </div>
            <div className="containerAdmin">
                <table className="table">
                    <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Link</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                        {links.map(renderLinks)}
                    </tbody>
                </table>
            </div>
        </div>
    );
  }
  
  export default Admin;