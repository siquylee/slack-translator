#!/bin/sh
APP_DIR=/app
cd $APP_DIR
PACKAGE=https://www.dropbox.com/s/eupfmm2a8nhd4gh/athena.zip?dl=1
wget -O athena.zip $PACKAGE
unzip -o athena.zip -d .
rm -f athena.zip
chmod +x $APP_DIR/glitch/*.sh
refresh