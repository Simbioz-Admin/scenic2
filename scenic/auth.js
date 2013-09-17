module.exports = function(app, passport, DigestStrategy, username, pass) {

	// configure Express



	console.log("Thank for the password!");

	var users = [{
		id: 1,
		username: username,
		password: pass
	}];

	function findByUsername(username, fn) {
		for (var i = 0, len = users.length; i < len; i++) {
			var user = users[i];
			if (user.username === username) {
				return fn(null, user);
			}
		}
		return fn(null, null);
	}


	passport.use(new DigestStrategy({
			qop: 'auth'
		},
		function(username, done) {
			// Find the user by username.  If there is no user with the given username
			// set the user to `false` to indicate failure.  Otherwise, return the
			// user and user's password.
			findByUsername(username, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false);
				}
				return done(null, user, user.password);
			})
		},
		function(params, done) {
			// asynchronous validation, for effect...
			process.nextTick(function() {
				// check nonces in params here, if desired
				return done(null, true);
			});
		}
	));
	//http://advosys.ca/papers/web/63-http-digest-authentication.html



	// app.post('/login',
	//   passport.authenticate('local', { successRedirect: '/',
	//                                    failureRedirect: '/login' })
	// );

	// function ensureAuthenticated(req, res, next) {
	//   if (req.isAuthenticated()) { return next(); }
	//   res.redirect('/login')
	// }


	// routing



	// app.get('/login', function(req, res){
	// 	res.sendfile(__dirname + '/login.html');
	// });

	// app.get('/logout', function(req, res){
	//   req.logout();
	//   res.redirect('/');
	// });

	// app.get('/', passport.authenticate('digest', { session: false }), function (req, res){
	//   res.sendfile(__dirname + '/index.html');



};