'use strict';

const _ = require('lodash');
const JsonStore = require('./json-store');

//Cloudinary
const cloudinary = require('cloudinary');
const logger = require('../utils/logger');

try {
  const env = require('../.data/.env.json');
  cloudinary.config(env.cloudinary);
}
catch(e) {
  logger.info('You must provide a Cloudinary credentials file - see README.md');
  process.exit(1);
}

const collectionStore = {

  // import the video game collection object
  store: new JsonStore('./models/collection-store.json', { videoGameCollection: [] }),
  collection: 'videoGameCollection',

  getAllCollections() {
    return this.store.findAll(this.collection);
  },

  getCollection(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  addCollection(collection, response) {
    collection.picture.mv('tempimage', err => {
        if (!err) {
          cloudinary.uploader.upload('tempimage', result => {
            console.log(result);
            collection.picture = result.url;
            response();
          });
        }
      });
    this.store.add(this.collection, collection);
  },

  removeCollection(id) {
    const collection = this.getCollection(id);
    this.store.remove(this.collection, collection);
  },

  removeAllCollections() {
    this.store.removeAll(this.collection);
  },

  addGame(id, game) {
    const collection = this.getCollection(id);
    collection.games.push(game);
  },

  removeGame(id, gameId) {
    const collection = this.getCollection(id);
    const games = collection.games;
    _.remove(games, { id: gameId});
  },
  
  editGame(id, gameId, updatedGame) {
    const collection = this.getCollection(id);
    const games = collection.games;
    const index = games.findIndex(game => game.id === gameId);
    games[index].title = updatedGame.title;
    games[index].developer = updatedGame.developer;
    games[index].release = updatedGame.release;
    games[index].playtime = updatedGame.playtime;
  },
  
  //New Method which will retrieve collection based off specific user id
  getUserCollections(userid) {
    return this.store.findBy(this.collection, { userid: userid });
  }
};

module.exports = collectionStore;