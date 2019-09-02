const express = require('express');
const app = express();     
const mysql = require('mysql');
const config = require('./config');

//looks in views folder by default, in order to change this or nest in a folder you must define the views setting and point express to the right place.
app.set('view engine', 'pug');
      
const connection = mysql.createConnection({
  host     : config.host,
  user     : config.user,
  password : config.pass,
  database : config.database
});
    
connection.connect(function(err) {
  if (err) throw err;
});
      
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
 
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
  
app.use(express.static('public'));

const {getHomePage, getPressPage, getContactPage, postContactPage, getSubPage, postSubPage, subscribe} = require('./routes/index');

app.get('/', getHomePage);
app.get('/press', getPressPage);
app.get('/contact', getContactPage);
app.post('/contact', postContactPage);

app.get('/subscribe', getSubPage);
app.post('/subscribe', postSubPage);

app.post('/', subscribe);
   
app.use('*', function (req, res) {
  res.send('Error 404: Not Found!');
});

app.listen(3000, function () {
  console.log('Server running at Port 3000');
});
