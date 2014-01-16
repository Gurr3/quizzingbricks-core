#!/usr/bin/env bash

# README
# ======
#
# Setup environment
# -----------------
# System
# ~~~~~~
# ZeroMQ
# Protocol Buffers
# Docker
# 
# Python
# ~~~~~~
# python-pip
# 
# 
# JVM/Scala
# ~~~~~~~~~
# Java(VM) 1.7
# Scala
# sbt

# System
# ======

# Following guide: http://docs.docker.io/en/latest/installation/ubuntulinux/#ubuntu-precise

# install the backported kernel
sudo apt-get update
#sudo apt-get install linux-image-generic-lts-raring linux-headers-generic-lts-raring

sudo apt-get install -y curl

# Add the Docker repository key to your local keychain
# using apt-key finger you can check the fingerprint matches 36A1 D786 9245 C895 0F96 6E92 D857 6A8B A88D 21E9
#sudo sh -c "curl https://get.docker.io/gpg | apt-key add -"

# Add the Docker repository to your apt sources list.
#sudo sh -c "echo deb http://get.docker.io/ubuntu docker main > /etc/apt/sources.list.d/docker.list"

# Update your sources
#sudo apt-get update

# Install, you will see another warning that the package cannot be authenticated. Confirm install.
#sudo apt-get install -y lxc-docker

# build tools etc
sudo apt-get update # TODO: remove this
sudo apt-get install -y libtool autoconf automake uuid-dev build-essential g++ make

# required by bcrypt that require cffi
sudo apt-get install -y python-dev libffi-dev

# protocol buffers (compiler)
wget https://protobuf.googlecode.com/files/protobuf-2.5.0.tar.gz
tar xzvf protobuf-2.5.0.tar.gz
cd protobuf-2.5.0
./configure
make
sudo make install
sudo ldconfig

# reset
cd ~

# libevent (for gevent)
sudo apt-get install -y libevent-dev

# zeromq (scala bindings only supports 2.x, 3.2.x is the latest...)
wget http://download.zeromq.org/zeromq-2.2.0.tar.gz
tar xzvf zeromq-2.2.0.tar.gz && cd zeromq-2.2.0
./configure
sudo make && sudo make install

# reset
cd ~

# postgres bindings
sudo apt-get install -y libpq-dev

# JVM/Scala
# =========

# install jdk (v7)
sudo apt-get install -y openjdk-7-jdk

# install scala and friends
wget http://www.scala-lang.org/files/archive/scala-2.10.2.tgz
tar xzvf scala-2.10.2.tgz
sudo mv scala-2.10.2 /usr/share/scala
sudo ln -s /usr/share/scala/bin/scala /usr/bin/scala
sudo ln -s /usr/share/scala/bin/scalac /usr/bin/scalac
sudo ln -s /usr/share/scala/bin/fsc /usr/bin/fsc
sudo ln -s /usr/share/scala/bin/scaladoc /usr/bin/scaladoc
sudo ln -s /usr/share/scala/bin/scalap /usr/bin/scalap

# reset
cd ~

# sbt
wget http://repo.scala-sbt.org/scalasbt/sbt-native-packages/org/scala-sbt/sbt/0.13.0/sbt.deb
sudo dpkg -i sbt.deb
sudo apt-get update
sudo apt-get install -y sbt

# Python
sudo apt-get install -y python-pip
wget https://raw.github.com/pypa/pip/master/contrib/get-pip.py
sudo python get-pip.py

#sudo apt-get install -y python-dev

cd ~

# sudo docker run -d -p 5432:5432 -e POSTGRESQL_USER=qb -e POSTGRESQL_PASS=qb123 orchardup/postgresql



#https://www.digitalocean.com/community/articles/how-to-install-and-use-postgresql-on-ubuntu-12-04

sudo apt-get install -y postgresql postgresql-contrib

sudo -u postgres psql -c "CREATE USER qb WITH SUPERUSER;"
sudo -u postgres psql -c "ALTER USER qb WITH PASSWORD 'qb123';"
sudo -u postgres psql -c "CREATE DATABASE quizzingbricks_dev;"

#sudo -u postgres /usr/lib/postgresql/9.1/bin/postgres --single --config-file=/etc/postgresql/9.1/main/postgresql.conf <<< "CREATE USER qb WITH SUPERUSER;"
#sudo -u postgres /usr/lib/postgresql/9.1/bin/postgres --single --config-file=/etc/postgresql/9.1/main/postgresql.conf <<< "ALTER USER qb WITH PASSWORD 'qb123';"

# setup some files for docker
cd ~