namespace WebSharper.Samples.PouchDB

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.JQuery
open IntelliFactory.WebSharper.Html.Client
open IntelliFactory.WebSharper.JavaScript
open IntelliFactory.WebSharper.PouchDB
open IntelliFactory.WebSharper.Piglets
open IntelliFactory.WebSharper.CodeMirror

[<Require(typeof<BootstrapCss>)>]
[<Require(typeof<BootstrapTheme>)>]
[<Require(typeof<BootstrapJs>)>]

[<Require(typeof<Prettifyer>)>]
[<Require(typeof<PrettifyerCss>)>]
[<Require(typeof<ScalaPrettifyer>)>]
[<Require(typeof<HaskellPrettifyer>)>]
[<Require(typeof<MLPrettifyer>)>]

[<Require(typeof<CodeMirror.Resources.Modes.Haskell>)>]
[<Require(typeof<CodeMirror.Resources.Modes.Mllike>)>]
[<Require(typeof<CodeMirror.Resources.Modes.Clike>)>]
[<Require(typeof<CodeMirror.Resources.Modes.Javascript>)>]
[<JavaScript>]
module Client =

    type Language =
        | Haskell
        | Scala
        | FSharp
        | Unsupported of string

    let LangName = function
        | Haskell -> "Haskell"
        | Scala   -> "Scala"
        | FSharp  -> "F#"
        | Unsupported s -> s

    let LangMode = function
        | Haskell -> "text/x-haskell"
        | Scala   -> "text/x-scala"
        | FSharp  -> "text/x-ocaml"
        | Unsupported s -> s.ToLower()

    type Snippet =
        {
            Language : Language
            Code     : string
        }

    let mkSnippet lang code = { Language = lang; Code = code }

    module Defaults =
        let codes =
            [
                Haskell, """
                        |fibs :: [Integer]
                        |fibs = 0 : scanl (+) 1 fibs
                        |
                        |main = print (take 10 fibs)""".StripMargin("|")
                Scala, """
                        |object Main extends App {
                        |    val fibs: Stream[BigInt] = BigInt(0) #:: fibs.scan(BigInt(1))(_ + _)
                        |    fibs take 10 foreach println
                        |}""".StripMargin("|")
                FSharp, """
                        #let fibs =
                        #    let rec helper a b =
                        #        seq {
                        #            yield a;
                        #            yield! helper b (a + b)
                        #        }
                        #    helper 0 1
                        #
                        #fibs
                        #|> Seq.take 10
                        #|> Seq.iter (printfn "%d")""".StripMargin("#")
            ]

        let PopulateDb (db : PouchDB<Snippet>) =
            async {
                let! info = db.Info().ToAsync()
                if info.Doc_count = 0 then
                    return!
                        codes
                        |> List.map (function
                                        | l, c -> db.Put((mkSnippet l c), string <| Date.Now()).ToAsync())
                        |> Async.Parallel
                else
                    return [||]
            }
            |*> ignore

    let Languages s =
        [
            Haskell
            Scala
            FSharp
            Unsupported s
        ]

    let db = new PouchDB<Snippet>("snippetdb")

    let Data = Attr.Data

    let MkPanel (id : string) (parent : string) (title : string) (body : Pagelet) =
        [
            Div [ Attr.Class "panel-heading" ] -< [
                H4 [ Attr.Class "panel-title" ] -< [
                    A [ Data "toggle" "collapse"; Data "parent" parent; Attr.HRef ("#" + id) ] -< [
                        Text title
                    ]
                ]
            ]
            Div [ Attr.Id id; Attr.Class "panel-collapse collapse" ] -< [
                Div [ Attr.Class "panel-body" ] -< [
                    body
                ]
            ]
        ]

    let AccordionId = "accordion"
    let Accordions = Div [ Attr.Id AccordionId; Attr.Class "panel-group" ]

    let SnippetToString (ann : Snippet) (d : Date) =
        LangName ann.Language + " - " + d.ToLocaleString()

    let CodePre (code : string) =
        Pre [ Attr.Class "prettyprint linenums" ] -< [ Text code ]
        |>! OnAfterRender (fun _ -> PrettyPrint ())

    let mutable cm : CodeMirror option = None

    let AdderPiglet = 
        Piglet.Return (flip mkSnippet)
        <*> Piglet.Yield ""
        <*> Piglet.Do {
            let! choice = Piglet.Yield Haskell
            match choice with
            | Unsupported _ ->
                let a =
                    Piglet.Yield (Some "")
                    |> Piglet.Map (fun a -> Unsupported a.Value)
                return! a
            | l ->
                return! Piglet.Yield (None)
                    |> Piglet.Map (cnst l)
        }
        |> Piglet.Run (fun x ->
            cm |> Option.iter (fun c ->
                c.SetOption("mode", LangMode x.Language)
            )
        )
        |> Piglet.WithSubmit
        |> Piglet.Run (fun res ->
            let d = Date.Now()
            db.Put(res, d.ToString())
                .Then(fun _ ->
                    let title = SnippetToString res (Date d)
                    MkPanel (string d) AccordionId title (CodePre res.Code)
                    |> List.rev
                    |> List.iter (fun el -> 
                        JQuery.Of(Accordions.Dom)
                            .Prepend(el.Dom)
                            .Ready(fun () -> (el :> Pagelet).Render())
                            .Ignore)
                    JQuery.Of(".saved-modal") |> ShowModal) |> ignore
        )
        |> Piglet.Render (fun x y submitter ->
            let (textarea, c) = Controls.CodeMirror x
            textarea.Append((Label [ Text "Code" ]).Dom)

            cm <- Some c

            let submit = Controls.Submit submitter
            submit.AddClass("btn btn-primary")

            Div [ Attr.Class "form-horizontal" ] -< [
                y.Chooser (fun stream ->
                    Controls.Select stream
                        (Languages "Other" |> List.map (fun a -> (a, LangName a)))
                    |> FormControl "")

                Div [] |> Controls.RenderChoice y (fun strm ->
                    Controls.InputOption strm)

                textarea
                |>! OnAfterRender (fun _ -> c.SetValue(""))

                submit

                Div [] |> Controls.ShowResult submitter (function
                    | Success res ->
                        []
                    | Failure msgs -> 
                        msgs |> List.map (fun m -> Text m.Message))
            ]
        )

    let RenderSnippets =
        async {
            let! docs =
                db.AllDocs(AllDocsCfg(Include_docs = true, Descending = true)).ToAsync()
            return
                docs.Rows
                |> Array.toList
                |> List.map (fun a -> 
                    let title = SnippetToString a.Doc <| Date(JS.ParseInt(a.Id, 10))
                    MkPanel a.Id AccordionId title (CodePre a.Doc.Code))
                |> List.concat
        }

    let RefreshSnippets (container : Element) =
        RenderSnippets
        |*> List.iter (fun a -> container.Append a)
        |> Async.Start

    let Main =
        async {
            do! Defaults.PopulateDb db
            let container =
                Div [ Attr.Style "margin: 0 auto; width: 50%; min-width: 400px" ] -< [
                    AdderPiglet
                    Accordions
                ]
            RefreshSnippets Accordions

            container.AppendTo("container")
        }
        |> Async.Start
        