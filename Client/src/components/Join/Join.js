// This javascript is rendered for the student login page
import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import { useHistory } from 'react-router-dom';

import './Join.css';

export default function SignIn() {
  // State variables; useState() Hook returns a pair of values: current state and function that updates the state
  const [name, setName] = useState('');
  const room = name + (Math.floor(Math.random() * 100000) + 1); // Generating a room id (name + 5 digit random number)
  // useHistory() hook is used for navigate between routes
  const history = useHistory();
  
  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join</h1>
        <div>
          <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="googleButton">
          <GoogleLogin
            clientId="643033007551-n9v1ehq8aime1mtbndq6b8jn1sjqjttl.apps.googleusercontent.com"
            buttonText="Sign in with Google"
            onSuccess={(response) => {console.log(response);
              console.log(response.profileObj);
              history.push({
                pathname: `/chat`,
                state: { name: name.length === 0 ? 'Anonymous':`${name}`,
                         room: `${room}`,
                         email: response.profileObj.email}
              })
            }}
            onFailure={() => alert.show('Failure')}
            cookiePolicy={'single_host_origin'}
          
          />
        </div>
      </div>
    </div>
  );
}
