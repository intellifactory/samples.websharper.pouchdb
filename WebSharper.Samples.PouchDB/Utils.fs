namespace WebSharper.Samples.PouchDB

open WebSharper
open WebSharper.JQuery
open WebSharper.Html.Client
open WebSharper.PouchDB
open WebSharper.JavaScript

[<JavaScript; AutoOpen>]
module Utils =
    type Promise<'a> with
        member x.ToAsync() =
            Async.FromContinuations(fun (ok, err, _) ->
                x.Then(ok, err) |> ignore
            )

    let (|*>) (comp : Async<'a>) (fn : 'a -> 'b)  =
        async {
            let! a = comp
            return fn a
        }

    type System.String with
        member x.StripMargin(sep : string) =
            x.Split('\r', '\n')
            |> Array.map (fun l ->
                let n = l.IndexOf(sep)
                if n >= 0 then
                    l.Substring(n + 1)
                else
                    l
            )
            |> String.concat "\n"

    let cnst a _ = a
    let flip f a b = f b a

    let FormControl (name : string) (el : Element) =
        el.AddClass("form-control")
        Div [ Attr.Class "form-group" ] -< [             
            Label [ Attr.For el.Id; Text name ]
            el
        ]

    [<Inline "$jq.modal(\"show\")">]
    let ShowModal (jq : JQuery) = X<unit> 

    [<Inline "$global.prettyPrint()">]
    let PrettyPrint () = X<unit>

