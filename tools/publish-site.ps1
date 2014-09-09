# creates build/html
rm -r build -errorAction ignore
$d = mkdir build
$d = mkdir build/html
cp -r samples.websharper.pouchdb/Content build/html/
cp -r samples.websharper.pouchdb/*.css build/html/
cp -r samples.websharper.pouchdb/*.html build/html/
cp -r samples.websharper.pouchdb/*.png build/html/
cp -r samples.websharper.pouchdb/google-code-prettify build/html/
