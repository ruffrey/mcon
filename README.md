# M-Con Mission Control console for Node.js Apps running with Forever.js

A web console for managing your Node.js apps on a VPS server.

## Goals

It should take very minimal work is needed to get Node.js apps up and running.

The goal is to create a Node cloud hosting experience similar to cloud services like AppFog or Nodejitsu, but with your cheap VPS box.

Adding a new app should be **isanely easy**. Like this:

1. Logging into a web UI with SSO.
1. Using a GUI to create a new Forever Node process from a git repository.

With support for:

- Generating an SSH key on the server.
- Creating a cron task to reboot all Forever processes if the server reboots.
- Running multiple Node.js apps behind Nginx.


## Usage

Start NodeJS processes with forever cli and manage them via a web interface.

## Installation on Ubuntu 12.04 VPS server

This will install the app in `/root/`. It is recommended to keep configurations for app directories in `config.js` the same, which will all later apps in `/root/`. If you don't like it, write your own - sorry.

``` bash

    # Make sure you are logged in as root!!
    cd /root
    apt-get update
    apt-get install git curl nano wget
    git clone https://github.com/ruffrey/mcon.git

```


At this point you may want to edit the `config.js` file and set your configurations, including where the web UI will listen.

Then edit `users.json` and add google accounts that should be allowed to authenticate.

**Keeping MongoDB alive** - there's a line in `scripts/start.sh` you can uncomment.

``` bash

    cd /root/mcon/scripts
    sh cfgserver.sh

```

The server will configure itself. IF it is successful, reboot. When it comes back up, the web UI will be available at the domain you set.


## Troubleshooting

Check `cron.log` which will be created in the `config.js` `{appdir: "/somewhere/" }` that you set.


## Security and Authentication

Auth is provided by Passport.js, the Google Strategy only. Users are listed in `users.json`.


## Credits

Forked from [Forever Web UI by Francois-Guillaume Ribreau](https://github.com/FGRibreau/forever-webui.git).


## License

MIT
