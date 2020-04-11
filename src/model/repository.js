const { uuid, isUuid } = require("uuidv4");

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

Repositories.prototype.has = function (id, strict) {
  if (strict && !isUuid(id)) {
    throw new Error(`Cannot find ${this.entity} with id ${id}`);
  }

  return this.data.has(id);
};

Repositories.prototype.get = function (id, strict) {
  if (strict) {
    this.has(id, strict);
  }

  return this.data.get(id);
};

Repositories.prototype.save = function (item, strict) {
  const oldItem = this.get(item.id, strict);
  if (oldItem) {
    item = { ...oldItem, ...item };
  }

  this.data.set(item.id, item);

  return item;
};

Repositories.prototype.delete = function (id, strict) {
  if (this.has(id, strict)) {
    this.data.delete(id);
  }
};

exports.Repository = Repository;
exports.Repositories = Repositories;
