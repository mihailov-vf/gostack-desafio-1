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

exports.Repository = Repository;
