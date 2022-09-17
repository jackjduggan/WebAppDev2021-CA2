'use strict';

const logger = require('../utils/logger');
const collectionStore = require('../models/collection-store.js');
const uuid = require('uuid');
const accounts = require ('./accounts.js');

const collection = {
  index(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);  
    const collectionId = request.params.id;
    logger.debug('Collection id = ' + collectionId);
    if (loggedInUser) {
      const viewData = {
        title: 'Collection',
        collection: collectionStore.getCollection(collectionId),
        fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
      };
      response.render('collection', viewData);
    }
    else response.redirect('/');
  },
  
  deleteGame(request, response) {
    const collectionId = request.params.id;
    const gameId = request.params.gameid;
    logger.debug(`Deleting Game ${gameId} from Collection ${collectionId}`);
    collectionStore.removeGame(collectionId, gameId);
    response.redirect('/collection/' + collectionId);
  },
  
  addGame(request, response) {
    const collectionId = request.params.id;
    const collection = collectionStore.getCollection(collectionId);
    const newGame = {
      id: uuid(),
      title: request.body.title,
      developer: request.body.developer,
      release: request.body.release,
      playtime: request.body.playtime,
    };
    collectionStore.addGame(collectionId, newGame);
    response.redirect('/collection/' + collectionId);
  },
  updateGame(request, response) {
    const collectionId = request.params.id;
    const gameId = request.params.gameid;
    logger.debug("updating song " + gameId);
    const updatedGame = {
      title: request.body.title,
      developer: request.body.developer,
      release: request.body.release,
      playtime: request.body.playtime,
    };
    collectionStore.editGame(collectionId, gameId, updatedGame);
    response.redirect('/collection/' + collectionId);
  }
};

module.exports = collection;

