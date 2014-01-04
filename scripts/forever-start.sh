#!/bin/sh

#service mongodb start

if [ $(ps aux | grep $USER | grep node | grep -v grep | wc -l | tr -s "\n") -eq 0 ]
then

    export NODE_ENV=prod

    echo "$(date) Forever not running, will try to start the app."

    /usr/local/nvm/nvm_bin.sh use 0.10
    node /usr/local/bin/forever start /root/mcon/app.js

    cd /root/processes
    list=`ls *.sh`
	for script in $list
	do
		./$script
	done
    

else
    echo "$(date) Node or Forever is running, no need to start."
fi
