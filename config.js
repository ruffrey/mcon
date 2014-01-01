var settings = {

	google: {
      returnURL: 'http://localhost:8085/login/return',
      realm: 'http://localhost:8085/'
    }
    
};

if(process.env.NODE_ENV=="prod")
{
	settings.google = {
    	returnURL: 'http://server1.sylog.net/login/return',
		realm: 'http://server1.sylog.net/'
    };
}

exports = module.exports = settings;