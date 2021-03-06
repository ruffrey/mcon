#!/bin/sh

cd /root


echo "$(date) - Installing Node using NVM"
	wget -qO- https://raw.github.com/xtuple/nvm/master/install.sh | sh
	nvm install 0.10

echo "$(date) - Linking node"
	/usr/local/nvm/nvm_bin.sh use 0.10

    sudo ln -s /usr/local/nvm/nvm_bin.sh /usr/bin/nvm
    sudo ln -s /usr/local/bin/node /usr/bin/node
	sudo ln -s /usr/local/bin/npm /usr/bin/npm


echo "$(date) - Installing NPM packages"
cd /root/mcon && npm install
mkdir /root/processes

echo "$(date) - Installing Nginx"
	apt-get -y install nginx
	
echo "$(date) - Installing Forever"
	npm install forever -g
	npm install grunt-cli -g
	cd /root/mcon && grunt

# Putting startup script in place
echo "$(date) - Copying startup script"
	cp /root/mcon/scripts/forever-start.sh /root

# CRON job
echo "$(date) - Creating cron job"
	cp /root/mcon/scripts/forever-cron.sh /etc/cron.d/forever-cron

echo "$(date) - Generating ssh key"
cd /root/mcon/scripts
sh cfgssh.sh
cd /root

# finish message
echo "$(date) - Server has finished configuring."
echo "If configuration was successful, you can reboot to start everything."
