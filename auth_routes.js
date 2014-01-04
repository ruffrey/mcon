var passport = require('passport');


function ensureAuthenticated(req, res, next) {

	if (req.isAuthenticated()) return next();
	
	res.render('login.ejs');

}

exports = module.exports = function(app) {

	app.get('/', ensureAuthenticated, function(req, res) {
		return res.redirect('/console');
	});

	// app.post('/login', passport.authenticate('local', {
	//       successRedirect: '/console',
	//       failureRedirect: '/' }));



	// Redirect the user to Google for authentication.  When complete, Google
	// will redirect the user back to the application at
	//     /auth/google/return
	app.get('/login', passport.authenticate('google') );

	// Google will redirect the user to this URL after authentication.  Finish
	// the process by verifying the assertion.  If valid, the user will be
	// logged in.  Otherwise, authentication has failed.
	app.get('/login/return', 
		passport.authenticate('google', { successRedirect: '/console', failureRedirect: '/' } ) 
	);


	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	app.get('*', ensureAuthenticated);


};