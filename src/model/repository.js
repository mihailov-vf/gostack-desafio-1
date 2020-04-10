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

Repository.prototype.like = function () {
  this.likes++;
};

function Repositories(data) {
  data = data.map((item) => {
    return [item.id, item];
  });

  this.data = new Map(data);
}

Repositories.prototype.entity = "Repository";

Repositories.prototype.findAll = function () {
  return Array.from(this.data.values());
};

Repositories.prototype.get = function (id) {
  return this.data.get(id);
};

Repositories.prototype.save = function (item) {
  if (!item.id) {
    throw new Error(`Cannot save a unidentified ${this.entity}`);
  }

  this.data.set(item.id, item);

  return item;
};

exports.Repository = Repository;
exports.Repositories = Repositories;
