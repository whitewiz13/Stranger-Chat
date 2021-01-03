//Required Packages
const express = require('express');
const cors = require('cors'); 
const path = require('path');
const sslRedirect  = require('heroku-ssl-redirect').default;

const app = express();
app.use(cors());
app.use(sslRedirect());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Setting port for live project
const port = process.env.PORT || 3001;

//-------Build Code (Server React pages)------
const publicPath  = path.join(__dirname, 'client/build');
app.use(express.static(publicPath));

//-------Get methods---------
app.get('/', function (req, res) {
    res.sendFile(path.join(publicPath, 'index.html'));
});
app.get('/*', function (req, res) {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port,()=>{
    console.log("Server running at port : ",port);
});