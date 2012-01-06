#!/bin/bash

ORIG_PWD=`pwd`

BASEDIR=`dirname $0`
cd $BASEDIR
BASEDIR=`pwd`

TMP_DIR=$BASEDIR/tmp

VERSION=$1

print_usage_and_quit()
{
	echo $2
	echo "USAGE: $1 <version>"
	exit 1
}

if [ "$VERSION" = "" ]; then
	print_usage_and_quit $0 "Version must be specified"
fi

VERSIONED_DIR="$BASEDIR/prepared/$VERSION"

rm -fR "$VERSIONED_DIR"

echo "Creating directories at $VERSIONED_DIR/..."
mkdir -p "$VERSIONED_DIR"

echo "Copying image and style files..."
cp -R "$BASEDIR/common" "$VERSIONED_DIR/common/"
cp -R "$BASEDIR/openclass" "$VERSIONED_DIR/openclass/"
cd $BASEDIR
chmod 755 "$VERSIONED_DIR/openclass/"*
chmod 755 "$VERSIONED_DIR/common/"*

echo "Removing .less files..."
cd "$VERSIONED_DIR/openclass"
rm -f *".less"
cd "$VERSIONED_DIR/openclass/form"
rm -f *".less"
cd "$VERSIONED_DIR/openclass/layout"
rm -f *".less"

cd "$BASEDIR"
node CSS_compress.js "$VERSIONED_DIR"

echo "Setting version $VERSION in version.txt..."
echo $VERSION > version.txt

cd "$ORIG_PWD"
echo "CSS Build Done."

cd $ORIG_PWD
