namespace WebSharper.Samples.PouchDB

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.JQuery
open IntelliFactory.WebSharper.Html
open IntelliFactory.WebSharper.PouchDB

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

