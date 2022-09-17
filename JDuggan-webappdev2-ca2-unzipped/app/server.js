// use javascript in strict mode
'use strict';

// import all required modules
const express = require('express');
const logger = require('./utils/logger');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser'); //imports cookie-parser
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload'); //imports fileUpload

// initialise project
const app = express();

// static files output to public folder
app.use(express.static('public'));

// use body parser and cookie parser
app.use(bodyParser.urlencoded({ extended: false, }));
app.use(cookieParser());
// use fileUpload
app.use(fileUpload());

// use handlebars as view engine
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
    //helpers go here
    uppercase: function(inputString) {
        return inputString.toUpperCase();
      },
    formatDate: function(date) {
      let dateCreated = new Date(date);
        let dateNum = dateCreated.getDate();
        let month = dateCreated.getMonth();
        let year = dateCreated.getFullYear();

        let months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ];
        let monthname = months[month];
        return `${monthname} ${dateNum}, ${year}`;
    },
    
  }
}));
app.set('view engine', '.hbs');

// import routes file and use this for routing
const routes = require('./routes');
app.use('/', routes);

// listen for requests :)
const listener = app.listen(process.env.PORT || 4000, function () {
  logger.info(`glitch app started on port ${listener.address().port}`);
});