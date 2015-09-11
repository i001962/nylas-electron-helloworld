// most of this is swiped from
// http://iamemmanouil.com/blog/electron-oauth-with-github/
// https://github.com/ekonstantinidis/gitify
// and https://gist.github.com/paulbbauer/2add0bdf0f4342df48ea
// that's why you will notice the github oAuth references in the code

var remote = window.require('remote');
// var ipc = window.require('ipc');
var BrowserWindow = remote.require('browser-window');
//var apiRequests = require('api-requests');
document.getElementById("myBtn1").addEventListener("click", dooAuth);

function dooAuth() {
  console.log('you clicked oAuth button');
  var querystring = require('querystring');
  var https = require("https");

  // Your GitHub Applications Credentials
  var options = {
    client_id: '<your appid>',
    client_secret: ',your secret>',
    response_type: 'token',
    scope: 'email',
    redirect_uri: './index.html'
//  redirect: 'file://' + __dirname + '/index.html'
  };

  var authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    'node-integration': false
  });
  var githubUrl = 'https://api.nylas.com/oauth/authorize?';
  var authUrl = githubUrl + 'client_id=' + options.client_id + '&response_type=' + options.response_type + '&scope=' + options.scope + '&redirect_uri=' + options.redirect_uri;
  authWindow.loadUrl(authUrl);
  authWindow.show();

  authWindow.webContents.on('did-get-redirect-request', function(event, oldUrl, newUrl) {
    var raw_code = /code=([^&]*)/.exec(newUrl) || null,
      code = (raw_code && raw_code.length > 1) ? raw_code[1] : null,
      error = /\?error=(.+)$/.exec(newUrl);

    if (code || error) {
      // Close the browser if code found or error
      authWindow.close();
    }

    // If there is a code in the callback, proceed to get token from github
    if (code) {
      console.log("code recieved: " + code);

    } else if (error) {
      alert("Oops! Something went wrong and we couldn't log you in using Github. Please try again.");
    }
  });

  // Reset the authWindow on close
  authWindow.on('close', function() {
    authWindow = null;
  }, false);
}
