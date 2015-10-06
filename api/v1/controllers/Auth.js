var   jwt = require('jsonwebtoken'),
      bcrypt = require('co-bcryptjs'),
      config = require(__base+'/config/config'),
      M = require(__base+'/models'),
      H = require(__base+'/config/helpers'),
      Purest = require('purest'),
      randomstring = require('randomstring'),
      secret = config.secret,
      thinky = require(__base+'/config/thinky.js'),
      request = require('koa-request'),
      r = thinky.r;

module.exports.facebook = function *(next) {

  var accessTokenUrl = 'https://graph.facebook.com/v2.4/oauth/access_token',
      graphApiUrl = 'https://graph.facebook.com/v2.4/me?fields=id,name,email',
      params = {
        code: this.request.body.code,
        client_id: this.request.body.clientId,
        client_secret: config.facebook.secret,
        redirect_uri: this.request.body.redirectUri
      }, token, user, exists, res;

  token = yield request.get({ url: accessTokenUrl, qs: params, json: true }); // get token
  user = yield request.get({ url: graphApiUrl, qs: token.body, json: true }); // get user data

  exists = yield H.userExists(user.body.email); // check if user exists
  if(!exists) exists = yield H.userCreate(user.body, 'facebook'); // create user

  // TODO: get profile pic

  this.body = { token: jwt.sign({ id: exists.id, name: exists.name, email: exists.email }, secret)  };
  this.status = 200;

}

/**
 * @api {post} /v1/signup/ Signup
 * @apiName Signup
 * @apiGroup Auth
 * @apiVersion 1.0.0
 *
 * @apiParam {String} email Users unique email.
 * @apiParam {String} password Users password.
 *
 * @apiSuccess {String} token Token for authentication purposes.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImU2YWZmZWNmLTcwNzUtNDIzNi04OGZkLTI1NzA5OWU2ZTcyZCIsImlhdCI6MTQzMjM1OTc1OH0.M7CHKDiP4kyWi0-ek0qukE1xRB9x7OExAMwX_Le1ZZY"
 *     }
 *
 */

module.exports.signup = function *() {

  var body = this.request.body, id, user;

  // Make sure password is entered
  if(!body.password) this.throw(403, 'You must fill out all fields to signup.');

  // check for existing user
  id = yield H.userExists(body.email);
  if(id) this.throw(400, 'You have already signed up.');

  // Create user
  user = yield H.userCreate(body);

  this.body = { token: jwt.sign({ id: user.id, email: user.email }, secret)  };
  this.status = 200;

};

/**
 * @api {post} /v1/login/ Login
 * @apiName Login
 * @apiGroup Auth
 * @apiVersion 1.0.0
 *
 * @apiParam {String} email Users unique email.
 * @apiParam {String} password Users password.
 *
 * @apiSuccess {String} token Token for authentication purposes.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImU2YWZmZWNmLTcwNzUtNDIzNi04OGZkLTI1NzA5OWU2ZTcyZCIsImlhdCI6MTQzMjM1OTc1OH0.M7CHKDiP4kyWi0-ek0qukE1xRB9x7OExAMwX_Le1ZZY"
 *     }
 */

module.exports.login = function *() {

  var body = this.request.body, user, compare;
  user = yield M.User.filter({email: body.email}).run();

  // Error is user doesn't exist
  if(user.length < 1) this.throw(404, "If you don't have an account, Please sign up.");

  // Error is password is incorrect
  compare = yield bcrypt.compare(body.password, user[0].password);
  if (!compare) this.throw(401, "Incorrect details.");

  this.body = { token: jwt.sign({id: user[0].id, email: user[0].email, name: user[0].first_name }, secret)  };
  this.status = 200;

};


/**
 * @api {post} /v1/reset/ Reset
 * @apiName Reset
 * @apiGroup Auth
 * @apiVersion 1.0.0
 *
 * @apiParam {String} email Users unique email.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Password has been reset"
 *     }
 */

 module.exports.reset = function *() {

  var body = this.request.body, email, id, realPassword, salt, password, record;

  email = body.email;

  // Check if email was passed as param
  if(!email) this.throw(403, 'The email field is required');

  // check for existing user
  id = yield H.userExists(email);
  if(!id) this.throw(404, 'This account does not exist. Please sign up.');

  // Generate password
  realPassword = randomstring.generate(7);

  // encrypt pass - concider putting in model pre function
  salt = yield bcrypt.genSalt(10);
  password = yield bcrypt.hash(realPassword, salt);

  // Update record
  record = yield r.db(config.db.db).table(M.User.getTableName()).filter({email: email }).update({ password: password });

  // Send password email with realPassword

  this.body = {message: 'Password has been reset'};
  this.status = 200;

 }
