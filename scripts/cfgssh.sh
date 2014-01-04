#!/bin/sh

cd /root
ssh-keygen -f .ssh/id_rsa -N ''
cd .ssh
ssh-agent /bin/bash
ssh-add id_rsa
cat id_rsa.pub
