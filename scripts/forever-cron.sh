#!/bin/sh

@reboot root sh /root/forever-start.sh >> forever-cron.log 2>&1
