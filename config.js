// dev settings
var settings = {
	
  	port: process.env.MCON_PORT || 8085,

	appname: 'M-Con',
	tagline: 'Node.js Forever Administration',

	domain: "localhost",

  	google: {
		returnURL: 'http://localhost:8085/login/return',
		realm: 'http://localhost:8085/'
	},

	appdir: __dirname + "/",
	secret: "aCaan323Iazksl073nYnazz",

	HEADER: {
		'Content-Type': 'text/javascript'
	}
};

// prod settings
if(process.env.NODE_ENV=="prod")
{
	settings.domain = "server1.sylog.net";

	settings.google = {
		returnURL: 'http://server1.sylog.net/login/return',
		realm: 'http://server1.sylog.net/'
	};

	settings.appdir = "/root/";
}

exports = module.exports = settings;