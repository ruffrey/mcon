#!/bin/sh

cd /root

# Put node where it goes
n=$(which node);n=${n%/bin/node}; chmod -R 755 $n/bin/*; sudo cp -r $n/{bin,lib,share} /usr/local

# install deps
	echo "$(date) - Installing M-Con dependencies"
		#apt-get update
		#apt-get install build-dep make libc-dev gcc g++ build-essential curl nginx python
		
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
echo "If configuration was successful, you can reboot to start everything."
