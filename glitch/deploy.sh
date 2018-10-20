#!/bin/sh
cd ..
PACKAGE=https://www.dropbox.com/s/eupfmm2a8nhd4gh/athena.zip?dl=1
wget -O athena.zip $PACKAGE
unzip -o athena.zip -d .
rm -f athena.zip
refresh