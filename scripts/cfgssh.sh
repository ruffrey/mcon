#!/bin/sh

mkdir /root/.ssh
cd /root/.ssh
ssh-keygen -f .ssh/id_rsa -N ''
ssh-agent /bin/bash
ssh-add id_rsa
cat id_rsa.pub
