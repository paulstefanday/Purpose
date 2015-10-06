var config = require(__base+'/config/config'),
	  M = require(__base+'/models/'),
	  thinky = require(__base+'/config/thinky.js'),
	  r = thinky.r;

/**
 * @api {get} /v1/activity Create
 * @apiName Create
 * @apiGroup Activity
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} id ID of user
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     { id: 'asdadasdsdadasdad' }
 *
 */

module.exports.create = function *() {

 	var body = this.request.body, record;

  body.user_id = this.user.id;
 	record = new M.Job(body);

 	this.body = yield record.save();
 	this.status = 200;

}

module.exports.image = function *() {

  var self = this,
      thunkify = require('thunkify-wrap'),
      formidable = require('koa-formidable'),
      form = yield formidable.parse(this),
      s3 = require('s3'),
      client = s3.createClient({
        s3Options: { accessKeyId: process.env.S3_KEY, secretAccessKey: process.env.S3_SECRET }
      }),
      params = { localFile: form.files.file.path, s3Params: { Bucket: config.bucket, Key: form.files.file.name } },
      uploader = client.uploadFile(params),
      upload = thunkify.event(uploader, 'end');

  yield upload();

  self.body = { url: 'https://s3-ap-southeast-2.amazonaws.com/' + config.bucket + '/' + form.files.file.name }

}

module.exports.findOne = function *() {

  var result = yield M.Job.get(this.params.job);

  if(!result) this.throw("Job does not exist", 404)

  this.body = result;
  this.status = 200;
}

module.exports.find = function *() {

  var result = yield M.User.get(this.user.id).getJoin({ jobs: true }).run();

  this.body = result.jobs || [];
  this.status = 200;
}

module.exports.search = function *() {

  var query = this.request.body.query || {},
      page = parseInt(this.request.body.page) || 0,
      limit = parseInt(this.request.body.limit) || 0;

  var result = M.Job.filter(query).orderBy(r.desc('createdAt')).skip(page * limit)
  if(limit) result.limit(limit)

  this.body = yield result;
  this.status = 200;
}

module.exports.update = function *() {
  var result = yield M.Job.get(this.params.job).update(this.request.body);

  this.body = result;
  this.status = 200
}

module.exports.delete = function *() {
  var result = yield M.Job.get(this.params.job).delete();

  this.body = {id: this.params.job};
  this.status = 200
}

