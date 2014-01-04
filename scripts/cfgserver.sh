#!/bin/sh

# install deps
	echo "$(date) - Installing M-Con dependencies"
		apt-get install curl nginx python-software-properties g++-4.6 g++ python make nodejs-dev nodejs npm
		
	echo "$(date) - Installing Forever"
		npm install forever -g

# Putting startup script in place
echo "$(date) - Copying startup script"
	cp /root/mcon/scripts/forever-start.sh /root

# CRON job
echo "$(date) - Creating cron job"
	cp /root/mcon/scripts/forever-cron.sh /etc/cron.d/forever-cron

# finish message
echo "$(date) - Server has finished configuring."

# reboot server
echo "$(date) - Rebooting"
	sleep 3

reboot
