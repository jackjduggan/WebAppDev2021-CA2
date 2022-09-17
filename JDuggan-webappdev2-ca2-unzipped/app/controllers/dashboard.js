'use strict';

// import all required modules
const logger = require('../utils/logger');
const collectionStore = require('../models/collection-store.js');
const uuid = require('uuid');
const accounts = require('./accounts.js'); // imports accounts module

// create dashboard object
const dashboard = {

  // index method - responsible for creating and rendering the view
  index(request, response) {
    logger.info('dashboard rendering');
    
    const loggedInUser = accounts.getCurrentUser(request);
    if (loggedInUser) {

      // create view data object (contains data to be sent to the view e.g. page title)
      const viewData = {
        title: 'Video Game Collection Dashboard',
        collections: collectionStore.getUserCollections(loggedInUser.id),
        fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
      };

      // render the dashboard view and pass through the data
      logger.info('about to render', viewData.collections)
      response.render('dashboard', viewData);
    }
    else response.redirect('/');
  },
  
  deleteCollection(request, response) {
    const collectionId = request.params.id;
    logger.debug(`Deleting Collection ${collectionId}`);
    collectionStore.removeCollection(collectionId);
    response.redirect('/dashboard');
  },
  
  addCollection(request, response) {
    const date = new Date();
    const loggedInUser = accounts.getCurrentUser(request);
    const newCollection = {
      id: uuid(),
      userid: loggedInUser.id,
      title: request.body.title,
      playtime: request.body.playtime,
      picture: request.files.picture,
      date: date,
      games: [],
    };
    logger.debug('Creating a new Collection' + newCollection);
    collectionStore.addCollection(newCollection, function() {
      response.redirect("/dashboard");
    });
  }
};

// export the dashboard module
module.exports = dashboard;