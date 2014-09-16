namespace WebSharper.Samples.PouchDB

open IntelliFactory.WebSharper
open IntelliFactory.WebSharper.CodeMirror
open IntelliFactory.WebSharper.Html
open IntelliFactory.WebSharper.Piglets

[<JavaScript>]
module Controls =
    let InputOption (stream : Stream<string option>) =
        let container = Div []
        let mapped =
            stream
            |> Stream.Map (Option.fold (fun _ v -> v) "") Some
        let cnt = 
            Controls.Input mapped
            |> FormControl "Language"

        let previous = ref false

        stream.SubscribeImmediate <| function
            | Success None ->
                if !previous then
                    container.Clear()
                    previous := false
            | Success (Some _) ->
                if not !previous then
                    container.Append cnt.Dom
                    previous := true
            | _ -> ()
        |> ignore

        container

    let CodeMirror (stream : Stream<string>) =
        let container = Div []
        let cm = 
            CodeMirror(
                (fun e -> 
                    container 
                    |> OnAfterRender (fun c ->                        
                        c.Append(e)
                    )
                ), Options(LineNumbers = true))

        match stream.Latest with
        | Success s -> cm.SetValue(s)
        | Failure _ -> ()

        stream.Subscribe <| function
            | Success s ->
                if cm.GetValue() <> s then
                    cm.SetValue s
            | Failure _ -> ()
        |> ignore

        cm.OnChange(fun (c, ca) -> c.GetValue() |> Success |> stream.Trigger)

        (container, cm)
     
