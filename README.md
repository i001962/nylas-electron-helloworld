# nylas-electron-helloworld
Electron app using nylas to take care of oAuth into common email platforms

1 mkdir yourapp
2 cd yourapp
3 git clone https://github.com/i001962/nylas-electron-helloworld.git
4 cd nylas-electron-helloworld
5 create app in nylas.com get appId and set callback to ./index.html
6 edit script.js   changing client_id: '<your nylas appid>', client_secret: '<your nylas client secret>'
7 electron .

This should open an electron desktop app (tested on mac). When you click the button another window will be opened asking for the email account to connect to nylas. nylas will take care of the oAuth and return token. You'll see the token in the console.log
