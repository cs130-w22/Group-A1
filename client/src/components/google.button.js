//reference: https://github.com/codegeous/sociallogin
import React from 'react';
import GoogleButton from 'react-google-button';
class GLogin extends React.Component{
    constructor(props) {
        super(props)
    }
    
    componentDidMount(){
        (function() {
            var event = document.createElement("script");
            event.type = "text/javascript";
            event.async = true;
            event.src = "https://apis.google.com/js/client:platform.js?onload=gPOnLoad";
            var t = document.getElementsByTagName("script")[0];
            t.parentNode.insertBefore(event, t)
        })();    
    }
    
    //Triggering login for google
    googleLogin = () => {
        let response = null;
        window.gapi.auth.signIn({
            callback: function(authResponse) {
                this.googleSignInCallback( authResponse )
            }.bind( this ),
            clientid: "242107991189-l18ernob8ed0ndfdcjm6g2g43k742gfp.apps.googleusercontent.com", //Google client Id
            cookiepolicy: "single_host_origin",
            //requestvisibleactions: "http://schema.org/AddAction",
            scope: "https://www.googleapis.com/auth/plus.login email"
        });
    }
    
    googleSignInCallback = (event) => {
        console.log( event )
        if (event["status"]["signed_in"]) {
            window.gapi.client.load("plus", "v1", function() {
                if (event["access_token"]) {
                    this.getUserGoogleProfile( event["access_token"] )
                } else if (event["error"]) {
                    console.log('Import error', 'Error occured while importing data')
                }
            }.bind(this));
        } else {
            console.log('Oops... Error occured while importing data')
        }
    }

    getUserGoogleProfile = accesstoken => {
        var event = window.gapi.client.plus.people.get({
            userId: "me"
        });
        event.execute(function(event) {
            if (event.error) {
                console.log(event.message);
                console.log('Import error - Error occured while importing data')
                return
            
            } else if (event.id) {
                //Profile data
                alert("Successfull login from google : "+ event.displayName )
                console.log( event );
                return;
            }
        }.bind(this));
    }
    
    render(){
        return(
            <GoogleButton type ='dark' style={{borderRadius:"14px"}}
            alt="google" onClick={ () => this.googleLogin() }/>
        )
    }
}

export default GLogin;