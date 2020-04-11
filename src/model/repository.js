const { uuid } = require("uuidv4");

/**
 * Repository
 *
 * @param   {Object}    data        Repository data
 * @param   {String}    data.title
 * @param   {String}    data.url
 * @param   {String[]}  data.techs
 * @param   {Number}    data.likes
 *
 * @return  {Repository}
 */
function Repository(data) {
  this.id = uuid();
  this.title = data.title;
  this.url = data.url;
  this.techs = data.techs;
  this.likes = data.likes || 0;
}

/**
 * Add a like to the repository
 */
Repository.prototype.like = function () {
  this.likes++;
};

/**
 * Repository collection
 *
 * @param   {Repository[]}  data  Repositories list
 *
 * @return  {Repositories}
 */
function Repositories(data) {
  data = data.map((item) => {
    return [item.id, item];
  });

  this.data = new Map(data);
}

/**
 * Entity name
 */
Repositories.prototype.entity = "Repository";

/**
 * Checks if the entity UUID exists
 *
 * @param   {Repositories}  collection
 * @param   {string}        id
 * @param   {boolean}       strict
 *
 * @throws Will throw an error if entity not found in strict mode
 */
function strictCheck(collection, id, strict) {
  if (strict && !collection.has(id)) {
    throw new Error(`Cannot find ${collection.entity} with id ${id}`);
  }
}

/**
 * Find all
 *
 * @return  {Repository[]}
 */
Repositories.prototype.findAll = function () {
  return Array.from(this.data.values());
};

/**
 * Search for some item with the id
 *
 * @param   {string}  id      UUID string
 *
 * @return  {boolean}
 */
Repositories.prototype.has = function (id) {
  return this.data.has(id);
};

/**
 * Returns the entity if found
 *
 * @param   {string}  id      UUID string
 * @param   {boolean}    strict  Do a strict check on the Id
 *
 * @return  {Repository}
 * @throws Will throw an error if entity not found in strict mode
 */
Repositories.prototype.get = function (id, strict) {
  strictCheck(this, id, strict);

  return this.data.get(id);
};

/**
 * Saves the entity
 *
 * @param   {Repository}  item
 * @param   {boolean}        strict  Do a strict check on the Id
 *
 * @return  {Repository}
 * @throws Will throw an error if entity not found in strict mode
 */
Repositories.prototype.save = function (item, strict) {
  const oldItem = this.get(item.id, strict);
  if (oldItem) {
    item = Object.assign(oldItem, item);
  }

  this.data.set(item.id, item);

  return item;
};

/**
 * Deletes the entity if found
 *
 * @param   {string}  id
 * @param   {boolean}    strict  Do a strict check on the Id
 *
 * @return  {Repository}
 * @throws Will throw an error if entity not found in strict mode
 */
Repositories.prototype.delete = function (id, strict) {
  strictCheck(this, id, strict);

  return this.data.delete(id);
};

exports.Repository = Repository;
exports.Repositories = Repositories;
