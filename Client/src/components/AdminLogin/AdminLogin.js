import React, { useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import { useHistory } from 'react-router-dom';
import io from "socket.io-client";
import './AdminLogin.css';

let socket;

export default function SignIn() {
  const history = useHistory();
  const ENDPOINT = 'localhost:5000';

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.on('adminDetails', (data) => {
      console.log(data);
      if (!data.boolean) {
          alert('Not a valid admin');
        } else {
          history.push({
            pathname: `/admin`,
            state: { name: data.name,
                     email: data.email}
          })
        }
    })
  })

  function sendEmail(mail) {
    socket.emit('checkAdmin', {mail}, (callback) => {
        console.log("Success");
    })
  }

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Admin Join</h1>
        <div className="googleButton">
          <GoogleLogin
            clientId="643033007551-n9v1ehq8aime1mtbndq6b8jn1sjqjttl.apps.googleusercontent.com"
            buttonText="Sign in with Google"
            onSuccess={(response) => {console.log(response);
              console.log(response.profileObj);
              sendEmail(response.profileObj.email);
            }}
            onFailure={(response) => {console.log(response);
              console.log(response.profileObj);}}
            cookiePolicy={'single_host_origin'}
          
          />
        </div>
      </div>
    </div>
  );
}
