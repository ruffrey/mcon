#!/bin/sh

# install deps
	echo "$(date) - Installing mailapp dependencies"
		apt-get install curl nginx python-software-properties g++ python make nodejs npm
		
	echo "$(date) - Installing Forever"
		npm install forever -g

# Putting startup script in place
echo "$(date) - Copying startup script"
	cp /root/forever-webui/scripts/forever-start.sh /root

# CRON job
echo "$(date) - Creating cron job"
	cp /root/forever-webui/forever-cron.sh /etc/cron.d/forever-cron

# finish message
echo "$(date) - Server has finished configuring."

# boot app
echo "$(date) - Rebooting in 5"
	sleep 1
echo "$(date) - Rebooting in 4"
	sleep 1
echo "$(date) - Rebooting in 3"
	sleep 1
echo "$(date) - Rebooting in 2"
	sleep 1
echo "$(date) - Rebooting in 1"
	sleep 1

reboot
