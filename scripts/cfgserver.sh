#!/bin/sh

# install deps
	echo "$(date) - Installing M-Con dependencies"
		apt-get update
		apt-get install build-dep make libc-dev gcc g++ build-essential curl nginx python

		echo 'export PATH=$HOME/local/bin:$PATH' >> ~/.bashrc
		. ~/.bashrc
		mkdir ~/local
		mkdir ~/node-latest-install
		cd ~/node-latest-install
		curl http://nodejs.org/dist/node-latest.tar.gz | tar xz --strip-components=1
		./configure --prefix=~/local
		make install
		curl https://npmjs.org/install.sh | sh
		
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
