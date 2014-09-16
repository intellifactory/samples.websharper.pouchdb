# creates build/html
rm -r build -errorAction ignore
$d = mkdir build
$d = mkdir build/html
cp -r WebSharper.Samples.PouchDB/Content build/html/
cp -r WebSharper.Samples.PouchDB/*.css build/html/
cp -r WebSharper.Samples.PouchDB/*.html build/html/
cp -r WebSharper.Samples.PouchDB/*.png build/html/
cp -r WebSharper.Samples.PouchDB/google-code-prettify build/html/
