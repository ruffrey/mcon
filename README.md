# M-Con Mission Control console for Node.js Apps running with Forever.js

A web console for managing your Node.js apps on a VPS server.

Minimal work is needed to get up and running. 

The goal is to create a Node cloud hosting experience similar to cloud services like AppFog or Nodejitsu, but with your cheap VPS box.

Adding a new app should be **isanely easy**. Like this:
1. Logging into a web UI with SSO.
1. Using a GUI to create a new Forever Node process from a git repository.

With support for:
- Generating an SSH key on the server.
- Creating a cron task to reboot all Forever processes if the server reboots.
- Running multiple Node.js apps behind Nginx.

![Login Page](http://f.cl.ly/items/0g2f2u2C3M1W2Q1J2s2i/LoginScreen.png)

![Forever Console](http://f.cl.ly/items/2d3F121B261d0H1z0t1N/ForeverConsole.png)

## Usage

Start NodeJS processes with forever cli and manage them via a web interface.

## Installation on a VPS server

``` bash
    # as root!!
    git clone https://github.com/ruffrey/mcon.git
```

At this point you may want to edit the `config.js` file and set your configurations.

Then edit `users.json` and add google accounts that should be allowed to authenticate.

``` bash
    cd mcon
    npm install
    cd scripts
    sh cfgserver.sh
```

## Security and Authentication

Auth is provided by Passport.js, the Google Strategy only. Users are listed in `users.json`.


## Credits

Forked from [Forever Web UI by Francois-Guillaume Ribreau](https://github.com/FGRibreau/forever-webui.git).


## License
MIT
