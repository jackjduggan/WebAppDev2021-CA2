'use strict';

// import all required modules
const logger = require('../utils/logger');
const collectionStore = require('../models/collection-store.js');
const accounts = require ('./accounts.js');

// create start object
const start = {

  // index method - responsible for creating and rendering the view
  index(request, response) {

    const loggedInUser = accounts.getCurrentUser(request);
    
    if (loggedInUser) {
      
      // display confirmation message in log
      logger.info('start rendering');

      //app stats calculations
      const collections = collectionStore.getAllCollections();

      let numCollections = collections.length;
      let numGames = 0;

      for (let i in collections) {
        numGames = numGames + collections[i].games.length;
      }

      // create view data object (contains data to be sent to the view e.g. page title)
      const viewData = {
        title: 'Welcome to your video games collection!',
        totalCollections: numCollections,
        totalGames: numGames,
        fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
      };

      // render the start view and pass through the data
      response.render('start', viewData);
    }
    else response.redirect('/');
  },
};

// export the start module
module.exports = start;