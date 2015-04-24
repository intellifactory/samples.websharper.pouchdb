namespace WebSharper.Samples.PouchDB

open WebSharper

[<AutoOpen>]
module Resources =
    type BootstrapCss() =
        inherit Resources.BaseResource("https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css")

    type BootstrapTheme() =
        inherit Resources.BaseResource("https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css")

    type BootstrapJs() =
        inherit Resources.BaseResource("https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js")

    type PrettifyerCss() =
        inherit Resources.BaseResource("google-code-prettify/prettify.css")

    type Prettifyer() =
        inherit Resources.BaseResource("google-code-prettify/prettify.js")

    type ScalaPrettifyer() =
        inherit Resources.BaseResource("google-code-prettify/lang-scala.js")

    type HaskellPrettifyer() =
        inherit Resources.BaseResource("google-code-prettify/lang-hs.js")

    type MLPrettifyer() =
        inherit Resources.BaseResource("google-code-prettify/lang-ml.js")