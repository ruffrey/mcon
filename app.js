(function() {



var HEADER, UI, ansiparse, app, async, ejs,
express, forever, foreverUI, fs, _, pkg, spawn,
passport, LocalStrategy, GoogleStrategy, utils, log, users,
config, path, BindAuthRoutes, url;

express = require('express');
async = require('async');
fs = require('fs');
path = require('path');
url = require('url');
forever = require('forever');
_ = require('underscore');
ansiparse = require('ansiparse');
ejs = require('ejs');
pkg = require('./package.json');
utils = require("./utils/utils");
log = require("./utils/logger");
spawn = require('child_process').spawn;
passport = require('passport');
LocalStrategy = require('passport-local').Strategy;
GoogleStrategy = require('passport-google').Strategy;
config = require('./config.js');
BindAuthRoutes = require('./auth_routes.js');
foreverUI = require('./utils/ForeverUI');

users = require('./users.json');

process.on("uncaughtException", function(err) {
	console.log("Caught exception: " + err);
});



console.log('\nStarting ', config.appname);


function NginxConfPath(dmn) {
	return '/etc/nginx/conf.d/' + dmn + '.conf';
}

function ConfigureNginx(domain, subdomain, port, callback) {
	// create the nginx config file for this primary domain if it does not exist
	
	var confFilePath = NginxConfPath(domain);
	var nginxTemplate = fs.readFileSync(__dirname+"/scripts/nginx-template.sh", {encoding: 'utf8'});

	nginxTemplate = nginxTemplate
					.replace('{{DOMAIN}}', 
						subdomain ? subdomain + "." + domain : domain
					)
					.replace('{{PORT}}', port);

	if(!fs.existsSync(confFilePath))
	{
		fs.writeFileSync(confFilePath, '#!/bin/sh\n\n');
	}
	
	fs.appendFileSync(confFilePath, nginxTemplate);

	// restart nginx
	var exec = require('child_process').exec,
  		child;

	child = exec('service nginx restart', function (err, stdout, stderr) {

	  	if (err) console.log('exec error: ' + err);   
		
		callback(err);

	});

}
// configuring nginx for this process if it isnt already there
if(process.env.NODE_ENV=="prod" && !fs.existsSync(NginxConfPath(config.domain)) )
{
	var fullDomain = url.parse(config.domain).hostname;

	var _domain = "", _subdomain = "", splitDomain = config.domain.split('.');

	if(splitDomain.length > 2 )
	{
		_domain = splitDomain[ splitDomain.length - 2 ] + '.' + splitDomain[ splitDomain.length - 1 ];
		splitDomain.slice( splitDomain.length - 2, 2);
		_subdomain = splitDomain.join(".");
	}
	else{
		_domain = config.domain;
	}

	ConfigureNginx(_domain, _subdomain, config.port, function(err) {
		if(err)
		{
			console.log('Error configuring Nginx for', config.appname, err);
		}
		else{
			console.log('Configured Nginx for', config.appname);
		}
	});
}
else{
	console.log('Nginx already configured.');
}

// making sure all necessary directories are made
[
	config.appdir, 
	config.appdir + "processes/"

].forEach(function(dir) {
	if(!fs.existsSync(dir))
	{
		console.log('  Making directory', dir);
		fs.mkdirSync(dir);
	}
	else{
		console.log('  Directory exists:', dir);
	}
});
console.log('Directory check passed.');



HEADER = config.HEADER;

// var users = [
//     { id: 1, username: 'joe', password: 'secret', email: 'joe@console.com' },
//     { id: 2, username: 'bob', password: 'birthday', email: 'bob@console.com' }
// ];

function findById(id, fn) {
	var idx = id - 1;
	if (users[idx]) 
	{
		fn(null, users[idx]);
	} 
	else {
  		fn(new Error('User ' + id + ' does not exist'));
	}
}

function findByUsername(username, fn) {

	for (var i = 0, len = users.length; i < len; i++) {
		var user = users[i];
	  	if (user.username === username) 
	  	{
			return fn(null, user);
	  	}
	}

	return fn(null, null);
}

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	findById(id, function (err, user) {
  		done(err, user);
	});
});

// passport.use(new LocalStrategy(
//   function(username, password, done) {
//     process.nextTick(function () {
//       findByUsername(username, function(err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
//         if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
//         return done(null, user);
//       })
//     });
//   }
// ));

passport.use(
	new GoogleStrategy(
		config.google,

		function(openId, profile, done) {

			findByUsername(profile.emails[0].value, function(err, user) {
		  		if (err) { return done(err); }
		  		if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
		  
		  		return done(null, user);
			})
		}

	)
);

UI = new foreverUI();
this.log = new log.Logger();
exports.forever = forever;
exports.UI = UI;

app = express();

app.configure(function () {
app.engine('html', ejs.renderFile);
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

express.logger.format('customLog', utils.customLog);

	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.methodOverride());
	app.use(express.logger('customLog'));
	app.use(express.session({ secret: config.secret }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);

	app.set('view options', {
		layout: false
	});
});

app.configure("development", function() {
	app.use(express.errorHandler({
	  dumpExceptions: true,
	  showStack: true
	}));
});

app.configure("production prod", function() {
	app.use(express.errorHandler());
});

app.all('*', function(req, res, next) {
	res.locals = res.locals || {};
	res.locals.config = config;
	next();
});

//
// Application Routes and APIs
//

BindAuthRoutes(app);

app.get('/console', function(req, res) {
	return forever.list("", function(err, results) {
	  	return res.render('index.ejs', {
			process: results,
			version: pkg.version
	  	});
	});
});

app.get('/refresh/', function(req, res) {
	return forever.list("", function(err, results) {
		return res.json(results, HEADER, 200);
	});
});

app.get('/processes', function(req, res) {
	return forever.list("", function(err, results) {
  		return res.json(results, HEADER, 200);
	});
});

app.get('/restart/:uid', function(req, res) {
	return UI.restart(req.params.uid, function(err, results) {
	  if (err) {
		return res.send(JSON.stringify({
		  status: 'error',
		  details: err
		}), HEADER, 500);
	  } else {
		return res.send(JSON.stringify({
		  status: 'success',
		  details: results
		}), HEADER, 200);
	  }
	});
});

app.get('/stop/:uid', function(req, res) {
return UI.stop(req.params.uid, function(err, results) {
  if (err) {
	return res.send(JSON.stringify({
	  status: 'error',
	  details: err
	}), HEADER, 500);
  } else {
	return res.send(JSON.stringify({
	  status: 'success',
	  details: results
	}), HEADER, 200);
  }
});
});


app.get('/info/:uid', function(req, res) {
	return UI.info(req.params.uid, function(err, results) {
	  if (err) {
		return res.send(JSON.stringify({
		  status: 'error',
		  details: err
		}), HEADER, 500);
	  } else {
		return res.send(JSON.stringify({
		  status: 'success',
		  details: results
		}), HEADER, 200);
	  }
	});
});


app.post('/addProcess', function(req, res) {

	if(!req.body.repo)
	{
	  return nextSteps();
	}
	
  	var exec = require('child_process').exec,
  		newAppPath = config.appdir + req.body.name,
  		child;

  	// clone the repository then install npm modules
	child = exec('git clone ' + req.body.repo + ' ' + newAppPath,
		function (error, stdout, stderr) {

		  	if (error !== null) 
		  	{   
		  		console.log('exec error: ' + error);   
		  		return res.json({
		  			status: 'error',
					details: error
		  		}, HEADER, 500); 
			} 
			 
			child = exec('cd ' + newAppPath + ' && npm install', function(error, stdout, stderr) {
				if (error !== null) 
			  	{   
			  		console.log('exec error: ' + error);   
			  		return res.json({
			  			status: 'error',
						details: error
			  		}, HEADER, 500); 
				} 
				
				nextSteps(); 

			})

	});


	function nextSteps() {

		// first start the process, then write the sh startup file.
		return UI.start(
			encodeURIComponent(
				req.body.vars + ' ' + config.appdir +' ' + req.body.name + '/' + req.body.args
			), 
			function(err, results) {
			  if (err) 
			  {
				return res.send(JSON.stringify({
				  status: 'error',
				  details: err
				}), HEADER, 500);
			  }


			  // write the new process out to a shell script so it'll get loaded whenever
			  // the server reboots
			  fs.writeFile(
				config.appdir + "processes/" + req.body.name + ".sh", 

				"#!/bin/sh\n"
					+ req.body.vars + " "
					+ "/usr/local/bin/node /usr/local/bin/forever start " 
					+ decodeURIComponent(req.body.args), 

				function(err) {
				  if (err) 
				  {
					return res.send(JSON.stringify({
					  status: 'error',
					  details: err
					}), HEADER, 500);
				  }

				  ConfigureNginx(req.body.domain, req.body.subdomain, req.body.port, function(err) {
				  	
				  	if(err)
				  	{
				  		return res.json({
				  			status: 'error',
							details: err
				  		}, HEADER, 500); 
				  	}
					  	

			  		res.send(JSON.stringify({
						status: 'success',
						details: results
					}), HEADER, 200);

				  });

				}
			  );

			}
		);
	}


});


// app.post('/updateProcess', function(req, res) {



// });

app.get('/ssh', function(req, res) {
	fs.readFile('/Users/jpx/.ssh/id_rsa.pub', 'utf8', function(err, fileText) {
		if(err) 
	  	{
			return res.send(JSON.stringify({
		  		status: 'error',
		  		details: err
			}), HEADER, 500);
	  	}
	  
	  	res.send(JSON.stringify({
			status: 'success',
			details: fileText
	  	}), HEADER, 200);
	});
});


app.post('/ssh', function(req, res) {
	var exec = require('child_process').exec,
	child;

	child = exec(__dirname + "/scripts/cfgssh.sh",
	  function (error, stdout, stderr) {

		if (error !== null) {
		  console.log('exec error: ' + error);
		  return res.send(JSON.stringify({
			  status: 'error',
			  details: error
			}), HEADER, 500);
		}
		
		res.send(stdout);

	});
});



app.listen(config.port);

this.log.info(config.appname, "boot complete.");
this.log.info(config.appname, "listening on port", config.port);




}).call(this);