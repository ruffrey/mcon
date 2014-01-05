This is alpha software! Feedback welcome.

# M-Con Mission Control
#### console for Node.js Apps

A web based user interface for managing multiple Node.js apps with Forever.js on a VPS server.

## Use Case

It should take minimal work to get Node.js apps up and running on a cheap VPS.

## Goals

**Create a Node hosting experience** similar to services like AppFog or Nodejitsu, but with your so-cheap-it's-practically-free VPS slice.

**Apps should stay up**, after crashes or a reboot.

**Easily add a new app**, like this:

1. Logging into a web UI with SSO.
1. Use a GUI to create a new node process from a git repository.

**Get all this preconfigured**
- Installing Node.js and NPM.
- Generating an SSH key.
- Creating a cron task to reboot all Forever processes if the server reboots.
- Running multiple Node.js apps behind Nginx.


## Installation on an Ubuntu 12.04 VPS server

Use these instructions to install **M-Con** in `/root/` on a freshly installed VPS server running Ubuntu 12.04.

It is recommended to keep configurations for app directories in `config.js` the same, which will all later apps in `/root/`. If you don't like it, please fork and write your app - sorry.

``` bash

    # Make sure you are logged in as root!!
    cd /root
    apt-get -y update
    apt-get -y install git curl nano wget
    git clone https://github.com/ruffrey/mcon.git
```

Edit the `config.js` file and set your configurations, especially the domain.

``` bash

    nano mcon/config.js
```

Then edit `users.json` and add google accounts that should be allowed to authenticate.

**Keeping MongoDB alive** - there's a line in `scripts/start.sh` you can uncomment.

``` bash

    cd /root/mcon/scripts
    sh cfgserver.sh
```

The server will configure itself. 

IF it is successful, reboot. 

When it comes back up, the web UI will be available at the domain you set.

From here you can get the SSH key and add it to your git repository system to allow access. Then start adding Node processes.


## Troubleshooting

Check `/root/forever-cron.log` or run `forever list` then `forever logs <process index>` where process index is the one you want to see logs for. Usually it will be 0. `forever logs 0`


## Security and Authentication

Auth is provided by Passport.js, the Google Strategy only. Users are listed in `users.json`.

## Updating an app

This will be added in the future, I hope.

Right now you'll have to log into the server, then do the following manually:

``` bash
    
    # while logged in as root
    rm -r <source code folder>
    git clone <source code git repository>
    forever restart <process index>
```


## More Info

- Built with Express
- M-Con installs and runs Node 0.10.x. Modify the nvm commands in the following files to change the Node version:
    - `scripts/cfgserver.sh`
    - `scripts/forever-start.sh`

## Credits

Forked from [Forever Web UI by Francois-Guillaume Ribreau](https://github.com/FGRibreau/forever-webui.git).


## License

MIT
