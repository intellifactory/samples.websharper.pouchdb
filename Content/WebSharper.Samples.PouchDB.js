// $begin{copyright}
//
// This file is part of WebSharper
//
// Copyright (c) 2008-2014 IntelliFactory
//
// Licensed under the Apache License, Version 2.0 (the "License"); you
// may not use this file except in compliance with the License.  You may
// obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied.  See the License for the specific language governing
// permissions and limitations under the License.
//
// $end{copyright}

try {
    Object.defineProperty(Error.prototype, 'message', { enumerable: true });
} catch (e) { }

var IntelliFactory =
{
    Runtime:
    {
        Class:
            function (p, s) {
                function r() { }
                r.prototype = p;
                for (var f in s) { r[f] = s[f]; }
                return r;
            },

        Define:
            function (a, b) {
                var overwrite = !!this.overwrite;
                function define(a, b) {
                    for (var k in b) {
                        var t1 = typeof a[k];
                        var t2 = typeof b[k];
                        if (t1 == "object" && t2 == "object") {
                            define(a[k], b[k]);
                        } else if (t1 == "undefined" || overwrite) {
                            a[k] = b[k];
                        } else {
                            throw new Error("Name conflict: " + k);
                        }
                    }
                }
                define(a, b);
            },

        DeleteEmptyFields:
            function (obj, fields) {
                for (var i = 0; i < fields.length; i++) {
                    var f = fields[i];
                    if (obj[f] === undefined) { delete obj[f]; }
                }
                return obj;
            },

        Field:
            function (f) {
                var value, ready = false;
                return function () {
                    if (!ready) { ready = true; value = f(); }
                    return value;
                }
            },

        GetOptional:
            function (value) {
                return (value === undefined) ? { $: 0 } : { $: 1, $0: value };
            },

        New:		
            function (ctor, fields) {
                var r = new ctor();
                for (var f in fields) {
                    if (!(f in r)) {
                        r[f] = fields[f];
                    }
                }
                return r
            },

        NewObject:
            function (kv) {
                var o = {};
                for (var i = 0; i < kv.length; i++) {
                    o[kv[i][0]] = kv[i][1];
                }
                return o;
            },

        OnInit:
            function (f) {
                if (!("init" in this)) {
                    this.init = [];
                }
                this.init.push(f);
            },

        OnLoad:
            function (f) {
                if (!("load" in this)) {
                    this.load = [];
                }
                this.load.push(f);
            },

        Inherit:
            function (a, b) {
                var p = a.prototype;
                a.prototype = new b();
                for (var f in p) {
                    a.prototype[f] = p[f];
                }
            },

        Safe:
            function (x) {
                if (x === undefined) return {};
                return x;
            },

        SetOptional:
            function (obj, field, value) {
                if (value.$ == 0) {
                    delete obj[field];
                } else {
                    obj[field] = value.$0;
                }
            },

        Start:
            function () {
                function run(c) {
                    for (var i = 0; i < c.length; i++) {
                        c[i]();
                    }
                }
                if ("init" in this) {
                    run(this.init);
                    this.init = [];
                }
                if ("load" in this) {
                    run(this.load);
                    this.load = [];
                }
            },

        Bind:
            function (f, obj) {
                return function () { return f.apply(this, arguments) }
            },

        CreateFuncWithArgs:
            function (f) {
                return function () { return f(Array.prototype.slice.call(arguments)); }
            },

        CreateFuncWithOnlyThis:
            function (f) {
                return function () { return f(this); }
            },

        CreateFuncWithThis:
            function (f) {
                return function () { return f(this).apply(null, arguments); }
            },

        CreateFuncWithThisArgs:
            function (f) {
                return function () { return f(this)(Array.prototype.slice.call(arguments)); }
            },

        CreateFuncWithRest:
            function (length, f) {
                return function () { return f(Array.prototype.slice.call(arguments, 0, length).concat([Array.prototype.slice.call(arguments, length)])); }
            },

        CreateFuncWithArgsRest:
            function (length, f) {
                return function () { return f([Array.prototype.slice.call(arguments, 0, length), Array.prototype.slice.call(arguments, length)]); }
            },

        UnionByType:
            function (types, value, optional) {
                var vt = typeof value;
                for (var i = 0; i < types.length; i++) {
                    var t = types[i];
                    if (typeof t == "number") {
                        if (Array.isArray(value) && (t == 0 || value.length == t)) {
                            return { $: i, $0: value };
                        }
                    } else {
                        if (t == vt) {
                            return { $: i, $0: value };
                        }
                    }
                }
                if (!optional) {
                    throw new Error("Type not expected for creating Choice value.");
                }
            }
    }
};

// Polyfill

if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}
;
var JSON;JSON||(JSON={}),function(){"use strict";function i(n){return n<10?"0"+n:n}function f(n){return o.lastIndex=0,o.test(n)?'"'+n.replace(o,function(n){var t=s[n];return typeof t=="string"?t:"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+n+'"'}function r(i,e){var s,l,h,a,v=n,c,o=e[i];o&&typeof o=="object"&&typeof o.toJSON=="function"&&(o=o.toJSON(i)),typeof t=="function"&&(o=t.call(e,i,o));switch(typeof o){case"string":return f(o);case"number":return isFinite(o)?String(o):"null";case"boolean":case"null":return String(o);case"object":if(!o)return"null";if(n+=u,c=[],Object.prototype.toString.apply(o)==="[object Array]"){for(a=o.length,s=0;s<a;s+=1)c[s]=r(s,o)||"null";return h=c.length===0?"[]":n?"[\n"+n+c.join(",\n"+n)+"\n"+v+"]":"["+c.join(",")+"]",n=v,h}if(t&&typeof t=="object")for(a=t.length,s=0;s<a;s+=1)typeof t[s]=="string"&&(l=t[s],h=r(l,o),h&&c.push(f(l)+(n?": ":":")+h));else for(l in o)Object.prototype.hasOwnProperty.call(o,l)&&(h=r(l,o),h&&c.push(f(l)+(n?": ":":")+h));return h=c.length===0?"{}":n?"{\n"+n+c.join(",\n"+n)+"\n"+v+"}":"{"+c.join(",")+"}",n=v,h}}typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+i(this.getUTCMonth()+1)+"-"+i(this.getUTCDate())+"T"+i(this.getUTCHours())+":"+i(this.getUTCMinutes())+":"+i(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()});var e=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,o=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,n,u,s={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},t;typeof JSON.stringify!="function"&&(JSON.stringify=function(i,f,e){var o;if(n="",u="",typeof e=="number")for(o=0;o<e;o+=1)u+=" ";else typeof e=="string"&&(u=e);if(t=f,f&&typeof f!="function"&&(typeof f!="object"||typeof f.length!="number"))throw new Error("JSON.stringify");return r("",{"":i})}),typeof JSON.parse!="function"&&(JSON.parse=function(n,t){function r(n,i){var f,e,u=n[i];if(u&&typeof u=="object")for(f in u)Object.prototype.hasOwnProperty.call(u,f)&&(e=r(u,f),e!==undefined?u[f]=e:delete u[f]);return t.call(n,i,u)}var i;if(n=String(n),e.lastIndex=0,e.test(n)&&(n=n.replace(e,function(n){return"\\u"+("0000"+n.charCodeAt(0).toString(16)).slice(-4)})),/^[\],:{}\s]*$/.test(n.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return i=eval("("+n+")"),typeof t=="function"?r({"":i},""):i;throw new SyntaxError("JSON.parse");})}();;
(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,AggregateException,Exception,ArgumentException,Number,Arrays,Operators,IndexOutOfRangeException,Array,Seq,Unchecked,Enumerator,Arrays2D,Concurrency,Option,clearTimeout,setTimeout,CancellationTokenSource,Char,Util,Lazy,OperationCanceledException,Date,console,Scheduler,T,Html,Client,Activator,document,jQuery,Json,JSON,JavaScript,JSModule,HtmlContentExtensions,SingleNode,InvalidOperationException,List,T1,MatchFailureException,Math,Strings,PrintfHelpers,Remoting,XhrProvider,AsyncProxy,AjaxRemotingProvider,window,Enumerable,Ref,String,RegExp;
 Runtime.Define(Global,{
  WebSharper:{
   AggregateException:Runtime.Class({},{
    New:function(innerExceptions)
    {
     return Runtime.New(this,AggregateException.New1("One or more errors occurred.",innerExceptions));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   ArgumentException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,ArgumentException.New1("Value does not fall within the expected range."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   Arrays:{
    average:function(arr)
    {
     return Number(Arrays.sum(arr))/Number(arr.length);
    },
    averageBy:function(f,arr)
    {
     return Number(Arrays.sumBy(f,arr))/Number(arr.length);
    },
    blit:function(arr1,start1,arr2,start2,length)
    {
     var i;
     Arrays.checkRange(arr1,start1,length);
     Arrays.checkRange(arr2,start2,length);
     for(i=0;i<=length-1;i++){
      Arrays.set(arr2,start2+i,Arrays.get(arr1,start1+i));
     }
     return;
    },
    checkBounds:function(arr,n)
    {
     return(n<0?true:n>=arr.length)?Operators.FailWith("Index was outside the bounds of the array."):null;
    },
    checkBounds2D:function(arr,n1,n2)
    {
     return(((n1<0?true:n2<0)?true:n1>=arr.length)?true:n2>=(arr.length?arr[0].length:0))?Operators.Raise(IndexOutOfRangeException.New()):null;
    },
    checkLength:function(arr1,arr2)
    {
     return arr1.length!==arr2.length?Operators.FailWith("Arrays differ in length."):null;
    },
    checkRange:function(arr,start,size)
    {
     return((size<0?true:start<0)?true:arr.length<start+size)?Operators.FailWith("Index was outside the bounds of the array."):null;
    },
    choose:function(f,arr)
    {
     var q,i,matchValue,_,x;
     q=[];
     for(i=0;i<=arr.length-1;i++){
      matchValue=f(Arrays.get(arr,i));
      if(matchValue.$==0)
       {
        _=null;
       }
      else
       {
        x=matchValue.$0;
        _=q.push(x);
       }
     }
     return q;
    },
    collect:function(f,x)
    {
     return Array.prototype.concat.apply([],Arrays.map(f,x));
    },
    concat:function(xs)
    {
     return Array.prototype.concat.apply([],Arrays.ofSeq(xs));
    },
    create:function(size,value)
    {
     var r,i;
     r=Array(size);
     for(i=0;i<=size-1;i++){
      Arrays.set(r,i,value);
     }
     return r;
    },
    create2D:function(rows)
    {
     var mapping,source1,x;
     mapping=function(source)
     {
      return Arrays.ofSeq(source);
     };
     source1=Seq.map(mapping,rows);
     x=Arrays.ofSeq(source1);
     x.dims=2;
     return x;
    },
    exists2:function(f,arr1,arr2)
    {
     Arrays.checkLength(arr1,arr2);
     return Seq.exists2(f,arr1,arr2);
    },
    fill:function(arr,start,length,value)
    {
     var i;
     Arrays.checkRange(arr,start,length);
     for(i=start;i<=start+length-1;i++){
      Arrays.set(arr,i,value);
     }
     return;
    },
    filter:function(f,arr)
    {
     var r,i;
     r=[];
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i))?r.push(Arrays.get(arr,i)):null;
     }
     return r;
    },
    find:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryFind(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findINdex:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryFindIndex(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    fold:function(f,zero,arr)
    {
     var acc,i;
     acc=zero;
     for(i=0;i<=arr.length-1;i++){
      acc=(f(acc))(Arrays.get(arr,i));
     }
     return acc;
    },
    fold2:function(f,zero,arr1,arr2)
    {
     var accum,i;
     Arrays.checkLength(arr1,arr2);
     accum=zero;
     for(i=0;i<=arr1.length-1;i++){
      accum=((f(accum))(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return accum;
    },
    foldBack:function(f,arr,zero)
    {
     var acc,len,i;
     acc=zero;
     len=arr.length;
     for(i=1;i<=len;i++){
      acc=(f(Arrays.get(arr,len-i)))(acc);
     }
     return acc;
    },
    foldBack2:function(f,arr1,arr2,zero)
    {
     var len,accum,i;
     Arrays.checkLength(arr1,arr2);
     len=arr1.length;
     accum=zero;
     for(i=1;i<=len;i++){
      accum=((f(Arrays.get(arr1,len-i)))(Arrays.get(arr2,len-i)))(accum);
     }
     return accum;
    },
    forall2:function(f,arr1,arr2)
    {
     Arrays.checkLength(arr1,arr2);
     return Seq.forall2(f,arr1,arr2);
    },
    get:function(arr,n)
    {
     Arrays.checkBounds(arr,n);
     return arr[n];
    },
    get2D:function(arr,n1,n2)
    {
     Arrays.checkBounds2D(arr,n1,n2);
     return arr[n1][n2];
    },
    init:function(size,f)
    {
     var r,i;
     size<0?Operators.FailWith("Negative size given."):null;
     r=Array(size);
     for(i=0;i<=size-1;i++){
      Arrays.set(r,i,f(i));
     }
     return r;
    },
    iter:function(f,arr)
    {
     var i;
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i));
     }
     return;
    },
    iter2:function(f,arr1,arr2)
    {
     var i;
     Arrays.checkLength(arr1,arr2);
     for(i=0;i<=arr1.length-1;i++){
      (f(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return;
    },
    iteri:function(f,arr)
    {
     var i;
     for(i=0;i<=arr.length-1;i++){
      (f(i))(Arrays.get(arr,i));
     }
     return;
    },
    iteri2:function(f,arr1,arr2)
    {
     var i;
     Arrays.checkLength(arr1,arr2);
     for(i=0;i<=arr1.length-1;i++){
      ((f(i))(Arrays.get(arr1,i)))(Arrays.get(arr2,i));
     }
     return;
    },
    length:function(arr)
    {
     var matchValue;
     matchValue=arr.dims;
     return matchValue===2?arr.length*arr.length:arr.length;
    },
    map:function(f,arr)
    {
     var r,i;
     r=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(r,i,f(Arrays.get(arr,i)));
     }
     return r;
    },
    map2:function(f,arr1,arr2)
    {
     var r,i;
     Arrays.checkLength(arr1,arr2);
     r=Array(arr2.length);
     for(i=0;i<=arr2.length-1;i++){
      Arrays.set(r,i,(f(Arrays.get(arr1,i)))(Arrays.get(arr2,i)));
     }
     return r;
    },
    mapi:function(f,arr)
    {
     var y,i;
     y=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(y,i,(f(i))(Arrays.get(arr,i)));
     }
     return y;
    },
    mapi2:function(f,arr1,arr2)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,((f(i))(Arrays.get(arr1,i)))(Arrays.get(arr2,i)));
     }
     return res;
    },
    max:function(x)
    {
     return Arrays.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Max(e1,e2);
      };
     },x);
    },
    maxBy:function(f,arr)
    {
     return Arrays.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===1?x:y;
      };
     },arr);
    },
    min:function(x)
    {
     return Arrays.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Min(e1,e2);
      };
     },x);
    },
    minBy:function(f,arr)
    {
     return Arrays.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===-1?x:y;
      };
     },arr);
    },
    nonEmpty:function(arr)
    {
     return arr.length===0?Operators.FailWith("The input array was empty."):null;
    },
    ofSeq:function(xs)
    {
     var q,_enum;
     q=[];
     _enum=Enumerator.Get(xs);
     while(_enum.MoveNext())
      {
       q.push(_enum.get_Current());
      }
     return q;
    },
    partition:function(f,arr)
    {
     var ret1,ret2,i;
     ret1=[];
     ret2=[];
     for(i=0;i<=arr.length-1;i++){
      f(Arrays.get(arr,i))?ret1.push(Arrays.get(arr,i)):ret2.push(Arrays.get(arr,i));
     }
     return[ret1,ret2];
    },
    permute:function(f,arr)
    {
     var ret,i;
     ret=Array(arr.length);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(ret,f(i),Arrays.get(arr,i));
     }
     return ret;
    },
    pick:function(f,arr)
    {
     var matchValue,_,x;
     matchValue=Arrays.tryPick(f,arr);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    reduce:function(f,arr)
    {
     var acc,i;
     Arrays.nonEmpty(arr);
     acc=Arrays.get(arr,0);
     for(i=1;i<=arr.length-1;i++){
      acc=(f(acc))(Arrays.get(arr,i));
     }
     return acc;
    },
    reduceBack:function(f,arr)
    {
     var len,acc,i;
     Arrays.nonEmpty(arr);
     len=arr.length;
     acc=Arrays.get(arr,len-1);
     for(i=2;i<=len;i++){
      acc=(f(Arrays.get(arr,len-i)))(acc);
     }
     return acc;
    },
    reverse:function(array,offset,length)
    {
     var a;
     a=Arrays.sub(array,offset,length).slice().reverse();
     return Arrays.blit(a,0,array,offset,Arrays.length(a));
    },
    scan:function(f,zero,arr)
    {
     var ret,i;
     ret=Array(1+arr.length);
     Arrays.set(ret,0,zero);
     for(i=0;i<=arr.length-1;i++){
      Arrays.set(ret,i+1,(f(Arrays.get(ret,i)))(Arrays.get(arr,i)));
     }
     return ret;
    },
    scanBack:function(f,arr,zero)
    {
     var len,ret,i;
     len=arr.length;
     ret=Array(1+len);
     Arrays.set(ret,len,zero);
     for(i=0;i<=len-1;i++){
      Arrays.set(ret,len-i-1,(f(Arrays.get(arr,len-i-1)))(Arrays.get(ret,len-i)));
     }
     return ret;
    },
    set:function(arr,n,x)
    {
     Arrays.checkBounds(arr,n);
     arr[n]=x;
     return;
    },
    set2D:function(arr,n1,n2,x)
    {
     Arrays.checkBounds2D(arr,n1,n2);
     arr[n1][n2]=x;
     return;
    },
    setSub:function(arr,start,len,src)
    {
     var i;
     for(i=0;i<=len-1;i++){
      Arrays.set(arr,start+i,Arrays.get(src,i));
     }
     return;
    },
    setSub2D:function(dst,src1,src2,len1,len2,src)
    {
     var i,j;
     for(i=0;i<=len1-1;i++){
      for(j=0;j<=len2-1;j++){
       Arrays.set2D(dst,src1+i,src2+j,Arrays.get2D(src,i,j));
      }
     }
     return;
    },
    sort:function(arr)
    {
     return Arrays.sortBy(function(x)
     {
      return x;
     },arr);
    },
    sortBy:function(f,arr)
    {
     return arr.slice().sort(function(x,y)
     {
      return Operators.Compare(f(x),f(y));
     });
    },
    sortInPlace:function(arr)
    {
     return Arrays.sortInPlaceBy(function(x)
     {
      return x;
     },arr);
    },
    sortInPlaceBy:function(f,arr)
    {
     return arr.sort(function(x,y)
     {
      return Operators.Compare(f(x),f(y));
     });
    },
    sortInPlaceWith:function(comparer,arr)
    {
     return arr.sort(function(x,y)
     {
      return(comparer(x))(y);
     });
    },
    sortWith:function(comparer,arr)
    {
     return arr.slice().sort(function(x,y)
     {
      return(comparer(x))(y);
     });
    },
    sub:function(arr,start,length)
    {
     Arrays.checkRange(arr,start,length);
     return arr.slice(start,start+length);
    },
    sub2D:function(src,src1,src2,len1,len2)
    {
     var len11,len21,dst,i,j;
     len11=len1<0?0:len1;
     len21=len2<0?0:len2;
     dst=Arrays.zeroCreate2D(len11,len21);
     for(i=0;i<=len11-1;i++){
      for(j=0;j<=len21-1;j++){
       Arrays.set2D(dst,i,j,Arrays.get2D(src,src1+i,src2+j));
      }
     }
     return dst;
    },
    sum:function($arr)
    {
     var $0=this,$this=this;
     var sum=0;
     for(var i=0;i<$arr.length;i++)sum+=$arr[i];
     return sum;
    },
    sumBy:function($f,$arr)
    {
     var $0=this,$this=this;
     var sum=0;
     for(var i=0;i<$arr.length;i++)sum+=$f($arr[i]);
     return sum;
    },
    tryFind:function(f,arr)
    {
     var res,i;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       f(Arrays.get(arr,i))?res={
        $:1,
        $0:Arrays.get(arr,i)
       }:null;
       i=i+1;
      }
     return res;
    },
    tryFindIndex:function(f,arr)
    {
     var res,i;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       f(Arrays.get(arr,i))?res={
        $:1,
        $0:i
       }:null;
       i=i+1;
      }
     return res;
    },
    tryPick:function(f,arr)
    {
     var res,i,matchValue;
     res={
      $:0
     };
     i=0;
     while(i<arr.length?res.$==0:false)
      {
       matchValue=f(Arrays.get(arr,i));
       matchValue.$==1?res=matchValue:null;
       i=i+1;
      }
     return res;
    },
    unzip:function(arr)
    {
     var x,y,i,patternInput,b,a;
     x=[];
     y=[];
     for(i=0;i<=arr.length-1;i++){
      patternInput=Arrays.get(arr,i);
      b=patternInput[1];
      a=patternInput[0];
      x.push(a);
      y.push(b);
     }
     return[x,y];
    },
    unzip3:function(arr)
    {
     var x,y,z,i,matchValue,c,b,a;
     x=[];
     y=[];
     z=[];
     for(i=0;i<=arr.length-1;i++){
      matchValue=Arrays.get(arr,i);
      c=matchValue[2];
      b=matchValue[1];
      a=matchValue[0];
      x.push(a);
      y.push(b);
      z.push(c);
     }
     return[x,y,z];
    },
    zeroCreate2D:function(n,m)
    {
     var arr;
     arr=Arrays.init(n,function()
     {
      return Array(m);
     });
     arr.dims=2;
     return arr;
    },
    zip:function(arr1,arr2)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,[Arrays.get(arr1,i),Arrays.get(arr2,i)]);
     }
     return res;
    },
    zip3:function(arr1,arr2,arr3)
    {
     var res,i;
     Arrays.checkLength(arr1,arr2);
     Arrays.checkLength(arr2,arr3);
     res=Array(arr1.length);
     for(i=0;i<=arr1.length-1;i++){
      Arrays.set(res,i,[Arrays.get(arr1,i),Arrays.get(arr2,i),Arrays.get(arr3,i)]);
     }
     return res;
    }
   },
   Arrays2D:{
    copy:function(array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return Arrays.get2D(array,i,j);
      };
     });
    },
    init:function(n,m,f)
    {
     var array,i,j;
     array=Arrays.zeroCreate2D(n,m);
     for(i=0;i<=n-1;i++){
      for(j=0;j<=m-1;j++){
       Arrays.set2D(array,i,j,(f(i))(j));
      }
     }
     return array;
    },
    iter:function(f,array)
    {
     var count1,count2,i,j;
     count1=array.length;
     count2=array.length?array[0].length:0;
     for(i=0;i<=count1-1;i++){
      for(j=0;j<=count2-1;j++){
       f(Arrays.get2D(array,i,j));
      }
     }
     return;
    },
    iteri:function(f,array)
    {
     var count1,count2,i,j;
     count1=array.length;
     count2=array.length?array[0].length:0;
     for(i=0;i<=count1-1;i++){
      for(j=0;j<=count2-1;j++){
       ((f(i))(j))(Arrays.get2D(array,i,j));
      }
     }
     return;
    },
    map:function(f,array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return f(Arrays.get2D(array,i,j));
      };
     });
    },
    mapi:function(f,array)
    {
     return Arrays2D.init(array.length,array.length?array[0].length:0,function(i)
     {
      return function(j)
      {
       return((f(i))(j))(Arrays.get2D(array,i,j));
      };
     });
    }
   },
   AsyncProxy:Runtime.Class({},{
    get_CancellationToken:function()
    {
     return Concurrency.GetCT();
    },
    get_DefaultCancellationToken:function()
    {
     return(Concurrency.defCTS())[0];
    }
   }),
   CancellationTokenSource:Runtime.Class({
    Cancel:function()
    {
     var _,chooser,array,errors;
     if(!this.c)
      {
       this.c=true;
       chooser=function(a)
       {
        var _1,e;
        try
        {
         a(null);
         _1={
          $:0
         };
        }
        catch(e)
        {
         _1={
          $:1,
          $0:e
         };
        }
        return _1;
       };
       array=this.r;
       errors=Arrays.choose(chooser,array);
       _=Arrays.length(errors)>0?Operators.Raise(AggregateException.New(errors)):null;
      }
     else
      {
       _=null;
      }
     return _;
    },
    Cancel1:function(throwOnFirstException)
    {
     var _,_1,action,array;
     if(!throwOnFirstException)
      {
       _=this.Cancel();
      }
     else
      {
       if(!this.c)
        {
         this.c=true;
         action=function(a)
         {
          return a(null);
         };
         array=this.r;
         _1=Arrays.iter(action,array);
        }
       else
        {
         _1=null;
        }
       _=_1;
      }
     return _;
    },
    CancelAfter:function(delay)
    {
     var _,option,arg0,_this=this;
     if(!this.c)
      {
       option=this.pending;
       Option.iter(function(handle)
       {
        return clearTimeout(handle);
       },option);
       arg0=setTimeout(function()
       {
        return _this.Cancel();
       },delay);
       _=void(this.pending={
        $:1,
        $0:arg0
       });
      }
     else
      {
       _=null;
      }
     return _;
    },
    get_IsCancellationRequested:function()
    {
     return this.c;
    }
   },{
    CreateLinkedTokenSource:function(t1,t2)
    {
     return CancellationTokenSource.CreateLinkedTokenSource1([t1,t2]);
    },
    CreateLinkedTokenSource1:function(tokens)
    {
     var cts,action;
     cts=CancellationTokenSource.New();
     action=function(t)
     {
      var value;
      value=Concurrency.Register(t,function()
      {
       return function()
       {
        return cts.Cancel();
       }();
      });
      return;
     };
     return Arrays.iter(action,tokens);
    },
    New:function()
    {
     var r;
     r=Runtime.New(this,{});
     r.c=false;
     r.pending={
      $:0
     };
     r.r=[];
     return r;
    }
   }),
   Char:Runtime.Class({},{
    GetNumericValue:function(c)
    {
     return(c>=48?c<=57:false)?Number(c)-Number(48):-1;
    },
    IsControl:function(c)
    {
     return(c>=0?c<=31:false)?true:c>=128?c<=159:false;
    },
    IsDigit:function(c)
    {
     return c>=48?c<=57:false;
    },
    IsLetter:function(c)
    {
     return(c>=65?c<=90:false)?true:c>=97?c<=122:false;
    },
    IsLetterOrDigit:function(c)
    {
     return Char.IsLetter(c)?true:Char.IsDigit(c);
    },
    IsLower:function(c)
    {
     return c>=97?c<=122:false;
    },
    IsUpper:function(c)
    {
     return c>=65?c<=90:false;
    },
    IsWhiteSpace:function($c)
    {
     var $0=this,$this=this;
     return Global.String.fromCharCode($c).match(/\s/)!==null;
    },
    Parse:function(s)
    {
     return s.length===1?s.charCodeAt(0):Operators.FailWith("String must be exactly one character long.");
    }
   }),
   Concurrency:{
    AwaitEvent:function(e)
    {
     var r;
     r=function(c)
     {
      var sub,sub1,creg,creg1,sub2,creg2;
      sub=function()
      {
       return Util.subscribeTo(e,function(x)
       {
        var action;
        Lazy.Force(sub1).Dispose();
        Lazy.Force(creg1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:0,
          $0:x
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      sub1=Lazy.Create(sub);
      creg=function()
      {
       return Concurrency.Register(c.ct,function()
       {
        var action;
        Lazy.Force(sub1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:2,
          $0:OperationCanceledException.New()
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      creg1=Lazy.Create(creg);
      sub2=Lazy.Force(sub1);
      creg2=Lazy.Force(creg1);
      return null;
     };
     return Concurrency.checkCancel(r);
    },
    Bind:function(r,f)
    {
     var r1;
     r1=function(c)
     {
      return r({
       k:function(_arg1)
       {
        var _,x,action,action1;
        if(_arg1.$==0)
         {
          x=_arg1.$0;
          action=function()
          {
           var _1,e;
           try
           {
            _1=(f(x))(c);
           }
           catch(e)
           {
            _1=c.k.call(null,{
             $:1,
             $0:e
            });
           }
           return _1;
          };
          _=Concurrency.scheduler().Fork(action);
         }
        else
         {
          action1=function()
          {
           return c.k.call(null,_arg1);
          };
          _=Concurrency.scheduler().Fork(action1);
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r1);
    },
    Catch:function(r)
    {
     var r1;
     r1=function(c)
     {
      var _,e1;
      try
      {
       _=r({
        k:function(_arg1)
        {
         var _1,x,e;
         if(_arg1.$==0)
          {
           x=_arg1.$0;
           _1=c.k.call(null,{
            $:0,
            $0:{
             $:0,
             $0:x
            }
           });
          }
         else
          {
           if(_arg1.$==1)
            {
             e=_arg1.$0;
             _1=c.k.call(null,{
              $:0,
              $0:{
               $:1,
               $0:e
              }
             });
            }
           else
            {
             _1=c.k.call(null,_arg1);
            }
          }
         return _1;
        },
        ct:c.ct
       });
      }
      catch(e1)
      {
       _=c.k.call(null,{
        $:0,
        $0:{
         $:1,
         $0:e1
        }
       });
      }
      return _;
     };
     return Concurrency.checkCancel(r1);
    },
    Combine:function(a,b)
    {
     return Concurrency.Bind(a,function()
     {
      return b;
     });
    },
    Delay:function(mk)
    {
     var r;
     r=function(c)
     {
      var _,e;
      try
      {
       _=(mk(null))(c);
      }
      catch(e)
      {
       _=c.k.call(null,{
        $:1,
        $0:e
       });
      }
      return _;
     };
     return Concurrency.checkCancel(r);
    },
    For:function(s,b)
    {
     var ie;
     ie=Enumerator.Get(s);
     return Concurrency.While(function()
     {
      return ie.MoveNext();
     },Concurrency.Delay(function()
     {
      return b(ie.get_Current());
     }));
    },
    FromContinuations:function(subscribe)
    {
     var r;
     r=function(c)
     {
      var continued,once;
      continued=[false];
      once=function(cont)
      {
       var _;
       if(continued[0])
        {
         _=Operators.FailWith("A continuation provided by Async.FromContinuations was invoked multiple times");
        }
       else
        {
         continued[0]=true;
         _=Concurrency.scheduler().Fork(cont);
        }
       return _;
      };
      return subscribe([function(a)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:0,
         $0:a
        });
       });
      },function(e)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:1,
         $0:e
        });
       });
      },function(e)
      {
       return once(function()
       {
        return c.k.call(null,{
         $:2,
         $0:e
        });
       });
      }]);
     };
     return Concurrency.checkCancel(r);
    },
    GetCT:Runtime.Field(function()
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    }),
    Ignore:function(r)
    {
     return Concurrency.Bind(r,function()
     {
      return Concurrency.Return(null);
     });
    },
    OnCancel:function(action)
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:Concurrency.Register(c.ct,action)
      });
     };
     return Concurrency.checkCancel(r);
    },
    Parallel:function(cs)
    {
     var cs1,_,r;
     cs1=Arrays.ofSeq(cs);
     if(Arrays.length(cs1)===0)
      {
       _=Concurrency.Return([]);
      }
     else
      {
       r=function(c)
       {
        var n,o,a,accept;
        n=cs1.length;
        o=[n];
        a=Arrays.create(n,undefined);
        accept=function(i)
        {
         return function(x)
         {
          var matchValue,_1,_2,x1,res,_3,x2,n1,res1;
          matchValue=[o[0],x];
          if(matchValue[0]===0)
           {
            _1=null;
           }
          else
           {
            if(matchValue[0]===1)
             {
              if(matchValue[1].$==0)
               {
                x1=matchValue[1].$0;
                Arrays.set(a,i,x1);
                o[0]=0;
                _2=c.k.call(null,{
                 $:0,
                 $0:a
                });
               }
              else
               {
                matchValue[0];
                res=matchValue[1];
                o[0]=0;
                _2=c.k.call(null,res);
               }
              _1=_2;
             }
            else
             {
              if(matchValue[1].$==0)
               {
                x2=matchValue[1].$0;
                n1=matchValue[0];
                Arrays.set(a,i,x2);
                _3=void(o[0]=n1-1);
               }
              else
               {
                matchValue[0];
                res1=matchValue[1];
                o[0]=0;
                _3=c.k.call(null,res1);
               }
              _1=_3;
             }
           }
          return _1;
         };
        };
        return Arrays.iteri(function(i)
        {
         return function(run)
         {
          var action;
          action=function()
          {
           return run({
            k:accept(i),
            ct:c.ct
           });
          };
          return Concurrency.scheduler().Fork(action);
         };
        },cs1);
       };
       _=Concurrency.checkCancel(r);
      }
     return _;
    },
    Register:function(ct,callback)
    {
     var i;
     i=ct.r.push(callback)-1;
     return{
      Dispose:function()
      {
       return Arrays.set(ct.r,i,function()
       {
       });
      }
     };
    },
    Return:function(x)
    {
     var r;
     r=function(c)
     {
      return c.k.call(null,{
       $:0,
       $0:x
      });
     };
     return Concurrency.checkCancel(r);
    },
    Scheduler:Runtime.Class({
     Fork:function(action)
     {
      var _,value,_this=this;
      this.robin.push(action);
      if(this.idle)
       {
        this.idle=false;
        value=setTimeout(function()
        {
         return _this.tick();
        },0);
        _=void value;
       }
      else
       {
        _=null;
       }
      return _;
     },
     tick:function()
     {
      var t,loop,matchValue,_,_1,value,_this=this;
      t=Date.now();
      loop=true;
      while(loop)
       {
        matchValue=this.robin.length;
        if(matchValue===0)
         {
          this.idle=true;
          _=loop=false;
         }
        else
         {
          (this.robin.shift())(null);
          if(Date.now()-t>40)
           {
            value=setTimeout(function()
            {
             return _this.tick();
            },0);
            _1=loop=false;
           }
          else
           {
            _1=null;
           }
          _=_1;
         }
       }
      return;
     }
    },{
     New:function()
     {
      var r;
      r=Runtime.New(this,{});
      r.idle=true;
      r.robin=[];
      return r;
     }
    }),
    Sleep:function(ms)
    {
     var r;
     r=function(c)
     {
      var pending,pending1,creg,creg1,pending2,creg2;
      pending=function()
      {
       return setTimeout(function()
       {
        var action;
        Lazy.Force(creg1).Dispose();
        action=function()
        {
         return c.k.call(null,{
          $:0,
          $0:null
         });
        };
        return Concurrency.scheduler().Fork(action);
       },ms);
      };
      pending1=Lazy.Create(pending);
      creg=function()
      {
       return Concurrency.Register(c.ct,function()
       {
        var action;
        clearTimeout(Lazy.Force(pending1));
        action=function()
        {
         return c.k.call(null,{
          $:2,
          $0:OperationCanceledException.New()
         });
        };
        return Concurrency.scheduler().Fork(action);
       });
      };
      creg1=Lazy.Create(creg);
      pending2=Lazy.Force(pending1);
      creg2=Lazy.Force(creg1);
      return null;
     };
     return Concurrency.checkCancel(r);
    },
    Start:function(c,ctOpt)
    {
     return Concurrency.StartWithContinuations(c,function()
     {
     },function(exn)
     {
      var ps;
      ps=[exn];
      return console?console.log.apply(console,["WebSharper: Uncaught asynchronous exception"].concat(ps)):undefined;
     },function()
     {
     },ctOpt);
    },
    StartChild:function(r)
    {
     var r1;
     r1=function(c)
     {
      var cached,queue,action,r2,r21;
      cached=[{
       $:0
      }];
      queue=[];
      action=function()
      {
       return r({
        k:function(res)
        {
         cached[0]={
          $:1,
          $0:res
         };
         while(queue.length>0)
          {
           (queue.shift())(res);
          }
         return;
        },
        ct:c.ct
       });
      };
      Concurrency.scheduler().Fork(action);
      r2=function(c2)
      {
       var matchValue,_,x;
       matchValue=cached[0];
       if(matchValue.$==0)
        {
         _=queue.push(c2.k);
        }
       else
        {
         x=matchValue.$0;
         _=c2.k.call(null,x);
        }
       return _;
      };
      r21=Concurrency.checkCancel(r2);
      return c.k.call(null,{
       $:0,
       $0:r21
      });
     };
     return Concurrency.checkCancel(r1);
    },
    StartWithContinuations:function(c,s,f,cc,ctOpt)
    {
     var ct,action;
     ct=Operators.DefaultArg(ctOpt,(Concurrency.defCTS())[0]);
     action=function()
     {
      return c({
       k:function(_arg1)
       {
        var _,e,e1,x;
        if(_arg1.$==1)
         {
          e=_arg1.$0;
          _=f(e);
         }
        else
         {
          if(_arg1.$==2)
           {
            e1=_arg1.$0;
            _=cc(e1);
           }
          else
           {
            x=_arg1.$0;
            _=s(x);
           }
         }
        return _;
       },
       ct:ct
      });
     };
     return Concurrency.scheduler().Fork(action);
    },
    TryCancelled:function(run,comp)
    {
     var r;
     r=function(c)
     {
      return run({
       k:function(_arg1)
       {
        var _,e;
        if(_arg1.$==2)
         {
          e=_arg1.$0;
          comp(e);
          _=c.k.call(null,_arg1);
         }
        else
         {
          _=c.k.call(null,_arg1);
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    },
    TryFinally:function(run,f)
    {
     var r;
     r=function(c)
     {
      return run({
       k:function(r1)
       {
        var _,e;
        try
        {
         f(null);
         _=c.k.call(null,r1);
        }
        catch(e)
        {
         _=c.k.call(null,{
          $:1,
          $0:e
         });
        }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r);
    },
    TryWith:function(r,f)
    {
     var r1;
     r1=function(c)
     {
      return r({
       k:function(_arg1)
       {
        var _,x,e,_1,e1;
        if(_arg1.$==0)
         {
          x=_arg1.$0;
          _=c.k.call(null,{
           $:0,
           $0:x
          });
         }
        else
         {
          if(_arg1.$==1)
           {
            e=_arg1.$0;
            try
            {
             _1=(f(e))(c);
            }
            catch(e1)
            {
             _1=c.k.call(null,_arg1);
            }
            _=_1;
           }
          else
           {
            _=c.k.call(null,_arg1);
           }
         }
        return _;
       },
       ct:c.ct
      });
     };
     return Concurrency.checkCancel(r1);
    },
    Using:function(x,f)
    {
     return Concurrency.TryFinally(f(x),function()
     {
      return x.Dispose();
     });
    },
    While:function(g,c)
    {
     return g(null)?Concurrency.Bind(c,function()
     {
      return Concurrency.While(g,c);
     }):Concurrency.Return(null);
    },
    checkCancel:function(r)
    {
     return function(c)
     {
      return c.ct.c?c.k.call(null,{
       $:2,
       $0:OperationCanceledException.New()
      }):r(c);
     };
    },
    defCTS:Runtime.Field(function()
    {
     return[CancellationTokenSource.New()];
    }),
    scheduler:Runtime.Field(function()
    {
     return Scheduler.New();
    })
   },
   Control:{
    createEvent:function(add,remove,create)
    {
     return{
      AddHandler:add,
      RemoveHandler:remove,
      Subscribe:function(r)
      {
       var h;
       h=create(function()
       {
        return function(args)
        {
         return r.OnNext.call(null,args);
        };
       });
       add(h);
       return{
        Dispose:function()
        {
         return remove(h);
        }
       };
      }
     };
    }
   },
   DateTimeHelpers:{
    AddMonths:function(d,months)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear(),e.getMonth()+months,e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())).getTime();
    },
    AddYears:function(d,years)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear()+years,e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())).getTime();
    },
    DatePortion:function(d)
    {
     var e;
     e=new Date(d);
     return(new Date(e.getFullYear(),e.getMonth(),e.getDate())).getTime();
    },
    TimePortion:function(d)
    {
     var e;
     e=new Date(d);
     return(((24*0+e.getHours())*60+e.getMinutes())*60+e.getSeconds())*1000+e.getMilliseconds();
    }
   },
   Enumerable:{
    Of:function(getEnumerator)
    {
     return{
      GetEnumerator:getEnumerator
     };
    }
   },
   Enumerator:{
    Get:function(x)
    {
     return x instanceof Global.Array?T.New(0,null,function(e)
     {
      var i,_;
      i=e.s;
      if(i<Arrays.length(x))
       {
        e.c=Arrays.get(x,i);
        e.s=i+1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     }):Unchecked.Equals(typeof x,"string")?T.New(0,null,function(e)
     {
      var i,_;
      i=e.s;
      if(i<x.length)
       {
        e.c=x.charCodeAt(i);
        e.s=i+1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     }):x.GetEnumerator();
    },
    T:Runtime.Class({
     MoveNext:function()
     {
      return this.n.call(null,this);
     },
     get_Current:function()
     {
      return this.c;
     }
    },{
     New:function(s,c,n)
     {
      var r;
      r=Runtime.New(this,{});
      r.s=s;
      r.c=c;
      r.n=n;
      return r;
     }
    })
   },
   Exception:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,Exception.New1("Exception of type 'System.Exception' was thrown."));
    },
    New1:function($message)
    {
     var $0=this,$this=this;
     return new Global.Error($message);
    }
   }),
   Guid:Runtime.Class({},{
    NewGuid:function()
    {
     var $0=this,$this=this;
     return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c)
     {
      var r=Global.Math.random()*16|0,v=c=="x"?r:r&0x3|0x8;
      return v.toString(16);
     });
    }
   }),
   Html:{
    Client:{
     Activator:{
      Activate:Runtime.Field(function()
      {
       var _,meta;
       if(Activator.hasDocument())
        {
         meta=document.getElementById("websharper-data");
         _=meta?jQuery(document).ready(function()
         {
          var text,obj,action,array;
          text=meta.getAttribute("content");
          obj=Json.Activate(JSON.parse(text));
          action=function(tupledArg)
          {
           var k,v,p,old;
           k=tupledArg[0];
           v=tupledArg[1];
           p=v.get_Body();
           old=document.getElementById(k);
           return p.ReplaceInDom(old);
          };
          array=JSModule.GetFields(obj);
          return Arrays.iter(action,array);
         }):null;
        }
       else
        {
         _=null;
        }
       return _;
      }),
      hasDocument:function()
      {
       var $0=this,$this=this;
       return typeof Global.document!=="undefined";
      }
     },
     HtmlContentExtensions:{
      "IControlBody.SingleNode.Static":function(node)
      {
       return SingleNode.New(node);
      },
      SingleNode:Runtime.Class({
       ReplaceInDom:function(old)
       {
        var value;
        value=this.node.parentNode.replaceChild(this.node,old);
        return;
       }
      },{
       New:function(node)
       {
        var r;
        r=Runtime.New(this,{});
        r.node=node;
        return r;
       }
      })
     }
    }
   },
   IndexOutOfRangeException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,IndexOutOfRangeException.New1("Index was outside the bounds of the array."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   InvalidOperationException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,InvalidOperationException.New1("Operation is not valid due to the current state of the object."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   JavaScript:{
    JSModule:{
     Delete:function($x,$field)
     {
      var $0=this,$this=this;
      return delete $x[$field];
     },
     ForEach:function($x,$iter)
     {
      var $0=this,$this=this;
      for(var k in $x){
       if($iter(k))
        break;
      }
     },
     GetFieldNames:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push(k);
      return r;
     },
     GetFieldValues:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push($o[k]);
      return r;
     },
     GetFields:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o)r.push([k,$o[k]]);
      return r;
     },
     Log:function($x)
     {
      var $0=this,$this=this;
      if(Global.console)
       Global.console.log($x);
     },
     LogMore:function($args)
     {
      var $0=this,$this=this;
      if(Global.console)
       Global.console.log.apply(Global.console,$args);
     }
    },
    Pervasives:{
     NewFromList:function(fields)
     {
      var r,enumerator,forLoopVar,v,k;
      r={};
      enumerator=Enumerator.Get(fields);
      while(enumerator.MoveNext())
       {
        forLoopVar=enumerator.get_Current();
        v=forLoopVar[1];
        k=forLoopVar[0];
        r[k]=v;
       }
      return r;
     }
    }
   },
   Json:{
    Activate:function(json)
    {
     var types,i,decode;
     types=json.$TYPES;
     for(i=0;i<=Arrays.length(types)-1;i++){
      Arrays.set(types,i,Json.lookup(Arrays.get(types,i)));
     }
     decode=function(x)
     {
      var _,matchValue,_1,_2,o,ti,_3,r;
      if(Unchecked.Equals(x,null))
       {
        _=x;
       }
      else
       {
        matchValue=typeof x;
        if(matchValue==="object")
         {
          if(x instanceof Global.Array)
           {
            _2=Json.shallowMap(decode,x);
           }
          else
           {
            o=Json.shallowMap(decode,x.$V);
            ti=x.$T;
            if(Unchecked.Equals(typeof ti,"undefined"))
             {
              _3=o;
             }
            else
             {
              r=new(Arrays.get(types,ti))();
              JSModule.ForEach(o,function(k)
              {
               r[k]=o[k];
               return false;
              });
              _3=r;
             }
            _2=_3;
           }
          _1=_2;
         }
        else
         {
          _1=x;
         }
        _=_1;
       }
      return _;
     };
     return decode(json.$DATA);
    },
    lookup:function(x)
    {
     var k,r,i,n,rn,_;
     k=Arrays.length(x);
     r=Global;
     i=0;
     while(i<k)
      {
       n=Arrays.get(x,i);
       rn=r[n];
       if(!Unchecked.Equals(typeof rn,undefined))
        {
         r=rn;
         _=i=i+1;
        }
       else
        {
         _=Operators.FailWith("Invalid server reply. Failed to find type: "+n);
        }
      }
     return r;
    },
    shallowMap:function(f,x)
    {
     var _,matchValue,_1,r;
     if(x instanceof Global.Array)
      {
       _=Arrays.map(f,x);
      }
     else
      {
       matchValue=typeof x;
       if(matchValue==="object")
        {
         r={};
         JSModule.ForEach(x,function(y)
         {
          r[y]=f(x[y]);
          return false;
         });
         _1=r;
        }
       else
        {
         _1=x;
        }
       _=_1;
      }
     return _;
    }
   },
   Lazy:{
    Create:function(f)
    {
     var x,get;
     x={
      value:undefined,
      created:false,
      eval:f
     };
     get=function()
     {
      var _;
      if(x.created)
       {
        _=x.value;
       }
      else
       {
        x.created=true;
        x.value=f(null);
        _=x.value;
       }
      return _;
     };
     x.eval=get;
     return x;
    },
    CreateFromValue:function(v)
    {
     return{
      value:v,
      created:true,
      eval:function()
      {
       return v;
      },
      eval:function()
      {
       return v;
      }
     };
    },
    Force:function(x)
    {
     return x.eval.call(null,null);
    }
   },
   List:{
    T:Runtime.Class({
     GetEnumerator:function()
     {
      return T.New(this,null,function(e)
      {
       var matchValue,_,xs,x;
       matchValue=e.s;
       if(matchValue.$==0)
        {
         _=false;
        }
       else
        {
         xs=matchValue.$1;
         x=matchValue.$0;
         e.c=x;
         e.s=xs;
         _=true;
        }
       return _;
      });
     },
     get_Item:function(x)
     {
      return Seq.nth(x,this);
     },
     get_Length:function()
     {
      return Seq.length(this);
     }
    },{
     Construct:function(head,tail)
     {
      return Runtime.New(T1,{
       $:1,
       $0:head,
       $1:tail
      });
     },
     get_Nil:function()
     {
      return Runtime.New(T1,{
       $:0
      });
     }
    }),
    append:function(x,y)
    {
     return List.ofSeq(Seq.append(x,y));
    },
    choose:function(f,l)
    {
     return List.ofSeq(Seq.choose(f,l));
    },
    collect:function(f,l)
    {
     return List.ofSeq(Seq.collect(f,l));
    },
    concat:function(s)
    {
     return List.ofSeq(Seq.concat(s));
    },
    exists2:function(p,l1,l2)
    {
     return Arrays.exists2(p,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    filter:function(p,l)
    {
     return List.ofSeq(Seq.filter(p,l));
    },
    fold2:function(f,s,l1,l2)
    {
     return Arrays.fold2(f,s,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    foldBack:function(f,l,s)
    {
     return Arrays.foldBack(f,Arrays.ofSeq(l),s);
    },
    foldBack2:function(f,l1,l2,s)
    {
     return Arrays.foldBack2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2),s);
    },
    forall2:function(p,l1,l2)
    {
     return Arrays.forall2(p,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    head:function(l)
    {
     var _,h;
     if(l.$==1)
      {
       h=l.$0;
       _=h;
      }
     else
      {
       _=Operators.FailWith("The input list was empty.");
      }
     return _;
    },
    init:function(s,f)
    {
     return List.ofArray(Arrays.init(s,f));
    },
    iter2:function(f,l1,l2)
    {
     return Arrays.iter2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    iteri2:function(f,l1,l2)
    {
     return Arrays.iteri2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2));
    },
    map:function(f,l)
    {
     return List.ofSeq(Seq.map(f,l));
    },
    map2:function(f,l1,l2)
    {
     return List.ofArray(Arrays.map2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    map3:function(f,l1,l2,l3)
    {
     var array;
     array=Arrays.map2(function(func)
     {
      return function(arg1)
      {
       return func(arg1);
      };
     },Arrays.map2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)),Arrays.ofSeq(l3));
     return List.ofArray(array);
    },
    mapi:function(f,l)
    {
     return List.ofSeq(Seq.mapi(f,l));
    },
    mapi2:function(f,l1,l2)
    {
     return List.ofArray(Arrays.mapi2(f,Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    max:function(l)
    {
     return Seq.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Max(e1,e2);
      };
     },l);
    },
    maxBy:function(f,l)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===1?x:y;
      };
     },l);
    },
    min:function(l)
    {
     return Seq.reduce(function(e1)
     {
      return function(e2)
      {
       return Operators.Min(e1,e2);
      };
     },l);
    },
    minBy:function(f,l)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))===-1?x:y;
      };
     },l);
    },
    ofArray:function(arr)
    {
     var r,i;
     r=Runtime.New(T1,{
      $:0
     });
     for(i=0;i<=Arrays.length(arr)-1;i++){
      r=Runtime.New(T1,{
       $:1,
       $0:Arrays.get(arr,Arrays.length(arr)-i-1),
       $1:r
      });
     }
     return r;
    },
    ofSeq:function(s)
    {
     var r,e,x;
     r=[];
     e=Enumerator.Get(s);
     while(e.MoveNext())
      {
       r.unshift(e.get_Current());
      }
     x=r.slice(0);
     x.reverse();
     return List.ofArray(x);
    },
    partition:function(p,l)
    {
     var patternInput,b,a;
     patternInput=Arrays.partition(p,Arrays.ofSeq(l));
     b=patternInput[1];
     a=patternInput[0];
     return[List.ofArray(a),List.ofArray(b)];
    },
    permute:function(f,l)
    {
     return List.ofArray(Arrays.permute(f,Arrays.ofSeq(l)));
    },
    reduceBack:function(f,l)
    {
     return Arrays.reduceBack(f,Arrays.ofSeq(l));
    },
    replicate:function(size,value)
    {
     return List.ofArray(Arrays.create(size,value));
    },
    rev:function(l)
    {
     var a;
     a=Arrays.ofSeq(l);
     a.reverse();
     return List.ofArray(a);
    },
    scan:function(f,s,l)
    {
     return List.ofSeq(Seq.scan(f,s,l));
    },
    scanBack:function(f,l,s)
    {
     return List.ofArray(Arrays.scanBack(f,Arrays.ofSeq(l),s));
    },
    sort:function(l)
    {
     var a;
     a=Arrays.ofSeq(l);
     Arrays.sortInPlace(a);
     return List.ofArray(a);
    },
    sortBy:function(f,l)
    {
     return List.sortWith(function(x)
     {
      return function(y)
      {
       return Operators.Compare(f(x),f(y));
      };
     },l);
    },
    sortWith:function(f,l)
    {
     var a;
     a=Arrays.ofSeq(l);
     Arrays.sortInPlaceWith(f,a);
     return List.ofArray(a);
    },
    tail:function(l)
    {
     var _,t;
     if(l.$==1)
      {
       t=l.$1;
       _=t;
      }
     else
      {
       _=Operators.FailWith("The input list was empty.");
      }
     return _;
    },
    unzip:function(l)
    {
     var x,y,enumerator,forLoopVar,b,a;
     x=[];
     y=[];
     enumerator=Enumerator.Get(l);
     while(enumerator.MoveNext())
      {
       forLoopVar=enumerator.get_Current();
       b=forLoopVar[1];
       a=forLoopVar[0];
       x.push(a);
       y.push(b);
      }
     return[List.ofArray(x.slice(0)),List.ofArray(y.slice(0))];
    },
    unzip3:function(l)
    {
     var x,y,z,enumerator,forLoopVar,c,b,a;
     x=[];
     y=[];
     z=[];
     enumerator=Enumerator.Get(l);
     while(enumerator.MoveNext())
      {
       forLoopVar=enumerator.get_Current();
       c=forLoopVar[2];
       b=forLoopVar[1];
       a=forLoopVar[0];
       x.push(a);
       y.push(b);
       z.push(c);
      }
     return[List.ofArray(x.slice(0)),List.ofArray(y.slice(0)),List.ofArray(z.slice(0))];
    },
    zip:function(l1,l2)
    {
     return List.ofArray(Arrays.zip(Arrays.ofSeq(l1),Arrays.ofSeq(l2)));
    },
    zip3:function(l1,l2,l3)
    {
     return List.ofArray(Arrays.zip3(Arrays.ofSeq(l1),Arrays.ofSeq(l2),Arrays.ofSeq(l3)));
    }
   },
   MatchFailureException:Runtime.Class({},{
    New:function(message,line,column)
    {
     return Runtime.New(this,Exception.New1(message+" at "+Global.String(line)+":"+Global.String(column)));
    }
   }),
   OperationCanceledException:Runtime.Class({},{
    New:function()
    {
     return Runtime.New(this,OperationCanceledException.New1("The operation was canceled."));
    },
    New1:function(message)
    {
     return Runtime.New(this,Exception.New1(message));
    }
   }),
   Operators:{
    Compare:function(a,b)
    {
     return Unchecked.Compare(a,b);
    },
    DefaultArg:function(x,d)
    {
     var _,x1;
     if(x.$==0)
      {
       _=d;
      }
     else
      {
       x1=x.$0;
       _=x1;
      }
     return _;
    },
    FailWith:function(msg)
    {
     return Operators.Raise(Exception.New1(msg));
    },
    KeyValue:function(kvp)
    {
     return[kvp.K,kvp.V];
    },
    Max:function(a,b)
    {
     return Unchecked.Compare(a,b)===1?a:b;
    },
    Min:function(a,b)
    {
     return Unchecked.Compare(a,b)===-1?a:b;
    },
    Pown:function(a,n)
    {
     var p;
     p=function(n1)
     {
      var _,_1,b;
      if(n1===1)
       {
        _=a;
       }
      else
       {
        if(n1%2===0)
         {
          b=p(n1/2>>0);
          _1=b*b;
         }
        else
         {
          _1=a*p(n1-1);
         }
        _=_1;
       }
      return _;
     };
     return p(n);
    },
    Raise:function($e)
    {
     var $0=this,$this=this;
     throw $e;
    },
    Sign:function(x)
    {
     return x===0?0:x<0?-1:1;
    },
    Truncate:function(x)
    {
     return x<0?Math.ceil(x):Math.floor(x);
    },
    Using:function(t,f)
    {
     var _;
     try
     {
      _=f(t);
     }
     finally
     {
      t.Dispose();
     }
     return _;
    },
    range:function(min,max)
    {
     return Seq.init(1+max-min,function(x)
     {
      return x+min;
     });
    },
    step:function(min,step,max)
    {
     var s,predicate,source,x;
     s=Operators.Sign(step);
     predicate=function(k)
     {
      return s*(max-k)>=0;
     };
     source=Seq.initInfinite(function(k)
     {
      return min+k*step;
     });
     x=Seq.takeWhile(predicate,source);
     return x;
    }
   },
   Option:{
    bind:function(f,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _={
        $:0
       };
      }
     else
      {
       x1=x.$0;
       _=f(x1);
      }
     return _;
    },
    exists:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=false;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    fold:function(f,s,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=s;
      }
     else
      {
       x1=x.$0;
       _=(f(s))(x1);
      }
     return _;
    },
    foldBack:function(f,x,s)
    {
     var _,x1;
     if(x.$==0)
      {
       _=s;
      }
     else
      {
       x1=x.$0;
       _=(f(x1))(s);
      }
     return _;
    },
    forall:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=true;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    iter:function(p,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=null;
      }
     else
      {
       x1=x.$0;
       _=p(x1);
      }
     return _;
    },
    map:function(f,x)
    {
     var _,x1;
     if(x.$==0)
      {
       _={
        $:0
       };
      }
     else
      {
       x1=x.$0;
       _={
        $:1,
        $0:f(x1)
       };
      }
     return _;
    },
    toArray:function(x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=[];
      }
     else
      {
       x1=x.$0;
       _=[x1];
      }
     return _;
    },
    toList:function(x)
    {
     var _,x1;
     if(x.$==0)
      {
       _=Runtime.New(T1,{
        $:0
       });
      }
     else
      {
       x1=x.$0;
       _=List.ofArray([x1]);
      }
     return _;
    }
   },
   PrintfHelpers:{
    padNumLeft:function(s,l)
    {
     var f;
     f=Arrays.get(s,0);
     return((f===" "?true:f==="+")?true:f==="-")?f+Strings.PadLeftWith(s.substr(1),l-1,48):Strings.PadLeftWith(s,l,48);
    },
    plusForPos:function(n,s)
    {
     return 0<=n?"+"+s:s;
    },
    prettyPrint:function(o)
    {
     var printObject,t,_1,_2,_3,mapping1,strings1;
     printObject=function(o1)
     {
      var s,_,mapping,array,strings;
      s=Global.String(o1);
      if(s==="[object Object]")
       {
        mapping=function(tupledArg)
        {
         var k,v;
         k=tupledArg[0];
         v=tupledArg[1];
         return k+" = "+PrintfHelpers.prettyPrint(v);
        };
        array=JSModule.GetFields(o1);
        strings=Arrays.map(mapping,array);
        _="{"+Strings.concat("; ",strings)+"}";
       }
      else
       {
        _=s;
       }
      return _;
     };
     t=typeof o;
     if(t=="string")
      {
       _1="\""+o+"\"";
      }
     else
      {
       if(t=="object")
        {
         if(o instanceof Global.Array)
          {
           mapping1=function(o1)
           {
            return PrintfHelpers.prettyPrint(o1);
           };
           strings1=Arrays.map(mapping1,o);
           _3="[|"+Strings.concat("; ",strings1)+"|]";
          }
         else
          {
           _3=printObject(o);
          }
         _2=_3;
        }
       else
        {
         _2=Global.String(o);
        }
       _1=_2;
      }
     return _1;
    },
    printArray:function(p,o)
    {
     var strings;
     strings=Arrays.map(p,o);
     return"[|"+Strings.concat("; ",strings)+"|]";
    },
    printArray2D:function(p,o)
    {
     var strings;
     strings=Seq.delay(function()
     {
      var l2;
      l2=o.length?o[0].length:0;
      return Seq.map(function(i)
      {
       var strings1;
       strings1=Seq.delay(function()
       {
        return Seq.map(function(j)
        {
         return p(Arrays.get2D(o,i,j));
        },Operators.range(0,l2-1));
       });
       return Strings.concat("; ",strings1);
      },Operators.range(0,o.length-1));
     });
     return"[["+Strings.concat("][",strings)+"]]";
    },
    printList:function(p,o)
    {
     var strings;
     strings=Seq.map(p,o);
     return"["+Strings.concat("; ",strings)+"]";
    },
    spaceForPos:function(n,s)
    {
     return 0<=n?" "+s:s;
    },
    toSafe:function(s)
    {
     return s==null?"":s;
    }
   },
   Queue:{
    Clear:function(a)
    {
     return a.splice(0,Arrays.length(a));
    },
    Contains:function(a,el)
    {
     return Seq.exists(function(y)
     {
      return Unchecked.Equals(el,y);
     },a);
    },
    CopyTo:function(a,array,index)
    {
     return Arrays.blit(a,0,array,index,Arrays.length(a));
    }
   },
   Random:Runtime.Class({
    Next:function()
    {
     return Math.floor(Math.random()*2147483648);
    },
    Next1:function(maxValue)
    {
     return maxValue<0?Operators.FailWith("'maxValue' must be greater than zero."):Math.floor(Math.random()*maxValue);
    },
    Next2:function(minValue,maxValue)
    {
     var _,maxValue1;
     if(minValue>maxValue)
      {
       _=Operators.FailWith("'minValue' cannot be greater than maxValue.");
      }
     else
      {
       maxValue1=maxValue-minValue;
       _=minValue+Math.floor(Math.random()*maxValue1);
      }
     return _;
    },
    NextBytes:function(buffer)
    {
     var i;
     for(i=0;i<=Arrays.length(buffer)-1;i++){
      Arrays.set(buffer,i,Math.floor(Math.random()*256));
     }
     return;
    }
   },{
    New:function()
    {
     return Runtime.New(this,{});
    }
   }),
   Ref:{
    decr:function($x)
    {
     var $0=this,$this=this;
     return void($x[0]--);
    },
    incr:function($x)
    {
     var $0=this,$this=this;
     return void($x[0]++);
    }
   },
   Remoting:{
    AjaxProvider:Runtime.Field(function()
    {
     return XhrProvider.New();
    }),
    AjaxRemotingProvider:Runtime.Class({},{
     Async:function(m,data)
     {
      var headers,payload;
      headers=Remoting.makeHeaders(m);
      payload=Remoting.makePayload(data);
      return Concurrency.Delay(function()
      {
       var x;
       x=AsyncProxy.get_CancellationToken();
       return Concurrency.Bind(x,function(_arg1)
       {
        return Concurrency.FromContinuations(function(tupledArg)
        {
         var ok,err,cc,waiting,reg,ok1,err1,arg00;
         ok=tupledArg[0];
         err=tupledArg[1];
         cc=tupledArg[2];
         waiting=[true];
         reg=Concurrency.Register(_arg1,function()
         {
          return function()
          {
           var _;
           if(waiting[0])
            {
             waiting[0]=false;
             _=cc(OperationCanceledException.New());
            }
           else
            {
             _=null;
            }
           return _;
          }();
         });
         ok1=function(x1)
         {
          var _;
          if(waiting[0])
           {
            waiting[0]=false;
            reg.Dispose();
            _=ok(Json.Activate(JSON.parse(x1)));
           }
          else
           {
            _=null;
           }
          return _;
         };
         err1=function(e)
         {
          var _;
          if(waiting[0])
           {
            waiting[0]=false;
            reg.Dispose();
            _=err(e);
           }
          else
           {
            _=null;
           }
          return _;
         };
         arg00=Remoting.EndPoint();
         return Remoting.AjaxProvider().Async(arg00,headers,payload,ok1,err1);
        });
       });
      });
     },
     Send:function(m,data)
     {
      return Concurrency.Start(Concurrency.Ignore(AjaxRemotingProvider.Async(m,data)),{
       $:0
      });
     },
     Sync:function(m,data)
     {
      var arg00,arg10,arg20,data1;
      arg00=Remoting.EndPoint();
      arg10=Remoting.makeHeaders(m);
      arg20=Remoting.makePayload(data);
      data1=Remoting.AjaxProvider().Sync(arg00,arg10,arg20);
      return Json.Activate(JSON.parse(data1));
     }
    }),
    EndPoint:Runtime.Field(function()
    {
     return"?";
    }),
    UseHttps:function()
    {
     var _,_1,_2,matchValue;
     try
     {
      if(!Strings.StartsWith(window.location.href,"https://"))
       {
        _2=Strings.Replace(window.location.href,"http://","https://");
        Remoting.EndPoint=function()
        {
         return _2;
        };
        _1=true;
       }
      else
       {
        _1=false;
       }
      _=_1;
     }
     catch(matchValue)
     {
      _=false;
     }
     return _;
    },
    XhrProvider:Runtime.Class({
     Async:function(url,headers,data,ok,err)
     {
      return Remoting.ajax(true,url,headers,data,ok,err);
     },
     Sync:function(url,headers,data)
     {
      var res;
      res=[undefined];
      Remoting.ajax(false,url,headers,data,function(x)
      {
       res[0]=x;
      },function(e)
      {
       return Operators.Raise(e);
      });
      return res[0];
     }
    },{
     New:function()
     {
      return Runtime.New(this,{});
     }
    }),
    ajax:function($async,$url,$headers,$data,$ok,$err)
    {
     var $0=this,$this=this;
     var xhr=new Global.XMLHttpRequest();
     xhr.open("POST",$url,$async);
     if($async==true)
      {
       xhr.withCredentials=true;
      }
     for(var h in $headers){
      xhr.setRequestHeader(h,$headers[h]);
     }
     function k()
     {
      if(xhr.status==200)
       {
        $ok(xhr.responseText);
       }
      else
       {
        var msg="Response status is not 200: ";
        $err(new Global.Error(msg+xhr.status));
       }
     }
     if("onload"in xhr)
      {
       xhr.onload=xhr.onerror=xhr.onabort=k;
      }
     else
      {
       xhr.onreadystatechange=function()
       {
        if(xhr.readyState==4)
         {
          k();
         }
       };
      }
     xhr.send($data);
    },
    makeHeaders:function(m)
    {
     var headers;
     headers={};
     headers["content-type"]="application/json";
     headers["x-websharper-rpc"]=m;
     return headers;
    },
    makePayload:function(data)
    {
     return JSON.stringify(data);
    }
   },
   Seq:{
    append:function(s1,s2)
    {
     return Enumerable.Of(function()
     {
      var e1;
      e1=Enumerator.Get(s1);
      return T.New(e1,null,function(x)
      {
       var _,_1,e2,_2;
       if(x.s.MoveNext())
        {
         x.c=x.s.get_Current();
         _=true;
        }
       else
        {
         if(x.s===e1)
          {
           e2=Enumerator.Get(s2);
           x.s=e2;
           if(e2.MoveNext())
            {
             x.c=e2.get_Current();
             _2=true;
            }
           else
            {
             _2=false;
            }
           _1=_2;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       return _;
      });
     });
    },
    average:function(s)
    {
     var patternInput,sum,count;
     patternInput=Seq.fold(function(tupledArg)
     {
      var n,s1;
      n=tupledArg[0];
      s1=tupledArg[1];
      return function(x)
      {
       return[n+1,s1+x];
      };
     },[0,0],s);
     sum=patternInput[1];
     count=patternInput[0];
     return sum/count;
    },
    averageBy:function(f,s)
    {
     var patternInput,sum,count;
     patternInput=Seq.fold(function(tupledArg)
     {
      var n,s1;
      n=tupledArg[0];
      s1=tupledArg[1];
      return function(x)
      {
       return[n+1,s1+f(x)];
      };
     },[0,0],s);
     sum=patternInput[1];
     count=patternInput[0];
     return sum/count;
    },
    cache:function(s)
    {
     var cache,_enum,getEnumerator;
     cache=[];
     _enum=Enumerator.Get(s);
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       var _,_1;
       if(e.s+1<cache.length)
        {
         e.s=e.s+1;
         e.c=cache[e.s];
         _=true;
        }
       else
        {
         if(_enum.MoveNext())
          {
           e.s=e.s+1;
           e.c=_enum.get_Current();
           cache.push(e.get_Current());
           _1=true;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       return _;
      };
      return T.New(0,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    choose:function(f,s)
    {
     var mapping;
     mapping=function(x)
     {
      var matchValue,_,v;
      matchValue=f(x);
      if(matchValue.$==0)
       {
        _=Runtime.New(T1,{
         $:0
        });
       }
      else
       {
        v=matchValue.$0;
        _=List.ofArray([v]);
       }
      return _;
     };
     return Seq.collect(mapping,s);
    },
    collect:function(f,s)
    {
     return Seq.concat(Seq.map(f,s));
    },
    compareWith:function(f,s1,s2)
    {
     var e1,e2,r,loop,matchValue;
     e1=Enumerator.Get(s1);
     e2=Enumerator.Get(s2);
     r=0;
     loop=true;
     while(loop?r===0:false)
      {
       matchValue=[e1.MoveNext(),e2.MoveNext()];
       matchValue[0]?matchValue[1]?r=(f(e1.get_Current()))(e2.get_Current()):r=1:matchValue[1]?r=-1:loop=false;
      }
     return r;
    },
    concat:function(ss)
    {
     return Enumerable.Of(function()
     {
      var outerE,next;
      outerE=Enumerator.Get(ss);
      next=function(st)
      {
       var matchValue,_,_1,_2;
       matchValue=st.s;
       if(Unchecked.Equals(matchValue,null))
        {
         if(outerE.MoveNext())
          {
           st.s=Enumerator.Get(outerE.get_Current());
           _1=next(st);
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       else
        {
         if(matchValue.MoveNext())
          {
           st.c=matchValue.get_Current();
           _2=true;
          }
         else
          {
           st.s=null;
           _2=next(st);
          }
         _=_2;
        }
       return _;
      };
      return T.New(null,null,next);
     });
    },
    countBy:function(f,s)
    {
     var generator;
     generator=function()
     {
      var d,e,keys,k,h,_,mapping,array,x;
      d={};
      e=Enumerator.Get(s);
      keys=[];
      while(e.MoveNext())
       {
        k=f(e.get_Current());
        h=Unchecked.Hash(k);
        if(d.hasOwnProperty(h))
         {
          _=void(d[h]=d[h]+1);
         }
        else
         {
          keys.push(k);
          _=void(d[h]=1);
         }
       }
      mapping=function(k1)
      {
       return[k1,d[Unchecked.Hash(k1)]];
      };
      array=keys.slice(0);
      x=Arrays.map(mapping,array);
      return x;
     };
     return Seq.delay(generator);
    },
    delay:function(f)
    {
     return Enumerable.Of(function()
     {
      return Enumerator.Get(f(null));
     });
    },
    distinct:function(s)
    {
     return Seq.distinctBy(function(x)
     {
      return x;
     },s);
    },
    distinctBy:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var _enum,seen,next;
      _enum=Enumerator.Get(s);
      seen={};
      next=function(e)
      {
       var _,cur,h,check,has,_1;
       if(_enum.MoveNext())
        {
         cur=_enum.get_Current();
         h=function(c)
         {
          return Unchecked.Hash(f(c));
         };
         check=function(c)
         {
          return seen.hasOwnProperty(h(c));
         };
         has=check(cur);
         while(has?_enum.MoveNext():false)
          {
           cur=_enum.get_Current();
           has=check(cur);
          }
         if(has)
          {
           _1=false;
          }
         else
          {
           seen[h(cur)]=null;
           e.c=cur;
           _1=true;
          }
         _=_1;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    empty:function()
    {
     return[];
    },
    enumFinally:function(s,f)
    {
     return Enumerable.Of(function()
     {
      var e,_,e1;
      try
      {
       _=Enumerator.Get(s);
      }
      catch(e1)
      {
       f(null);
       _=Operators.Raise(e1);
      }
      e=_;
      return T.New(null,null,function(x)
      {
       var _1,_2,e2;
       try
       {
        if(e.MoveNext())
         {
          x.c=e.get_Current();
          _2=true;
         }
        else
         {
          f(null);
          _2=false;
         }
        _1=_2;
       }
       catch(e2)
       {
        f(null);
        _1=Operators.Raise(e2);
       }
       return _1;
      });
     });
    },
    enumUsing:function(x,f)
    {
     return f(x);
    },
    enumWhile:function(f,s)
    {
     return Enumerable.Of(function()
     {
      var next;
      next=function(en)
      {
       var matchValue,_,e,_1,_2;
       matchValue=en.s;
       if(matchValue.$==1)
        {
         e=matchValue.$0;
         if(e.MoveNext())
          {
           en.c=e.get_Current();
           _1=true;
          }
         else
          {
           en.s={
            $:0
           };
           _1=next(en);
          }
         _=_1;
        }
       else
        {
         if(f(null))
          {
           en.s={
            $:1,
            $0:Enumerator.Get(s)
           };
           _2=next(en);
          }
         else
          {
           _2=false;
          }
         _=_2;
        }
       return _;
      };
      return T.New({
       $:0
      },null,next);
     });
    },
    exists:function(p,s)
    {
     var e,r;
     e=Enumerator.Get(s);
     r=false;
     while(!r?e.MoveNext():false)
      {
       r=p(e.get_Current());
      }
     return r;
    },
    exists2:function(p,s1,s2)
    {
     var e1,e2,r;
     e1=Enumerator.Get(s1);
     e2=Enumerator.Get(s2);
     r=false;
     while((!r?e1.MoveNext():false)?e2.MoveNext():false)
      {
       r=(p(e1.get_Current()))(e2.get_Current());
      }
     return r;
    },
    filter:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var _enum,next;
      _enum=Enumerator.Get(s);
      next=function(e)
      {
       var loop,c,res,_;
       loop=_enum.MoveNext();
       c=_enum.get_Current();
       res=false;
       while(loop)
        {
         if(f(c))
          {
           e.c=c;
           res=true;
           _=loop=false;
          }
         else
          {
           _=_enum.MoveNext()?c=_enum.get_Current():loop=false;
          }
        }
       return res;
      };
      return T.New(null,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    find:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryFind(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    findIndex:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryFindIndex(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    fold:function(f,x,s)
    {
     var r,e;
     r=x;
     e=Enumerator.Get(s);
     while(e.MoveNext())
      {
       r=(f(r))(e.get_Current());
      }
     return r;
    },
    forall:function(p,s)
    {
     return!Seq.exists(function(x)
     {
      return!p(x);
     },s);
    },
    forall2:function(p,s1,s2)
    {
     return!Seq.exists2(function(x)
     {
      return function(y)
      {
       return!(p(x))(y);
      };
     },s1,s2);
    },
    groupBy:function(f,s)
    {
     return Seq.delay(function()
     {
      var d,d1,keys,e,c,k,h;
      d={};
      d1={};
      keys=[];
      e=Enumerator.Get(s);
      while(e.MoveNext())
       {
        c=e.get_Current();
        k=f(c);
        h=Unchecked.Hash(k);
        !d.hasOwnProperty(h)?keys.push(k):null;
        d1[h]=k;
        d.hasOwnProperty(h)?d[h].push(c):void(d[h]=[c]);
       }
      return Arrays.map(function(k1)
      {
       return[k1,d[Unchecked.Hash(k1)]];
      },keys);
     });
    },
    head:function(s)
    {
     var e;
     e=Enumerator.Get(s);
     return e.MoveNext()?e.get_Current():Seq.insufficient();
    },
    init:function(n,f)
    {
     return Seq.take(n,Seq.initInfinite(f));
    },
    initInfinite:function(f)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       e.c=f(e.s);
       e.s=e.s+1;
       return true;
      };
      return T.New(0,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    insufficient:function()
    {
     return Operators.FailWith("The input sequence has an insufficient number of elements.");
    },
    isEmpty:function(s)
    {
     var e;
     e=Enumerator.Get(s);
     return!e.MoveNext();
    },
    iter:function(p,s)
    {
     return Seq.iteri(function()
     {
      return function(x)
      {
       return p(x);
      };
     },s);
    },
    iter2:function(p,s1,s2)
    {
     var e1,e2;
     e1=Enumerator.Get(s1);
     e2=Enumerator.Get(s2);
     while(e1.MoveNext()?e2.MoveNext():false)
      {
       (p(e1.get_Current()))(e2.get_Current());
      }
     return;
    },
    iteri:function(p,s)
    {
     var i,e;
     i=0;
     e=Enumerator.Get(s);
     while(e.MoveNext())
      {
       (p(i))(e.get_Current());
       i=i+1;
      }
     return;
    },
    length:function(s)
    {
     var i,e;
     i=0;
     e=Enumerator.Get(s);
     while(e.MoveNext())
      {
       i=i+1;
      }
     return i;
    },
    map:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var en,next;
      en=Enumerator.Get(s);
      next=function(e)
      {
       var _;
       if(en.MoveNext())
        {
         e.c=f(en.get_Current());
         _=true;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    mapi:function(f,s)
    {
     return Seq.mapi2(f,Seq.initInfinite(function(x)
     {
      return x;
     }),s);
    },
    mapi2:function(f,s1,s2)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var e1,e2,next;
      e1=Enumerator.Get(s1);
      e2=Enumerator.Get(s2);
      next=function(e)
      {
       var _;
       if(e1.MoveNext()?e2.MoveNext():false)
        {
         e.c=(f(e1.get_Current()))(e2.get_Current());
         _=true;
        }
       else
        {
         _=false;
        }
       return _;
      };
      return T.New(null,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    max:function(s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(x,y)>=0?x:y;
      };
     },s);
    },
    maxBy:function(f,s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))>=0?x:y;
      };
     },s);
    },
    min:function(s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(x,y)<=0?x:y;
      };
     },s);
    },
    minBy:function(f,s)
    {
     return Seq.reduce(function(x)
     {
      return function(y)
      {
       return Unchecked.Compare(f(x),f(y))<=0?x:y;
      };
     },s);
    },
    nth:function(index,s)
    {
     var pos,e;
     index<0?Operators.FailWith("negative index requested"):null;
     pos=-1;
     e=Enumerator.Get(s);
     while(pos<index)
      {
       !e.MoveNext()?Seq.insufficient():null;
       pos=pos+1;
      }
     return e.get_Current();
    },
    pairwise:function(s)
    {
     var mapping,source;
     mapping=function(x)
     {
      return[Arrays.get(x,0),Arrays.get(x,1)];
     };
     source=Seq.windowed(2,s);
     return Seq.map(mapping,source);
    },
    pick:function(p,s)
    {
     var matchValue,_,x;
     matchValue=Seq.tryPick(p,s);
     if(matchValue.$==0)
      {
       _=Operators.FailWith("KeyNotFoundException");
      }
     else
      {
       x=matchValue.$0;
       _=x;
      }
     return _;
    },
    readOnly:function(s)
    {
     return Enumerable.Of(function()
     {
      return Enumerator.Get(s);
     });
    },
    reduce:function(f,source)
    {
     var e,r;
     e=Enumerator.Get(source);
     !e.MoveNext()?Operators.FailWith("The input sequence was empty"):null;
     r=e.get_Current();
     while(e.MoveNext())
      {
       r=(f(r))(e.get_Current());
      }
     return r;
    },
    scan:function(f,x,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var en,next;
      en=Enumerator.Get(s);
      next=function(e)
      {
       var _,_1;
       if(e.s)
        {
         if(en.MoveNext())
          {
           e.c=(f(e.get_Current()))(en.get_Current());
           _1=true;
          }
         else
          {
           _1=false;
          }
         _=_1;
        }
       else
        {
         e.c=x;
         e.s=true;
         _=true;
        }
       return _;
      };
      return T.New(false,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    skip:function(n,s)
    {
     return Enumerable.Of(function()
     {
      var e,i;
      e=Enumerator.Get(s);
      for(i=1;i<=n;i++){
       !e.MoveNext()?Seq.insufficient():null;
      }
      return e;
     });
    },
    skipWhile:function(f,s)
    {
     return Enumerable.Of(function()
     {
      var e,empty;
      e=Enumerator.Get(s);
      empty=true;
      while(e.MoveNext()?f(e.get_Current()):false)
       {
        empty=false;
       }
      return empty?Enumerator.Get(Seq.empty()):T.New(true,null,function(x)
      {
       var _,r;
       if(x.s)
        {
         x.s=false;
         x.c=e.get_Current();
         _=true;
        }
       else
        {
         r=e.MoveNext();
         x.c=e.get_Current();
         _=r;
        }
       return _;
      });
     });
    },
    sort:function(s)
    {
     return Seq.sortBy(function(x)
     {
      return x;
     },s);
    },
    sortBy:function(f,s)
    {
     return Seq.delay(function()
     {
      var array;
      array=Arrays.ofSeq(s);
      Arrays.sortInPlaceBy(f,array);
      return array;
     });
    },
    sum:function(s)
    {
     return Seq.fold(function(s1)
     {
      return function(x)
      {
       return s1+x;
      };
     },0,s);
    },
    sumBy:function(f,s)
    {
     return Seq.fold(function(s1)
     {
      return function(x)
      {
       return s1+f(x);
      };
     },0,s);
    },
    take:function(n,s)
    {
     return Enumerable.Of(function()
     {
      var e;
      e=Enumerator.Get(s);
      return T.New(0,null,function(_enum)
      {
       var _,_1;
       if(_enum.s>=n)
        {
         _=false;
        }
       else
        {
         if(e.MoveNext())
          {
           _enum.s=_enum.s+1;
           _enum.c=e.get_Current();
           _1=true;
          }
         else
          {
           e.Dispose();
           _enum.s=n;
           _1=false;
          }
         _=_1;
        }
       return _;
      });
     });
    },
    takeWhile:function(f,s)
    {
     return Seq.delay(function()
     {
      return Seq.enumUsing(Enumerator.Get(s),function(e)
      {
       return Seq.enumWhile(function()
       {
        return e.MoveNext()?f(e.get_Current()):false;
       },Seq.delay(function()
       {
        return[e.get_Current()];
       }));
      });
     });
    },
    toArray:function(s)
    {
     var q,enumerator,e;
     q=[];
     enumerator=Enumerator.Get(s);
     while(enumerator.MoveNext())
      {
       e=enumerator.get_Current();
       q.push(e);
      }
     return q.slice(0);
    },
    toList:function(s)
    {
     return List.ofSeq(s);
    },
    truncate:function(n,s)
    {
     return Seq.delay(function()
     {
      return Seq.enumUsing(Enumerator.Get(s),function(e)
      {
       var i;
       i=[0];
       return Seq.enumWhile(function()
       {
        return e.MoveNext()?i[0]<n:false;
       },Seq.delay(function()
       {
        Ref.incr(i);
        return[e.get_Current()];
       }));
      });
     });
    },
    tryFind:function(ok,s)
    {
     var e,r,x;
     e=Enumerator.Get(s);
     r={
      $:0
     };
     while(r.$==0?e.MoveNext():false)
      {
       x=e.get_Current();
       ok(x)?r={
        $:1,
        $0:x
       }:null;
      }
     return r;
    },
    tryFindIndex:function(ok,s)
    {
     var e,loop,i,x;
     e=Enumerator.Get(s);
     loop=true;
     i=0;
     while(loop?e.MoveNext():false)
      {
       x=e.get_Current();
       ok(x)?loop=false:i=i+1;
      }
     return loop?{
      $:0
     }:{
      $:1,
      $0:i
     };
    },
    tryPick:function(f,s)
    {
     var e,r;
     e=Enumerator.Get(s);
     r={
      $:0
     };
     while(Unchecked.Equals(r,{
      $:0
     })?e.MoveNext():false)
      {
       r=f(e.get_Current());
      }
     return r;
    },
    unfold:function(f,s)
    {
     var getEnumerator;
     getEnumerator=function()
     {
      var next;
      next=function(e)
      {
       var matchValue,_,t,s1;
       matchValue=f(e.s);
       if(matchValue.$==0)
        {
         _=false;
        }
       else
        {
         t=matchValue.$0[0];
         s1=matchValue.$0[1];
         e.c=t;
         e.s=s1;
         _=true;
        }
       return _;
      };
      return T.New(s,null,next);
     };
     return Enumerable.Of(getEnumerator);
    },
    windowed:function(windowSize,s)
    {
     windowSize<=0?Operators.FailWith("The input must be non-negative."):null;
     return Seq.delay(function()
     {
      return Seq.enumUsing(Enumerator.Get(s),function(e)
      {
       var q;
       q=[];
       return Seq.append(Seq.enumWhile(function()
       {
        return q.length<windowSize?e.MoveNext():false;
       },Seq.delay(function()
       {
        q.push(e.get_Current());
        return Seq.empty();
       })),Seq.delay(function()
       {
        return q.length===windowSize?Seq.append([q.slice(0)],Seq.delay(function()
        {
         return Seq.enumWhile(function()
         {
          return e.MoveNext();
         },Seq.delay(function()
         {
          q.shift();
          q.push(e.get_Current());
          return[q.slice(0)];
         }));
        })):Seq.empty();
       }));
      });
     });
    },
    zip:function(s1,s2)
    {
     return Seq.mapi2(function(x)
     {
      return function(y)
      {
       return[x,y];
      };
     },s1,s2);
    },
    zip3:function(s1,s2,s3)
    {
     return Seq.mapi2(function(x)
     {
      return function(tupledArg)
      {
       var y,z;
       y=tupledArg[0];
       z=tupledArg[1];
       return[x,y,z];
      };
     },s1,Seq.zip(s2,s3));
    }
   },
   Slice:{
    array:function(source,start,finish)
    {
     var matchValue,_,_1,f,_2,s,f1,s1;
     matchValue=[start,finish];
     if(matchValue[0].$==0)
      {
       if(matchValue[1].$==1)
        {
         f=matchValue[1].$0;
         _1=source.slice(0,f+1);
        }
       else
        {
         _1=[];
        }
       _=_1;
      }
     else
      {
       if(matchValue[1].$==0)
        {
         s=matchValue[0].$0;
         _2=source.slice(s);
        }
       else
        {
         f1=matchValue[1].$0;
         s1=matchValue[0].$0;
         _2=source.slice(s1,f1+1);
        }
       _=_2;
      }
     return _;
    },
    array2D:function(arr,start1,finish1,start2,finish2)
    {
     var start11,_,n,start21,_1,n1,finish11,_2,n2,finish21,_3,n3,len1,len2;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(start2.$==1)
      {
       n1=start2.$0;
       _1=n1;
      }
     else
      {
       _1=0;
      }
     start21=_1;
     if(finish1.$==1)
      {
       n2=finish1.$0;
       _2=n2;
      }
     else
      {
       _2=arr.length-1;
      }
     finish11=_2;
     if(finish2.$==1)
      {
       n3=finish2.$0;
       _3=n3;
      }
     else
      {
       _3=(arr.length?arr[0].length:0)-1;
      }
     finish21=_3;
     len1=finish11-start11+1;
     len2=finish21-start21+1;
     return Arrays.sub2D(arr,start11,start21,len1,len2);
    },
    array2Dfix1:function(arr,fixed1,start2,finish2)
    {
     var start21,_,n,finish21,_1,n1,len2,dst,j;
     if(start2.$==1)
      {
       n=start2.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start21=_;
     if(finish2.$==1)
      {
       n1=finish2.$0;
       _1=n1;
      }
     else
      {
       _1=(arr.length?arr[0].length:0)-1;
      }
     finish21=_1;
     len2=finish21-start21+1;
     dst=Array(len2);
     for(j=0;j<=len2-1;j++){
      Arrays.set(dst,j,Arrays.get2D(arr,fixed1,start21+j));
     }
     return dst;
    },
    array2Dfix2:function(arr,start1,finish1,fixed2)
    {
     var start11,_,n,finish11,_1,n1,len1,dst,i;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(finish1.$==1)
      {
       n1=finish1.$0;
       _1=n1;
      }
     else
      {
       _1=arr.length-1;
      }
     finish11=_1;
     len1=finish11-start11+1;
     dst=Array(len1);
     for(i=0;i<=len1-1;i++){
      Arrays.set(dst,i,Arrays.get2D(arr,start11+i,fixed2));
     }
     return dst;
    },
    setArray:function(dst,start,finish,src)
    {
     var start1,_,n,finish1,_1,n1;
     if(start.$==1)
      {
       n=start.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start1=_;
     if(finish.$==1)
      {
       n1=finish.$0;
       _1=n1;
      }
     else
      {
       _1=dst.length-1;
      }
     finish1=_1;
     return Arrays.setSub(dst,start1,finish1-start1+1,src);
    },
    setArray2D:function(dst,start1,finish1,start2,finish2,src)
    {
     var start11,_,n,start21,_1,n1,finish11,_2,n2,finish21,_3,n3;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(start2.$==1)
      {
       n1=start2.$0;
       _1=n1;
      }
     else
      {
       _1=0;
      }
     start21=_1;
     if(finish1.$==1)
      {
       n2=finish1.$0;
       _2=n2;
      }
     else
      {
       _2=dst.length-1;
      }
     finish11=_2;
     if(finish2.$==1)
      {
       n3=finish2.$0;
       _3=n3;
      }
     else
      {
       _3=(dst.length?dst[0].length:0)-1;
      }
     finish21=_3;
     return Arrays.setSub2D(dst,start11,start21,finish11-start11+1,finish21-start21+1,src);
    },
    setArray2Dfix1:function(dst,fixed1,start2,finish2,src)
    {
     var start21,_,n,finish21,_1,n1,len2,j;
     if(start2.$==1)
      {
       n=start2.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start21=_;
     if(finish2.$==1)
      {
       n1=finish2.$0;
       _1=n1;
      }
     else
      {
       _1=(dst.length?dst[0].length:0)-1;
      }
     finish21=_1;
     len2=finish21-start21+1;
     for(j=0;j<=len2-1;j++){
      Arrays.set2D(dst,fixed1,start21+j,Arrays.get(src,j));
     }
     return;
    },
    setArray2Dfix2:function(dst,start1,finish1,fixed2,src)
    {
     var start11,_,n,finish11,_1,n1,len1,i;
     if(start1.$==1)
      {
       n=start1.$0;
       _=n;
      }
     else
      {
       _=0;
      }
     start11=_;
     if(finish1.$==1)
      {
       n1=finish1.$0;
       _1=n1;
      }
     else
      {
       _1=dst.length-1;
      }
     finish11=_1;
     len1=finish11-start11+1;
     for(i=0;i<=len1-1;i++){
      Arrays.set2D(dst,start11+i,fixed2,Arrays.get(src,i));
     }
     return;
    },
    string:function(source,start,finish)
    {
     var matchValue,_,_1,f,_2,s,f1,s1;
     matchValue=[start,finish];
     if(matchValue[0].$==0)
      {
       if(matchValue[1].$==1)
        {
         f=matchValue[1].$0;
         _1=source.slice(0,f+1);
        }
       else
        {
         _1="";
        }
       _=_1;
      }
     else
      {
       if(matchValue[1].$==0)
        {
         s=matchValue[0].$0;
         _2=source.slice(s);
        }
       else
        {
         f1=matchValue[1].$0;
         s1=matchValue[0].$0;
         _2=source.slice(s1,f1+1);
        }
       _=_2;
      }
     return _;
    }
   },
   Stack:{
    Clear:function(stack)
    {
     return stack.splice(0,Arrays.length(stack));
    },
    Contains:function(stack,el)
    {
     return Seq.exists(function(y)
     {
      return Unchecked.Equals(el,y);
     },stack);
    },
    CopyTo:function(stack,array,index)
    {
     return Arrays.blit(array,0,array,index,Arrays.length(stack));
    }
   },
   Strings:{
    Compare:function(x,y)
    {
     return Operators.Compare(x,y);
    },
    CopyTo:function(s,o,d,off,ct)
    {
     return Arrays.blit(Strings.ToCharArray(s),o,d,off,ct);
    },
    EndsWith:function($x,$s)
    {
     var $0=this,$this=this;
     return $x.substring($x.length-$s.length)==$s;
    },
    IndexOf:function($s,$c,$i)
    {
     var $0=this,$this=this;
     return $s.indexOf(Global.String.fromCharCode($c),$i);
    },
    Insert:function($x,$index,$s)
    {
     var $0=this,$this=this;
     return $x.substring(0,$index-1)+$s+$x.substring($index);
    },
    IsNullOrEmpty:function($x)
    {
     var $0=this,$this=this;
     return $x==null||$x=="";
    },
    Join:function($sep,$values)
    {
     var $0=this,$this=this;
     return $values.join($sep);
    },
    LastIndexOf:function($s,$c,$i)
    {
     var $0=this,$this=this;
     return $s.lastIndexOf(Global.String.fromCharCode($c),$i);
    },
    PadLeft:function(s,n)
    {
     return Strings.PadLeftWith(s,n,32);
    },
    PadLeftWith:function($s,$n,$c)
    {
     var $0=this,$this=this;
     return Global.Array($n-$s.length+1).join(Global.String.fromCharCode($c))+$s;
    },
    PadRight:function(s,n)
    {
     return Strings.PadRightWith(s,n,32);
    },
    PadRightWith:function($s,$n,$c)
    {
     var $0=this,$this=this;
     return $s+Global.Array($n-$s.length+1).join(Global.String.fromCharCode($c));
    },
    RegexEscape:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&");
    },
    Remove:function($x,$ix,$ct)
    {
     var $0=this,$this=this;
     return $x.substring(0,$ix)+$x.substring($ix+$ct);
    },
    Replace:function(subject,search,replace)
    {
     var replaceLoop;
     replaceLoop=function(subj)
     {
      var index,_,replaced,nextStartIndex;
      index=subj.indexOf(search);
      if(index!==-1)
       {
        replaced=Strings.ReplaceOnce(subj,search,replace);
        nextStartIndex=index+replace.length;
        _=Strings.Substring(replaced,0,index+replace.length)+replaceLoop(replaced.substring(nextStartIndex));
       }
      else
       {
        _=subj;
       }
      return _;
     };
     return replaceLoop(subject);
    },
    ReplaceChar:function(s,oldC,newC)
    {
     return Strings.Replace(s,String.fromCharCode(oldC),String.fromCharCode(newC));
    },
    ReplaceOnce:function($string,$search,$replace)
    {
     var $0=this,$this=this;
     return $string.replace($search,$replace);
    },
    Split:function(s,pat,opts)
    {
     var res;
     res=Strings.SplitWith(s,pat);
     return opts===1?Arrays.filter(function(x)
     {
      return x!=="";
     },res):res;
    },
    SplitChars:function(s,sep,opts)
    {
     var re;
     re="["+Strings.RegexEscape(String.fromCharCode.apply(undefined,sep))+"]";
     return Strings.Split(s,new RegExp(re),opts);
    },
    SplitStrings:function(s,sep,opts)
    {
     var re;
     re=Strings.concat("|",Arrays.map(function(s1)
     {
      return Strings.RegexEscape(s1);
     },sep));
     return Strings.Split(s,new RegExp(re),opts);
    },
    SplitWith:function($str,$pat)
    {
     var $0=this,$this=this;
     return $str.split($pat);
    },
    StartsWith:function($t,$s)
    {
     var $0=this,$this=this;
     return $t.substring(0,$s.length)==$s;
    },
    Substring:function($s,$ix,$ct)
    {
     var $0=this,$this=this;
     return $s.substr($ix,$ct);
    },
    ToCharArray:function(s)
    {
     return Arrays.init(s.length,function(x)
     {
      return s.charCodeAt(x);
     });
    },
    ToCharArrayRange:function(s,startIndex,length)
    {
     return Arrays.init(length,function(i)
     {
      return s.charCodeAt(startIndex+i);
     });
    },
    Trim:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/^\s+/,"").replace(/\s+$/,"");
    },
    TrimEnd:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/\s+$/,"");
    },
    TrimStart:function($s)
    {
     var $0=this,$this=this;
     return $s.replace(/^\s+/,"");
    },
    collect:function(f,s)
    {
     return Arrays.init(s.length,function(i)
     {
      return f(s.charCodeAt(i));
     }).join("");
    },
    concat:function(separator,strings)
    {
     return Seq.toArray(strings).join(separator);
    },
    exists:function(f,s)
    {
     return Seq.exists(f,Strings.protect(s));
    },
    forall:function(f,s)
    {
     return Seq.forall(f,Strings.protect(s));
    },
    init:function(count,f)
    {
     return Arrays.init(count,f).join("");
    },
    iter:function(f,s)
    {
     return Seq.iter(f,Strings.protect(s));
    },
    iteri:function(f,s)
    {
     return Seq.iteri(f,Strings.protect(s));
    },
    length:function(s)
    {
     return Strings.protect(s).length;
    },
    map:function(f,s)
    {
     return Strings.collect(function(x)
     {
      return String.fromCharCode(f(x));
     },Strings.protect(s));
    },
    mapi:function(f,s)
    {
     return Seq.toArray(Seq.mapi(function(i)
     {
      return function(x)
      {
       return String.fromCharCode((f(i))(x));
      };
     },s)).join("");
    },
    protect:function(s)
    {
     return s===null?"":s;
    },
    replicate:function(count,s)
    {
     return Strings.init(count,function()
     {
      return s;
     });
    }
   },
   Unchecked:{
    Compare:function(a,b)
    {
     var _,matchValue,_1,matchValue1;
     if(a===b)
      {
       _=0;
      }
     else
      {
       matchValue=typeof a;
       if(matchValue==="undefined")
        {
         matchValue1=typeof b;
         _1=matchValue1==="undefined"?0:-1;
        }
       else
        {
         _1=matchValue==="function"?Operators.FailWith("Cannot compare function values."):matchValue==="boolean"?a<b?-1:1:matchValue==="number"?a<b?-1:1:matchValue==="string"?a<b?-1:1:a===null?-1:b===null?1:"CompareTo"in a?a.CompareTo(b):(a instanceof Array?b instanceof Array:false)?Unchecked.compareArrays(a,b):(a instanceof Date?b instanceof Date:false)?Unchecked.compareDates(a,b):Unchecked.compareArrays(JSModule.GetFields(a),JSModule.GetFields(b));
        }
       _=_1;
      }
     return _;
    },
    Equals:function(a,b)
    {
     var _,matchValue;
     if(a===b)
      {
       _=true;
      }
     else
      {
       matchValue=typeof a;
       _=matchValue==="object"?a===null?false:b===null?false:"Equals"in a?a.Equals(b):(a instanceof Array?b instanceof Array:false)?Unchecked.arrayEquals(a,b):(a instanceof Date?b instanceof Date:false)?Unchecked.dateEquals(a,b):Unchecked.arrayEquals(JSModule.GetFields(a),JSModule.GetFields(b)):false;
      }
     return _;
    },
    Hash:function(o)
    {
     var matchValue;
     matchValue=typeof o;
     return matchValue==="function"?0:matchValue==="boolean"?o?1:0:matchValue==="number"?o:matchValue==="string"?Unchecked.hashString(o):matchValue==="object"?o==null?0:o instanceof Array?Unchecked.hashArray(o):Unchecked.hashObject(o):0;
    },
    arrayEquals:function(a,b)
    {
     var _,eq,i;
     if(Arrays.length(a)===Arrays.length(b))
      {
       eq=true;
       i=0;
       while(eq?i<Arrays.length(a):false)
        {
         !Unchecked.Equals(Arrays.get(a,i),Arrays.get(b,i))?eq=false:null;
         i=i+1;
        }
       _=eq;
      }
     else
      {
       _=false;
      }
     return _;
    },
    compareArrays:function(a,b)
    {
     var _,_1,cmp,i;
     if(Arrays.length(a)<Arrays.length(b))
      {
       _=-1;
      }
     else
      {
       if(Arrays.length(a)>Arrays.length(b))
        {
         _1=1;
        }
       else
        {
         cmp=0;
         i=0;
         while(cmp===0?i<Arrays.length(a):false)
          {
           cmp=Unchecked.Compare(Arrays.get(a,i),Arrays.get(b,i));
           i=i+1;
          }
         _1=cmp;
        }
       _=_1;
      }
     return _;
    },
    compareDates:function(a,b)
    {
     return Operators.Compare(a.getTime(),b.getTime());
    },
    dateEquals:function(a,b)
    {
     return a.getTime()===b.getTime();
    },
    hashArray:function(o)
    {
     var h,i;
     h=-34948909;
     for(i=0;i<=Arrays.length(o)-1;i++){
      h=Unchecked.hashMix(h,Unchecked.Hash(Arrays.get(o,i)));
     }
     return h;
    },
    hashMix:function(x,y)
    {
     return(x<<5)+x+y;
    },
    hashObject:function(o)
    {
     var _,op_PlusPlus,h;
     if("GetHashCode"in o)
      {
       _=o.GetHashCode();
      }
     else
      {
       op_PlusPlus=function(x,y)
       {
        return Unchecked.hashMix(x,y);
       };
       h=[0];
       JSModule.ForEach(o,function(key)
       {
        h[0]=op_PlusPlus(op_PlusPlus(h[0],Unchecked.hashString(key)),Unchecked.Hash(o[key]));
        return false;
       });
       _=h[0];
      }
     return _;
    },
    hashString:function(s)
    {
     var _,hash,i;
     if(s===null)
      {
       _=0;
      }
     else
      {
       hash=5381;
       for(i=0;i<=s.length-1;i++){
        hash=Unchecked.hashMix(hash,s.charCodeAt(i)<<0);
       }
       _=hash;
      }
     return _;
    }
   },
   Util:{
    addListener:function(event,h)
    {
     event.Subscribe(Util.observer(h));
    },
    observer:function(h)
    {
     return{
      OnCompleted:function()
      {
      },
      OnError:function()
      {
      },
      OnNext:h
     };
    },
    subscribeTo:function(event,h)
    {
     return event.Subscribe(Util.observer(h));
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  AggregateException=Runtime.Safe(Global.WebSharper.AggregateException);
  Exception=Runtime.Safe(Global.WebSharper.Exception);
  ArgumentException=Runtime.Safe(Global.WebSharper.ArgumentException);
  Number=Runtime.Safe(Global.Number);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  IndexOutOfRangeException=Runtime.Safe(Global.WebSharper.IndexOutOfRangeException);
  Array=Runtime.Safe(Global.Array);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  Arrays2D=Runtime.Safe(Global.WebSharper.Arrays2D);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Option=Runtime.Safe(Global.WebSharper.Option);
  clearTimeout=Runtime.Safe(Global.clearTimeout);
  setTimeout=Runtime.Safe(Global.setTimeout);
  CancellationTokenSource=Runtime.Safe(Global.WebSharper.CancellationTokenSource);
  Char=Runtime.Safe(Global.WebSharper.Char);
  Util=Runtime.Safe(Global.WebSharper.Util);
  Lazy=Runtime.Safe(Global.WebSharper.Lazy);
  OperationCanceledException=Runtime.Safe(Global.WebSharper.OperationCanceledException);
  Date=Runtime.Safe(Global.Date);
  console=Runtime.Safe(Global.console);
  Scheduler=Runtime.Safe(Concurrency.Scheduler);
  T=Runtime.Safe(Enumerator.T);
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Activator=Runtime.Safe(Client.Activator);
  document=Runtime.Safe(Global.document);
  jQuery=Runtime.Safe(Global.jQuery);
  Json=Runtime.Safe(Global.WebSharper.Json);
  JSON=Runtime.Safe(Global.JSON);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  HtmlContentExtensions=Runtime.Safe(Client.HtmlContentExtensions);
  SingleNode=Runtime.Safe(HtmlContentExtensions.SingleNode);
  InvalidOperationException=Runtime.Safe(Global.WebSharper.InvalidOperationException);
  List=Runtime.Safe(Global.WebSharper.List);
  T1=Runtime.Safe(List.T);
  MatchFailureException=Runtime.Safe(Global.WebSharper.MatchFailureException);
  Math=Runtime.Safe(Global.Math);
  Strings=Runtime.Safe(Global.WebSharper.Strings);
  PrintfHelpers=Runtime.Safe(Global.WebSharper.PrintfHelpers);
  Remoting=Runtime.Safe(Global.WebSharper.Remoting);
  XhrProvider=Runtime.Safe(Remoting.XhrProvider);
  AsyncProxy=Runtime.Safe(Global.WebSharper.AsyncProxy);
  AjaxRemotingProvider=Runtime.Safe(Remoting.AjaxRemotingProvider);
  window=Runtime.Safe(Global.window);
  Enumerable=Runtime.Safe(Global.WebSharper.Enumerable);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  String=Runtime.Safe(Global.String);
  return RegExp=Runtime.Safe(Global.RegExp);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(AggregateException,Exception);
  Runtime.Inherit(ArgumentException,Exception);
  Runtime.Inherit(IndexOutOfRangeException,Exception);
  Runtime.Inherit(InvalidOperationException,Exception);
  Runtime.Inherit(MatchFailureException,Exception);
  Runtime.Inherit(OperationCanceledException,Exception);
  Remoting.EndPoint();
  Remoting.AjaxProvider();
  Activator.Activate();
  Concurrency.scheduler();
  Concurrency.defCTS();
  Concurrency.GetCT();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Arrays,ok,Unchecked,console,Testing,Pervasives,TestBuilder,test,Random,Math,NaN1,Infinity1,List,String,Seq;
 Runtime.Define(Global,{
  WebSharper:{
   Testing:{
    Assert:{
     For:function(times,gen,attempt)
     {
      var i,i1;
      for(i=0;i<=Arrays.length(gen.Base)-1;i++){
       attempt(Arrays.get(gen.Base,i));
      }
      for(i1=1;i1<=times;i1++){
       attempt(gen.Next.call(null,null));
      }
      return;
     },
     Raises:function(f)
     {
      var _,matchValue;
      try
      {
       f(null);
       _=ok(false,"Assert raises exception test failed.");
      }
      catch(matchValue)
      {
       _=ok(true,"Pass.");
      }
      return _;
     }
    },
    Pervasives:{
     Is:function(a,b)
     {
      var _,ps;
      if(!Unchecked.Equals(a,b))
       {
        ps=[a,b];
        if(console)
         {
          console.log.apply(console,["Equality test failed."].concat(ps));
         }
        _=ok(false,"Equality test failed.");
       }
      else
       {
        _=ok(true,"Pass.");
       }
      return _;
     },
     Isnt:function(a,b)
     {
      var _,ps;
      if(Unchecked.Equals(a,b))
       {
        ps=[a,b];
        if(console)
         {
          console.log.apply(console,["Inequality test failed."].concat(ps));
         }
        _=ok(false,"Inequality test failed.");
       }
      else
       {
        _=ok(true,"Pass.");
       }
      return _;
     },
     Test:function(name)
     {
      return TestBuilder.New(name);
     },
     TestBuilder:Runtime.Class({
      Delay:function(f)
      {
       return test(this.name,f);
      },
      Zero:function()
      {
       return null;
      }
     },{
      New:function(name)
      {
       var r;
       r=Runtime.New(this,{});
       r.name=name;
       return r;
      }
     })
    },
    Random:{
     ArrayOf:function(generator)
     {
      return{
       Base:[[]],
       Next:function()
       {
        var len;
        len=Random.Natural().Next.call(null,null)%100;
        return Arrays.init(len,function()
        {
         return generator.Next.call(null,null);
        });
       }
      };
     },
     Boolean:Runtime.Field(function()
     {
      return{
       Base:[true,false],
       Next:function()
       {
        return Random.StandardUniform().Next.call(null,null)>0.5;
       }
      };
     }),
     Const:function(x)
     {
      return{
       Base:[x],
       Next:function()
       {
        return x;
       }
      };
     },
     Exponential:function(lambda)
     {
      return{
       Base:[],
       Next:function()
       {
        var p;
        p=Random.StandardUniform().Next.call(null,null);
        return-Math.log(1-p)/lambda;
       }
      };
     },
     Float:Runtime.Field(function()
     {
      return{
       Base:[0],
       Next:function()
       {
        var sign;
        sign=Random.Boolean().Next.call(null,null)?1:-1;
        return sign*Random.Exponential(0.1).Next.call(null,null);
       }
      };
     }),
     FloatExhaustive:Runtime.Field(function()
     {
      return{
       Base:[0,NaN1,Infinity1,-Infinity1],
       Next:function()
       {
        return Random.Float().Next.call(null,null);
       }
      };
     }),
     FloatWithin:function(low,hi)
     {
      return{
       Base:[low,hi],
       Next:function()
       {
        return low+(hi-low)*Math.random();
       }
      };
     },
     Implies:function(a,b)
     {
      return!a?true:b;
     },
     Imply:function(a,b)
     {
      return Random.Implies(a,b);
     },
     Int:Runtime.Field(function()
     {
      return{
       Base:[0,1,-1],
       Next:function()
       {
        return Math.round(Random.Float().Next.call(null,null));
       }
      };
     }),
     ListOf:function(generator)
     {
      var f,gen;
      f=function(array)
      {
       return List.ofArray(array);
      };
      gen=Random.ArrayOf(generator);
      return Random.Map(f,gen);
     },
     Map:function(f,gen)
     {
      var f1;
      f1=gen.Next;
      return{
       Base:Arrays.map(f,gen.Base),
       Next:function(x)
       {
        return f(f1(x));
       }
      };
     },
     Mix:function(a,b)
     {
      var left;
      left=[false];
      return{
       Base:a.Base.concat(b.Base),
       Next:function()
       {
        left[0]=!left[0];
        return left[0]?a.Next.call(null,null):b.Next.call(null,null);
       }
      };
     },
     Natural:Runtime.Field(function()
     {
      var g;
      g=Random.Int().Next;
      return{
       Base:[0,1],
       Next:function(x)
       {
        var value;
        value=g(x);
        return Math.abs(value);
       }
      };
     }),
     OneOf:function(seeds)
     {
      var index;
      index=Random.Within(1,Arrays.length(seeds));
      return{
       Base:seeds,
       Next:function()
       {
        return Arrays.get(seeds,index.Next.call(null,null)-1);
       }
      };
     },
     OptionOf:function(generator)
     {
      return Random.Mix(Random.Const({
       $:0
      }),Random.Map(function(arg0)
      {
       return{
        $:1,
        $0:arg0
       };
      },generator));
     },
     StandardUniform:Runtime.Field(function()
     {
      return{
       Base:[],
       Next:function()
       {
        return Math.random();
       }
      };
     }),
     String:Runtime.Field(function()
     {
      return{
       Base:[""],
       Next:function()
       {
        var len,cs;
        len=Random.Natural().Next.call(null,null)%100;
        cs=Arrays.init(len,function()
        {
         return Random.Int().Next.call(null,null)%256;
        });
        return String.fromCharCode.apply(undefined,cs);
       }
      };
     }),
     StringExhaustive:Runtime.Field(function()
     {
      return{
       Base:[null,""],
       Next:Random.String().Next
      };
     }),
     Tuple2Of:function(a,b)
     {
      return{
       Base:Seq.toArray(Seq.delay(function()
       {
        return Seq.collect(function(x)
        {
         return Seq.map(function(y)
         {
          return[x,y];
         },b.Base);
        },a.Base);
       })),
       Next:function()
       {
        return[a.Next.call(null,null),b.Next.call(null,null)];
       }
      };
     },
     Tuple3Of:function(a,b,c)
     {
      return{
       Base:Seq.toArray(Seq.delay(function()
       {
        return Seq.collect(function(x)
        {
         return Seq.collect(function(y)
         {
          return Seq.map(function(z)
          {
           return[x,y,z];
          },c.Base);
         },b.Base);
        },a.Base);
       })),
       Next:function()
       {
        return[a.Next.call(null,null),b.Next.call(null,null),c.Next.call(null,null)];
       }
      };
     },
     Within:function(low,hi)
     {
      return{
       Base:[low,hi],
       Next:function()
       {
        return Random.Natural().Next.call(null,null)%(hi-low)+low;
       }
      };
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  ok=Runtime.Safe(Global.ok);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  console=Runtime.Safe(Global.console);
  Testing=Runtime.Safe(Global.WebSharper.Testing);
  Pervasives=Runtime.Safe(Testing.Pervasives);
  TestBuilder=Runtime.Safe(Pervasives.TestBuilder);
  test=Runtime.Safe(Global.test);
  Random=Runtime.Safe(Testing.Random);
  Math=Runtime.Safe(Global.Math);
  NaN1=Runtime.Safe(Global.NaN);
  Infinity1=Runtime.Safe(Global.Infinity);
  List=Runtime.Safe(Global.WebSharper.List);
  String=Runtime.Safe(Global.String);
  return Seq=Runtime.Safe(Global.WebSharper.Seq);
 });
 Runtime.OnLoad(function()
 {
  Random.StringExhaustive();
  Random.String();
  Random.StandardUniform();
  Random.Natural();
  Random.Int();
  Random.FloatExhaustive();
  Random.Float();
  Random.Boolean();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Html,Client,Implementation,Attribute,Pagelet,Element,Enumerator,Math,document,jQuery,Events,JQueryEventSupport,AttributeBuilder,DeprecatedTagBuilder,JQueryHtmlProvider,TagBuilder,Text,Attr,EventsPervasives,Tags;
 Runtime.Define(Global,{
  WebSharper:{
   Html:{
    Client:{
     Attr:{
      Attr:Runtime.Field(function()
      {
       return Implementation.Attr();
      })
     },
     Attribute:Runtime.Class({
      get_Body:function()
      {
       var attr;
       attr=this.HtmlProvider.CreateAttribute(this.Name);
       attr.value=this.Value;
       return attr;
      }
     },{
      New:function(htmlProvider,name,value)
      {
       var a;
       a=Attribute.New1(htmlProvider);
       a.Name=name;
       a.Value=value;
       return a;
      },
      New1:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     AttributeBuilder:Runtime.Class({
      NewAttr:function(name,value)
      {
       var a;
       a=Attribute.New(this.HtmlProvider,name,value);
       return a;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Default:{
      OnLoad:function(init)
      {
       return Implementation.HtmlProvider().OnDocumentReady(init);
      }
     },
     DeprecatedAttributeBuilder:Runtime.Class({
      NewAttr:function(name,value)
      {
       var a;
       a=Attribute.New(this.HtmlProvider,name,value);
       return a;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     DeprecatedTagBuilder:Runtime.Class({
      NewTag:function(name,children)
      {
       var el,enumerator,pl;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       while(enumerator.MoveNext())
        {
         pl=enumerator.get_Current();
         el.AppendI(pl);
        }
       return el;
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Element:Runtime.Class({
      AppendI:function(pl)
      {
       var body,_,objectArg,arg00,objectArg1,arg001,arg10,_1,r;
       body=pl.get_Body();
       if(body.nodeType===2)
        {
         objectArg=this["HtmlProvider@33"];
         arg00=this.get_Body();
         _=objectArg.AppendAttribute(arg00,body);
        }
       else
        {
         objectArg1=this["HtmlProvider@33"];
         arg001=this.get_Body();
         arg10=pl.get_Body();
         _=objectArg1.AppendNode(arg001,arg10);
        }
       if(this.IsRendered)
        {
         _1=pl.Render();
        }
       else
        {
         r=this.RenderInternal;
         _1=void(this.RenderInternal=function()
         {
          r(null);
          return pl.Render();
         });
        }
       return _1;
      },
      AppendN:function(node)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.AppendNode(arg00,node);
      },
      OnLoad:function(f)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.OnLoad(arg00,f);
      },
      Render:function()
      {
       var _;
       if(!this.IsRendered)
        {
         this.RenderInternal.call(null,null);
         _=void(this.IsRendered=true);
        }
       else
        {
         _=null;
        }
       return _;
      },
      get_Body:function()
      {
       return this.Dom;
      },
      get_Html:function()
      {
       return this["HtmlProvider@33"].GetHtml(this.get_Body());
      },
      get_HtmlProvider:function()
      {
       return this["HtmlProvider@33"];
      },
      get_Id:function()
      {
       var objectArg,arg00,id,_,newId,objectArg1,arg001;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       id=objectArg.GetProperty(arg00,"id");
       if(id===undefined?true:id==="")
        {
         newId="id"+Math.round(Math.random()*100000000);
         objectArg1=this["HtmlProvider@33"];
         arg001=this.get_Body();
         objectArg1.SetProperty(arg001,"id",newId);
         _=newId;
        }
       else
        {
         _=id;
        }
       return _;
      },
      get_Item:function(name)
      {
       var objectArg,arg00,objectArg1,arg001;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       objectArg.GetAttribute(arg00,name);
       objectArg1=this["HtmlProvider@33"];
       arg001=this.get_Body();
       return objectArg1.GetAttribute(arg001,name);
      },
      get_Text:function()
      {
       return this["HtmlProvider@33"].GetText(this.get_Body());
      },
      get_Value:function()
      {
       return this["HtmlProvider@33"].GetValue(this.get_Body());
      },
      set_Html:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetHtml(arg00,x);
      },
      set_Item:function(name,value)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetAttribute(arg00,name,value);
      },
      set_Text:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetText(arg00,x);
      },
      set_Value:function(x)
      {
       var objectArg,arg00;
       objectArg=this["HtmlProvider@33"];
       arg00=this.get_Body();
       return objectArg.SetValue(arg00,x);
      }
     },{
      New:function(html,name)
      {
       var el,dom;
       el=Element.New1(html);
       dom=document.createElement(name);
       el.RenderInternal=function()
       {
       };
       el.Dom=dom;
       el.IsRendered=false;
       return el;
      },
      New1:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r["HtmlProvider@33"]=HtmlProvider;
       return r;
      }
     }),
     Events:{
      JQueryEventSupport:Runtime.Class({
       OnBlur:function(f,el)
       {
        return jQuery(el.get_Body()).bind("blur",function()
        {
         return f(el);
        });
       },
       OnChange:function(f,el)
       {
        return jQuery(el.get_Body()).bind("change",function()
        {
         return f(el);
        });
       },
       OnClick:function(f,el)
       {
        return this.OnMouse("click",f,el);
       },
       OnDoubleClick:function(f,el)
       {
        return this.OnMouse("dblclick",f,el);
       },
       OnError:function(f,el)
       {
        return jQuery(el.get_Body()).bind("error",function()
        {
         return f(el);
        });
       },
       OnEvent:function(ev,f,el)
       {
        return jQuery(el.get_Body()).bind(ev,function(ev1)
        {
         return(f(el))(ev1);
        });
       },
       OnFocus:function(f,el)
       {
        return jQuery(el.get_Body()).bind("focus",function()
        {
         return f(el);
        });
       },
       OnKeyDown:function(f,el)
       {
        return jQuery(el.get_Body()).bind("keydown",function(ev)
        {
         return(f(el))({
          KeyCode:ev.keyCode,
          Event:ev
         });
        });
       },
       OnKeyPress:function(f,el)
       {
        return jQuery(el.get_Body()).keypress(function(ev)
        {
         return(f(el))({
          CharacterCode:ev.which,
          Event:ev
         });
        });
       },
       OnKeyUp:function(f,el)
       {
        return jQuery(el.get_Body()).bind("keyup",function(ev)
        {
         return(f(el))({
          KeyCode:ev.keyCode,
          Event:ev
         });
        });
       },
       OnLoad:function(f,el)
       {
        return jQuery(el.get_Body()).bind("load",function()
        {
         return f(el);
        });
       },
       OnMouse:function(name,f,el)
       {
        return jQuery(el.get_Body()).bind(name,function(ev)
        {
         return(f(el))({
          X:ev.pageX,
          Y:ev.pageY,
          Event:ev
         });
        });
       },
       OnMouseDown:function(f,el)
       {
        return this.OnMouse("mousedown",f,el);
       },
       OnMouseEnter:function(f,el)
       {
        return this.OnMouse("mouseenter",f,el);
       },
       OnMouseLeave:function(f,el)
       {
        return this.OnMouse("mouseleave",f,el);
       },
       OnMouseMove:function(f,el)
       {
        return this.OnMouse("mousemove",f,el);
       },
       OnMouseOut:function(f,el)
       {
        return this.OnMouse("mouseout",f,el);
       },
       OnMouseUp:function(f,el)
       {
        return this.OnMouse("mouseup",f,el);
       },
       OnResize:function(f,el)
       {
        return jQuery(el.get_Body()).bind("resize",function()
        {
         return f(el);
        });
       },
       OnScroll:function(f,el)
       {
        return jQuery(el.get_Body()).bind("scroll",function()
        {
         return f(el);
        });
       },
       OnSelect:function(f,el)
       {
        return jQuery(el.get_Body()).bind("select",function()
        {
         return f(el);
        });
       },
       OnSubmit:function(f,el)
       {
        return jQuery(el.get_Body()).bind("submit",function()
        {
         return f(el);
        });
       },
       OnUnLoad:function(f,el)
       {
        return jQuery(el.get_Body()).bind("unload",function()
        {
         return f(el);
        });
       }
      },{
       New:function()
       {
        return Runtime.New(this,{});
       }
      })
     },
     EventsPervasives:{
      Events:Runtime.Field(function()
      {
       return JQueryEventSupport.New();
      })
     },
     Implementation:{
      Attr:Runtime.Field(function()
      {
       return AttributeBuilder.New(Implementation.HtmlProvider());
      }),
      DeprecatedHtml:Runtime.Field(function()
      {
       return DeprecatedTagBuilder.New(Implementation.HtmlProvider());
      }),
      HtmlProvider:Runtime.Field(function()
      {
       return JQueryHtmlProvider.New();
      }),
      JQueryHtmlProvider:Runtime.Class({
       AddClass:function(node,cls)
       {
        return jQuery(node).addClass(cls);
       },
       AppendAttribute:function(node,attr)
       {
        var arg10,arg20;
        arg10=attr.nodeName;
        arg20=attr.value;
        return this.SetAttribute(node,arg10,arg20);
       },
       AppendNode:function(node,el)
       {
        return jQuery(node).append(jQuery(el));
       },
       Clear:function(node)
       {
        return jQuery(node).contents().detach();
       },
       CreateAttribute:function(str)
       {
        return document.createAttribute(str);
       },
       CreateElement:function(name)
       {
        return document.createElement(name);
       },
       CreateTextNode:function(str)
       {
        return document.createTextNode(str);
       },
       GetAttribute:function(node,name)
       {
        return jQuery(node).attr(name);
       },
       GetHtml:function(node)
       {
        return jQuery(node).html();
       },
       GetProperty:function(node,name)
       {
        var x;
        x=jQuery(node).prop(name);
        return x;
       },
       GetText:function(node)
       {
        return node.textContent;
       },
       GetValue:function(node)
       {
        var x;
        x=jQuery(node).val();
        return x;
       },
       HasAttribute:function(node,name)
       {
        return jQuery(node).attr(name)!=null;
       },
       OnDocumentReady:function(f)
       {
        return jQuery(document).ready(f);
       },
       OnLoad:function(node,f)
       {
        return jQuery(node).ready(f);
       },
       Remove:function(node)
       {
        return jQuery(node).remove();
       },
       RemoveAttribute:function(node,name)
       {
        return jQuery(node).removeAttr(name);
       },
       RemoveClass:function(node,cls)
       {
        return jQuery(node).removeClass(cls);
       },
       SetAttribute:function(node,name,value)
       {
        return jQuery(node).attr(name,value);
       },
       SetCss:function(node,name,prop)
       {
        return jQuery(node).css(name,prop);
       },
       SetHtml:function(node,text)
       {
        return jQuery(node).html(text);
       },
       SetProperty:function(node,name,value)
       {
        var x;
        x=jQuery(node).prop(name,value);
        return x;
       },
       SetStyle:function(node,style)
       {
        return jQuery(node).attr("style",style);
       },
       SetText:function(node,text)
       {
        node.textContent=text;
       },
       SetValue:function(node,value)
       {
        return jQuery(node).val(value);
       }
      },{
       New:function()
       {
        return Runtime.New(this,{});
       }
      }),
      Tags:Runtime.Field(function()
      {
       return TagBuilder.New(Implementation.HtmlProvider());
      })
     },
     Operators:{
      OnAfterRender:function(f,w)
      {
       var r;
       r=w.Render;
       w.Render=function()
       {
        r.apply(w);
        return f(w);
       };
       return;
      },
      OnBeforeRender:function(f,w)
      {
       var r;
       r=w.Render;
       w.Render=function()
       {
        f(w);
        return r.apply(w);
       };
       return;
      },
      add:function(el,inner)
      {
       var enumerator,pl;
       enumerator=Enumerator.Get(inner);
       while(enumerator.MoveNext())
        {
         pl=enumerator.get_Current();
         el.AppendI(pl);
        }
       return el;
      }
     },
     Pagelet:Runtime.Class({
      AppendTo:function(targetId)
      {
       var target,value;
       target=document.getElementById(targetId);
       value=target.appendChild(this.get_Body());
       return this.Render();
      },
      Render:function()
      {
       return null;
      },
      ReplaceInDom:function(node)
      {
       var value;
       value=node.parentNode.replaceChild(this.get_Body(),node);
       return this.Render();
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     TagBuilder:Runtime.Class({
      NewTag:function(name,children)
      {
       var el,enumerator,pl;
       el=Element.New(this.HtmlProvider,name);
       enumerator=Enumerator.Get(children);
       while(enumerator.MoveNext())
        {
         pl=enumerator.get_Current();
         el.AppendI(pl);
        }
       return el;
      },
      text:function(data)
      {
       return Text.New(data);
      }
     },{
      New:function(HtmlProvider)
      {
       var r;
       r=Runtime.New(this,{});
       r.HtmlProvider=HtmlProvider;
       return r;
      }
     }),
     Tags:{
      Deprecated:Runtime.Field(function()
      {
       return Implementation.DeprecatedHtml();
      }),
      Tags:Runtime.Field(function()
      {
       return Implementation.Tags();
      })
     },
     Text:Runtime.Class({
      get_Body:function()
      {
       return document.createTextNode(this.text);
      }
     },{
      New:function(text)
      {
       var r;
       r=Runtime.New(this,Pagelet.New());
       r.text=text;
       return r;
      }
     })
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Implementation=Runtime.Safe(Client.Implementation);
  Attribute=Runtime.Safe(Client.Attribute);
  Pagelet=Runtime.Safe(Client.Pagelet);
  Element=Runtime.Safe(Client.Element);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  Math=Runtime.Safe(Global.Math);
  document=Runtime.Safe(Global.document);
  jQuery=Runtime.Safe(Global.jQuery);
  Events=Runtime.Safe(Client.Events);
  JQueryEventSupport=Runtime.Safe(Events.JQueryEventSupport);
  AttributeBuilder=Runtime.Safe(Client.AttributeBuilder);
  DeprecatedTagBuilder=Runtime.Safe(Client.DeprecatedTagBuilder);
  JQueryHtmlProvider=Runtime.Safe(Implementation.JQueryHtmlProvider);
  TagBuilder=Runtime.Safe(Client.TagBuilder);
  Text=Runtime.Safe(Client.Text);
  Attr=Runtime.Safe(Client.Attr);
  EventsPervasives=Runtime.Safe(Client.EventsPervasives);
  return Tags=Runtime.Safe(Client.Tags);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(Attribute,Pagelet);
  Runtime.Inherit(Element,Pagelet);
  Runtime.Inherit(Text,Pagelet);
  Tags.Tags();
  Tags.Deprecated();
  Implementation.Tags();
  Implementation.HtmlProvider();
  Implementation.DeprecatedHtml();
  Implementation.Attr();
  EventsPervasives.Events();
  Attr.Attr();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Unchecked,Seq,Option,Control,Disposable,Arrays,FSharpEvent,Util,Event,Event1,Collections,ResizeArray,ResizeArrayProxy,EventModule,HotStream,HotStream1,Concurrency,Operators,Error,setTimeout,clearTimeout,LinkedList,T,MailboxProcessor,Observable,Observer,Ref,Observable1,List,T1,Observer1;
 Runtime.Define(Global,{
  WebSharper:{
   Control:{
    Disposable:{
     Of:function(dispose)
     {
      return{
       Dispose:dispose
      };
     }
    },
    Event:{
     Event:Runtime.Class({
      AddHandler:function(h)
      {
       return this.Handlers.Add(h);
      },
      RemoveHandler:function(h)
      {
       var predicate,objectArg,action,source,option;
       predicate=function(y)
       {
        return Unchecked.Equals(h,y);
       };
       objectArg=this.Handlers;
       action=function(arg00)
       {
        return objectArg.RemoveAt(arg00);
       };
       source=this.Handlers;
       option=Seq.tryFindIndex(predicate,source);
       return Option.iter(action,option);
      },
      Subscribe:function(observer)
      {
       var h,_this=this;
       h=function(x)
       {
        return observer.OnNext(x);
       };
       this.AddHandler(h);
       return Disposable.Of(function()
       {
        return _this.RemoveHandler(h);
       });
      },
      Trigger:function(x)
      {
       var arr,idx,h;
       arr=this.Handlers.ToArray();
       for(idx=0;idx<=arr.length-1;idx++){
        h=Arrays.get(arr,idx);
        h(x);
       }
       return;
      }
     })
    },
    EventModule:{
     Choose:function(c,e)
     {
      var r;
      r=FSharpEvent.New();
      Util.addListener(e,function(x)
      {
       var matchValue,_,y;
       matchValue=c(x);
       if(matchValue.$==0)
        {
         _=null;
        }
       else
        {
         y=matchValue.$0;
         _=r.event.Trigger(y);
        }
       return _;
      });
      return r.event;
     },
     Filter:function(ok,e)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       return ok(x)?r.Trigger(x):null;
      });
      return r;
     },
     Map:function(f,e)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       return r.Trigger(f(x));
      });
      return r;
     },
     Merge:function(e1,e2)
     {
      var r;
      r=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e1,function(arg00)
      {
       return r.Trigger(arg00);
      });
      Util.addListener(e2,function(arg00)
      {
       return r.Trigger(arg00);
      });
      return r;
     },
     Pairwise:function(e)
     {
      var buf,ev;
      buf=[{
       $:0
      }];
      ev=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      Util.addListener(e,function(x)
      {
       var matchValue,_,old;
       matchValue=buf[0];
       if(matchValue.$==1)
        {
         old=matchValue.$0;
         buf[0]={
          $:1,
          $0:x
         };
         _=ev.Trigger([old,x]);
        }
       else
        {
         _=void(buf[0]={
          $:1,
          $0:x
         });
        }
       return _;
      });
      return ev;
     },
     Partition:function(f,e)
     {
      return[EventModule.Filter(f,e),EventModule.Filter(function(x)
      {
       var value;
       value=f(x);
       return!value;
      },e)];
     },
     Scan:function(fold,seed,e)
     {
      var state,f;
      state=[seed];
      f=function(value)
      {
       state[0]=(fold(state[0]))(value);
       return state[0];
      };
      return EventModule.Map(f,e);
     },
     Split:function(f,e)
     {
      var chooser,chooser1;
      chooser=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==0)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      chooser1=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==1)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      return[EventModule.Choose(chooser,e),EventModule.Choose(chooser1,e)];
     }
    },
    FSharpEvent:Runtime.Class({},{
     New:function()
     {
      var r;
      r=Runtime.New(this,{});
      r.event=Runtime.New(Event1,{
       Handlers:ResizeArrayProxy.New2()
      });
      return r;
     }
    }),
    HotStream:{
     HotStream:Runtime.Class({
      Subscribe:function(o)
      {
       var disp;
       this.Latest[0].$==1?o.OnNext(this.Latest[0].$0):null;
       disp=Util.subscribeTo(this.Event.event,function(v)
       {
        return o.OnNext(v);
       });
       return disp;
      },
      Trigger:function(v)
      {
       this.Latest[0]={
        $:1,
        $0:v
       };
       return this.Event.event.Trigger(v);
      }
     },{
      New:function()
      {
       return Runtime.New(HotStream1,{
        Latest:[{
         $:0
        }],
        Event:FSharpEvent.New()
       });
      }
     })
    },
    MailboxProcessor:Runtime.Class({
     PostAndAsyncReply:function(msgf,timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.PostAndTryAsyncReply(msgf,timeout),function(_arg4)
       {
        var _,x;
        if(_arg4.$==1)
         {
          x=_arg4.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(new Error("TimeoutException"));
         }
        return Concurrency.Return(_);
       });
      });
     },
     PostAndTryAsyncReply:function(msgf,timeout)
     {
      var timeout1,arg00,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      arg00=function(tupledArg)
      {
       var ok,_arg3,_arg4,_,arg001,waiting,arg002,value;
       ok=tupledArg[0];
       _arg3=tupledArg[1];
       _arg4=tupledArg[2];
       if(timeout1<0)
        {
         arg001=msgf(function(x)
         {
          return ok({
           $:1,
           $0:x
          });
         });
         _this.mailbox.AddLast(arg001);
         _=_this.resume();
        }
       else
        {
         waiting=[true];
         arg002=msgf(function(res)
         {
          var _1;
          if(waiting[0])
           {
            waiting[0]=false;
            _1=ok({
             $:1,
             $0:res
            });
           }
          else
           {
            _1=null;
           }
          return _1;
         });
         _this.mailbox.AddLast(arg002);
         _this.resume();
         value=setTimeout(function()
         {
          var _1;
          if(waiting[0])
           {
            waiting[0]=false;
            _1=ok({
             $:0
            });
           }
          else
           {
            _1=null;
           }
          return _1;
         },timeout1);
         _=void value;
        }
       return _;
      };
      return Concurrency.FromContinuations(arg00);
     },
     Receive:function(timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.TryReceive(timeout),function(_arg3)
       {
        var _,x;
        if(_arg3.$==1)
         {
          x=_arg3.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(new Error("TimeoutException"));
         }
        return Concurrency.Return(_);
       });
      });
     },
     Scan:function(scanner,timeout)
     {
      var _this=this;
      return Concurrency.Delay(function()
      {
       return Concurrency.Bind(_this.TryScan(scanner,timeout),function(_arg8)
       {
        var _,x;
        if(_arg8.$==1)
         {
          x=_arg8.$0;
          _=x;
         }
        else
         {
          _=Operators.Raise(new Error("TimeoutException"));
         }
        return Concurrency.Return(_);
       });
      });
     },
     Start:function()
     {
      var _,a,_this=this;
      if(this.started)
       {
        _=Operators.FailWith("The MailboxProcessor has already been started.");
       }
      else
       {
        this.started=true;
        a=Concurrency.Delay(function()
        {
         return Concurrency.TryWith(Concurrency.Delay(function()
         {
          return Concurrency.Bind(_this.initial.call(null,_this),function()
          {
           return Concurrency.Return(null);
          });
         }),function(_arg2)
         {
          _this.errorEvent.event.Trigger(_arg2);
          return Concurrency.Return(null);
         });
        });
        _=_this.startAsync(a);
       }
      return _;
     },
     TryReceive:function(timeout)
     {
      var timeout1,arg00,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      arg00=function(tupledArg)
      {
       var ok,_arg1,_arg2,_,_1,arg0,waiting,pending,arg02,arg03;
       ok=tupledArg[0];
       _arg1=tupledArg[1];
       _arg2=tupledArg[2];
       if(Unchecked.Equals(_this.mailbox.get_First(),null))
        {
         if(timeout1<0)
          {
           arg0=Concurrency.Delay(function()
           {
            var arg01;
            arg01=_this.dequeue();
            ok({
             $:1,
             $0:arg01
            });
            return Concurrency.Return(null);
           });
           _1=void(_this.savedCont={
            $:1,
            $0:arg0
           });
          }
         else
          {
           waiting=[true];
           pending=setTimeout(function()
           {
            var _2;
            if(waiting[0])
             {
              waiting[0]=false;
              _this.savedCont={
               $:0
              };
              _2=ok({
               $:0
              });
             }
            else
             {
              _2=null;
             }
            return _2;
           },timeout1);
           arg02=Concurrency.Delay(function()
           {
            var _2,arg01;
            if(waiting[0])
             {
              waiting[0]=false;
              clearTimeout(pending);
              arg01=_this.dequeue();
              ok({
               $:1,
               $0:arg01
              });
              _2=Concurrency.Return(null);
             }
            else
             {
              _2=Concurrency.Return(null);
             }
            return _2;
           });
           _1=void(_this.savedCont={
            $:1,
            $0:arg02
           });
          }
         _=_1;
        }
       else
        {
         arg03=_this.dequeue();
         _=ok({
          $:1,
          $0:arg03
         });
        }
       return _;
      };
      return Concurrency.FromContinuations(arg00);
     },
     TryScan:function(scanner,timeout)
     {
      var timeout1,_this=this;
      timeout1=Operators.DefaultArg(timeout,this.get_DefaultTimeout());
      return Concurrency.Delay(function()
      {
       var scanInbox,matchValue1,_1,found1,arg00;
       scanInbox=function()
       {
        var m,found,matchValue,_;
        m=_this.mailbox.get_First();
        found={
         $:0
        };
        while(!Unchecked.Equals(m,null))
         {
          matchValue=scanner(m.v);
          if(matchValue.$==0)
           {
            _=m=m.n;
           }
          else
           {
            _this.mailbox.Remove(m);
            m=null;
            _=found=matchValue;
           }
         }
        return found;
       };
       matchValue1=scanInbox(null);
       if(matchValue1.$==1)
        {
         found1=matchValue1.$0;
         _1=Concurrency.Bind(found1,function(_arg5)
         {
          return Concurrency.Return({
           $:1,
           $0:_arg5
          });
         });
        }
       else
        {
         arg00=function(tupledArg)
         {
          var ok,_arg5,_arg6,_,scanNext,waiting,pending,scanNext1;
          ok=tupledArg[0];
          _arg5=tupledArg[1];
          _arg6=tupledArg[2];
          if(timeout1<0)
           {
            scanNext=function()
            {
             var arg0;
             arg0=Concurrency.Delay(function()
             {
              var matchValue,_2,c;
              matchValue=scanner(_this.mailbox.get_First().v);
              if(matchValue.$==1)
               {
                c=matchValue.$0;
                _this.mailbox.RemoveFirst();
                _2=Concurrency.Bind(c,function(_arg61)
                {
                 ok({
                  $:1,
                  $0:_arg61
                 });
                 return Concurrency.Return(null);
                });
               }
              else
               {
                scanNext(null);
                _2=Concurrency.Return(null);
               }
              return _2;
             });
             _this.savedCont={
              $:1,
              $0:arg0
             };
             return;
            };
            _=scanNext(null);
           }
          else
           {
            waiting=[true];
            pending=setTimeout(function()
            {
             var _2;
             if(waiting[0])
              {
               waiting[0]=false;
               _this.savedCont={
                $:0
               };
               _2=ok({
                $:0
               });
              }
             else
              {
               _2=null;
              }
             return _2;
            },timeout1);
            scanNext1=function()
            {
             var arg0;
             arg0=Concurrency.Delay(function()
             {
              var matchValue,_2,c;
              matchValue=scanner(_this.mailbox.get_First().v);
              if(matchValue.$==1)
               {
                c=matchValue.$0;
                _this.mailbox.RemoveFirst();
                _2=Concurrency.Bind(c,function(_arg7)
                {
                 var _3;
                 if(waiting[0])
                  {
                   waiting[0]=false;
                   clearTimeout(pending);
                   ok({
                    $:1,
                    $0:_arg7
                   });
                   _3=Concurrency.Return(null);
                  }
                 else
                  {
                   _3=Concurrency.Return(null);
                  }
                 return _3;
                });
               }
              else
               {
                scanNext1(null);
                _2=Concurrency.Return(null);
               }
              return _2;
             });
             _this.savedCont={
              $:1,
              $0:arg0
             };
             return;
            };
            _=scanNext1(null);
           }
          return _;
         };
         _1=Concurrency.FromContinuations(arg00);
        }
       return _1;
      });
     },
     dequeue:function()
     {
      var f;
      f=this.mailbox.get_First().v;
      this.mailbox.RemoveFirst();
      return f;
     },
     get_CurrentQueueLength:function()
     {
      return this.mailbox.get_Count();
     },
     get_DefaultTimeout:function()
     {
      return this["DefaultTimeout@"];
     },
     get_Error:function()
     {
      return this.errorEvent.event;
     },
     resume:function()
     {
      var matchValue,_,c;
      matchValue=this.savedCont;
      if(matchValue.$==1)
       {
        c=matchValue.$0;
        this.savedCont={
         $:0
        };
        _=this.startAsync(c);
       }
      else
       {
        _=null;
       }
      return _;
     },
     set_DefaultTimeout:function(v)
     {
      this["DefaultTimeout@"]=v;
      return;
     },
     startAsync:function(a)
     {
      return Concurrency.Start(a,this.token);
     }
    },{
     New:function(initial,token)
     {
      var r,matchValue,_,ct,value;
      r=Runtime.New(this,{});
      r.initial=initial;
      r.token=token;
      r.started=false;
      r.errorEvent=FSharpEvent.New();
      r.mailbox=T.New();
      r.savedCont={
       $:0
      };
      matchValue=r.token;
      if(matchValue.$==0)
       {
        _=null;
       }
      else
       {
        ct=matchValue.$0;
        value=Concurrency.Register(ct,function()
        {
         return function()
         {
          return r.resume();
         }();
        });
        _=void value;
       }
      r["DefaultTimeout@"]=-1;
      return r;
     },
     Start:function(initial,token)
     {
      var mb;
      mb=MailboxProcessor.New(initial,token);
      mb.Start();
      return mb;
     }
    }),
    Observable:{
     Aggregate:function(io,seed,fold)
     {
      var f;
      f=function(o1)
      {
       var state,on,arg001;
       state=[seed];
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return(fold(state[0]))(v);
        },function(s)
        {
         state[0]=s;
         return o1.OnNext(s);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f);
     },
     Choose:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        var action;
        action=function(arg00)
        {
         return o1.OnNext(arg00);
        };
        return Observable.Protect(function()
        {
         return f(v);
        },function(option)
        {
         return Option.iter(action,option);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     CombineLatest:function(io1,io2,f)
     {
      var f1;
      f1=function(o)
      {
       var lv1,lv2,update,onNext,o1,onNext1,o2,d1,d2;
       lv1=[{
        $:0
       }];
       lv2=[{
        $:0
       }];
       update=function()
       {
        var matchValue,_,_1,v1,v2;
        matchValue=[lv1[0],lv2[0]];
        if(matchValue[0].$==1)
         {
          if(matchValue[1].$==1)
           {
            v1=matchValue[0].$0;
            v2=matchValue[1].$0;
            _1=Observable.Protect(function()
            {
             return(f(v1))(v2);
            },function(arg00)
            {
             return o.OnNext(arg00);
            },function(arg00)
            {
             return o.OnError(arg00);
            });
           }
          else
           {
            _1=null;
           }
          _=_1;
         }
        else
         {
          _=null;
         }
        return _;
       };
       onNext=function(x)
       {
        lv1[0]={
         $:1,
         $0:x
        };
        return update(null);
       };
       o1=Observer.New(onNext,function()
       {
       },function()
       {
       });
       onNext1=function(y)
       {
        lv2[0]={
         $:1,
         $0:y
        };
        return update(null);
       };
       o2=Observer.New(onNext1,function()
       {
       },function()
       {
       });
       d1=io1.Subscribe(o1);
       d2=io2.Subscribe(o2);
       return Disposable.Of(function()
       {
        d1.Dispose();
        return d2.Dispose();
       });
      };
      return Observable.New(f1);
     },
     Concat:function(io1,io2)
     {
      var f;
      f=function(o)
      {
       var innerDisp,outerDisp,dispose;
       innerDisp=[{
        $:0
       }];
       outerDisp=io1.Subscribe(Observer.New(function(arg00)
       {
        return o.OnNext(arg00);
       },function()
       {
       },function()
       {
        var arg0;
        arg0=io2.Subscribe(o);
        innerDisp[0]={
         $:1,
         $0:arg0
        };
       }));
       dispose=function()
       {
        innerDisp[0].$==1?innerDisp[0].$0.Dispose():null;
        return outerDisp.Dispose();
       };
       return Disposable.Of(dispose);
      };
      return Observable.New(f);
     },
     Drop:function(count,io)
     {
      var f;
      f=function(o1)
      {
       var index,on,arg00;
       index=[0];
       on=function(v)
       {
        Ref.incr(index);
        return index[0]>count?o1.OnNext(v):null;
       };
       arg00=Observer.New(on,function(arg001)
       {
        return o1.OnError(arg001);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg00);
      };
      return Observable.New(f);
     },
     Filter:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        var action;
        action=function(arg00)
        {
         return o1.OnNext(arg00);
        };
        return Observable.Protect(function()
        {
         return f(v)?{
          $:1,
          $0:v
         }:{
          $:0
         };
        },function(option)
        {
         return Option.iter(action,option);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     Map:function(f,io)
     {
      var f1;
      f1=function(o1)
      {
       var on,arg001;
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return f(v);
        },function(arg00)
        {
         return o1.OnNext(arg00);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return io.Subscribe(arg001);
      };
      return Observable.New(f1);
     },
     Merge:function(io1,io2)
     {
      var f;
      f=function(o)
      {
       var completed1,completed2,arg00,disp1,arg002,disp2;
       completed1=[false];
       completed2=[false];
       arg00=Observer.New(function(arg001)
       {
        return o.OnNext(arg001);
       },function()
       {
       },function()
       {
        completed1[0]=true;
        return(completed1[0]?completed2[0]:false)?o.OnCompleted():null;
       });
       disp1=io1.Subscribe(arg00);
       arg002=Observer.New(function(arg001)
       {
        return o.OnNext(arg001);
       },function()
       {
       },function()
       {
        completed2[0]=true;
        return(completed1[0]?completed2[0]:false)?o.OnCompleted():null;
       });
       disp2=io2.Subscribe(arg002);
       return Disposable.Of(function()
       {
        disp1.Dispose();
        return disp2.Dispose();
       });
      };
      return Observable.New(f);
     },
     Never:function()
     {
      return Observable.New(function()
      {
       return Disposable.Of(function()
       {
       });
      });
     },
     New:function(f)
     {
      return Runtime.New(Observable1,{
       Subscribe1:f
      });
     },
     Observable:Runtime.Class({
      Subscribe:function(observer)
      {
       return this.Subscribe1.call(null,observer);
      }
     }),
     Of:function(f)
     {
      return Observable.New(function(o)
      {
       return Disposable.Of(f(function(x)
       {
        return o.OnNext(x);
       }));
      });
     },
     Protect:function(f,succeed,fail)
     {
      var matchValue,_,e,_1,e1,x;
      try
      {
       _={
        $:0,
        $0:f(null)
       };
      }
      catch(e)
      {
       _={
        $:1,
        $0:e
       };
      }
      matchValue=_;
      if(matchValue.$==1)
       {
        e1=matchValue.$0;
        _1=fail(e1);
       }
      else
       {
        x=matchValue.$0;
        _1=succeed(x);
       }
      return _1;
     },
     Range:function(start,count)
     {
      var f;
      f=function(o)
      {
       var i;
       for(i=start;i<=start+count;i++){
        o.OnNext(i);
       }
       return Disposable.Of(function()
       {
       });
      };
      return Observable.New(f);
     },
     Return:function(x)
     {
      var f;
      f=function(o)
      {
       o.OnNext(x);
       o.OnCompleted();
       return Disposable.Of(function()
       {
       });
      };
      return Observable.New(f);
     },
     SelectMany:function(io)
     {
      return Observable.New(function(o)
      {
       var disp,d;
       disp=[function()
       {
       }];
       d=Util.subscribeTo(io,function(o1)
       {
        var d1;
        d1=Util.subscribeTo(o1,function(v)
        {
         return o.OnNext(v);
        });
        disp[0]=function()
        {
         disp[0].call(null,null);
         return d1.Dispose();
        };
        return;
       });
       return Disposable.Of(function()
       {
        disp[0].call(null,null);
        return d.Dispose();
       });
      });
     },
     Sequence:function(ios)
     {
      var sequence;
      sequence=function(ios1)
      {
       var _,xs,x,rest;
       if(ios1.$==1)
        {
         xs=ios1.$1;
         x=ios1.$0;
         rest=sequence(xs);
         _=Observable.CombineLatest(x,rest,function(x1)
         {
          return function(y)
          {
           return Runtime.New(T1,{
            $:1,
            $0:x1,
            $1:y
           });
          };
         });
        }
       else
        {
         _=Observable.Return(Runtime.New(T1,{
          $:0
         }));
        }
       return _;
      };
      return sequence(List.ofSeq(ios));
     },
     Switch:function(io)
     {
      return Observable.New(function(o)
      {
       var index,disp,disp1;
       index=[0];
       disp=[{
        $:0
       }];
       disp1=Util.subscribeTo(io,function(o1)
       {
        var currentIndex,arg0,d;
        Ref.incr(index);
        disp[0].$==1?disp[0].$0.Dispose():null;
        currentIndex=index[0];
        arg0=Util.subscribeTo(o1,function(v)
        {
         return currentIndex===index[0]?o.OnNext(v):null;
        });
        d={
         $:1,
         $0:arg0
        };
        disp[0]=d;
        return;
       });
       return disp1;
      });
     }
    },
    ObservableModule:{
     Pairwise:function(e)
     {
      var f;
      f=function(o1)
      {
       var last,on,arg00;
       last=[{
        $:0
       }];
       on=function(v)
       {
        var matchValue,_,l;
        matchValue=last[0];
        if(matchValue.$==1)
         {
          l=matchValue.$0;
          _=o1.OnNext([l,v]);
         }
        else
         {
          _=null;
         }
        last[0]={
         $:1,
         $0:v
        };
        return;
       };
       arg00=Observer.New(on,function(arg001)
       {
        return o1.OnError(arg001);
       },function()
       {
        return o1.OnCompleted();
       });
       return e.Subscribe(arg00);
      };
      return Observable.New(f);
     },
     Partition:function(f,e)
     {
      return[Observable.Filter(f,e),Observable.Filter(function(x)
      {
       var value;
       value=f(x);
       return!value;
      },e)];
     },
     Scan:function(fold,seed,e)
     {
      var f;
      f=function(o1)
      {
       var state,on,arg001;
       state=[seed];
       on=function(v)
       {
        return Observable.Protect(function()
        {
         return(fold(state[0]))(v);
        },function(s)
        {
         state[0]=s;
         return o1.OnNext(s);
        },function(arg00)
        {
         return o1.OnError(arg00);
        });
       };
       arg001=Observer.New(on,function(arg00)
       {
        return o1.OnError(arg00);
       },function()
       {
        return o1.OnCompleted();
       });
       return e.Subscribe(arg001);
      };
      return Observable.New(f);
     },
     Split:function(f,e)
     {
      var chooser,left,chooser1,right;
      chooser=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==0)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      left=Observable.Choose(chooser,e);
      chooser1=function(x)
      {
       var matchValue,_,x1;
       matchValue=f(x);
       if(matchValue.$==1)
        {
         x1=matchValue.$0;
         _={
          $:1,
          $0:x1
         };
        }
       else
        {
         _={
          $:0
         };
        }
       return _;
      };
      right=Observable.Choose(chooser1,e);
      return[left,right];
     }
    },
    Observer:{
     New:function(f,e,c)
     {
      return Runtime.New(Observer1,{
       onNext:f,
       onError:e,
       onCompleted:c
      });
     },
     Observer:Runtime.Class({
      OnCompleted:function()
      {
       return this.onCompleted.call(null,null);
      },
      OnError:function(e)
      {
       return this.onError.call(null,e);
      },
      OnNext:function(x)
      {
       return this.onNext.call(null,x);
      }
     }),
     Of:function(f)
     {
      return Runtime.New(Observer1,{
       onNext:function(x)
       {
        return f(x);
       },
       onError:function(x)
       {
        return Operators.Raise(x);
       },
       onCompleted:function()
       {
        return null;
       }
      });
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Option=Runtime.Safe(Global.WebSharper.Option);
  Control=Runtime.Safe(Global.WebSharper.Control);
  Disposable=Runtime.Safe(Control.Disposable);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  FSharpEvent=Runtime.Safe(Control.FSharpEvent);
  Util=Runtime.Safe(Global.WebSharper.Util);
  Event=Runtime.Safe(Control.Event);
  Event1=Runtime.Safe(Event.Event);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
  EventModule=Runtime.Safe(Control.EventModule);
  HotStream=Runtime.Safe(Control.HotStream);
  HotStream1=Runtime.Safe(HotStream.HotStream);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Error=Runtime.Safe(Global.Error);
  setTimeout=Runtime.Safe(Global.setTimeout);
  clearTimeout=Runtime.Safe(Global.clearTimeout);
  LinkedList=Runtime.Safe(Collections.LinkedList);
  T=Runtime.Safe(LinkedList.T);
  MailboxProcessor=Runtime.Safe(Control.MailboxProcessor);
  Observable=Runtime.Safe(Control.Observable);
  Observer=Runtime.Safe(Control.Observer);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  Observable1=Runtime.Safe(Observable.Observable);
  List=Runtime.Safe(Global.WebSharper.List);
  T1=Runtime.Safe(List.T);
  return Observer1=Runtime.Safe(Observer.Observer);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Collections,BalancedTree,Operators,Arrays,Seq,List,T,JavaScript,JSModule,Enumerator,DictionaryUtil,Dictionary,Unchecked,FSharpMap,Pair,Option,MapUtil,FSharpSet,SetModule,SetUtil,Array,HashSetUtil,HashSetProxy,LinkedList,E,T1,ResizeArray,ResizeArrayProxy;
 Runtime.Define(Global,{
  WebSharper:{
   Collections:{
    BalancedTree:{
     Add:function(x,t)
     {
      return BalancedTree.Put(function()
      {
       return function(x1)
       {
        return x1;
       };
      },x,t);
     },
     Branch:function(node,left,right)
     {
      return{
       Node:node,
       Left:left,
       Right:right,
       Height:1+Operators.Max(left==null?0:left.Height,right==null?0:right.Height),
       Count:1+(left==null?0:left.Count)+(right==null?0:right.Count)
      };
     },
     Build:function(data,min,max)
     {
      var sz,_,center,left,right;
      sz=max-min+1;
      if(sz<=0)
       {
        _=null;
       }
      else
       {
        center=(min+max)/2>>0;
        left=BalancedTree.Build(data,min,center-1);
        right=BalancedTree.Build(data,center+1,max);
        _=BalancedTree.Branch(Arrays.get(data,center),left,right);
       }
      return _;
     },
     Contains:function(v,t)
     {
      return!((BalancedTree.Lookup(v,t))[0]==null);
     },
     Enumerate:function(flip,t)
     {
      var gen;
      gen=function(tupledArg)
      {
       var t1,spine,_,_1,t2,spine1,other;
       t1=tupledArg[0];
       spine=tupledArg[1];
       if(t1==null)
        {
         if(spine.$==1)
          {
           t2=spine.$0[0];
           spine1=spine.$1;
           other=spine.$0[1];
           _1={
            $:1,
            $0:[t2,[other,spine1]]
           };
          }
         else
          {
           _1={
            $:0
           };
          }
         _=_1;
        }
       else
        {
         _=flip?gen([t1.Right,Runtime.New(T,{
          $:1,
          $0:[t1.Node,t1.Left],
          $1:spine
         })]):gen([t1.Left,Runtime.New(T,{
          $:1,
          $0:[t1.Node,t1.Right],
          $1:spine
         })]);
        }
       return _;
      };
      return Seq.unfold(gen,[t,Runtime.New(T,{
       $:0
      })]);
     },
     Lookup:function(k,t)
     {
      var spine,t1,loop,_,matchValue,_1;
      spine=[];
      t1=t;
      loop=true;
      while(loop)
       {
        if(t1==null)
         {
          _=loop=false;
         }
        else
         {
          matchValue=Operators.Compare(k,t1.Node);
          if(matchValue===0)
           {
            _1=loop=false;
           }
          else
           {
            if(matchValue===1)
             {
              spine.unshift([true,t1.Node,t1.Left]);
              _1=t1=t1.Right;
             }
            else
             {
              spine.unshift([false,t1.Node,t1.Right]);
              _1=t1=t1.Left;
             }
           }
          _=_1;
         }
       }
      return[t1,spine];
     },
     OfSeq:function(data)
     {
      var data1;
      data1=Arrays.sort(Seq.toArray(Seq.distinct(data)));
      return BalancedTree.Build(data1,0,data1.length-1);
     },
     Put:function(combine,k,t)
     {
      var patternInput,t1,spine;
      patternInput=BalancedTree.Lookup(k,t);
      t1=patternInput[0];
      spine=patternInput[1];
      return t1==null?BalancedTree.Rebuild(spine,BalancedTree.Branch(k,null,null)):BalancedTree.Rebuild(spine,BalancedTree.Branch((combine(t1.Node))(k),t1.Left,t1.Right));
     },
     Rebuild:function(spine,t)
     {
      var h,t1,i,matchValue,_,x1,l,_1,_2,m,x2,r,_3,_4,m1;
      h=function(x)
      {
       return x==null?0:x.Height;
      };
      t1=t;
      for(i=0;i<=Arrays.length(spine)-1;i++){
       matchValue=Arrays.get(spine,i);
       if(matchValue[0])
        {
         x1=matchValue[1];
         l=matchValue[2];
         if(h(t1)>h(l)+1)
          {
           if(h(t1.Left)===h(t1.Right)+1)
            {
             m=t1.Left;
             _2=BalancedTree.Branch(m.Node,BalancedTree.Branch(x1,l,m.Left),BalancedTree.Branch(t1.Node,m.Right,t1.Right));
            }
           else
            {
             _2=BalancedTree.Branch(t1.Node,BalancedTree.Branch(x1,l,t1.Left),t1.Right);
            }
           _1=_2;
          }
         else
          {
           _1=BalancedTree.Branch(x1,l,t1);
          }
         _=_1;
        }
       else
        {
         x2=matchValue[1];
         r=matchValue[2];
         if(h(t1)>h(r)+1)
          {
           if(h(t1.Right)===h(t1.Left)+1)
            {
             m1=t1.Right;
             _4=BalancedTree.Branch(m1.Node,BalancedTree.Branch(t1.Node,t1.Left,m1.Left),BalancedTree.Branch(x2,m1.Right,r));
            }
           else
            {
             _4=BalancedTree.Branch(t1.Node,t1.Left,BalancedTree.Branch(x2,t1.Right,r));
            }
           _3=_4;
          }
         else
          {
           _3=BalancedTree.Branch(x2,t1,r);
          }
         _=_3;
        }
       t1=_;
      }
      return t1;
     },
     Remove:function(k,src)
     {
      var patternInput,t,spine,_,_1,_2,source,data,t1;
      patternInput=BalancedTree.Lookup(k,src);
      t=patternInput[0];
      spine=patternInput[1];
      if(t==null)
       {
        _=src;
       }
      else
       {
        if(t.Right==null)
         {
          _1=BalancedTree.Rebuild(spine,t.Left);
         }
        else
         {
          if(t.Left==null)
           {
            _2=BalancedTree.Rebuild(spine,t.Right);
           }
          else
           {
            source=Seq.append(BalancedTree.Enumerate(false,t.Left),BalancedTree.Enumerate(false,t.Right));
            data=Seq.toArray(source);
            t1=BalancedTree.Build(data,0,data.length-1);
            _2=BalancedTree.Rebuild(spine,t1);
           }
          _1=_2;
         }
        _=_1;
       }
      return _;
     },
     TryFind:function(v,t)
     {
      var x;
      x=(BalancedTree.Lookup(v,t))[0];
      return x==null?{
       $:0
      }:{
       $:1,
       $0:x.Node
      };
     }
    },
    Dictionary:Runtime.Class({
     Add:function(k,v)
     {
      var h,_;
      h=this.hash.call(null,k);
      if(this.data.hasOwnProperty(h))
       {
        _=Operators.FailWith("An item with the same key has already been added.");
       }
      else
       {
        this.data[h]={
         K:k,
         V:v
        };
        _=void(this.count=this.count+1);
       }
      return _;
     },
     Clear:function()
     {
      this.data={};
      this.count=0;
      return;
     },
     ContainsKey:function(k)
     {
      return this.data.hasOwnProperty(this.hash.call(null,k));
     },
     GetEnumerator:function()
     {
      var s;
      s=JSModule.GetFieldValues(this.data);
      return Enumerator.Get(s);
     },
     Remove:function(k)
     {
      var h,_;
      h=this.hash.call(null,k);
      if(this.data.hasOwnProperty(h))
       {
        JSModule.Delete(this.data,h);
        this.count=this.count-1;
        _=true;
       }
      else
       {
        _=false;
       }
      return _;
     },
     get_Item:function(k)
     {
      var k1,_,x;
      k1=this.hash.call(null,k);
      if(this.data.hasOwnProperty(k1))
       {
        x=this.data[k1];
        _=x.V;
       }
      else
       {
        _=DictionaryUtil.notPresent();
       }
      return _;
     },
     set_Item:function(k,v)
     {
      var h;
      h=this.hash.call(null,k);
      !this.data.hasOwnProperty(h)?void(this.count=this.count+1):null;
      this.data[h]={
       K:k,
       V:v
      };
      return;
     }
    },{
     New:function(dictionary)
     {
      return Runtime.New(this,Dictionary.New4(dictionary,function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New1:function(dictionary,comparer)
     {
      return Runtime.New(this,Dictionary.New4(dictionary,function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New11:function(capacity,comparer)
     {
      return Runtime.New(this,Dictionary.New3(comparer));
     },
     New12:function()
     {
      return Runtime.New(this,Dictionary.New4([],function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New2:function()
     {
      return Runtime.New(this,Dictionary.New12());
     },
     New3:function(comparer)
     {
      return Runtime.New(this,Dictionary.New4([],function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New4:function(init,equals,hash)
     {
      var r,enumerator,x,x1;
      r=Runtime.New(this,{});
      r.hash=hash;
      r.count=0;
      r.data={};
      enumerator=Enumerator.Get(init);
      while(enumerator.MoveNext())
       {
        x=enumerator.get_Current();
        x1=x.K;
        r.data[r.hash.call(null,x1)]=x.V;
       }
      return r;
     }
    }),
    DictionaryUtil:{
     notPresent:function()
     {
      return Operators.FailWith("The given key was not present in the dictionary.");
     }
    },
    FSharpMap:Runtime.Class({
     Add:function(k,v)
     {
      var x,x1;
      x=this.tree;
      x1=Runtime.New(Pair,{
       Key:k,
       Value:v
      });
      return FSharpMap.New(BalancedTree.Add(x1,x));
     },
     CompareTo:function(other)
     {
      return Seq.compareWith(function(x)
      {
       return function(y)
       {
        return Operators.Compare(x,y);
       };
      },this,other);
     },
     ContainsKey:function(k)
     {
      var x,v;
      x=this.tree;
      v=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      return BalancedTree.Contains(v,x);
     },
     Equals:function(other)
     {
      return this.get_Count()===other.get_Count()?Seq.forall2(function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },this,other):false;
     },
     GetEnumerator:function()
     {
      var mapping,source,s;
      mapping=function(kv)
      {
       return{
        K:kv.Key,
        V:kv.Value
       };
      };
      source=BalancedTree.Enumerate(false,this.tree);
      s=Seq.map(mapping,source);
      return Enumerator.Get(s);
     },
     GetHashCode:function()
     {
      return Unchecked.Hash(Seq.toArray(this));
     },
     Remove:function(k)
     {
      var x,k1;
      x=this.tree;
      k1=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      return FSharpMap.New(BalancedTree.Remove(k1,x));
     },
     TryFind:function(k)
     {
      var x,v,mapping,option;
      x=this.tree;
      v=Runtime.New(Pair,{
       Key:k,
       Value:undefined
      });
      mapping=function(kv)
      {
       return kv.Value;
      };
      option=BalancedTree.TryFind(v,x);
      return Option.map(mapping,option);
     },
     get_Count:function()
     {
      var tree;
      tree=this.tree;
      return tree==null?0:tree.Count;
     },
     get_IsEmpty:function()
     {
      return this.tree==null;
     },
     get_Item:function(k)
     {
      var matchValue,_,v;
      matchValue=this.TryFind(k);
      if(matchValue.$==0)
       {
        _=Operators.FailWith("The given key was not present in the dictionary.");
       }
      else
       {
        v=matchValue.$0;
        _=v;
       }
      return _;
     },
     get_Tree:function()
     {
      return this.tree;
     }
    },{
     New:function(tree)
     {
      var r;
      r=Runtime.New(this,{});
      r.tree=tree;
      return r;
     },
     New1:function(s)
     {
      return Runtime.New(this,FSharpMap.New(MapUtil.fromSeq(s)));
     }
    }),
    FSharpSet:Runtime.Class({
     Add:function(x)
     {
      return FSharpSet.New1(BalancedTree.Add(x,this.tree));
     },
     CompareTo:function(other)
     {
      return Seq.compareWith(function(e1)
      {
       return function(e2)
       {
        return Operators.Compare(e1,e2);
       };
      },this,other);
     },
     Contains:function(v)
     {
      return BalancedTree.Contains(v,this.tree);
     },
     Equals:function(other)
     {
      return this.get_Count()===other.get_Count()?Seq.forall2(function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },this,other):false;
     },
     GetEnumerator:function()
     {
      return Enumerator.Get(BalancedTree.Enumerate(false,this.tree));
     },
     GetHashCode:function()
     {
      return-1741749453+Unchecked.Hash(Seq.toArray(this));
     },
     IsProperSubsetOf:function(s)
     {
      return this.IsSubsetOf(s)?this.get_Count()<s.get_Count():false;
     },
     IsProperSupersetOf:function(s)
     {
      return this.IsSupersetOf(s)?this.get_Count()>s.get_Count():false;
     },
     IsSubsetOf:function(s)
     {
      return Seq.forall(function(arg00)
      {
       return s.Contains(arg00);
      },this);
     },
     IsSupersetOf:function(s)
     {
      var _this=this;
      return Seq.forall(function(arg00)
      {
       return _this.Contains(arg00);
      },s);
     },
     Remove:function(v)
     {
      return FSharpSet.New1(BalancedTree.Remove(v,this.tree));
     },
     add:function(x)
     {
      return FSharpSet.New1(BalancedTree.OfSeq(Seq.append(this,x)));
     },
     get_Count:function()
     {
      var tree;
      tree=this.tree;
      return tree==null?0:tree.Count;
     },
     get_IsEmpty:function()
     {
      return this.tree==null;
     },
     get_MaximumElement:function()
     {
      return Seq.head(BalancedTree.Enumerate(true,this.tree));
     },
     get_MinimumElement:function()
     {
      return Seq.head(BalancedTree.Enumerate(false,this.tree));
     },
     get_Tree:function()
     {
      return this.tree;
     },
     sub:function(x)
     {
      return SetModule.Filter(function(x1)
      {
       return!x.Contains(x1);
      },this);
     }
    },{
     New:function(s)
     {
      return Runtime.New(this,FSharpSet.New1(SetUtil.ofSeq(s)));
     },
     New1:function(tree)
     {
      var r;
      r=Runtime.New(this,{});
      r.tree=tree;
      return r;
     }
    }),
    HashSetProxy:Runtime.Class({
     Add:function(item)
     {
      return this.add(item);
     },
     Clear:function()
     {
      this.data=Array.prototype.constructor.apply(Array,[]);
      this.count=0;
      return;
     },
     Contains:function(item)
     {
      var arr;
      arr=this.data[this.hash.call(null,item)];
      return arr==null?false:this.arrContains(item,arr);
     },
     CopyTo:function(arr)
     {
      var i,all,i1;
      i=0;
      all=HashSetUtil.concat(this.data);
      for(i1=0;i1<=all.length-1;i1++){
       Arrays.set(arr,i1,all[i1]);
      }
      return;
     },
     ExceptWith:function(xs)
     {
      var enumerator,item,value;
      enumerator=Enumerator.Get(xs);
      while(enumerator.MoveNext())
       {
        item=enumerator.get_Current();
        value=this.Remove(item);
       }
      return;
     },
     GetEnumerator:function()
     {
      return Enumerator.Get(HashSetUtil.concat(this.data));
     },
     IntersectWith:function(xs)
     {
      var other,all,i,item,value,_,value1;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      all=HashSetUtil.concat(this.data);
      for(i=0;i<=all.length-1;i++){
       item=all[i];
       value=other.Contains(item);
       if(!value)
        {
         value1=this.Remove(item);
         _=void value1;
        }
       else
        {
         _=null;
        }
      }
      return;
     },
     IsProperSubsetOf:function(xs)
     {
      var other;
      other=Arrays.ofSeq(xs);
      return this.count<Arrays.length(other)?this.IsSubsetOf(other):false;
     },
     IsProperSupersetOf:function(xs)
     {
      var other;
      other=Arrays.ofSeq(xs);
      return this.count>Arrays.length(other)?this.IsSupersetOf(other):false;
     },
     IsSubsetOf:function(xs)
     {
      var other,predicate,array;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      predicate=function(arg00)
      {
       return other.Contains(arg00);
      };
      array=HashSetUtil.concat(this.data);
      return Seq.forall(predicate,array);
     },
     IsSupersetOf:function(xs)
     {
      var predicate,x=this;
      predicate=function(arg00)
      {
       return x.Contains(arg00);
      };
      return Seq.forall(predicate,xs);
     },
     Overlaps:function(xs)
     {
      var predicate,x=this;
      predicate=function(arg00)
      {
       return x.Contains(arg00);
      };
      return Seq.exists(predicate,xs);
     },
     Remove:function(item)
     {
      var h,arr,_,_1;
      h=this.hash.call(null,item);
      arr=this.data[h];
      if(arr==null)
       {
        _=false;
       }
      else
       {
        if(this.arrRemove(item,arr))
         {
          this.count=this.count-1;
          _1=true;
         }
        else
         {
          _1=false;
         }
        _=_1;
       }
      return _;
     },
     RemoveWhere:function(cond)
     {
      var all,i,item,_,value;
      all=HashSetUtil.concat(this.data);
      for(i=0;i<=all.length-1;i++){
       item=all[i];
       if(cond(item))
        {
         value=this.Remove(item);
         _=void value;
        }
       else
        {
         _=null;
        }
      }
      return;
     },
     SetEquals:function(xs)
     {
      var other;
      other=HashSetProxy.New3(xs,this.equals,this.hash);
      return this.get_Count()===other.get_Count()?this.IsSupersetOf(other):false;
     },
     SymmetricExceptWith:function(xs)
     {
      var enumerator,item,_,value,value1;
      enumerator=Enumerator.Get(xs);
      while(enumerator.MoveNext())
       {
        item=enumerator.get_Current();
        if(this.Contains(item))
         {
          value=this.Remove(item);
          _=void value;
         }
        else
         {
          value1=this.Add(item);
          _=void value1;
         }
       }
      return;
     },
     UnionWith:function(xs)
     {
      var enumerator,item,value;
      enumerator=Enumerator.Get(xs);
      while(enumerator.MoveNext())
       {
        item=enumerator.get_Current();
        value=this.Add(item);
       }
      return;
     },
     add:function(item)
     {
      var h,arr,_,_1,value;
      h=this.hash.call(null,item);
      arr=this.data[h];
      if(arr==null)
       {
        this.data[h]=[item];
        this.count=this.count+1;
        _=true;
       }
      else
       {
        if(this.arrContains(item,arr))
         {
          _1=false;
         }
        else
         {
          value=arr.push(item);
          this.count=this.count+1;
          _1=true;
         }
        _=_1;
       }
      return _;
     },
     arrContains:function(item,arr)
     {
      var c,i,l;
      c=true;
      i=0;
      l=arr.length;
      while(c?i<l:false)
       {
        (this.equals.call(null,arr[i]))(item)?c=false:i=i+1;
       }
      return!c;
     },
     arrRemove:function(item,arr)
     {
      var c,i,l,_,start,ps,value;
      c=true;
      i=0;
      l=arr.length;
      while(c?i<l:false)
       {
        if((this.equals.call(null,arr[i]))(item))
         {
          start=i;
          ps=[];
          value=arr.splice.apply(arr,[start,1].concat(ps));
          _=c=false;
         }
        else
         {
          _=i=i+1;
         }
       }
      return!c;
     },
     get_Count:function()
     {
      return this.count;
     }
    },{
     New:function(init)
     {
      return Runtime.New(this,HashSetProxy.New3(init,function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New1:function(comparer)
     {
      return Runtime.New(this,HashSetProxy.New3(Seq.empty(),function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New11:function()
     {
      return Runtime.New(this,HashSetProxy.New3(Seq.empty(),function(x)
      {
       return function(y)
       {
        return Unchecked.Equals(x,y);
       };
      },function(obj)
      {
       return Unchecked.Hash(obj);
      }));
     },
     New2:function(init,comparer)
     {
      return Runtime.New(this,HashSetProxy.New3(init,function(x)
      {
       return function(y)
       {
        return comparer.Equals(x,y);
       };
      },function(x)
      {
       return comparer.GetHashCode(x);
      }));
     },
     New3:function(init,equals,hash)
     {
      var r,enumerator,x,value;
      r=Runtime.New(this,{});
      r.equals=equals;
      r.hash=hash;
      r.data=Array.prototype.constructor.apply(Array,[]);
      r.count=0;
      enumerator=Enumerator.Get(init);
      while(enumerator.MoveNext())
       {
        x=enumerator.get_Current();
        value=r.add(x);
       }
      return r;
     }
    }),
    HashSetUtil:{
     concat:function($o)
     {
      var $0=this,$this=this;
      var r=[];
      for(var k in $o){
       r.push.apply(r,$o[k]);
      }
      ;
      return r;
     }
    },
    LinkedList:{
     E:Runtime.Class({
      Dispose:function()
      {
       return null;
      },
      MoveNext:function()
      {
       this.c=this.c.n;
       return!Unchecked.Equals(this.c,null);
      },
      get_Current:function()
      {
       return this.c.v;
      }
     },{
      New:function(l)
      {
       var r;
       r=Runtime.New(this,{});
       r.c=l;
       return r;
      }
     }),
     T:Runtime.Class({
      AddAfter:function(after,value)
      {
       var before,node,_;
       before=after.n;
       node={
        p:after,
        n:before,
        v:value
       };
       Unchecked.Equals(after.n,null)?void(this.p=node):null;
       after.n=node;
       if(!Unchecked.Equals(before,null))
        {
         before.p=node;
         _=node;
        }
       else
        {
         _=null;
        }
       this.c=this.c+1;
       return node;
      },
      AddBefore:function(before,value)
      {
       var after,node,_;
       after=before.p;
       node={
        p:after,
        n:before,
        v:value
       };
       Unchecked.Equals(before.p,null)?void(this.n=node):null;
       before.p=node;
       if(!Unchecked.Equals(after,null))
        {
         after.n=node;
         _=node;
        }
       else
        {
         _=null;
        }
       this.c=this.c+1;
       return node;
      },
      AddFirst:function(value)
      {
       var _,node;
       if(this.c===0)
        {
         node={
          p:null,
          n:null,
          v:value
         };
         this.n=node;
         this.p=this.n;
         this.c=1;
         _=node;
        }
       else
        {
         _=this.AddBefore(this.n,value);
        }
       return _;
      },
      AddLast:function(value)
      {
       var _,node;
       if(this.c===0)
        {
         node={
          p:null,
          n:null,
          v:value
         };
         this.n=node;
         this.p=this.n;
         this.c=1;
         _=node;
        }
       else
        {
         _=this.AddAfter(this.p,value);
        }
       return _;
      },
      Clear:function()
      {
       this.c=0;
       this.n=null;
       this.p=null;
       return;
      },
      Contains:function(value)
      {
       var found,node;
       found=false;
       node=this.n;
       while(!Unchecked.Equals(node,null)?!found:false)
        {
         node.v==value?found=true:node=node.n;
        }
       return found;
      },
      Find:function(value)
      {
       var node,notFound;
       node=this.n;
       notFound=true;
       while(notFound?!Unchecked.Equals(node,null):false)
        {
         node.v==value?notFound=false:node=node.n;
        }
       return notFound?null:node;
      },
      FindLast:function(value)
      {
       var node,notFound;
       node=this.p;
       notFound=true;
       while(notFound?!Unchecked.Equals(node,null):false)
        {
         node.v==value?notFound=false:node=node.p;
        }
       return notFound?null:node;
      },
      GetEnumerator:function()
      {
       return E.New(this);
      },
      Remove:function(node)
      {
       var before,after,_,_1;
       before=node.p;
       after=node.n;
       if(Unchecked.Equals(before,null))
        {
         _=void(this.n=after);
        }
       else
        {
         before.n=after;
         _=after;
        }
       if(Unchecked.Equals(after,null))
        {
         _1=void(this.p=before);
        }
       else
        {
         after.p=before;
         _1=before;
        }
       this.c=this.c-1;
       return;
      },
      Remove1:function(value)
      {
       var node,_;
       node=this.Find(value);
       if(Unchecked.Equals(node,null))
        {
         _=false;
        }
       else
        {
         this.Remove(node);
         _=true;
        }
       return _;
      },
      RemoveFirst:function()
      {
       return this.Remove(this.n);
      },
      RemoveLast:function()
      {
       return this.Remove(this.p);
      },
      get_Count:function()
      {
       return this.c;
      },
      get_First:function()
      {
       return this.n;
      },
      get_Last:function()
      {
       return this.p;
      }
     },{
      New:function()
      {
       return Runtime.New(this,T1.New1(Seq.empty()));
      },
      New1:function(coll)
      {
       var r,ie,_,node;
       r=Runtime.New(this,{});
       r.c=0;
       r.n=null;
       r.p=null;
       ie=Enumerator.Get(coll);
       if(ie.MoveNext())
        {
         r.n={
          p:null,
          n:null,
          v:ie.get_Current()
         };
         r.p=r.n;
         _=void(r.c=1);
        }
       else
        {
         _=null;
        }
       while(ie.MoveNext())
        {
         node={
          p:r.p,
          n:null,
          v:ie.get_Current()
         };
         r.p.n=node;
         r.p=node;
         r.c=r.c+1;
        }
       return r;
      }
     })
    },
    MapModule:{
     Exists:function(f,m)
     {
      var predicate;
      predicate=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.exists(predicate,m);
     },
     Filter:function(f,m)
     {
      var predicate,source,source1,data,t;
      predicate=function(kv)
      {
       return(f(kv.Key))(kv.Value);
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      source1=Seq.filter(predicate,source);
      data=Seq.toArray(source1);
      t=BalancedTree.Build(data,0,data.length-1);
      return FSharpMap.New(t);
     },
     FindKey:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V)?{
        $:1,
        $0:kv.K
       }:{
        $:0
       };
      };
      return Seq.pick(chooser,m);
     },
     Fold:function(f,s,m)
     {
      var folder,source;
      folder=function(s1)
      {
       return function(kv)
       {
        return((f(s1))(kv.Key))(kv.Value);
       };
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      return Seq.fold(folder,s,source);
     },
     FoldBack:function(f,m,s)
     {
      var folder,source;
      folder=function(s1)
      {
       return function(kv)
       {
        return((f(kv.Key))(kv.Value))(s1);
       };
      };
      source=BalancedTree.Enumerate(true,m.get_Tree());
      return Seq.fold(folder,s,source);
     },
     ForAll:function(f,m)
     {
      var predicate;
      predicate=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.forall(predicate,m);
     },
     Iterate:function(f,m)
     {
      var action;
      action=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.iter(action,m);
     },
     Map:function(f,m)
     {
      var mapping,source,data,t;
      mapping=function(kv)
      {
       return Runtime.New(Pair,{
        Key:kv.Key,
        Value:(f(kv.Key))(kv.Value)
       });
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      data=Seq.map(mapping,source);
      t=BalancedTree.OfSeq(data);
      return FSharpMap.New(t);
     },
     OfArray:function(a)
     {
      var mapping,data,t;
      mapping=function(tupledArg)
      {
       var k,v;
       k=tupledArg[0];
       v=tupledArg[1];
       return Runtime.New(Pair,{
        Key:k,
        Value:v
       });
      };
      data=Seq.map(mapping,a);
      t=BalancedTree.OfSeq(data);
      return FSharpMap.New(t);
     },
     Partition:function(f,m)
     {
      var predicate,array,patternInput,y,x;
      predicate=function(kv)
      {
       return(f(kv.Key))(kv.Value);
      };
      array=Seq.toArray(BalancedTree.Enumerate(false,m.get_Tree()));
      patternInput=Arrays.partition(predicate,array);
      y=patternInput[1];
      x=patternInput[0];
      return[FSharpMap.New(BalancedTree.Build(x,0,x.length-1)),FSharpMap.New(BalancedTree.Build(y,0,y.length-1))];
     },
     Pick:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.pick(chooser,m);
     },
     ToSeq:function(m)
     {
      var mapping,source;
      mapping=function(kv)
      {
       return[kv.Key,kv.Value];
      };
      source=BalancedTree.Enumerate(false,m.get_Tree());
      return Seq.map(mapping,source);
     },
     TryFind:function(k,m)
     {
      return m.TryFind(k);
     },
     TryFindKey:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V)?{
        $:1,
        $0:kv.K
       }:{
        $:0
       };
      };
      return Seq.tryPick(chooser,m);
     },
     TryPick:function(f,m)
     {
      var chooser;
      chooser=function(kv)
      {
       return(f(kv.K))(kv.V);
      };
      return Seq.tryPick(chooser,m);
     }
    },
    MapUtil:{
     fromSeq:function(s)
     {
      var a;
      a=Seq.toArray(Seq.delay(function()
      {
       return Seq.collect(function(matchValue)
       {
        var v,k;
        v=matchValue[1];
        k=matchValue[0];
        return[Runtime.New(Pair,{
         Key:k,
         Value:v
        })];
       },Seq.distinctBy(function(tuple)
       {
        return tuple[0];
       },s));
      }));
      Arrays.sortInPlace(a);
      return BalancedTree.Build(a,0,a.length-1);
     }
    },
    Pair:Runtime.Class({
     CompareTo:function(other)
     {
      return Operators.Compare(this.Key,other.Key);
     },
     Equals:function(other)
     {
      return Unchecked.Equals(this.Key,other.Key);
     },
     GetHashCode:function()
     {
      return Unchecked.Hash(this.Key);
     }
    }),
    ResizeArray:{
     ResizeArrayProxy:Runtime.Class({
      Add:function(x)
      {
       return this.arr.push(x);
      },
      AddRange:function(x)
      {
       var _this=this;
       return Seq.iter(function(arg00)
       {
        return _this.Add(arg00);
       },x);
      },
      Clear:function()
      {
       var value;
       value=ResizeArray.splice(this.arr,0,Arrays.length(this.arr),[]);
       return;
      },
      CopyTo:function(arr)
      {
       return this.CopyTo1(arr,0);
      },
      CopyTo1:function(arr,offset)
      {
       return this.CopyTo2(0,arr,offset,this.get_Count());
      },
      CopyTo2:function(index,target,offset,count)
      {
       return Arrays.blit(this.arr,index,target,offset,count);
      },
      GetEnumerator:function()
      {
       return Enumerator.Get(this.arr);
      },
      GetRange:function(index,count)
      {
       return ResizeArrayProxy.New11(Arrays.sub(this.arr,index,count));
      },
      Insert:function(index,items)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,0,[items]);
       return;
      },
      InsertRange:function(index,items)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,0,Seq.toArray(items));
       return;
      },
      RemoveAt:function(x)
      {
       var value;
       value=ResizeArray.splice(this.arr,x,1,[]);
       return;
      },
      RemoveRange:function(index,count)
      {
       var value;
       value=ResizeArray.splice(this.arr,index,count,[]);
       return;
      },
      Reverse:function()
      {
       return this.arr.reverse();
      },
      Reverse1:function(index,count)
      {
       return Arrays.reverse(this.arr,index,count);
      },
      ToArray:function()
      {
       return this.arr.slice();
      },
      get_Count:function()
      {
       return Arrays.length(this.arr);
      },
      get_Item:function(x)
      {
       return Arrays.get(this.arr,x);
      },
      set_Item:function(x,v)
      {
       return Arrays.set(this.arr,x,v);
      }
     },{
      New:function(el)
      {
       return Runtime.New(this,ResizeArrayProxy.New11(Seq.toArray(el)));
      },
      New1:function()
      {
       return Runtime.New(this,ResizeArrayProxy.New11([]));
      },
      New11:function(arr)
      {
       var r;
       r=Runtime.New(this,{});
       r.arr=arr;
       return r;
      },
      New2:function()
      {
       return Runtime.New(this,ResizeArrayProxy.New11([]));
      }
     }),
     splice:function($arr,$index,$howMany,$items)
     {
      var $0=this,$this=this;
      return Global.Array.prototype.splice.apply($arr,[$index,$howMany].concat($items));
     }
    },
    SetModule:{
     Filter:function(f,s)
     {
      var data;
      data=Seq.toArray(Seq.filter(f,s));
      return FSharpSet.New1(BalancedTree.Build(data,0,data.length-1));
     },
     FoldBack:function(f,a,s)
     {
      return Seq.fold(function(s1)
      {
       return function(x)
       {
        return(f(x))(s1);
       };
      },s,BalancedTree.Enumerate(true,a.get_Tree()));
     },
     Partition:function(f,a)
     {
      var patternInput,y,x;
      patternInput=Arrays.partition(f,Seq.toArray(a));
      y=patternInput[1];
      x=patternInput[0];
      return[FSharpSet.New1(BalancedTree.OfSeq(x)),FSharpSet.New1(BalancedTree.OfSeq(y))];
     }
    },
    SetUtil:{
     ofSeq:function(s)
     {
      var a;
      a=Seq.toArray(s);
      Arrays.sortInPlace(a);
      return BalancedTree.Build(a,0,a.length-1);
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  BalancedTree=Runtime.Safe(Collections.BalancedTree);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  List=Runtime.Safe(Global.WebSharper.List);
  T=Runtime.Safe(List.T);
  JavaScript=Runtime.Safe(Global.WebSharper.JavaScript);
  JSModule=Runtime.Safe(JavaScript.JSModule);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  DictionaryUtil=Runtime.Safe(Collections.DictionaryUtil);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  FSharpMap=Runtime.Safe(Collections.FSharpMap);
  Pair=Runtime.Safe(Collections.Pair);
  Option=Runtime.Safe(Global.WebSharper.Option);
  MapUtil=Runtime.Safe(Collections.MapUtil);
  FSharpSet=Runtime.Safe(Collections.FSharpSet);
  SetModule=Runtime.Safe(Collections.SetModule);
  SetUtil=Runtime.Safe(Collections.SetUtil);
  Array=Runtime.Safe(Global.Array);
  HashSetUtil=Runtime.Safe(Collections.HashSetUtil);
  HashSetProxy=Runtime.Safe(Collections.HashSetProxy);
  LinkedList=Runtime.Safe(Collections.LinkedList);
  E=Runtime.Safe(LinkedList.E);
  T1=Runtime.Safe(LinkedList.T);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  return ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
 });
 Runtime.OnLoad(function()
 {
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,IntelliFactory,Reactive,Disposable,HotStream,Control,FSharpEvent,Observer,Observable,Util,Collections,Dictionary,Ref,Seq,Reactive1,Reactive2,List,T;
 Runtime.Define(Global,{
  IntelliFactory:{
   Reactive:{
    Disposable:Runtime.Class({
     Dispose:function()
     {
      return this.Dispose1.call(null,null);
     }
    },{
     New:function(d)
     {
      return Runtime.New(Disposable,{
       Dispose1:d
      });
     }
    }),
    HotStream:Runtime.Class({
     Subscribe:function(o)
     {
      if(this.Latest[0].$==1)
       {
        o.OnNext(this.Latest[0].$0);
       }
      return this.Event.event.Subscribe(o);
     },
     Trigger:function(v)
     {
      this.Latest[0]={
       $:1,
       $0:v
      };
      return this.Event.event.Trigger(v);
     }
    },{
     New:function(x)
     {
      return Runtime.New(HotStream,{
       Latest:[{
        $:1,
        $0:x
       }],
       Event:FSharpEvent.New()
      });
     },
     New1:function()
     {
      return Runtime.New(HotStream,{
       Latest:[{
        $:0
       }],
       Event:FSharpEvent.New()
      });
     }
    }),
    Observable:Runtime.Class({
     Subscribe:function(o)
     {
      return this.OnSubscribe.call(null,o);
     },
     SubscribeWith:function(onNext,onComplete)
     {
      return this.OnSubscribe.call(null,Observer.New(onNext,onComplete));
     }
    },{
     New:function(f)
     {
      return Runtime.New(Observable,{
       OnSubscribe:f
      });
     }
    }),
    Observer:Runtime.Class({
     OnCompleted:function()
     {
      return this.OnCompleted1.call(null,null);
     },
     OnError:function()
     {
      return null;
     },
     OnNext:function(t)
     {
      return this.OnNext1.call(null,t);
     }
    },{
     New:function(onNext,onComplete)
     {
      return Runtime.New(Observer,{
       OnNext1:onNext,
       OnCompleted1:onComplete
      });
     }
    }),
    Reactive:{
     Aggregate:function(io,seed,acc)
     {
      return Observable.New(function(o)
      {
       var state;
       state=[seed];
       return Util.subscribeTo(io,function(value)
       {
        state[0]=(acc(state[0]))(value);
        return o.OnNext(state[0]);
       });
      });
     },
     Choose:function(io,f)
     {
      return Observable.New(function(o1)
      {
       return Util.subscribeTo(io,function(v)
       {
        var matchValue;
        matchValue=f(v);
        return matchValue.$==0?null:o1.OnNext(matchValue.$0);
       });
      });
     },
     CollectLatest:function(outer)
     {
      return Observable.New(function(o)
      {
       var dict,index;
       dict=Dictionary.New12();
       index=[0];
       return Util.subscribeTo(outer,function(inner)
       {
        var currentIndex;
        Ref.incr(index);
        currentIndex=index[0];
        Util.subscribeTo(inner,function(value)
        {
         dict.set_Item(currentIndex,value);
         return o.OnNext(Seq.delay(function()
         {
          return Seq.map(function(pair)
          {
           return pair.V;
          },dict);
         }));
        });
        return;
       });
      });
     },
     CombineLatest:function(io1,io2,f)
     {
      return Observable.New(function(o)
      {
       var lv1,lv2,update,o1,o2,d1,d2;
       lv1=[{
        $:0
       }];
       lv2=[{
        $:0
       }];
       update=function()
       {
        var matchValue,v2;
        matchValue=[lv1[0],lv2[0]];
        if(matchValue[0].$==1)
         {
          if(matchValue[1].$==1)
           {
            v2=matchValue[1].$0;
            return o.OnNext((f(matchValue[0].$0))(v2));
           }
          else
           {
            return null;
           }
         }
        else
         {
          return null;
         }
       };
       o1=Observer.New(function(x)
       {
        lv1[0]={
         $:1,
         $0:x
        };
        return update(null);
       },function()
       {
       });
       o2=Observer.New(function(y)
       {
        lv2[0]={
         $:1,
         $0:y
        };
        return update(null);
       },function()
       {
       });
       d1=io1.Subscribe(o1);
       d2=io2.Subscribe(o2);
       return Disposable.New(function()
       {
        d1.Dispose();
        return d2.Dispose();
       });
      });
     },
     Concat:function(io1,io2)
     {
      return Observable.New(function(o)
      {
       var innerDisp,outerDisp;
       innerDisp=[{
        $:0
       }];
       outerDisp=io1.Subscribe(Observer.New(function(arg00)
       {
        return o.OnNext(arg00);
       },function()
       {
        innerDisp[0]={
         $:1,
         $0:io2.Subscribe(o)
        };
       }));
       return Disposable.New(function()
       {
        if(innerDisp[0].$==1)
         {
          innerDisp[0].$0.Dispose();
         }
        return outerDisp.Dispose();
       });
      });
     },
     Default:Runtime.Field(function()
     {
      return Reactive2.New();
     }),
     Drop:function(io,count)
     {
      return Observable.New(function(o1)
      {
       var index;
       index=[0];
       return Util.subscribeTo(io,function(v)
       {
        Ref.incr(index);
        return index[0]>count?o1.OnNext(v):null;
       });
      });
     },
     Heat:function(io)
     {
      var s;
      s=HotStream.New1();
      Util.subscribeTo(io,function(arg00)
      {
       return s.Trigger(arg00);
      });
      return s;
     },
     Merge:function(io1,io2)
     {
      return Observable.New(function(o)
      {
       var completed1,completed2,disp1,disp2;
       completed1=[false];
       completed2=[false];
       disp1=io1.Subscribe(Observer.New(function(arg00)
       {
        return o.OnNext(arg00);
       },function()
       {
        completed1[0]=true;
        return(completed1[0]?completed2[0]:false)?o.OnCompleted():null;
       }));
       disp2=io2.Subscribe(Observer.New(function(arg00)
       {
        return o.OnNext(arg00);
       },function()
       {
        completed2[0]=true;
        return(completed1[0]?completed2[0]:false)?o.OnCompleted():null;
       }));
       return Disposable.New(function()
       {
        disp1.Dispose();
        return disp2.Dispose();
       });
      });
     },
     Never:function()
     {
      return Observable.New(function()
      {
       return Disposable.New(function()
       {
       });
      });
     },
     Range:function(start,count)
     {
      return Observable.New(function(o)
      {
       var i;
       for(i=start;i<=start+count;i++){
        o.OnNext(i);
       }
       return Disposable.New(function()
       {
       });
      });
     },
     Reactive:Runtime.Class({
      Aggregate:function(io,s,a)
      {
       return Reactive1.Aggregate(io,s,a);
      },
      Choose:function(io,f)
      {
       return Reactive1.Choose(io,f);
      },
      CollectLatest:function(io)
      {
       return Reactive1.CollectLatest(io);
      },
      CombineLatest:function(io1,io2,f)
      {
       return Reactive1.CombineLatest(io1,io2,f);
      },
      Concat:function(io1,io2)
      {
       return Reactive1.Concat(io1,io2);
      },
      Drop:function(io,count)
      {
       return Reactive1.Drop(io,count);
      },
      Heat:function(io)
      {
       return Reactive1.Heat(io);
      },
      Merge:function(io1,io2)
      {
       return Reactive1.Merge(io1,io2);
      },
      Never:function()
      {
       return Reactive1.Never();
      },
      Return:function(x)
      {
       return Reactive1.Return(x);
      },
      Select:function(io,f)
      {
       return Reactive1.Select(io,f);
      },
      SelectMany:function(io)
      {
       return Reactive1.SelectMany(io);
      },
      Sequence:function(ios)
      {
       return Reactive1.Sequence(ios);
      },
      Switch:function(io)
      {
       return Reactive1.Switch(io);
      },
      Where:function(io,f)
      {
       return Reactive1.Where(io,f);
      }
     },{
      New:function()
      {
       return Runtime.New(this,{});
      }
     }),
     Return:function(x)
     {
      return Observable.New(function(o)
      {
       o.OnNext(x);
       o.OnCompleted();
       return Disposable.New(function()
       {
       });
      });
     },
     Select:function(io,f)
     {
      return Observable.New(function(o1)
      {
       return Util.subscribeTo(io,function(v)
       {
        return o1.OnNext(f(v));
       });
      });
     },
     SelectMany:function(io)
     {
      return Observable.New(function(o)
      {
       var disp,d;
       disp=[function()
       {
       }];
       d=Util.subscribeTo(io,function(o1)
       {
        var d1;
        d1=Util.subscribeTo(o1,function(arg00)
        {
         return o.OnNext(arg00);
        });
        disp[0]=function()
        {
         disp[0].call(null,null);
         return d1.Dispose();
        };
        return;
       });
       return Disposable.New(function()
       {
        disp[0].call(null,null);
        return d.Dispose();
       });
      });
     },
     Sequence:function(ios)
     {
      var sequence;
      sequence=function(ios1)
      {
       return ios1.$==1?Reactive1.CombineLatest(ios1.$0,sequence(ios1.$1),function(x)
       {
        return function(y)
        {
         return Runtime.New(T,{
          $:1,
          $0:x,
          $1:y
         });
        };
       }):Reactive1.Return(Runtime.New(T,{
        $:0
       }));
      };
      return Reactive1.Select(sequence(List.ofSeq(ios)),function(source)
      {
       return source;
      });
     },
     Switch:function(io)
     {
      return Observable.New(function(o)
      {
       var index,disp;
       index=[0];
       disp=[{
        $:0
       }];
       return Util.subscribeTo(io,function(o1)
       {
        var currentIndex;
        Ref.incr(index);
        if(disp[0].$==1)
         {
          disp[0].$0.Dispose();
         }
        currentIndex=index[0];
        disp[0]={
         $:1,
         $0:Util.subscribeTo(o1,function(v)
         {
          return currentIndex===index[0]?o.OnNext(v):null;
         })
        };
        return;
       });
      });
     },
     Where:function(io,f)
     {
      return Observable.New(function(o1)
      {
       return Util.subscribeTo(io,function(v)
       {
        return f(v)?o1.OnNext(v):null;
       });
      });
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  IntelliFactory=Runtime.Safe(Global.IntelliFactory);
  Reactive=Runtime.Safe(IntelliFactory.Reactive);
  Disposable=Runtime.Safe(Reactive.Disposable);
  HotStream=Runtime.Safe(Reactive.HotStream);
  Control=Runtime.Safe(Global.WebSharper.Control);
  FSharpEvent=Runtime.Safe(Control.FSharpEvent);
  Observer=Runtime.Safe(Reactive.Observer);
  Observable=Runtime.Safe(Reactive.Observable);
  Util=Runtime.Safe(Global.WebSharper.Util);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Reactive1=Runtime.Safe(Reactive.Reactive);
  Reactive2=Runtime.Safe(Reactive1.Reactive);
  List=Runtime.Safe(Global.WebSharper.List);
  return T=Runtime.Safe(List.T);
 });
 Runtime.OnLoad(function()
 {
  Reactive1.Default();
  return;
 });
}());

(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,Piglets,Choose,Stream,Reader,Collections,Dictionary,List,T,Enumerator,Seq,Operators,Stream1,Result,ConcreteReader,Id,ConcreteWriter,ConstReader,Disposable,Html,Client,Operators1,Tags,EventsPervasives,Controls,Attr,Unchecked,jQuery,HtmlContainer,Arrays,Ref,ErrorMessage,Many,Stream2,Submitter,Operations,ResizeArray,ResizeArrayProxy,UnitStream,Pervasives,Concurrency,Piglet1,Stream3,Piglet,Validation,RegExp,Util,IntelliFactory,Reactive,HotStream;
 Runtime.Define(Global,{
  WebSharper:{
   Piglets:{
    Choose:{
     Stream:Runtime.Class({
      Choice:function(c,f)
      {
       var renders,hasChild,_this=this;
       renders=Dictionary.New12();
       hasChild=[false];
       this.subscriptions[0]=Runtime.New(T,{
        $:1,
        $0:this.pStream.Subscribe(function(res)
        {
         var p,i,render;
         if(res.$==0)
          {
           p=res.$0[1];
           i=res.$0[0];
           render=renders.ContainsKey(i)?renders.get_Item(i):p.view.call(null,f);
           _this.out.Trigger(p.stream.get_Latest());
           if(hasChild[0])
            {
             c.Remove(0);
            }
           hasChild[0]=true;
           return c.Add(render);
          }
         else
          {
           return null;
          }
        }),
        $1:_this.subscriptions[0]
       });
       return c.get_Container();
      },
      Chooser:function(f)
      {
       return this.chooser.view.call(null,f);
      },
      Dispose:function()
      {
       var enumerator;
       enumerator=Enumerator.Get(this.subscriptions[0]);
       while(enumerator.MoveNext())
        {
         enumerator.get_Current().Dispose();
        }
       return Seq.iter(function(_arg3)
       {
        return(Operators.KeyValue(_arg3))[1][1].Dispose();
       },this.choiceSubscriptions);
      },
      Subscribe:function(f)
      {
       return this.out.Subscribe(f);
      },
      get_ChooserStream:function()
      {
       return this.chooser.stream;
      },
      get_Latest:function()
      {
       return this.out.get_Latest();
      }
     },{
      New:function(chooser,choice,out)
      {
       var r;
       r=Runtime.New(this,Reader.New(out.get_Id()));
       r.chooser=chooser;
       r.out=out;
       r.pStream=Stream1.New(Runtime.New(Result,{
        $:1,
        $0:Runtime.New(T,{
         $:0
        })
       }),{
        $:0
       });
       r.choiceSubscriptions=Dictionary.New12();
       r.subscriptions=[List.ofArray([r.chooser.stream.Subscribe(function(res)
       {
        return r.pStream.Trigger(Result.Map(function(i)
        {
         var _,p,objectArg;
         if(r.choiceSubscriptions.ContainsKey(i))
          {
           _=(r.choiceSubscriptions.get_Item(i))[0];
          }
         else
          {
           p=choice(i);
           objectArg=r.out;
           r.choiceSubscriptions.set_Item(i,[p,p.stream.Subscribe(function(arg00)
           {
            return objectArg.Trigger(arg00);
           })]);
           _=p;
          }
         return[i,_];
        },res));
       })])];
       return r;
      }
     })
    },
    ConcreteReader:Runtime.Class({
     Subscribe:function(f)
     {
      return this.subscribe.call(null,f);
     },
     get_Latest:function()
     {
      return this.latest.call(null,null);
     }
    },{
     New:function(latest,subscribe)
     {
      var r;
      r=Runtime.New(this,Reader.New((Id.next())(null)));
      r.latest=latest;
      r.subscribe=subscribe;
      return r;
     }
    }),
    ConcreteWriter:Runtime.Class({
     Trigger:function(x)
     {
      return this.trigger.call(null,x);
     }
    },{
     New:function(trigger)
     {
      var r;
      r=Runtime.New(this,{});
      r.trigger=trigger;
      return r;
     },
     New1:function(trigger)
     {
      return ConcreteWriter.New(function(_arg1)
      {
       return _arg1.$==1?null:trigger(_arg1.$0);
      });
     }
    }),
    ConstReader:Runtime.Class({
     Subscribe:function()
     {
      return Disposable.New(function()
      {
      });
     },
     get_Latest:function()
     {
      return this.x;
     }
    },{
     New:function(x)
     {
      var r;
      r=Runtime.New(this,Reader.New((Id.next())(null)));
      r.x=x;
      return r;
     }
    }),
    Controls:{
     Attr:function(reader,attrName,render,element)
     {
      Operators1.OnAfterRender(function(element1)
      {
       var set;
       set=function(x)
       {
        var arg20;
        if(x.$==0)
         {
          arg20=render(x.$0);
          return element1["HtmlProvider@33"].SetAttribute(element1.get_Body(),attrName,arg20);
         }
        else
         {
          return null;
         }
       };
       set(reader.get_Latest());
       reader.Subscribe(set);
       return;
      },element);
      return element;
     },
     AttrResult:function(reader,attrName,render,element)
     {
      Operators1.OnAfterRender(function(element1)
      {
       var set;
       set=function(x)
       {
        var arg20;
        arg20=render(x);
        return element1["HtmlProvider@33"].SetAttribute(element1.get_Body(),attrName,arg20);
       };
       set(reader.get_Latest());
       reader.Subscribe(set);
       return;
      },element);
      return element;
     },
     Button:function(submit)
     {
      var arg10,x,arg00;
      arg10=Runtime.New(T,{
       $:0
      });
      x=Tags.Tags().NewTag("button",arg10);
      arg00=function()
      {
       return function()
       {
        return submit.Trigger(Runtime.New(Result,{
         $:0,
         $0:null
        }));
       };
      };
      EventsPervasives.Events().OnClick(arg00,x);
      return x;
     },
     ButtonValidate:function(submit)
     {
      var _arg10_;
      _arg10_=Controls.Button(submit);
      return Controls.EnableOnSuccess(submit.get_Input(),_arg10_);
     },
     CheckBox:function(stream)
     {
      var id,_this,arg10,i,matchValue,x,ev;
      id=(Controls.nextId())(null);
      _this=Tags.Tags();
      arg10=List.ofArray([Attr.Attr().NewAttr("type","checkbox"),Attr.Attr().NewAttr("id",id)]);
      i=_this.NewTag("input",arg10);
      matchValue=stream.get_Latest();
      if(matchValue.$==0)
       {
        x=matchValue.$0;
        i.get_Body().checked=x;
       }
      stream.Subscribe(function(_arg1)
      {
       var x1;
       if(_arg1.$==1)
        {
         return null;
        }
       else
        {
         x1=_arg1.$0;
         return!Unchecked.Equals(i.get_Body().checked,x1)?void(i.get_Body().checked=x1):null;
        }
      });
      ev=function()
      {
       return stream.Trigger(Runtime.New(Result,{
        $:0,
        $0:i.get_Body().checked
       }));
      };
      i.get_Body().addEventListener("change",ev,true);
      return i;
     },
     Css:function(reader,attrName,render,element)
     {
      Operators1.OnAfterRender(function(element1)
      {
       var set;
       set=function(x)
       {
        var arg20;
        if(x.$==0)
         {
          arg20=render(x.$0);
          return element1["HtmlProvider@33"].SetCss(element1.get_Body(),attrName,arg20);
         }
        else
         {
          return null;
         }
       };
       set(reader.get_Latest());
       reader.Subscribe(set);
       return;
      },element);
      return element;
     },
     CssResult:function(reader,attrName,render,element)
     {
      Operators1.OnAfterRender(function(element1)
      {
       var set;
       set=function(x)
       {
        var arg20;
        arg20=render(x);
        return element1["HtmlProvider@33"].SetCss(element1.get_Body(),attrName,arg20);
       };
       set(reader.get_Latest());
       reader.Subscribe(set);
       return;
      },element);
      return element;
     },
     EnableOnSuccess:function(reader,element)
     {
      Operators1.OnAfterRender(function(el)
      {
       el.get_Body().disabled=!reader.get_Latest().get_isSuccess();
       reader.Subscribe(function(x)
       {
        el.get_Body().disabled=!x.get_isSuccess();
       });
       return;
      },element);
      return element;
     },
     HtmlContainer:Runtime.Class({
      Add:function(elt)
      {
       return this.container.AppendI(elt);
      },
      MoveUp:function(i)
      {
       var elt_i,elt_i_1;
       elt_i=this.container.get_Body().childNodes[i];
       elt_i_1=this.container.get_Body().childNodes[i-1];
       this.container.get_Body().removeChild(elt_i);
       this.container.get_Body().insertBefore(elt_i,elt_i_1);
       return;
      },
      Remove:function(i)
      {
       this.container.get_Body().removeChild(this.container.get_Body().childNodes[i]);
      },
      get_Container:function()
      {
       return this.container;
      }
     },{
      New:function(container)
      {
       var r;
       r=Runtime.New(this,{});
       r.container=container;
       return r;
      }
     }),
     IntInput:function(stream)
     {
      return Controls.input("number",function(value)
      {
       return value<<0;
      },function(value)
      {
       return Global.String(value);
      },stream);
     },
     Link:function(submit)
     {
      var arg10,x;
      arg10=List.ofArray([Attr.Attr().NewAttr("href","#")]);
      x=Tags.Tags().NewTag("a",arg10);
      Operators1.OnAfterRender(function(e)
      {
       return jQuery(e.get_Body()).on("click",function(ev)
       {
        submit.Trigger(Runtime.New(Result,{
         $:0,
         $0:null
        }));
        return ev.preventDefault();
       });
      },x);
      return x;
     },
     Radio:function(stream,values)
     {
      var name,values1,elts,set;
      name=(Controls.nextId())(null);
      values1=List.ofSeq(values);
      elts=List.map(function(x)
      {
       var x1,arg00;
       x1=Tags.Tags().NewTag("input",List.ofArray([Attr.Attr().NewAttr("type","radio"),Attr.Attr().NewAttr("name",name)]));
       arg00=function(div)
       {
        return div.get_Body().checked?stream.Trigger(Runtime.New(Result,{
         $:0,
         $0:x
        })):null;
       };
       EventsPervasives.Events().OnChange(arg00,x1);
       return x1;
      },values1);
      set=function(_arg1)
      {
       var v;
       if(_arg1.$==1)
        {
         return null;
        }
       else
        {
         v=_arg1.$0;
         return List.iter2(function(x)
         {
          return function(input)
          {
           input.get_Body().checked=Unchecked.Equals(x,v);
          };
         },values1,elts);
        }
      };
      set(stream.get_Latest());
      stream.Subscribe(set);
      return elts;
     },
     RadioLabelled:function(stream,values)
     {
      var y,x;
      y=Controls.Radio(stream,Seq.map(function(tuple)
      {
       return tuple[0];
      },values));
      x=Seq.mapi2(function(tupledArg)
      {
       var label;
       label=tupledArg[1];
       return function(input)
       {
        var id,arg10,arg101;
        id=(Controls.nextId())(null);
        arg101=List.ofArray([Attr.Attr().NewAttr("for",id),Tags.Tags().text(label)]);
        arg10=List.ofArray([Operators1.add(input,List.ofArray([Attr.Attr().NewAttr("id",id)])),Tags.Tags().NewTag("label",arg101)]);
        return Tags.Tags().NewTag("span",arg10);
       };
      },values,y);
      return Tags.Tags().NewTag("div",x);
     },
     RenderChoice:function(choice,renderIt,container)
     {
      return choice.Choice(HtmlContainer.New(container),renderIt);
     },
     RenderMany:function(many,renderOne,container)
     {
      return many.Render(HtmlContainer.New(container),renderOne);
     },
     Select:function(stream,values)
     {
      var name,values1,elts,x,arg00,x1;
      name=(Controls.nextId())(null);
      values1=Arrays.ofSeq(values);
      elts=Arrays.map(function(tupledArg)
      {
       var label,id;
       label=tupledArg[1];
       id=(Controls.nextId())(null);
       return Operators1.add(Tags.Tags().NewTag("option",List.ofArray([Attr.Attr().NewAttr("value",id)])),List.ofArray([Tags.Tags().text(label)]));
      },values1);
      x=Tags.Tags().NewTag("select",elts);
      arg00=function(e)
      {
       return e.get_Body().selectedIndex>=0?stream.Trigger(Runtime.New(Result,{
        $:0,
        $0:(Arrays.get(values1,e.get_Body().selectedIndex))[0]
       })):null;
      };
      EventsPervasives.Events().OnChange(arg00,x);
      x1=x;
      Operators1.OnAfterRender(function()
      {
       stream.Subscribe(function(_arg1)
       {
        var v,matchValue,_this;
        if(_arg1.$==1)
         {
          return null;
         }
        else
         {
          v=_arg1.$0;
          matchValue=Arrays.tryFindIndex(function(tupledArg)
          {
           return Unchecked.Equals(v,tupledArg[0]);
          },values1);
          if(matchValue.$==0)
           {
            return null;
           }
          else
           {
            _this=Arrays.get(elts,matchValue.$0);
            return _this["HtmlProvider@33"].SetAttribute(_this.get_Body(),"selected","");
           }
         }
       });
      },x1);
      return x1;
     },
     Show:function(reader,render,container)
     {
      return Controls.ShowResult(reader,function(_arg1)
      {
       return _arg1.$==1?Seq.empty():render(_arg1.$0);
      },container);
     },
     ShowErrors:function(reader,render,container)
     {
      return Controls.ShowResult(reader,function(_arg1)
      {
       return _arg1.$==1?render(List.map(function(m)
       {
        return m.get_Message();
       },_arg1.$0)):Seq.empty();
      },container);
     },
     ShowResult:function(reader,render,container)
     {
      var enumerator;
      enumerator=Enumerator.Get(render(reader.get_Latest()));
      while(enumerator.MoveNext())
       {
        container.AppendI(enumerator.get_Current());
       }
      reader.Subscribe(function(x)
      {
       var enumerator1;
       container["HtmlProvider@33"].Clear(container.get_Body());
       enumerator1=Enumerator.Get(render(x));
       while(enumerator1.MoveNext())
        {
         container.AppendI(enumerator1.get_Current());
        }
       return;
      });
      return container;
     },
     ShowString:function(reader,render,container)
     {
      return Controls.Show(reader,function(x)
      {
       var x1;
       x1=render(x);
       return List.ofArray([Tags.Tags().text(x1)]);
      },container);
     },
     Submit:function(submit)
     {
      var x,arg00;
      x=Tags.Tags().NewTag("input",List.ofArray([Attr.Attr().NewAttr("type","submit")]));
      arg00=function()
      {
       return function()
       {
        return submit.Trigger(Runtime.New(Result,{
         $:0,
         $0:null
        }));
       };
      };
      EventsPervasives.Events().OnClick(arg00,x);
      return x;
     },
     SubmitValidate:function(submit)
     {
      var _arg10_;
      _arg10_=Controls.Submit(submit);
      return Controls.EnableOnSuccess(submit.get_Input(),_arg10_);
     },
     TextArea:function(stream)
     {
      var _this,arg10,i,matchValue,ev;
      _this=Tags.Tags();
      arg10=Runtime.New(T,{
       $:0
      });
      i=_this.NewTag("textarea",arg10);
      matchValue=stream.get_Latest();
      if(matchValue.$==0)
       {
        i.set_Value(matchValue.$0);
       }
      stream.Subscribe(function(_arg1)
      {
       var x;
       if(_arg1.$==1)
        {
         return null;
        }
       else
        {
         x=_arg1.$0;
         return i.get_Value()!==x?i.set_Value(x):null;
        }
      });
      ev=function()
      {
       return stream.Trigger(Runtime.New(Result,{
        $:0,
        $0:i.get_Value()
       }));
      };
      i.get_Body().addEventListener("keyup",ev,true);
      i.get_Body().addEventListener("change",ev,true);
      return i;
     },
     WithLabel:function(label,element)
     {
      var id,arg10,arg101;
      id=(Controls.nextId())(null);
      arg101=List.ofArray([Attr.Attr().NewAttr("for",id),Tags.Tags().text(label)]);
      arg10=List.ofArray([Tags.Tags().NewTag("label",arg101),Operators1.add(element,List.ofArray([Attr.Attr().NewAttr("id",id)]))]);
      return Tags.Tags().NewTag("span",arg10);
     },
     WithLabelAfter:function(label,element)
     {
      var id,arg10,arg101;
      id=(Controls.nextId())(null);
      arg101=List.ofArray([Attr.Attr().NewAttr("for",id),Tags.Tags().text(label)]);
      arg10=List.ofArray([Operators1.add(element,List.ofArray([Attr.Attr().NewAttr("id",id)])),Tags.Tags().NewTag("label",arg101)]);
      return Tags.Tags().NewTag("span",arg10);
     },
     input:function(type,ofString,toString,stream)
     {
      var _this,arg10,i,matchValue,ev;
      _this=Tags.Tags();
      arg10=List.ofArray([Attr.Attr().NewAttr("type",type)]);
      i=_this.NewTag("input",arg10);
      matchValue=stream.get_Latest();
      if(matchValue.$==0)
       {
        i.set_Value(toString(matchValue.$0));
       }
      stream.Subscribe(function(_arg1)
      {
       var s;
       if(_arg1.$==1)
        {
         return null;
        }
       else
        {
         s=toString(_arg1.$0);
         return i.get_Value()!==s?i.set_Value(s):null;
        }
      });
      ev=function()
      {
       var v;
       v=Runtime.New(Result,{
        $:0,
        $0:ofString(i.get_Value())
       });
       return!Unchecked.Equals(v,stream.get_Latest())?stream.Trigger(v):null;
      };
      i.get_Body().addEventListener("keyup",ev,true);
      i.get_Body().addEventListener("change",ev,true);
      return i;
     },
     nextId:Runtime.Field(function()
     {
      var _current_26_2;
      _current_26_2=[0];
      return function()
      {
       Ref.incr(_current_26_2);
       return"pl__"+Global.String(_current_26_2[0]);
      };
     })
    },
    Disposable:Runtime.Class({
     Dispose:function()
     {
      return this.dispose.call(null,null);
     }
    },{
     New:function(dispose)
     {
      var r;
      r=Runtime.New(this,{});
      r.dispose=dispose;
      return r;
     }
    }),
    ErrorMessage:Runtime.Class({
     get_Message:function()
     {
      return this.message;
     },
     get_Source:function()
     {
      return this.source;
     }
    },{
     Create:function(msg,reader)
     {
      return ErrorMessage.New(msg,reader.get_Id());
     },
     New:function(message,source)
     {
      var r;
      r=Runtime.New(this,{});
      r.message=message;
      r.source=source;
      return r;
     }
    }),
    Id:{
     next:Runtime.Field(function()
     {
      var _current_28_3;
      _current_28_3=[0];
      return function()
      {
       Ref.incr(_current_28_3);
       return _current_28_3[0];
      };
     })
    },
    Many:{
     Operations:Runtime.Class({
      get_Delete:function()
      {
       return ConcreteWriter.New1(this["delete"]);
      },
      get_MoveDown:function()
      {
       return this.moveDown;
      },
      get_MoveUp:function()
      {
       return this.moveUp;
      }
     },{
      New:function(_delete,moveUp,moveDown)
      {
       var r;
       r=Runtime.New(this,{});
       r["delete"]=_delete;
       r.moveUp=moveUp;
       r.moveDown=moveDown;
       return r;
      }
     }),
     Stream:Runtime.Class({
      AddRender:function(f)
      {
       return this.adder.view.call(null,f);
      },
      Render:function(c,f)
      {
       var add,_this=this,matchValue;
       add=function(x)
       {
        var piglet,getThisIndex,moveUp,moveDown,moveUp1,canMoveUp,canMoveDown,inMoveUp,inMoveDown,outSubscription,subMoveUp,subMoveDown,subUpSubscription,subDownSubscription;
        piglet=_this.p.call(null,x);
        _this.streams.Add(piglet.stream);
        piglet.stream.Subscribe(function()
        {
         return _this.update();
        });
        getThisIndex=function()
        {
         return Seq.findIndex(function(x1)
         {
          return x1.get_Id()===piglet.stream.get_Id();
         },_this.streams);
        };
        moveUp=function(i)
        {
         var s;
         if(i>0?i<_this.streams.get_Count():false)
          {
           s=_this.streams.get_Item(i);
           _this.streams.set_Item(i,_this.streams.get_Item(i-1));
           _this.streams.set_Item(i-1,s);
           c.MoveUp(i);
           return _this.update();
          }
         else
          {
           return null;
          }
        };
        moveDown=function()
        {
         return moveUp(getThisIndex(null)+1);
        };
        moveUp1=function()
        {
         return moveUp(getThisIndex(null));
        };
        canMoveUp=function()
        {
         return getThisIndex(null)>0?Runtime.New(Result,{
          $:0,
          $0:null
         }):Runtime.New(Result,{
          $:1,
          $0:Runtime.New(T,{
           $:0
          })
         });
        };
        canMoveDown=function()
        {
         return getThisIndex(null)<_this.streams.get_Count()-1?Runtime.New(Result,{
          $:0,
          $0:null
         }):Runtime.New(Result,{
          $:1,
          $0:Runtime.New(T,{
           $:0
          })
         });
        };
        inMoveUp=Stream1.New(canMoveUp(null),{
         $:0
        });
        inMoveDown=Stream1.New(canMoveDown(null),{
         $:0
        });
        outSubscription=_this.out.Subscribe(function()
        {
         inMoveUp.Trigger(canMoveUp(null));
         return inMoveDown.Trigger(canMoveDown(null));
        });
        subMoveUp=Submitter.New(inMoveUp,false);
        subMoveDown=Submitter.New(inMoveDown,false);
        subUpSubscription=subMoveUp.Subscribe(Result.Iter(moveUp1));
        subDownSubscription=subMoveDown.Subscribe(Result.Iter(moveDown));
        return c.Add(piglet.view.call(null,f(Operations.New(function()
        {
         var i;
         i=getThisIndex(null);
         _this.streams.RemoveAt(i);
         c.Remove(i);
         outSubscription.Dispose();
         subUpSubscription.Dispose();
         subDownSubscription.Dispose();
         return _this.update();
        },subMoveUp,subMoveDown))));
       };
       matchValue=_this.out.get_Latest();
       if(matchValue.$==0)
        {
         Arrays.iter(add,matchValue.$0);
        }
       _this.adder.stream.Subscribe(function(_arg1)
       {
        return _arg1.$==0?add(_arg1.$0):null;
       });
       return c.get_Container();
      },
      Subscribe:function(f)
      {
       return this.out.Subscribe(f);
      },
      get_Add:function()
      {
       return this.adder.stream;
      },
      get_Latest:function()
      {
       return this.out.get_Latest();
      },
      update:function()
      {
       var objectArg;
       objectArg=this.out;
       return objectArg.Trigger(Result.Map(function(x)
       {
        return Arrays.ofSeq(List.rev(x));
       },Seq.fold(function(acc)
       {
        return function(cur)
        {
         var matchValue;
         matchValue=[acc,cur.get_Latest()];
         return matchValue[0].$==1?matchValue[1].$==1?Runtime.New(Result,{
          $:1,
          $0:List.append(matchValue[1].$0,matchValue[0].$0)
         }):Runtime.New(Result,{
          $:1,
          $0:matchValue[0].$0
         }):matchValue[1].$==1?Runtime.New(Result,{
          $:1,
          $0:matchValue[1].$0
         }):Runtime.New(Result,{
          $:0,
          $0:Runtime.New(T,{
           $:1,
           $0:matchValue[1].$0,
           $1:matchValue[0].$0
          })
         });
        };
       },Runtime.New(Result,{
        $:0,
        $0:Runtime.New(T,{
         $:0
        })
       }),this.streams)));
      }
     },{
      New:function(p,out,adder)
      {
       var r;
       r=Runtime.New(this,Reader.New(out.get_Id()));
       r.p=p;
       r.out=out;
       r.adder=adder;
       r.streams=ResizeArrayProxy.New2();
       return r;
      }
     }),
     UnitStream:Runtime.Class({
      get_Add:function()
      {
       return this.submitStream;
      }
     },{
      New:function(p,out,init,_default)
      {
       var r,submitter,objectArg,trigger;
       r=Runtime.New(this,Stream2.New(p,out,init));
       submitter=Stream1.New(Runtime.New(Result,{
        $:1,
        $0:Runtime.New(T,{
         $:0
        })
       }),{
        $:0
       });
       objectArg=init.get_Stream();
       trigger=function(arg00)
       {
        return objectArg.Trigger(arg00);
       };
       submitter.Subscribe(function(_arg1)
       {
        return _arg1.$==0?trigger(Runtime.New(Result,{
         $:0,
         $0:_default
        })):trigger(Runtime.New(Result,{
         $:1,
         $0:_arg1.$0
        }));
       });
       r.submitStream=submitter;
       return r;
      }
     })
    },
    Pervasives:{
     "Writer`1.Wrap.Static":function(f,r)
     {
      return ConcreteWriter.New(function(a)
      {
       return r.Trigger(Result.Map(f,a));
      });
     },
     "Writer`1.WrapAsync.Static":function(f,r)
     {
      return Pervasives["Writer`1.WrapToAsyncResult.Static"](function(b)
      {
       return Concurrency.Delay(function()
       {
        return Concurrency.Bind(f(b),function(_arg2)
        {
         return Concurrency.Return(Runtime.New(Result,{
          $:0,
          $0:_arg2
         }));
        });
       });
      },r);
     },
     "Writer`1.WrapAsyncResult.Static":function(f,r)
     {
      return ConcreteWriter.New(function(ra)
      {
       return Concurrency.Start(Concurrency.Delay(function()
       {
        return Concurrency.Bind(f(ra),function(_arg1)
        {
         r.Trigger(_arg1);
         return Concurrency.Return(null);
        });
       }),{
        $:0
       });
      });
     },
     "Writer`1.WrapResult.Static":function(f,r)
     {
      return ConcreteWriter.New(function(a)
      {
       return r.Trigger(f(a));
      });
     },
     "Writer`1.WrapToAsyncResult.Static":function(f,r)
     {
      return Pervasives["Writer`1.WrapAsyncResult.Static"](function(b)
      {
       return Concurrency.Delay(function()
       {
        return b.$==1?Concurrency.Return(Runtime.New(Result,{
         $:1,
         $0:b.$0
        })):f(b.$0);
       });
      },r);
     },
     "Writer`1.WrapToResult.Static":function(f,r)
     {
      return ConcreteWriter.New(function(a)
      {
       return r.Trigger((Result.Bind(f))(a));
      });
     },
     op_LessMultiplyGreater:function(f,x)
     {
      var f1,g;
      f1=f.view;
      g=x.view;
      return Runtime.New(Piglet1,{
       stream:Stream3.Ap(f.stream,x.stream),
       view:function(x1)
       {
        return g(f1(x1));
       }
      });
     },
     op_LessMultiplyQmarkGreater:function(f,x)
     {
      var f1,g;
      f1=f.view;
      g=x.view;
      return Runtime.New(Piglet1,{
       stream:Stream3.ApJoin(f.stream,x.stream),
       view:function(x1)
       {
        return g(f1(x1));
       }
      });
     }
    },
    Piglet:{
     Builder:Runtime.Class({
      Bind:function(p,f)
      {
       return Piglet.Choose(p,f);
      },
      Return:function(x)
      {
       return Piglet.Return(x);
      },
      ReturnFrom:function(p)
      {
       return p;
      },
      Yield:function(x)
      {
       return Piglet.Yield(x);
      },
      YieldFrom:function(p)
      {
       return p;
      },
      Zero:function()
      {
       return Piglet.ReturnFailure();
      }
     }),
     Choose:function(chooser,choices)
     {
      var s,c;
      s=Stream1.New(Runtime.New(Result,{
       $:1,
       $0:Runtime.New(T,{
        $:0
       })
      }),{
       $:0
      });
      c=Stream.New(chooser,choices,s);
      return Runtime.New(Piglet1,{
       stream:s,
       view:function(f)
       {
        return f(c);
       }
      });
     },
     Confirm:function(init,validate,nomatch)
     {
      var second,_arg20_;
      second=Piglet.Yield(init);
      _arg20_=Pervasives.op_LessMultiplyGreater(Pervasives.op_LessMultiplyGreater(Piglet.Return(function(a)
      {
       return function(b)
       {
        return[a,b];
       };
      }),validate(Piglet.Yield(init))),second);
      return Piglet.MapViewArgs(function(a)
      {
       return function(b)
       {
        return[a,b];
       };
      },Piglet.Map(function(tuple)
      {
       return tuple[0];
      },Validation["Is'"](function(tupledArg)
      {
       return Unchecked.Equals(tupledArg[0],tupledArg[1]);
      },ErrorMessage.Create(nomatch,second.get_Stream()),_arg20_)));
     },
     FlushErrors:function(p)
     {
      return Piglet.MapResult(function(_arg1)
      {
       return _arg1.$==1?Runtime.New(Result,{
        $:1,
        $0:Runtime.New(T,{
         $:0
        })
       }):_arg1;
      },p);
     },
     Many:function(init,p)
     {
      return Piglet.ManyInit([init],init,p);
     },
     ManyInit:function(inits,init,p)
     {
      var s,m;
      s=Stream1.New(Runtime.New(Result,{
       $:0,
       $0:inits
      }),{
       $:0
      });
      m=UnitStream.New(p,s,p(init),init);
      return Runtime.New(Piglet1,{
       stream:s,
       view:function(f)
       {
        return f(m);
       }
      });
     },
     ManyPiglet:function(inits,create,p)
     {
      var s,m;
      s=Stream1.New(Runtime.New(Result,{
       $:0,
       $0:inits
      }),{
       $:0
      });
      m=Stream2.New(p,s,create);
      return Runtime.New(Piglet1,{
       stream:s,
       view:function(f)
       {
        return f(m);
       }
      });
     },
     Map:function(m,p)
     {
      return Piglet.MapResult(function(_arg1)
      {
       return _arg1.$==0?Runtime.New(Result,{
        $:0,
        $0:m(_arg1.$0)
       }):Runtime.New(Result,{
        $:1,
        $0:_arg1.$0
       });
      },p);
     },
     MapAsync:function(m,p)
     {
      return Piglet.MapAsyncResult(function(_arg1)
      {
       var x;
       if(_arg1.$==0)
        {
         x=_arg1.$0;
         return Concurrency.Delay(function()
         {
          return Concurrency.Bind(m(x),function(_arg2)
          {
           return Concurrency.Return(Runtime.New(Result,{
            $:0,
            $0:_arg2
           }));
          });
         });
        }
       else
        {
         return Concurrency.Return(Runtime.New(Result,{
          $:1,
          $0:_arg1.$0
         }));
        }
      },p);
     },
     MapAsyncResult:function(m,p)
     {
      var out;
      out=Stream1.New(Runtime.New(Result,{
       $:1,
       $0:Runtime.New(T,{
        $:0
       })
      }),{
       $:0
      });
      p.stream.Subscribe(function(v)
      {
       return Concurrency.Start(Concurrency.Delay(function()
       {
        return Concurrency.Bind(m(v),function(_arg1)
        {
         return Concurrency.Return(out.Trigger(_arg1));
        });
       }),{
        $:0
       });
      });
      Concurrency.Start(Concurrency.Delay(function()
      {
       return Concurrency.Bind(m(p.stream.get_Latest()),function(_arg2)
       {
        return Concurrency.Return(out.Trigger(_arg2));
       });
      }),{
       $:0
      });
      return Runtime.New(Piglet1,{
       stream:out,
       view:p.view
      });
     },
     MapResult:function(m,p)
     {
      var out;
      out=Stream1.New(m(p.stream.get_Latest()),{
       $:0
      });
      p.stream.Subscribe(function(x)
      {
       return out.Trigger(m(x));
      });
      return Runtime.New(Piglet1,{
       stream:out,
       view:p.view
      });
     },
     MapResultWithWriter:function(f,p)
     {
      var stream;
      stream=Stream1.New(Runtime.New(Result,{
       $:1,
       $0:Runtime.New(T,{
        $:0
       })
      }),{
       $:0
      });
      p.stream.Subscribe(f(stream));
      return Runtime.New(Piglet1,{
       stream:stream,
       view:p.view
      });
     },
     MapToAsyncResult:function(m,p)
     {
      return Piglet.MapAsyncResult(function(_arg1)
      {
       return _arg1.$==0?m(_arg1.$0):Concurrency.Return(Runtime.New(Result,{
        $:1,
        $0:_arg1.$0
       }));
      },p);
     },
     MapToResult:function(m,p)
     {
      return Piglet.MapResult(function(_arg1)
      {
       return _arg1.$==0?m(_arg1.$0):Runtime.New(Result,{
        $:1,
        $0:_arg1.$0
       });
      },p);
     },
     MapViewArgs:function(view,p)
     {
      var _arg00_;
      _arg00_=p.view;
      return Runtime.New(Piglet1,{
       stream:p.stream,
       view:function(_arg20_)
       {
        return _arg20_(_arg00_(view));
       }
      });
     },
     MapWithWriter:function(f,p)
     {
      return Piglet.MapResultWithWriter(function(out)
      {
       return function(r)
       {
        var x;
        if(r.$==0)
         {
          x=r.$0;
          return(f(out))(x);
         }
        else
         {
          return out.Trigger(Runtime.New(Result,{
           $:1,
           $0:r.$0
          }));
         }
       };
      },p);
     },
     Render:function(view,p)
     {
      return p.view.call(null,view);
     },
     Return:function(x)
     {
      return Runtime.New(Piglet1,{
       stream:Stream1.New(Runtime.New(Result,{
        $:0,
        $0:x
       }),{
        $:0
       }),
       view:function(x1)
       {
        return x1;
       }
      });
     },
     ReturnFailure:function()
     {
      return Runtime.New(Piglet1,{
       stream:Stream1.New(Runtime.New(Result,{
        $:1,
        $0:Runtime.New(T,{
         $:0
        })
       }),{
        $:0
       }),
       view:function(x)
       {
        return x;
       }
      });
     },
     Run:function(action,p)
     {
      return Piglet.RunResult(Result.Iter(action),p);
     },
     RunResult:function(action,p)
     {
      p.stream.Subscribe(action);
      return p;
     },
     TransmitReader:function(p)
     {
      var v,a;
      v=p.view;
      a=p.stream;
      return Runtime.New(Piglet1,{
       stream:p.stream,
       view:function(x)
       {
        return(v(x))(a);
       }
      });
     },
     TransmitReaderMap:function(f,p)
     {
      var v,a;
      v=p.view;
      a=Reader.Map(f,p.stream);
      return Runtime.New(Piglet1,{
       stream:p.stream,
       view:function(x)
       {
        return(v(x))(a);
       }
      });
     },
     TransmitReaderMapResult:function(f,p)
     {
      var v,a;
      v=p.view;
      a=Reader.MapResult(f,p.stream);
      return Runtime.New(Piglet1,{
       stream:p.stream,
       view:function(x)
       {
        return(v(x))(a);
       }
      });
     },
     TransmitReaderMapToResult:function(f,p)
     {
      var v,a;
      v=p.view;
      a=Reader.MapToResult(f,p.stream);
      return Runtime.New(Piglet1,{
       stream:p.stream,
       view:function(x)
       {
        return(v(x))(a);
       }
      });
     },
     TransmitStream:function(p)
     {
      var v,a;
      v=p.view;
      a=p.stream;
      return Runtime.New(Piglet1,{
       stream:p.stream,
       view:function(x)
       {
        return(v(x))(a);
       }
      });
     },
     TransmitWriter:function(p)
     {
      var v,a;
      v=p.view;
      a=p.stream;
      return Runtime.New(Piglet1,{
       stream:p.stream,
       view:function(x)
       {
        return(v(x))(a);
       }
      });
     },
     Validation:{
      Is:function(pred,msg,p)
      {
       var _s_;
       _s_=Stream1.New(p.stream.get_Latest(),{
        $:1,
        $0:p.stream.get_Id()
       });
       p.stream.Subscribe(function(_arg1)
       {
        return _arg1.$==0?pred(_arg1.$0)?_s_.Trigger(Runtime.New(Result,{
         $:0,
         $0:_arg1.$0
        })):_s_.Trigger(Runtime.New(Result,{
         $:1,
         $0:List.ofArray([ErrorMessage.New(msg,_s_.get_Id())])
        })):_s_.Trigger(Runtime.New(Result,{
         $:1,
         $0:_arg1.$0
        }));
       });
       return Runtime.New(Piglet1,{
        stream:_s_,
        view:p.view
       });
      },
      "Is'":function(pred,msg,p)
      {
       var _s_;
       _s_=Stream1.New(p.stream.get_Latest(),{
        $:1,
        $0:p.stream.get_Id()
       });
       p.stream.Subscribe(function(_arg1)
       {
        return _arg1.$==0?pred(_arg1.$0)?_s_.Trigger(Runtime.New(Result,{
         $:0,
         $0:_arg1.$0
        })):_s_.Trigger(Runtime.New(Result,{
         $:1,
         $0:List.ofArray([msg])
        })):_s_.Trigger(Runtime.New(Result,{
         $:1,
         $0:_arg1.$0
        }));
       });
       return Runtime.New(Piglet1,{
        stream:_s_,
        view:p.view
       });
      },
      Match:function(re)
      {
       var objectArg;
       objectArg=new RegExp(re);
       return function(arg00)
       {
        return objectArg.test(arg00);
       };
      },
      NotEmpty:function(x)
      {
       return x!=="";
      }
     },
     WithSubmit:function(pin)
     {
      var submitter,v;
      submitter=Submitter.New(pin.stream,false);
      v=pin.view;
      return Runtime.New(Piglet1,{
       stream:submitter.get_Output(),
       view:function(x)
       {
        return(v(x))(submitter);
       }
      });
     },
     WithSubmitClearError:function(pin)
     {
      var submitter,v;
      submitter=Submitter.New(pin.stream,true);
      v=pin.view;
      return Runtime.New(Piglet1,{
       stream:submitter.get_Output(),
       view:function(x)
       {
        return(v(x))(submitter);
       }
      });
     },
     Yield:function(x)
     {
      var s;
      s=Stream1.New(Runtime.New(Result,{
       $:0,
       $0:x
      }),{
       $:0
      });
      return Runtime.New(Piglet1,{
       stream:s,
       view:function(f)
       {
        return f(s);
       }
      });
     },
     YieldFailure:function()
     {
      var s;
      s=Stream1.New(Runtime.New(Result,{
       $:1,
       $0:Runtime.New(T,{
        $:0
       })
      }),{
       $:0
      });
      return Runtime.New(Piglet1,{
       stream:s,
       view:function(f)
       {
        return f(s);
       }
      });
     },
     YieldOption:function(x,none)
     {
      var _arg00_,_arg10_;
      _arg00_=function(_arg1)
      {
       return _arg1.$==1?_arg1.$0:none;
      };
      _arg10_=function(x1)
      {
       return Unchecked.Equals(x1,none)?{
        $:0
       }:{
        $:1,
        $0:x1
       };
      };
      return Piglet.MapViewArgs(function(_arg20_)
      {
       return Stream3.Map(_arg00_,_arg10_,_arg20_);
      },Piglet.Yield(x));
     }
    },
    Piglet1:Runtime.Class({
     get_Stream:function()
     {
      return this.stream;
     }
    }),
    Reader:Runtime.Class({
     SubscribeImmediate:function(f)
     {
      return this.Subscribe(f);
     },
     Through:function(r)
     {
      var out,_this=this;
      out=Stream1.New(this.get_Latest(),{
       $:0
      });
      r.Subscribe(function(_arg1)
      {
       var msgs,matchValue;
       if(_arg1.$==1)
        {
         msgs=_arg1.$0;
         matchValue=[_this.get_Latest(),List.filter(function(m)
         {
          return m.get_Source()===_this.get_Id();
         },msgs)];
         return matchValue[1].$==0?out.Trigger(_this.get_Latest()):matchValue[0].$==1?out.Trigger(Runtime.New(Result,{
          $:1,
          $0:List.append(matchValue[0].$0,matchValue[1])
         })):out.Trigger(Runtime.New(Result,{
          $:1,
          $0:matchValue[1]
         }));
        }
       else
        {
         return out.Trigger(_this.get_Latest());
        }
      });
      return out;
     },
     get_Id:function()
     {
      return this.id;
     }
    },{
     Const:function(x)
     {
      return ConstReader.New(Runtime.New(Result,{
       $:0,
       $0:x
      }));
     },
     ConstResult:function(x)
     {
      return ConstReader.New(x);
     },
     Map:function(f,r)
     {
      return Reader.MapResult(function(arg10)
      {
       return Result.Map(f,arg10);
      },r);
     },
     Map2:function(f,rb,rc)
     {
      return Reader.MapResult2(function(b)
      {
       return function(c)
       {
        return Result.Map2(f,b,c);
       };
      },rb,rc);
     },
     MapResult:function(f,r)
     {
      var out;
      out=Stream1.New(f(r.get_Latest()),{
       $:0
      });
      r.Subscribe(function(x)
      {
       return out.Trigger(f(x));
      });
      return out;
     },
     MapResult2:function(f,rb,rc)
     {
      var out;
      out=Stream1.New((f(rb.get_Latest()))(rc.get_Latest()),{
       $:0
      });
      rb.Subscribe(function(b)
      {
       return out.Trigger((f(b))(rc.get_Latest()));
      });
      rc.Subscribe(function(c)
      {
       return out.Trigger((f(rb.get_Latest()))(c));
      });
      return out;
     },
     MapToResult:function(f,r)
     {
      return Reader.MapResult(Result.Bind(f),r);
     },
     New:function(id)
     {
      var r;
      r=Runtime.New(this,{});
      r.id=id;
      return r;
     }
    }),
    Result:Runtime.Class({
     get_isSuccess:function()
     {
      return this.$==1?false:true;
     }
    },{
     Ap:function(r1,r2)
     {
      var matchValue;
      matchValue=[r1,r2];
      return matchValue[0].$==1?matchValue[1].$==1?Runtime.New(Result,{
       $:1,
       $0:List.append(matchValue[0].$0,matchValue[1].$0)
      }):Runtime.New(Result,{
       $:1,
       $0:matchValue[0].$0
      }):matchValue[1].$==1?Runtime.New(Result,{
       $:1,
       $0:matchValue[1].$0
      }):Runtime.New(Result,{
       $:0,
       $0:matchValue[0].$0.call(null,matchValue[1].$0)
      });
     },
     Bind:function(f)
     {
      return function(_arg2)
      {
       return _arg2.$==1?Runtime.New(Result,{
        $:1,
        $0:_arg2.$0
       }):f(_arg2.$0);
      };
     },
     Failwith:function(msg)
     {
      return Runtime.New(Result,{
       $:1,
       $0:List.ofArray([ErrorMessage.New(msg,0)])
      });
     },
     Iter:function(f)
     {
      return function(_arg1)
      {
       return _arg1.$==1?null:f(_arg1.$0);
      };
     },
     Join:function(r)
     {
      return r.$==0?r.$0.$==0?Runtime.New(Result,{
       $:0,
       $0:r.$0.$0
      }):Runtime.New(Result,{
       $:1,
       $0:r.$0.$0
      }):Runtime.New(Result,{
       $:1,
       $0:r.$0
      });
     },
     Map:function(f,ra)
     {
      return ra.$==1?Runtime.New(Result,{
       $:1,
       $0:ra.$0
      }):Runtime.New(Result,{
       $:0,
       $0:f(ra.$0)
      });
     },
     Map2:function(f,ra,rb)
     {
      var matchValue,b;
      matchValue=[ra,rb];
      if(matchValue[0].$==1)
       {
        return matchValue[1].$==1?Runtime.New(Result,{
         $:1,
         $0:List.append(matchValue[0].$0,matchValue[1].$0)
        }):Runtime.New(Result,{
         $:1,
         $0:matchValue[0].$0
        });
       }
      else
       {
        if(matchValue[1].$==1)
         {
          return Runtime.New(Result,{
           $:1,
           $0:matchValue[1].$0
          });
         }
        else
         {
          b=matchValue[1].$0;
          return Runtime.New(Result,{
           $:0,
           $0:(f(matchValue[0].$0))(b)
          });
         }
       }
     }
    }),
    Stream:{
     Ap:function(sf,sx)
     {
      var out;
      out=Stream1.New(Result.Ap(sf.get_Latest(),sx.get_Latest()),{
       $:0
      });
      sf.Subscribe(function(f)
      {
       return out.Trigger(Result.Ap(f,sx.get_Latest()));
      });
      sx.Subscribe(function(x)
      {
       return out.Trigger(Result.Ap(sf.get_Latest(),x));
      });
      return out;
     },
     ApJoin:function(sf,sx)
     {
      var out;
      out=Stream1.New(Result.Ap(sf.get_Latest(),Result.Join(sx.get_Latest())),{
       $:0
      });
      sf.Subscribe(function(f)
      {
       return out.Trigger(Result.Ap(f,Result.Join(sx.get_Latest())));
      });
      sx.Subscribe(function(x)
      {
       return out.Trigger(Result.Ap(sf.get_Latest(),Result.Join(x)));
      });
      return out;
     },
     Map:function(a2b,b2a,s)
     {
      var _s_,pa,pb;
      _s_=Stream1.New(Result.Map(a2b,s.get_Latest()),{
       $:1,
       $0:s.get_Id()
      });
      pa=[s.get_Latest()];
      pb=[_s_.get_Latest()];
      s.Subscribe(function(a)
      {
       if(pa[0]!==a)
        {
         pb[0]=Result.Map(a2b,a);
         return _s_.Trigger(pb[0]);
        }
       else
        {
         return null;
        }
      });
      _s_.Subscribe(function(b)
      {
       if(pb[0]!==b)
        {
         pa[0]=Result.Map(b2a,b);
         return s.Trigger(pa[0]);
        }
       else
        {
         return null;
        }
      });
      return _s_;
     }
    },
    Stream1:Runtime.Class({
     Subscribe:function(f)
     {
      return Util.subscribeTo(this.s,f);
     },
     Trigger:function(x)
     {
      return this.s.Trigger(x);
     },
     Trigger1:function(x)
     {
      return this.Trigger(x);
     },
     Write:function(x)
     {
      var _this=this;
      return ConcreteWriter.New(function(_arg1)
      {
       return _arg1.$==0?_this.Trigger(Runtime.New(Result,{
        $:0,
        $0:x
       })):_this.Trigger(Runtime.New(Result,{
        $:1,
        $0:_arg1.$0
       }));
      });
     },
     get_Latest:function()
     {
      return this.s.Latest[0].$0;
     }
    },{
     New:function(init,id)
     {
      return Runtime.New(this,Stream1.New1(HotStream.New(init),id));
     },
     New1:function(s,id)
     {
      var r;
      r=Runtime.New(this,Reader.New(id.$==0?(Id.next())(null):id.$0));
      r.s=s;
      return r;
     }
    }),
    Submitter:Runtime.Class({
     Subscribe:function(f)
     {
      return this.output.Subscribe(f);
     },
     Trigger:function()
     {
      return this.writer.Trigger(Runtime.New(Result,{
       $:0,
       $0:null
      }));
     },
     Trigger1:function(x)
     {
      return this.writer.Trigger(x);
     },
     get_Input:function()
     {
      return this.input;
     },
     get_Latest:function()
     {
      return this.output.get_Latest();
     },
     get_Output:function()
     {
      return this.output;
     }
    },{
     New:function(input,clearError)
     {
      var r;
      r=Runtime.New(this,Reader.New((Id.next())(null)));
      r.input=input;
      r.output=Stream1.New(Runtime.New(Result,{
       $:1,
       $0:Runtime.New(T,{
        $:0
       })
      }),{
       $:0
      });
      r.writer=ConcreteWriter.New(function(unitIn)
      {
       var matchValue;
       matchValue=[unitIn,r.input.get_Latest()];
       return matchValue[0].$==0?matchValue[1].$==0?r.output.Trigger(Runtime.New(Result,{
        $:0,
        $0:matchValue[1].$0
       })):r.output.Trigger(Runtime.New(Result,{
        $:1,
        $0:matchValue[1].$0
       })):matchValue[1].$==0?r.output.Trigger(Runtime.New(Result,{
        $:1,
        $0:matchValue[0].$0
       })):r.output.Trigger(Runtime.New(Result,{
        $:1,
        $0:List.append(matchValue[0].$0,matchValue[1].$0)
       }));
      });
      if(clearError)
       {
        r.input.Subscribe(function()
        {
         var matchValue;
         matchValue=r.output.get_Latest();
         return matchValue.$==1?matchValue.$0.$==0?null:r.output.Trigger(Runtime.New(Result,{
          $:1,
          $0:Runtime.New(T,{
           $:0
          })
         })):r.output.Trigger(Runtime.New(Result,{
          $:1,
          $0:Runtime.New(T,{
           $:0
          })
         }));
        });
       }
      return r;
     }
    })
   }
  }
 });
 Runtime.OnInit(function()
 {
  Piglets=Runtime.Safe(Global.WebSharper.Piglets);
  Choose=Runtime.Safe(Piglets.Choose);
  Stream=Runtime.Safe(Choose.Stream);
  Reader=Runtime.Safe(Piglets.Reader);
  Collections=Runtime.Safe(Global.WebSharper.Collections);
  Dictionary=Runtime.Safe(Collections.Dictionary);
  List=Runtime.Safe(Global.WebSharper.List);
  T=Runtime.Safe(List.T);
  Enumerator=Runtime.Safe(Global.WebSharper.Enumerator);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  Operators=Runtime.Safe(Global.WebSharper.Operators);
  Stream1=Runtime.Safe(Piglets.Stream1);
  Result=Runtime.Safe(Piglets.Result);
  ConcreteReader=Runtime.Safe(Piglets.ConcreteReader);
  Id=Runtime.Safe(Piglets.Id);
  ConcreteWriter=Runtime.Safe(Piglets.ConcreteWriter);
  ConstReader=Runtime.Safe(Piglets.ConstReader);
  Disposable=Runtime.Safe(Piglets.Disposable);
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Operators1=Runtime.Safe(Client.Operators);
  Tags=Runtime.Safe(Client.Tags);
  EventsPervasives=Runtime.Safe(Client.EventsPervasives);
  Controls=Runtime.Safe(Piglets.Controls);
  Attr=Runtime.Safe(Client.Attr);
  Unchecked=Runtime.Safe(Global.WebSharper.Unchecked);
  jQuery=Runtime.Safe(Global.jQuery);
  HtmlContainer=Runtime.Safe(Controls.HtmlContainer);
  Arrays=Runtime.Safe(Global.WebSharper.Arrays);
  Ref=Runtime.Safe(Global.WebSharper.Ref);
  ErrorMessage=Runtime.Safe(Piglets.ErrorMessage);
  Many=Runtime.Safe(Piglets.Many);
  Stream2=Runtime.Safe(Many.Stream);
  Submitter=Runtime.Safe(Piglets.Submitter);
  Operations=Runtime.Safe(Many.Operations);
  ResizeArray=Runtime.Safe(Collections.ResizeArray);
  ResizeArrayProxy=Runtime.Safe(ResizeArray.ResizeArrayProxy);
  UnitStream=Runtime.Safe(Many.UnitStream);
  Pervasives=Runtime.Safe(Piglets.Pervasives);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Piglet1=Runtime.Safe(Piglets.Piglet1);
  Stream3=Runtime.Safe(Piglets.Stream);
  Piglet=Runtime.Safe(Piglets.Piglet);
  Validation=Runtime.Safe(Piglet.Validation);
  RegExp=Runtime.Safe(Global.RegExp);
  Util=Runtime.Safe(Global.WebSharper.Util);
  IntelliFactory=Runtime.Safe(Global.IntelliFactory);
  Reactive=Runtime.Safe(IntelliFactory.Reactive);
  return HotStream=Runtime.Safe(Reactive.HotStream);
 });
 Runtime.OnLoad(function()
 {
  Runtime.Inherit(Stream,Reader);
  Runtime.Inherit(ConcreteReader,Reader);
  Runtime.Inherit(ConstReader,Reader);
  Runtime.Inherit(Stream2,Reader);
  Runtime.Inherit(Stream2,Reader);
  Runtime.Inherit(UnitStream,Stream2);
  Runtime.Inherit(Stream1,Reader);
  Runtime.Inherit(Submitter,Reader);
  Id.next();
  Controls.nextId();
  return;
 });
}());

if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// This is CodeMirror (http://codemirror.net), a code editor
// implemented in JavaScript on top of the browser's DOM.
//
// You can find some technical background for some of the code below
// at http://marijnhaverbeke.nl/blog/#cm-internals .

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    module.exports = mod();
  else if (typeof define == "function" && define.amd) // AMD
    return define([], mod);
  else // Plain browser env
    this.CodeMirror = mod();
})(function() {
  "use strict";

  // BROWSER SNIFFING

  // Kludges for bugs and behavior differences that can't be feature
  // detected are enabled based on userAgent etc sniffing.

  var gecko = /gecko\/\d/i.test(navigator.userAgent);
  var ie_upto10 = /MSIE \d/.test(navigator.userAgent);
  var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
  var ie = ie_upto10 || ie_11up;
  var ie_version = ie && (ie_upto10 ? document.documentMode || 6 : ie_11up[1]);
  var webkit = /WebKit\//.test(navigator.userAgent);
  var qtwebkit = webkit && /Qt\/\d+\.\d+/.test(navigator.userAgent);
  var chrome = /Chrome\//.test(navigator.userAgent);
  var presto = /Opera\//.test(navigator.userAgent);
  var safari = /Apple Computer/.test(navigator.vendor);
  var mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(navigator.userAgent);
  var phantom = /PhantomJS/.test(navigator.userAgent);

  var ios = /AppleWebKit/.test(navigator.userAgent) && /Mobile\/\w+/.test(navigator.userAgent);
  // This is woefully incomplete. Suggestions for alternative methods welcome.
  var mobile = ios || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(navigator.userAgent);
  var mac = ios || /Mac/.test(navigator.platform);
  var windows = /win/i.test(navigator.platform);

  var presto_version = presto && navigator.userAgent.match(/Version\/(\d*\.\d*)/);
  if (presto_version) presto_version = Number(presto_version[1]);
  if (presto_version && presto_version >= 15) { presto = false; webkit = true; }
  // Some browsers use the wrong event properties to signal cmd/ctrl on OS X
  var flipCtrlCmd = mac && (qtwebkit || presto && (presto_version == null || presto_version < 12.11));
  var captureRightClick = gecko || (ie && ie_version >= 9);

  // Optimize some code when these features are not used.
  var sawReadOnlySpans = false, sawCollapsedSpans = false;

  // EDITOR CONSTRUCTOR

  // A CodeMirror instance represents an editor. This is the object
  // that user code is usually dealing with.

  function CodeMirror(place, options) {
    if (!(this instanceof CodeMirror)) return new CodeMirror(place, options);

    this.options = options = options ? copyObj(options) : {};
    // Determine effective options based on given values and defaults.
    copyObj(defaults, options, false);
    setGuttersForLineNumbers(options);

    var doc = options.value;
    if (typeof doc == "string") doc = new Doc(doc, options.mode);
    this.doc = doc;

    var input = new CodeMirror.inputStyles[options.inputStyle](this);
    var display = this.display = new Display(place, doc, input);
    display.wrapper.CodeMirror = this;
    updateGutters(this);
    themeChanged(this);
    if (options.lineWrapping)
      this.display.wrapper.className += " CodeMirror-wrap";
    if (options.autofocus && !mobile) display.input.focus();
    initScrollbars(this);

    this.state = {
      keyMaps: [],  // stores maps added by addKeyMap
      overlays: [], // highlighting overlays, as added by addOverlay
      modeGen: 0,   // bumped when mode/overlay changes, used to invalidate highlighting info
      overwrite: false,
      delayingBlurEvent: false,
      focused: false,
      suppressEdits: false, // used to disable editing during key handlers when in readOnly mode
      pasteIncoming: false, cutIncoming: false, // help recognize paste/cut edits in input.poll
      draggingText: false,
      highlight: new Delayed(), // stores highlight worker timeout
      keySeq: null,  // Unfinished key sequence
      specialChars: null
    };

    var cm = this;

    // Override magic textarea content restore that IE sometimes does
    // on our hidden textarea on reload
    if (ie && ie_version < 11) setTimeout(function() { cm.display.input.reset(true); }, 20);

    registerEventHandlers(this);
    ensureGlobalHandlers();

    startOperation(this);
    this.curOp.forceUpdate = true;
    attachDoc(this, doc);

    if ((options.autofocus && !mobile) || cm.hasFocus())
      setTimeout(bind(onFocus, this), 20);
    else
      onBlur(this);

    for (var opt in optionHandlers) if (optionHandlers.hasOwnProperty(opt))
      optionHandlers[opt](this, options[opt], Init);
    maybeUpdateLineNumberWidth(this);
    if (options.finishInit) options.finishInit(this);
    for (var i = 0; i < initHooks.length; ++i) initHooks[i](this);
    endOperation(this);
    // Suppress optimizelegibility in Webkit, since it breaks text
    // measuring on line wrapping boundaries.
    if (webkit && options.lineWrapping &&
        getComputedStyle(display.lineDiv).textRendering == "optimizelegibility")
      display.lineDiv.style.textRendering = "auto";
  }

  // DISPLAY CONSTRUCTOR

  // The display handles the DOM integration, both for input reading
  // and content drawing. It holds references to DOM nodes and
  // display-related state.

  function Display(place, doc, input) {
    var d = this;
    this.input = input;

    // Covers bottom-right square when both scrollbars are present.
    d.scrollbarFiller = elt("div", null, "CodeMirror-scrollbar-filler");
    d.scrollbarFiller.setAttribute("cm-not-content", "true");
    // Covers bottom of gutter when coverGutterNextToScrollbar is on
    // and h scrollbar is present.
    d.gutterFiller = elt("div", null, "CodeMirror-gutter-filler");
    d.gutterFiller.setAttribute("cm-not-content", "true");
    // Will contain the actual code, positioned to cover the viewport.
    d.lineDiv = elt("div", null, "CodeMirror-code");
    // Elements are added to these to represent selection and cursors.
    d.selectionDiv = elt("div", null, null, "position: relative; z-index: 1");
    d.cursorDiv = elt("div", null, "CodeMirror-cursors");
    // A visibility: hidden element used to find the size of things.
    d.measure = elt("div", null, "CodeMirror-measure");
    // When lines outside of the viewport are measured, they are drawn in this.
    d.lineMeasure = elt("div", null, "CodeMirror-measure");
    // Wraps everything that needs to exist inside the vertically-padded coordinate system
    d.lineSpace = elt("div", [d.measure, d.lineMeasure, d.selectionDiv, d.cursorDiv, d.lineDiv],
                      null, "position: relative; outline: none");
    // Moved around its parent to cover visible view.
    d.mover = elt("div", [elt("div", [d.lineSpace], "CodeMirror-lines")], null, "position: relative");
    // Set to the height of the document, allowing scrolling.
    d.sizer = elt("div", [d.mover], "CodeMirror-sizer");
    d.sizerWidth = null;
    // Behavior of elts with overflow: auto and padding is
    // inconsistent across browsers. This is used to ensure the
    // scrollable area is big enough.
    d.heightForcer = elt("div", null, null, "position: absolute; height: " + scrollerGap + "px; width: 1px;");
    // Will contain the gutters, if any.
    d.gutters = elt("div", null, "CodeMirror-gutters");
    d.lineGutter = null;
    // Actual scrollable element.
    d.scroller = elt("div", [d.sizer, d.heightForcer, d.gutters], "CodeMirror-scroll");
    d.scroller.setAttribute("tabIndex", "-1");
    // The element in which the editor lives.
    d.wrapper = elt("div", [d.scrollbarFiller, d.gutterFiller, d.scroller], "CodeMirror");

    // Work around IE7 z-index bug (not perfect, hence IE7 not really being supported)
    if (ie && ie_version < 8) { d.gutters.style.zIndex = -1; d.scroller.style.paddingRight = 0; }
    if (!webkit && !(gecko && mobile)) d.scroller.draggable = true;

    if (place) {
      if (place.appendChild) place.appendChild(d.wrapper);
      else place(d.wrapper);
    }

    // Current rendered range (may be bigger than the view window).
    d.viewFrom = d.viewTo = doc.first;
    d.reportedViewFrom = d.reportedViewTo = doc.first;
    // Information about the rendered lines.
    d.view = [];
    d.renderedView = null;
    // Holds info about a single rendered line when it was rendered
    // for measurement, while not in view.
    d.externalMeasured = null;
    // Empty space (in pixels) above the view
    d.viewOffset = 0;
    d.lastWrapHeight = d.lastWrapWidth = 0;
    d.updateLineNumbers = null;

    d.nativeBarWidth = d.barHeight = d.barWidth = 0;
    d.scrollbarsClipped = false;

    // Used to only resize the line number gutter when necessary (when
    // the amount of lines crosses a boundary that makes its width change)
    d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null;
    // Set to true when a non-horizontal-scrolling line widget is
    // added. As an optimization, line widget aligning is skipped when
    // this is false.
    d.alignWidgets = false;

    d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;

    // Tracks the maximum line length so that the horizontal scrollbar
    // can be kept static when scrolling.
    d.maxLine = null;
    d.maxLineLength = 0;
    d.maxLineChanged = false;

    // Used for measuring wheel scrolling granularity
    d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null;

    // True when shift is held down.
    d.shift = false;

    // Used to track whether anything happened since the context menu
    // was opened.
    d.selForContextMenu = null;

    d.activeTouch = null;

    input.init(d);
  }

  // STATE UPDATES

  // Used to get the editor into a consistent state again when options change.

  function loadMode(cm) {
    cm.doc.mode = CodeMirror.getMode(cm.options, cm.doc.modeOption);
    resetModeState(cm);
  }

  function resetModeState(cm) {
    cm.doc.iter(function(line) {
      if (line.stateAfter) line.stateAfter = null;
      if (line.styles) line.styles = null;
    });
    cm.doc.frontier = cm.doc.first;
    startWorker(cm, 100);
    cm.state.modeGen++;
    if (cm.curOp) regChange(cm);
  }

  function wrappingChanged(cm) {
    if (cm.options.lineWrapping) {
      addClass(cm.display.wrapper, "CodeMirror-wrap");
      cm.display.sizer.style.minWidth = "";
      cm.display.sizerWidth = null;
    } else {
      rmClass(cm.display.wrapper, "CodeMirror-wrap");
      findMaxLine(cm);
    }
    estimateLineHeights(cm);
    regChange(cm);
    clearCaches(cm);
    setTimeout(function(){updateScrollbars(cm);}, 100);
  }

  // Returns a function that estimates the height of a line, to use as
  // first approximation until the line becomes visible (and is thus
  // properly measurable).
  function estimateHeight(cm) {
    var th = textHeight(cm.display), wrapping = cm.options.lineWrapping;
    var perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
    return function(line) {
      if (lineIsHidden(cm.doc, line)) return 0;

      var widgetsHeight = 0;
      if (line.widgets) for (var i = 0; i < line.widgets.length; i++) {
        if (line.widgets[i].height) widgetsHeight += line.widgets[i].height;
      }

      if (wrapping)
        return widgetsHeight + (Math.ceil(line.text.length / perLine) || 1) * th;
      else
        return widgetsHeight + th;
    };
  }

  function estimateLineHeights(cm) {
    var doc = cm.doc, est = estimateHeight(cm);
    doc.iter(function(line) {
      var estHeight = est(line);
      if (estHeight != line.height) updateLineHeight(line, estHeight);
    });
  }

  function themeChanged(cm) {
    cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") +
      cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
    clearCaches(cm);
  }

  function guttersChanged(cm) {
    updateGutters(cm);
    regChange(cm);
    setTimeout(function(){alignHorizontally(cm);}, 20);
  }

  // Rebuild the gutter elements, ensure the margin to the left of the
  // code matches their width.
  function updateGutters(cm) {
    var gutters = cm.display.gutters, specs = cm.options.gutters;
    removeChildren(gutters);
    for (var i = 0; i < specs.length; ++i) {
      var gutterClass = specs[i];
      var gElt = gutters.appendChild(elt("div", null, "CodeMirror-gutter " + gutterClass));
      if (gutterClass == "CodeMirror-linenumbers") {
        cm.display.lineGutter = gElt;
        gElt.style.width = (cm.display.lineNumWidth || 1) + "px";
      }
    }
    gutters.style.display = i ? "" : "none";
    updateGutterSpace(cm);
  }

  function updateGutterSpace(cm) {
    var width = cm.display.gutters.offsetWidth;
    cm.display.sizer.style.marginLeft = width + "px";
  }

  // Compute the character length of a line, taking into account
  // collapsed ranges (see markText) that might hide parts, and join
  // other lines onto it.
  function lineLength(line) {
    if (line.height == 0) return 0;
    var len = line.text.length, merged, cur = line;
    while (merged = collapsedSpanAtStart(cur)) {
      var found = merged.find(0, true);
      cur = found.from.line;
      len += found.from.ch - found.to.ch;
    }
    cur = line;
    while (merged = collapsedSpanAtEnd(cur)) {
      var found = merged.find(0, true);
      len -= cur.text.length - found.from.ch;
      cur = found.to.line;
      len += cur.text.length - found.to.ch;
    }
    return len;
  }

  // Find the longest line in the document.
  function findMaxLine(cm) {
    var d = cm.display, doc = cm.doc;
    d.maxLine = getLine(doc, doc.first);
    d.maxLineLength = lineLength(d.maxLine);
    d.maxLineChanged = true;
    doc.iter(function(line) {
      var len = lineLength(line);
      if (len > d.maxLineLength) {
        d.maxLineLength = len;
        d.maxLine = line;
      }
    });
  }

  // Make sure the gutters options contains the element
  // "CodeMirror-linenumbers" when the lineNumbers option is true.
  function setGuttersForLineNumbers(options) {
    var found = indexOf(options.gutters, "CodeMirror-linenumbers");
    if (found == -1 && options.lineNumbers) {
      options.gutters = options.gutters.concat(["CodeMirror-linenumbers"]);
    } else if (found > -1 && !options.lineNumbers) {
      options.gutters = options.gutters.slice(0);
      options.gutters.splice(found, 1);
    }
  }

  // SCROLLBARS

  // Prepare DOM reads needed to update the scrollbars. Done in one
  // shot to minimize update/measure roundtrips.
  function measureForScrollbars(cm) {
    var d = cm.display, gutterW = d.gutters.offsetWidth;
    var docH = Math.round(cm.doc.height + paddingVert(cm.display));
    return {
      clientHeight: d.scroller.clientHeight,
      viewHeight: d.wrapper.clientHeight,
      scrollWidth: d.scroller.scrollWidth, clientWidth: d.scroller.clientWidth,
      viewWidth: d.wrapper.clientWidth,
      barLeft: cm.options.fixedGutter ? gutterW : 0,
      docHeight: docH,
      scrollHeight: docH + scrollGap(cm) + d.barHeight,
      nativeBarWidth: d.nativeBarWidth,
      gutterWidth: gutterW
    };
  }

  function NativeScrollbars(place, scroll, cm) {
    this.cm = cm;
    var vert = this.vert = elt("div", [elt("div", null, null, "min-width: 1px")], "CodeMirror-vscrollbar");
    var horiz = this.horiz = elt("div", [elt("div", null, null, "height: 100%; min-height: 1px")], "CodeMirror-hscrollbar");
    place(vert); place(horiz);

    on(vert, "scroll", function() {
      if (vert.clientHeight) scroll(vert.scrollTop, "vertical");
    });
    on(horiz, "scroll", function() {
      if (horiz.clientWidth) scroll(horiz.scrollLeft, "horizontal");
    });

    this.checkedOverlay = false;
    // Need to set a minimum width to see the scrollbar on IE7 (but must not set it on IE8).
    if (ie && ie_version < 8) this.horiz.style.minHeight = this.vert.style.minWidth = "18px";
  }

  NativeScrollbars.prototype = copyObj({
    update: function(measure) {
      var needsH = measure.scrollWidth > measure.clientWidth + 1;
      var needsV = measure.scrollHeight > measure.clientHeight + 1;
      var sWidth = measure.nativeBarWidth;

      if (needsV) {
        this.vert.style.display = "block";
        this.vert.style.bottom = needsH ? sWidth + "px" : "0";
        var totalHeight = measure.viewHeight - (needsH ? sWidth : 0);
        // A bug in IE8 can cause this value to be negative, so guard it.
        this.vert.firstChild.style.height =
          Math.max(0, measure.scrollHeight - measure.clientHeight + totalHeight) + "px";
      } else {
        this.vert.style.display = "";
        this.vert.firstChild.style.height = "0";
      }

      if (needsH) {
        this.horiz.style.display = "block";
        this.horiz.style.right = needsV ? sWidth + "px" : "0";
        this.horiz.style.left = measure.barLeft + "px";
        var totalWidth = measure.viewWidth - measure.barLeft - (needsV ? sWidth : 0);
        this.horiz.firstChild.style.width =
          (measure.scrollWidth - measure.clientWidth + totalWidth) + "px";
      } else {
        this.horiz.style.display = "";
        this.horiz.firstChild.style.width = "0";
      }

      if (!this.checkedOverlay && measure.clientHeight > 0) {
        if (sWidth == 0) this.overlayHack();
        this.checkedOverlay = true;
      }

      return {right: needsV ? sWidth : 0, bottom: needsH ? sWidth : 0};
    },
    setScrollLeft: function(pos) {
      if (this.horiz.scrollLeft != pos) this.horiz.scrollLeft = pos;
    },
    setScrollTop: function(pos) {
      if (this.vert.scrollTop != pos) this.vert.scrollTop = pos;
    },
    overlayHack: function() {
      var w = mac && !mac_geMountainLion ? "12px" : "18px";
      this.horiz.style.minHeight = this.vert.style.minWidth = w;
      var self = this;
      var barMouseDown = function(e) {
        if (e_target(e) != self.vert && e_target(e) != self.horiz)
          operation(self.cm, onMouseDown)(e);
      };
      on(this.vert, "mousedown", barMouseDown);
      on(this.horiz, "mousedown", barMouseDown);
    },
    clear: function() {
      var parent = this.horiz.parentNode;
      parent.removeChild(this.horiz);
      parent.removeChild(this.vert);
    }
  }, NativeScrollbars.prototype);

  function NullScrollbars() {}

  NullScrollbars.prototype = copyObj({
    update: function() { return {bottom: 0, right: 0}; },
    setScrollLeft: function() {},
    setScrollTop: function() {},
    clear: function() {}
  }, NullScrollbars.prototype);

  CodeMirror.scrollbarModel = {"native": NativeScrollbars, "null": NullScrollbars};

  function initScrollbars(cm) {
    if (cm.display.scrollbars) {
      cm.display.scrollbars.clear();
      if (cm.display.scrollbars.addClass)
        rmClass(cm.display.wrapper, cm.display.scrollbars.addClass);
    }

    cm.display.scrollbars = new CodeMirror.scrollbarModel[cm.options.scrollbarStyle](function(node) {
      cm.display.wrapper.insertBefore(node, cm.display.scrollbarFiller);
      // Prevent clicks in the scrollbars from killing focus
      on(node, "mousedown", function() {
        if (cm.state.focused) setTimeout(function() { cm.display.input.focus(); }, 0);
      });
      node.setAttribute("cm-not-content", "true");
    }, function(pos, axis) {
      if (axis == "horizontal") setScrollLeft(cm, pos);
      else setScrollTop(cm, pos);
    }, cm);
    if (cm.display.scrollbars.addClass)
      addClass(cm.display.wrapper, cm.display.scrollbars.addClass);
  }

  function updateScrollbars(cm, measure) {
    if (!measure) measure = measureForScrollbars(cm);
    var startWidth = cm.display.barWidth, startHeight = cm.display.barHeight;
    updateScrollbarsInner(cm, measure);
    for (var i = 0; i < 4 && startWidth != cm.display.barWidth || startHeight != cm.display.barHeight; i++) {
      if (startWidth != cm.display.barWidth && cm.options.lineWrapping)
        updateHeightsInViewport(cm);
      updateScrollbarsInner(cm, measureForScrollbars(cm));
      startWidth = cm.display.barWidth; startHeight = cm.display.barHeight;
    }
  }

  // Re-synchronize the fake scrollbars with the actual size of the
  // content.
  function updateScrollbarsInner(cm, measure) {
    var d = cm.display;
    var sizes = d.scrollbars.update(measure);

    d.sizer.style.paddingRight = (d.barWidth = sizes.right) + "px";
    d.sizer.style.paddingBottom = (d.barHeight = sizes.bottom) + "px";

    if (sizes.right && sizes.bottom) {
      d.scrollbarFiller.style.display = "block";
      d.scrollbarFiller.style.height = sizes.bottom + "px";
      d.scrollbarFiller.style.width = sizes.right + "px";
    } else d.scrollbarFiller.style.display = "";
    if (sizes.bottom && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter) {
      d.gutterFiller.style.display = "block";
      d.gutterFiller.style.height = sizes.bottom + "px";
      d.gutterFiller.style.width = measure.gutterWidth + "px";
    } else d.gutterFiller.style.display = "";
  }

  // Compute the lines that are visible in a given viewport (defaults
  // the the current scroll position). viewport may contain top,
  // height, and ensure (see op.scrollToPos) properties.
  function visibleLines(display, doc, viewport) {
    var top = viewport && viewport.top != null ? Math.max(0, viewport.top) : display.scroller.scrollTop;
    top = Math.floor(top - paddingTop(display));
    var bottom = viewport && viewport.bottom != null ? viewport.bottom : top + display.wrapper.clientHeight;

    var from = lineAtHeight(doc, top), to = lineAtHeight(doc, bottom);
    // Ensure is a {from: {line, ch}, to: {line, ch}} object, and
    // forces those lines into the viewport (if possible).
    if (viewport && viewport.ensure) {
      var ensureFrom = viewport.ensure.from.line, ensureTo = viewport.ensure.to.line;
      if (ensureFrom < from) {
        from = ensureFrom;
        to = lineAtHeight(doc, heightAtLine(getLine(doc, ensureFrom)) + display.wrapper.clientHeight);
      } else if (Math.min(ensureTo, doc.lastLine()) >= to) {
        from = lineAtHeight(doc, heightAtLine(getLine(doc, ensureTo)) - display.wrapper.clientHeight);
        to = ensureTo;
      }
    }
    return {from: from, to: Math.max(to, from + 1)};
  }

  // LINE NUMBERS

  // Re-align line numbers and gutter marks to compensate for
  // horizontal scrolling.
  function alignHorizontally(cm) {
    var display = cm.display, view = display.view;
    if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter)) return;
    var comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
    var gutterW = display.gutters.offsetWidth, left = comp + "px";
    for (var i = 0; i < view.length; i++) if (!view[i].hidden) {
      if (cm.options.fixedGutter && view[i].gutter)
        view[i].gutter.style.left = left;
      var align = view[i].alignable;
      if (align) for (var j = 0; j < align.length; j++)
        align[j].style.left = left;
    }
    if (cm.options.fixedGutter)
      display.gutters.style.left = (comp + gutterW) + "px";
  }

  // Used to ensure that the line number gutter is still the right
  // size for the current document size. Returns true when an update
  // is needed.
  function maybeUpdateLineNumberWidth(cm) {
    if (!cm.options.lineNumbers) return false;
    var doc = cm.doc, last = lineNumberFor(cm.options, doc.first + doc.size - 1), display = cm.display;
    if (last.length != display.lineNumChars) {
      var test = display.measure.appendChild(elt("div", [elt("div", last)],
                                                 "CodeMirror-linenumber CodeMirror-gutter-elt"));
      var innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
      display.lineGutter.style.width = "";
      display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding) + 1;
      display.lineNumWidth = display.lineNumInnerWidth + padding;
      display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;
      display.lineGutter.style.width = display.lineNumWidth + "px";
      updateGutterSpace(cm);
      return true;
    }
    return false;
  }

  function lineNumberFor(options, i) {
    return String(options.lineNumberFormatter(i + options.firstLineNumber));
  }

  // Computes display.scroller.scrollLeft + display.gutters.offsetWidth,
  // but using getBoundingClientRect to get a sub-pixel-accurate
  // result.
  function compensateForHScroll(display) {
    return display.scroller.getBoundingClientRect().left - display.sizer.getBoundingClientRect().left;
  }

  // DISPLAY DRAWING

  function DisplayUpdate(cm, viewport, force) {
    var display = cm.display;

    this.viewport = viewport;
    // Store some values that we'll need later (but don't want to force a relayout for)
    this.visible = visibleLines(display, cm.doc, viewport);
    this.editorIsHidden = !display.wrapper.offsetWidth;
    this.wrapperHeight = display.wrapper.clientHeight;
    this.wrapperWidth = display.wrapper.clientWidth;
    this.oldDisplayWidth = displayWidth(cm);
    this.force = force;
    this.dims = getDimensions(cm);
    this.events = [];
  }

  DisplayUpdate.prototype.signal = function(emitter, type) {
    if (hasHandler(emitter, type))
      this.events.push(arguments);
  };
  DisplayUpdate.prototype.finish = function() {
    for (var i = 0; i < this.events.length; i++)
      signal.apply(null, this.events[i]);
  };

  function maybeClipScrollbars(cm) {
    var display = cm.display;
    if (!display.scrollbarsClipped && display.scroller.offsetWidth) {
      display.nativeBarWidth = display.scroller.offsetWidth - display.scroller.clientWidth;
      display.heightForcer.style.height = scrollGap(cm) + "px";
      display.sizer.style.marginBottom = -display.nativeBarWidth + "px";
      display.sizer.style.borderRightWidth = scrollGap(cm) + "px";
      display.scrollbarsClipped = true;
    }
  }

  // Does the actual updating of the line display. Bails out
  // (returning false) when there is nothing to be done and forced is
  // false.
  function updateDisplayIfNeeded(cm, update) {
    var display = cm.display, doc = cm.doc;

    if (update.editorIsHidden) {
      resetView(cm);
      return false;
    }

    // Bail out if the visible area is already rendered and nothing changed.
    if (!update.force &&
        update.visible.from >= display.viewFrom && update.visible.to <= display.viewTo &&
        (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo) &&
        display.renderedView == display.view && countDirtyView(cm) == 0)
      return false;

    if (maybeUpdateLineNumberWidth(cm)) {
      resetView(cm);
      update.dims = getDimensions(cm);
    }

    // Compute a suitable new viewport (from & to)
    var end = doc.first + doc.size;
    var from = Math.max(update.visible.from - cm.options.viewportMargin, doc.first);
    var to = Math.min(end, update.visible.to + cm.options.viewportMargin);
    if (display.viewFrom < from && from - display.viewFrom < 20) from = Math.max(doc.first, display.viewFrom);
    if (display.viewTo > to && display.viewTo - to < 20) to = Math.min(end, display.viewTo);
    if (sawCollapsedSpans) {
      from = visualLineNo(cm.doc, from);
      to = visualLineEndNo(cm.doc, to);
    }

    var different = from != display.viewFrom || to != display.viewTo ||
      display.lastWrapHeight != update.wrapperHeight || display.lastWrapWidth != update.wrapperWidth;
    adjustView(cm, from, to);

    display.viewOffset = heightAtLine(getLine(cm.doc, display.viewFrom));
    // Position the mover div to align with the current scroll position
    cm.display.mover.style.top = display.viewOffset + "px";

    var toUpdate = countDirtyView(cm);
    if (!different && toUpdate == 0 && !update.force && display.renderedView == display.view &&
        (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo))
      return false;

    // For big changes, we hide the enclosing element during the
    // update, since that speeds up the operations on most browsers.
    var focused = activeElt();
    if (toUpdate > 4) display.lineDiv.style.display = "none";
    patchDisplay(cm, display.updateLineNumbers, update.dims);
    if (toUpdate > 4) display.lineDiv.style.display = "";
    display.renderedView = display.view;
    // There might have been a widget with a focused element that got
    // hidden or updated, if so re-focus it.
    if (focused && activeElt() != focused && focused.offsetHeight) focused.focus();

    // Prevent selection and cursors from interfering with the scroll
    // width and height.
    removeChildren(display.cursorDiv);
    removeChildren(display.selectionDiv);
    display.gutters.style.height = 0;

    if (different) {
      display.lastWrapHeight = update.wrapperHeight;
      display.lastWrapWidth = update.wrapperWidth;
      startWorker(cm, 400);
    }

    display.updateLineNumbers = null;

    return true;
  }

  function postUpdateDisplay(cm, update) {
    var force = update.force, viewport = update.viewport;
    for (var first = true;; first = false) {
      if (first && cm.options.lineWrapping && update.oldDisplayWidth != displayWidth(cm)) {
        force = true;
      } else {
        force = false;
        // Clip forced viewport to actual scrollable area.
        if (viewport && viewport.top != null)
          viewport = {top: Math.min(cm.doc.height + paddingVert(cm.display) - displayHeight(cm), viewport.top)};
        // Updated line heights might result in the drawn area not
        // actually covering the viewport. Keep looping until it does.
        update.visible = visibleLines(cm.display, cm.doc, viewport);
        if (update.visible.from >= cm.display.viewFrom && update.visible.to <= cm.display.viewTo)
          break;
      }
      if (!updateDisplayIfNeeded(cm, update)) break;
      updateHeightsInViewport(cm);
      var barMeasure = measureForScrollbars(cm);
      updateSelection(cm);
      setDocumentHeight(cm, barMeasure);
      updateScrollbars(cm, barMeasure);
    }

    update.signal(cm, "update", cm);
    if (cm.display.viewFrom != cm.display.reportedViewFrom || cm.display.viewTo != cm.display.reportedViewTo) {
      update.signal(cm, "viewportChange", cm, cm.display.viewFrom, cm.display.viewTo);
      cm.display.reportedViewFrom = cm.display.viewFrom; cm.display.reportedViewTo = cm.display.viewTo;
    }
  }

  function updateDisplaySimple(cm, viewport) {
    var update = new DisplayUpdate(cm, viewport);
    if (updateDisplayIfNeeded(cm, update)) {
      updateHeightsInViewport(cm);
      postUpdateDisplay(cm, update);
      var barMeasure = measureForScrollbars(cm);
      updateSelection(cm);
      setDocumentHeight(cm, barMeasure);
      updateScrollbars(cm, barMeasure);
      update.finish();
    }
  }

  function setDocumentHeight(cm, measure) {
    cm.display.sizer.style.minHeight = measure.docHeight + "px";
    var total = measure.docHeight + cm.display.barHeight;
    cm.display.heightForcer.style.top = total + "px";
    cm.display.gutters.style.height = Math.max(total + scrollGap(cm), measure.clientHeight) + "px";
  }

  // Read the actual heights of the rendered lines, and update their
  // stored heights to match.
  function updateHeightsInViewport(cm) {
    var display = cm.display;
    var prevBottom = display.lineDiv.offsetTop;
    for (var i = 0; i < display.view.length; i++) {
      var cur = display.view[i], height;
      if (cur.hidden) continue;
      if (ie && ie_version < 8) {
        var bot = cur.node.offsetTop + cur.node.offsetHeight;
        height = bot - prevBottom;
        prevBottom = bot;
      } else {
        var box = cur.node.getBoundingClientRect();
        height = box.bottom - box.top;
      }
      var diff = cur.line.height - height;
      if (height < 2) height = textHeight(display);
      if (diff > .001 || diff < -.001) {
        updateLineHeight(cur.line, height);
        updateWidgetHeight(cur.line);
        if (cur.rest) for (var j = 0; j < cur.rest.length; j++)
          updateWidgetHeight(cur.rest[j]);
      }
    }
  }

  // Read and store the height of line widgets associated with the
  // given line.
  function updateWidgetHeight(line) {
    if (line.widgets) for (var i = 0; i < line.widgets.length; ++i)
      line.widgets[i].height = line.widgets[i].node.offsetHeight;
  }

  // Do a bulk-read of the DOM positions and sizes needed to draw the
  // view, so that we don't interleave reading and writing to the DOM.
  function getDimensions(cm) {
    var d = cm.display, left = {}, width = {};
    var gutterLeft = d.gutters.clientLeft;
    for (var n = d.gutters.firstChild, i = 0; n; n = n.nextSibling, ++i) {
      left[cm.options.gutters[i]] = n.offsetLeft + n.clientLeft + gutterLeft;
      width[cm.options.gutters[i]] = n.clientWidth;
    }
    return {fixedPos: compensateForHScroll(d),
            gutterTotalWidth: d.gutters.offsetWidth,
            gutterLeft: left,
            gutterWidth: width,
            wrapperWidth: d.wrapper.clientWidth};
  }

  // Sync the actual display DOM structure with display.view, removing
  // nodes for lines that are no longer in view, and creating the ones
  // that are not there yet, and updating the ones that are out of
  // date.
  function patchDisplay(cm, updateNumbersFrom, dims) {
    var display = cm.display, lineNumbers = cm.options.lineNumbers;
    var container = display.lineDiv, cur = container.firstChild;

    function rm(node) {
      var next = node.nextSibling;
      // Works around a throw-scroll bug in OS X Webkit
      if (webkit && mac && cm.display.currentWheelTarget == node)
        node.style.display = "none";
      else
        node.parentNode.removeChild(node);
      return next;
    }

    var view = display.view, lineN = display.viewFrom;
    // Loop over the elements in the view, syncing cur (the DOM nodes
    // in display.lineDiv) with the view as we go.
    for (var i = 0; i < view.length; i++) {
      var lineView = view[i];
      if (lineView.hidden) {
      } else if (!lineView.node || lineView.node.parentNode != container) { // Not drawn yet
        var node = buildLineElement(cm, lineView, lineN, dims);
        container.insertBefore(node, cur);
      } else { // Already drawn
        while (cur != lineView.node) cur = rm(cur);
        var updateNumber = lineNumbers && updateNumbersFrom != null &&
          updateNumbersFrom <= lineN && lineView.lineNumber;
        if (lineView.changes) {
          if (indexOf(lineView.changes, "gutter") > -1) updateNumber = false;
          updateLineForChanges(cm, lineView, lineN, dims);
        }
        if (updateNumber) {
          removeChildren(lineView.lineNumber);
          lineView.lineNumber.appendChild(document.createTextNode(lineNumberFor(cm.options, lineN)));
        }
        cur = lineView.node.nextSibling;
      }
      lineN += lineView.size;
    }
    while (cur) cur = rm(cur);
  }

  // When an aspect of a line changes, a string is added to
  // lineView.changes. This updates the relevant part of the line's
  // DOM structure.
  function updateLineForChanges(cm, lineView, lineN, dims) {
    for (var j = 0; j < lineView.changes.length; j++) {
      var type = lineView.changes[j];
      if (type == "text") updateLineText(cm, lineView);
      else if (type == "gutter") updateLineGutter(cm, lineView, lineN, dims);
      else if (type == "class") updateLineClasses(lineView);
      else if (type == "widget") updateLineWidgets(cm, lineView, dims);
    }
    lineView.changes = null;
  }

  // Lines with gutter elements, widgets or a background class need to
  // be wrapped, and have the extra elements added to the wrapper div
  function ensureLineWrapped(lineView) {
    if (lineView.node == lineView.text) {
      lineView.node = elt("div", null, null, "position: relative");
      if (lineView.text.parentNode)
        lineView.text.parentNode.replaceChild(lineView.node, lineView.text);
      lineView.node.appendChild(lineView.text);
      if (ie && ie_version < 8) lineView.node.style.zIndex = 2;
    }
    return lineView.node;
  }

  function updateLineBackground(lineView) {
    var cls = lineView.bgClass ? lineView.bgClass + " " + (lineView.line.bgClass || "") : lineView.line.bgClass;
    if (cls) cls += " CodeMirror-linebackground";
    if (lineView.background) {
      if (cls) lineView.background.className = cls;
      else { lineView.background.parentNode.removeChild(lineView.background); lineView.background = null; }
    } else if (cls) {
      var wrap = ensureLineWrapped(lineView);
      lineView.background = wrap.insertBefore(elt("div", null, cls), wrap.firstChild);
    }
  }

  // Wrapper around buildLineContent which will reuse the structure
  // in display.externalMeasured when possible.
  function getLineContent(cm, lineView) {
    var ext = cm.display.externalMeasured;
    if (ext && ext.line == lineView.line) {
      cm.display.externalMeasured = null;
      lineView.measure = ext.measure;
      return ext.built;
    }
    return buildLineContent(cm, lineView);
  }

  // Redraw the line's text. Interacts with the background and text
  // classes because the mode may output tokens that influence these
  // classes.
  function updateLineText(cm, lineView) {
    var cls = lineView.text.className;
    var built = getLineContent(cm, lineView);
    if (lineView.text == lineView.node) lineView.node = built.pre;
    lineView.text.parentNode.replaceChild(built.pre, lineView.text);
    lineView.text = built.pre;
    if (built.bgClass != lineView.bgClass || built.textClass != lineView.textClass) {
      lineView.bgClass = built.bgClass;
      lineView.textClass = built.textClass;
      updateLineClasses(lineView);
    } else if (cls) {
      lineView.text.className = cls;
    }
  }

  function updateLineClasses(lineView) {
    updateLineBackground(lineView);
    if (lineView.line.wrapClass)
      ensureLineWrapped(lineView).className = lineView.line.wrapClass;
    else if (lineView.node != lineView.text)
      lineView.node.className = "";
    var textClass = lineView.textClass ? lineView.textClass + " " + (lineView.line.textClass || "") : lineView.line.textClass;
    lineView.text.className = textClass || "";
  }

  function updateLineGutter(cm, lineView, lineN, dims) {
    if (lineView.gutter) {
      lineView.node.removeChild(lineView.gutter);
      lineView.gutter = null;
    }
    var markers = lineView.line.gutterMarkers;
    if (cm.options.lineNumbers || markers) {
      var wrap = ensureLineWrapped(lineView);
      var gutterWrap = lineView.gutter = elt("div", null, "CodeMirror-gutter-wrapper", "left: " +
                                             (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) +
                                             "px; width: " + dims.gutterTotalWidth + "px");
      cm.display.input.setUneditable(gutterWrap);
      wrap.insertBefore(gutterWrap, lineView.text);
      if (lineView.line.gutterClass)
        gutterWrap.className += " " + lineView.line.gutterClass;
      if (cm.options.lineNumbers && (!markers || !markers["CodeMirror-linenumbers"]))
        lineView.lineNumber = gutterWrap.appendChild(
          elt("div", lineNumberFor(cm.options, lineN),
              "CodeMirror-linenumber CodeMirror-gutter-elt",
              "left: " + dims.gutterLeft["CodeMirror-linenumbers"] + "px; width: "
              + cm.display.lineNumInnerWidth + "px"));
      if (markers) for (var k = 0; k < cm.options.gutters.length; ++k) {
        var id = cm.options.gutters[k], found = markers.hasOwnProperty(id) && markers[id];
        if (found)
          gutterWrap.appendChild(elt("div", [found], "CodeMirror-gutter-elt", "left: " +
                                     dims.gutterLeft[id] + "px; width: " + dims.gutterWidth[id] + "px"));
      }
    }
  }

  function updateLineWidgets(cm, lineView, dims) {
    if (lineView.alignable) lineView.alignable = null;
    for (var node = lineView.node.firstChild, next; node; node = next) {
      var next = node.nextSibling;
      if (node.className == "CodeMirror-linewidget")
        lineView.node.removeChild(node);
    }
    insertLineWidgets(cm, lineView, dims);
  }

  // Build a line's DOM representation from scratch
  function buildLineElement(cm, lineView, lineN, dims) {
    var built = getLineContent(cm, lineView);
    lineView.text = lineView.node = built.pre;
    if (built.bgClass) lineView.bgClass = built.bgClass;
    if (built.textClass) lineView.textClass = built.textClass;

    updateLineClasses(lineView);
    updateLineGutter(cm, lineView, lineN, dims);
    insertLineWidgets(cm, lineView, dims);
    return lineView.node;
  }

  // A lineView may contain multiple logical lines (when merged by
  // collapsed spans). The widgets for all of them need to be drawn.
  function insertLineWidgets(cm, lineView, dims) {
    insertLineWidgetsFor(cm, lineView.line, lineView, dims, true);
    if (lineView.rest) for (var i = 0; i < lineView.rest.length; i++)
      insertLineWidgetsFor(cm, lineView.rest[i], lineView, dims, false);
  }

  function insertLineWidgetsFor(cm, line, lineView, dims, allowAbove) {
    if (!line.widgets) return;
    var wrap = ensureLineWrapped(lineView);
    for (var i = 0, ws = line.widgets; i < ws.length; ++i) {
      var widget = ws[i], node = elt("div", [widget.node], "CodeMirror-linewidget");
      if (!widget.handleMouseEvents) node.setAttribute("cm-ignore-events", "true");
      positionLineWidget(widget, node, lineView, dims);
      cm.display.input.setUneditable(node);
      if (allowAbove && widget.above)
        wrap.insertBefore(node, lineView.gutter || lineView.text);
      else
        wrap.appendChild(node);
      signalLater(widget, "redraw");
    }
  }

  function positionLineWidget(widget, node, lineView, dims) {
    if (widget.noHScroll) {
      (lineView.alignable || (lineView.alignable = [])).push(node);
      var width = dims.wrapperWidth;
      node.style.left = dims.fixedPos + "px";
      if (!widget.coverGutter) {
        width -= dims.gutterTotalWidth;
        node.style.paddingLeft = dims.gutterTotalWidth + "px";
      }
      node.style.width = width + "px";
    }
    if (widget.coverGutter) {
      node.style.zIndex = 5;
      node.style.position = "relative";
      if (!widget.noHScroll) node.style.marginLeft = -dims.gutterTotalWidth + "px";
    }
  }

  // POSITION OBJECT

  // A Pos instance represents a position within the text.
  var Pos = CodeMirror.Pos = function(line, ch) {
    if (!(this instanceof Pos)) return new Pos(line, ch);
    this.line = line; this.ch = ch;
  };

  // Compare two positions, return 0 if they are the same, a negative
  // number when a is less, and a positive number otherwise.
  var cmp = CodeMirror.cmpPos = function(a, b) { return a.line - b.line || a.ch - b.ch; };

  function copyPos(x) {return Pos(x.line, x.ch);}
  function maxPos(a, b) { return cmp(a, b) < 0 ? b : a; }
  function minPos(a, b) { return cmp(a, b) < 0 ? a : b; }

  // INPUT HANDLING

  function ensureFocus(cm) {
    if (!cm.state.focused) { cm.display.input.focus(); onFocus(cm); }
  }

  function isReadOnly(cm) {
    return cm.options.readOnly || cm.doc.cantEdit;
  }

  // This will be set to an array of strings when copying, so that,
  // when pasting, we know what kind of selections the copied text
  // was made out of.
  var lastCopied = null;

  function applyTextInput(cm, inserted, deleted, sel) {
    var doc = cm.doc;
    cm.display.shift = false;
    if (!sel) sel = doc.sel;

    var textLines = splitLines(inserted), multiPaste = null;
    // When pasing N lines into N selections, insert one line per selection
    if (cm.state.pasteIncoming && sel.ranges.length > 1) {
      if (lastCopied && lastCopied.join("\n") == inserted)
        multiPaste = sel.ranges.length % lastCopied.length == 0 && map(lastCopied, splitLines);
      else if (textLines.length == sel.ranges.length)
        multiPaste = map(textLines, function(l) { return [l]; });
    }

    // Normal behavior is to insert the new text into every selection
    for (var i = sel.ranges.length - 1; i >= 0; i--) {
      var range = sel.ranges[i];
      var from = range.from(), to = range.to();
      if (range.empty()) {
        if (deleted && deleted > 0) // Handle deletion
          from = Pos(from.line, from.ch - deleted);
        else if (cm.state.overwrite && !cm.state.pasteIncoming) // Handle overwrite
          to = Pos(to.line, Math.min(getLine(doc, to.line).text.length, to.ch + lst(textLines).length));
      }
      var updateInput = cm.curOp.updateInput;
      var changeEvent = {from: from, to: to, text: multiPaste ? multiPaste[i % multiPaste.length] : textLines,
                         origin: cm.state.pasteIncoming ? "paste" : cm.state.cutIncoming ? "cut" : "+input"};
      makeChange(cm.doc, changeEvent);
      signalLater(cm, "inputRead", cm, changeEvent);
      // When an 'electric' character is inserted, immediately trigger a reindent
      if (inserted && !cm.state.pasteIncoming && cm.options.electricChars &&
          cm.options.smartIndent && range.head.ch < 100 &&
          (!i || sel.ranges[i - 1].head.line != range.head.line)) {
        var mode = cm.getModeAt(range.head);
        var end = changeEnd(changeEvent);
        if (mode.electricChars) {
          for (var j = 0; j < mode.electricChars.length; j++)
            if (inserted.indexOf(mode.electricChars.charAt(j)) > -1) {
              indentLine(cm, end.line, "smart");
              break;
            }
        } else if (mode.electricInput) {
          if (mode.electricInput.test(getLine(doc, end.line).text.slice(0, end.ch)))
            indentLine(cm, end.line, "smart");
        }
      }
    }
    ensureCursorVisible(cm);
    cm.curOp.updateInput = updateInput;
    cm.curOp.typing = true;
    cm.state.pasteIncoming = cm.state.cutIncoming = false;
  }

  function copyableRanges(cm) {
    var text = [], ranges = [];
    for (var i = 0; i < cm.doc.sel.ranges.length; i++) {
      var line = cm.doc.sel.ranges[i].head.line;
      var lineRange = {anchor: Pos(line, 0), head: Pos(line + 1, 0)};
      ranges.push(lineRange);
      text.push(cm.getRange(lineRange.anchor, lineRange.head));
    }
    return {text: text, ranges: ranges};
  }

  function disableBrowserMagic(field) {
    field.setAttribute("autocorrect", "off");
    field.setAttribute("autocapitalize", "off");
    field.setAttribute("spellcheck", "false");
  }

  // TEXTAREA INPUT STYLE

  function TextareaInput(cm) {
    this.cm = cm;
    // See input.poll and input.reset
    this.prevInput = "";

    // Flag that indicates whether we expect input to appear real soon
    // now (after some event like 'keypress' or 'input') and are
    // polling intensively.
    this.pollingFast = false;
    // Self-resetting timeout for the poller
    this.polling = new Delayed();
    // Tracks when input.reset has punted to just putting a short
    // string into the textarea instead of the full selection.
    this.inaccurateSelection = false;
    // Used to work around IE issue with selection being forgotten when focus moves away from textarea
    this.hasSelection = false;
  };

  function hiddenTextarea() {
    var te = elt("textarea", null, null, "position: absolute; padding: 0; width: 1px; height: 1em; outline: none");
    var div = elt("div", [te], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
    // The textarea is kept positioned near the cursor to prevent the
    // fact that it'll be scrolled into view on input from scrolling
    // our fake cursor out of view. On webkit, when wrap=off, paste is
    // very slow. So make the area wide instead.
    if (webkit) te.style.width = "1000px";
    else te.setAttribute("wrap", "off");
    // If border: 0; -- iOS fails to open keyboard (issue #1287)
    if (ios) te.style.border = "1px solid black";
    disableBrowserMagic(te);
    return div;
  }

  TextareaInput.prototype = copyObj({
    init: function(display) {
      var input = this, cm = this.cm;

      // Wraps and hides input textarea
      var div = this.wrapper = hiddenTextarea();
      // The semihidden textarea that is focused when the editor is
      // focused, and receives input.
      var te = this.textarea = div.firstChild;
      display.wrapper.insertBefore(div, display.wrapper.firstChild);

      // Needed to hide big blue blinking cursor on Mobile Safari (doesn't seem to work in iOS 8 anymore)
      if (ios) te.style.width = "0px";

      on(te, "input", function() {
        if (ie && ie_version >= 9 && input.hasSelection) input.hasSelection = null;
        input.poll();
      });

      on(te, "paste", function() {
        // Workaround for webkit bug https://bugs.webkit.org/show_bug.cgi?id=90206
        // Add a char to the end of textarea before paste occur so that
        // selection doesn't span to the end of textarea.
        if (webkit && !cm.state.fakedLastChar && !(new Date - cm.state.lastMiddleDown < 200)) {
          var start = te.selectionStart, end = te.selectionEnd;
          te.value += "$";
          // The selection end needs to be set before the start, otherwise there
          // can be an intermediate non-empty selection between the two, which
          // can override the middle-click paste buffer on linux and cause the
          // wrong thing to get pasted.
          te.selectionEnd = end;
          te.selectionStart = start;
          cm.state.fakedLastChar = true;
        }
        cm.state.pasteIncoming = true;
        input.fastPoll();
      });

      function prepareCopyCut(e) {
        if (cm.somethingSelected()) {
          lastCopied = cm.getSelections();
          if (input.inaccurateSelection) {
            input.prevInput = "";
            input.inaccurateSelection = false;
            te.value = lastCopied.join("\n");
            selectInput(te);
          }
        } else {
          var ranges = copyableRanges(cm);
          lastCopied = ranges.text;
          if (e.type == "cut") {
            cm.setSelections(ranges.ranges, null, sel_dontScroll);
          } else {
            input.prevInput = "";
            te.value = ranges.text.join("\n");
            selectInput(te);
          }
        }
        if (e.type == "cut") cm.state.cutIncoming = true;
      }
      on(te, "cut", prepareCopyCut);
      on(te, "copy", prepareCopyCut);

      on(display.scroller, "paste", function(e) {
        if (eventInWidget(display, e)) return;
        cm.state.pasteIncoming = true;
        input.focus();
      });

      // Prevent normal selection in the editor (we handle our own)
      on(display.lineSpace, "selectstart", function(e) {
        if (!eventInWidget(display, e)) e_preventDefault(e);
      });
    },

    prepareSelection: function() {
      // Redraw the selection and/or cursor
      var cm = this.cm, display = cm.display, doc = cm.doc;
      var result = prepareSelection(cm);

      // Move the hidden textarea near the cursor to prevent scrolling artifacts
      if (cm.options.moveInputWithCursor) {
        var headPos = cursorCoords(cm, doc.sel.primary().head, "div");
        var wrapOff = display.wrapper.getBoundingClientRect(), lineOff = display.lineDiv.getBoundingClientRect();
        result.teTop = Math.max(0, Math.min(display.wrapper.clientHeight - 10,
                                            headPos.top + lineOff.top - wrapOff.top));
        result.teLeft = Math.max(0, Math.min(display.wrapper.clientWidth - 10,
                                             headPos.left + lineOff.left - wrapOff.left));
      }

      return result;
    },

    showSelection: function(drawn) {
      var cm = this.cm, display = cm.display;
      removeChildrenAndAdd(display.cursorDiv, drawn.cursors);
      removeChildrenAndAdd(display.selectionDiv, drawn.selection);
      if (drawn.teTop != null) {
        this.wrapper.style.top = drawn.teTop + "px";
        this.wrapper.style.left = drawn.teLeft + "px";
      }
    },

    // Reset the input to correspond to the selection (or to be empty,
    // when not typing and nothing is selected)
    reset: function(typing) {
      if (this.contextMenuPending) return;
      var minimal, selected, cm = this.cm, doc = cm.doc;
      if (cm.somethingSelected()) {
        this.prevInput = "";
        var range = doc.sel.primary();
        minimal = hasCopyEvent &&
          (range.to().line - range.from().line > 100 || (selected = cm.getSelection()).length > 1000);
        var content = minimal ? "-" : selected || cm.getSelection();
        this.textarea.value = content;
        if (cm.state.focused) selectInput(this.textarea);
        if (ie && ie_version >= 9) this.hasSelection = content;
      } else if (!typing) {
        this.prevInput = this.textarea.value = "";
        if (ie && ie_version >= 9) this.hasSelection = null;
      }
      this.inaccurateSelection = minimal;
    },

    getField: function() { return this.textarea; },

    supportsTouch: function() { return false; },

    focus: function() {
      if (this.cm.options.readOnly != "nocursor" && (!mobile || activeElt() != this.textarea)) {
        try { this.textarea.focus(); }
        catch (e) {} // IE8 will throw if the textarea is display: none or not in DOM
      }
    },

    blur: function() { this.textarea.blur(); },

    resetPosition: function() {
      this.wrapper.style.top = this.wrapper.style.left = 0;
    },

    receivedFocus: function() { this.slowPoll(); },

    // Poll for input changes, using the normal rate of polling. This
    // runs as long as the editor is focused.
    slowPoll: function() {
      var input = this;
      if (input.pollingFast) return;
      input.polling.set(this.cm.options.pollInterval, function() {
        input.poll();
        if (input.cm.state.focused) input.slowPoll();
      });
    },

    // When an event has just come in that is likely to add or change
    // something in the input textarea, we poll faster, to ensure that
    // the change appears on the screen quickly.
    fastPoll: function() {
      var missed = false, input = this;
      input.pollingFast = true;
      function p() {
        var changed = input.poll();
        if (!changed && !missed) {missed = true; input.polling.set(60, p);}
        else {input.pollingFast = false; input.slowPoll();}
      }
      input.polling.set(20, p);
    },

    // Read input from the textarea, and update the document to match.
    // When something is selected, it is present in the textarea, and
    // selected (unless it is huge, in which case a placeholder is
    // used). When nothing is selected, the cursor sits after previously
    // seen text (can be empty), which is stored in prevInput (we must
    // not reset the textarea when typing, because that breaks IME).
    poll: function() {
      var cm = this.cm, input = this.textarea, prevInput = this.prevInput;
      // Since this is called a *lot*, try to bail out as cheaply as
      // possible when it is clear that nothing happened. hasSelection
      // will be the case when there is a lot of text in the textarea,
      // in which case reading its value would be expensive.
      if (!cm.state.focused || (hasSelection(input) && !prevInput) ||
          isReadOnly(cm) || cm.options.disableInput || cm.state.keySeq)
        return false;
      // See paste handler for more on the fakedLastChar kludge
      if (cm.state.pasteIncoming && cm.state.fakedLastChar) {
        input.value = input.value.substring(0, input.value.length - 1);
        cm.state.fakedLastChar = false;
      }
      var text = input.value;
      // If nothing changed, bail.
      if (text == prevInput && !cm.somethingSelected()) return false;
      // Work around nonsensical selection resetting in IE9/10, and
      // inexplicable appearance of private area unicode characters on
      // some key combos in Mac (#2689).
      if (ie && ie_version >= 9 && this.hasSelection === text ||
          mac && /[\uf700-\uf7ff]/.test(text)) {
        cm.display.input.reset();
        return false;
      }

      if (cm.doc.sel == cm.display.selForContextMenu) {
        if (text.charCodeAt(0) == 0x200b) {
          if (!prevInput) prevInput = "\u200b";
        } else if (prevInput == "\u200b") {
          text = text.slice(1);
          prevInput = "";
        }
      }
      // Find the part of the input that is actually new
      var same = 0, l = Math.min(prevInput.length, text.length);
      while (same < l && prevInput.charCodeAt(same) == text.charCodeAt(same)) ++same;

      var self = this;
      runInOp(cm, function() {
        applyTextInput(cm, text.slice(same), prevInput.length - same);

        // Don't leave long text in the textarea, since it makes further polling slow
        if (text.length > 1000 || text.indexOf("\n") > -1) input.value = self.prevInput = "";
        else self.prevInput = text;
      });
      return true;
    },

    ensurePolled: function() {
      if (this.pollingFast && this.poll()) this.pollingFast = false;
    },

    onKeyPress: function() {
      if (ie && ie_version >= 9) this.hasSelection = null;
      this.fastPoll();
    },

    onContextMenu: function(e) {
      var input = this, cm = input.cm, display = cm.display, te = input.textarea;
      var pos = posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;
      if (!pos || presto) return; // Opera is difficult.

      // Reset the current text selection only if the click is done outside of the selection
      // and 'resetSelectionOnContextMenu' option is true.
      var reset = cm.options.resetSelectionOnContextMenu;
      if (reset && cm.doc.sel.contains(pos) == -1)
        operation(cm, setSelection)(cm.doc, simpleSelection(pos), sel_dontScroll);

      var oldCSS = te.style.cssText;
      input.wrapper.style.position = "absolute";
      te.style.cssText = "position: fixed; width: 30px; height: 30px; top: " + (e.clientY - 5) +
        "px; left: " + (e.clientX - 5) + "px; z-index: 1000; background: " +
        (ie ? "rgba(255, 255, 255, .05)" : "transparent") +
        "; outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
      if (webkit) var oldScrollY = window.scrollY; // Work around Chrome issue (#2712)
      display.input.focus();
      if (webkit) window.scrollTo(null, oldScrollY);
      display.input.reset();
      // Adds "Select all" to context menu in FF
      if (!cm.somethingSelected()) te.value = input.prevInput = " ";
      input.contextMenuPending = true;
      display.selForContextMenu = cm.doc.sel;
      clearTimeout(display.detectingSelectAll);

      // Select-all will be greyed out if there's nothing to select, so
      // this adds a zero-width space so that we can later check whether
      // it got selected.
      function prepareSelectAllHack() {
        if (te.selectionStart != null) {
          var selected = cm.somethingSelected();
          var extval = te.value = "\u200b" + (selected ? te.value : "");
          input.prevInput = selected ? "" : "\u200b";
          te.selectionStart = 1; te.selectionEnd = extval.length;
          // Re-set this, in case some other handler touched the
          // selection in the meantime.
          display.selForContextMenu = cm.doc.sel;
        }
      }
      function rehide() {
        input.contextMenuPending = false;
        input.wrapper.style.position = "relative";
        te.style.cssText = oldCSS;
        if (ie && ie_version < 9) display.scrollbars.setScrollTop(display.scroller.scrollTop = scrollPos);

        // Try to detect the user choosing select-all
        if (te.selectionStart != null) {
          if (!ie || (ie && ie_version < 9)) prepareSelectAllHack();
          var i = 0, poll = function() {
            if (display.selForContextMenu == cm.doc.sel && te.selectionStart == 0 && input.prevInput == "\u200b")
              operation(cm, commands.selectAll)(cm);
            else if (i++ < 10) display.detectingSelectAll = setTimeout(poll, 500);
            else display.input.reset();
          };
          display.detectingSelectAll = setTimeout(poll, 200);
        }
      }

      if (ie && ie_version >= 9) prepareSelectAllHack();
      if (captureRightClick) {
        e_stop(e);
        var mouseup = function() {
          off(window, "mouseup", mouseup);
          setTimeout(rehide, 20);
        };
        on(window, "mouseup", mouseup);
      } else {
        setTimeout(rehide, 50);
      }
    },

    setUneditable: nothing,

    needsContentAttribute: false
  }, TextareaInput.prototype);

  // CONTENTEDITABLE INPUT STYLE

  function ContentEditableInput(cm) {
    this.cm = cm;
    this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
    this.polling = new Delayed();
    this.gracePeriod = false;
  }

  ContentEditableInput.prototype = copyObj({
    init: function(display) {
      var input = this, cm = input.cm;
      var div = input.div = display.lineDiv;
      div.contentEditable = "true";
      disableBrowserMagic(div);

      on(div, "paste", function(e) {
        var pasted = e.clipboardData && e.clipboardData.getData("text/plain");
        if (pasted) {
          e.preventDefault();
          cm.replaceSelection(pasted, null, "paste");
        }
      });

      on(div, "compositionstart", function(e) {
        var data = e.data;
        input.composing = {sel: cm.doc.sel, data: data, startData: data};
        if (!data) return;
        var prim = cm.doc.sel.primary();
        var line = cm.getLine(prim.head.line);
        var found = line.indexOf(data, Math.max(0, prim.head.ch - data.length));
        if (found > -1 && found <= prim.head.ch)
          input.composing.sel = simpleSelection(Pos(prim.head.line, found),
                                                Pos(prim.head.line, found + data.length));
      });
      on(div, "compositionupdate", function(e) {
        input.composing.data = e.data;
      });
      on(div, "compositionend", function(e) {
        var ours = input.composing;
        if (!ours) return;
        if (e.data != ours.startData && !/\u200b/.test(e.data))
          ours.data = e.data;
        // Need a small delay to prevent other code (input event,
        // selection polling) from doing damage when fired right after
        // compositionend.
        setTimeout(function() {
          if (!ours.handled)
            input.applyComposition(ours);
          if (input.composing == ours)
            input.composing = null;
        }, 50);
      });

      on(div, "touchstart", function() {
        input.forceCompositionEnd();
      });

      on(div, "input", function() {
        if (input.composing) return;
        if (!input.pollContent())
          runInOp(input.cm, function() {regChange(cm);});
      });

      function onCopyCut(e) {
        if (cm.somethingSelected()) {
          lastCopied = cm.getSelections();
          if (e.type == "cut") cm.replaceSelection("", null, "cut");
        } else {
          var ranges = copyableRanges(cm);
          lastCopied = ranges.text;
          if (e.type == "cut") {
            cm.operation(function() {
              cm.setSelections(ranges.ranges, 0, sel_dontScroll);
              cm.replaceSelection("", null, "cut");
            });
          }
        }
        // iOS exposes the clipboard API, but seems to discard content inserted into it
        if (e.clipboardData && !ios) {
          e.preventDefault();
          e.clipboardData.clearData();
          e.clipboardData.setData("text/plain", lastCopied.join("\n"));
        } else {
          // Old-fashioned briefly-focus-a-textarea hack
          var kludge = hiddenTextarea(), te = kludge.firstChild;
          cm.display.lineSpace.insertBefore(kludge, cm.display.lineSpace.firstChild);
          te.value = lastCopied.join("\n");
          var hadFocus = document.activeElement;
          selectInput(te);
          setTimeout(function() {
            cm.display.lineSpace.removeChild(kludge);
            hadFocus.focus();
          }, 50);
        }
      }
      on(div, "copy", onCopyCut);
      on(div, "cut", onCopyCut);
    },

    prepareSelection: function() {
      var result = prepareSelection(this.cm, false);
      result.focus = this.cm.state.focused;
      return result;
    },

    showSelection: function(info) {
      if (!info || !this.cm.display.view.length) return;
      if (info.focus) this.showPrimarySelection();
      this.showMultipleSelections(info);
    },

    showPrimarySelection: function() {
      var sel = window.getSelection(), prim = this.cm.doc.sel.primary();
      var curAnchor = domToPos(this.cm, sel.anchorNode, sel.anchorOffset);
      var curFocus = domToPos(this.cm, sel.focusNode, sel.focusOffset);
      if (curAnchor && !curAnchor.bad && curFocus && !curFocus.bad &&
          cmp(minPos(curAnchor, curFocus), prim.from()) == 0 &&
          cmp(maxPos(curAnchor, curFocus), prim.to()) == 0)
        return;

      var start = posToDOM(this.cm, prim.from());
      var end = posToDOM(this.cm, prim.to());
      if (!start && !end) return;

      var view = this.cm.display.view;
      var old = sel.rangeCount && sel.getRangeAt(0);
      if (!start) {
        start = {node: view[0].measure.map[2], offset: 0};
      } else if (!end) { // FIXME dangerously hacky
        var measure = view[view.length - 1].measure;
        var map = measure.maps ? measure.maps[measure.maps.length - 1] : measure.map;
        end = {node: map[map.length - 1], offset: map[map.length - 2] - map[map.length - 3]};
      }

      try { var rng = range(start.node, start.offset, end.offset, end.node); }
      catch(e) {} // Our model of the DOM might be outdated, in which case the range we try to set can be impossible
      if (rng) {
        sel.removeAllRanges();
        sel.addRange(rng);
        if (old && sel.anchorNode == null) sel.addRange(old);
        else if (gecko) this.startGracePeriod();
      }
      this.rememberSelection();
    },

    startGracePeriod: function() {
      var input = this;
      clearTimeout(this.gracePeriod);
      this.gracePeriod = setTimeout(function() {
        input.gracePeriod = false;
        if (input.selectionChanged())
          input.cm.operation(function() { input.cm.curOp.selectionChanged = true; });
      }, 20);
    },

    showMultipleSelections: function(info) {
      removeChildrenAndAdd(this.cm.display.cursorDiv, info.cursors);
      removeChildrenAndAdd(this.cm.display.selectionDiv, info.selection);
    },

    rememberSelection: function() {
      var sel = window.getSelection();
      this.lastAnchorNode = sel.anchorNode; this.lastAnchorOffset = sel.anchorOffset;
      this.lastFocusNode = sel.focusNode; this.lastFocusOffset = sel.focusOffset;
    },

    selectionInEditor: function() {
      var sel = window.getSelection();
      if (!sel.rangeCount) return false;
      var node = sel.getRangeAt(0).commonAncestorContainer;
      return contains(this.div, node);
    },

    focus: function() {
      if (this.cm.options.readOnly != "nocursor") this.div.focus();
    },
    blur: function() { this.div.blur(); },
    getField: function() { return this.div; },

    supportsTouch: function() { return true; },

    receivedFocus: function() {
      var input = this;
      if (this.selectionInEditor())
        this.pollSelection();
      else
        runInOp(this.cm, function() { input.cm.curOp.selectionChanged = true; });

      function poll() {
        if (input.cm.state.focused) {
          input.pollSelection();
          input.polling.set(input.cm.options.pollInterval, poll);
        }
      }
      this.polling.set(this.cm.options.pollInterval, poll);
    },

    selectionChanged: function() {
      var sel = window.getSelection();
      return sel.anchorNode != this.lastAnchorNode || sel.anchorOffset != this.lastAnchorOffset ||
        sel.focusNode != this.lastFocusNode || sel.focusOffset != this.lastFocusOffset;
    },

    pollSelection: function() {
      if (!this.composing && !this.gracePeriod && this.selectionChanged()) {
        var sel = window.getSelection(), cm = this.cm;
        this.rememberSelection();
        var anchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
        var head = domToPos(cm, sel.focusNode, sel.focusOffset);
        if (anchor && head) runInOp(cm, function() {
          setSelection(cm.doc, simpleSelection(anchor, head), sel_dontScroll);
          if (anchor.bad || head.bad) cm.curOp.selectionChanged = true;
        });
      }
    },

    pollContent: function() {
      var cm = this.cm, display = cm.display, sel = cm.doc.sel.primary();
      var from = sel.from(), to = sel.to();
      if (from.line < display.viewFrom || to.line > display.viewTo - 1) return false;

      var fromIndex;
      if (from.line == display.viewFrom || (fromIndex = findViewIndex(cm, from.line)) == 0) {
        var fromLine = lineNo(display.view[0].line);
        var fromNode = display.view[0].node;
      } else {
        var fromLine = lineNo(display.view[fromIndex].line);
        var fromNode = display.view[fromIndex - 1].node.nextSibling;
      }
      var toIndex = findViewIndex(cm, to.line);
      if (toIndex == display.view.length - 1) {
        var toLine = display.viewTo - 1;
        var toNode = display.view[toIndex].node;
      } else {
        var toLine = lineNo(display.view[toIndex + 1].line) - 1;
        var toNode = display.view[toIndex + 1].node.previousSibling;
      }

      var newText = splitLines(domTextBetween(cm, fromNode, toNode, fromLine, toLine));
      var oldText = getBetween(cm.doc, Pos(fromLine, 0), Pos(toLine, getLine(cm.doc, toLine).text.length));
      while (newText.length > 1 && oldText.length > 1) {
        if (lst(newText) == lst(oldText)) { newText.pop(); oldText.pop(); toLine--; }
        else if (newText[0] == oldText[0]) { newText.shift(); oldText.shift(); fromLine++; }
        else break;
      }

      var cutFront = 0, cutEnd = 0;
      var newTop = newText[0], oldTop = oldText[0], maxCutFront = Math.min(newTop.length, oldTop.length);
      while (cutFront < maxCutFront && newTop.charCodeAt(cutFront) == oldTop.charCodeAt(cutFront))
        ++cutFront;
      var newBot = lst(newText), oldBot = lst(oldText);
      var maxCutEnd = Math.min(newBot.length - (newText.length == 1 ? cutFront : 0),
                               oldBot.length - (oldText.length == 1 ? cutFront : 0));
      while (cutEnd < maxCutEnd &&
             newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1))
        ++cutEnd;

      newText[newText.length - 1] = newBot.slice(0, newBot.length - cutEnd);
      newText[0] = newText[0].slice(cutFront);

      var chFrom = Pos(fromLine, cutFront);
      var chTo = Pos(toLine, oldText.length ? lst(oldText).length - cutEnd : 0);
      if (newText.length > 1 || newText[0] || cmp(chFrom, chTo)) {
        replaceRange(cm.doc, newText, chFrom, chTo, "+input");
        return true;
      }
    },

    ensurePolled: function() {
      this.forceCompositionEnd();
    },
    reset: function() {
      this.forceCompositionEnd();
    },
    forceCompositionEnd: function() {
      if (!this.composing || this.composing.handled) return;
      this.applyComposition(this.composing);
      this.composing.handled = true;
      this.div.blur();
      this.div.focus();
    },
    applyComposition: function(composing) {
      if (composing.data && composing.data != composing.startData)
        operation(this.cm, applyTextInput)(this.cm, composing.data, 0, composing.sel);
    },

    setUneditable: function(node) {
      node.setAttribute("contenteditable", "false");
    },

    onKeyPress: function(e) {
      e.preventDefault();
      operation(this.cm, applyTextInput)(this.cm, String.fromCharCode(e.charCode == null ? e.keyCode : e.charCode), 0);
    },

    onContextMenu: nothing,
    resetPosition: nothing,

    needsContentAttribute: true
  }, ContentEditableInput.prototype);

  function posToDOM(cm, pos) {
    var view = findViewForLine(cm, pos.line);
    if (!view || view.hidden) return null;
    var line = getLine(cm.doc, pos.line);
    var info = mapFromLineView(view, line, pos.line);

    var order = getOrder(line), side = "left";
    if (order) {
      var partPos = getBidiPartAt(order, pos.ch);
      side = partPos % 2 ? "right" : "left";
    }
    var result = nodeAndOffsetInLineMap(info.map, pos.ch, "left");
    result.offset = result.collapse == "right" ? result.end : result.start;
    return result;
  }

  function badPos(pos, bad) { if (bad) pos.bad = true; return pos; }

  function domToPos(cm, node, offset) {
    var lineNode;
    if (node == cm.display.lineDiv) {
      lineNode = cm.display.lineDiv.childNodes[offset];
      if (!lineNode) return badPos(cm.clipPos(Pos(cm.display.viewTo - 1)), true);
      node = null; offset = 0;
    } else {
      for (lineNode = node;; lineNode = lineNode.parentNode) {
        if (!lineNode || lineNode == cm.display.lineDiv) return null;
        if (lineNode.parentNode && lineNode.parentNode == cm.display.lineDiv) break;
      }
    }
    for (var i = 0; i < cm.display.view.length; i++) {
      var lineView = cm.display.view[i];
      if (lineView.node == lineNode)
        return locateNodeInLineView(lineView, node, offset);
    }
  }

  function locateNodeInLineView(lineView, node, offset) {
    var wrapper = lineView.text.firstChild, bad = false;
    if (!node || !contains(wrapper, node)) return badPos(Pos(lineNo(lineView.line), 0), true);
    if (node == wrapper) {
      bad = true;
      node = wrapper.childNodes[offset];
      offset = 0;
      if (!node) {
        var line = lineView.rest ? lst(lineView.rest) : lineView.line;
        return badPos(Pos(lineNo(line), line.text.length), bad);
      }
    }

    var textNode = node.nodeType == 3 ? node : null, topNode = node;
    if (!textNode && node.childNodes.length == 1 && node.firstChild.nodeType == 3) {
      textNode = node.firstChild;
      if (offset) offset = textNode.nodeValue.length;
    }
    while (topNode.parentNode != wrapper) topNode = topNode.parentNode;
    var measure = lineView.measure, maps = measure.maps;

    function find(textNode, topNode, offset) {
      for (var i = -1; i < (maps ? maps.length : 0); i++) {
        var map = i < 0 ? measure.map : maps[i];
        for (var j = 0; j < map.length; j += 3) {
          var curNode = map[j + 2];
          if (curNode == textNode || curNode == topNode) {
            var line = lineNo(i < 0 ? lineView.line : lineView.rest[i]);
            var ch = map[j] + offset;
            if (offset < 0 || curNode != textNode) ch = map[j + (offset ? 1 : 0)];
            return Pos(line, ch);
          }
        }
      }
    }
    var found = find(textNode, topNode, offset);
    if (found) return badPos(found, bad);

    // FIXME this is all really shaky. might handle the few cases it needs to handle, but likely to cause problems
    for (var after = topNode.nextSibling, dist = textNode ? textNode.nodeValue.length - offset : 0; after; after = after.nextSibling) {
      found = find(after, after.firstChild, 0);
      if (found)
        return badPos(Pos(found.line, found.ch - dist), bad);
      else
        dist += after.textContent.length;
    }
    for (var before = topNode.previousSibling, dist = offset; before; before = before.previousSibling) {
      found = find(before, before.firstChild, -1);
      if (found)
        return badPos(Pos(found.line, found.ch + dist), bad);
      else
        dist += after.textContent.length;
    }
  }

  function domTextBetween(cm, from, to, fromLine, toLine) {
    var text = "", closing = false;
    function recognizeMarker(id) { return function(marker) { return marker.id == id; }; }
    function walk(node) {
      if (node.nodeType == 1) {
        var cmText = node.getAttribute("cm-text");
        if (cmText != null) {
          if (cmText == "") cmText = node.textContent.replace(/\u200b/g, "");
          text += cmText;
          return;
        }
        var markerID = node.getAttribute("cm-marker"), range;
        if (markerID) {
          var found = cm.findMarks(Pos(fromLine, 0), Pos(toLine + 1, 0), recognizeMarker(+markerID));
          if (found.length && (range = found[0].find()))
            text += getBetween(cm.doc, range.from, range.to).join("\n");
          return;
        }
        if (node.getAttribute("contenteditable") == "false") return;
        for (var i = 0; i < node.childNodes.length; i++)
          walk(node.childNodes[i]);
        if (/^(pre|div|p)$/i.test(node.nodeName))
          closing = true;
      } else if (node.nodeType == 3) {
        var val = node.nodeValue;
        if (!val) return;
        if (closing) {
          text += "\n";
          closing = false;
        }
        text += val;
      }
    }
    for (;;) {
      walk(from);
      if (from == to) break;
      from = from.nextSibling;
    }
    return text;
  }

  CodeMirror.inputStyles = {"textarea": TextareaInput, "contenteditable": ContentEditableInput};

  // SELECTION / CURSOR

  // Selection objects are immutable. A new one is created every time
  // the selection changes. A selection is one or more non-overlapping
  // (and non-touching) ranges, sorted, and an integer that indicates
  // which one is the primary selection (the one that's scrolled into
  // view, that getCursor returns, etc).
  function Selection(ranges, primIndex) {
    this.ranges = ranges;
    this.primIndex = primIndex;
  }

  Selection.prototype = {
    primary: function() { return this.ranges[this.primIndex]; },
    equals: function(other) {
      if (other == this) return true;
      if (other.primIndex != this.primIndex || other.ranges.length != this.ranges.length) return false;
      for (var i = 0; i < this.ranges.length; i++) {
        var here = this.ranges[i], there = other.ranges[i];
        if (cmp(here.anchor, there.anchor) != 0 || cmp(here.head, there.head) != 0) return false;
      }
      return true;
    },
    deepCopy: function() {
      for (var out = [], i = 0; i < this.ranges.length; i++)
        out[i] = new Range(copyPos(this.ranges[i].anchor), copyPos(this.ranges[i].head));
      return new Selection(out, this.primIndex);
    },
    somethingSelected: function() {
      for (var i = 0; i < this.ranges.length; i++)
        if (!this.ranges[i].empty()) return true;
      return false;
    },
    contains: function(pos, end) {
      if (!end) end = pos;
      for (var i = 0; i < this.ranges.length; i++) {
        var range = this.ranges[i];
        if (cmp(end, range.from()) >= 0 && cmp(pos, range.to()) <= 0)
          return i;
      }
      return -1;
    }
  };

  function Range(anchor, head) {
    this.anchor = anchor; this.head = head;
  }

  Range.prototype = {
    from: function() { return minPos(this.anchor, this.head); },
    to: function() { return maxPos(this.anchor, this.head); },
    empty: function() {
      return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
    }
  };

  // Take an unsorted, potentially overlapping set of ranges, and
  // build a selection out of it. 'Consumes' ranges array (modifying
  // it).
  function normalizeSelection(ranges, primIndex) {
    var prim = ranges[primIndex];
    ranges.sort(function(a, b) { return cmp(a.from(), b.from()); });
    primIndex = indexOf(ranges, prim);
    for (var i = 1; i < ranges.length; i++) {
      var cur = ranges[i], prev = ranges[i - 1];
      if (cmp(prev.to(), cur.from()) >= 0) {
        var from = minPos(prev.from(), cur.from()), to = maxPos(prev.to(), cur.to());
        var inv = prev.empty() ? cur.from() == cur.head : prev.from() == prev.head;
        if (i <= primIndex) --primIndex;
        ranges.splice(--i, 2, new Range(inv ? to : from, inv ? from : to));
      }
    }
    return new Selection(ranges, primIndex);
  }

  function simpleSelection(anchor, head) {
    return new Selection([new Range(anchor, head || anchor)], 0);
  }

  // Most of the external API clips given positions to make sure they
  // actually exist within the document.
  function clipLine(doc, n) {return Math.max(doc.first, Math.min(n, doc.first + doc.size - 1));}
  function clipPos(doc, pos) {
    if (pos.line < doc.first) return Pos(doc.first, 0);
    var last = doc.first + doc.size - 1;
    if (pos.line > last) return Pos(last, getLine(doc, last).text.length);
    return clipToLen(pos, getLine(doc, pos.line).text.length);
  }
  function clipToLen(pos, linelen) {
    var ch = pos.ch;
    if (ch == null || ch > linelen) return Pos(pos.line, linelen);
    else if (ch < 0) return Pos(pos.line, 0);
    else return pos;
  }
  function isLine(doc, l) {return l >= doc.first && l < doc.first + doc.size;}
  function clipPosArray(doc, array) {
    for (var out = [], i = 0; i < array.length; i++) out[i] = clipPos(doc, array[i]);
    return out;
  }

  // SELECTION UPDATES

  // The 'scroll' parameter given to many of these indicated whether
  // the new cursor position should be scrolled into view after
  // modifying the selection.

  // If shift is held or the extend flag is set, extends a range to
  // include a given position (and optionally a second position).
  // Otherwise, simply returns the range between the given positions.
  // Used for cursor motion and such.
  function extendRange(doc, range, head, other) {
    if (doc.cm && doc.cm.display.shift || doc.extend) {
      var anchor = range.anchor;
      if (other) {
        var posBefore = cmp(head, anchor) < 0;
        if (posBefore != (cmp(other, anchor) < 0)) {
          anchor = head;
          head = other;
        } else if (posBefore != (cmp(head, other) < 0)) {
          head = other;
        }
      }
      return new Range(anchor, head);
    } else {
      return new Range(other || head, head);
    }
  }

  // Extend the primary selection range, discard the rest.
  function extendSelection(doc, head, other, options) {
    setSelection(doc, new Selection([extendRange(doc, doc.sel.primary(), head, other)], 0), options);
  }

  // Extend all selections (pos is an array of selections with length
  // equal the number of selections)
  function extendSelections(doc, heads, options) {
    for (var out = [], i = 0; i < doc.sel.ranges.length; i++)
      out[i] = extendRange(doc, doc.sel.ranges[i], heads[i], null);
    var newSel = normalizeSelection(out, doc.sel.primIndex);
    setSelection(doc, newSel, options);
  }

  // Updates a single range in the selection.
  function replaceOneSelection(doc, i, range, options) {
    var ranges = doc.sel.ranges.slice(0);
    ranges[i] = range;
    setSelection(doc, normalizeSelection(ranges, doc.sel.primIndex), options);
  }

  // Reset the selection to a single range.
  function setSimpleSelection(doc, anchor, head, options) {
    setSelection(doc, simpleSelection(anchor, head), options);
  }

  // Give beforeSelectionChange handlers a change to influence a
  // selection update.
  function filterSelectionChange(doc, sel) {
    var obj = {
      ranges: sel.ranges,
      update: function(ranges) {
        this.ranges = [];
        for (var i = 0; i < ranges.length; i++)
          this.ranges[i] = new Range(clipPos(doc, ranges[i].anchor),
                                     clipPos(doc, ranges[i].head));
      }
    };
    signal(doc, "beforeSelectionChange", doc, obj);
    if (doc.cm) signal(doc.cm, "beforeSelectionChange", doc.cm, obj);
    if (obj.ranges != sel.ranges) return normalizeSelection(obj.ranges, obj.ranges.length - 1);
    else return sel;
  }

  function setSelectionReplaceHistory(doc, sel, options) {
    var done = doc.history.done, last = lst(done);
    if (last && last.ranges) {
      done[done.length - 1] = sel;
      setSelectionNoUndo(doc, sel, options);
    } else {
      setSelection(doc, sel, options);
    }
  }

  // Set a new selection.
  function setSelection(doc, sel, options) {
    setSelectionNoUndo(doc, sel, options);
    addSelectionToHistory(doc, doc.sel, doc.cm ? doc.cm.curOp.id : NaN, options);
  }

  function setSelectionNoUndo(doc, sel, options) {
    if (hasHandler(doc, "beforeSelectionChange") || doc.cm && hasHandler(doc.cm, "beforeSelectionChange"))
      sel = filterSelectionChange(doc, sel);

    var bias = options && options.bias ||
      (cmp(sel.primary().head, doc.sel.primary().head) < 0 ? -1 : 1);
    setSelectionInner(doc, skipAtomicInSelection(doc, sel, bias, true));

    if (!(options && options.scroll === false) && doc.cm)
      ensureCursorVisible(doc.cm);
  }

  function setSelectionInner(doc, sel) {
    if (sel.equals(doc.sel)) return;

    doc.sel = sel;

    if (doc.cm) {
      doc.cm.curOp.updateInput = doc.cm.curOp.selectionChanged = true;
      signalCursorActivity(doc.cm);
    }
    signalLater(doc, "cursorActivity", doc);
  }

  // Verify that the selection does not partially select any atomic
  // marked ranges.
  function reCheckSelection(doc) {
    setSelectionInner(doc, skipAtomicInSelection(doc, doc.sel, null, false), sel_dontScroll);
  }

  // Return a selection that does not partially select any atomic
  // ranges.
  function skipAtomicInSelection(doc, sel, bias, mayClear) {
    var out;
    for (var i = 0; i < sel.ranges.length; i++) {
      var range = sel.ranges[i];
      var newAnchor = skipAtomic(doc, range.anchor, bias, mayClear);
      var newHead = skipAtomic(doc, range.head, bias, mayClear);
      if (out || newAnchor != range.anchor || newHead != range.head) {
        if (!out) out = sel.ranges.slice(0, i);
        out[i] = new Range(newAnchor, newHead);
      }
    }
    return out ? normalizeSelection(out, sel.primIndex) : sel;
  }

  // Ensure a given position is not inside an atomic range.
  function skipAtomic(doc, pos, bias, mayClear) {
    var flipped = false, curPos = pos;
    var dir = bias || 1;
    doc.cantEdit = false;
    search: for (;;) {
      var line = getLine(doc, curPos.line);
      if (line.markedSpans) {
        for (var i = 0; i < line.markedSpans.length; ++i) {
          var sp = line.markedSpans[i], m = sp.marker;
          if ((sp.from == null || (m.inclusiveLeft ? sp.from <= curPos.ch : sp.from < curPos.ch)) &&
              (sp.to == null || (m.inclusiveRight ? sp.to >= curPos.ch : sp.to > curPos.ch))) {
            if (mayClear) {
              signal(m, "beforeCursorEnter");
              if (m.explicitlyCleared) {
                if (!line.markedSpans) break;
                else {--i; continue;}
              }
            }
            if (!m.atomic) continue;
            var newPos = m.find(dir < 0 ? -1 : 1);
            if (cmp(newPos, curPos) == 0) {
              newPos.ch += dir;
              if (newPos.ch < 0) {
                if (newPos.line > doc.first) newPos = clipPos(doc, Pos(newPos.line - 1));
                else newPos = null;
              } else if (newPos.ch > line.text.length) {
                if (newPos.line < doc.first + doc.size - 1) newPos = Pos(newPos.line + 1, 0);
                else newPos = null;
              }
              if (!newPos) {
                if (flipped) {
                  // Driven in a corner -- no valid cursor position found at all
                  // -- try again *with* clearing, if we didn't already
                  if (!mayClear) return skipAtomic(doc, pos, bias, true);
                  // Otherwise, turn off editing until further notice, and return the start of the doc
                  doc.cantEdit = true;
                  return Pos(doc.first, 0);
                }
                flipped = true; newPos = pos; dir = -dir;
              }
            }
            curPos = newPos;
            continue search;
          }
        }
      }
      return curPos;
    }
  }

  // SELECTION DRAWING

  function updateSelection(cm) {
    cm.display.input.showSelection(cm.display.input.prepareSelection());
  }

  function prepareSelection(cm, primary) {
    var doc = cm.doc, result = {};
    var curFragment = result.cursors = document.createDocumentFragment();
    var selFragment = result.selection = document.createDocumentFragment();

    for (var i = 0; i < doc.sel.ranges.length; i++) {
      if (primary === false && i == doc.sel.primIndex) continue;
      var range = doc.sel.ranges[i];
      var collapsed = range.empty();
      if (collapsed || cm.options.showCursorWhenSelecting)
        drawSelectionCursor(cm, range, curFragment);
      if (!collapsed)
        drawSelectionRange(cm, range, selFragment);
    }
    return result;
  }

  // Draws a cursor for the given range
  function drawSelectionCursor(cm, range, output) {
    var pos = cursorCoords(cm, range.head, "div", null, null, !cm.options.singleCursorHeightPerLine);

    var cursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor"));
    cursor.style.left = pos.left + "px";
    cursor.style.top = pos.top + "px";
    cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + "px";

    if (pos.other) {
      // Secondary cursor, shown when on a 'jump' in bi-directional text
      var otherCursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor"));
      otherCursor.style.display = "";
      otherCursor.style.left = pos.other.left + "px";
      otherCursor.style.top = pos.other.top + "px";
      otherCursor.style.height = (pos.other.bottom - pos.other.top) * .85 + "px";
    }
  }

  // Draws the given range as a highlighted selection
  function drawSelectionRange(cm, range, output) {
    var display = cm.display, doc = cm.doc;
    var fragment = document.createDocumentFragment();
    var padding = paddingH(cm.display), leftSide = padding.left;
    var rightSide = Math.max(display.sizerWidth, displayWidth(cm) - display.sizer.offsetLeft) - padding.right;

    function add(left, top, width, bottom) {
      if (top < 0) top = 0;
      top = Math.round(top);
      bottom = Math.round(bottom);
      fragment.appendChild(elt("div", null, "CodeMirror-selected", "position: absolute; left: " + left +
                               "px; top: " + top + "px; width: " + (width == null ? rightSide - left : width) +
                               "px; height: " + (bottom - top) + "px"));
    }

    function drawForLine(line, fromArg, toArg) {
      var lineObj = getLine(doc, line);
      var lineLen = lineObj.text.length;
      var start, end;
      function coords(ch, bias) {
        return charCoords(cm, Pos(line, ch), "div", lineObj, bias);
      }

      iterateBidiSections(getOrder(lineObj), fromArg || 0, toArg == null ? lineLen : toArg, function(from, to, dir) {
        var leftPos = coords(from, "left"), rightPos, left, right;
        if (from == to) {
          rightPos = leftPos;
          left = right = leftPos.left;
        } else {
          rightPos = coords(to - 1, "right");
          if (dir == "rtl") { var tmp = leftPos; leftPos = rightPos; rightPos = tmp; }
          left = leftPos.left;
          right = rightPos.right;
        }
        if (fromArg == null && from == 0) left = leftSide;
        if (rightPos.top - leftPos.top > 3) { // Different lines, draw top part
          add(left, leftPos.top, null, leftPos.bottom);
          left = leftSide;
          if (leftPos.bottom < rightPos.top) add(left, leftPos.bottom, null, rightPos.top);
        }
        if (toArg == null && to == lineLen) right = rightSide;
        if (!start || leftPos.top < start.top || leftPos.top == start.top && leftPos.left < start.left)
          start = leftPos;
        if (!end || rightPos.bottom > end.bottom || rightPos.bottom == end.bottom && rightPos.right > end.right)
          end = rightPos;
        if (left < leftSide + 1) left = leftSide;
        add(left, rightPos.top, right - left, rightPos.bottom);
      });
      return {start: start, end: end};
    }

    var sFrom = range.from(), sTo = range.to();
    if (sFrom.line == sTo.line) {
      drawForLine(sFrom.line, sFrom.ch, sTo.ch);
    } else {
      var fromLine = getLine(doc, sFrom.line), toLine = getLine(doc, sTo.line);
      var singleVLine = visualLine(fromLine) == visualLine(toLine);
      var leftEnd = drawForLine(sFrom.line, sFrom.ch, singleVLine ? fromLine.text.length + 1 : null).end;
      var rightStart = drawForLine(sTo.line, singleVLine ? 0 : null, sTo.ch).start;
      if (singleVLine) {
        if (leftEnd.top < rightStart.top - 2) {
          add(leftEnd.right, leftEnd.top, null, leftEnd.bottom);
          add(leftSide, rightStart.top, rightStart.left, rightStart.bottom);
        } else {
          add(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom);
        }
      }
      if (leftEnd.bottom < rightStart.top)
        add(leftSide, leftEnd.bottom, null, rightStart.top);
    }

    output.appendChild(fragment);
  }

  // Cursor-blinking
  function restartBlink(cm) {
    if (!cm.state.focused) return;
    var display = cm.display;
    clearInterval(display.blinker);
    var on = true;
    display.cursorDiv.style.visibility = "";
    if (cm.options.cursorBlinkRate > 0)
      display.blinker = setInterval(function() {
        display.cursorDiv.style.visibility = (on = !on) ? "" : "hidden";
      }, cm.options.cursorBlinkRate);
    else if (cm.options.cursorBlinkRate < 0)
      display.cursorDiv.style.visibility = "hidden";
  }

  // HIGHLIGHT WORKER

  function startWorker(cm, time) {
    if (cm.doc.mode.startState && cm.doc.frontier < cm.display.viewTo)
      cm.state.highlight.set(time, bind(highlightWorker, cm));
  }

  function highlightWorker(cm) {
    var doc = cm.doc;
    if (doc.frontier < doc.first) doc.frontier = doc.first;
    if (doc.frontier >= cm.display.viewTo) return;
    var end = +new Date + cm.options.workTime;
    var state = copyState(doc.mode, getStateBefore(cm, doc.frontier));
    var changedLines = [];

    doc.iter(doc.frontier, Math.min(doc.first + doc.size, cm.display.viewTo + 500), function(line) {
      if (doc.frontier >= cm.display.viewFrom) { // Visible
        var oldStyles = line.styles;
        var highlighted = highlightLine(cm, line, state, true);
        line.styles = highlighted.styles;
        var oldCls = line.styleClasses, newCls = highlighted.classes;
        if (newCls) line.styleClasses = newCls;
        else if (oldCls) line.styleClasses = null;
        var ischange = !oldStyles || oldStyles.length != line.styles.length ||
          oldCls != newCls && (!oldCls || !newCls || oldCls.bgClass != newCls.bgClass || oldCls.textClass != newCls.textClass);
        for (var i = 0; !ischange && i < oldStyles.length; ++i) ischange = oldStyles[i] != line.styles[i];
        if (ischange) changedLines.push(doc.frontier);
        line.stateAfter = copyState(doc.mode, state);
      } else {
        processLine(cm, line.text, state);
        line.stateAfter = doc.frontier % 5 == 0 ? copyState(doc.mode, state) : null;
      }
      ++doc.frontier;
      if (+new Date > end) {
        startWorker(cm, cm.options.workDelay);
        return true;
      }
    });
    if (changedLines.length) runInOp(cm, function() {
      for (var i = 0; i < changedLines.length; i++)
        regLineChange(cm, changedLines[i], "text");
    });
  }

  // Finds the line to start with when starting a parse. Tries to
  // find a line with a stateAfter, so that it can start with a
  // valid state. If that fails, it returns the line with the
  // smallest indentation, which tends to need the least context to
  // parse correctly.
  function findStartLine(cm, n, precise) {
    var minindent, minline, doc = cm.doc;
    var lim = precise ? -1 : n - (cm.doc.mode.innerMode ? 1000 : 100);
    for (var search = n; search > lim; --search) {
      if (search <= doc.first) return doc.first;
      var line = getLine(doc, search - 1);
      if (line.stateAfter && (!precise || search <= doc.frontier)) return search;
      var indented = countColumn(line.text, null, cm.options.tabSize);
      if (minline == null || minindent > indented) {
        minline = search - 1;
        minindent = indented;
      }
    }
    return minline;
  }

  function getStateBefore(cm, n, precise) {
    var doc = cm.doc, display = cm.display;
    if (!doc.mode.startState) return true;
    var pos = findStartLine(cm, n, precise), state = pos > doc.first && getLine(doc, pos-1).stateAfter;
    if (!state) state = startState(doc.mode);
    else state = copyState(doc.mode, state);
    doc.iter(pos, n, function(line) {
      processLine(cm, line.text, state);
      var save = pos == n - 1 || pos % 5 == 0 || pos >= display.viewFrom && pos < display.viewTo;
      line.stateAfter = save ? copyState(doc.mode, state) : null;
      ++pos;
    });
    if (precise) doc.frontier = pos;
    return state;
  }

  // POSITION MEASUREMENT

  function paddingTop(display) {return display.lineSpace.offsetTop;}
  function paddingVert(display) {return display.mover.offsetHeight - display.lineSpace.offsetHeight;}
  function paddingH(display) {
    if (display.cachedPaddingH) return display.cachedPaddingH;
    var e = removeChildrenAndAdd(display.measure, elt("pre", "x"));
    var style = window.getComputedStyle ? window.getComputedStyle(e) : e.currentStyle;
    var data = {left: parseInt(style.paddingLeft), right: parseInt(style.paddingRight)};
    if (!isNaN(data.left) && !isNaN(data.right)) display.cachedPaddingH = data;
    return data;
  }

  function scrollGap(cm) { return scrollerGap - cm.display.nativeBarWidth; }
  function displayWidth(cm) {
    return cm.display.scroller.clientWidth - scrollGap(cm) - cm.display.barWidth;
  }
  function displayHeight(cm) {
    return cm.display.scroller.clientHeight - scrollGap(cm) - cm.display.barHeight;
  }

  // Ensure the lineView.wrapping.heights array is populated. This is
  // an array of bottom offsets for the lines that make up a drawn
  // line. When lineWrapping is on, there might be more than one
  // height.
  function ensureLineHeights(cm, lineView, rect) {
    var wrapping = cm.options.lineWrapping;
    var curWidth = wrapping && displayWidth(cm);
    if (!lineView.measure.heights || wrapping && lineView.measure.width != curWidth) {
      var heights = lineView.measure.heights = [];
      if (wrapping) {
        lineView.measure.width = curWidth;
        var rects = lineView.text.firstChild.getClientRects();
        for (var i = 0; i < rects.length - 1; i++) {
          var cur = rects[i], next = rects[i + 1];
          if (Math.abs(cur.bottom - next.bottom) > 2)
            heights.push((cur.bottom + next.top) / 2 - rect.top);
        }
      }
      heights.push(rect.bottom - rect.top);
    }
  }

  // Find a line map (mapping character offsets to text nodes) and a
  // measurement cache for the given line number. (A line view might
  // contain multiple lines when collapsed ranges are present.)
  function mapFromLineView(lineView, line, lineN) {
    if (lineView.line == line)
      return {map: lineView.measure.map, cache: lineView.measure.cache};
    for (var i = 0; i < lineView.rest.length; i++)
      if (lineView.rest[i] == line)
        return {map: lineView.measure.maps[i], cache: lineView.measure.caches[i]};
    for (var i = 0; i < lineView.rest.length; i++)
      if (lineNo(lineView.rest[i]) > lineN)
        return {map: lineView.measure.maps[i], cache: lineView.measure.caches[i], before: true};
  }

  // Render a line into the hidden node display.externalMeasured. Used
  // when measurement is needed for a line that's not in the viewport.
  function updateExternalMeasurement(cm, line) {
    line = visualLine(line);
    var lineN = lineNo(line);
    var view = cm.display.externalMeasured = new LineView(cm.doc, line, lineN);
    view.lineN = lineN;
    var built = view.built = buildLineContent(cm, view);
    view.text = built.pre;
    removeChildrenAndAdd(cm.display.lineMeasure, built.pre);
    return view;
  }

  // Get a {top, bottom, left, right} box (in line-local coordinates)
  // for a given character.
  function measureChar(cm, line, ch, bias) {
    return measureCharPrepared(cm, prepareMeasureForLine(cm, line), ch, bias);
  }

  // Find a line view that corresponds to the given line number.
  function findViewForLine(cm, lineN) {
    if (lineN >= cm.display.viewFrom && lineN < cm.display.viewTo)
      return cm.display.view[findViewIndex(cm, lineN)];
    var ext = cm.display.externalMeasured;
    if (ext && lineN >= ext.lineN && lineN < ext.lineN + ext.size)
      return ext;
  }

  // Measurement can be split in two steps, the set-up work that
  // applies to the whole line, and the measurement of the actual
  // character. Functions like coordsChar, that need to do a lot of
  // measurements in a row, can thus ensure that the set-up work is
  // only done once.
  function prepareMeasureForLine(cm, line) {
    var lineN = lineNo(line);
    var view = findViewForLine(cm, lineN);
    if (view && !view.text)
      view = null;
    else if (view && view.changes)
      updateLineForChanges(cm, view, lineN, getDimensions(cm));
    if (!view)
      view = updateExternalMeasurement(cm, line);

    var info = mapFromLineView(view, line, lineN);
    return {
      line: line, view: view, rect: null,
      map: info.map, cache: info.cache, before: info.before,
      hasHeights: false
    };
  }

  // Given a prepared measurement object, measures the position of an
  // actual character (or fetches it from the cache).
  function measureCharPrepared(cm, prepared, ch, bias, varHeight) {
    if (prepared.before) ch = -1;
    var key = ch + (bias || ""), found;
    if (prepared.cache.hasOwnProperty(key)) {
      found = prepared.cache[key];
    } else {
      if (!prepared.rect)
        prepared.rect = prepared.view.text.getBoundingClientRect();
      if (!prepared.hasHeights) {
        ensureLineHeights(cm, prepared.view, prepared.rect);
        prepared.hasHeights = true;
      }
      found = measureCharInner(cm, prepared, ch, bias);
      if (!found.bogus) prepared.cache[key] = found;
    }
    return {left: found.left, right: found.right,
            top: varHeight ? found.rtop : found.top,
            bottom: varHeight ? found.rbottom : found.bottom};
  }

  var nullRect = {left: 0, right: 0, top: 0, bottom: 0};

  function nodeAndOffsetInLineMap(map, ch, bias) {
    var node, start, end, collapse;
    // First, search the line map for the text node corresponding to,
    // or closest to, the target character.
    for (var i = 0; i < map.length; i += 3) {
      var mStart = map[i], mEnd = map[i + 1];
      if (ch < mStart) {
        start = 0; end = 1;
        collapse = "left";
      } else if (ch < mEnd) {
        start = ch - mStart;
        end = start + 1;
      } else if (i == map.length - 3 || ch == mEnd && map[i + 3] > ch) {
        end = mEnd - mStart;
        start = end - 1;
        if (ch >= mEnd) collapse = "right";
      }
      if (start != null) {
        node = map[i + 2];
        if (mStart == mEnd && bias == (node.insertLeft ? "left" : "right"))
          collapse = bias;
        if (bias == "left" && start == 0)
          while (i && map[i - 2] == map[i - 3] && map[i - 1].insertLeft) {
            node = map[(i -= 3) + 2];
            collapse = "left";
          }
        if (bias == "right" && start == mEnd - mStart)
          while (i < map.length - 3 && map[i + 3] == map[i + 4] && !map[i + 5].insertLeft) {
            node = map[(i += 3) + 2];
            collapse = "right";
          }
        break;
      }
    }
    return {node: node, start: start, end: end, collapse: collapse, coverStart: mStart, coverEnd: mEnd};
  }

  function measureCharInner(cm, prepared, ch, bias) {
    var place = nodeAndOffsetInLineMap(prepared.map, ch, bias);
    var node = place.node, start = place.start, end = place.end, collapse = place.collapse;

    var rect;
    if (node.nodeType == 3) { // If it is a text node, use a range to retrieve the coordinates.
      for (var i = 0; i < 4; i++) { // Retry a maximum of 4 times when nonsense rectangles are returned
        while (start && isExtendingChar(prepared.line.text.charAt(place.coverStart + start))) --start;
        while (place.coverStart + end < place.coverEnd && isExtendingChar(prepared.line.text.charAt(place.coverStart + end))) ++end;
        if (ie && ie_version < 9 && start == 0 && end == place.coverEnd - place.coverStart) {
          rect = node.parentNode.getBoundingClientRect();
        } else if (ie && cm.options.lineWrapping) {
          var rects = range(node, start, end).getClientRects();
          if (rects.length)
            rect = rects[bias == "right" ? rects.length - 1 : 0];
          else
            rect = nullRect;
        } else {
          rect = range(node, start, end).getBoundingClientRect() || nullRect;
        }
        if (rect.left || rect.right || start == 0) break;
        end = start;
        start = start - 1;
        collapse = "right";
      }
      if (ie && ie_version < 11) rect = maybeUpdateRectForZooming(cm.display.measure, rect);
    } else { // If it is a widget, simply get the box for the whole widget.
      if (start > 0) collapse = bias = "right";
      var rects;
      if (cm.options.lineWrapping && (rects = node.getClientRects()).length > 1)
        rect = rects[bias == "right" ? rects.length - 1 : 0];
      else
        rect = node.getBoundingClientRect();
    }
    if (ie && ie_version < 9 && !start && (!rect || !rect.left && !rect.right)) {
      var rSpan = node.parentNode.getClientRects()[0];
      if (rSpan)
        rect = {left: rSpan.left, right: rSpan.left + charWidth(cm.display), top: rSpan.top, bottom: rSpan.bottom};
      else
        rect = nullRect;
    }

    var rtop = rect.top - prepared.rect.top, rbot = rect.bottom - prepared.rect.top;
    var mid = (rtop + rbot) / 2;
    var heights = prepared.view.measure.heights;
    for (var i = 0; i < heights.length - 1; i++)
      if (mid < heights[i]) break;
    var top = i ? heights[i - 1] : 0, bot = heights[i];
    var result = {left: (collapse == "right" ? rect.right : rect.left) - prepared.rect.left,
                  right: (collapse == "left" ? rect.left : rect.right) - prepared.rect.left,
                  top: top, bottom: bot};
    if (!rect.left && !rect.right) result.bogus = true;
    if (!cm.options.singleCursorHeightPerLine) { result.rtop = rtop; result.rbottom = rbot; }

    return result;
  }

  // Work around problem with bounding client rects on ranges being
  // returned incorrectly when zoomed on IE10 and below.
  function maybeUpdateRectForZooming(measure, rect) {
    if (!window.screen || screen.logicalXDPI == null ||
        screen.logicalXDPI == screen.deviceXDPI || !hasBadZoomedRects(measure))
      return rect;
    var scaleX = screen.logicalXDPI / screen.deviceXDPI;
    var scaleY = screen.logicalYDPI / screen.deviceYDPI;
    return {left: rect.left * scaleX, right: rect.right * scaleX,
            top: rect.top * scaleY, bottom: rect.bottom * scaleY};
  }

  function clearLineMeasurementCacheFor(lineView) {
    if (lineView.measure) {
      lineView.measure.cache = {};
      lineView.measure.heights = null;
      if (lineView.rest) for (var i = 0; i < lineView.rest.length; i++)
        lineView.measure.caches[i] = {};
    }
  }

  function clearLineMeasurementCache(cm) {
    cm.display.externalMeasure = null;
    removeChildren(cm.display.lineMeasure);
    for (var i = 0; i < cm.display.view.length; i++)
      clearLineMeasurementCacheFor(cm.display.view[i]);
  }

  function clearCaches(cm) {
    clearLineMeasurementCache(cm);
    cm.display.cachedCharWidth = cm.display.cachedTextHeight = cm.display.cachedPaddingH = null;
    if (!cm.options.lineWrapping) cm.display.maxLineChanged = true;
    cm.display.lineNumChars = null;
  }

  function pageScrollX() { return window.pageXOffset || (document.documentElement || document.body).scrollLeft; }
  function pageScrollY() { return window.pageYOffset || (document.documentElement || document.body).scrollTop; }

  // Converts a {top, bottom, left, right} box from line-local
  // coordinates into another coordinate system. Context may be one of
  // "line", "div" (display.lineDiv), "local"/null (editor), "window",
  // or "page".
  function intoCoordSystem(cm, lineObj, rect, context) {
    if (lineObj.widgets) for (var i = 0; i < lineObj.widgets.length; ++i) if (lineObj.widgets[i].above) {
      var size = widgetHeight(lineObj.widgets[i]);
      rect.top += size; rect.bottom += size;
    }
    if (context == "line") return rect;
    if (!context) context = "local";
    var yOff = heightAtLine(lineObj);
    if (context == "local") yOff += paddingTop(cm.display);
    else yOff -= cm.display.viewOffset;
    if (context == "page" || context == "window") {
      var lOff = cm.display.lineSpace.getBoundingClientRect();
      yOff += lOff.top + (context == "window" ? 0 : pageScrollY());
      var xOff = lOff.left + (context == "window" ? 0 : pageScrollX());
      rect.left += xOff; rect.right += xOff;
    }
    rect.top += yOff; rect.bottom += yOff;
    return rect;
  }

  // Coverts a box from "div" coords to another coordinate system.
  // Context may be "window", "page", "div", or "local"/null.
  function fromCoordSystem(cm, coords, context) {
    if (context == "div") return coords;
    var left = coords.left, top = coords.top;
    // First move into "page" coordinate system
    if (context == "page") {
      left -= pageScrollX();
      top -= pageScrollY();
    } else if (context == "local" || !context) {
      var localBox = cm.display.sizer.getBoundingClientRect();
      left += localBox.left;
      top += localBox.top;
    }

    var lineSpaceBox = cm.display.lineSpace.getBoundingClientRect();
    return {left: left - lineSpaceBox.left, top: top - lineSpaceBox.top};
  }

  function charCoords(cm, pos, context, lineObj, bias) {
    if (!lineObj) lineObj = getLine(cm.doc, pos.line);
    return intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch, bias), context);
  }

  // Returns a box for a given cursor position, which may have an
  // 'other' property containing the position of the secondary cursor
  // on a bidi boundary.
  function cursorCoords(cm, pos, context, lineObj, preparedMeasure, varHeight) {
    lineObj = lineObj || getLine(cm.doc, pos.line);
    if (!preparedMeasure) preparedMeasure = prepareMeasureForLine(cm, lineObj);
    function get(ch, right) {
      var m = measureCharPrepared(cm, preparedMeasure, ch, right ? "right" : "left", varHeight);
      if (right) m.left = m.right; else m.right = m.left;
      return intoCoordSystem(cm, lineObj, m, context);
    }
    function getBidi(ch, partPos) {
      var part = order[partPos], right = part.level % 2;
      if (ch == bidiLeft(part) && partPos && part.level < order[partPos - 1].level) {
        part = order[--partPos];
        ch = bidiRight(part) - (part.level % 2 ? 0 : 1);
        right = true;
      } else if (ch == bidiRight(part) && partPos < order.length - 1 && part.level < order[partPos + 1].level) {
        part = order[++partPos];
        ch = bidiLeft(part) - part.level % 2;
        right = false;
      }
      if (right && ch == part.to && ch > part.from) return get(ch - 1);
      return get(ch, right);
    }
    var order = getOrder(lineObj), ch = pos.ch;
    if (!order) return get(ch);
    var partPos = getBidiPartAt(order, ch);
    var val = getBidi(ch, partPos);
    if (bidiOther != null) val.other = getBidi(ch, bidiOther);
    return val;
  }

  // Used to cheaply estimate the coordinates for a position. Used for
  // intermediate scroll updates.
  function estimateCoords(cm, pos) {
    var left = 0, pos = clipPos(cm.doc, pos);
    if (!cm.options.lineWrapping) left = charWidth(cm.display) * pos.ch;
    var lineObj = getLine(cm.doc, pos.line);
    var top = heightAtLine(lineObj) + paddingTop(cm.display);
    return {left: left, right: left, top: top, bottom: top + lineObj.height};
  }

  // Positions returned by coordsChar contain some extra information.
  // xRel is the relative x position of the input coordinates compared
  // to the found position (so xRel > 0 means the coordinates are to
  // the right of the character position, for example). When outside
  // is true, that means the coordinates lie outside the line's
  // vertical range.
  function PosWithInfo(line, ch, outside, xRel) {
    var pos = Pos(line, ch);
    pos.xRel = xRel;
    if (outside) pos.outside = true;
    return pos;
  }

  // Compute the character position closest to the given coordinates.
  // Input must be lineSpace-local ("div" coordinate system).
  function coordsChar(cm, x, y) {
    var doc = cm.doc;
    y += cm.display.viewOffset;
    if (y < 0) return PosWithInfo(doc.first, 0, true, -1);
    var lineN = lineAtHeight(doc, y), last = doc.first + doc.size - 1;
    if (lineN > last)
      return PosWithInfo(doc.first + doc.size - 1, getLine(doc, last).text.length, true, 1);
    if (x < 0) x = 0;

    var lineObj = getLine(doc, lineN);
    for (;;) {
      var found = coordsCharInner(cm, lineObj, lineN, x, y);
      var merged = collapsedSpanAtEnd(lineObj);
      var mergedPos = merged && merged.find(0, true);
      if (merged && (found.ch > mergedPos.from.ch || found.ch == mergedPos.from.ch && found.xRel > 0))
        lineN = lineNo(lineObj = mergedPos.to.line);
      else
        return found;
    }
  }

  function coordsCharInner(cm, lineObj, lineNo, x, y) {
    var innerOff = y - heightAtLine(lineObj);
    var wrongLine = false, adjust = 2 * cm.display.wrapper.clientWidth;
    var preparedMeasure = prepareMeasureForLine(cm, lineObj);

    function getX(ch) {
      var sp = cursorCoords(cm, Pos(lineNo, ch), "line", lineObj, preparedMeasure);
      wrongLine = true;
      if (innerOff > sp.bottom) return sp.left - adjust;
      else if (innerOff < sp.top) return sp.left + adjust;
      else wrongLine = false;
      return sp.left;
    }

    var bidi = getOrder(lineObj), dist = lineObj.text.length;
    var from = lineLeft(lineObj), to = lineRight(lineObj);
    var fromX = getX(from), fromOutside = wrongLine, toX = getX(to), toOutside = wrongLine;

    if (x > toX) return PosWithInfo(lineNo, to, toOutside, 1);
    // Do a binary search between these bounds.
    for (;;) {
      if (bidi ? to == from || to == moveVisually(lineObj, from, 1) : to - from <= 1) {
        var ch = x < fromX || x - fromX <= toX - x ? from : to;
        var xDiff = x - (ch == from ? fromX : toX);
        while (isExtendingChar(lineObj.text.charAt(ch))) ++ch;
        var pos = PosWithInfo(lineNo, ch, ch == from ? fromOutside : toOutside,
                              xDiff < -1 ? -1 : xDiff > 1 ? 1 : 0);
        return pos;
      }
      var step = Math.ceil(dist / 2), middle = from + step;
      if (bidi) {
        middle = from;
        for (var i = 0; i < step; ++i) middle = moveVisually(lineObj, middle, 1);
      }
      var middleX = getX(middle);
      if (middleX > x) {to = middle; toX = middleX; if (toOutside = wrongLine) toX += 1000; dist = step;}
      else {from = middle; fromX = middleX; fromOutside = wrongLine; dist -= step;}
    }
  }

  var measureText;
  // Compute the default text height.
  function textHeight(display) {
    if (display.cachedTextHeight != null) return display.cachedTextHeight;
    if (measureText == null) {
      measureText = elt("pre");
      // Measure a bunch of lines, for browsers that compute
      // fractional heights.
      for (var i = 0; i < 49; ++i) {
        measureText.appendChild(document.createTextNode("x"));
        measureText.appendChild(elt("br"));
      }
      measureText.appendChild(document.createTextNode("x"));
    }
    removeChildrenAndAdd(display.measure, measureText);
    var height = measureText.offsetHeight / 50;
    if (height > 3) display.cachedTextHeight = height;
    removeChildren(display.measure);
    return height || 1;
  }

  // Compute the default character width.
  function charWidth(display) {
    if (display.cachedCharWidth != null) return display.cachedCharWidth;
    var anchor = elt("span", "xxxxxxxxxx");
    var pre = elt("pre", [anchor]);
    removeChildrenAndAdd(display.measure, pre);
    var rect = anchor.getBoundingClientRect(), width = (rect.right - rect.left) / 10;
    if (width > 2) display.cachedCharWidth = width;
    return width || 10;
  }

  // OPERATIONS

  // Operations are used to wrap a series of changes to the editor
  // state in such a way that each change won't have to update the
  // cursor and display (which would be awkward, slow, and
  // error-prone). Instead, display updates are batched and then all
  // combined and executed at once.

  var operationGroup = null;

  var nextOpId = 0;
  // Start a new operation.
  function startOperation(cm) {
    cm.curOp = {
      cm: cm,
      viewChanged: false,      // Flag that indicates that lines might need to be redrawn
      startHeight: cm.doc.height, // Used to detect need to update scrollbar
      forceUpdate: false,      // Used to force a redraw
      updateInput: null,       // Whether to reset the input textarea
      typing: false,           // Whether this reset should be careful to leave existing text (for compositing)
      changeObjs: null,        // Accumulated changes, for firing change events
      cursorActivityHandlers: null, // Set of handlers to fire cursorActivity on
      cursorActivityCalled: 0, // Tracks which cursorActivity handlers have been called already
      selectionChanged: false, // Whether the selection needs to be redrawn
      updateMaxLine: false,    // Set when the widest line needs to be determined anew
      scrollLeft: null, scrollTop: null, // Intermediate scroll position, not pushed to DOM yet
      scrollToPos: null,       // Used to scroll to a specific position
      id: ++nextOpId           // Unique ID
    };
    if (operationGroup) {
      operationGroup.ops.push(cm.curOp);
    } else {
      cm.curOp.ownsGroup = operationGroup = {
        ops: [cm.curOp],
        delayedCallbacks: []
      };
    }
  }

  function fireCallbacksForOps(group) {
    // Calls delayed callbacks and cursorActivity handlers until no
    // new ones appear
    var callbacks = group.delayedCallbacks, i = 0;
    do {
      for (; i < callbacks.length; i++)
        callbacks[i]();
      for (var j = 0; j < group.ops.length; j++) {
        var op = group.ops[j];
        if (op.cursorActivityHandlers)
          while (op.cursorActivityCalled < op.cursorActivityHandlers.length)
            op.cursorActivityHandlers[op.cursorActivityCalled++](op.cm);
      }
    } while (i < callbacks.length);
  }

  // Finish an operation, updating the display and signalling delayed events
  function endOperation(cm) {
    var op = cm.curOp, group = op.ownsGroup;
    if (!group) return;

    try { fireCallbacksForOps(group); }
    finally {
      operationGroup = null;
      for (var i = 0; i < group.ops.length; i++)
        group.ops[i].cm.curOp = null;
      endOperations(group);
    }
  }

  // The DOM updates done when an operation finishes are batched so
  // that the minimum number of relayouts are required.
  function endOperations(group) {
    var ops = group.ops;
    for (var i = 0; i < ops.length; i++) // Read DOM
      endOperation_R1(ops[i]);
    for (var i = 0; i < ops.length; i++) // Write DOM (maybe)
      endOperation_W1(ops[i]);
    for (var i = 0; i < ops.length; i++) // Read DOM
      endOperation_R2(ops[i]);
    for (var i = 0; i < ops.length; i++) // Write DOM (maybe)
      endOperation_W2(ops[i]);
    for (var i = 0; i < ops.length; i++) // Read DOM
      endOperation_finish(ops[i]);
  }

  function endOperation_R1(op) {
    var cm = op.cm, display = cm.display;
    maybeClipScrollbars(cm);
    if (op.updateMaxLine) findMaxLine(cm);

    op.mustUpdate = op.viewChanged || op.forceUpdate || op.scrollTop != null ||
      op.scrollToPos && (op.scrollToPos.from.line < display.viewFrom ||
                         op.scrollToPos.to.line >= display.viewTo) ||
      display.maxLineChanged && cm.options.lineWrapping;
    op.update = op.mustUpdate &&
      new DisplayUpdate(cm, op.mustUpdate && {top: op.scrollTop, ensure: op.scrollToPos}, op.forceUpdate);
  }

  function endOperation_W1(op) {
    op.updatedDisplay = op.mustUpdate && updateDisplayIfNeeded(op.cm, op.update);
  }

  function endOperation_R2(op) {
    var cm = op.cm, display = cm.display;
    if (op.updatedDisplay) updateHeightsInViewport(cm);

    op.barMeasure = measureForScrollbars(cm);

    // If the max line changed since it was last measured, measure it,
    // and ensure the document's width matches it.
    // updateDisplay_W2 will use these properties to do the actual resizing
    if (display.maxLineChanged && !cm.options.lineWrapping) {
      op.adjustWidthTo = measureChar(cm, display.maxLine, display.maxLine.text.length).left + 3;
      cm.display.sizerWidth = op.adjustWidthTo;
      op.barMeasure.scrollWidth =
        Math.max(display.scroller.clientWidth, display.sizer.offsetLeft + op.adjustWidthTo + scrollGap(cm) + cm.display.barWidth);
      op.maxScrollLeft = Math.max(0, display.sizer.offsetLeft + op.adjustWidthTo - displayWidth(cm));
    }

    if (op.updatedDisplay || op.selectionChanged)
      op.preparedSelection = display.input.prepareSelection();
  }

  function endOperation_W2(op) {
    var cm = op.cm;

    if (op.adjustWidthTo != null) {
      cm.display.sizer.style.minWidth = op.adjustWidthTo + "px";
      if (op.maxScrollLeft < cm.doc.scrollLeft)
        setScrollLeft(cm, Math.min(cm.display.scroller.scrollLeft, op.maxScrollLeft), true);
      cm.display.maxLineChanged = false;
    }

    if (op.preparedSelection)
      cm.display.input.showSelection(op.preparedSelection);
    if (op.updatedDisplay)
      setDocumentHeight(cm, op.barMeasure);
    if (op.updatedDisplay || op.startHeight != cm.doc.height)
      updateScrollbars(cm, op.barMeasure);

    if (op.selectionChanged) restartBlink(cm);

    if (cm.state.focused && op.updateInput)
      cm.display.input.reset(op.typing);
  }

  function endOperation_finish(op) {
    var cm = op.cm, display = cm.display, doc = cm.doc;

    if (op.updatedDisplay) postUpdateDisplay(cm, op.update);

    // Abort mouse wheel delta measurement, when scrolling explicitly
    if (display.wheelStartX != null && (op.scrollTop != null || op.scrollLeft != null || op.scrollToPos))
      display.wheelStartX = display.wheelStartY = null;

    // Propagate the scroll position to the actual DOM scroller
    if (op.scrollTop != null && (display.scroller.scrollTop != op.scrollTop || op.forceScroll)) {
      doc.scrollTop = Math.max(0, Math.min(display.scroller.scrollHeight - display.scroller.clientHeight, op.scrollTop));
      display.scrollbars.setScrollTop(doc.scrollTop);
      display.scroller.scrollTop = doc.scrollTop;
    }
    if (op.scrollLeft != null && (display.scroller.scrollLeft != op.scrollLeft || op.forceScroll)) {
      doc.scrollLeft = Math.max(0, Math.min(display.scroller.scrollWidth - displayWidth(cm), op.scrollLeft));
      display.scrollbars.setScrollLeft(doc.scrollLeft);
      display.scroller.scrollLeft = doc.scrollLeft;
      alignHorizontally(cm);
    }
    // If we need to scroll a specific position into view, do so.
    if (op.scrollToPos) {
      var coords = scrollPosIntoView(cm, clipPos(doc, op.scrollToPos.from),
                                     clipPos(doc, op.scrollToPos.to), op.scrollToPos.margin);
      if (op.scrollToPos.isCursor && cm.state.focused) maybeScrollWindow(cm, coords);
    }

    // Fire events for markers that are hidden/unidden by editing or
    // undoing
    var hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
    if (hidden) for (var i = 0; i < hidden.length; ++i)
      if (!hidden[i].lines.length) signal(hidden[i], "hide");
    if (unhidden) for (var i = 0; i < unhidden.length; ++i)
      if (unhidden[i].lines.length) signal(unhidden[i], "unhide");

    if (display.wrapper.offsetHeight)
      doc.scrollTop = cm.display.scroller.scrollTop;

    // Fire change events, and delayed event handlers
    if (op.changeObjs)
      signal(cm, "changes", cm, op.changeObjs);
    if (op.update)
      op.update.finish();
  }

  // Run the given function in an operation
  function runInOp(cm, f) {
    if (cm.curOp) return f();
    startOperation(cm);
    try { return f(); }
    finally { endOperation(cm); }
  }
  // Wraps a function in an operation. Returns the wrapped function.
  function operation(cm, f) {
    return function() {
      if (cm.curOp) return f.apply(cm, arguments);
      startOperation(cm);
      try { return f.apply(cm, arguments); }
      finally { endOperation(cm); }
    };
  }
  // Used to add methods to editor and doc instances, wrapping them in
  // operations.
  function methodOp(f) {
    return function() {
      if (this.curOp) return f.apply(this, arguments);
      startOperation(this);
      try { return f.apply(this, arguments); }
      finally { endOperation(this); }
    };
  }
  function docMethodOp(f) {
    return function() {
      var cm = this.cm;
      if (!cm || cm.curOp) return f.apply(this, arguments);
      startOperation(cm);
      try { return f.apply(this, arguments); }
      finally { endOperation(cm); }
    };
  }

  // VIEW TRACKING

  // These objects are used to represent the visible (currently drawn)
  // part of the document. A LineView may correspond to multiple
  // logical lines, if those are connected by collapsed ranges.
  function LineView(doc, line, lineN) {
    // The starting line
    this.line = line;
    // Continuing lines, if any
    this.rest = visualLineContinued(line);
    // Number of logical lines in this visual line
    this.size = this.rest ? lineNo(lst(this.rest)) - lineN + 1 : 1;
    this.node = this.text = null;
    this.hidden = lineIsHidden(doc, line);
  }

  // Create a range of LineView objects for the given lines.
  function buildViewArray(cm, from, to) {
    var array = [], nextPos;
    for (var pos = from; pos < to; pos = nextPos) {
      var view = new LineView(cm.doc, getLine(cm.doc, pos), pos);
      nextPos = pos + view.size;
      array.push(view);
    }
    return array;
  }

  // Updates the display.view data structure for a given change to the
  // document. From and to are in pre-change coordinates. Lendiff is
  // the amount of lines added or subtracted by the change. This is
  // used for changes that span multiple lines, or change the way
  // lines are divided into visual lines. regLineChange (below)
  // registers single-line changes.
  function regChange(cm, from, to, lendiff) {
    if (from == null) from = cm.doc.first;
    if (to == null) to = cm.doc.first + cm.doc.size;
    if (!lendiff) lendiff = 0;

    var display = cm.display;
    if (lendiff && to < display.viewTo &&
        (display.updateLineNumbers == null || display.updateLineNumbers > from))
      display.updateLineNumbers = from;

    cm.curOp.viewChanged = true;

    if (from >= display.viewTo) { // Change after
      if (sawCollapsedSpans && visualLineNo(cm.doc, from) < display.viewTo)
        resetView(cm);
    } else if (to <= display.viewFrom) { // Change before
      if (sawCollapsedSpans && visualLineEndNo(cm.doc, to + lendiff) > display.viewFrom) {
        resetView(cm);
      } else {
        display.viewFrom += lendiff;
        display.viewTo += lendiff;
      }
    } else if (from <= display.viewFrom && to >= display.viewTo) { // Full overlap
      resetView(cm);
    } else if (from <= display.viewFrom) { // Top overlap
      var cut = viewCuttingPoint(cm, to, to + lendiff, 1);
      if (cut) {
        display.view = display.view.slice(cut.index);
        display.viewFrom = cut.lineN;
        display.viewTo += lendiff;
      } else {
        resetView(cm);
      }
    } else if (to >= display.viewTo) { // Bottom overlap
      var cut = viewCuttingPoint(cm, from, from, -1);
      if (cut) {
        display.view = display.view.slice(0, cut.index);
        display.viewTo = cut.lineN;
      } else {
        resetView(cm);
      }
    } else { // Gap in the middle
      var cutTop = viewCuttingPoint(cm, from, from, -1);
      var cutBot = viewCuttingPoint(cm, to, to + lendiff, 1);
      if (cutTop && cutBot) {
        display.view = display.view.slice(0, cutTop.index)
          .concat(buildViewArray(cm, cutTop.lineN, cutBot.lineN))
          .concat(display.view.slice(cutBot.index));
        display.viewTo += lendiff;
      } else {
        resetView(cm);
      }
    }

    var ext = display.externalMeasured;
    if (ext) {
      if (to < ext.lineN)
        ext.lineN += lendiff;
      else if (from < ext.lineN + ext.size)
        display.externalMeasured = null;
    }
  }

  // Register a change to a single line. Type must be one of "text",
  // "gutter", "class", "widget"
  function regLineChange(cm, line, type) {
    cm.curOp.viewChanged = true;
    var display = cm.display, ext = cm.display.externalMeasured;
    if (ext && line >= ext.lineN && line < ext.lineN + ext.size)
      display.externalMeasured = null;

    if (line < display.viewFrom || line >= display.viewTo) return;
    var lineView = display.view[findViewIndex(cm, line)];
    if (lineView.node == null) return;
    var arr = lineView.changes || (lineView.changes = []);
    if (indexOf(arr, type) == -1) arr.push(type);
  }

  // Clear the view.
  function resetView(cm) {
    cm.display.viewFrom = cm.display.viewTo = cm.doc.first;
    cm.display.view = [];
    cm.display.viewOffset = 0;
  }

  // Find the view element corresponding to a given line. Return null
  // when the line isn't visible.
  function findViewIndex(cm, n) {
    if (n >= cm.display.viewTo) return null;
    n -= cm.display.viewFrom;
    if (n < 0) return null;
    var view = cm.display.view;
    for (var i = 0; i < view.length; i++) {
      n -= view[i].size;
      if (n < 0) return i;
    }
  }

  function viewCuttingPoint(cm, oldN, newN, dir) {
    var index = findViewIndex(cm, oldN), diff, view = cm.display.view;
    if (!sawCollapsedSpans || newN == cm.doc.first + cm.doc.size)
      return {index: index, lineN: newN};
    for (var i = 0, n = cm.display.viewFrom; i < index; i++)
      n += view[i].size;
    if (n != oldN) {
      if (dir > 0) {
        if (index == view.length - 1) return null;
        diff = (n + view[index].size) - oldN;
        index++;
      } else {
        diff = n - oldN;
      }
      oldN += diff; newN += diff;
    }
    while (visualLineNo(cm.doc, newN) != newN) {
      if (index == (dir < 0 ? 0 : view.length - 1)) return null;
      newN += dir * view[index - (dir < 0 ? 1 : 0)].size;
      index += dir;
    }
    return {index: index, lineN: newN};
  }

  // Force the view to cover a given range, adding empty view element
  // or clipping off existing ones as needed.
  function adjustView(cm, from, to) {
    var display = cm.display, view = display.view;
    if (view.length == 0 || from >= display.viewTo || to <= display.viewFrom) {
      display.view = buildViewArray(cm, from, to);
      display.viewFrom = from;
    } else {
      if (display.viewFrom > from)
        display.view = buildViewArray(cm, from, display.viewFrom).concat(display.view);
      else if (display.viewFrom < from)
        display.view = display.view.slice(findViewIndex(cm, from));
      display.viewFrom = from;
      if (display.viewTo < to)
        display.view = display.view.concat(buildViewArray(cm, display.viewTo, to));
      else if (display.viewTo > to)
        display.view = display.view.slice(0, findViewIndex(cm, to));
    }
    display.viewTo = to;
  }

  // Count the number of lines in the view whose DOM representation is
  // out of date (or nonexistent).
  function countDirtyView(cm) {
    var view = cm.display.view, dirty = 0;
    for (var i = 0; i < view.length; i++) {
      var lineView = view[i];
      if (!lineView.hidden && (!lineView.node || lineView.changes)) ++dirty;
    }
    return dirty;
  }

  // EVENT HANDLERS

  // Attach the necessary event handlers when initializing the editor
  function registerEventHandlers(cm) {
    var d = cm.display;
    on(d.scroller, "mousedown", operation(cm, onMouseDown));
    // Older IE's will not fire a second mousedown for a double click
    if (ie && ie_version < 11)
      on(d.scroller, "dblclick", operation(cm, function(e) {
        if (signalDOMEvent(cm, e)) return;
        var pos = posFromMouse(cm, e);
        if (!pos || clickInGutter(cm, e) || eventInWidget(cm.display, e)) return;
        e_preventDefault(e);
        var word = cm.findWordAt(pos);
        extendSelection(cm.doc, word.anchor, word.head);
      }));
    else
      on(d.scroller, "dblclick", function(e) { signalDOMEvent(cm, e) || e_preventDefault(e); });
    // Some browsers fire contextmenu *after* opening the menu, at
    // which point we can't mess with it anymore. Context menu is
    // handled in onMouseDown for these browsers.
    if (!captureRightClick) on(d.scroller, "contextmenu", function(e) {onContextMenu(cm, e);});

    // Used to suppress mouse event handling when a touch happens
    var touchFinished, prevTouch = {end: 0};
    function finishTouch() {
      if (d.activeTouch) {
        touchFinished = setTimeout(function() {d.activeTouch = null;}, 1000);
        prevTouch = d.activeTouch;
        prevTouch.end = +new Date;
      }
    };
    function isMouseLikeTouchEvent(e) {
      if (e.touches.length != 1) return false;
      var touch = e.touches[0];
      return touch.radiusX <= 1 && touch.radiusY <= 1;
    }
    function farAway(touch, other) {
      if (other.left == null) return true;
      var dx = other.left - touch.left, dy = other.top - touch.top;
      return dx * dx + dy * dy > 20 * 20;
    }
    on(d.scroller, "touchstart", function(e) {
      if (!isMouseLikeTouchEvent(e)) {
        clearTimeout(touchFinished);
        var now = +new Date;
        d.activeTouch = {start: now, moved: false,
                         prev: now - prevTouch.end <= 300 ? prevTouch : null};
        if (e.touches.length == 1) {
          d.activeTouch.left = e.touches[0].pageX;
          d.activeTouch.top = e.touches[0].pageY;
        }
      }
    });
    on(d.scroller, "touchmove", function() {
      if (d.activeTouch) d.activeTouch.moved = true;
    });
    on(d.scroller, "touchend", function(e) {
      var touch = d.activeTouch;
      if (touch && !eventInWidget(d, e) && touch.left != null &&
          !touch.moved && new Date - touch.start < 300) {
        var pos = cm.coordsChar(d.activeTouch, "page"), range;
        if (!touch.prev || farAway(touch, touch.prev)) // Single tap
          range = new Range(pos, pos);
        else if (!touch.prev.prev || farAway(touch, touch.prev.prev)) // Double tap
          range = cm.findWordAt(pos);
        else // Triple tap
          range = new Range(Pos(pos.line, 0), clipPos(cm.doc, Pos(pos.line + 1, 0)));
        cm.setSelection(range.anchor, range.head);
        cm.focus();
        e_preventDefault(e);
      }
      finishTouch();
    });
    on(d.scroller, "touchcancel", finishTouch);

    // Sync scrolling between fake scrollbars and real scrollable
    // area, ensure viewport is updated when scrolling.
    on(d.scroller, "scroll", function() {
      if (d.scroller.clientHeight) {
        setScrollTop(cm, d.scroller.scrollTop);
        setScrollLeft(cm, d.scroller.scrollLeft, true);
        signal(cm, "scroll", cm);
      }
    });

    // Listen to wheel events in order to try and update the viewport on time.
    on(d.scroller, "mousewheel", function(e){onScrollWheel(cm, e);});
    on(d.scroller, "DOMMouseScroll", function(e){onScrollWheel(cm, e);});

    // Prevent wrapper from ever scrolling
    on(d.wrapper, "scroll", function() { d.wrapper.scrollTop = d.wrapper.scrollLeft = 0; });

    function drag_(e) {
      if (!signalDOMEvent(cm, e)) e_stop(e);
    }
    if (cm.options.dragDrop) {
      on(d.scroller, "dragstart", function(e){onDragStart(cm, e);});
      on(d.scroller, "dragenter", drag_);
      on(d.scroller, "dragover", drag_);
      on(d.scroller, "drop", operation(cm, onDrop));
    }

    var inp = d.input.getField();
    on(inp, "keyup", function(e) { onKeyUp.call(cm, e); });
    on(inp, "keydown", operation(cm, onKeyDown));
    on(inp, "keypress", operation(cm, onKeyPress));
    on(inp, "focus", bind(onFocus, cm));
    on(inp, "blur", bind(onBlur, cm));
  }

  // Called when the window resizes
  function onResize(cm) {
    var d = cm.display;
    if (d.lastWrapHeight == d.wrapper.clientHeight && d.lastWrapWidth == d.wrapper.clientWidth)
      return;
    // Might be a text scaling operation, clear size caches.
    d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
    d.scrollbarsClipped = false;
    cm.setSize();
  }

  // MOUSE EVENTS

  // Return true when the given mouse event happened in a widget
  function eventInWidget(display, e) {
    for (var n = e_target(e); n != display.wrapper; n = n.parentNode) {
      if (!n || (n.nodeType == 1 && n.getAttribute("cm-ignore-events") == "true") ||
          (n.parentNode == display.sizer && n != display.mover))
        return true;
    }
  }

  // Given a mouse event, find the corresponding position. If liberal
  // is false, it checks whether a gutter or scrollbar was clicked,
  // and returns null if it was. forRect is used by rectangular
  // selections, and tries to estimate a character position even for
  // coordinates beyond the right of the text.
  function posFromMouse(cm, e, liberal, forRect) {
    var display = cm.display;
    if (!liberal && e_target(e).getAttribute("cm-not-content") == "true") return null;

    var x, y, space = display.lineSpace.getBoundingClientRect();
    // Fails unpredictably on IE[67] when mouse is dragged around quickly.
    try { x = e.clientX - space.left; y = e.clientY - space.top; }
    catch (e) { return null; }
    var coords = coordsChar(cm, x, y), line;
    if (forRect && coords.xRel == 1 && (line = getLine(cm.doc, coords.line).text).length == coords.ch) {
      var colDiff = countColumn(line, line.length, cm.options.tabSize) - line.length;
      coords = Pos(coords.line, Math.max(0, Math.round((x - paddingH(cm.display).left) / charWidth(cm.display)) - colDiff));
    }
    return coords;
  }

  // A mouse down can be a single click, double click, triple click,
  // start of selection drag, start of text drag, new cursor
  // (ctrl-click), rectangle drag (alt-drag), or xwin
  // middle-click-paste. Or it might be a click on something we should
  // not interfere with, such as a scrollbar or widget.
  function onMouseDown(e) {
    var cm = this, display = cm.display;
    if (display.activeTouch && display.input.supportsTouch() || signalDOMEvent(cm, e)) return;
    display.shift = e.shiftKey;

    if (eventInWidget(display, e)) {
      if (!webkit) {
        // Briefly turn off draggability, to allow widgets to do
        // normal dragging things.
        display.scroller.draggable = false;
        setTimeout(function(){display.scroller.draggable = true;}, 100);
      }
      return;
    }
    if (clickInGutter(cm, e)) return;
    var start = posFromMouse(cm, e);
    window.focus();

    switch (e_button(e)) {
    case 1:
      if (start)
        leftButtonDown(cm, e, start);
      else if (e_target(e) == display.scroller)
        e_preventDefault(e);
      break;
    case 2:
      if (webkit) cm.state.lastMiddleDown = +new Date;
      if (start) extendSelection(cm.doc, start);
      setTimeout(function() {display.input.focus();}, 20);
      e_preventDefault(e);
      break;
    case 3:
      if (captureRightClick) onContextMenu(cm, e);
      else delayBlurEvent(cm);
      break;
    }
  }

  var lastClick, lastDoubleClick;
  function leftButtonDown(cm, e, start) {
    if (ie) setTimeout(bind(ensureFocus, cm), 0);
    else ensureFocus(cm);

    var now = +new Date, type;
    if (lastDoubleClick && lastDoubleClick.time > now - 400 && cmp(lastDoubleClick.pos, start) == 0) {
      type = "triple";
    } else if (lastClick && lastClick.time > now - 400 && cmp(lastClick.pos, start) == 0) {
      type = "double";
      lastDoubleClick = {time: now, pos: start};
    } else {
      type = "single";
      lastClick = {time: now, pos: start};
    }

    var sel = cm.doc.sel, modifier = mac ? e.metaKey : e.ctrlKey, contained;
    if (cm.options.dragDrop && dragAndDrop && !isReadOnly(cm) &&
        type == "single" && (contained = sel.contains(start)) > -1 &&
        !sel.ranges[contained].empty())
      leftButtonStartDrag(cm, e, start, modifier);
    else
      leftButtonSelect(cm, e, start, type, modifier);
  }

  // Start a text drag. When it ends, see if any dragging actually
  // happen, and treat as a click if it didn't.
  function leftButtonStartDrag(cm, e, start, modifier) {
    var display = cm.display;
    var dragEnd = operation(cm, function(e2) {
      if (webkit) display.scroller.draggable = false;
      cm.state.draggingText = false;
      off(document, "mouseup", dragEnd);
      off(display.scroller, "drop", dragEnd);
      if (Math.abs(e.clientX - e2.clientX) + Math.abs(e.clientY - e2.clientY) < 10) {
        e_preventDefault(e2);
        if (!modifier)
          extendSelection(cm.doc, start);
        // Work around unexplainable focus problem in IE9 (#2127) and Chrome (#3081)
        if (webkit || ie && ie_version == 9)
          setTimeout(function() {document.body.focus(); display.input.focus();}, 20);
        else
          display.input.focus();
      }
    });
    // Let the drag handler handle this.
    if (webkit) display.scroller.draggable = true;
    cm.state.draggingText = dragEnd;
    // IE's approach to draggable
    if (display.scroller.dragDrop) display.scroller.dragDrop();
    on(document, "mouseup", dragEnd);
    on(display.scroller, "drop", dragEnd);
  }

  // Normal selection, as opposed to text dragging.
  function leftButtonSelect(cm, e, start, type, addNew) {
    var display = cm.display, doc = cm.doc;
    e_preventDefault(e);

    var ourRange, ourIndex, startSel = doc.sel, ranges = startSel.ranges;
    if (addNew && !e.shiftKey) {
      ourIndex = doc.sel.contains(start);
      if (ourIndex > -1)
        ourRange = ranges[ourIndex];
      else
        ourRange = new Range(start, start);
    } else {
      ourRange = doc.sel.primary();
      ourIndex = doc.sel.primIndex;
    }

    if (e.altKey) {
      type = "rect";
      if (!addNew) ourRange = new Range(start, start);
      start = posFromMouse(cm, e, true, true);
      ourIndex = -1;
    } else if (type == "double") {
      var word = cm.findWordAt(start);
      if (cm.display.shift || doc.extend)
        ourRange = extendRange(doc, ourRange, word.anchor, word.head);
      else
        ourRange = word;
    } else if (type == "triple") {
      var line = new Range(Pos(start.line, 0), clipPos(doc, Pos(start.line + 1, 0)));
      if (cm.display.shift || doc.extend)
        ourRange = extendRange(doc, ourRange, line.anchor, line.head);
      else
        ourRange = line;
    } else {
      ourRange = extendRange(doc, ourRange, start);
    }

    if (!addNew) {
      ourIndex = 0;
      setSelection(doc, new Selection([ourRange], 0), sel_mouse);
      startSel = doc.sel;
    } else if (ourIndex == -1) {
      ourIndex = ranges.length;
      setSelection(doc, normalizeSelection(ranges.concat([ourRange]), ourIndex),
                   {scroll: false, origin: "*mouse"});
    } else if (ranges.length > 1 && ranges[ourIndex].empty() && type == "single" && !e.shiftKey) {
      setSelection(doc, normalizeSelection(ranges.slice(0, ourIndex).concat(ranges.slice(ourIndex + 1)), 0));
      startSel = doc.sel;
    } else {
      replaceOneSelection(doc, ourIndex, ourRange, sel_mouse);
    }

    var lastPos = start;
    function extendTo(pos) {
      if (cmp(lastPos, pos) == 0) return;
      lastPos = pos;

      if (type == "rect") {
        var ranges = [], tabSize = cm.options.tabSize;
        var startCol = countColumn(getLine(doc, start.line).text, start.ch, tabSize);
        var posCol = countColumn(getLine(doc, pos.line).text, pos.ch, tabSize);
        var left = Math.min(startCol, posCol), right = Math.max(startCol, posCol);
        for (var line = Math.min(start.line, pos.line), end = Math.min(cm.lastLine(), Math.max(start.line, pos.line));
             line <= end; line++) {
          var text = getLine(doc, line).text, leftPos = findColumn(text, left, tabSize);
          if (left == right)
            ranges.push(new Range(Pos(line, leftPos), Pos(line, leftPos)));
          else if (text.length > leftPos)
            ranges.push(new Range(Pos(line, leftPos), Pos(line, findColumn(text, right, tabSize))));
        }
        if (!ranges.length) ranges.push(new Range(start, start));
        setSelection(doc, normalizeSelection(startSel.ranges.slice(0, ourIndex).concat(ranges), ourIndex),
                     {origin: "*mouse", scroll: false});
        cm.scrollIntoView(pos);
      } else {
        var oldRange = ourRange;
        var anchor = oldRange.anchor, head = pos;
        if (type != "single") {
          if (type == "double")
            var range = cm.findWordAt(pos);
          else
            var range = new Range(Pos(pos.line, 0), clipPos(doc, Pos(pos.line + 1, 0)));
          if (cmp(range.anchor, anchor) > 0) {
            head = range.head;
            anchor = minPos(oldRange.from(), range.anchor);
          } else {
            head = range.anchor;
            anchor = maxPos(oldRange.to(), range.head);
          }
        }
        var ranges = startSel.ranges.slice(0);
        ranges[ourIndex] = new Range(clipPos(doc, anchor), head);
        setSelection(doc, normalizeSelection(ranges, ourIndex), sel_mouse);
      }
    }

    var editorSize = display.wrapper.getBoundingClientRect();
    // Used to ensure timeout re-tries don't fire when another extend
    // happened in the meantime (clearTimeout isn't reliable -- at
    // least on Chrome, the timeouts still happen even when cleared,
    // if the clear happens after their scheduled firing time).
    var counter = 0;

    function extend(e) {
      var curCount = ++counter;
      var cur = posFromMouse(cm, e, true, type == "rect");
      if (!cur) return;
      if (cmp(cur, lastPos) != 0) {
        ensureFocus(cm);
        extendTo(cur);
        var visible = visibleLines(display, doc);
        if (cur.line >= visible.to || cur.line < visible.from)
          setTimeout(operation(cm, function(){if (counter == curCount) extend(e);}), 150);
      } else {
        var outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
        if (outside) setTimeout(operation(cm, function() {
          if (counter != curCount) return;
          display.scroller.scrollTop += outside;
          extend(e);
        }), 50);
      }
    }

    function done(e) {
      counter = Infinity;
      e_preventDefault(e);
      display.input.focus();
      off(document, "mousemove", move);
      off(document, "mouseup", up);
      doc.history.lastSelOrigin = null;
    }

    var move = operation(cm, function(e) {
      if (!e_button(e)) done(e);
      else extend(e);
    });
    var up = operation(cm, done);
    on(document, "mousemove", move);
    on(document, "mouseup", up);
  }

  // Determines whether an event happened in the gutter, and fires the
  // handlers for the corresponding event.
  function gutterEvent(cm, e, type, prevent, signalfn) {
    try { var mX = e.clientX, mY = e.clientY; }
    catch(e) { return false; }
    if (mX >= Math.floor(cm.display.gutters.getBoundingClientRect().right)) return false;
    if (prevent) e_preventDefault(e);

    var display = cm.display;
    var lineBox = display.lineDiv.getBoundingClientRect();

    if (mY > lineBox.bottom || !hasHandler(cm, type)) return e_defaultPrevented(e);
    mY -= lineBox.top - display.viewOffset;

    for (var i = 0; i < cm.options.gutters.length; ++i) {
      var g = display.gutters.childNodes[i];
      if (g && g.getBoundingClientRect().right >= mX) {
        var line = lineAtHeight(cm.doc, mY);
        var gutter = cm.options.gutters[i];
        signalfn(cm, type, cm, line, gutter, e);
        return e_defaultPrevented(e);
      }
    }
  }

  function clickInGutter(cm, e) {
    return gutterEvent(cm, e, "gutterClick", true, signalLater);
  }

  // Kludge to work around strange IE behavior where it'll sometimes
  // re-fire a series of drag-related events right after the drop (#1551)
  var lastDrop = 0;

  function onDrop(e) {
    var cm = this;
    if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e))
      return;
    e_preventDefault(e);
    if (ie) lastDrop = +new Date;
    var pos = posFromMouse(cm, e, true), files = e.dataTransfer.files;
    if (!pos || isReadOnly(cm)) return;
    // Might be a file drop, in which case we simply extract the text
    // and insert it.
    if (files && files.length && window.FileReader && window.File) {
      var n = files.length, text = Array(n), read = 0;
      var loadFile = function(file, i) {
        var reader = new FileReader;
        reader.onload = operation(cm, function() {
          text[i] = reader.result;
          if (++read == n) {
            pos = clipPos(cm.doc, pos);
            var change = {from: pos, to: pos, text: splitLines(text.join("\n")), origin: "paste"};
            makeChange(cm.doc, change);
            setSelectionReplaceHistory(cm.doc, simpleSelection(pos, changeEnd(change)));
          }
        });
        reader.readAsText(file);
      };
      for (var i = 0; i < n; ++i) loadFile(files[i], i);
    } else { // Normal drop
      // Don't do a replace if the drop happened inside of the selected text.
      if (cm.state.draggingText && cm.doc.sel.contains(pos) > -1) {
        cm.state.draggingText(e);
        // Ensure the editor is re-focused
        setTimeout(function() {cm.display.input.focus();}, 20);
        return;
      }
      try {
        var text = e.dataTransfer.getData("Text");
        if (text) {
          if (cm.state.draggingText && !(mac ? e.metaKey : e.ctrlKey))
            var selected = cm.listSelections();
          setSelectionNoUndo(cm.doc, simpleSelection(pos, pos));
          if (selected) for (var i = 0; i < selected.length; ++i)
            replaceRange(cm.doc, "", selected[i].anchor, selected[i].head, "drag");
          cm.replaceSelection(text, "around", "paste");
          cm.display.input.focus();
        }
      }
      catch(e){}
    }
  }

  function onDragStart(cm, e) {
    if (ie && (!cm.state.draggingText || +new Date - lastDrop < 100)) { e_stop(e); return; }
    if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) return;

    e.dataTransfer.setData("Text", cm.getSelection());

    // Use dummy image instead of default browsers image.
    // Recent Safari (~6.0.2) have a tendency to segfault when this happens, so we don't do it there.
    if (e.dataTransfer.setDragImage && !safari) {
      var img = elt("img", null, null, "position: fixed; left: 0; top: 0;");
      img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
      if (presto) {
        img.width = img.height = 1;
        cm.display.wrapper.appendChild(img);
        // Force a relayout, or Opera won't use our image for some obscure reason
        img._top = img.offsetTop;
      }
      e.dataTransfer.setDragImage(img, 0, 0);
      if (presto) img.parentNode.removeChild(img);
    }
  }

  // SCROLL EVENTS

  // Sync the scrollable area and scrollbars, ensure the viewport
  // covers the visible area.
  function setScrollTop(cm, val) {
    if (Math.abs(cm.doc.scrollTop - val) < 2) return;
    cm.doc.scrollTop = val;
    if (!gecko) updateDisplaySimple(cm, {top: val});
    if (cm.display.scroller.scrollTop != val) cm.display.scroller.scrollTop = val;
    cm.display.scrollbars.setScrollTop(val);
    if (gecko) updateDisplaySimple(cm);
    startWorker(cm, 100);
  }
  // Sync scroller and scrollbar, ensure the gutter elements are
  // aligned.
  function setScrollLeft(cm, val, isScroller) {
    if (isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) return;
    val = Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth);
    cm.doc.scrollLeft = val;
    alignHorizontally(cm);
    if (cm.display.scroller.scrollLeft != val) cm.display.scroller.scrollLeft = val;
    cm.display.scrollbars.setScrollLeft(val);
  }

  // Since the delta values reported on mouse wheel events are
  // unstandardized between browsers and even browser versions, and
  // generally horribly unpredictable, this code starts by measuring
  // the scroll effect that the first few mouse wheel events have,
  // and, from that, detects the way it can convert deltas to pixel
  // offsets afterwards.
  //
  // The reason we want to know the amount a wheel event will scroll
  // is that it gives us a chance to update the display before the
  // actual scrolling happens, reducing flickering.

  var wheelSamples = 0, wheelPixelsPerUnit = null;
  // Fill in a browser-detected starting value on browsers where we
  // know one. These don't have to be accurate -- the result of them
  // being wrong would just be a slight flicker on the first wheel
  // scroll (if it is large enough).
  if (ie) wheelPixelsPerUnit = -.53;
  else if (gecko) wheelPixelsPerUnit = 15;
  else if (chrome) wheelPixelsPerUnit = -.7;
  else if (safari) wheelPixelsPerUnit = -1/3;

  var wheelEventDelta = function(e) {
    var dx = e.wheelDeltaX, dy = e.wheelDeltaY;
    if (dx == null && e.detail && e.axis == e.HORIZONTAL_AXIS) dx = e.detail;
    if (dy == null && e.detail && e.axis == e.VERTICAL_AXIS) dy = e.detail;
    else if (dy == null) dy = e.wheelDelta;
    return {x: dx, y: dy};
  };
  CodeMirror.wheelEventPixels = function(e) {
    var delta = wheelEventDelta(e);
    delta.x *= wheelPixelsPerUnit;
    delta.y *= wheelPixelsPerUnit;
    return delta;
  };

  function onScrollWheel(cm, e) {
    var delta = wheelEventDelta(e), dx = delta.x, dy = delta.y;

    var display = cm.display, scroll = display.scroller;
    // Quit if there's nothing to scroll here
    if (!(dx && scroll.scrollWidth > scroll.clientWidth ||
          dy && scroll.scrollHeight > scroll.clientHeight)) return;

    // Webkit browsers on OS X abort momentum scrolls when the target
    // of the scroll event is removed from the scrollable element.
    // This hack (see related code in patchDisplay) makes sure the
    // element is kept around.
    if (dy && mac && webkit) {
      outer: for (var cur = e.target, view = display.view; cur != scroll; cur = cur.parentNode) {
        for (var i = 0; i < view.length; i++) {
          if (view[i].node == cur) {
            cm.display.currentWheelTarget = cur;
            break outer;
          }
        }
      }
    }

    // On some browsers, horizontal scrolling will cause redraws to
    // happen before the gutter has been realigned, causing it to
    // wriggle around in a most unseemly way. When we have an
    // estimated pixels/delta value, we just handle horizontal
    // scrolling entirely here. It'll be slightly off from native, but
    // better than glitching out.
    if (dx && !gecko && !presto && wheelPixelsPerUnit != null) {
      if (dy)
        setScrollTop(cm, Math.max(0, Math.min(scroll.scrollTop + dy * wheelPixelsPerUnit, scroll.scrollHeight - scroll.clientHeight)));
      setScrollLeft(cm, Math.max(0, Math.min(scroll.scrollLeft + dx * wheelPixelsPerUnit, scroll.scrollWidth - scroll.clientWidth)));
      e_preventDefault(e);
      display.wheelStartX = null; // Abort measurement, if in progress
      return;
    }

    // 'Project' the visible viewport to cover the area that is being
    // scrolled into view (if we know enough to estimate it).
    if (dy && wheelPixelsPerUnit != null) {
      var pixels = dy * wheelPixelsPerUnit;
      var top = cm.doc.scrollTop, bot = top + display.wrapper.clientHeight;
      if (pixels < 0) top = Math.max(0, top + pixels - 50);
      else bot = Math.min(cm.doc.height, bot + pixels + 50);
      updateDisplaySimple(cm, {top: top, bottom: bot});
    }

    if (wheelSamples < 20) {
      if (display.wheelStartX == null) {
        display.wheelStartX = scroll.scrollLeft; display.wheelStartY = scroll.scrollTop;
        display.wheelDX = dx; display.wheelDY = dy;
        setTimeout(function() {
          if (display.wheelStartX == null) return;
          var movedX = scroll.scrollLeft - display.wheelStartX;
          var movedY = scroll.scrollTop - display.wheelStartY;
          var sample = (movedY && display.wheelDY && movedY / display.wheelDY) ||
            (movedX && display.wheelDX && movedX / display.wheelDX);
          display.wheelStartX = display.wheelStartY = null;
          if (!sample) return;
          wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);
          ++wheelSamples;
        }, 200);
      } else {
        display.wheelDX += dx; display.wheelDY += dy;
      }
    }
  }

  // KEY EVENTS

  // Run a handler that was bound to a key.
  function doHandleBinding(cm, bound, dropShift) {
    if (typeof bound == "string") {
      bound = commands[bound];
      if (!bound) return false;
    }
    // Ensure previous input has been read, so that the handler sees a
    // consistent view of the document
    cm.display.input.ensurePolled();
    var prevShift = cm.display.shift, done = false;
    try {
      if (isReadOnly(cm)) cm.state.suppressEdits = true;
      if (dropShift) cm.display.shift = false;
      done = bound(cm) != Pass;
    } finally {
      cm.display.shift = prevShift;
      cm.state.suppressEdits = false;
    }
    return done;
  }

  function lookupKeyForEditor(cm, name, handle) {
    for (var i = 0; i < cm.state.keyMaps.length; i++) {
      var result = lookupKey(name, cm.state.keyMaps[i], handle, cm);
      if (result) return result;
    }
    return (cm.options.extraKeys && lookupKey(name, cm.options.extraKeys, handle, cm))
      || lookupKey(name, cm.options.keyMap, handle, cm);
  }

  var stopSeq = new Delayed;
  function dispatchKey(cm, name, e, handle) {
    var seq = cm.state.keySeq;
    if (seq) {
      if (isModifierKey(name)) return "handled";
      stopSeq.set(50, function() {
        if (cm.state.keySeq == seq) {
          cm.state.keySeq = null;
          cm.display.input.reset();
        }
      });
      name = seq + " " + name;
    }
    var result = lookupKeyForEditor(cm, name, handle);

    if (result == "multi")
      cm.state.keySeq = name;
    if (result == "handled")
      signalLater(cm, "keyHandled", cm, name, e);

    if (result == "handled" || result == "multi") {
      e_preventDefault(e);
      restartBlink(cm);
    }

    if (seq && !result && /\'$/.test(name)) {
      e_preventDefault(e);
      return true;
    }
    return !!result;
  }

  // Handle a key from the keydown event.
  function handleKeyBinding(cm, e) {
    var name = keyName(e, true);
    if (!name) return false;

    if (e.shiftKey && !cm.state.keySeq) {
      // First try to resolve full name (including 'Shift-'). Failing
      // that, see if there is a cursor-motion command (starting with
      // 'go') bound to the keyname without 'Shift-'.
      return dispatchKey(cm, "Shift-" + name, e, function(b) {return doHandleBinding(cm, b, true);})
          || dispatchKey(cm, name, e, function(b) {
               if (typeof b == "string" ? /^go[A-Z]/.test(b) : b.motion)
                 return doHandleBinding(cm, b);
             });
    } else {
      return dispatchKey(cm, name, e, function(b) { return doHandleBinding(cm, b); });
    }
  }

  // Handle a key from the keypress event
  function handleCharBinding(cm, e, ch) {
    return dispatchKey(cm, "'" + ch + "'", e,
                       function(b) { return doHandleBinding(cm, b, true); });
  }

  var lastStoppedKey = null;
  function onKeyDown(e) {
    var cm = this;
    ensureFocus(cm);
    if (signalDOMEvent(cm, e)) return;
    // IE does strange things with escape.
    if (ie && ie_version < 11 && e.keyCode == 27) e.returnValue = false;
    var code = e.keyCode;
    cm.display.shift = code == 16 || e.shiftKey;
    var handled = handleKeyBinding(cm, e);
    if (presto) {
      lastStoppedKey = handled ? code : null;
      // Opera has no cut event... we try to at least catch the key combo
      if (!handled && code == 88 && !hasCopyEvent && (mac ? e.metaKey : e.ctrlKey))
        cm.replaceSelection("", null, "cut");
    }

    // Turn mouse into crosshair when Alt is held on Mac.
    if (code == 18 && !/\bCodeMirror-crosshair\b/.test(cm.display.lineDiv.className))
      showCrossHair(cm);
  }

  function showCrossHair(cm) {
    var lineDiv = cm.display.lineDiv;
    addClass(lineDiv, "CodeMirror-crosshair");

    function up(e) {
      if (e.keyCode == 18 || !e.altKey) {
        rmClass(lineDiv, "CodeMirror-crosshair");
        off(document, "keyup", up);
        off(document, "mouseover", up);
      }
    }
    on(document, "keyup", up);
    on(document, "mouseover", up);
  }

  function onKeyUp(e) {
    if (e.keyCode == 16) this.doc.sel.shift = false;
    signalDOMEvent(this, e);
  }

  function onKeyPress(e) {
    var cm = this;
    if (eventInWidget(cm.display, e) || signalDOMEvent(cm, e) || e.ctrlKey && !e.altKey || mac && e.metaKey) return;
    var keyCode = e.keyCode, charCode = e.charCode;
    if (presto && keyCode == lastStoppedKey) {lastStoppedKey = null; e_preventDefault(e); return;}
    if ((presto && (!e.which || e.which < 10)) && handleKeyBinding(cm, e)) return;
    var ch = String.fromCharCode(charCode == null ? keyCode : charCode);
    if (handleCharBinding(cm, e, ch)) return;
    cm.display.input.onKeyPress(e);
  }

  // FOCUS/BLUR EVENTS

  function delayBlurEvent(cm) {
    cm.state.delayingBlurEvent = true;
    setTimeout(function() {
      if (cm.state.delayingBlurEvent) {
        cm.state.delayingBlurEvent = false;
        onBlur(cm);
      }
    }, 100);
  }

  function onFocus(cm) {
    if (cm.state.delayingBlurEvent) cm.state.delayingBlurEvent = false;

    if (cm.options.readOnly == "nocursor") return;
    if (!cm.state.focused) {
      signal(cm, "focus", cm);
      cm.state.focused = true;
      addClass(cm.display.wrapper, "CodeMirror-focused");
      // This test prevents this from firing when a context
      // menu is closed (since the input reset would kill the
      // select-all detection hack)
      if (!cm.curOp && cm.display.selForContextMenu != cm.doc.sel) {
        cm.display.input.reset();
        if (webkit) setTimeout(function() { cm.display.input.reset(true); }, 20); // Issue #1730
      }
      cm.display.input.receivedFocus();
    }
    restartBlink(cm);
  }
  function onBlur(cm) {
    if (cm.state.delayingBlurEvent) return;

    if (cm.state.focused) {
      signal(cm, "blur", cm);
      cm.state.focused = false;
      rmClass(cm.display.wrapper, "CodeMirror-focused");
    }
    clearInterval(cm.display.blinker);
    setTimeout(function() {if (!cm.state.focused) cm.display.shift = false;}, 150);
  }

  // CONTEXT MENU HANDLING

  // To make the context menu work, we need to briefly unhide the
  // textarea (making it as unobtrusive as possible) to let the
  // right-click take effect on it.
  function onContextMenu(cm, e) {
    if (eventInWidget(cm.display, e) || contextMenuInGutter(cm, e)) return;
    cm.display.input.onContextMenu(e);
  }

  function contextMenuInGutter(cm, e) {
    if (!hasHandler(cm, "gutterContextMenu")) return false;
    return gutterEvent(cm, e, "gutterContextMenu", false, signal);
  }

  // UPDATING

  // Compute the position of the end of a change (its 'to' property
  // refers to the pre-change end).
  var changeEnd = CodeMirror.changeEnd = function(change) {
    if (!change.text) return change.to;
    return Pos(change.from.line + change.text.length - 1,
               lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0));
  };

  // Adjust a position to refer to the post-change position of the
  // same text, or the end of the change if the change covers it.
  function adjustForChange(pos, change) {
    if (cmp(pos, change.from) < 0) return pos;
    if (cmp(pos, change.to) <= 0) return changeEnd(change);

    var line = pos.line + change.text.length - (change.to.line - change.from.line) - 1, ch = pos.ch;
    if (pos.line == change.to.line) ch += changeEnd(change).ch - change.to.ch;
    return Pos(line, ch);
  }

  function computeSelAfterChange(doc, change) {
    var out = [];
    for (var i = 0; i < doc.sel.ranges.length; i++) {
      var range = doc.sel.ranges[i];
      out.push(new Range(adjustForChange(range.anchor, change),
                         adjustForChange(range.head, change)));
    }
    return normalizeSelection(out, doc.sel.primIndex);
  }

  function offsetPos(pos, old, nw) {
    if (pos.line == old.line)
      return Pos(nw.line, pos.ch - old.ch + nw.ch);
    else
      return Pos(nw.line + (pos.line - old.line), pos.ch);
  }

  // Used by replaceSelections to allow moving the selection to the
  // start or around the replaced test. Hint may be "start" or "around".
  function computeReplacedSel(doc, changes, hint) {
    var out = [];
    var oldPrev = Pos(doc.first, 0), newPrev = oldPrev;
    for (var i = 0; i < changes.length; i++) {
      var change = changes[i];
      var from = offsetPos(change.from, oldPrev, newPrev);
      var to = offsetPos(changeEnd(change), oldPrev, newPrev);
      oldPrev = change.to;
      newPrev = to;
      if (hint == "around") {
        var range = doc.sel.ranges[i], inv = cmp(range.head, range.anchor) < 0;
        out[i] = new Range(inv ? to : from, inv ? from : to);
      } else {
        out[i] = new Range(from, from);
      }
    }
    return new Selection(out, doc.sel.primIndex);
  }

  // Allow "beforeChange" event handlers to influence a change
  function filterChange(doc, change, update) {
    var obj = {
      canceled: false,
      from: change.from,
      to: change.to,
      text: change.text,
      origin: change.origin,
      cancel: function() { this.canceled = true; }
    };
    if (update) obj.update = function(from, to, text, origin) {
      if (from) this.from = clipPos(doc, from);
      if (to) this.to = clipPos(doc, to);
      if (text) this.text = text;
      if (origin !== undefined) this.origin = origin;
    };
    signal(doc, "beforeChange", doc, obj);
    if (doc.cm) signal(doc.cm, "beforeChange", doc.cm, obj);

    if (obj.canceled) return null;
    return {from: obj.from, to: obj.to, text: obj.text, origin: obj.origin};
  }

  // Apply a change to a document, and add it to the document's
  // history, and propagating it to all linked documents.
  function makeChange(doc, change, ignoreReadOnly) {
    if (doc.cm) {
      if (!doc.cm.curOp) return operation(doc.cm, makeChange)(doc, change, ignoreReadOnly);
      if (doc.cm.state.suppressEdits) return;
    }

    if (hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange")) {
      change = filterChange(doc, change, true);
      if (!change) return;
    }

    // Possibly split or suppress the update based on the presence
    // of read-only spans in its range.
    var split = sawReadOnlySpans && !ignoreReadOnly && removeReadOnlyRanges(doc, change.from, change.to);
    if (split) {
      for (var i = split.length - 1; i >= 0; --i)
        makeChangeInner(doc, {from: split[i].from, to: split[i].to, text: i ? [""] : change.text});
    } else {
      makeChangeInner(doc, change);
    }
  }

  function makeChangeInner(doc, change) {
    if (change.text.length == 1 && change.text[0] == "" && cmp(change.from, change.to) == 0) return;
    var selAfter = computeSelAfterChange(doc, change);
    addChangeToHistory(doc, change, selAfter, doc.cm ? doc.cm.curOp.id : NaN);

    makeChangeSingleDoc(doc, change, selAfter, stretchSpansOverChange(doc, change));
    var rebased = [];

    linkedDocs(doc, function(doc, sharedHist) {
      if (!sharedHist && indexOf(rebased, doc.history) == -1) {
        rebaseHist(doc.history, change);
        rebased.push(doc.history);
      }
      makeChangeSingleDoc(doc, change, null, stretchSpansOverChange(doc, change));
    });
  }

  // Revert a change stored in a document's history.
  function makeChangeFromHistory(doc, type, allowSelectionOnly) {
    if (doc.cm && doc.cm.state.suppressEdits) return;

    var hist = doc.history, event, selAfter = doc.sel;
    var source = type == "undo" ? hist.done : hist.undone, dest = type == "undo" ? hist.undone : hist.done;

    // Verify that there is a useable event (so that ctrl-z won't
    // needlessly clear selection events)
    for (var i = 0; i < source.length; i++) {
      event = source[i];
      if (allowSelectionOnly ? event.ranges && !event.equals(doc.sel) : !event.ranges)
        break;
    }
    if (i == source.length) return;
    hist.lastOrigin = hist.lastSelOrigin = null;

    for (;;) {
      event = source.pop();
      if (event.ranges) {
        pushSelectionToHistory(event, dest);
        if (allowSelectionOnly && !event.equals(doc.sel)) {
          setSelection(doc, event, {clearRedo: false});
          return;
        }
        selAfter = event;
      }
      else break;
    }

    // Build up a reverse change object to add to the opposite history
    // stack (redo when undoing, and vice versa).
    var antiChanges = [];
    pushSelectionToHistory(selAfter, dest);
    dest.push({changes: antiChanges, generation: hist.generation});
    hist.generation = event.generation || ++hist.maxGeneration;

    var filter = hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange");

    for (var i = event.changes.length - 1; i >= 0; --i) {
      var change = event.changes[i];
      change.origin = type;
      if (filter && !filterChange(doc, change, false)) {
        source.length = 0;
        return;
      }

      antiChanges.push(historyChangeFromChange(doc, change));

      var after = i ? computeSelAfterChange(doc, change) : lst(source);
      makeChangeSingleDoc(doc, change, after, mergeOldSpans(doc, change));
      if (!i && doc.cm) doc.cm.scrollIntoView({from: change.from, to: changeEnd(change)});
      var rebased = [];

      // Propagate to the linked documents
      linkedDocs(doc, function(doc, sharedHist) {
        if (!sharedHist && indexOf(rebased, doc.history) == -1) {
          rebaseHist(doc.history, change);
          rebased.push(doc.history);
        }
        makeChangeSingleDoc(doc, change, null, mergeOldSpans(doc, change));
      });
    }
  }

  // Sub-views need their line numbers shifted when text is added
  // above or below them in the parent document.
  function shiftDoc(doc, distance) {
    if (distance == 0) return;
    doc.first += distance;
    doc.sel = new Selection(map(doc.sel.ranges, function(range) {
      return new Range(Pos(range.anchor.line + distance, range.anchor.ch),
                       Pos(range.head.line + distance, range.head.ch));
    }), doc.sel.primIndex);
    if (doc.cm) {
      regChange(doc.cm, doc.first, doc.first - distance, distance);
      for (var d = doc.cm.display, l = d.viewFrom; l < d.viewTo; l++)
        regLineChange(doc.cm, l, "gutter");
    }
  }

  // More lower-level change function, handling only a single document
  // (not linked ones).
  function makeChangeSingleDoc(doc, change, selAfter, spans) {
    if (doc.cm && !doc.cm.curOp)
      return operation(doc.cm, makeChangeSingleDoc)(doc, change, selAfter, spans);

    if (change.to.line < doc.first) {
      shiftDoc(doc, change.text.length - 1 - (change.to.line - change.from.line));
      return;
    }
    if (change.from.line > doc.lastLine()) return;

    // Clip the change to the size of this doc
    if (change.from.line < doc.first) {
      var shift = change.text.length - 1 - (doc.first - change.from.line);
      shiftDoc(doc, shift);
      change = {from: Pos(doc.first, 0), to: Pos(change.to.line + shift, change.to.ch),
                text: [lst(change.text)], origin: change.origin};
    }
    var last = doc.lastLine();
    if (change.to.line > last) {
      change = {from: change.from, to: Pos(last, getLine(doc, last).text.length),
                text: [change.text[0]], origin: change.origin};
    }

    change.removed = getBetween(doc, change.from, change.to);

    if (!selAfter) selAfter = computeSelAfterChange(doc, change);
    if (doc.cm) makeChangeSingleDocInEditor(doc.cm, change, spans);
    else updateDoc(doc, change, spans);
    setSelectionNoUndo(doc, selAfter, sel_dontScroll);
  }

  // Handle the interaction of a change to a document with the editor
  // that this document is part of.
  function makeChangeSingleDocInEditor(cm, change, spans) {
    var doc = cm.doc, display = cm.display, from = change.from, to = change.to;

    var recomputeMaxLength = false, checkWidthStart = from.line;
    if (!cm.options.lineWrapping) {
      checkWidthStart = lineNo(visualLine(getLine(doc, from.line)));
      doc.iter(checkWidthStart, to.line + 1, function(line) {
        if (line == display.maxLine) {
          recomputeMaxLength = true;
          return true;
        }
      });
    }

    if (doc.sel.contains(change.from, change.to) > -1)
      signalCursorActivity(cm);

    updateDoc(doc, change, spans, estimateHeight(cm));

    if (!cm.options.lineWrapping) {
      doc.iter(checkWidthStart, from.line + change.text.length, function(line) {
        var len = lineLength(line);
        if (len > display.maxLineLength) {
          display.maxLine = line;
          display.maxLineLength = len;
          display.maxLineChanged = true;
          recomputeMaxLength = false;
        }
      });
      if (recomputeMaxLength) cm.curOp.updateMaxLine = true;
    }

    // Adjust frontier, schedule worker
    doc.frontier = Math.min(doc.frontier, from.line);
    startWorker(cm, 400);

    var lendiff = change.text.length - (to.line - from.line) - 1;
    // Remember that these lines changed, for updating the display
    if (change.full)
      regChange(cm);
    else if (from.line == to.line && change.text.length == 1 && !isWholeLineUpdate(cm.doc, change))
      regLineChange(cm, from.line, "text");
    else
      regChange(cm, from.line, to.line + 1, lendiff);

    var changesHandler = hasHandler(cm, "changes"), changeHandler = hasHandler(cm, "change");
    if (changeHandler || changesHandler) {
      var obj = {
        from: from, to: to,
        text: change.text,
        removed: change.removed,
        origin: change.origin
      };
      if (changeHandler) signalLater(cm, "change", cm, obj);
      if (changesHandler) (cm.curOp.changeObjs || (cm.curOp.changeObjs = [])).push(obj);
    }
    cm.display.selForContextMenu = null;
  }

  function replaceRange(doc, code, from, to, origin) {
    if (!to) to = from;
    if (cmp(to, from) < 0) { var tmp = to; to = from; from = tmp; }
    if (typeof code == "string") code = splitLines(code);
    makeChange(doc, {from: from, to: to, text: code, origin: origin});
  }

  // SCROLLING THINGS INTO VIEW

  // If an editor sits on the top or bottom of the window, partially
  // scrolled out of view, this ensures that the cursor is visible.
  function maybeScrollWindow(cm, coords) {
    if (signalDOMEvent(cm, "scrollCursorIntoView")) return;

    var display = cm.display, box = display.sizer.getBoundingClientRect(), doScroll = null;
    if (coords.top + box.top < 0) doScroll = true;
    else if (coords.bottom + box.top > (window.innerHeight || document.documentElement.clientHeight)) doScroll = false;
    if (doScroll != null && !phantom) {
      var scrollNode = elt("div", "\u200b", null, "position: absolute; top: " +
                           (coords.top - display.viewOffset - paddingTop(cm.display)) + "px; height: " +
                           (coords.bottom - coords.top + scrollGap(cm) + display.barHeight) + "px; left: " +
                           coords.left + "px; width: 2px;");
      cm.display.lineSpace.appendChild(scrollNode);
      scrollNode.scrollIntoView(doScroll);
      cm.display.lineSpace.removeChild(scrollNode);
    }
  }

  // Scroll a given position into view (immediately), verifying that
  // it actually became visible (as line heights are accurately
  // measured, the position of something may 'drift' during drawing).
  function scrollPosIntoView(cm, pos, end, margin) {
    if (margin == null) margin = 0;
    for (var limit = 0; limit < 5; limit++) {
      var changed = false, coords = cursorCoords(cm, pos);
      var endCoords = !end || end == pos ? coords : cursorCoords(cm, end);
      var scrollPos = calculateScrollPos(cm, Math.min(coords.left, endCoords.left),
                                         Math.min(coords.top, endCoords.top) - margin,
                                         Math.max(coords.left, endCoords.left),
                                         Math.max(coords.bottom, endCoords.bottom) + margin);
      var startTop = cm.doc.scrollTop, startLeft = cm.doc.scrollLeft;
      if (scrollPos.scrollTop != null) {
        setScrollTop(cm, scrollPos.scrollTop);
        if (Math.abs(cm.doc.scrollTop - startTop) > 1) changed = true;
      }
      if (scrollPos.scrollLeft != null) {
        setScrollLeft(cm, scrollPos.scrollLeft);
        if (Math.abs(cm.doc.scrollLeft - startLeft) > 1) changed = true;
      }
      if (!changed) break;
    }
    return coords;
  }

  // Scroll a given set of coordinates into view (immediately).
  function scrollIntoView(cm, x1, y1, x2, y2) {
    var scrollPos = calculateScrollPos(cm, x1, y1, x2, y2);
    if (scrollPos.scrollTop != null) setScrollTop(cm, scrollPos.scrollTop);
    if (scrollPos.scrollLeft != null) setScrollLeft(cm, scrollPos.scrollLeft);
  }

  // Calculate a new scroll position needed to scroll the given
  // rectangle into view. Returns an object with scrollTop and
  // scrollLeft properties. When these are undefined, the
  // vertical/horizontal position does not need to be adjusted.
  function calculateScrollPos(cm, x1, y1, x2, y2) {
    var display = cm.display, snapMargin = textHeight(cm.display);
    if (y1 < 0) y1 = 0;
    var screentop = cm.curOp && cm.curOp.scrollTop != null ? cm.curOp.scrollTop : display.scroller.scrollTop;
    var screen = displayHeight(cm), result = {};
    if (y2 - y1 > screen) y2 = y1 + screen;
    var docBottom = cm.doc.height + paddingVert(display);
    var atTop = y1 < snapMargin, atBottom = y2 > docBottom - snapMargin;
    if (y1 < screentop) {
      result.scrollTop = atTop ? 0 : y1;
    } else if (y2 > screentop + screen) {
      var newTop = Math.min(y1, (atBottom ? docBottom : y2) - screen);
      if (newTop != screentop) result.scrollTop = newTop;
    }

    var screenleft = cm.curOp && cm.curOp.scrollLeft != null ? cm.curOp.scrollLeft : display.scroller.scrollLeft;
    var screenw = displayWidth(cm) - (cm.options.fixedGutter ? display.gutters.offsetWidth : 0);
    var tooWide = x2 - x1 > screenw;
    if (tooWide) x2 = x1 + screenw;
    if (x1 < 10)
      result.scrollLeft = 0;
    else if (x1 < screenleft)
      result.scrollLeft = Math.max(0, x1 - (tooWide ? 0 : 10));
    else if (x2 > screenw + screenleft - 3)
      result.scrollLeft = x2 + (tooWide ? 0 : 10) - screenw;
    return result;
  }

  // Store a relative adjustment to the scroll position in the current
  // operation (to be applied when the operation finishes).
  function addToScrollPos(cm, left, top) {
    if (left != null || top != null) resolveScrollToPos(cm);
    if (left != null)
      cm.curOp.scrollLeft = (cm.curOp.scrollLeft == null ? cm.doc.scrollLeft : cm.curOp.scrollLeft) + left;
    if (top != null)
      cm.curOp.scrollTop = (cm.curOp.scrollTop == null ? cm.doc.scrollTop : cm.curOp.scrollTop) + top;
  }

  // Make sure that at the end of the operation the current cursor is
  // shown.
  function ensureCursorVisible(cm) {
    resolveScrollToPos(cm);
    var cur = cm.getCursor(), from = cur, to = cur;
    if (!cm.options.lineWrapping) {
      from = cur.ch ? Pos(cur.line, cur.ch - 1) : cur;
      to = Pos(cur.line, cur.ch + 1);
    }
    cm.curOp.scrollToPos = {from: from, to: to, margin: cm.options.cursorScrollMargin, isCursor: true};
  }

  // When an operation has its scrollToPos property set, and another
  // scroll action is applied before the end of the operation, this
  // 'simulates' scrolling that position into view in a cheap way, so
  // that the effect of intermediate scroll commands is not ignored.
  function resolveScrollToPos(cm) {
    var range = cm.curOp.scrollToPos;
    if (range) {
      cm.curOp.scrollToPos = null;
      var from = estimateCoords(cm, range.from), to = estimateCoords(cm, range.to);
      var sPos = calculateScrollPos(cm, Math.min(from.left, to.left),
                                    Math.min(from.top, to.top) - range.margin,
                                    Math.max(from.right, to.right),
                                    Math.max(from.bottom, to.bottom) + range.margin);
      cm.scrollTo(sPos.scrollLeft, sPos.scrollTop);
    }
  }

  // API UTILITIES

  // Indent the given line. The how parameter can be "smart",
  // "add"/null, "subtract", or "prev". When aggressive is false
  // (typically set to true for forced single-line indents), empty
  // lines are not indented, and places where the mode returns Pass
  // are left alone.
  function indentLine(cm, n, how, aggressive) {
    var doc = cm.doc, state;
    if (how == null) how = "add";
    if (how == "smart") {
      // Fall back to "prev" when the mode doesn't have an indentation
      // method.
      if (!doc.mode.indent) how = "prev";
      else state = getStateBefore(cm, n);
    }

    var tabSize = cm.options.tabSize;
    var line = getLine(doc, n), curSpace = countColumn(line.text, null, tabSize);
    if (line.stateAfter) line.stateAfter = null;
    var curSpaceString = line.text.match(/^\s*/)[0], indentation;
    if (!aggressive && !/\S/.test(line.text)) {
      indentation = 0;
      how = "not";
    } else if (how == "smart") {
      indentation = doc.mode.indent(state, line.text.slice(curSpaceString.length), line.text);
      if (indentation == Pass || indentation > 150) {
        if (!aggressive) return;
        how = "prev";
      }
    }
    if (how == "prev") {
      if (n > doc.first) indentation = countColumn(getLine(doc, n-1).text, null, tabSize);
      else indentation = 0;
    } else if (how == "add") {
      indentation = curSpace + cm.options.indentUnit;
    } else if (how == "subtract") {
      indentation = curSpace - cm.options.indentUnit;
    } else if (typeof how == "number") {
      indentation = curSpace + how;
    }
    indentation = Math.max(0, indentation);

    var indentString = "", pos = 0;
    if (cm.options.indentWithTabs)
      for (var i = Math.floor(indentation / tabSize); i; --i) {pos += tabSize; indentString += "\t";}
    if (pos < indentation) indentString += spaceStr(indentation - pos);

    if (indentString != curSpaceString) {
      replaceRange(doc, indentString, Pos(n, 0), Pos(n, curSpaceString.length), "+input");
    } else {
      // Ensure that, if the cursor was in the whitespace at the start
      // of the line, it is moved to the end of that space.
      for (var i = 0; i < doc.sel.ranges.length; i++) {
        var range = doc.sel.ranges[i];
        if (range.head.line == n && range.head.ch < curSpaceString.length) {
          var pos = Pos(n, curSpaceString.length);
          replaceOneSelection(doc, i, new Range(pos, pos));
          break;
        }
      }
    }
    line.stateAfter = null;
  }

  // Utility for applying a change to a line by handle or number,
  // returning the number and optionally registering the line as
  // changed.
  function changeLine(doc, handle, changeType, op) {
    var no = handle, line = handle;
    if (typeof handle == "number") line = getLine(doc, clipLine(doc, handle));
    else no = lineNo(handle);
    if (no == null) return null;
    if (op(line, no) && doc.cm) regLineChange(doc.cm, no, changeType);
    return line;
  }

  // Helper for deleting text near the selection(s), used to implement
  // backspace, delete, and similar functionality.
  function deleteNearSelection(cm, compute) {
    var ranges = cm.doc.sel.ranges, kill = [];
    // Build up a set of ranges to kill first, merging overlapping
    // ranges.
    for (var i = 0; i < ranges.length; i++) {
      var toKill = compute(ranges[i]);
      while (kill.length && cmp(toKill.from, lst(kill).to) <= 0) {
        var replaced = kill.pop();
        if (cmp(replaced.from, toKill.from) < 0) {
          toKill.from = replaced.from;
          break;
        }
      }
      kill.push(toKill);
    }
    // Next, remove those actual ranges.
    runInOp(cm, function() {
      for (var i = kill.length - 1; i >= 0; i--)
        replaceRange(cm.doc, "", kill[i].from, kill[i].to, "+delete");
      ensureCursorVisible(cm);
    });
  }

  // Used for horizontal relative motion. Dir is -1 or 1 (left or
  // right), unit can be "char", "column" (like char, but doesn't
  // cross line boundaries), "word" (across next word), or "group" (to
  // the start of next group of word or non-word-non-whitespace
  // chars). The visually param controls whether, in right-to-left
  // text, direction 1 means to move towards the next index in the
  // string, or towards the character to the right of the current
  // position. The resulting position will have a hitSide=true
  // property if it reached the end of the document.
  function findPosH(doc, pos, dir, unit, visually) {
    var line = pos.line, ch = pos.ch, origDir = dir;
    var lineObj = getLine(doc, line);
    var possible = true;
    function findNextLine() {
      var l = line + dir;
      if (l < doc.first || l >= doc.first + doc.size) return (possible = false);
      line = l;
      return lineObj = getLine(doc, l);
    }
    function moveOnce(boundToLine) {
      var next = (visually ? moveVisually : moveLogically)(lineObj, ch, dir, true);
      if (next == null) {
        if (!boundToLine && findNextLine()) {
          if (visually) ch = (dir < 0 ? lineRight : lineLeft)(lineObj);
          else ch = dir < 0 ? lineObj.text.length : 0;
        } else return (possible = false);
      } else ch = next;
      return true;
    }

    if (unit == "char") moveOnce();
    else if (unit == "column") moveOnce(true);
    else if (unit == "word" || unit == "group") {
      var sawType = null, group = unit == "group";
      var helper = doc.cm && doc.cm.getHelper(pos, "wordChars");
      for (var first = true;; first = false) {
        if (dir < 0 && !moveOnce(!first)) break;
        var cur = lineObj.text.charAt(ch) || "\n";
        var type = isWordChar(cur, helper) ? "w"
          : group && cur == "\n" ? "n"
          : !group || /\s/.test(cur) ? null
          : "p";
        if (group && !first && !type) type = "s";
        if (sawType && sawType != type) {
          if (dir < 0) {dir = 1; moveOnce();}
          break;
        }

        if (type) sawType = type;
        if (dir > 0 && !moveOnce(!first)) break;
      }
    }
    var result = skipAtomic(doc, Pos(line, ch), origDir, true);
    if (!possible) result.hitSide = true;
    return result;
  }

  // For relative vertical movement. Dir may be -1 or 1. Unit can be
  // "page" or "line". The resulting position will have a hitSide=true
  // property if it reached the end of the document.
  function findPosV(cm, pos, dir, unit) {
    var doc = cm.doc, x = pos.left, y;
    if (unit == "page") {
      var pageSize = Math.min(cm.display.wrapper.clientHeight, window.innerHeight || document.documentElement.clientHeight);
      y = pos.top + dir * (pageSize - (dir < 0 ? 1.5 : .5) * textHeight(cm.display));
    } else if (unit == "line") {
      y = dir > 0 ? pos.bottom + 3 : pos.top - 3;
    }
    for (;;) {
      var target = coordsChar(cm, x, y);
      if (!target.outside) break;
      if (dir < 0 ? y <= 0 : y >= doc.height) { target.hitSide = true; break; }
      y += dir * 5;
    }
    return target;
  }

  // EDITOR METHODS

  // The publicly visible API. Note that methodOp(f) means
  // 'wrap f in an operation, performed on its `this` parameter'.

  // This is not the complete set of editor methods. Most of the
  // methods defined on the Doc type are also injected into
  // CodeMirror.prototype, for backwards compatibility and
  // convenience.

  CodeMirror.prototype = {
    constructor: CodeMirror,
    focus: function(){window.focus(); this.display.input.focus();},

    setOption: function(option, value) {
      var options = this.options, old = options[option];
      if (options[option] == value && option != "mode") return;
      options[option] = value;
      if (optionHandlers.hasOwnProperty(option))
        operation(this, optionHandlers[option])(this, value, old);
    },

    getOption: function(option) {return this.options[option];},
    getDoc: function() {return this.doc;},

    addKeyMap: function(map, bottom) {
      this.state.keyMaps[bottom ? "push" : "unshift"](getKeyMap(map));
    },
    removeKeyMap: function(map) {
      var maps = this.state.keyMaps;
      for (var i = 0; i < maps.length; ++i)
        if (maps[i] == map || maps[i].name == map) {
          maps.splice(i, 1);
          return true;
        }
    },

    addOverlay: methodOp(function(spec, options) {
      var mode = spec.token ? spec : CodeMirror.getMode(this.options, spec);
      if (mode.startState) throw new Error("Overlays may not be stateful.");
      this.state.overlays.push({mode: mode, modeSpec: spec, opaque: options && options.opaque});
      this.state.modeGen++;
      regChange(this);
    }),
    removeOverlay: methodOp(function(spec) {
      var overlays = this.state.overlays;
      for (var i = 0; i < overlays.length; ++i) {
        var cur = overlays[i].modeSpec;
        if (cur == spec || typeof spec == "string" && cur.name == spec) {
          overlays.splice(i, 1);
          this.state.modeGen++;
          regChange(this);
          return;
        }
      }
    }),

    indentLine: methodOp(function(n, dir, aggressive) {
      if (typeof dir != "string" && typeof dir != "number") {
        if (dir == null) dir = this.options.smartIndent ? "smart" : "prev";
        else dir = dir ? "add" : "subtract";
      }
      if (isLine(this.doc, n)) indentLine(this, n, dir, aggressive);
    }),
    indentSelection: methodOp(function(how) {
      var ranges = this.doc.sel.ranges, end = -1;
      for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        if (!range.empty()) {
          var from = range.from(), to = range.to();
          var start = Math.max(end, from.line);
          end = Math.min(this.lastLine(), to.line - (to.ch ? 0 : 1)) + 1;
          for (var j = start; j < end; ++j)
            indentLine(this, j, how);
          var newRanges = this.doc.sel.ranges;
          if (from.ch == 0 && ranges.length == newRanges.length && newRanges[i].from().ch > 0)
            replaceOneSelection(this.doc, i, new Range(from, newRanges[i].to()), sel_dontScroll);
        } else if (range.head.line > end) {
          indentLine(this, range.head.line, how, true);
          end = range.head.line;
          if (i == this.doc.sel.primIndex) ensureCursorVisible(this);
        }
      }
    }),

    // Fetch the parser token for a given character. Useful for hacks
    // that want to inspect the mode state (say, for completion).
    getTokenAt: function(pos, precise) {
      return takeToken(this, pos, precise);
    },

    getLineTokens: function(line, precise) {
      return takeToken(this, Pos(line), precise, true);
    },

    getTokenTypeAt: function(pos) {
      pos = clipPos(this.doc, pos);
      var styles = getLineStyles(this, getLine(this.doc, pos.line));
      var before = 0, after = (styles.length - 1) / 2, ch = pos.ch;
      var type;
      if (ch == 0) type = styles[2];
      else for (;;) {
        var mid = (before + after) >> 1;
        if ((mid ? styles[mid * 2 - 1] : 0) >= ch) after = mid;
        else if (styles[mid * 2 + 1] < ch) before = mid + 1;
        else { type = styles[mid * 2 + 2]; break; }
      }
      var cut = type ? type.indexOf("cm-overlay ") : -1;
      return cut < 0 ? type : cut == 0 ? null : type.slice(0, cut - 1);
    },

    getModeAt: function(pos) {
      var mode = this.doc.mode;
      if (!mode.innerMode) return mode;
      return CodeMirror.innerMode(mode, this.getTokenAt(pos).state).mode;
    },

    getHelper: function(pos, type) {
      return this.getHelpers(pos, type)[0];
    },

    getHelpers: function(pos, type) {
      var found = [];
      if (!helpers.hasOwnProperty(type)) return found;
      var help = helpers[type], mode = this.getModeAt(pos);
      if (typeof mode[type] == "string") {
        if (help[mode[type]]) found.push(help[mode[type]]);
      } else if (mode[type]) {
        for (var i = 0; i < mode[type].length; i++) {
          var val = help[mode[type][i]];
          if (val) found.push(val);
        }
      } else if (mode.helperType && help[mode.helperType]) {
        found.push(help[mode.helperType]);
      } else if (help[mode.name]) {
        found.push(help[mode.name]);
      }
      for (var i = 0; i < help._global.length; i++) {
        var cur = help._global[i];
        if (cur.pred(mode, this) && indexOf(found, cur.val) == -1)
          found.push(cur.val);
      }
      return found;
    },

    getStateAfter: function(line, precise) {
      var doc = this.doc;
      line = clipLine(doc, line == null ? doc.first + doc.size - 1: line);
      return getStateBefore(this, line + 1, precise);
    },

    cursorCoords: function(start, mode) {
      var pos, range = this.doc.sel.primary();
      if (start == null) pos = range.head;
      else if (typeof start == "object") pos = clipPos(this.doc, start);
      else pos = start ? range.from() : range.to();
      return cursorCoords(this, pos, mode || "page");
    },

    charCoords: function(pos, mode) {
      return charCoords(this, clipPos(this.doc, pos), mode || "page");
    },

    coordsChar: function(coords, mode) {
      coords = fromCoordSystem(this, coords, mode || "page");
      return coordsChar(this, coords.left, coords.top);
    },

    lineAtHeight: function(height, mode) {
      height = fromCoordSystem(this, {top: height, left: 0}, mode || "page").top;
      return lineAtHeight(this.doc, height + this.display.viewOffset);
    },
    heightAtLine: function(line, mode) {
      var end = false, last = this.doc.first + this.doc.size - 1;
      if (line < this.doc.first) line = this.doc.first;
      else if (line > last) { line = last; end = true; }
      var lineObj = getLine(this.doc, line);
      return intoCoordSystem(this, lineObj, {top: 0, left: 0}, mode || "page").top +
        (end ? this.doc.height - heightAtLine(lineObj) : 0);
    },

    defaultTextHeight: function() { return textHeight(this.display); },
    defaultCharWidth: function() { return charWidth(this.display); },

    setGutterMarker: methodOp(function(line, gutterID, value) {
      return changeLine(this.doc, line, "gutter", function(line) {
        var markers = line.gutterMarkers || (line.gutterMarkers = {});
        markers[gutterID] = value;
        if (!value && isEmpty(markers)) line.gutterMarkers = null;
        return true;
      });
    }),

    clearGutter: methodOp(function(gutterID) {
      var cm = this, doc = cm.doc, i = doc.first;
      doc.iter(function(line) {
        if (line.gutterMarkers && line.gutterMarkers[gutterID]) {
          line.gutterMarkers[gutterID] = null;
          regLineChange(cm, i, "gutter");
          if (isEmpty(line.gutterMarkers)) line.gutterMarkers = null;
        }
        ++i;
      });
    }),

    lineInfo: function(line) {
      if (typeof line == "number") {
        if (!isLine(this.doc, line)) return null;
        var n = line;
        line = getLine(this.doc, line);
        if (!line) return null;
      } else {
        var n = lineNo(line);
        if (n == null) return null;
      }
      return {line: n, handle: line, text: line.text, gutterMarkers: line.gutterMarkers,
              textClass: line.textClass, bgClass: line.bgClass, wrapClass: line.wrapClass,
              widgets: line.widgets};
    },

    getViewport: function() { return {from: this.display.viewFrom, to: this.display.viewTo};},

    addWidget: function(pos, node, scroll, vert, horiz) {
      var display = this.display;
      pos = cursorCoords(this, clipPos(this.doc, pos));
      var top = pos.bottom, left = pos.left;
      node.style.position = "absolute";
      node.setAttribute("cm-ignore-events", "true");
      this.display.input.setUneditable(node);
      display.sizer.appendChild(node);
      if (vert == "over") {
        top = pos.top;
      } else if (vert == "above" || vert == "near") {
        var vspace = Math.max(display.wrapper.clientHeight, this.doc.height),
        hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);
        // Default to positioning above (if specified and possible); otherwise default to positioning below
        if ((vert == 'above' || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight)
          top = pos.top - node.offsetHeight;
        else if (pos.bottom + node.offsetHeight <= vspace)
          top = pos.bottom;
        if (left + node.offsetWidth > hspace)
          left = hspace - node.offsetWidth;
      }
      node.style.top = top + "px";
      node.style.left = node.style.right = "";
      if (horiz == "right") {
        left = display.sizer.clientWidth - node.offsetWidth;
        node.style.right = "0px";
      } else {
        if (horiz == "left") left = 0;
        else if (horiz == "middle") left = (display.sizer.clientWidth - node.offsetWidth) / 2;
        node.style.left = left + "px";
      }
      if (scroll)
        scrollIntoView(this, left, top, left + node.offsetWidth, top + node.offsetHeight);
    },

    triggerOnKeyDown: methodOp(onKeyDown),
    triggerOnKeyPress: methodOp(onKeyPress),
    triggerOnKeyUp: onKeyUp,

    execCommand: function(cmd) {
      if (commands.hasOwnProperty(cmd))
        return commands[cmd](this);
    },

    findPosH: function(from, amount, unit, visually) {
      var dir = 1;
      if (amount < 0) { dir = -1; amount = -amount; }
      for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {
        cur = findPosH(this.doc, cur, dir, unit, visually);
        if (cur.hitSide) break;
      }
      return cur;
    },

    moveH: methodOp(function(dir, unit) {
      var cm = this;
      cm.extendSelectionsBy(function(range) {
        if (cm.display.shift || cm.doc.extend || range.empty())
          return findPosH(cm.doc, range.head, dir, unit, cm.options.rtlMoveVisually);
        else
          return dir < 0 ? range.from() : range.to();
      }, sel_move);
    }),

    deleteH: methodOp(function(dir, unit) {
      var sel = this.doc.sel, doc = this.doc;
      if (sel.somethingSelected())
        doc.replaceSelection("", null, "+delete");
      else
        deleteNearSelection(this, function(range) {
          var other = findPosH(doc, range.head, dir, unit, false);
          return dir < 0 ? {from: other, to: range.head} : {from: range.head, to: other};
        });
    }),

    findPosV: function(from, amount, unit, goalColumn) {
      var dir = 1, x = goalColumn;
      if (amount < 0) { dir = -1; amount = -amount; }
      for (var i = 0, cur = clipPos(this.doc, from); i < amount; ++i) {
        var coords = cursorCoords(this, cur, "div");
        if (x == null) x = coords.left;
        else coords.left = x;
        cur = findPosV(this, coords, dir, unit);
        if (cur.hitSide) break;
      }
      return cur;
    },

    moveV: methodOp(function(dir, unit) {
      var cm = this, doc = this.doc, goals = [];
      var collapse = !cm.display.shift && !doc.extend && doc.sel.somethingSelected();
      doc.extendSelectionsBy(function(range) {
        if (collapse)
          return dir < 0 ? range.from() : range.to();
        var headPos = cursorCoords(cm, range.head, "div");
        if (range.goalColumn != null) headPos.left = range.goalColumn;
        goals.push(headPos.left);
        var pos = findPosV(cm, headPos, dir, unit);
        if (unit == "page" && range == doc.sel.primary())
          addToScrollPos(cm, null, charCoords(cm, pos, "div").top - headPos.top);
        return pos;
      }, sel_move);
      if (goals.length) for (var i = 0; i < doc.sel.ranges.length; i++)
        doc.sel.ranges[i].goalColumn = goals[i];
    }),

    // Find the word at the given position (as returned by coordsChar).
    findWordAt: function(pos) {
      var doc = this.doc, line = getLine(doc, pos.line).text;
      var start = pos.ch, end = pos.ch;
      if (line) {
        var helper = this.getHelper(pos, "wordChars");
        if ((pos.xRel < 0 || end == line.length) && start) --start; else ++end;
        var startChar = line.charAt(start);
        var check = isWordChar(startChar, helper)
          ? function(ch) { return isWordChar(ch, helper); }
          : /\s/.test(startChar) ? function(ch) {return /\s/.test(ch);}
          : function(ch) {return !/\s/.test(ch) && !isWordChar(ch);};
        while (start > 0 && check(line.charAt(start - 1))) --start;
        while (end < line.length && check(line.charAt(end))) ++end;
      }
      return new Range(Pos(pos.line, start), Pos(pos.line, end));
    },

    toggleOverwrite: function(value) {
      if (value != null && value == this.state.overwrite) return;
      if (this.state.overwrite = !this.state.overwrite)
        addClass(this.display.cursorDiv, "CodeMirror-overwrite");
      else
        rmClass(this.display.cursorDiv, "CodeMirror-overwrite");

      signal(this, "overwriteToggle", this, this.state.overwrite);
    },
    hasFocus: function() { return this.display.input.getField() == activeElt(); },

    scrollTo: methodOp(function(x, y) {
      if (x != null || y != null) resolveScrollToPos(this);
      if (x != null) this.curOp.scrollLeft = x;
      if (y != null) this.curOp.scrollTop = y;
    }),
    getScrollInfo: function() {
      var scroller = this.display.scroller;
      return {left: scroller.scrollLeft, top: scroller.scrollTop,
              height: scroller.scrollHeight - scrollGap(this) - this.display.barHeight,
              width: scroller.scrollWidth - scrollGap(this) - this.display.barWidth,
              clientHeight: displayHeight(this), clientWidth: displayWidth(this)};
    },

    scrollIntoView: methodOp(function(range, margin) {
      if (range == null) {
        range = {from: this.doc.sel.primary().head, to: null};
        if (margin == null) margin = this.options.cursorScrollMargin;
      } else if (typeof range == "number") {
        range = {from: Pos(range, 0), to: null};
      } else if (range.from == null) {
        range = {from: range, to: null};
      }
      if (!range.to) range.to = range.from;
      range.margin = margin || 0;

      if (range.from.line != null) {
        resolveScrollToPos(this);
        this.curOp.scrollToPos = range;
      } else {
        var sPos = calculateScrollPos(this, Math.min(range.from.left, range.to.left),
                                      Math.min(range.from.top, range.to.top) - range.margin,
                                      Math.max(range.from.right, range.to.right),
                                      Math.max(range.from.bottom, range.to.bottom) + range.margin);
        this.scrollTo(sPos.scrollLeft, sPos.scrollTop);
      }
    }),

    setSize: methodOp(function(width, height) {
      var cm = this;
      function interpret(val) {
        return typeof val == "number" || /^\d+$/.test(String(val)) ? val + "px" : val;
      }
      if (width != null) cm.display.wrapper.style.width = interpret(width);
      if (height != null) cm.display.wrapper.style.height = interpret(height);
      if (cm.options.lineWrapping) clearLineMeasurementCache(this);
      var lineNo = cm.display.viewFrom;
      cm.doc.iter(lineNo, cm.display.viewTo, function(line) {
        if (line.widgets) for (var i = 0; i < line.widgets.length; i++)
          if (line.widgets[i].noHScroll) { regLineChange(cm, lineNo, "widget"); break; }
        ++lineNo;
      });
      cm.curOp.forceUpdate = true;
      signal(cm, "refresh", this);
    }),

    operation: function(f){return runInOp(this, f);},

    refresh: methodOp(function() {
      var oldHeight = this.display.cachedTextHeight;
      regChange(this);
      this.curOp.forceUpdate = true;
      clearCaches(this);
      this.scrollTo(this.doc.scrollLeft, this.doc.scrollTop);
      updateGutterSpace(this);
      if (oldHeight == null || Math.abs(oldHeight - textHeight(this.display)) > .5)
        estimateLineHeights(this);
      signal(this, "refresh", this);
    }),

    swapDoc: methodOp(function(doc) {
      var old = this.doc;
      old.cm = null;
      attachDoc(this, doc);
      clearCaches(this);
      this.display.input.reset();
      this.scrollTo(doc.scrollLeft, doc.scrollTop);
      this.curOp.forceScroll = true;
      signalLater(this, "swapDoc", this, old);
      return old;
    }),

    getInputField: function(){return this.display.input.getField();},
    getWrapperElement: function(){return this.display.wrapper;},
    getScrollerElement: function(){return this.display.scroller;},
    getGutterElement: function(){return this.display.gutters;}
  };
  eventMixin(CodeMirror);

  // OPTION DEFAULTS

  // The default configuration options.
  var defaults = CodeMirror.defaults = {};
  // Functions to run when options are changed.
  var optionHandlers = CodeMirror.optionHandlers = {};

  function option(name, deflt, handle, notOnInit) {
    CodeMirror.defaults[name] = deflt;
    if (handle) optionHandlers[name] =
      notOnInit ? function(cm, val, old) {if (old != Init) handle(cm, val, old);} : handle;
  }

  // Passed to option handlers when there is no old value.
  var Init = CodeMirror.Init = {toString: function(){return "CodeMirror.Init";}};

  // These two are, on init, called from the constructor because they
  // have to be initialized before the editor can start at all.
  option("value", "", function(cm, val) {
    cm.setValue(val);
  }, true);
  option("mode", null, function(cm, val) {
    cm.doc.modeOption = val;
    loadMode(cm);
  }, true);

  option("indentUnit", 2, loadMode, true);
  option("indentWithTabs", false);
  option("smartIndent", true);
  option("tabSize", 4, function(cm) {
    resetModeState(cm);
    clearCaches(cm);
    regChange(cm);
  }, true);
  option("specialChars", /[\t\u0000-\u0019\u00ad\u200b-\u200f\u2028\u2029\ufeff]/g, function(cm, val, old) {
    cm.state.specialChars = new RegExp(val.source + (val.test("\t") ? "" : "|\t"), "g");
    if (old != CodeMirror.Init) cm.refresh();
  });
  option("specialCharPlaceholder", defaultSpecialCharPlaceholder, function(cm) {cm.refresh();}, true);
  option("electricChars", true);
  option("inputStyle", mobile ? "contenteditable" : "textarea", function() {
    throw new Error("inputStyle can not (yet) be changed in a running editor"); // FIXME
  }, true);
  option("rtlMoveVisually", !windows);
  option("wholeLineUpdateBefore", true);

  option("theme", "default", function(cm) {
    themeChanged(cm);
    guttersChanged(cm);
  }, true);
  option("keyMap", "default", function(cm, val, old) {
    var next = getKeyMap(val);
    var prev = old != CodeMirror.Init && getKeyMap(old);
    if (prev && prev.detach) prev.detach(cm, next);
    if (next.attach) next.attach(cm, prev || null);
  });
  option("extraKeys", null);

  option("lineWrapping", false, wrappingChanged, true);
  option("gutters", [], function(cm) {
    setGuttersForLineNumbers(cm.options);
    guttersChanged(cm);
  }, true);
  option("fixedGutter", true, function(cm, val) {
    cm.display.gutters.style.left = val ? compensateForHScroll(cm.display) + "px" : "0";
    cm.refresh();
  }, true);
  option("coverGutterNextToScrollbar", false, function(cm) {updateScrollbars(cm);}, true);
  option("scrollbarStyle", "native", function(cm) {
    initScrollbars(cm);
    updateScrollbars(cm);
    cm.display.scrollbars.setScrollTop(cm.doc.scrollTop);
    cm.display.scrollbars.setScrollLeft(cm.doc.scrollLeft);
  }, true);
  option("lineNumbers", false, function(cm) {
    setGuttersForLineNumbers(cm.options);
    guttersChanged(cm);
  }, true);
  option("firstLineNumber", 1, guttersChanged, true);
  option("lineNumberFormatter", function(integer) {return integer;}, guttersChanged, true);
  option("showCursorWhenSelecting", false, updateSelection, true);

  option("resetSelectionOnContextMenu", true);

  option("readOnly", false, function(cm, val) {
    if (val == "nocursor") {
      onBlur(cm);
      cm.display.input.blur();
      cm.display.disabled = true;
    } else {
      cm.display.disabled = false;
      if (!val) cm.display.input.reset();
    }
  });
  option("disableInput", false, function(cm, val) {if (!val) cm.display.input.reset();}, true);
  option("dragDrop", true);

  option("cursorBlinkRate", 530);
  option("cursorScrollMargin", 0);
  option("cursorHeight", 1, updateSelection, true);
  option("singleCursorHeightPerLine", true, updateSelection, true);
  option("workTime", 100);
  option("workDelay", 100);
  option("flattenSpans", true, resetModeState, true);
  option("addModeClass", false, resetModeState, true);
  option("pollInterval", 100);
  option("undoDepth", 200, function(cm, val){cm.doc.history.undoDepth = val;});
  option("historyEventDelay", 1250);
  option("viewportMargin", 10, function(cm){cm.refresh();}, true);
  option("maxHighlightLength", 10000, resetModeState, true);
  option("moveInputWithCursor", true, function(cm, val) {
    if (!val) cm.display.input.resetPosition();
  });

  option("tabindex", null, function(cm, val) {
    cm.display.input.getField().tabIndex = val || "";
  });
  option("autofocus", null);

  // MODE DEFINITION AND QUERYING

  // Known modes, by name and by MIME
  var modes = CodeMirror.modes = {}, mimeModes = CodeMirror.mimeModes = {};

  // Extra arguments are stored as the mode's dependencies, which is
  // used by (legacy) mechanisms like loadmode.js to automatically
  // load a mode. (Preferred mechanism is the require/define calls.)
  CodeMirror.defineMode = function(name, mode) {
    if (!CodeMirror.defaults.mode && name != "null") CodeMirror.defaults.mode = name;
    if (arguments.length > 2)
      mode.dependencies = Array.prototype.slice.call(arguments, 2);
    modes[name] = mode;
  };

  CodeMirror.defineMIME = function(mime, spec) {
    mimeModes[mime] = spec;
  };

  // Given a MIME type, a {name, ...options} config object, or a name
  // string, return a mode config object.
  CodeMirror.resolveMode = function(spec) {
    if (typeof spec == "string" && mimeModes.hasOwnProperty(spec)) {
      spec = mimeModes[spec];
    } else if (spec && typeof spec.name == "string" && mimeModes.hasOwnProperty(spec.name)) {
      var found = mimeModes[spec.name];
      if (typeof found == "string") found = {name: found};
      spec = createObj(found, spec);
      spec.name = found.name;
    } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) {
      return CodeMirror.resolveMode("application/xml");
    }
    if (typeof spec == "string") return {name: spec};
    else return spec || {name: "null"};
  };

  // Given a mode spec (anything that resolveMode accepts), find and
  // initialize an actual mode object.
  CodeMirror.getMode = function(options, spec) {
    var spec = CodeMirror.resolveMode(spec);
    var mfactory = modes[spec.name];
    if (!mfactory) return CodeMirror.getMode(options, "text/plain");
    var modeObj = mfactory(options, spec);
    if (modeExtensions.hasOwnProperty(spec.name)) {
      var exts = modeExtensions[spec.name];
      for (var prop in exts) {
        if (!exts.hasOwnProperty(prop)) continue;
        if (modeObj.hasOwnProperty(prop)) modeObj["_" + prop] = modeObj[prop];
        modeObj[prop] = exts[prop];
      }
    }
    modeObj.name = spec.name;
    if (spec.helperType) modeObj.helperType = spec.helperType;
    if (spec.modeProps) for (var prop in spec.modeProps)
      modeObj[prop] = spec.modeProps[prop];

    return modeObj;
  };

  // Minimal default mode.
  CodeMirror.defineMode("null", function() {
    return {token: function(stream) {stream.skipToEnd();}};
  });
  CodeMirror.defineMIME("text/plain", "null");

  // This can be used to attach properties to mode objects from
  // outside the actual mode definition.
  var modeExtensions = CodeMirror.modeExtensions = {};
  CodeMirror.extendMode = function(mode, properties) {
    var exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : (modeExtensions[mode] = {});
    copyObj(properties, exts);
  };

  // EXTENSIONS

  CodeMirror.defineExtension = function(name, func) {
    CodeMirror.prototype[name] = func;
  };
  CodeMirror.defineDocExtension = function(name, func) {
    Doc.prototype[name] = func;
  };
  CodeMirror.defineOption = option;

  var initHooks = [];
  CodeMirror.defineInitHook = function(f) {initHooks.push(f);};

  var helpers = CodeMirror.helpers = {};
  CodeMirror.registerHelper = function(type, name, value) {
    if (!helpers.hasOwnProperty(type)) helpers[type] = CodeMirror[type] = {_global: []};
    helpers[type][name] = value;
  };
  CodeMirror.registerGlobalHelper = function(type, name, predicate, value) {
    CodeMirror.registerHelper(type, name, value);
    helpers[type]._global.push({pred: predicate, val: value});
  };

  // MODE STATE HANDLING

  // Utility functions for working with state. Exported because nested
  // modes need to do this for their inner modes.

  var copyState = CodeMirror.copyState = function(mode, state) {
    if (state === true) return state;
    if (mode.copyState) return mode.copyState(state);
    var nstate = {};
    for (var n in state) {
      var val = state[n];
      if (val instanceof Array) val = val.concat([]);
      nstate[n] = val;
    }
    return nstate;
  };

  var startState = CodeMirror.startState = function(mode, a1, a2) {
    return mode.startState ? mode.startState(a1, a2) : true;
  };

  // Given a mode and a state (for that mode), find the inner mode and
  // state at the position that the state refers to.
  CodeMirror.innerMode = function(mode, state) {
    while (mode.innerMode) {
      var info = mode.innerMode(state);
      if (!info || info.mode == mode) break;
      state = info.state;
      mode = info.mode;
    }
    return info || {mode: mode, state: state};
  };

  // STANDARD COMMANDS

  // Commands are parameter-less actions that can be performed on an
  // editor, mostly used for keybindings.
  var commands = CodeMirror.commands = {
    selectAll: function(cm) {cm.setSelection(Pos(cm.firstLine(), 0), Pos(cm.lastLine()), sel_dontScroll);},
    singleSelection: function(cm) {
      cm.setSelection(cm.getCursor("anchor"), cm.getCursor("head"), sel_dontScroll);
    },
    killLine: function(cm) {
      deleteNearSelection(cm, function(range) {
        if (range.empty()) {
          var len = getLine(cm.doc, range.head.line).text.length;
          if (range.head.ch == len && range.head.line < cm.lastLine())
            return {from: range.head, to: Pos(range.head.line + 1, 0)};
          else
            return {from: range.head, to: Pos(range.head.line, len)};
        } else {
          return {from: range.from(), to: range.to()};
        }
      });
    },
    deleteLine: function(cm) {
      deleteNearSelection(cm, function(range) {
        return {from: Pos(range.from().line, 0),
                to: clipPos(cm.doc, Pos(range.to().line + 1, 0))};
      });
    },
    delLineLeft: function(cm) {
      deleteNearSelection(cm, function(range) {
        return {from: Pos(range.from().line, 0), to: range.from()};
      });
    },
    delWrappedLineLeft: function(cm) {
      deleteNearSelection(cm, function(range) {
        var top = cm.charCoords(range.head, "div").top + 5;
        var leftPos = cm.coordsChar({left: 0, top: top}, "div");
        return {from: leftPos, to: range.from()};
      });
    },
    delWrappedLineRight: function(cm) {
      deleteNearSelection(cm, function(range) {
        var top = cm.charCoords(range.head, "div").top + 5;
        var rightPos = cm.coordsChar({left: cm.display.lineDiv.offsetWidth + 100, top: top}, "div");
        return {from: range.from(), to: rightPos };
      });
    },
    undo: function(cm) {cm.undo();},
    redo: function(cm) {cm.redo();},
    undoSelection: function(cm) {cm.undoSelection();},
    redoSelection: function(cm) {cm.redoSelection();},
    goDocStart: function(cm) {cm.extendSelection(Pos(cm.firstLine(), 0));},
    goDocEnd: function(cm) {cm.extendSelection(Pos(cm.lastLine()));},
    goLineStart: function(cm) {
      cm.extendSelectionsBy(function(range) { return lineStart(cm, range.head.line); },
                            {origin: "+move", bias: 1});
    },
    goLineStartSmart: function(cm) {
      cm.extendSelectionsBy(function(range) {
        return lineStartSmart(cm, range.head);
      }, {origin: "+move", bias: 1});
    },
    goLineEnd: function(cm) {
      cm.extendSelectionsBy(function(range) { return lineEnd(cm, range.head.line); },
                            {origin: "+move", bias: -1});
    },
    goLineRight: function(cm) {
      cm.extendSelectionsBy(function(range) {
        var top = cm.charCoords(range.head, "div").top + 5;
        return cm.coordsChar({left: cm.display.lineDiv.offsetWidth + 100, top: top}, "div");
      }, sel_move);
    },
    goLineLeft: function(cm) {
      cm.extendSelectionsBy(function(range) {
        var top = cm.charCoords(range.head, "div").top + 5;
        return cm.coordsChar({left: 0, top: top}, "div");
      }, sel_move);
    },
    goLineLeftSmart: function(cm) {
      cm.extendSelectionsBy(function(range) {
        var top = cm.charCoords(range.head, "div").top + 5;
        var pos = cm.coordsChar({left: 0, top: top}, "div");
        if (pos.ch < cm.getLine(pos.line).search(/\S/)) return lineStartSmart(cm, range.head);
        return pos;
      }, sel_move);
    },
    goLineUp: function(cm) {cm.moveV(-1, "line");},
    goLineDown: function(cm) {cm.moveV(1, "line");},
    goPageUp: function(cm) {cm.moveV(-1, "page");},
    goPageDown: function(cm) {cm.moveV(1, "page");},
    goCharLeft: function(cm) {cm.moveH(-1, "char");},
    goCharRight: function(cm) {cm.moveH(1, "char");},
    goColumnLeft: function(cm) {cm.moveH(-1, "column");},
    goColumnRight: function(cm) {cm.moveH(1, "column");},
    goWordLeft: function(cm) {cm.moveH(-1, "word");},
    goGroupRight: function(cm) {cm.moveH(1, "group");},
    goGroupLeft: function(cm) {cm.moveH(-1, "group");},
    goWordRight: function(cm) {cm.moveH(1, "word");},
    delCharBefore: function(cm) {cm.deleteH(-1, "char");},
    delCharAfter: function(cm) {cm.deleteH(1, "char");},
    delWordBefore: function(cm) {cm.deleteH(-1, "word");},
    delWordAfter: function(cm) {cm.deleteH(1, "word");},
    delGroupBefore: function(cm) {cm.deleteH(-1, "group");},
    delGroupAfter: function(cm) {cm.deleteH(1, "group");},
    indentAuto: function(cm) {cm.indentSelection("smart");},
    indentMore: function(cm) {cm.indentSelection("add");},
    indentLess: function(cm) {cm.indentSelection("subtract");},
    insertTab: function(cm) {cm.replaceSelection("\t");},
    insertSoftTab: function(cm) {
      var spaces = [], ranges = cm.listSelections(), tabSize = cm.options.tabSize;
      for (var i = 0; i < ranges.length; i++) {
        var pos = ranges[i].from();
        var col = countColumn(cm.getLine(pos.line), pos.ch, tabSize);
        spaces.push(new Array(tabSize - col % tabSize + 1).join(" "));
      }
      cm.replaceSelections(spaces);
    },
    defaultTab: function(cm) {
      if (cm.somethingSelected()) cm.indentSelection("add");
      else cm.execCommand("insertTab");
    },
    transposeChars: function(cm) {
      runInOp(cm, function() {
        var ranges = cm.listSelections(), newSel = [];
        for (var i = 0; i < ranges.length; i++) {
          var cur = ranges[i].head, line = getLine(cm.doc, cur.line).text;
          if (line) {
            if (cur.ch == line.length) cur = new Pos(cur.line, cur.ch - 1);
            if (cur.ch > 0) {
              cur = new Pos(cur.line, cur.ch + 1);
              cm.replaceRange(line.charAt(cur.ch - 1) + line.charAt(cur.ch - 2),
                              Pos(cur.line, cur.ch - 2), cur, "+transpose");
            } else if (cur.line > cm.doc.first) {
              var prev = getLine(cm.doc, cur.line - 1).text;
              if (prev)
                cm.replaceRange(line.charAt(0) + "\n" + prev.charAt(prev.length - 1),
                                Pos(cur.line - 1, prev.length - 1), Pos(cur.line, 1), "+transpose");
            }
          }
          newSel.push(new Range(cur, cur));
        }
        cm.setSelections(newSel);
      });
    },
    newlineAndIndent: function(cm) {
      runInOp(cm, function() {
        var len = cm.listSelections().length;
        for (var i = 0; i < len; i++) {
          var range = cm.listSelections()[i];
          cm.replaceRange("\n", range.anchor, range.head, "+input");
          cm.indentLine(range.from().line + 1, null, true);
          ensureCursorVisible(cm);
        }
      });
    },
    toggleOverwrite: function(cm) {cm.toggleOverwrite();}
  };


  // STANDARD KEYMAPS

  var keyMap = CodeMirror.keyMap = {};

  keyMap.basic = {
    "Left": "goCharLeft", "Right": "goCharRight", "Up": "goLineUp", "Down": "goLineDown",
    "End": "goLineEnd", "Home": "goLineStartSmart", "PageUp": "goPageUp", "PageDown": "goPageDown",
    "Delete": "delCharAfter", "Backspace": "delCharBefore", "Shift-Backspace": "delCharBefore",
    "Tab": "defaultTab", "Shift-Tab": "indentAuto",
    "Enter": "newlineAndIndent", "Insert": "toggleOverwrite",
    "Esc": "singleSelection"
  };
  // Note that the save and find-related commands aren't defined by
  // default. User code or addons can define them. Unknown commands
  // are simply ignored.
  keyMap.pcDefault = {
    "Ctrl-A": "selectAll", "Ctrl-D": "deleteLine", "Ctrl-Z": "undo", "Shift-Ctrl-Z": "redo", "Ctrl-Y": "redo",
    "Ctrl-Home": "goDocStart", "Ctrl-End": "goDocEnd", "Ctrl-Up": "goLineUp", "Ctrl-Down": "goLineDown",
    "Ctrl-Left": "goGroupLeft", "Ctrl-Right": "goGroupRight", "Alt-Left": "goLineStart", "Alt-Right": "goLineEnd",
    "Ctrl-Backspace": "delGroupBefore", "Ctrl-Delete": "delGroupAfter", "Ctrl-S": "save", "Ctrl-F": "find",
    "Ctrl-G": "findNext", "Shift-Ctrl-G": "findPrev", "Shift-Ctrl-F": "replace", "Shift-Ctrl-R": "replaceAll",
    "Ctrl-[": "indentLess", "Ctrl-]": "indentMore",
    "Ctrl-U": "undoSelection", "Shift-Ctrl-U": "redoSelection", "Alt-U": "redoSelection",
    fallthrough: "basic"
  };
  // Very basic readline/emacs-style bindings, which are standard on Mac.
  keyMap.emacsy = {
    "Ctrl-F": "goCharRight", "Ctrl-B": "goCharLeft", "Ctrl-P": "goLineUp", "Ctrl-N": "goLineDown",
    "Alt-F": "goWordRight", "Alt-B": "goWordLeft", "Ctrl-A": "goLineStart", "Ctrl-E": "goLineEnd",
    "Ctrl-V": "goPageDown", "Shift-Ctrl-V": "goPageUp", "Ctrl-D": "delCharAfter", "Ctrl-H": "delCharBefore",
    "Alt-D": "delWordAfter", "Alt-Backspace": "delWordBefore", "Ctrl-K": "killLine", "Ctrl-T": "transposeChars"
  };
  keyMap.macDefault = {
    "Cmd-A": "selectAll", "Cmd-D": "deleteLine", "Cmd-Z": "undo", "Shift-Cmd-Z": "redo", "Cmd-Y": "redo",
    "Cmd-Home": "goDocStart", "Cmd-Up": "goDocStart", "Cmd-End": "goDocEnd", "Cmd-Down": "goDocEnd", "Alt-Left": "goGroupLeft",
    "Alt-Right": "goGroupRight", "Cmd-Left": "goLineLeft", "Cmd-Right": "goLineRight", "Alt-Backspace": "delGroupBefore",
    "Ctrl-Alt-Backspace": "delGroupAfter", "Alt-Delete": "delGroupAfter", "Cmd-S": "save", "Cmd-F": "find",
    "Cmd-G": "findNext", "Shift-Cmd-G": "findPrev", "Cmd-Alt-F": "replace", "Shift-Cmd-Alt-F": "replaceAll",
    "Cmd-[": "indentLess", "Cmd-]": "indentMore", "Cmd-Backspace": "delWrappedLineLeft", "Cmd-Delete": "delWrappedLineRight",
    "Cmd-U": "undoSelection", "Shift-Cmd-U": "redoSelection", "Ctrl-Up": "goDocStart", "Ctrl-Down": "goDocEnd",
    fallthrough: ["basic", "emacsy"]
  };
  keyMap["default"] = mac ? keyMap.macDefault : keyMap.pcDefault;

  // KEYMAP DISPATCH

  function normalizeKeyName(name) {
    var parts = name.split(/-(?!$)/), name = parts[parts.length - 1];
    var alt, ctrl, shift, cmd;
    for (var i = 0; i < parts.length - 1; i++) {
      var mod = parts[i];
      if (/^(cmd|meta|m)$/i.test(mod)) cmd = true;
      else if (/^a(lt)?$/i.test(mod)) alt = true;
      else if (/^(c|ctrl|control)$/i.test(mod)) ctrl = true;
      else if (/^s(hift)$/i.test(mod)) shift = true;
      else throw new Error("Unrecognized modifier name: " + mod);
    }
    if (alt) name = "Alt-" + name;
    if (ctrl) name = "Ctrl-" + name;
    if (cmd) name = "Cmd-" + name;
    if (shift) name = "Shift-" + name;
    return name;
  }

  // This is a kludge to keep keymaps mostly working as raw objects
  // (backwards compatibility) while at the same time support features
  // like normalization and multi-stroke key bindings. It compiles a
  // new normalized keymap, and then updates the old object to reflect
  // this.
  CodeMirror.normalizeKeyMap = function(keymap) {
    var copy = {};
    for (var keyname in keymap) if (keymap.hasOwnProperty(keyname)) {
      var value = keymap[keyname];
      if (/^(name|fallthrough|(de|at)tach)$/.test(keyname)) continue;
      if (value == "...") { delete keymap[keyname]; continue; }

      var keys = map(keyname.split(" "), normalizeKeyName);
      for (var i = 0; i < keys.length; i++) {
        var val, name;
        if (i == keys.length - 1) {
          name = keyname;
          val = value;
        } else {
          name = keys.slice(0, i + 1).join(" ");
          val = "...";
        }
        var prev = copy[name];
        if (!prev) copy[name] = val;
        else if (prev != val) throw new Error("Inconsistent bindings for " + name);
      }
      delete keymap[keyname];
    }
    for (var prop in copy) keymap[prop] = copy[prop];
    return keymap;
  };

  var lookupKey = CodeMirror.lookupKey = function(key, map, handle, context) {
    map = getKeyMap(map);
    var found = map.call ? map.call(key, context) : map[key];
    if (found === false) return "nothing";
    if (found === "...") return "multi";
    if (found != null && handle(found)) return "handled";

    if (map.fallthrough) {
      if (Object.prototype.toString.call(map.fallthrough) != "[object Array]")
        return lookupKey(key, map.fallthrough, handle, context);
      for (var i = 0; i < map.fallthrough.length; i++) {
        var result = lookupKey(key, map.fallthrough[i], handle, context);
        if (result) return result;
      }
    }
  };

  // Modifier key presses don't count as 'real' key presses for the
  // purpose of keymap fallthrough.
  var isModifierKey = CodeMirror.isModifierKey = function(value) {
    var name = typeof value == "string" ? value : keyNames[value.keyCode];
    return name == "Ctrl" || name == "Alt" || name == "Shift" || name == "Mod";
  };

  // Look up the name of a key as indicated by an event object.
  var keyName = CodeMirror.keyName = function(event, noShift) {
    if (presto && event.keyCode == 34 && event["char"]) return false;
    var base = keyNames[event.keyCode], name = base;
    if (name == null || event.altGraphKey) return false;
    if (event.altKey && base != "Alt") name = "Alt-" + name;
    if ((flipCtrlCmd ? event.metaKey : event.ctrlKey) && base != "Ctrl") name = "Ctrl-" + name;
    if ((flipCtrlCmd ? event.ctrlKey : event.metaKey) && base != "Cmd") name = "Cmd-" + name;
    if (!noShift && event.shiftKey && base != "Shift") name = "Shift-" + name;
    return name;
  };

  function getKeyMap(val) {
    return typeof val == "string" ? keyMap[val] : val;
  }

  // FROMTEXTAREA

  CodeMirror.fromTextArea = function(textarea, options) {
    options = options ? copyObj(options) : {};
    options.value = textarea.value;
    if (!options.tabindex && textarea.tabIndex)
      options.tabindex = textarea.tabIndex;
    if (!options.placeholder && textarea.placeholder)
      options.placeholder = textarea.placeholder;
    // Set autofocus to true if this textarea is focused, or if it has
    // autofocus and no other element is focused.
    if (options.autofocus == null) {
      var hasFocus = activeElt();
      options.autofocus = hasFocus == textarea ||
        textarea.getAttribute("autofocus") != null && hasFocus == document.body;
    }

    function save() {textarea.value = cm.getValue();}
    if (textarea.form) {
      on(textarea.form, "submit", save);
      // Deplorable hack to make the submit method do the right thing.
      if (!options.leaveSubmitMethodAlone) {
        var form = textarea.form, realSubmit = form.submit;
        try {
          var wrappedSubmit = form.submit = function() {
            save();
            form.submit = realSubmit;
            form.submit();
            form.submit = wrappedSubmit;
          };
        } catch(e) {}
      }
    }

    options.finishInit = function(cm) {
      cm.save = save;
      cm.getTextArea = function() { return textarea; };
      cm.toTextArea = function() {
        cm.toTextArea = isNaN; // Prevent this from being ran twice
        save();
        textarea.parentNode.removeChild(cm.getWrapperElement());
        textarea.style.display = "";
        if (textarea.form) {
          off(textarea.form, "submit", save);
          if (typeof textarea.form.submit == "function")
            textarea.form.submit = realSubmit;
        }
      };
    };

    textarea.style.display = "none";
    var cm = CodeMirror(function(node) {
      textarea.parentNode.insertBefore(node, textarea.nextSibling);
    }, options);
    return cm;
  };

  // STRING STREAM

  // Fed to the mode parsers, provides helper functions to make
  // parsers more succinct.

  var StringStream = CodeMirror.StringStream = function(string, tabSize) {
    this.pos = this.start = 0;
    this.string = string;
    this.tabSize = tabSize || 8;
    this.lastColumnPos = this.lastColumnValue = 0;
    this.lineStart = 0;
  };

  StringStream.prototype = {
    eol: function() {return this.pos >= this.string.length;},
    sol: function() {return this.pos == this.lineStart;},
    peek: function() {return this.string.charAt(this.pos) || undefined;},
    next: function() {
      if (this.pos < this.string.length)
        return this.string.charAt(this.pos++);
    },
    eat: function(match) {
      var ch = this.string.charAt(this.pos);
      if (typeof match == "string") var ok = ch == match;
      else var ok = ch && (match.test ? match.test(ch) : match(ch));
      if (ok) {++this.pos; return ch;}
    },
    eatWhile: function(match) {
      var start = this.pos;
      while (this.eat(match)){}
      return this.pos > start;
    },
    eatSpace: function() {
      var start = this.pos;
      while (/[\s\u00a0]/.test(this.string.charAt(this.pos))) ++this.pos;
      return this.pos > start;
    },
    skipToEnd: function() {this.pos = this.string.length;},
    skipTo: function(ch) {
      var found = this.string.indexOf(ch, this.pos);
      if (found > -1) {this.pos = found; return true;}
    },
    backUp: function(n) {this.pos -= n;},
    column: function() {
      if (this.lastColumnPos < this.start) {
        this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
        this.lastColumnPos = this.start;
      }
      return this.lastColumnValue - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
    },
    indentation: function() {
      return countColumn(this.string, null, this.tabSize) -
        (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
    },
    match: function(pattern, consume, caseInsensitive) {
      if (typeof pattern == "string") {
        var cased = function(str) {return caseInsensitive ? str.toLowerCase() : str;};
        var substr = this.string.substr(this.pos, pattern.length);
        if (cased(substr) == cased(pattern)) {
          if (consume !== false) this.pos += pattern.length;
          return true;
        }
      } else {
        var match = this.string.slice(this.pos).match(pattern);
        if (match && match.index > 0) return null;
        if (match && consume !== false) this.pos += match[0].length;
        return match;
      }
    },
    current: function(){return this.string.slice(this.start, this.pos);},
    hideFirstChars: function(n, inner) {
      this.lineStart += n;
      try { return inner(); }
      finally { this.lineStart -= n; }
    }
  };

  // TEXTMARKERS

  // Created with markText and setBookmark methods. A TextMarker is a
  // handle that can be used to clear or find a marked position in the
  // document. Line objects hold arrays (markedSpans) containing
  // {from, to, marker} object pointing to such marker objects, and
  // indicating that such a marker is present on that line. Multiple
  // lines may point to the same marker when it spans across lines.
  // The spans will have null for their from/to properties when the
  // marker continues beyond the start/end of the line. Markers have
  // links back to the lines they currently touch.

  var nextMarkerId = 0;

  var TextMarker = CodeMirror.TextMarker = function(doc, type) {
    this.lines = [];
    this.type = type;
    this.doc = doc;
    this.id = ++nextMarkerId;
  };
  eventMixin(TextMarker);

  // Clear the marker.
  TextMarker.prototype.clear = function() {
    if (this.explicitlyCleared) return;
    var cm = this.doc.cm, withOp = cm && !cm.curOp;
    if (withOp) startOperation(cm);
    if (hasHandler(this, "clear")) {
      var found = this.find();
      if (found) signalLater(this, "clear", found.from, found.to);
    }
    var min = null, max = null;
    for (var i = 0; i < this.lines.length; ++i) {
      var line = this.lines[i];
      var span = getMarkedSpanFor(line.markedSpans, this);
      if (cm && !this.collapsed) regLineChange(cm, lineNo(line), "text");
      else if (cm) {
        if (span.to != null) max = lineNo(line);
        if (span.from != null) min = lineNo(line);
      }
      line.markedSpans = removeMarkedSpan(line.markedSpans, span);
      if (span.from == null && this.collapsed && !lineIsHidden(this.doc, line) && cm)
        updateLineHeight(line, textHeight(cm.display));
    }
    if (cm && this.collapsed && !cm.options.lineWrapping) for (var i = 0; i < this.lines.length; ++i) {
      var visual = visualLine(this.lines[i]), len = lineLength(visual);
      if (len > cm.display.maxLineLength) {
        cm.display.maxLine = visual;
        cm.display.maxLineLength = len;
        cm.display.maxLineChanged = true;
      }
    }

    if (min != null && cm && this.collapsed) regChange(cm, min, max + 1);
    this.lines.length = 0;
    this.explicitlyCleared = true;
    if (this.atomic && this.doc.cantEdit) {
      this.doc.cantEdit = false;
      if (cm) reCheckSelection(cm.doc);
    }
    if (cm) signalLater(cm, "markerCleared", cm, this);
    if (withOp) endOperation(cm);
    if (this.parent) this.parent.clear();
  };

  // Find the position of the marker in the document. Returns a {from,
  // to} object by default. Side can be passed to get a specific side
  // -- 0 (both), -1 (left), or 1 (right). When lineObj is true, the
  // Pos objects returned contain a line object, rather than a line
  // number (used to prevent looking up the same line twice).
  TextMarker.prototype.find = function(side, lineObj) {
    if (side == null && this.type == "bookmark") side = 1;
    var from, to;
    for (var i = 0; i < this.lines.length; ++i) {
      var line = this.lines[i];
      var span = getMarkedSpanFor(line.markedSpans, this);
      if (span.from != null) {
        from = Pos(lineObj ? line : lineNo(line), span.from);
        if (side == -1) return from;
      }
      if (span.to != null) {
        to = Pos(lineObj ? line : lineNo(line), span.to);
        if (side == 1) return to;
      }
    }
    return from && {from: from, to: to};
  };

  // Signals that the marker's widget changed, and surrounding layout
  // should be recomputed.
  TextMarker.prototype.changed = function() {
    var pos = this.find(-1, true), widget = this, cm = this.doc.cm;
    if (!pos || !cm) return;
    runInOp(cm, function() {
      var line = pos.line, lineN = lineNo(pos.line);
      var view = findViewForLine(cm, lineN);
      if (view) {
        clearLineMeasurementCacheFor(view);
        cm.curOp.selectionChanged = cm.curOp.forceUpdate = true;
      }
      cm.curOp.updateMaxLine = true;
      if (!lineIsHidden(widget.doc, line) && widget.height != null) {
        var oldHeight = widget.height;
        widget.height = null;
        var dHeight = widgetHeight(widget) - oldHeight;
        if (dHeight)
          updateLineHeight(line, line.height + dHeight);
      }
    });
  };

  TextMarker.prototype.attachLine = function(line) {
    if (!this.lines.length && this.doc.cm) {
      var op = this.doc.cm.curOp;
      if (!op.maybeHiddenMarkers || indexOf(op.maybeHiddenMarkers, this) == -1)
        (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);
    }
    this.lines.push(line);
  };
  TextMarker.prototype.detachLine = function(line) {
    this.lines.splice(indexOf(this.lines, line), 1);
    if (!this.lines.length && this.doc.cm) {
      var op = this.doc.cm.curOp;
      (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
    }
  };

  // Collapsed markers have unique ids, in order to be able to order
  // them, which is needed for uniquely determining an outer marker
  // when they overlap (they may nest, but not partially overlap).
  var nextMarkerId = 0;

  // Create a marker, wire it up to the right lines, and
  function markText(doc, from, to, options, type) {
    // Shared markers (across linked documents) are handled separately
    // (markTextShared will call out to this again, once per
    // document).
    if (options && options.shared) return markTextShared(doc, from, to, options, type);
    // Ensure we are in an operation.
    if (doc.cm && !doc.cm.curOp) return operation(doc.cm, markText)(doc, from, to, options, type);

    var marker = new TextMarker(doc, type), diff = cmp(from, to);
    if (options) copyObj(options, marker, false);
    // Don't connect empty markers unless clearWhenEmpty is false
    if (diff > 0 || diff == 0 && marker.clearWhenEmpty !== false)
      return marker;
    if (marker.replacedWith) {
      // Showing up as a widget implies collapsed (widget replaces text)
      marker.collapsed = true;
      marker.widgetNode = elt("span", [marker.replacedWith], "CodeMirror-widget");
      if (!options.handleMouseEvents) marker.widgetNode.setAttribute("cm-ignore-events", "true");
      if (options.insertLeft) marker.widgetNode.insertLeft = true;
    }
    if (marker.collapsed) {
      if (conflictingCollapsedRange(doc, from.line, from, to, marker) ||
          from.line != to.line && conflictingCollapsedRange(doc, to.line, from, to, marker))
        throw new Error("Inserting collapsed marker partially overlapping an existing one");
      sawCollapsedSpans = true;
    }

    if (marker.addToHistory)
      addChangeToHistory(doc, {from: from, to: to, origin: "markText"}, doc.sel, NaN);

    var curLine = from.line, cm = doc.cm, updateMaxLine;
    doc.iter(curLine, to.line + 1, function(line) {
      if (cm && marker.collapsed && !cm.options.lineWrapping && visualLine(line) == cm.display.maxLine)
        updateMaxLine = true;
      if (marker.collapsed && curLine != from.line) updateLineHeight(line, 0);
      addMarkedSpan(line, new MarkedSpan(marker,
                                         curLine == from.line ? from.ch : null,
                                         curLine == to.line ? to.ch : null));
      ++curLine;
    });
    // lineIsHidden depends on the presence of the spans, so needs a second pass
    if (marker.collapsed) doc.iter(from.line, to.line + 1, function(line) {
      if (lineIsHidden(doc, line)) updateLineHeight(line, 0);
    });

    if (marker.clearOnEnter) on(marker, "beforeCursorEnter", function() { marker.clear(); });

    if (marker.readOnly) {
      sawReadOnlySpans = true;
      if (doc.history.done.length || doc.history.undone.length)
        doc.clearHistory();
    }
    if (marker.collapsed) {
      marker.id = ++nextMarkerId;
      marker.atomic = true;
    }
    if (cm) {
      // Sync editor state
      if (updateMaxLine) cm.curOp.updateMaxLine = true;
      if (marker.collapsed)
        regChange(cm, from.line, to.line + 1);
      else if (marker.className || marker.title || marker.startStyle || marker.endStyle || marker.css)
        for (var i = from.line; i <= to.line; i++) regLineChange(cm, i, "text");
      if (marker.atomic) reCheckSelection(cm.doc);
      signalLater(cm, "markerAdded", cm, marker);
    }
    return marker;
  }

  // SHARED TEXTMARKERS

  // A shared marker spans multiple linked documents. It is
  // implemented as a meta-marker-object controlling multiple normal
  // markers.
  var SharedTextMarker = CodeMirror.SharedTextMarker = function(markers, primary) {
    this.markers = markers;
    this.primary = primary;
    for (var i = 0; i < markers.length; ++i)
      markers[i].parent = this;
  };
  eventMixin(SharedTextMarker);

  SharedTextMarker.prototype.clear = function() {
    if (this.explicitlyCleared) return;
    this.explicitlyCleared = true;
    for (var i = 0; i < this.markers.length; ++i)
      this.markers[i].clear();
    signalLater(this, "clear");
  };
  SharedTextMarker.prototype.find = function(side, lineObj) {
    return this.primary.find(side, lineObj);
  };

  function markTextShared(doc, from, to, options, type) {
    options = copyObj(options);
    options.shared = false;
    var markers = [markText(doc, from, to, options, type)], primary = markers[0];
    var widget = options.widgetNode;
    linkedDocs(doc, function(doc) {
      if (widget) options.widgetNode = widget.cloneNode(true);
      markers.push(markText(doc, clipPos(doc, from), clipPos(doc, to), options, type));
      for (var i = 0; i < doc.linked.length; ++i)
        if (doc.linked[i].isParent) return;
      primary = lst(markers);
    });
    return new SharedTextMarker(markers, primary);
  }

  function findSharedMarkers(doc) {
    return doc.findMarks(Pos(doc.first, 0), doc.clipPos(Pos(doc.lastLine())),
                         function(m) { return m.parent; });
  }

  function copySharedMarkers(doc, markers) {
    for (var i = 0; i < markers.length; i++) {
      var marker = markers[i], pos = marker.find();
      var mFrom = doc.clipPos(pos.from), mTo = doc.clipPos(pos.to);
      if (cmp(mFrom, mTo)) {
        var subMark = markText(doc, mFrom, mTo, marker.primary, marker.primary.type);
        marker.markers.push(subMark);
        subMark.parent = marker;
      }
    }
  }

  function detachSharedMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
      var marker = markers[i], linked = [marker.primary.doc];;
      linkedDocs(marker.primary.doc, function(d) { linked.push(d); });
      for (var j = 0; j < marker.markers.length; j++) {
        var subMarker = marker.markers[j];
        if (indexOf(linked, subMarker.doc) == -1) {
          subMarker.parent = null;
          marker.markers.splice(j--, 1);
        }
      }
    }
  }

  // TEXTMARKER SPANS

  function MarkedSpan(marker, from, to) {
    this.marker = marker;
    this.from = from; this.to = to;
  }

  // Search an array of spans for a span matching the given marker.
  function getMarkedSpanFor(spans, marker) {
    if (spans) for (var i = 0; i < spans.length; ++i) {
      var span = spans[i];
      if (span.marker == marker) return span;
    }
  }
  // Remove a span from an array, returning undefined if no spans are
  // left (we don't store arrays for lines without spans).
  function removeMarkedSpan(spans, span) {
    for (var r, i = 0; i < spans.length; ++i)
      if (spans[i] != span) (r || (r = [])).push(spans[i]);
    return r;
  }
  // Add a span to a line.
  function addMarkedSpan(line, span) {
    line.markedSpans = line.markedSpans ? line.markedSpans.concat([span]) : [span];
    span.marker.attachLine(line);
  }

  // Used for the algorithm that adjusts markers for a change in the
  // document. These functions cut an array of spans at a given
  // character position, returning an array of remaining chunks (or
  // undefined if nothing remains).
  function markedSpansBefore(old, startCh, isInsert) {
    if (old) for (var i = 0, nw; i < old.length; ++i) {
      var span = old[i], marker = span.marker;
      var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);
      if (startsBefore || span.from == startCh && marker.type == "bookmark" && (!isInsert || !span.marker.insertLeft)) {
        var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);
        (nw || (nw = [])).push(new MarkedSpan(marker, span.from, endsAfter ? null : span.to));
      }
    }
    return nw;
  }
  function markedSpansAfter(old, endCh, isInsert) {
    if (old) for (var i = 0, nw; i < old.length; ++i) {
      var span = old[i], marker = span.marker;
      var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);
      if (endsAfter || span.from == endCh && marker.type == "bookmark" && (!isInsert || span.marker.insertLeft)) {
        var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);
        (nw || (nw = [])).push(new MarkedSpan(marker, startsBefore ? null : span.from - endCh,
                                              span.to == null ? null : span.to - endCh));
      }
    }
    return nw;
  }

  // Given a change object, compute the new set of marker spans that
  // cover the line in which the change took place. Removes spans
  // entirely within the change, reconnects spans belonging to the
  // same marker that appear on both sides of the change, and cuts off
  // spans partially within the change. Returns an array of span
  // arrays with one element for each line in (after) the change.
  function stretchSpansOverChange(doc, change) {
    if (change.full) return null;
    var oldFirst = isLine(doc, change.from.line) && getLine(doc, change.from.line).markedSpans;
    var oldLast = isLine(doc, change.to.line) && getLine(doc, change.to.line).markedSpans;
    if (!oldFirst && !oldLast) return null;

    var startCh = change.from.ch, endCh = change.to.ch, isInsert = cmp(change.from, change.to) == 0;
    // Get the spans that 'stick out' on both sides
    var first = markedSpansBefore(oldFirst, startCh, isInsert);
    var last = markedSpansAfter(oldLast, endCh, isInsert);

    // Next, merge those two ends
    var sameLine = change.text.length == 1, offset = lst(change.text).length + (sameLine ? startCh : 0);
    if (first) {
      // Fix up .to properties of first
      for (var i = 0; i < first.length; ++i) {
        var span = first[i];
        if (span.to == null) {
          var found = getMarkedSpanFor(last, span.marker);
          if (!found) span.to = startCh;
          else if (sameLine) span.to = found.to == null ? null : found.to + offset;
        }
      }
    }
    if (last) {
      // Fix up .from in last (or move them into first in case of sameLine)
      for (var i = 0; i < last.length; ++i) {
        var span = last[i];
        if (span.to != null) span.to += offset;
        if (span.from == null) {
          var found = getMarkedSpanFor(first, span.marker);
          if (!found) {
            span.from = offset;
            if (sameLine) (first || (first = [])).push(span);
          }
        } else {
          span.from += offset;
          if (sameLine) (first || (first = [])).push(span);
        }
      }
    }
    // Make sure we didn't create any zero-length spans
    if (first) first = clearEmptySpans(first);
    if (last && last != first) last = clearEmptySpans(last);

    var newMarkers = [first];
    if (!sameLine) {
      // Fill gap with whole-line-spans
      var gap = change.text.length - 2, gapMarkers;
      if (gap > 0 && first)
        for (var i = 0; i < first.length; ++i)
          if (first[i].to == null)
            (gapMarkers || (gapMarkers = [])).push(new MarkedSpan(first[i].marker, null, null));
      for (var i = 0; i < gap; ++i)
        newMarkers.push(gapMarkers);
      newMarkers.push(last);
    }
    return newMarkers;
  }

  // Remove spans that are empty and don't have a clearWhenEmpty
  // option of false.
  function clearEmptySpans(spans) {
    for (var i = 0; i < spans.length; ++i) {
      var span = spans[i];
      if (span.from != null && span.from == span.to && span.marker.clearWhenEmpty !== false)
        spans.splice(i--, 1);
    }
    if (!spans.length) return null;
    return spans;
  }

  // Used for un/re-doing changes from the history. Combines the
  // result of computing the existing spans with the set of spans that
  // existed in the history (so that deleting around a span and then
  // undoing brings back the span).
  function mergeOldSpans(doc, change) {
    var old = getOldSpans(doc, change);
    var stretched = stretchSpansOverChange(doc, change);
    if (!old) return stretched;
    if (!stretched) return old;

    for (var i = 0; i < old.length; ++i) {
      var oldCur = old[i], stretchCur = stretched[i];
      if (oldCur && stretchCur) {
        spans: for (var j = 0; j < stretchCur.length; ++j) {
          var span = stretchCur[j];
          for (var k = 0; k < oldCur.length; ++k)
            if (oldCur[k].marker == span.marker) continue spans;
          oldCur.push(span);
        }
      } else if (stretchCur) {
        old[i] = stretchCur;
      }
    }
    return old;
  }

  // Used to 'clip' out readOnly ranges when making a change.
  function removeReadOnlyRanges(doc, from, to) {
    var markers = null;
    doc.iter(from.line, to.line + 1, function(line) {
      if (line.markedSpans) for (var i = 0; i < line.markedSpans.length; ++i) {
        var mark = line.markedSpans[i].marker;
        if (mark.readOnly && (!markers || indexOf(markers, mark) == -1))
          (markers || (markers = [])).push(mark);
      }
    });
    if (!markers) return null;
    var parts = [{from: from, to: to}];
    for (var i = 0; i < markers.length; ++i) {
      var mk = markers[i], m = mk.find(0);
      for (var j = 0; j < parts.length; ++j) {
        var p = parts[j];
        if (cmp(p.to, m.from) < 0 || cmp(p.from, m.to) > 0) continue;
        var newParts = [j, 1], dfrom = cmp(p.from, m.from), dto = cmp(p.to, m.to);
        if (dfrom < 0 || !mk.inclusiveLeft && !dfrom)
          newParts.push({from: p.from, to: m.from});
        if (dto > 0 || !mk.inclusiveRight && !dto)
          newParts.push({from: m.to, to: p.to});
        parts.splice.apply(parts, newParts);
        j += newParts.length - 1;
      }
    }
    return parts;
  }

  // Connect or disconnect spans from a line.
  function detachMarkedSpans(line) {
    var spans = line.markedSpans;
    if (!spans) return;
    for (var i = 0; i < spans.length; ++i)
      spans[i].marker.detachLine(line);
    line.markedSpans = null;
  }
  function attachMarkedSpans(line, spans) {
    if (!spans) return;
    for (var i = 0; i < spans.length; ++i)
      spans[i].marker.attachLine(line);
    line.markedSpans = spans;
  }

  // Helpers used when computing which overlapping collapsed span
  // counts as the larger one.
  function extraLeft(marker) { return marker.inclusiveLeft ? -1 : 0; }
  function extraRight(marker) { return marker.inclusiveRight ? 1 : 0; }

  // Returns a number indicating which of two overlapping collapsed
  // spans is larger (and thus includes the other). Falls back to
  // comparing ids when the spans cover exactly the same range.
  function compareCollapsedMarkers(a, b) {
    var lenDiff = a.lines.length - b.lines.length;
    if (lenDiff != 0) return lenDiff;
    var aPos = a.find(), bPos = b.find();
    var fromCmp = cmp(aPos.from, bPos.from) || extraLeft(a) - extraLeft(b);
    if (fromCmp) return -fromCmp;
    var toCmp = cmp(aPos.to, bPos.to) || extraRight(a) - extraRight(b);
    if (toCmp) return toCmp;
    return b.id - a.id;
  }

  // Find out whether a line ends or starts in a collapsed span. If
  // so, return the marker for that span.
  function collapsedSpanAtSide(line, start) {
    var sps = sawCollapsedSpans && line.markedSpans, found;
    if (sps) for (var sp, i = 0; i < sps.length; ++i) {
      sp = sps[i];
      if (sp.marker.collapsed && (start ? sp.from : sp.to) == null &&
          (!found || compareCollapsedMarkers(found, sp.marker) < 0))
        found = sp.marker;
    }
    return found;
  }
  function collapsedSpanAtStart(line) { return collapsedSpanAtSide(line, true); }
  function collapsedSpanAtEnd(line) { return collapsedSpanAtSide(line, false); }

  // Test whether there exists a collapsed span that partially
  // overlaps (covers the start or end, but not both) of a new span.
  // Such overlap is not allowed.
  function conflictingCollapsedRange(doc, lineNo, from, to, marker) {
    var line = getLine(doc, lineNo);
    var sps = sawCollapsedSpans && line.markedSpans;
    if (sps) for (var i = 0; i < sps.length; ++i) {
      var sp = sps[i];
      if (!sp.marker.collapsed) continue;
      var found = sp.marker.find(0);
      var fromCmp = cmp(found.from, from) || extraLeft(sp.marker) - extraLeft(marker);
      var toCmp = cmp(found.to, to) || extraRight(sp.marker) - extraRight(marker);
      if (fromCmp >= 0 && toCmp <= 0 || fromCmp <= 0 && toCmp >= 0) continue;
      if (fromCmp <= 0 && (cmp(found.to, from) > 0 || (sp.marker.inclusiveRight && marker.inclusiveLeft)) ||
          fromCmp >= 0 && (cmp(found.from, to) < 0 || (sp.marker.inclusiveLeft && marker.inclusiveRight)))
        return true;
    }
  }

  // A visual line is a line as drawn on the screen. Folding, for
  // example, can cause multiple logical lines to appear on the same
  // visual line. This finds the start of the visual line that the
  // given line is part of (usually that is the line itself).
  function visualLine(line) {
    var merged;
    while (merged = collapsedSpanAtStart(line))
      line = merged.find(-1, true).line;
    return line;
  }

  // Returns an array of logical lines that continue the visual line
  // started by the argument, or undefined if there are no such lines.
  function visualLineContinued(line) {
    var merged, lines;
    while (merged = collapsedSpanAtEnd(line)) {
      line = merged.find(1, true).line;
      (lines || (lines = [])).push(line);
    }
    return lines;
  }

  // Get the line number of the start of the visual line that the
  // given line number is part of.
  function visualLineNo(doc, lineN) {
    var line = getLine(doc, lineN), vis = visualLine(line);
    if (line == vis) return lineN;
    return lineNo(vis);
  }
  // Get the line number of the start of the next visual line after
  // the given line.
  function visualLineEndNo(doc, lineN) {
    if (lineN > doc.lastLine()) return lineN;
    var line = getLine(doc, lineN), merged;
    if (!lineIsHidden(doc, line)) return lineN;
    while (merged = collapsedSpanAtEnd(line))
      line = merged.find(1, true).line;
    return lineNo(line) + 1;
  }

  // Compute whether a line is hidden. Lines count as hidden when they
  // are part of a visual line that starts with another line, or when
  // they are entirely covered by collapsed, non-widget span.
  function lineIsHidden(doc, line) {
    var sps = sawCollapsedSpans && line.markedSpans;
    if (sps) for (var sp, i = 0; i < sps.length; ++i) {
      sp = sps[i];
      if (!sp.marker.collapsed) continue;
      if (sp.from == null) return true;
      if (sp.marker.widgetNode) continue;
      if (sp.from == 0 && sp.marker.inclusiveLeft && lineIsHiddenInner(doc, line, sp))
        return true;
    }
  }
  function lineIsHiddenInner(doc, line, span) {
    if (span.to == null) {
      var end = span.marker.find(1, true);
      return lineIsHiddenInner(doc, end.line, getMarkedSpanFor(end.line.markedSpans, span.marker));
    }
    if (span.marker.inclusiveRight && span.to == line.text.length)
      return true;
    for (var sp, i = 0; i < line.markedSpans.length; ++i) {
      sp = line.markedSpans[i];
      if (sp.marker.collapsed && !sp.marker.widgetNode && sp.from == span.to &&
          (sp.to == null || sp.to != span.from) &&
          (sp.marker.inclusiveLeft || span.marker.inclusiveRight) &&
          lineIsHiddenInner(doc, line, sp)) return true;
    }
  }

  // LINE WIDGETS

  // Line widgets are block elements displayed above or below a line.

  var LineWidget = CodeMirror.LineWidget = function(doc, node, options) {
    if (options) for (var opt in options) if (options.hasOwnProperty(opt))
      this[opt] = options[opt];
    this.doc = doc;
    this.node = node;
  };
  eventMixin(LineWidget);

  function adjustScrollWhenAboveVisible(cm, line, diff) {
    if (heightAtLine(line) < ((cm.curOp && cm.curOp.scrollTop) || cm.doc.scrollTop))
      addToScrollPos(cm, null, diff);
  }

  LineWidget.prototype.clear = function() {
    var cm = this.doc.cm, ws = this.line.widgets, line = this.line, no = lineNo(line);
    if (no == null || !ws) return;
    for (var i = 0; i < ws.length; ++i) if (ws[i] == this) ws.splice(i--, 1);
    if (!ws.length) line.widgets = null;
    var height = widgetHeight(this);
    updateLineHeight(line, Math.max(0, line.height - height));
    if (cm) runInOp(cm, function() {
      adjustScrollWhenAboveVisible(cm, line, -height);
      regLineChange(cm, no, "widget");
    });
  };
  LineWidget.prototype.changed = function() {
    var oldH = this.height, cm = this.doc.cm, line = this.line;
    this.height = null;
    var diff = widgetHeight(this) - oldH;
    if (!diff) return;
    updateLineHeight(line, line.height + diff);
    if (cm) runInOp(cm, function() {
      cm.curOp.forceUpdate = true;
      adjustScrollWhenAboveVisible(cm, line, diff);
    });
  };

  function widgetHeight(widget) {
    if (widget.height != null) return widget.height;
    var cm = widget.doc.cm;
    if (!cm) return 0;
    if (!contains(document.body, widget.node)) {
      var parentStyle = "position: relative;";
      if (widget.coverGutter)
        parentStyle += "margin-left: -" + cm.display.gutters.offsetWidth + "px;";
      if (widget.noHScroll)
        parentStyle += "width: " + cm.display.wrapper.clientWidth + "px;";
      removeChildrenAndAdd(cm.display.measure, elt("div", [widget.node], null, parentStyle));
    }
    return widget.height = widget.node.offsetHeight;
  }

  function addLineWidget(doc, handle, node, options) {
    var widget = new LineWidget(doc, node, options);
    var cm = doc.cm;
    if (cm && widget.noHScroll) cm.display.alignWidgets = true;
    changeLine(doc, handle, "widget", function(line) {
      var widgets = line.widgets || (line.widgets = []);
      if (widget.insertAt == null) widgets.push(widget);
      else widgets.splice(Math.min(widgets.length - 1, Math.max(0, widget.insertAt)), 0, widget);
      widget.line = line;
      if (cm && !lineIsHidden(doc, line)) {
        var aboveVisible = heightAtLine(line) < doc.scrollTop;
        updateLineHeight(line, line.height + widgetHeight(widget));
        if (aboveVisible) addToScrollPos(cm, null, widget.height);
        cm.curOp.forceUpdate = true;
      }
      return true;
    });
    return widget;
  }

  // LINE DATA STRUCTURE

  // Line objects. These hold state related to a line, including
  // highlighting info (the styles array).
  var Line = CodeMirror.Line = function(text, markedSpans, estimateHeight) {
    this.text = text;
    attachMarkedSpans(this, markedSpans);
    this.height = estimateHeight ? estimateHeight(this) : 1;
  };
  eventMixin(Line);
  Line.prototype.lineNo = function() { return lineNo(this); };

  // Change the content (text, markers) of a line. Automatically
  // invalidates cached information and tries to re-estimate the
  // line's height.
  function updateLine(line, text, markedSpans, estimateHeight) {
    line.text = text;
    if (line.stateAfter) line.stateAfter = null;
    if (line.styles) line.styles = null;
    if (line.order != null) line.order = null;
    detachMarkedSpans(line);
    attachMarkedSpans(line, markedSpans);
    var estHeight = estimateHeight ? estimateHeight(line) : 1;
    if (estHeight != line.height) updateLineHeight(line, estHeight);
  }

  // Detach a line from the document tree and its markers.
  function cleanUpLine(line) {
    line.parent = null;
    detachMarkedSpans(line);
  }

  function extractLineClasses(type, output) {
    if (type) for (;;) {
      var lineClass = type.match(/(?:^|\s+)line-(background-)?(\S+)/);
      if (!lineClass) break;
      type = type.slice(0, lineClass.index) + type.slice(lineClass.index + lineClass[0].length);
      var prop = lineClass[1] ? "bgClass" : "textClass";
      if (output[prop] == null)
        output[prop] = lineClass[2];
      else if (!(new RegExp("(?:^|\s)" + lineClass[2] + "(?:$|\s)")).test(output[prop]))
        output[prop] += " " + lineClass[2];
    }
    return type;
  }

  function callBlankLine(mode, state) {
    if (mode.blankLine) return mode.blankLine(state);
    if (!mode.innerMode) return;
    var inner = CodeMirror.innerMode(mode, state);
    if (inner.mode.blankLine) return inner.mode.blankLine(inner.state);
  }

  function readToken(mode, stream, state, inner) {
    for (var i = 0; i < 10; i++) {
      if (inner) inner[0] = CodeMirror.innerMode(mode, state).mode;
      var style = mode.token(stream, state);
      if (stream.pos > stream.start) return style;
    }
    throw new Error("Mode " + mode.name + " failed to advance stream.");
  }

  // Utility for getTokenAt and getLineTokens
  function takeToken(cm, pos, precise, asArray) {
    function getObj(copy) {
      return {start: stream.start, end: stream.pos,
              string: stream.current(),
              type: style || null,
              state: copy ? copyState(doc.mode, state) : state};
    }

    var doc = cm.doc, mode = doc.mode, style;
    pos = clipPos(doc, pos);
    var line = getLine(doc, pos.line), state = getStateBefore(cm, pos.line, precise);
    var stream = new StringStream(line.text, cm.options.tabSize), tokens;
    if (asArray) tokens = [];
    while ((asArray || stream.pos < pos.ch) && !stream.eol()) {
      stream.start = stream.pos;
      style = readToken(mode, stream, state);
      if (asArray) tokens.push(getObj(true));
    }
    return asArray ? tokens : getObj();
  }

  // Run the given mode's parser over a line, calling f for each token.
  function runMode(cm, text, mode, state, f, lineClasses, forceToEnd) {
    var flattenSpans = mode.flattenSpans;
    if (flattenSpans == null) flattenSpans = cm.options.flattenSpans;
    var curStart = 0, curStyle = null;
    var stream = new StringStream(text, cm.options.tabSize), style;
    var inner = cm.options.addModeClass && [null];
    if (text == "") extractLineClasses(callBlankLine(mode, state), lineClasses);
    while (!stream.eol()) {
      if (stream.pos > cm.options.maxHighlightLength) {
        flattenSpans = false;
        if (forceToEnd) processLine(cm, text, state, stream.pos);
        stream.pos = text.length;
        style = null;
      } else {
        style = extractLineClasses(readToken(mode, stream, state, inner), lineClasses);
      }
      if (inner) {
        var mName = inner[0].name;
        if (mName) style = "m-" + (style ? mName + " " + style : mName);
      }
      if (!flattenSpans || curStyle != style) {
        while (curStart < stream.start) {
          curStart = Math.min(stream.start, curStart + 50000);
          f(curStart, curStyle);
        }
        curStyle = style;
      }
      stream.start = stream.pos;
    }
    while (curStart < stream.pos) {
      // Webkit seems to refuse to render text nodes longer than 57444 characters
      var pos = Math.min(stream.pos, curStart + 50000);
      f(pos, curStyle);
      curStart = pos;
    }
  }

  // Compute a style array (an array starting with a mode generation
  // -- for invalidation -- followed by pairs of end positions and
  // style strings), which is used to highlight the tokens on the
  // line.
  function highlightLine(cm, line, state, forceToEnd) {
    // A styles array always starts with a number identifying the
    // mode/overlays that it is based on (for easy invalidation).
    var st = [cm.state.modeGen], lineClasses = {};
    // Compute the base array of styles
    runMode(cm, line.text, cm.doc.mode, state, function(end, style) {
      st.push(end, style);
    }, lineClasses, forceToEnd);

    // Run overlays, adjust style array.
    for (var o = 0; o < cm.state.overlays.length; ++o) {
      var overlay = cm.state.overlays[o], i = 1, at = 0;
      runMode(cm, line.text, overlay.mode, true, function(end, style) {
        var start = i;
        // Ensure there's a token end at the current position, and that i points at it
        while (at < end) {
          var i_end = st[i];
          if (i_end > end)
            st.splice(i, 1, end, st[i+1], i_end);
          i += 2;
          at = Math.min(end, i_end);
        }
        if (!style) return;
        if (overlay.opaque) {
          st.splice(start, i - start, end, "cm-overlay " + style);
          i = start + 2;
        } else {
          for (; start < i; start += 2) {
            var cur = st[start+1];
            st[start+1] = (cur ? cur + " " : "") + "cm-overlay " + style;
          }
        }
      }, lineClasses);
    }

    return {styles: st, classes: lineClasses.bgClass || lineClasses.textClass ? lineClasses : null};
  }

  function getLineStyles(cm, line, updateFrontier) {
    if (!line.styles || line.styles[0] != cm.state.modeGen) {
      var result = highlightLine(cm, line, line.stateAfter = getStateBefore(cm, lineNo(line)));
      line.styles = result.styles;
      if (result.classes) line.styleClasses = result.classes;
      else if (line.styleClasses) line.styleClasses = null;
      if (updateFrontier === cm.doc.frontier) cm.doc.frontier++;
    }
    return line.styles;
  }

  // Lightweight form of highlight -- proceed over this line and
  // update state, but don't save a style array. Used for lines that
  // aren't currently visible.
  function processLine(cm, text, state, startAt) {
    var mode = cm.doc.mode;
    var stream = new StringStream(text, cm.options.tabSize);
    stream.start = stream.pos = startAt || 0;
    if (text == "") callBlankLine(mode, state);
    while (!stream.eol() && stream.pos <= cm.options.maxHighlightLength) {
      readToken(mode, stream, state);
      stream.start = stream.pos;
    }
  }

  // Convert a style as returned by a mode (either null, or a string
  // containing one or more styles) to a CSS style. This is cached,
  // and also looks for line-wide styles.
  var styleToClassCache = {}, styleToClassCacheWithMode = {};
  function interpretTokenStyle(style, options) {
    if (!style || /^\s*$/.test(style)) return null;
    var cache = options.addModeClass ? styleToClassCacheWithMode : styleToClassCache;
    return cache[style] ||
      (cache[style] = style.replace(/\S+/g, "cm-$&"));
  }

  // Render the DOM representation of the text of a line. Also builds
  // up a 'line map', which points at the DOM nodes that represent
  // specific stretches of text, and is used by the measuring code.
  // The returned object contains the DOM node, this map, and
  // information about line-wide styles that were set by the mode.
  function buildLineContent(cm, lineView) {
    // The padding-right forces the element to have a 'border', which
    // is needed on Webkit to be able to get line-level bounding
    // rectangles for it (in measureChar).
    var content = elt("span", null, null, webkit ? "padding-right: .1px" : null);
    var builder = {pre: elt("pre", [content]), content: content,
                   col: 0, pos: 0, cm: cm,
                   splitSpaces: (ie || webkit) && cm.getOption("lineWrapping")};
    lineView.measure = {};

    // Iterate over the logical lines that make up this visual line.
    for (var i = 0; i <= (lineView.rest ? lineView.rest.length : 0); i++) {
      var line = i ? lineView.rest[i - 1] : lineView.line, order;
      builder.pos = 0;
      builder.addToken = buildToken;
      // Optionally wire in some hacks into the token-rendering
      // algorithm, to deal with browser quirks.
      if (hasBadBidiRects(cm.display.measure) && (order = getOrder(line)))
        builder.addToken = buildTokenBadBidi(builder.addToken, order);
      builder.map = [];
      var allowFrontierUpdate = lineView != cm.display.externalMeasured && lineNo(line);
      insertLineContent(line, builder, getLineStyles(cm, line, allowFrontierUpdate));
      if (line.styleClasses) {
        if (line.styleClasses.bgClass)
          builder.bgClass = joinClasses(line.styleClasses.bgClass, builder.bgClass || "");
        if (line.styleClasses.textClass)
          builder.textClass = joinClasses(line.styleClasses.textClass, builder.textClass || "");
      }

      // Ensure at least a single node is present, for measuring.
      if (builder.map.length == 0)
        builder.map.push(0, 0, builder.content.appendChild(zeroWidthElement(cm.display.measure)));

      // Store the map and a cache object for the current logical line
      if (i == 0) {
        lineView.measure.map = builder.map;
        lineView.measure.cache = {};
      } else {
        (lineView.measure.maps || (lineView.measure.maps = [])).push(builder.map);
        (lineView.measure.caches || (lineView.measure.caches = [])).push({});
      }
    }

    // See issue #2901
    if (webkit && /\bcm-tab\b/.test(builder.content.lastChild.className))
      builder.content.className = "cm-tab-wrap-hack";

    signal(cm, "renderLine", cm, lineView.line, builder.pre);
    if (builder.pre.className)
      builder.textClass = joinClasses(builder.pre.className, builder.textClass || "");

    return builder;
  }

  function defaultSpecialCharPlaceholder(ch) {
    var token = elt("span", "\u2022", "cm-invalidchar");
    token.title = "\\u" + ch.charCodeAt(0).toString(16);
    token.setAttribute("aria-label", token.title);
    return token;
  }

  // Build up the DOM representation for a single token, and add it to
  // the line map. Takes care to render special characters separately.
  function buildToken(builder, text, style, startStyle, endStyle, title, css) {
    if (!text) return;
    var displayText = builder.splitSpaces ? text.replace(/ {3,}/g, splitSpaces) : text;
    var special = builder.cm.state.specialChars, mustWrap = false;
    if (!special.test(text)) {
      builder.col += text.length;
      var content = document.createTextNode(displayText);
      builder.map.push(builder.pos, builder.pos + text.length, content);
      if (ie && ie_version < 9) mustWrap = true;
      builder.pos += text.length;
    } else {
      var content = document.createDocumentFragment(), pos = 0;
      while (true) {
        special.lastIndex = pos;
        var m = special.exec(text);
        var skipped = m ? m.index - pos : text.length - pos;
        if (skipped) {
          var txt = document.createTextNode(displayText.slice(pos, pos + skipped));
          if (ie && ie_version < 9) content.appendChild(elt("span", [txt]));
          else content.appendChild(txt);
          builder.map.push(builder.pos, builder.pos + skipped, txt);
          builder.col += skipped;
          builder.pos += skipped;
        }
        if (!m) break;
        pos += skipped + 1;
        if (m[0] == "\t") {
          var tabSize = builder.cm.options.tabSize, tabWidth = tabSize - builder.col % tabSize;
          var txt = content.appendChild(elt("span", spaceStr(tabWidth), "cm-tab"));
          txt.setAttribute("role", "presentation");
          txt.setAttribute("cm-text", "\t");
          builder.col += tabWidth;
        } else {
          var txt = builder.cm.options.specialCharPlaceholder(m[0]);
          txt.setAttribute("cm-text", m[0]);
          if (ie && ie_version < 9) content.appendChild(elt("span", [txt]));
          else content.appendChild(txt);
          builder.col += 1;
        }
        builder.map.push(builder.pos, builder.pos + 1, txt);
        builder.pos++;
      }
    }
    if (style || startStyle || endStyle || mustWrap || css) {
      var fullStyle = style || "";
      if (startStyle) fullStyle += startStyle;
      if (endStyle) fullStyle += endStyle;
      var token = elt("span", [content], fullStyle, css);
      if (title) token.title = title;
      return builder.content.appendChild(token);
    }
    builder.content.appendChild(content);
  }

  function splitSpaces(old) {
    var out = " ";
    for (var i = 0; i < old.length - 2; ++i) out += i % 2 ? " " : "\u00a0";
    out += " ";
    return out;
  }

  // Work around nonsense dimensions being reported for stretches of
  // right-to-left text.
  function buildTokenBadBidi(inner, order) {
    return function(builder, text, style, startStyle, endStyle, title, css) {
      style = style ? style + " cm-force-border" : "cm-force-border";
      var start = builder.pos, end = start + text.length;
      for (;;) {
        // Find the part that overlaps with the start of this text
        for (var i = 0; i < order.length; i++) {
          var part = order[i];
          if (part.to > start && part.from <= start) break;
        }
        if (part.to >= end) return inner(builder, text, style, startStyle, endStyle, title, css);
        inner(builder, text.slice(0, part.to - start), style, startStyle, null, title, css);
        startStyle = null;
        text = text.slice(part.to - start);
        start = part.to;
      }
    };
  }

  function buildCollapsedSpan(builder, size, marker, ignoreWidget) {
    var widget = !ignoreWidget && marker.widgetNode;
    if (widget) builder.map.push(builder.pos, builder.pos + size, widget);
    if (!ignoreWidget && builder.cm.display.input.needsContentAttribute) {
      if (!widget)
        widget = builder.content.appendChild(document.createElement("span"));
      widget.setAttribute("cm-marker", marker.id);
    }
    if (widget) {
      builder.cm.display.input.setUneditable(widget);
      builder.content.appendChild(widget);
    }
    builder.pos += size;
  }

  // Outputs a number of spans to make up a line, taking highlighting
  // and marked text into account.
  function insertLineContent(line, builder, styles) {
    var spans = line.markedSpans, allText = line.text, at = 0;
    if (!spans) {
      for (var i = 1; i < styles.length; i+=2)
        builder.addToken(builder, allText.slice(at, at = styles[i]), interpretTokenStyle(styles[i+1], builder.cm.options));
      return;
    }

    var len = allText.length, pos = 0, i = 1, text = "", style, css;
    var nextChange = 0, spanStyle, spanEndStyle, spanStartStyle, title, collapsed;
    for (;;) {
      if (nextChange == pos) { // Update current marker set
        spanStyle = spanEndStyle = spanStartStyle = title = css = "";
        collapsed = null; nextChange = Infinity;
        var foundBookmarks = [];
        for (var j = 0; j < spans.length; ++j) {
          var sp = spans[j], m = sp.marker;
          if (sp.from <= pos && (sp.to == null || sp.to > pos)) {
            if (sp.to != null && nextChange > sp.to) { nextChange = sp.to; spanEndStyle = ""; }
            if (m.className) spanStyle += " " + m.className;
            if (m.css) css = m.css;
            if (m.startStyle && sp.from == pos) spanStartStyle += " " + m.startStyle;
            if (m.endStyle && sp.to == nextChange) spanEndStyle += " " + m.endStyle;
            if (m.title && !title) title = m.title;
            if (m.collapsed && (!collapsed || compareCollapsedMarkers(collapsed.marker, m) < 0))
              collapsed = sp;
          } else if (sp.from > pos && nextChange > sp.from) {
            nextChange = sp.from;
          }
          if (m.type == "bookmark" && sp.from == pos && m.widgetNode) foundBookmarks.push(m);
        }
        if (collapsed && (collapsed.from || 0) == pos) {
          buildCollapsedSpan(builder, (collapsed.to == null ? len + 1 : collapsed.to) - pos,
                             collapsed.marker, collapsed.from == null);
          if (collapsed.to == null) return;
        }
        if (!collapsed && foundBookmarks.length) for (var j = 0; j < foundBookmarks.length; ++j)
          buildCollapsedSpan(builder, 0, foundBookmarks[j]);
      }
      if (pos >= len) break;

      var upto = Math.min(len, nextChange);
      while (true) {
        if (text) {
          var end = pos + text.length;
          if (!collapsed) {
            var tokenText = end > upto ? text.slice(0, upto - pos) : text;
            builder.addToken(builder, tokenText, style ? style + spanStyle : spanStyle,
                             spanStartStyle, pos + tokenText.length == nextChange ? spanEndStyle : "", title, css);
          }
          if (end >= upto) {text = text.slice(upto - pos); pos = upto; break;}
          pos = end;
          spanStartStyle = "";
        }
        text = allText.slice(at, at = styles[i++]);
        style = interpretTokenStyle(styles[i++], builder.cm.options);
      }
    }
  }

  // DOCUMENT DATA STRUCTURE

  // By default, updates that start and end at the beginning of a line
  // are treated specially, in order to make the association of line
  // widgets and marker elements with the text behave more intuitive.
  function isWholeLineUpdate(doc, change) {
    return change.from.ch == 0 && change.to.ch == 0 && lst(change.text) == "" &&
      (!doc.cm || doc.cm.options.wholeLineUpdateBefore);
  }

  // Perform a change on the document data structure.
  function updateDoc(doc, change, markedSpans, estimateHeight) {
    function spansFor(n) {return markedSpans ? markedSpans[n] : null;}
    function update(line, text, spans) {
      updateLine(line, text, spans, estimateHeight);
      signalLater(line, "change", line, change);
    }
    function linesFor(start, end) {
      for (var i = start, result = []; i < end; ++i)
        result.push(new Line(text[i], spansFor(i), estimateHeight));
      return result;
    }

    var from = change.from, to = change.to, text = change.text;
    var firstLine = getLine(doc, from.line), lastLine = getLine(doc, to.line);
    var lastText = lst(text), lastSpans = spansFor(text.length - 1), nlines = to.line - from.line;

    // Adjust the line structure
    if (change.full) {
      doc.insert(0, linesFor(0, text.length));
      doc.remove(text.length, doc.size - text.length);
    } else if (isWholeLineUpdate(doc, change)) {
      // This is a whole-line replace. Treated specially to make
      // sure line objects move the way they are supposed to.
      var added = linesFor(0, text.length - 1);
      update(lastLine, lastLine.text, lastSpans);
      if (nlines) doc.remove(from.line, nlines);
      if (added.length) doc.insert(from.line, added);
    } else if (firstLine == lastLine) {
      if (text.length == 1) {
        update(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
      } else {
        var added = linesFor(1, text.length - 1);
        added.push(new Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight));
        update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
        doc.insert(from.line + 1, added);
      }
    } else if (text.length == 1) {
      update(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch), spansFor(0));
      doc.remove(from.line + 1, nlines);
    } else {
      update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
      update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
      var added = linesFor(1, text.length - 1);
      if (nlines > 1) doc.remove(from.line + 1, nlines - 1);
      doc.insert(from.line + 1, added);
    }

    signalLater(doc, "change", doc, change);
  }

  // The document is represented as a BTree consisting of leaves, with
  // chunk of lines in them, and branches, with up to ten leaves or
  // other branch nodes below them. The top node is always a branch
  // node, and is the document object itself (meaning it has
  // additional methods and properties).
  //
  // All nodes have parent links. The tree is used both to go from
  // line numbers to line objects, and to go from objects to numbers.
  // It also indexes by height, and is used to convert between height
  // and line object, and to find the total height of the document.
  //
  // See also http://marijnhaverbeke.nl/blog/codemirror-line-tree.html

  function LeafChunk(lines) {
    this.lines = lines;
    this.parent = null;
    for (var i = 0, height = 0; i < lines.length; ++i) {
      lines[i].parent = this;
      height += lines[i].height;
    }
    this.height = height;
  }

  LeafChunk.prototype = {
    chunkSize: function() { return this.lines.length; },
    // Remove the n lines at offset 'at'.
    removeInner: function(at, n) {
      for (var i = at, e = at + n; i < e; ++i) {
        var line = this.lines[i];
        this.height -= line.height;
        cleanUpLine(line);
        signalLater(line, "delete");
      }
      this.lines.splice(at, n);
    },
    // Helper used to collapse a small branch into a single leaf.
    collapse: function(lines) {
      lines.push.apply(lines, this.lines);
    },
    // Insert the given array of lines at offset 'at', count them as
    // having the given height.
    insertInner: function(at, lines, height) {
      this.height += height;
      this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
      for (var i = 0; i < lines.length; ++i) lines[i].parent = this;
    },
    // Used to iterate over a part of the tree.
    iterN: function(at, n, op) {
      for (var e = at + n; at < e; ++at)
        if (op(this.lines[at])) return true;
    }
  };

  function BranchChunk(children) {
    this.children = children;
    var size = 0, height = 0;
    for (var i = 0; i < children.length; ++i) {
      var ch = children[i];
      size += ch.chunkSize(); height += ch.height;
      ch.parent = this;
    }
    this.size = size;
    this.height = height;
    this.parent = null;
  }

  BranchChunk.prototype = {
    chunkSize: function() { return this.size; },
    removeInner: function(at, n) {
      this.size -= n;
      for (var i = 0; i < this.children.length; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (at < sz) {
          var rm = Math.min(n, sz - at), oldHeight = child.height;
          child.removeInner(at, rm);
          this.height -= oldHeight - child.height;
          if (sz == rm) { this.children.splice(i--, 1); child.parent = null; }
          if ((n -= rm) == 0) break;
          at = 0;
        } else at -= sz;
      }
      // If the result is smaller than 25 lines, ensure that it is a
      // single leaf node.
      if (this.size - n < 25 &&
          (this.children.length > 1 || !(this.children[0] instanceof LeafChunk))) {
        var lines = [];
        this.collapse(lines);
        this.children = [new LeafChunk(lines)];
        this.children[0].parent = this;
      }
    },
    collapse: function(lines) {
      for (var i = 0; i < this.children.length; ++i) this.children[i].collapse(lines);
    },
    insertInner: function(at, lines, height) {
      this.size += lines.length;
      this.height += height;
      for (var i = 0; i < this.children.length; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (at <= sz) {
          child.insertInner(at, lines, height);
          if (child.lines && child.lines.length > 50) {
            while (child.lines.length > 50) {
              var spilled = child.lines.splice(child.lines.length - 25, 25);
              var newleaf = new LeafChunk(spilled);
              child.height -= newleaf.height;
              this.children.splice(i + 1, 0, newleaf);
              newleaf.parent = this;
            }
            this.maybeSpill();
          }
          break;
        }
        at -= sz;
      }
    },
    // When a node has grown, check whether it should be split.
    maybeSpill: function() {
      if (this.children.length <= 10) return;
      var me = this;
      do {
        var spilled = me.children.splice(me.children.length - 5, 5);
        var sibling = new BranchChunk(spilled);
        if (!me.parent) { // Become the parent node
          var copy = new BranchChunk(me.children);
          copy.parent = me;
          me.children = [copy, sibling];
          me = copy;
        } else {
          me.size -= sibling.size;
          me.height -= sibling.height;
          var myIndex = indexOf(me.parent.children, me);
          me.parent.children.splice(myIndex + 1, 0, sibling);
        }
        sibling.parent = me.parent;
      } while (me.children.length > 10);
      me.parent.maybeSpill();
    },
    iterN: function(at, n, op) {
      for (var i = 0; i < this.children.length; ++i) {
        var child = this.children[i], sz = child.chunkSize();
        if (at < sz) {
          var used = Math.min(n, sz - at);
          if (child.iterN(at, used, op)) return true;
          if ((n -= used) == 0) break;
          at = 0;
        } else at -= sz;
      }
    }
  };

  var nextDocId = 0;
  var Doc = CodeMirror.Doc = function(text, mode, firstLine) {
    if (!(this instanceof Doc)) return new Doc(text, mode, firstLine);
    if (firstLine == null) firstLine = 0;

    BranchChunk.call(this, [new LeafChunk([new Line("", null)])]);
    this.first = firstLine;
    this.scrollTop = this.scrollLeft = 0;
    this.cantEdit = false;
    this.cleanGeneration = 1;
    this.frontier = firstLine;
    var start = Pos(firstLine, 0);
    this.sel = simpleSelection(start);
    this.history = new History(null);
    this.id = ++nextDocId;
    this.modeOption = mode;

    if (typeof text == "string") text = splitLines(text);
    updateDoc(this, {from: start, to: start, text: text});
    setSelection(this, simpleSelection(start), sel_dontScroll);
  };

  Doc.prototype = createObj(BranchChunk.prototype, {
    constructor: Doc,
    // Iterate over the document. Supports two forms -- with only one
    // argument, it calls that for each line in the document. With
    // three, it iterates over the range given by the first two (with
    // the second being non-inclusive).
    iter: function(from, to, op) {
      if (op) this.iterN(from - this.first, to - from, op);
      else this.iterN(this.first, this.first + this.size, from);
    },

    // Non-public interface for adding and removing lines.
    insert: function(at, lines) {
      var height = 0;
      for (var i = 0; i < lines.length; ++i) height += lines[i].height;
      this.insertInner(at - this.first, lines, height);
    },
    remove: function(at, n) { this.removeInner(at - this.first, n); },

    // From here, the methods are part of the public interface. Most
    // are also available from CodeMirror (editor) instances.

    getValue: function(lineSep) {
      var lines = getLines(this, this.first, this.first + this.size);
      if (lineSep === false) return lines;
      return lines.join(lineSep || "\n");
    },
    setValue: docMethodOp(function(code) {
      var top = Pos(this.first, 0), last = this.first + this.size - 1;
      makeChange(this, {from: top, to: Pos(last, getLine(this, last).text.length),
                        text: splitLines(code), origin: "setValue", full: true}, true);
      setSelection(this, simpleSelection(top));
    }),
    replaceRange: function(code, from, to, origin) {
      from = clipPos(this, from);
      to = to ? clipPos(this, to) : from;
      replaceRange(this, code, from, to, origin);
    },
    getRange: function(from, to, lineSep) {
      var lines = getBetween(this, clipPos(this, from), clipPos(this, to));
      if (lineSep === false) return lines;
      return lines.join(lineSep || "\n");
    },

    getLine: function(line) {var l = this.getLineHandle(line); return l && l.text;},

    getLineHandle: function(line) {if (isLine(this, line)) return getLine(this, line);},
    getLineNumber: function(line) {return lineNo(line);},

    getLineHandleVisualStart: function(line) {
      if (typeof line == "number") line = getLine(this, line);
      return visualLine(line);
    },

    lineCount: function() {return this.size;},
    firstLine: function() {return this.first;},
    lastLine: function() {return this.first + this.size - 1;},

    clipPos: function(pos) {return clipPos(this, pos);},

    getCursor: function(start) {
      var range = this.sel.primary(), pos;
      if (start == null || start == "head") pos = range.head;
      else if (start == "anchor") pos = range.anchor;
      else if (start == "end" || start == "to" || start === false) pos = range.to();
      else pos = range.from();
      return pos;
    },
    listSelections: function() { return this.sel.ranges; },
    somethingSelected: function() {return this.sel.somethingSelected();},

    setCursor: docMethodOp(function(line, ch, options) {
      setSimpleSelection(this, clipPos(this, typeof line == "number" ? Pos(line, ch || 0) : line), null, options);
    }),
    setSelection: docMethodOp(function(anchor, head, options) {
      setSimpleSelection(this, clipPos(this, anchor), clipPos(this, head || anchor), options);
    }),
    extendSelection: docMethodOp(function(head, other, options) {
      extendSelection(this, clipPos(this, head), other && clipPos(this, other), options);
    }),
    extendSelections: docMethodOp(function(heads, options) {
      extendSelections(this, clipPosArray(this, heads, options));
    }),
    extendSelectionsBy: docMethodOp(function(f, options) {
      extendSelections(this, map(this.sel.ranges, f), options);
    }),
    setSelections: docMethodOp(function(ranges, primary, options) {
      if (!ranges.length) return;
      for (var i = 0, out = []; i < ranges.length; i++)
        out[i] = new Range(clipPos(this, ranges[i].anchor),
                           clipPos(this, ranges[i].head));
      if (primary == null) primary = Math.min(ranges.length - 1, this.sel.primIndex);
      setSelection(this, normalizeSelection(out, primary), options);
    }),
    addSelection: docMethodOp(function(anchor, head, options) {
      var ranges = this.sel.ranges.slice(0);
      ranges.push(new Range(clipPos(this, anchor), clipPos(this, head || anchor)));
      setSelection(this, normalizeSelection(ranges, ranges.length - 1), options);
    }),

    getSelection: function(lineSep) {
      var ranges = this.sel.ranges, lines;
      for (var i = 0; i < ranges.length; i++) {
        var sel = getBetween(this, ranges[i].from(), ranges[i].to());
        lines = lines ? lines.concat(sel) : sel;
      }
      if (lineSep === false) return lines;
      else return lines.join(lineSep || "\n");
    },
    getSelections: function(lineSep) {
      var parts = [], ranges = this.sel.ranges;
      for (var i = 0; i < ranges.length; i++) {
        var sel = getBetween(this, ranges[i].from(), ranges[i].to());
        if (lineSep !== false) sel = sel.join(lineSep || "\n");
        parts[i] = sel;
      }
      return parts;
    },
    replaceSelection: function(code, collapse, origin) {
      var dup = [];
      for (var i = 0; i < this.sel.ranges.length; i++)
        dup[i] = code;
      this.replaceSelections(dup, collapse, origin || "+input");
    },
    replaceSelections: docMethodOp(function(code, collapse, origin) {
      var changes = [], sel = this.sel;
      for (var i = 0; i < sel.ranges.length; i++) {
        var range = sel.ranges[i];
        changes[i] = {from: range.from(), to: range.to(), text: splitLines(code[i]), origin: origin};
      }
      var newSel = collapse && collapse != "end" && computeReplacedSel(this, changes, collapse);
      for (var i = changes.length - 1; i >= 0; i--)
        makeChange(this, changes[i]);
      if (newSel) setSelectionReplaceHistory(this, newSel);
      else if (this.cm) ensureCursorVisible(this.cm);
    }),
    undo: docMethodOp(function() {makeChangeFromHistory(this, "undo");}),
    redo: docMethodOp(function() {makeChangeFromHistory(this, "redo");}),
    undoSelection: docMethodOp(function() {makeChangeFromHistory(this, "undo", true);}),
    redoSelection: docMethodOp(function() {makeChangeFromHistory(this, "redo", true);}),

    setExtending: function(val) {this.extend = val;},
    getExtending: function() {return this.extend;},

    historySize: function() {
      var hist = this.history, done = 0, undone = 0;
      for (var i = 0; i < hist.done.length; i++) if (!hist.done[i].ranges) ++done;
      for (var i = 0; i < hist.undone.length; i++) if (!hist.undone[i].ranges) ++undone;
      return {undo: done, redo: undone};
    },
    clearHistory: function() {this.history = new History(this.history.maxGeneration);},

    markClean: function() {
      this.cleanGeneration = this.changeGeneration(true);
    },
    changeGeneration: function(forceSplit) {
      if (forceSplit)
        this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null;
      return this.history.generation;
    },
    isClean: function (gen) {
      return this.history.generation == (gen || this.cleanGeneration);
    },

    getHistory: function() {
      return {done: copyHistoryArray(this.history.done),
              undone: copyHistoryArray(this.history.undone)};
    },
    setHistory: function(histData) {
      var hist = this.history = new History(this.history.maxGeneration);
      hist.done = copyHistoryArray(histData.done.slice(0), null, true);
      hist.undone = copyHistoryArray(histData.undone.slice(0), null, true);
    },

    addLineClass: docMethodOp(function(handle, where, cls) {
      return changeLine(this, handle, where == "gutter" ? "gutter" : "class", function(line) {
        var prop = where == "text" ? "textClass"
                 : where == "background" ? "bgClass"
                 : where == "gutter" ? "gutterClass" : "wrapClass";
        if (!line[prop]) line[prop] = cls;
        else if (classTest(cls).test(line[prop])) return false;
        else line[prop] += " " + cls;
        return true;
      });
    }),
    removeLineClass: docMethodOp(function(handle, where, cls) {
      return changeLine(this, handle, where == "gutter" ? "gutter" : "class", function(line) {
        var prop = where == "text" ? "textClass"
                 : where == "background" ? "bgClass"
                 : where == "gutter" ? "gutterClass" : "wrapClass";
        var cur = line[prop];
        if (!cur) return false;
        else if (cls == null) line[prop] = null;
        else {
          var found = cur.match(classTest(cls));
          if (!found) return false;
          var end = found.index + found[0].length;
          line[prop] = cur.slice(0, found.index) + (!found.index || end == cur.length ? "" : " ") + cur.slice(end) || null;
        }
        return true;
      });
    }),

    addLineWidget: docMethodOp(function(handle, node, options) {
      return addLineWidget(this, handle, node, options);
    }),
    removeLineWidget: function(widget) { widget.clear(); },

    markText: function(from, to, options) {
      return markText(this, clipPos(this, from), clipPos(this, to), options, "range");
    },
    setBookmark: function(pos, options) {
      var realOpts = {replacedWith: options && (options.nodeType == null ? options.widget : options),
                      insertLeft: options && options.insertLeft,
                      clearWhenEmpty: false, shared: options && options.shared,
                      handleMouseEvents: options && options.handleMouseEvents};
      pos = clipPos(this, pos);
      return markText(this, pos, pos, realOpts, "bookmark");
    },
    findMarksAt: function(pos) {
      pos = clipPos(this, pos);
      var markers = [], spans = getLine(this, pos.line).markedSpans;
      if (spans) for (var i = 0; i < spans.length; ++i) {
        var span = spans[i];
        if ((span.from == null || span.from <= pos.ch) &&
            (span.to == null || span.to >= pos.ch))
          markers.push(span.marker.parent || span.marker);
      }
      return markers;
    },
    findMarks: function(from, to, filter) {
      from = clipPos(this, from); to = clipPos(this, to);
      var found = [], lineNo = from.line;
      this.iter(from.line, to.line + 1, function(line) {
        var spans = line.markedSpans;
        if (spans) for (var i = 0; i < spans.length; i++) {
          var span = spans[i];
          if (!(lineNo == from.line && from.ch > span.to ||
                span.from == null && lineNo != from.line||
                lineNo == to.line && span.from > to.ch) &&
              (!filter || filter(span.marker)))
            found.push(span.marker.parent || span.marker);
        }
        ++lineNo;
      });
      return found;
    },
    getAllMarks: function() {
      var markers = [];
      this.iter(function(line) {
        var sps = line.markedSpans;
        if (sps) for (var i = 0; i < sps.length; ++i)
          if (sps[i].from != null) markers.push(sps[i].marker);
      });
      return markers;
    },

    posFromIndex: function(off) {
      var ch, lineNo = this.first;
      this.iter(function(line) {
        var sz = line.text.length + 1;
        if (sz > off) { ch = off; return true; }
        off -= sz;
        ++lineNo;
      });
      return clipPos(this, Pos(lineNo, ch));
    },
    indexFromPos: function (coords) {
      coords = clipPos(this, coords);
      var index = coords.ch;
      if (coords.line < this.first || coords.ch < 0) return 0;
      this.iter(this.first, coords.line, function (line) {
        index += line.text.length + 1;
      });
      return index;
    },

    copy: function(copyHistory) {
      var doc = new Doc(getLines(this, this.first, this.first + this.size), this.modeOption, this.first);
      doc.scrollTop = this.scrollTop; doc.scrollLeft = this.scrollLeft;
      doc.sel = this.sel;
      doc.extend = false;
      if (copyHistory) {
        doc.history.undoDepth = this.history.undoDepth;
        doc.setHistory(this.getHistory());
      }
      return doc;
    },

    linkedDoc: function(options) {
      if (!options) options = {};
      var from = this.first, to = this.first + this.size;
      if (options.from != null && options.from > from) from = options.from;
      if (options.to != null && options.to < to) to = options.to;
      var copy = new Doc(getLines(this, from, to), options.mode || this.modeOption, from);
      if (options.sharedHist) copy.history = this.history;
      (this.linked || (this.linked = [])).push({doc: copy, sharedHist: options.sharedHist});
      copy.linked = [{doc: this, isParent: true, sharedHist: options.sharedHist}];
      copySharedMarkers(copy, findSharedMarkers(this));
      return copy;
    },
    unlinkDoc: function(other) {
      if (other instanceof CodeMirror) other = other.doc;
      if (this.linked) for (var i = 0; i < this.linked.length; ++i) {
        var link = this.linked[i];
        if (link.doc != other) continue;
        this.linked.splice(i, 1);
        other.unlinkDoc(this);
        detachSharedMarkers(findSharedMarkers(this));
        break;
      }
      // If the histories were shared, split them again
      if (other.history == this.history) {
        var splitIds = [other.id];
        linkedDocs(other, function(doc) {splitIds.push(doc.id);}, true);
        other.history = new History(null);
        other.history.done = copyHistoryArray(this.history.done, splitIds);
        other.history.undone = copyHistoryArray(this.history.undone, splitIds);
      }
    },
    iterLinkedDocs: function(f) {linkedDocs(this, f);},

    getMode: function() {return this.mode;},
    getEditor: function() {return this.cm;}
  });

  // Public alias.
  Doc.prototype.eachLine = Doc.prototype.iter;

  // Set up methods on CodeMirror's prototype to redirect to the editor's document.
  var dontDelegate = "iter insert remove copy getEditor".split(" ");
  for (var prop in Doc.prototype) if (Doc.prototype.hasOwnProperty(prop) && indexOf(dontDelegate, prop) < 0)
    CodeMirror.prototype[prop] = (function(method) {
      return function() {return method.apply(this.doc, arguments);};
    })(Doc.prototype[prop]);

  eventMixin(Doc);

  // Call f for all linked documents.
  function linkedDocs(doc, f, sharedHistOnly) {
    function propagate(doc, skip, sharedHist) {
      if (doc.linked) for (var i = 0; i < doc.linked.length; ++i) {
        var rel = doc.linked[i];
        if (rel.doc == skip) continue;
        var shared = sharedHist && rel.sharedHist;
        if (sharedHistOnly && !shared) continue;
        f(rel.doc, shared);
        propagate(rel.doc, doc, shared);
      }
    }
    propagate(doc, null, true);
  }

  // Attach a document to an editor.
  function attachDoc(cm, doc) {
    if (doc.cm) throw new Error("This document is already in use.");
    cm.doc = doc;
    doc.cm = cm;
    estimateLineHeights(cm);
    loadMode(cm);
    if (!cm.options.lineWrapping) findMaxLine(cm);
    cm.options.mode = doc.modeOption;
    regChange(cm);
  }

  // LINE UTILITIES

  // Find the line object corresponding to the given line number.
  function getLine(doc, n) {
    n -= doc.first;
    if (n < 0 || n >= doc.size) throw new Error("There is no line " + (n + doc.first) + " in the document.");
    for (var chunk = doc; !chunk.lines;) {
      for (var i = 0;; ++i) {
        var child = chunk.children[i], sz = child.chunkSize();
        if (n < sz) { chunk = child; break; }
        n -= sz;
      }
    }
    return chunk.lines[n];
  }

  // Get the part of a document between two positions, as an array of
  // strings.
  function getBetween(doc, start, end) {
    var out = [], n = start.line;
    doc.iter(start.line, end.line + 1, function(line) {
      var text = line.text;
      if (n == end.line) text = text.slice(0, end.ch);
      if (n == start.line) text = text.slice(start.ch);
      out.push(text);
      ++n;
    });
    return out;
  }
  // Get the lines between from and to, as array of strings.
  function getLines(doc, from, to) {
    var out = [];
    doc.iter(from, to, function(line) { out.push(line.text); });
    return out;
  }

  // Update the height of a line, propagating the height change
  // upwards to parent nodes.
  function updateLineHeight(line, height) {
    var diff = height - line.height;
    if (diff) for (var n = line; n; n = n.parent) n.height += diff;
  }

  // Given a line object, find its line number by walking up through
  // its parent links.
  function lineNo(line) {
    if (line.parent == null) return null;
    var cur = line.parent, no = indexOf(cur.lines, line);
    for (var chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent) {
      for (var i = 0;; ++i) {
        if (chunk.children[i] == cur) break;
        no += chunk.children[i].chunkSize();
      }
    }
    return no + cur.first;
  }

  // Find the line at the given vertical position, using the height
  // information in the document tree.
  function lineAtHeight(chunk, h) {
    var n = chunk.first;
    outer: do {
      for (var i = 0; i < chunk.children.length; ++i) {
        var child = chunk.children[i], ch = child.height;
        if (h < ch) { chunk = child; continue outer; }
        h -= ch;
        n += child.chunkSize();
      }
      return n;
    } while (!chunk.lines);
    for (var i = 0; i < chunk.lines.length; ++i) {
      var line = chunk.lines[i], lh = line.height;
      if (h < lh) break;
      h -= lh;
    }
    return n + i;
  }


  // Find the height above the given line.
  function heightAtLine(lineObj) {
    lineObj = visualLine(lineObj);

    var h = 0, chunk = lineObj.parent;
    for (var i = 0; i < chunk.lines.length; ++i) {
      var line = chunk.lines[i];
      if (line == lineObj) break;
      else h += line.height;
    }
    for (var p = chunk.parent; p; chunk = p, p = chunk.parent) {
      for (var i = 0; i < p.children.length; ++i) {
        var cur = p.children[i];
        if (cur == chunk) break;
        else h += cur.height;
      }
    }
    return h;
  }

  // Get the bidi ordering for the given line (and cache it). Returns
  // false for lines that are fully left-to-right, and an array of
  // BidiSpan objects otherwise.
  function getOrder(line) {
    var order = line.order;
    if (order == null) order = line.order = bidiOrdering(line.text);
    return order;
  }

  // HISTORY

  function History(startGen) {
    // Arrays of change events and selections. Doing something adds an
    // event to done and clears undo. Undoing moves events from done
    // to undone, redoing moves them in the other direction.
    this.done = []; this.undone = [];
    this.undoDepth = Infinity;
    // Used to track when changes can be merged into a single undo
    // event
    this.lastModTime = this.lastSelTime = 0;
    this.lastOp = this.lastSelOp = null;
    this.lastOrigin = this.lastSelOrigin = null;
    // Used by the isClean() method
    this.generation = this.maxGeneration = startGen || 1;
  }

  // Create a history change event from an updateDoc-style change
  // object.
  function historyChangeFromChange(doc, change) {
    var histChange = {from: copyPos(change.from), to: changeEnd(change), text: getBetween(doc, change.from, change.to)};
    attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);
    linkedDocs(doc, function(doc) {attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);}, true);
    return histChange;
  }

  // Pop all selection events off the end of a history array. Stop at
  // a change event.
  function clearSelectionEvents(array) {
    while (array.length) {
      var last = lst(array);
      if (last.ranges) array.pop();
      else break;
    }
  }

  // Find the top change event in the history. Pop off selection
  // events that are in the way.
  function lastChangeEvent(hist, force) {
    if (force) {
      clearSelectionEvents(hist.done);
      return lst(hist.done);
    } else if (hist.done.length && !lst(hist.done).ranges) {
      return lst(hist.done);
    } else if (hist.done.length > 1 && !hist.done[hist.done.length - 2].ranges) {
      hist.done.pop();
      return lst(hist.done);
    }
  }

  // Register a change in the history. Merges changes that are within
  // a single operation, ore are close together with an origin that
  // allows merging (starting with "+") into a single event.
  function addChangeToHistory(doc, change, selAfter, opId) {
    var hist = doc.history;
    hist.undone.length = 0;
    var time = +new Date, cur;

    if ((hist.lastOp == opId ||
         hist.lastOrigin == change.origin && change.origin &&
         ((change.origin.charAt(0) == "+" && doc.cm && hist.lastModTime > time - doc.cm.options.historyEventDelay) ||
          change.origin.charAt(0) == "*")) &&
        (cur = lastChangeEvent(hist, hist.lastOp == opId))) {
      // Merge this change into the last event
      var last = lst(cur.changes);
      if (cmp(change.from, change.to) == 0 && cmp(change.from, last.to) == 0) {
        // Optimized case for simple insertion -- don't want to add
        // new changesets for every character typed
        last.to = changeEnd(change);
      } else {
        // Add new sub-event
        cur.changes.push(historyChangeFromChange(doc, change));
      }
    } else {
      // Can not be merged, start a new event.
      var before = lst(hist.done);
      if (!before || !before.ranges)
        pushSelectionToHistory(doc.sel, hist.done);
      cur = {changes: [historyChangeFromChange(doc, change)],
             generation: hist.generation};
      hist.done.push(cur);
      while (hist.done.length > hist.undoDepth) {
        hist.done.shift();
        if (!hist.done[0].ranges) hist.done.shift();
      }
    }
    hist.done.push(selAfter);
    hist.generation = ++hist.maxGeneration;
    hist.lastModTime = hist.lastSelTime = time;
    hist.lastOp = hist.lastSelOp = opId;
    hist.lastOrigin = hist.lastSelOrigin = change.origin;

    if (!last) signal(doc, "historyAdded");
  }

  function selectionEventCanBeMerged(doc, origin, prev, sel) {
    var ch = origin.charAt(0);
    return ch == "*" ||
      ch == "+" &&
      prev.ranges.length == sel.ranges.length &&
      prev.somethingSelected() == sel.somethingSelected() &&
      new Date - doc.history.lastSelTime <= (doc.cm ? doc.cm.options.historyEventDelay : 500);
  }

  // Called whenever the selection changes, sets the new selection as
  // the pending selection in the history, and pushes the old pending
  // selection into the 'done' array when it was significantly
  // different (in number of selected ranges, emptiness, or time).
  function addSelectionToHistory(doc, sel, opId, options) {
    var hist = doc.history, origin = options && options.origin;

    // A new event is started when the previous origin does not match
    // the current, or the origins don't allow matching. Origins
    // starting with * are always merged, those starting with + are
    // merged when similar and close together in time.
    if (opId == hist.lastSelOp ||
        (origin && hist.lastSelOrigin == origin &&
         (hist.lastModTime == hist.lastSelTime && hist.lastOrigin == origin ||
          selectionEventCanBeMerged(doc, origin, lst(hist.done), sel))))
      hist.done[hist.done.length - 1] = sel;
    else
      pushSelectionToHistory(sel, hist.done);

    hist.lastSelTime = +new Date;
    hist.lastSelOrigin = origin;
    hist.lastSelOp = opId;
    if (options && options.clearRedo !== false)
      clearSelectionEvents(hist.undone);
  }

  function pushSelectionToHistory(sel, dest) {
    var top = lst(dest);
    if (!(top && top.ranges && top.equals(sel)))
      dest.push(sel);
  }

  // Used to store marked span information in the history.
  function attachLocalSpans(doc, change, from, to) {
    var existing = change["spans_" + doc.id], n = 0;
    doc.iter(Math.max(doc.first, from), Math.min(doc.first + doc.size, to), function(line) {
      if (line.markedSpans)
        (existing || (existing = change["spans_" + doc.id] = {}))[n] = line.markedSpans;
      ++n;
    });
  }

  // When un/re-doing restores text containing marked spans, those
  // that have been explicitly cleared should not be restored.
  function removeClearedSpans(spans) {
    if (!spans) return null;
    for (var i = 0, out; i < spans.length; ++i) {
      if (spans[i].marker.explicitlyCleared) { if (!out) out = spans.slice(0, i); }
      else if (out) out.push(spans[i]);
    }
    return !out ? spans : out.length ? out : null;
  }

  // Retrieve and filter the old marked spans stored in a change event.
  function getOldSpans(doc, change) {
    var found = change["spans_" + doc.id];
    if (!found) return null;
    for (var i = 0, nw = []; i < change.text.length; ++i)
      nw.push(removeClearedSpans(found[i]));
    return nw;
  }

  // Used both to provide a JSON-safe object in .getHistory, and, when
  // detaching a document, to split the history in two
  function copyHistoryArray(events, newGroup, instantiateSel) {
    for (var i = 0, copy = []; i < events.length; ++i) {
      var event = events[i];
      if (event.ranges) {
        copy.push(instantiateSel ? Selection.prototype.deepCopy.call(event) : event);
        continue;
      }
      var changes = event.changes, newChanges = [];
      copy.push({changes: newChanges});
      for (var j = 0; j < changes.length; ++j) {
        var change = changes[j], m;
        newChanges.push({from: change.from, to: change.to, text: change.text});
        if (newGroup) for (var prop in change) if (m = prop.match(/^spans_(\d+)$/)) {
          if (indexOf(newGroup, Number(m[1])) > -1) {
            lst(newChanges)[prop] = change[prop];
            delete change[prop];
          }
        }
      }
    }
    return copy;
  }

  // Rebasing/resetting history to deal with externally-sourced changes

  function rebaseHistSelSingle(pos, from, to, diff) {
    if (to < pos.line) {
      pos.line += diff;
    } else if (from < pos.line) {
      pos.line = from;
      pos.ch = 0;
    }
  }

  // Tries to rebase an array of history events given a change in the
  // document. If the change touches the same lines as the event, the
  // event, and everything 'behind' it, is discarded. If the change is
  // before the event, the event's positions are updated. Uses a
  // copy-on-write scheme for the positions, to avoid having to
  // reallocate them all on every rebase, but also avoid problems with
  // shared position objects being unsafely updated.
  function rebaseHistArray(array, from, to, diff) {
    for (var i = 0; i < array.length; ++i) {
      var sub = array[i], ok = true;
      if (sub.ranges) {
        if (!sub.copied) { sub = array[i] = sub.deepCopy(); sub.copied = true; }
        for (var j = 0; j < sub.ranges.length; j++) {
          rebaseHistSelSingle(sub.ranges[j].anchor, from, to, diff);
          rebaseHistSelSingle(sub.ranges[j].head, from, to, diff);
        }
        continue;
      }
      for (var j = 0; j < sub.changes.length; ++j) {
        var cur = sub.changes[j];
        if (to < cur.from.line) {
          cur.from = Pos(cur.from.line + diff, cur.from.ch);
          cur.to = Pos(cur.to.line + diff, cur.to.ch);
        } else if (from <= cur.to.line) {
          ok = false;
          break;
        }
      }
      if (!ok) {
        array.splice(0, i + 1);
        i = 0;
      }
    }
  }

  function rebaseHist(hist, change) {
    var from = change.from.line, to = change.to.line, diff = change.text.length - (to - from) - 1;
    rebaseHistArray(hist.done, from, to, diff);
    rebaseHistArray(hist.undone, from, to, diff);
  }

  // EVENT UTILITIES

  // Due to the fact that we still support jurassic IE versions, some
  // compatibility wrappers are needed.

  var e_preventDefault = CodeMirror.e_preventDefault = function(e) {
    if (e.preventDefault) e.preventDefault();
    else e.returnValue = false;
  };
  var e_stopPropagation = CodeMirror.e_stopPropagation = function(e) {
    if (e.stopPropagation) e.stopPropagation();
    else e.cancelBubble = true;
  };
  function e_defaultPrevented(e) {
    return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false;
  }
  var e_stop = CodeMirror.e_stop = function(e) {e_preventDefault(e); e_stopPropagation(e);};

  function e_target(e) {return e.target || e.srcElement;}
  function e_button(e) {
    var b = e.which;
    if (b == null) {
      if (e.button & 1) b = 1;
      else if (e.button & 2) b = 3;
      else if (e.button & 4) b = 2;
    }
    if (mac && e.ctrlKey && b == 1) b = 3;
    return b;
  }

  // EVENT HANDLING

  // Lightweight event framework. on/off also work on DOM nodes,
  // registering native DOM handlers.

  var on = CodeMirror.on = function(emitter, type, f) {
    if (emitter.addEventListener)
      emitter.addEventListener(type, f, false);
    else if (emitter.attachEvent)
      emitter.attachEvent("on" + type, f);
    else {
      var map = emitter._handlers || (emitter._handlers = {});
      var arr = map[type] || (map[type] = []);
      arr.push(f);
    }
  };

  var off = CodeMirror.off = function(emitter, type, f) {
    if (emitter.removeEventListener)
      emitter.removeEventListener(type, f, false);
    else if (emitter.detachEvent)
      emitter.detachEvent("on" + type, f);
    else {
      var arr = emitter._handlers && emitter._handlers[type];
      if (!arr) return;
      for (var i = 0; i < arr.length; ++i)
        if (arr[i] == f) { arr.splice(i, 1); break; }
    }
  };

  var signal = CodeMirror.signal = function(emitter, type /*, values...*/) {
    var arr = emitter._handlers && emitter._handlers[type];
    if (!arr) return;
    var args = Array.prototype.slice.call(arguments, 2);
    for (var i = 0; i < arr.length; ++i) arr[i].apply(null, args);
  };

  var orphanDelayedCallbacks = null;

  // Often, we want to signal events at a point where we are in the
  // middle of some work, but don't want the handler to start calling
  // other methods on the editor, which might be in an inconsistent
  // state or simply not expect any other events to happen.
  // signalLater looks whether there are any handlers, and schedules
  // them to be executed when the last operation ends, or, if no
  // operation is active, when a timeout fires.
  function signalLater(emitter, type /*, values...*/) {
    var arr = emitter._handlers && emitter._handlers[type];
    if (!arr) return;
    var args = Array.prototype.slice.call(arguments, 2), list;
    if (operationGroup) {
      list = operationGroup.delayedCallbacks;
    } else if (orphanDelayedCallbacks) {
      list = orphanDelayedCallbacks;
    } else {
      list = orphanDelayedCallbacks = [];
      setTimeout(fireOrphanDelayed, 0);
    }
    function bnd(f) {return function(){f.apply(null, args);};};
    for (var i = 0; i < arr.length; ++i)
      list.push(bnd(arr[i]));
  }

  function fireOrphanDelayed() {
    var delayed = orphanDelayedCallbacks;
    orphanDelayedCallbacks = null;
    for (var i = 0; i < delayed.length; ++i) delayed[i]();
  }

  // The DOM events that CodeMirror handles can be overridden by
  // registering a (non-DOM) handler on the editor for the event name,
  // and preventDefault-ing the event in that handler.
  function signalDOMEvent(cm, e, override) {
    if (typeof e == "string")
      e = {type: e, preventDefault: function() { this.defaultPrevented = true; }};
    signal(cm, override || e.type, cm, e);
    return e_defaultPrevented(e) || e.codemirrorIgnore;
  }

  function signalCursorActivity(cm) {
    var arr = cm._handlers && cm._handlers.cursorActivity;
    if (!arr) return;
    var set = cm.curOp.cursorActivityHandlers || (cm.curOp.cursorActivityHandlers = []);
    for (var i = 0; i < arr.length; ++i) if (indexOf(set, arr[i]) == -1)
      set.push(arr[i]);
  }

  function hasHandler(emitter, type) {
    var arr = emitter._handlers && emitter._handlers[type];
    return arr && arr.length > 0;
  }

  // Add on and off methods to a constructor's prototype, to make
  // registering events on such objects more convenient.
  function eventMixin(ctor) {
    ctor.prototype.on = function(type, f) {on(this, type, f);};
    ctor.prototype.off = function(type, f) {off(this, type, f);};
  }

  // MISC UTILITIES

  // Number of pixels added to scroller and sizer to hide scrollbar
  var scrollerGap = 30;

  // Returned or thrown by various protocols to signal 'I'm not
  // handling this'.
  var Pass = CodeMirror.Pass = {toString: function(){return "CodeMirror.Pass";}};

  // Reused option objects for setSelection & friends
  var sel_dontScroll = {scroll: false}, sel_mouse = {origin: "*mouse"}, sel_move = {origin: "+move"};

  function Delayed() {this.id = null;}
  Delayed.prototype.set = function(ms, f) {
    clearTimeout(this.id);
    this.id = setTimeout(f, ms);
  };

  // Counts the column offset in a string, taking tabs into account.
  // Used mostly to find indentation.
  var countColumn = CodeMirror.countColumn = function(string, end, tabSize, startIndex, startValue) {
    if (end == null) {
      end = string.search(/[^\s\u00a0]/);
      if (end == -1) end = string.length;
    }
    for (var i = startIndex || 0, n = startValue || 0;;) {
      var nextTab = string.indexOf("\t", i);
      if (nextTab < 0 || nextTab >= end)
        return n + (end - i);
      n += nextTab - i;
      n += tabSize - (n % tabSize);
      i = nextTab + 1;
    }
  };

  // The inverse of countColumn -- find the offset that corresponds to
  // a particular column.
  function findColumn(string, goal, tabSize) {
    for (var pos = 0, col = 0;;) {
      var nextTab = string.indexOf("\t", pos);
      if (nextTab == -1) nextTab = string.length;
      var skipped = nextTab - pos;
      if (nextTab == string.length || col + skipped >= goal)
        return pos + Math.min(skipped, goal - col);
      col += nextTab - pos;
      col += tabSize - (col % tabSize);
      pos = nextTab + 1;
      if (col >= goal) return pos;
    }
  }

  var spaceStrs = [""];
  function spaceStr(n) {
    while (spaceStrs.length <= n)
      spaceStrs.push(lst(spaceStrs) + " ");
    return spaceStrs[n];
  }

  function lst(arr) { return arr[arr.length-1]; }

  var selectInput = function(node) { node.select(); };
  if (ios) // Mobile Safari apparently has a bug where select() is broken.
    selectInput = function(node) { node.selectionStart = 0; node.selectionEnd = node.value.length; };
  else if (ie) // Suppress mysterious IE10 errors
    selectInput = function(node) { try { node.select(); } catch(_e) {} };

  function indexOf(array, elt) {
    for (var i = 0; i < array.length; ++i)
      if (array[i] == elt) return i;
    return -1;
  }
  function map(array, f) {
    var out = [];
    for (var i = 0; i < array.length; i++) out[i] = f(array[i], i);
    return out;
  }

  function nothing() {}

  function createObj(base, props) {
    var inst;
    if (Object.create) {
      inst = Object.create(base);
    } else {
      nothing.prototype = base;
      inst = new nothing();
    }
    if (props) copyObj(props, inst);
    return inst;
  };

  function copyObj(obj, target, overwrite) {
    if (!target) target = {};
    for (var prop in obj)
      if (obj.hasOwnProperty(prop) && (overwrite !== false || !target.hasOwnProperty(prop)))
        target[prop] = obj[prop];
    return target;
  }

  function bind(f) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function(){return f.apply(null, args);};
  }

  var nonASCIISingleCaseWordChar = /[\u00df\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
  var isWordCharBasic = CodeMirror.isWordChar = function(ch) {
    return /\w/.test(ch) || ch > "\x80" &&
      (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));
  };
  function isWordChar(ch, helper) {
    if (!helper) return isWordCharBasic(ch);
    if (helper.source.indexOf("\\w") > -1 && isWordCharBasic(ch)) return true;
    return helper.test(ch);
  }

  function isEmpty(obj) {
    for (var n in obj) if (obj.hasOwnProperty(n) && obj[n]) return false;
    return true;
  }

  // Extending unicode characters. A series of a non-extending char +
  // any number of extending chars is treated as a single unit as far
  // as editing and measuring is concerned. This is not fully correct,
  // since some scripts/fonts/browsers also treat other configurations
  // of code points as a group.
  var extendingChars = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
  function isExtendingChar(ch) { return ch.charCodeAt(0) >= 768 && extendingChars.test(ch); }

  // DOM UTILITIES

  function elt(tag, content, className, style) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (style) e.style.cssText = style;
    if (typeof content == "string") e.appendChild(document.createTextNode(content));
    else if (content) for (var i = 0; i < content.length; ++i) e.appendChild(content[i]);
    return e;
  }

  var range;
  if (document.createRange) range = function(node, start, end, endNode) {
    var r = document.createRange();
    r.setEnd(endNode || node, end);
    r.setStart(node, start);
    return r;
  };
  else range = function(node, start, end) {
    var r = document.body.createTextRange();
    try { r.moveToElementText(node.parentNode); }
    catch(e) { return r; }
    r.collapse(true);
    r.moveEnd("character", end);
    r.moveStart("character", start);
    return r;
  };

  function removeChildren(e) {
    for (var count = e.childNodes.length; count > 0; --count)
      e.removeChild(e.firstChild);
    return e;
  }

  function removeChildrenAndAdd(parent, e) {
    return removeChildren(parent).appendChild(e);
  }

  var contains = CodeMirror.contains = function(parent, child) {
    if (child.nodeType == 3) // Android browser always returns false when child is a textnode
      child = child.parentNode;
    if (parent.contains)
      return parent.contains(child);
    do {
      if (child.nodeType == 11) child = child.host;
      if (child == parent) return true;
    } while (child = child.parentNode);
  };

  function activeElt() { return document.activeElement; }
  // Older versions of IE throws unspecified error when touching
  // document.activeElement in some cases (during loading, in iframe)
  if (ie && ie_version < 11) activeElt = function() {
    try { return document.activeElement; }
    catch(e) { return document.body; }
  };

  function classTest(cls) { return new RegExp("(^|\\s)" + cls + "(?:$|\\s)\\s*"); }
  var rmClass = CodeMirror.rmClass = function(node, cls) {
    var current = node.className;
    var match = classTest(cls).exec(current);
    if (match) {
      var after = current.slice(match.index + match[0].length);
      node.className = current.slice(0, match.index) + (after ? match[1] + after : "");
    }
  };
  var addClass = CodeMirror.addClass = function(node, cls) {
    var current = node.className;
    if (!classTest(cls).test(current)) node.className += (current ? " " : "") + cls;
  };
  function joinClasses(a, b) {
    var as = a.split(" ");
    for (var i = 0; i < as.length; i++)
      if (as[i] && !classTest(as[i]).test(b)) b += " " + as[i];
    return b;
  }

  // WINDOW-WIDE EVENTS

  // These must be handled carefully, because naively registering a
  // handler for each editor will cause the editors to never be
  // garbage collected.

  function forEachCodeMirror(f) {
    if (!document.body.getElementsByClassName) return;
    var byClass = document.body.getElementsByClassName("CodeMirror");
    for (var i = 0; i < byClass.length; i++) {
      var cm = byClass[i].CodeMirror;
      if (cm) f(cm);
    }
  }

  var globalsRegistered = false;
  function ensureGlobalHandlers() {
    if (globalsRegistered) return;
    registerGlobalHandlers();
    globalsRegistered = true;
  }
  function registerGlobalHandlers() {
    // When the window resizes, we need to refresh active editors.
    var resizeTimer;
    on(window, "resize", function() {
      if (resizeTimer == null) resizeTimer = setTimeout(function() {
        resizeTimer = null;
        forEachCodeMirror(onResize);
      }, 100);
    });
    // When the window loses focus, we want to show the editor as blurred
    on(window, "blur", function() {
      forEachCodeMirror(onBlur);
    });
  }

  // FEATURE DETECTION

  // Detect drag-and-drop
  var dragAndDrop = function() {
    // There is *some* kind of drag-and-drop support in IE6-8, but I
    // couldn't get it to work yet.
    if (ie && ie_version < 9) return false;
    var div = elt('div');
    return "draggable" in div || "dragDrop" in div;
  }();

  var zwspSupported;
  function zeroWidthElement(measure) {
    if (zwspSupported == null) {
      var test = elt("span", "\u200b");
      removeChildrenAndAdd(measure, elt("span", [test, document.createTextNode("x")]));
      if (measure.firstChild.offsetHeight != 0)
        zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !(ie && ie_version < 8);
    }
    var node = zwspSupported ? elt("span", "\u200b") :
      elt("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px");
    node.setAttribute("cm-text", "");
    return node;
  }

  // Feature-detect IE's crummy client rect reporting for bidi text
  var badBidiRects;
  function hasBadBidiRects(measure) {
    if (badBidiRects != null) return badBidiRects;
    var txt = removeChildrenAndAdd(measure, document.createTextNode("A\u062eA"));
    var r0 = range(txt, 0, 1).getBoundingClientRect();
    if (!r0 || r0.left == r0.right) return false; // Safari returns null in some cases (#2780)
    var r1 = range(txt, 1, 2).getBoundingClientRect();
    return badBidiRects = (r1.right - r0.right < 3);
  }

  // See if "".split is the broken IE version, if so, provide an
  // alternative way to split lines.
  var splitLines = CodeMirror.splitLines = "\n\nb".split(/\n/).length != 3 ? function(string) {
    var pos = 0, result = [], l = string.length;
    while (pos <= l) {
      var nl = string.indexOf("\n", pos);
      if (nl == -1) nl = string.length;
      var line = string.slice(pos, string.charAt(nl - 1) == "\r" ? nl - 1 : nl);
      var rt = line.indexOf("\r");
      if (rt != -1) {
        result.push(line.slice(0, rt));
        pos += rt + 1;
      } else {
        result.push(line);
        pos = nl + 1;
      }
    }
    return result;
  } : function(string){return string.split(/\r\n?|\n/);};

  var hasSelection = window.getSelection ? function(te) {
    try { return te.selectionStart != te.selectionEnd; }
    catch(e) { return false; }
  } : function(te) {
    try {var range = te.ownerDocument.selection.createRange();}
    catch(e) {}
    if (!range || range.parentElement() != te) return false;
    return range.compareEndPoints("StartToEnd", range) != 0;
  };

  var hasCopyEvent = (function() {
    var e = elt("div");
    if ("oncopy" in e) return true;
    e.setAttribute("oncopy", "return;");
    return typeof e.oncopy == "function";
  })();

  var badZoomedRects = null;
  function hasBadZoomedRects(measure) {
    if (badZoomedRects != null) return badZoomedRects;
    var node = removeChildrenAndAdd(measure, elt("span", "x"));
    var normal = node.getBoundingClientRect();
    var fromRange = range(node, 0, 1).getBoundingClientRect();
    return badZoomedRects = Math.abs(normal.left - fromRange.left) > 1;
  }

  // KEY NAMES

  var keyNames = {3: "Enter", 8: "Backspace", 9: "Tab", 13: "Enter", 16: "Shift", 17: "Ctrl", 18: "Alt",
                  19: "Pause", 20: "CapsLock", 27: "Esc", 32: "Space", 33: "PageUp", 34: "PageDown", 35: "End",
                  36: "Home", 37: "Left", 38: "Up", 39: "Right", 40: "Down", 44: "PrintScrn", 45: "Insert",
                  46: "Delete", 59: ";", 61: "=", 91: "Mod", 92: "Mod", 93: "Mod", 107: "=", 109: "-", 127: "Delete",
                  173: "-", 186: ";", 187: "=", 188: ",", 189: "-", 190: ".", 191: "/", 192: "`", 219: "[", 220: "\\",
                  221: "]", 222: "'", 63232: "Up", 63233: "Down", 63234: "Left", 63235: "Right", 63272: "Delete",
                  63273: "Home", 63275: "End", 63276: "PageUp", 63277: "PageDown", 63302: "Insert"};
  CodeMirror.keyNames = keyNames;
  (function() {
    // Number keys
    for (var i = 0; i < 10; i++) keyNames[i + 48] = keyNames[i + 96] = String(i);
    // Alphabetic keys
    for (var i = 65; i <= 90; i++) keyNames[i] = String.fromCharCode(i);
    // Function keys
    for (var i = 1; i <= 12; i++) keyNames[i + 111] = keyNames[i + 63235] = "F" + i;
  })();

  // BIDI HELPERS

  function iterateBidiSections(order, from, to, f) {
    if (!order) return f(from, to, "ltr");
    var found = false;
    for (var i = 0; i < order.length; ++i) {
      var part = order[i];
      if (part.from < to && part.to > from || from == to && part.to == from) {
        f(Math.max(part.from, from), Math.min(part.to, to), part.level == 1 ? "rtl" : "ltr");
        found = true;
      }
    }
    if (!found) f(from, to, "ltr");
  }

  function bidiLeft(part) { return part.level % 2 ? part.to : part.from; }
  function bidiRight(part) { return part.level % 2 ? part.from : part.to; }

  function lineLeft(line) { var order = getOrder(line); return order ? bidiLeft(order[0]) : 0; }
  function lineRight(line) {
    var order = getOrder(line);
    if (!order) return line.text.length;
    return bidiRight(lst(order));
  }

  function lineStart(cm, lineN) {
    var line = getLine(cm.doc, lineN);
    var visual = visualLine(line);
    if (visual != line) lineN = lineNo(visual);
    var order = getOrder(visual);
    var ch = !order ? 0 : order[0].level % 2 ? lineRight(visual) : lineLeft(visual);
    return Pos(lineN, ch);
  }
  function lineEnd(cm, lineN) {
    var merged, line = getLine(cm.doc, lineN);
    while (merged = collapsedSpanAtEnd(line)) {
      line = merged.find(1, true).line;
      lineN = null;
    }
    var order = getOrder(line);
    var ch = !order ? line.text.length : order[0].level % 2 ? lineLeft(line) : lineRight(line);
    return Pos(lineN == null ? lineNo(line) : lineN, ch);
  }
  function lineStartSmart(cm, pos) {
    var start = lineStart(cm, pos.line);
    var line = getLine(cm.doc, start.line);
    var order = getOrder(line);
    if (!order || order[0].level == 0) {
      var firstNonWS = Math.max(0, line.text.search(/\S/));
      var inWS = pos.line == start.line && pos.ch <= firstNonWS && pos.ch;
      return Pos(start.line, inWS ? 0 : firstNonWS);
    }
    return start;
  }

  function compareBidiLevel(order, a, b) {
    var linedir = order[0].level;
    if (a == linedir) return true;
    if (b == linedir) return false;
    return a < b;
  }
  var bidiOther;
  function getBidiPartAt(order, pos) {
    bidiOther = null;
    for (var i = 0, found; i < order.length; ++i) {
      var cur = order[i];
      if (cur.from < pos && cur.to > pos) return i;
      if ((cur.from == pos || cur.to == pos)) {
        if (found == null) {
          found = i;
        } else if (compareBidiLevel(order, cur.level, order[found].level)) {
          if (cur.from != cur.to) bidiOther = found;
          return i;
        } else {
          if (cur.from != cur.to) bidiOther = i;
          return found;
        }
      }
    }
    return found;
  }

  function moveInLine(line, pos, dir, byUnit) {
    if (!byUnit) return pos + dir;
    do pos += dir;
    while (pos > 0 && isExtendingChar(line.text.charAt(pos)));
    return pos;
  }

  // This is needed in order to move 'visually' through bi-directional
  // text -- i.e., pressing left should make the cursor go left, even
  // when in RTL text. The tricky part is the 'jumps', where RTL and
  // LTR text touch each other. This often requires the cursor offset
  // to move more than one unit, in order to visually move one unit.
  function moveVisually(line, start, dir, byUnit) {
    var bidi = getOrder(line);
    if (!bidi) return moveLogically(line, start, dir, byUnit);
    var pos = getBidiPartAt(bidi, start), part = bidi[pos];
    var target = moveInLine(line, start, part.level % 2 ? -dir : dir, byUnit);

    for (;;) {
      if (target > part.from && target < part.to) return target;
      if (target == part.from || target == part.to) {
        if (getBidiPartAt(bidi, target) == pos) return target;
        part = bidi[pos += dir];
        return (dir > 0) == part.level % 2 ? part.to : part.from;
      } else {
        part = bidi[pos += dir];
        if (!part) return null;
        if ((dir > 0) == part.level % 2)
          target = moveInLine(line, part.to, -1, byUnit);
        else
          target = moveInLine(line, part.from, 1, byUnit);
      }
    }
  }

  function moveLogically(line, start, dir, byUnit) {
    var target = start + dir;
    if (byUnit) while (target > 0 && isExtendingChar(line.text.charAt(target))) target += dir;
    return target < 0 || target > line.text.length ? null : target;
  }

  // Bidirectional ordering algorithm
  // See http://unicode.org/reports/tr9/tr9-13.html for the algorithm
  // that this (partially) implements.

  // One-char codes used for character types:
  // L (L):   Left-to-Right
  // R (R):   Right-to-Left
  // r (AL):  Right-to-Left Arabic
  // 1 (EN):  European Number
  // + (ES):  European Number Separator
  // % (ET):  European Number Terminator
  // n (AN):  Arabic Number
  // , (CS):  Common Number Separator
  // m (NSM): Non-Spacing Mark
  // b (BN):  Boundary Neutral
  // s (B):   Paragraph Separator
  // t (S):   Segment Separator
  // w (WS):  Whitespace
  // N (ON):  Other Neutrals

  // Returns null if characters are ordered as they appear
  // (left-to-right), or an array of sections ({from, to, level}
  // objects) in the order in which they occur visually.
  var bidiOrdering = (function() {
    // Character types for codepoints 0 to 0xff
    var lowTypes = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN";
    // Character types for codepoints 0x600 to 0x6ff
    var arabicTypes = "rrrrrrrrrrrr,rNNmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmrrrrrrrnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmNmmmm";
    function charType(code) {
      if (code <= 0xf7) return lowTypes.charAt(code);
      else if (0x590 <= code && code <= 0x5f4) return "R";
      else if (0x600 <= code && code <= 0x6ed) return arabicTypes.charAt(code - 0x600);
      else if (0x6ee <= code && code <= 0x8ac) return "r";
      else if (0x2000 <= code && code <= 0x200b) return "w";
      else if (code == 0x200c) return "b";
      else return "L";
    }

    var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
    var isNeutral = /[stwN]/, isStrong = /[LRr]/, countsAsLeft = /[Lb1n]/, countsAsNum = /[1n]/;
    // Browsers seem to always treat the boundaries of block elements as being L.
    var outerType = "L";

    function BidiSpan(level, from, to) {
      this.level = level;
      this.from = from; this.to = to;
    }

    return function(str) {
      if (!bidiRE.test(str)) return false;
      var len = str.length, types = [];
      for (var i = 0, type; i < len; ++i)
        types.push(type = charType(str.charCodeAt(i)));

      // W1. Examine each non-spacing mark (NSM) in the level run, and
      // change the type of the NSM to the type of the previous
      // character. If the NSM is at the start of the level run, it will
      // get the type of sor.
      for (var i = 0, prev = outerType; i < len; ++i) {
        var type = types[i];
        if (type == "m") types[i] = prev;
        else prev = type;
      }

      // W2. Search backwards from each instance of a European number
      // until the first strong type (R, L, AL, or sor) is found. If an
      // AL is found, change the type of the European number to Arabic
      // number.
      // W3. Change all ALs to R.
      for (var i = 0, cur = outerType; i < len; ++i) {
        var type = types[i];
        if (type == "1" && cur == "r") types[i] = "n";
        else if (isStrong.test(type)) { cur = type; if (type == "r") types[i] = "R"; }
      }

      // W4. A single European separator between two European numbers
      // changes to a European number. A single common separator between
      // two numbers of the same type changes to that type.
      for (var i = 1, prev = types[0]; i < len - 1; ++i) {
        var type = types[i];
        if (type == "+" && prev == "1" && types[i+1] == "1") types[i] = "1";
        else if (type == "," && prev == types[i+1] &&
                 (prev == "1" || prev == "n")) types[i] = prev;
        prev = type;
      }

      // W5. A sequence of European terminators adjacent to European
      // numbers changes to all European numbers.
      // W6. Otherwise, separators and terminators change to Other
      // Neutral.
      for (var i = 0; i < len; ++i) {
        var type = types[i];
        if (type == ",") types[i] = "N";
        else if (type == "%") {
          for (var end = i + 1; end < len && types[end] == "%"; ++end) {}
          var replace = (i && types[i-1] == "!") || (end < len && types[end] == "1") ? "1" : "N";
          for (var j = i; j < end; ++j) types[j] = replace;
          i = end - 1;
        }
      }

      // W7. Search backwards from each instance of a European number
      // until the first strong type (R, L, or sor) is found. If an L is
      // found, then change the type of the European number to L.
      for (var i = 0, cur = outerType; i < len; ++i) {
        var type = types[i];
        if (cur == "L" && type == "1") types[i] = "L";
        else if (isStrong.test(type)) cur = type;
      }

      // N1. A sequence of neutrals takes the direction of the
      // surrounding strong text if the text on both sides has the same
      // direction. European and Arabic numbers act as if they were R in
      // terms of their influence on neutrals. Start-of-level-run (sor)
      // and end-of-level-run (eor) are used at level run boundaries.
      // N2. Any remaining neutrals take the embedding direction.
      for (var i = 0; i < len; ++i) {
        if (isNeutral.test(types[i])) {
          for (var end = i + 1; end < len && isNeutral.test(types[end]); ++end) {}
          var before = (i ? types[i-1] : outerType) == "L";
          var after = (end < len ? types[end] : outerType) == "L";
          var replace = before || after ? "L" : "R";
          for (var j = i; j < end; ++j) types[j] = replace;
          i = end - 1;
        }
      }

      // Here we depart from the documented algorithm, in order to avoid
      // building up an actual levels array. Since there are only three
      // levels (0, 1, 2) in an implementation that doesn't take
      // explicit embedding into account, we can build up the order on
      // the fly, without following the level-based algorithm.
      var order = [], m;
      for (var i = 0; i < len;) {
        if (countsAsLeft.test(types[i])) {
          var start = i;
          for (++i; i < len && countsAsLeft.test(types[i]); ++i) {}
          order.push(new BidiSpan(0, start, i));
        } else {
          var pos = i, at = order.length;
          for (++i; i < len && types[i] != "L"; ++i) {}
          for (var j = pos; j < i;) {
            if (countsAsNum.test(types[j])) {
              if (pos < j) order.splice(at, 0, new BidiSpan(1, pos, j));
              var nstart = j;
              for (++j; j < i && countsAsNum.test(types[j]); ++j) {}
              order.splice(at, 0, new BidiSpan(2, nstart, j));
              pos = j;
            } else ++j;
          }
          if (pos < i) order.splice(at, 0, new BidiSpan(1, pos, i));
        }
      }
      if (order[0].level == 1 && (m = str.match(/^\s+/))) {
        order[0].from = m[0].length;
        order.unshift(new BidiSpan(0, 0, m[0].length));
      }
      if (lst(order).level == 1 && (m = str.match(/\s+$/))) {
        lst(order).to -= m[0].length;
        order.push(new BidiSpan(0, len - m[0].length, len));
      }
      if (order[0].level != lst(order).level)
        order.push(new BidiSpan(order[0].level, len, len));

      return order;
    };
  })();

  // THE END

  CodeMirror.version = "5.1.0";

  return CodeMirror;
});

if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old};
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("haskell", function(_config, modeConfig) {

  function switchState(source, setState, f) {
    setState(f);
    return f(source, setState);
  }

  // These should all be Unicode extended, as per the Haskell 2010 report
  var smallRE = /[a-z_]/;
  var largeRE = /[A-Z]/;
  var digitRE = /\d/;
  var hexitRE = /[0-9A-Fa-f]/;
  var octitRE = /[0-7]/;
  var idRE = /[a-z_A-Z0-9'\xa1-\uffff]/;
  var symbolRE = /[-!#$%&*+.\/<=>?@\\^|~:]/;
  var specialRE = /[(),;[\]`{}]/;
  var whiteCharRE = /[ \t\v\f]/; // newlines are handled in tokenizer

  function normal(source, setState) {
    if (source.eatWhile(whiteCharRE)) {
      return null;
    }

    var ch = source.next();
    if (specialRE.test(ch)) {
      if (ch == '{' && source.eat('-')) {
        var t = "comment";
        if (source.eat('#')) {
          t = "meta";
        }
        return switchState(source, setState, ncomment(t, 1));
      }
      return null;
    }

    if (ch == '\'') {
      if (source.eat('\\')) {
        source.next();  // should handle other escapes here
      }
      else {
        source.next();
      }
      if (source.eat('\'')) {
        return "string";
      }
      return "error";
    }

    if (ch == '"') {
      return switchState(source, setState, stringLiteral);
    }

    if (largeRE.test(ch)) {
      source.eatWhile(idRE);
      if (source.eat('.')) {
        return "qualifier";
      }
      return "variable-2";
    }

    if (smallRE.test(ch)) {
      source.eatWhile(idRE);
      return "variable";
    }

    if (digitRE.test(ch)) {
      if (ch == '0') {
        if (source.eat(/[xX]/)) {
          source.eatWhile(hexitRE); // should require at least 1
          return "integer";
        }
        if (source.eat(/[oO]/)) {
          source.eatWhile(octitRE); // should require at least 1
          return "number";
        }
      }
      source.eatWhile(digitRE);
      var t = "number";
      if (source.match(/^\.\d+/)) {
        t = "number";
      }
      if (source.eat(/[eE]/)) {
        t = "number";
        source.eat(/[-+]/);
        source.eatWhile(digitRE); // should require at least 1
      }
      return t;
    }

    if (ch == "." && source.eat("."))
      return "keyword";

    if (symbolRE.test(ch)) {
      if (ch == '-' && source.eat(/-/)) {
        source.eatWhile(/-/);
        if (!source.eat(symbolRE)) {
          source.skipToEnd();
          return "comment";
        }
      }
      var t = "variable";
      if (ch == ':') {
        t = "variable-2";
      }
      source.eatWhile(symbolRE);
      return t;
    }

    return "error";
  }

  function ncomment(type, nest) {
    if (nest == 0) {
      return normal;
    }
    return function(source, setState) {
      var currNest = nest;
      while (!source.eol()) {
        var ch = source.next();
        if (ch == '{' && source.eat('-')) {
          ++currNest;
        }
        else if (ch == '-' && source.eat('}')) {
          --currNest;
          if (currNest == 0) {
            setState(normal);
            return type;
          }
        }
      }
      setState(ncomment(type, currNest));
      return type;
    };
  }

  function stringLiteral(source, setState) {
    while (!source.eol()) {
      var ch = source.next();
      if (ch == '"') {
        setState(normal);
        return "string";
      }
      if (ch == '\\') {
        if (source.eol() || source.eat(whiteCharRE)) {
          setState(stringGap);
          return "string";
        }
        if (source.eat('&')) {
        }
        else {
          source.next(); // should handle other escapes here
        }
      }
    }
    setState(normal);
    return "error";
  }

  function stringGap(source, setState) {
    if (source.eat('\\')) {
      return switchState(source, setState, stringLiteral);
    }
    source.next();
    setState(normal);
    return "error";
  }


  var wellKnownWords = (function() {
    var wkw = {};
    function setType(t) {
      return function () {
        for (var i = 0; i < arguments.length; i++)
          wkw[arguments[i]] = t;
      };
    }

    setType("keyword")(
      "case", "class", "data", "default", "deriving", "do", "else", "foreign",
      "if", "import", "in", "infix", "infixl", "infixr", "instance", "let",
      "module", "newtype", "of", "then", "type", "where", "_");

    setType("keyword")(
      "\.\.", ":", "::", "=", "\\", "\"", "<-", "->", "@", "~", "=>");

    setType("builtin")(
      "!!", "$!", "$", "&&", "+", "++", "-", ".", "/", "/=", "<", "<=", "=<<",
      "==", ">", ">=", ">>", ">>=", "^", "^^", "||", "*", "**");

    setType("builtin")(
      "Bool", "Bounded", "Char", "Double", "EQ", "Either", "Enum", "Eq",
      "False", "FilePath", "Float", "Floating", "Fractional", "Functor", "GT",
      "IO", "IOError", "Int", "Integer", "Integral", "Just", "LT", "Left",
      "Maybe", "Monad", "Nothing", "Num", "Ord", "Ordering", "Rational", "Read",
      "ReadS", "Real", "RealFloat", "RealFrac", "Right", "Show", "ShowS",
      "String", "True");

    setType("builtin")(
      "abs", "acos", "acosh", "all", "and", "any", "appendFile", "asTypeOf",
      "asin", "asinh", "atan", "atan2", "atanh", "break", "catch", "ceiling",
      "compare", "concat", "concatMap", "const", "cos", "cosh", "curry",
      "cycle", "decodeFloat", "div", "divMod", "drop", "dropWhile", "either",
      "elem", "encodeFloat", "enumFrom", "enumFromThen", "enumFromThenTo",
      "enumFromTo", "error", "even", "exp", "exponent", "fail", "filter",
      "flip", "floatDigits", "floatRadix", "floatRange", "floor", "fmap",
      "foldl", "foldl1", "foldr", "foldr1", "fromEnum", "fromInteger",
      "fromIntegral", "fromRational", "fst", "gcd", "getChar", "getContents",
      "getLine", "head", "id", "init", "interact", "ioError", "isDenormalized",
      "isIEEE", "isInfinite", "isNaN", "isNegativeZero", "iterate", "last",
      "lcm", "length", "lex", "lines", "log", "logBase", "lookup", "map",
      "mapM", "mapM_", "max", "maxBound", "maximum", "maybe", "min", "minBound",
      "minimum", "mod", "negate", "not", "notElem", "null", "odd", "or",
      "otherwise", "pi", "pred", "print", "product", "properFraction",
      "putChar", "putStr", "putStrLn", "quot", "quotRem", "read", "readFile",
      "readIO", "readList", "readLn", "readParen", "reads", "readsPrec",
      "realToFrac", "recip", "rem", "repeat", "replicate", "return", "reverse",
      "round", "scaleFloat", "scanl", "scanl1", "scanr", "scanr1", "seq",
      "sequence", "sequence_", "show", "showChar", "showList", "showParen",
      "showString", "shows", "showsPrec", "significand", "signum", "sin",
      "sinh", "snd", "span", "splitAt", "sqrt", "subtract", "succ", "sum",
      "tail", "take", "takeWhile", "tan", "tanh", "toEnum", "toInteger",
      "toRational", "truncate", "uncurry", "undefined", "unlines", "until",
      "unwords", "unzip", "unzip3", "userError", "words", "writeFile", "zip",
      "zip3", "zipWith", "zipWith3");

    var override = modeConfig.overrideKeywords;
    if (override) for (var word in override) if (override.hasOwnProperty(word))
      wkw[word] = override[word];

    return wkw;
  })();



  return {
    startState: function ()  { return { f: normal }; },
    copyState:  function (s) { return { f: s.f }; },

    token: function(stream, state) {
      var t = state.f(stream, function(s) { state.f = s; });
      var w = stream.current();
      return wellKnownWords.hasOwnProperty(w) ? wellKnownWords[w] : t;
    },

    blockCommentStart: "{-",
    blockCommentEnd: "-}",
    lineComment: "--"
  };

});

CodeMirror.defineMIME("text/x-haskell", "haskell");

});

if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old};
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode('mllike', function(_config, parserConfig) {
  var words = {
    'let': 'keyword',
    'rec': 'keyword',
    'in': 'keyword',
    'of': 'keyword',
    'and': 'keyword',
    'if': 'keyword',
    'then': 'keyword',
    'else': 'keyword',
    'for': 'keyword',
    'to': 'keyword',
    'while': 'keyword',
    'do': 'keyword',
    'done': 'keyword',
    'fun': 'keyword',
    'function': 'keyword',
    'val': 'keyword',
    'type': 'keyword',
    'mutable': 'keyword',
    'match': 'keyword',
    'with': 'keyword',
    'try': 'keyword',
    'open': 'builtin',
    'ignore': 'builtin',
    'begin': 'keyword',
    'end': 'keyword'
  };

  var extraWords = parserConfig.extraWords || {};
  for (var prop in extraWords) {
    if (extraWords.hasOwnProperty(prop)) {
      words[prop] = parserConfig.extraWords[prop];
    }
  }

  function tokenBase(stream, state) {
    var ch = stream.next();

    if (ch === '"') {
      state.tokenize = tokenString;
      return state.tokenize(stream, state);
    }
    if (ch === '(') {
      if (stream.eat('*')) {
        state.commentLevel++;
        state.tokenize = tokenComment;
        return state.tokenize(stream, state);
      }
    }
    if (ch === '~') {
      stream.eatWhile(/\w/);
      return 'variable-2';
    }
    if (ch === '`') {
      stream.eatWhile(/\w/);
      return 'quote';
    }
    if (ch === '/' && parserConfig.slashComments && stream.eat('/')) {
      stream.skipToEnd();
      return 'comment';
    }
    if (/\d/.test(ch)) {
      stream.eatWhile(/[\d]/);
      if (stream.eat('.')) {
        stream.eatWhile(/[\d]/);
      }
      return 'number';
    }
    if ( /[+\-*&%=<>!?|]/.test(ch)) {
      return 'operator';
    }
    stream.eatWhile(/\w/);
    var cur = stream.current();
    return words.hasOwnProperty(cur) ? words[cur] : 'variable';
  }

  function tokenString(stream, state) {
    var next, end = false, escaped = false;
    while ((next = stream.next()) != null) {
      if (next === '"' && !escaped) {
        end = true;
        break;
      }
      escaped = !escaped && next === '\\';
    }
    if (end && !escaped) {
      state.tokenize = tokenBase;
    }
    return 'string';
  };

  function tokenComment(stream, state) {
    var prev, next;
    while(state.commentLevel > 0 && (next = stream.next()) != null) {
      if (prev === '(' && next === '*') state.commentLevel++;
      if (prev === '*' && next === ')') state.commentLevel--;
      prev = next;
    }
    if (state.commentLevel <= 0) {
      state.tokenize = tokenBase;
    }
    return 'comment';
  }

  return {
    startState: function() {return {tokenize: tokenBase, commentLevel: 0};},
    token: function(stream, state) {
      if (stream.eatSpace()) return null;
      return state.tokenize(stream, state);
    },

    blockCommentStart: "(*",
    blockCommentEnd: "*)",
    lineComment: parserConfig.slashComments ? "//" : null
  };
});

CodeMirror.defineMIME('text/x-ocaml', {
  name: 'mllike',
  extraWords: {
    'succ': 'keyword',
    'trace': 'builtin',
    'exit': 'builtin',
    'print_string': 'builtin',
    'print_endline': 'builtin',
    'true': 'atom',
    'false': 'atom',
    'raise': 'keyword'
  }
});

CodeMirror.defineMIME('text/x-fsharp', {
  name: 'mllike',
  extraWords: {
    'abstract': 'keyword',
    'as': 'keyword',
    'assert': 'keyword',
    'base': 'keyword',
    'class': 'keyword',
    'default': 'keyword',
    'delegate': 'keyword',
    'downcast': 'keyword',
    'downto': 'keyword',
    'elif': 'keyword',
    'exception': 'keyword',
    'extern': 'keyword',
    'finally': 'keyword',
    'global': 'keyword',
    'inherit': 'keyword',
    'inline': 'keyword',
    'interface': 'keyword',
    'internal': 'keyword',
    'lazy': 'keyword',
    'let!': 'keyword',
    'member' : 'keyword',
    'module': 'keyword',
    'namespace': 'keyword',
    'new': 'keyword',
    'null': 'keyword',
    'override': 'keyword',
    'private': 'keyword',
    'public': 'keyword',
    'return': 'keyword',
    'return!': 'keyword',
    'select': 'keyword',
    'static': 'keyword',
    'struct': 'keyword',
    'upcast': 'keyword',
    'use': 'keyword',
    'use!': 'keyword',
    'val': 'keyword',
    'when': 'keyword',
    'yield': 'keyword',
    'yield!': 'keyword',

    'List': 'builtin',
    'Seq': 'builtin',
    'Map': 'builtin',
    'Set': 'builtin',
    'int': 'builtin',
    'string': 'builtin',
    'raise': 'builtin',
    'failwith': 'builtin',
    'not': 'builtin',
    'true': 'builtin',
    'false': 'builtin'
  },
  slashComments: true
});

});

if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old};
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("clike", function(config, parserConfig) {
  var indentUnit = config.indentUnit,
      statementIndentUnit = parserConfig.statementIndentUnit || indentUnit,
      dontAlignCalls = parserConfig.dontAlignCalls,
      keywords = parserConfig.keywords || {},
      builtin = parserConfig.builtin || {},
      blockKeywords = parserConfig.blockKeywords || {},
      atoms = parserConfig.atoms || {},
      hooks = parserConfig.hooks || {},
      multiLineStrings = parserConfig.multiLineStrings,
      indentStatements = parserConfig.indentStatements !== false;
  var isOperatorChar = /[+\-*&%=<>!?|\/]/;

  var curPunc;

  function tokenBase(stream, state) {
    var ch = stream.next();
    if (hooks[ch]) {
      var result = hooks[ch](stream, state);
      if (result !== false) return result;
    }
    if (ch == '"' || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    }
    if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
      curPunc = ch;
      return null;
    }
    if (/\d/.test(ch)) {
      stream.eatWhile(/[\w\.]/);
      return "number";
    }
    if (ch == "/") {
      if (stream.eat("*")) {
        state.tokenize = tokenComment;
        return tokenComment(stream, state);
      }
      if (stream.eat("/")) {
        stream.skipToEnd();
        return "comment";
      }
    }
    if (isOperatorChar.test(ch)) {
      stream.eatWhile(isOperatorChar);
      return "operator";
    }
    stream.eatWhile(/[\w\$_\xa1-\uffff]/);
    var cur = stream.current();
    if (keywords.propertyIsEnumerable(cur)) {
      if (blockKeywords.propertyIsEnumerable(cur)) curPunc = "newstatement";
      return "keyword";
    }
    if (builtin.propertyIsEnumerable(cur)) {
      if (blockKeywords.propertyIsEnumerable(cur)) curPunc = "newstatement";
      return "builtin";
    }
    if (atoms.propertyIsEnumerable(cur)) return "atom";
    return "variable";
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, next, end = false;
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) {end = true; break;}
        escaped = !escaped && next == "\\";
      }
      if (end || !(escaped || multiLineStrings))
        state.tokenize = null;
      return "string";
    };
  }

  function tokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = null;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return "comment";
  }

  function Context(indented, column, type, align, prev) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.align = align;
    this.prev = prev;
  }
  function pushContext(state, col, type) {
    var indent = state.indented;
    if (state.context && state.context.type == "statement")
      indent = state.context.indented;
    return state.context = new Context(indent, col, type, null, state.context);
  }
  function popContext(state) {
    var t = state.context.type;
    if (t == ")" || t == "]" || t == "}")
      state.indented = state.context.indented;
    return state.context = state.context.prev;
  }

  // Interface

  return {
    startState: function(basecolumn) {
      return {
        tokenize: null,
        context: new Context((basecolumn || 0) - indentUnit, 0, "top", false),
        indented: 0,
        startOfLine: true
      };
    },

    token: function(stream, state) {
      var ctx = state.context;
      if (stream.sol()) {
        if (ctx.align == null) ctx.align = false;
        state.indented = stream.indentation();
        state.startOfLine = true;
      }
      if (stream.eatSpace()) return null;
      curPunc = null;
      var style = (state.tokenize || tokenBase)(stream, state);
      if (style == "comment" || style == "meta") return style;
      if (ctx.align == null) ctx.align = true;

      if ((curPunc == ";" || curPunc == ":" || curPunc == ",") && ctx.type == "statement") popContext(state);
      else if (curPunc == "{") pushContext(state, stream.column(), "}");
      else if (curPunc == "[") pushContext(state, stream.column(), "]");
      else if (curPunc == "(") pushContext(state, stream.column(), ")");
      else if (curPunc == "}") {
        while (ctx.type == "statement") ctx = popContext(state);
        if (ctx.type == "}") ctx = popContext(state);
        while (ctx.type == "statement") ctx = popContext(state);
      }
      else if (curPunc == ctx.type) popContext(state);
      else if (indentStatements &&
               (((ctx.type == "}" || ctx.type == "top") && curPunc != ';') ||
                (ctx.type == "statement" && curPunc == "newstatement")))
        pushContext(state, stream.column(), "statement");
      state.startOfLine = false;
      return style;
    },

    indent: function(state, textAfter) {
      if (state.tokenize != tokenBase && state.tokenize != null) return CodeMirror.Pass;
      var ctx = state.context, firstChar = textAfter && textAfter.charAt(0);
      if (ctx.type == "statement" && firstChar == "}") ctx = ctx.prev;
      var closing = firstChar == ctx.type;
      if (ctx.type == "statement") return ctx.indented + (firstChar == "{" ? 0 : statementIndentUnit);
      else if (ctx.align && (!dontAlignCalls || ctx.type != ")")) return ctx.column + (closing ? 0 : 1);
      else if (ctx.type == ")" && !closing) return ctx.indented + statementIndentUnit;
      else return ctx.indented + (closing ? 0 : indentUnit);
    },

    electricChars: "{}",
    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    lineComment: "//",
    fold: "brace"
  };
});

  function words(str) {
    var obj = {}, words = str.split(" ");
    for (var i = 0; i < words.length; ++i) obj[words[i]] = true;
    return obj;
  }
  var cKeywords = "auto if break int case long char register continue return default short do sizeof " +
    "double static else struct entry switch extern typedef float union for unsigned " +
    "goto while enum void const signed volatile";

  function cppHook(stream, state) {
    if (!state.startOfLine) return false;
    for (;;) {
      if (stream.skipTo("\\")) {
        stream.next();
        if (stream.eol()) {
          state.tokenize = cppHook;
          break;
        }
      } else {
        stream.skipToEnd();
        state.tokenize = null;
        break;
      }
    }
    return "meta";
  }

  function cpp11StringHook(stream, state) {
    stream.backUp(1);
    // Raw strings.
    if (stream.match(/(R|u8R|uR|UR|LR)/)) {
      var match = stream.match(/"([^\s\\()]{0,16})\(/);
      if (!match) {
        return false;
      }
      state.cpp11RawStringDelim = match[1];
      state.tokenize = tokenRawString;
      return tokenRawString(stream, state);
    }
    // Unicode strings/chars.
    if (stream.match(/(u8|u|U|L)/)) {
      if (stream.match(/["']/, /* eat */ false)) {
        return "string";
      }
      return false;
    }
    // Ignore this hook.
    stream.next();
    return false;
  }

  // C#-style strings where "" escapes a quote.
  function tokenAtString(stream, state) {
    var next;
    while ((next = stream.next()) != null) {
      if (next == '"' && !stream.eat('"')) {
        state.tokenize = null;
        break;
      }
    }
    return "string";
  }

  // C++11 raw string literal is <prefix>"<delim>( anything )<delim>", where
  // <delim> can be a string up to 16 characters long.
  function tokenRawString(stream, state) {
    // Escape characters that have special regex meanings.
    var delim = state.cpp11RawStringDelim.replace(/[^\w\s]/g, '\\$&');
    var match = stream.match(new RegExp(".*?\\)" + delim + '"'));
    if (match)
      state.tokenize = null;
    else
      stream.skipToEnd();
    return "string";
  }

  function def(mimes, mode) {
    if (typeof mimes == "string") mimes = [mimes];
    var words = [];
    function add(obj) {
      if (obj) for (var prop in obj) if (obj.hasOwnProperty(prop))
        words.push(prop);
    }
    add(mode.keywords);
    add(mode.builtin);
    add(mode.atoms);
    if (words.length) {
      mode.helperType = mimes[0];
      CodeMirror.registerHelper("hintWords", mimes[0], words);
    }

    for (var i = 0; i < mimes.length; ++i)
      CodeMirror.defineMIME(mimes[i], mode);
  }

  def(["text/x-csrc", "text/x-c", "text/x-chdr"], {
    name: "clike",
    keywords: words(cKeywords),
    blockKeywords: words("case do else for if switch while struct"),
    atoms: words("null"),
    hooks: {"#": cppHook},
    modeProps: {fold: ["brace", "include"]}
  });

  def(["text/x-c++src", "text/x-c++hdr"], {
    name: "clike",
    keywords: words(cKeywords + " asm dynamic_cast namespace reinterpret_cast try bool explicit new " +
                    "static_cast typeid catch operator template typename class friend private " +
                    "this using const_cast inline public throw virtual delete mutable protected " +
                    "wchar_t alignas alignof constexpr decltype nullptr noexcept thread_local final " +
                    "static_assert override"),
    blockKeywords: words("catch class do else finally for if struct switch try while"),
    atoms: words("true false null"),
    hooks: {
      "#": cppHook,
      "u": cpp11StringHook,
      "U": cpp11StringHook,
      "L": cpp11StringHook,
      "R": cpp11StringHook
    },
    modeProps: {fold: ["brace", "include"]}
  });

  def("text/x-java", {
    name: "clike",
    keywords: words("abstract assert boolean break byte case catch char class const continue default " +
                    "do double else enum extends final finally float for goto if implements import " +
                    "instanceof int interface long native new package private protected public " +
                    "return short static strictfp super switch synchronized this throw throws transient " +
                    "try void volatile while"),
    blockKeywords: words("catch class do else finally for if switch try while"),
    atoms: words("true false null"),
    hooks: {
      "@": function(stream) {
        stream.eatWhile(/[\w\$_]/);
        return "meta";
      }
    },
    modeProps: {fold: ["brace", "import"]}
  });

  def("text/x-csharp", {
    name: "clike",
    keywords: words("abstract as base break case catch checked class const continue" +
                    " default delegate do else enum event explicit extern finally fixed for" +
                    " foreach goto if implicit in interface internal is lock namespace new" +
                    " operator out override params private protected public readonly ref return sealed" +
                    " sizeof stackalloc static struct switch this throw try typeof unchecked" +
                    " unsafe using virtual void volatile while add alias ascending descending dynamic from get" +
                    " global group into join let orderby partial remove select set value var yield"),
    blockKeywords: words("catch class do else finally for foreach if struct switch try while"),
    builtin: words("Boolean Byte Char DateTime DateTimeOffset Decimal Double" +
                    " Guid Int16 Int32 Int64 Object SByte Single String TimeSpan UInt16 UInt32" +
                    " UInt64 bool byte char decimal double short int long object"  +
                    " sbyte float string ushort uint ulong"),
    atoms: words("true false null"),
    hooks: {
      "@": function(stream, state) {
        if (stream.eat('"')) {
          state.tokenize = tokenAtString;
          return tokenAtString(stream, state);
        }
        stream.eatWhile(/[\w\$_]/);
        return "meta";
      }
    }
  });

  function tokenTripleString(stream, state) {
    var escaped = false;
    while (!stream.eol()) {
      if (!escaped && stream.match('"""')) {
        state.tokenize = null;
        break;
      }
      escaped = stream.next() == "\\" && !escaped;
    }
    return "string";
  }

  def("text/x-scala", {
    name: "clike",
    keywords: words(

      /* scala */
      "abstract case catch class def do else extends false final finally for forSome if " +
      "implicit import lazy match new null object override package private protected return " +
      "sealed super this throw trait try trye type val var while with yield _ : = => <- <: " +
      "<% >: # @ " +

      /* package scala */
      "assert assume require print println printf readLine readBoolean readByte readShort " +
      "readChar readInt readLong readFloat readDouble " +

      "AnyVal App Application Array BufferedIterator BigDecimal BigInt Char Console Either " +
      "Enumeration Equiv Error Exception Fractional Function IndexedSeq Integral Iterable " +
      "Iterator List Map Numeric Nil NotNull Option Ordered Ordering PartialFunction PartialOrdering " +
      "Product Proxy Range Responder Seq Serializable Set Specializable Stream StringBuilder " +
      "StringContext Symbol Throwable Traversable TraversableOnce Tuple Unit Vector :: #:: " +

      /* package java.lang */
      "Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable " +
      "Compiler Double Exception Float Integer Long Math Number Object Package Pair Process " +
      "Runtime Runnable SecurityManager Short StackTraceElement StrictMath String " +
      "StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void"
    ),
    multiLineStrings: true,
    blockKeywords: words("catch class do else finally for forSome if match switch try while"),
    atoms: words("true false null"),
    indentStatements: false,
    hooks: {
      "@": function(stream) {
        stream.eatWhile(/[\w\$_]/);
        return "meta";
      },
      '"': function(stream, state) {
        if (!stream.match('""')) return false;
        state.tokenize = tokenTripleString;
        return state.tokenize(stream, state);
      },
      "'": function(stream) {
        stream.eatWhile(/[\w\$_\xa1-\uffff]/);
        return "atom";
      }
    },
    modeProps: {closeBrackets: {triples: '"'}}
  });

  def(["x-shader/x-vertex", "x-shader/x-fragment"], {
    name: "clike",
    keywords: words("float int bool void " +
                    "vec2 vec3 vec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4 " +
                    "mat2 mat3 mat4 " +
                    "sampler1D sampler2D sampler3D samplerCube " +
                    "sampler1DShadow sampler2DShadow " +
                    "const attribute uniform varying " +
                    "break continue discard return " +
                    "for while do if else struct " +
                    "in out inout"),
    blockKeywords: words("for while do if else struct"),
    builtin: words("radians degrees sin cos tan asin acos atan " +
                    "pow exp log exp2 sqrt inversesqrt " +
                    "abs sign floor ceil fract mod min max clamp mix step smoothstep " +
                    "length distance dot cross normalize ftransform faceforward " +
                    "reflect refract matrixCompMult " +
                    "lessThan lessThanEqual greaterThan greaterThanEqual " +
                    "equal notEqual any all not " +
                    "texture1D texture1DProj texture1DLod texture1DProjLod " +
                    "texture2D texture2DProj texture2DLod texture2DProjLod " +
                    "texture3D texture3DProj texture3DLod texture3DProjLod " +
                    "textureCube textureCubeLod " +
                    "shadow1D shadow2D shadow1DProj shadow2DProj " +
                    "shadow1DLod shadow2DLod shadow1DProjLod shadow2DProjLod " +
                    "dFdx dFdy fwidth " +
                    "noise1 noise2 noise3 noise4"),
    atoms: words("true false " +
                "gl_FragColor gl_SecondaryColor gl_Normal gl_Vertex " +
                "gl_MultiTexCoord0 gl_MultiTexCoord1 gl_MultiTexCoord2 gl_MultiTexCoord3 " +
                "gl_MultiTexCoord4 gl_MultiTexCoord5 gl_MultiTexCoord6 gl_MultiTexCoord7 " +
                "gl_FogCoord gl_PointCoord " +
                "gl_Position gl_PointSize gl_ClipVertex " +
                "gl_FrontColor gl_BackColor gl_FrontSecondaryColor gl_BackSecondaryColor " +
                "gl_TexCoord gl_FogFragCoord " +
                "gl_FragCoord gl_FrontFacing " +
                "gl_FragData gl_FragDepth " +
                "gl_ModelViewMatrix gl_ProjectionMatrix gl_ModelViewProjectionMatrix " +
                "gl_TextureMatrix gl_NormalMatrix gl_ModelViewMatrixInverse " +
                "gl_ProjectionMatrixInverse gl_ModelViewProjectionMatrixInverse " +
                "gl_TexureMatrixTranspose gl_ModelViewMatrixInverseTranspose " +
                "gl_ProjectionMatrixInverseTranspose " +
                "gl_ModelViewProjectionMatrixInverseTranspose " +
                "gl_TextureMatrixInverseTranspose " +
                "gl_NormalScale gl_DepthRange gl_ClipPlane " +
                "gl_Point gl_FrontMaterial gl_BackMaterial gl_LightSource gl_LightModel " +
                "gl_FrontLightModelProduct gl_BackLightModelProduct " +
                "gl_TextureColor gl_EyePlaneS gl_EyePlaneT gl_EyePlaneR gl_EyePlaneQ " +
                "gl_FogParameters " +
                "gl_MaxLights gl_MaxClipPlanes gl_MaxTextureUnits gl_MaxTextureCoords " +
                "gl_MaxVertexAttribs gl_MaxVertexUniformComponents gl_MaxVaryingFloats " +
                "gl_MaxVertexTextureImageUnits gl_MaxTextureImageUnits " +
                "gl_MaxFragmentUniformComponents gl_MaxCombineTextureImageUnits " +
                "gl_MaxDrawBuffers"),
    hooks: {"#": cppHook},
    modeProps: {fold: ["brace", "include"]}
  });

  def("text/x-nesc", {
    name: "clike",
    keywords: words(cKeywords + "as atomic async call command component components configuration event generic " +
                    "implementation includes interface module new norace nx_struct nx_union post provides " +
                    "signal task uses abstract extends"),
    blockKeywords: words("case do else for if switch while struct"),
    atoms: words("null"),
    hooks: {"#": cppHook},
    modeProps: {fold: ["brace", "include"]}
  });

  def("text/x-objectivec", {
    name: "clike",
    keywords: words(cKeywords + "inline restrict _Bool _Complex _Imaginery BOOL Class bycopy byref id IMP in " +
                    "inout nil oneway out Protocol SEL self super atomic nonatomic retain copy readwrite readonly"),
    atoms: words("YES NO NULL NILL ON OFF"),
    hooks: {
      "@": function(stream) {
        stream.eatWhile(/[\w\$]/);
        return "keyword";
      },
      "#": cppHook
    },
    modeProps: {fold: "brace"}
  });

});

if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old};
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
if(typeof(define) == 'function'){__define__old=define;delete define}
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// TODO actually recognize syntax of TypeScript constructs

(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("javascript", function(config, parserConfig) {
  var indentUnit = config.indentUnit;
  var statementIndent = parserConfig.statementIndent;
  var jsonldMode = parserConfig.jsonld;
  var jsonMode = parserConfig.json || jsonldMode;
  var isTS = parserConfig.typescript;
  var wordRE = parserConfig.wordCharacters || /[\w$\xa1-\uffff]/;

  // Tokenizer

  var keywords = function(){
    function kw(type) {return {type: type, style: "keyword"};}
    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c");
    var operator = kw("operator"), atom = {type: "atom", style: "atom"};

    var jsKeywords = {
      "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
      "return": C, "break": C, "continue": C, "new": C, "delete": C, "throw": C, "debugger": C,
      "var": kw("var"), "const": kw("var"), "let": kw("var"),
      "function": kw("function"), "catch": kw("catch"),
      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
      "in": operator, "typeof": operator, "instanceof": operator,
      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
      "this": kw("this"), "module": kw("module"), "class": kw("class"), "super": kw("atom"),
      "yield": C, "export": kw("export"), "import": kw("import"), "extends": C
    };

    // Extend the 'normal' keywords with the TypeScript language extensions
    if (isTS) {
      var type = {type: "variable", style: "variable-3"};
      var tsKeywords = {
        // object-like things
        "interface": kw("interface"),
        "extends": kw("extends"),
        "constructor": kw("constructor"),

        // scope modifiers
        "public": kw("public"),
        "private": kw("private"),
        "protected": kw("protected"),
        "static": kw("static"),

        // types
        "string": type, "number": type, "bool": type, "any": type
      };

      for (var attr in tsKeywords) {
        jsKeywords[attr] = tsKeywords[attr];
      }
    }

    return jsKeywords;
  }();

  var isOperatorChar = /[+\-*&%=<>!?|~^]/;
  var isJsonldKeyword = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;

  function readRegexp(stream) {
    var escaped = false, next, inSet = false;
    while ((next = stream.next()) != null) {
      if (!escaped) {
        if (next == "/" && !inSet) return;
        if (next == "[") inSet = true;
        else if (inSet && next == "]") inSet = false;
      }
      escaped = !escaped && next == "\\";
    }
  }

  // Used as scratch variables to communicate multiple values without
  // consing up tons of objects.
  var type, content;
  function ret(tp, style, cont) {
    type = tp; content = cont;
    return style;
  }
  function tokenBase(stream, state) {
    var ch = stream.next();
    if (ch == '"' || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    } else if (ch == "." && stream.match(/^\d+(?:[eE][+\-]?\d+)?/)) {
      return ret("number", "number");
    } else if (ch == "." && stream.match("..")) {
      return ret("spread", "meta");
    } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
      return ret(ch);
    } else if (ch == "=" && stream.eat(">")) {
      return ret("=>", "operator");
    } else if (ch == "0" && stream.eat(/x/i)) {
      stream.eatWhile(/[\da-f]/i);
      return ret("number", "number");
    } else if (/\d/.test(ch)) {
      stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
      return ret("number", "number");
    } else if (ch == "/") {
      if (stream.eat("*")) {
        state.tokenize = tokenComment;
        return tokenComment(stream, state);
      } else if (stream.eat("/")) {
        stream.skipToEnd();
        return ret("comment", "comment");
      } else if (state.lastType == "operator" || state.lastType == "keyword c" ||
               state.lastType == "sof" || /^[\[{}\(,;:]$/.test(state.lastType)) {
        readRegexp(stream);
        stream.match(/^\b(([gimyu])(?![gimyu]*\2))+\b/);
        return ret("regexp", "string-2");
      } else {
        stream.eatWhile(isOperatorChar);
        return ret("operator", "operator", stream.current());
      }
    } else if (ch == "`") {
      state.tokenize = tokenQuasi;
      return tokenQuasi(stream, state);
    } else if (ch == "#") {
      stream.skipToEnd();
      return ret("error", "error");
    } else if (isOperatorChar.test(ch)) {
      stream.eatWhile(isOperatorChar);
      return ret("operator", "operator", stream.current());
    } else if (wordRE.test(ch)) {
      stream.eatWhile(wordRE);
      var word = stream.current(), known = keywords.propertyIsEnumerable(word) && keywords[word];
      return (known && state.lastType != ".") ? ret(known.type, known.style, word) :
                     ret("variable", "variable", word);
    }
  }

  function tokenString(quote) {
    return function(stream, state) {
      var escaped = false, next;
      if (jsonldMode && stream.peek() == "@" && stream.match(isJsonldKeyword)){
        state.tokenize = tokenBase;
        return ret("jsonld-keyword", "meta");
      }
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) break;
        escaped = !escaped && next == "\\";
      }
      if (!escaped) state.tokenize = tokenBase;
      return ret("string", "string");
    };
  }

  function tokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ret("comment", "comment");
  }

  function tokenQuasi(stream, state) {
    var escaped = false, next;
    while ((next = stream.next()) != null) {
      if (!escaped && (next == "`" || next == "$" && stream.eat("{"))) {
        state.tokenize = tokenBase;
        break;
      }
      escaped = !escaped && next == "\\";
    }
    return ret("quasi", "string-2", stream.current());
  }

  var brackets = "([{}])";
  // This is a crude lookahead trick to try and notice that we're
  // parsing the argument patterns for a fat-arrow function before we
  // actually hit the arrow token. It only works if the arrow is on
  // the same line as the arguments and there's no strange noise
  // (comments) in between. Fallback is to only notice when we hit the
  // arrow, and not declare the arguments as locals for the arrow
  // body.
  function findFatArrow(stream, state) {
    if (state.fatArrowAt) state.fatArrowAt = null;
    var arrow = stream.string.indexOf("=>", stream.start);
    if (arrow < 0) return;

    var depth = 0, sawSomething = false;
    for (var pos = arrow - 1; pos >= 0; --pos) {
      var ch = stream.string.charAt(pos);
      var bracket = brackets.indexOf(ch);
      if (bracket >= 0 && bracket < 3) {
        if (!depth) { ++pos; break; }
        if (--depth == 0) break;
      } else if (bracket >= 3 && bracket < 6) {
        ++depth;
      } else if (wordRE.test(ch)) {
        sawSomething = true;
      } else if (/["'\/]/.test(ch)) {
        return;
      } else if (sawSomething && !depth) {
        ++pos;
        break;
      }
    }
    if (sawSomething && !depth) state.fatArrowAt = pos;
  }

  // Parser

  var atomicTypes = {"atom": true, "number": true, "variable": true, "string": true, "regexp": true, "this": true, "jsonld-keyword": true};

  function JSLexical(indented, column, type, align, prev, info) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.prev = prev;
    this.info = info;
    if (align != null) this.align = align;
  }

  function inScope(state, varname) {
    for (var v = state.localVars; v; v = v.next)
      if (v.name == varname) return true;
    for (var cx = state.context; cx; cx = cx.prev) {
      for (var v = cx.vars; v; v = v.next)
        if (v.name == varname) return true;
    }
  }

  function parseJS(state, style, type, content, stream) {
    var cc = state.cc;
    // Communicate our context to the combinators.
    // (Less wasteful than consing up a hundred closures on every call.)
    cx.state = state; cx.stream = stream; cx.marked = null, cx.cc = cc; cx.style = style;

    if (!state.lexical.hasOwnProperty("align"))
      state.lexical.align = true;

    while(true) {
      var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
      if (combinator(type, content)) {
        while(cc.length && cc[cc.length - 1].lex)
          cc.pop()();
        if (cx.marked) return cx.marked;
        if (type == "variable" && inScope(state, content)) return "variable-2";
        return style;
      }
    }
  }

  // Combinator utils

  var cx = {state: null, column: null, marked: null, cc: null};
  function pass() {
    for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
  }
  function cont() {
    pass.apply(null, arguments);
    return true;
  }
  function register(varname) {
    function inList(list) {
      for (var v = list; v; v = v.next)
        if (v.name == varname) return true;
      return false;
    }
    var state = cx.state;
    if (state.context) {
      cx.marked = "def";
      if (inList(state.localVars)) return;
      state.localVars = {name: varname, next: state.localVars};
    } else {
      if (inList(state.globalVars)) return;
      if (parserConfig.globalVars)
        state.globalVars = {name: varname, next: state.globalVars};
    }
  }

  // Combinators

  var defaultVars = {name: "this", next: {name: "arguments"}};
  function pushcontext() {
    cx.state.context = {prev: cx.state.context, vars: cx.state.localVars};
    cx.state.localVars = defaultVars;
  }
  function popcontext() {
    cx.state.localVars = cx.state.context.vars;
    cx.state.context = cx.state.context.prev;
  }
  function pushlex(type, info) {
    var result = function() {
      var state = cx.state, indent = state.indented;
      if (state.lexical.type == "stat") indent = state.lexical.indented;
      else for (var outer = state.lexical; outer && outer.type == ")" && outer.align; outer = outer.prev)
        indent = outer.indented;
      state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
    };
    result.lex = true;
    return result;
  }
  function poplex() {
    var state = cx.state;
    if (state.lexical.prev) {
      if (state.lexical.type == ")")
        state.indented = state.lexical.indented;
      state.lexical = state.lexical.prev;
    }
  }
  poplex.lex = true;

  function expect(wanted) {
    function exp(type) {
      if (type == wanted) return cont();
      else if (wanted == ";") return pass();
      else return cont(exp);
    };
    return exp;
  }

  function statement(type, value) {
    if (type == "var") return cont(pushlex("vardef", value.length), vardef, expect(";"), poplex);
    if (type == "keyword a") return cont(pushlex("form"), expression, statement, poplex);
    if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
    if (type == "{") return cont(pushlex("}"), block, poplex);
    if (type == ";") return cont();
    if (type == "if") {
      if (cx.state.lexical.info == "else" && cx.state.cc[cx.state.cc.length - 1] == poplex)
        cx.state.cc.pop()();
      return cont(pushlex("form"), expression, statement, poplex, maybeelse);
    }
    if (type == "function") return cont(functiondef);
    if (type == "for") return cont(pushlex("form"), forspec, statement, poplex);
    if (type == "variable") return cont(pushlex("stat"), maybelabel);
    if (type == "switch") return cont(pushlex("form"), expression, pushlex("}", "switch"), expect("{"),
                                      block, poplex, poplex);
    if (type == "case") return cont(expression, expect(":"));
    if (type == "default") return cont(expect(":"));
    if (type == "catch") return cont(pushlex("form"), pushcontext, expect("("), funarg, expect(")"),
                                     statement, poplex, popcontext);
    if (type == "module") return cont(pushlex("form"), pushcontext, afterModule, popcontext, poplex);
    if (type == "class") return cont(pushlex("form"), className, poplex);
    if (type == "export") return cont(pushlex("form"), afterExport, poplex);
    if (type == "import") return cont(pushlex("form"), afterImport, poplex);
    return pass(pushlex("stat"), expression, expect(";"), poplex);
  }
  function expression(type) {
    return expressionInner(type, false);
  }
  function expressionNoComma(type) {
    return expressionInner(type, true);
  }
  function expressionInner(type, noComma) {
    if (cx.state.fatArrowAt == cx.stream.start) {
      var body = noComma ? arrowBodyNoComma : arrowBody;
      if (type == "(") return cont(pushcontext, pushlex(")"), commasep(pattern, ")"), poplex, expect("=>"), body, popcontext);
      else if (type == "variable") return pass(pushcontext, pattern, expect("=>"), body, popcontext);
    }

    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
    if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
    if (type == "function") return cont(functiondef, maybeop);
    if (type == "keyword c") return cont(noComma ? maybeexpressionNoComma : maybeexpression);
    if (type == "(") return cont(pushlex(")"), maybeexpression, comprehension, expect(")"), poplex, maybeop);
    if (type == "operator" || type == "spread") return cont(noComma ? expressionNoComma : expression);
    if (type == "[") return cont(pushlex("]"), arrayLiteral, poplex, maybeop);
    if (type == "{") return contCommasep(objprop, "}", null, maybeop);
    if (type == "quasi") { return pass(quasi, maybeop); }
    return cont();
  }
  function maybeexpression(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expression);
  }
  function maybeexpressionNoComma(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expressionNoComma);
  }

  function maybeoperatorComma(type, value) {
    if (type == ",") return cont(expression);
    return maybeoperatorNoComma(type, value, false);
  }
  function maybeoperatorNoComma(type, value, noComma) {
    var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
    var expr = noComma == false ? expression : expressionNoComma;
    if (type == "=>") return cont(pushcontext, noComma ? arrowBodyNoComma : arrowBody, popcontext);
    if (type == "operator") {
      if (/\+\+|--/.test(value)) return cont(me);
      if (value == "?") return cont(expression, expect(":"), expr);
      return cont(expr);
    }
    if (type == "quasi") { return pass(quasi, me); }
    if (type == ";") return;
    if (type == "(") return contCommasep(expressionNoComma, ")", "call", me);
    if (type == ".") return cont(property, me);
    if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
  }
  function quasi(type, value) {
    if (type != "quasi") return pass();
    if (value.slice(value.length - 2) != "${") return cont(quasi);
    return cont(expression, continueQuasi);
  }
  function continueQuasi(type) {
    if (type == "}") {
      cx.marked = "string-2";
      cx.state.tokenize = tokenQuasi;
      return cont(quasi);
    }
  }
  function arrowBody(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == "{" ? statement : expression);
  }
  function arrowBodyNoComma(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == "{" ? statement : expressionNoComma);
  }
  function maybelabel(type) {
    if (type == ":") return cont(poplex, statement);
    return pass(maybeoperatorComma, expect(";"), poplex);
  }
  function property(type) {
    if (type == "variable") {cx.marked = "property"; return cont();}
  }
  function objprop(type, value) {
    if (type == "variable" || cx.style == "keyword") {
      cx.marked = "property";
      if (value == "get" || value == "set") return cont(getterSetter);
      return cont(afterprop);
    } else if (type == "number" || type == "string") {
      cx.marked = jsonldMode ? "property" : (cx.style + " property");
      return cont(afterprop);
    } else if (type == "jsonld-keyword") {
      return cont(afterprop);
    } else if (type == "[") {
      return cont(expression, expect("]"), afterprop);
    }
  }
  function getterSetter(type) {
    if (type != "variable") return pass(afterprop);
    cx.marked = "property";
    return cont(functiondef);
  }
  function afterprop(type) {
    if (type == ":") return cont(expressionNoComma);
    if (type == "(") return pass(functiondef);
  }
  function commasep(what, end) {
    function proceed(type) {
      if (type == ",") {
        var lex = cx.state.lexical;
        if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
        return cont(what, proceed);
      }
      if (type == end) return cont();
      return cont(expect(end));
    }
    return function(type) {
      if (type == end) return cont();
      return pass(what, proceed);
    };
  }
  function contCommasep(what, end, info) {
    for (var i = 3; i < arguments.length; i++)
      cx.cc.push(arguments[i]);
    return cont(pushlex(end, info), commasep(what, end), poplex);
  }
  function block(type) {
    if (type == "}") return cont();
    return pass(statement, block);
  }
  function maybetype(type) {
    if (isTS && type == ":") return cont(typedef);
  }
  function typedef(type) {
    if (type == "variable"){cx.marked = "variable-3"; return cont();}
  }
  function vardef() {
    return pass(pattern, maybetype, maybeAssign, vardefCont);
  }
  function pattern(type, value) {
    if (type == "variable") { register(value); return cont(); }
    if (type == "[") return contCommasep(pattern, "]");
    if (type == "{") return contCommasep(proppattern, "}");
  }
  function proppattern(type, value) {
    if (type == "variable" && !cx.stream.match(/^\s*:/, false)) {
      register(value);
      return cont(maybeAssign);
    }
    if (type == "variable") cx.marked = "property";
    return cont(expect(":"), pattern, maybeAssign);
  }
  function maybeAssign(_type, value) {
    if (value == "=") return cont(expressionNoComma);
  }
  function vardefCont(type) {
    if (type == ",") return cont(vardef);
  }
  function maybeelse(type, value) {
    if (type == "keyword b" && value == "else") return cont(pushlex("form", "else"), statement, poplex);
  }
  function forspec(type) {
    if (type == "(") return cont(pushlex(")"), forspec1, expect(")"), poplex);
  }
  function forspec1(type) {
    if (type == "var") return cont(vardef, expect(";"), forspec2);
    if (type == ";") return cont(forspec2);
    if (type == "variable") return cont(formaybeinof);
    return pass(expression, expect(";"), forspec2);
  }
  function formaybeinof(_type, value) {
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
    return cont(maybeoperatorComma, forspec2);
  }
  function forspec2(type, value) {
    if (type == ";") return cont(forspec3);
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
    return pass(expression, expect(";"), forspec3);
  }
  function forspec3(type) {
    if (type != ")") cont(expression);
  }
  function functiondef(type, value) {
    if (value == "*") {cx.marked = "keyword"; return cont(functiondef);}
    if (type == "variable") {register(value); return cont(functiondef);}
    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, statement, popcontext);
  }
  function funarg(type) {
    if (type == "spread") return cont(funarg);
    return pass(pattern, maybetype);
  }
  function className(type, value) {
    if (type == "variable") {register(value); return cont(classNameAfter);}
  }
  function classNameAfter(type, value) {
    if (value == "extends") return cont(expression, classNameAfter);
    if (type == "{") return cont(pushlex("}"), classBody, poplex);
  }
  function classBody(type, value) {
    if (type == "variable" || cx.style == "keyword") {
      if (value == "static") {
        cx.marked = "keyword";
        return cont(classBody);
      }
      cx.marked = "property";
      if (value == "get" || value == "set") return cont(classGetterSetter, functiondef, classBody);
      return cont(functiondef, classBody);
    }
    if (value == "*") {
      cx.marked = "keyword";
      return cont(classBody);
    }
    if (type == ";") return cont(classBody);
    if (type == "}") return cont();
  }
  function classGetterSetter(type) {
    if (type != "variable") return pass();
    cx.marked = "property";
    return cont();
  }
  function afterModule(type, value) {
    if (type == "string") return cont(statement);
    if (type == "variable") { register(value); return cont(maybeFrom); }
  }
  function afterExport(_type, value) {
    if (value == "*") { cx.marked = "keyword"; return cont(maybeFrom, expect(";")); }
    if (value == "default") { cx.marked = "keyword"; return cont(expression, expect(";")); }
    return pass(statement);
  }
  function afterImport(type) {
    if (type == "string") return cont();
    return pass(importSpec, maybeFrom);
  }
  function importSpec(type, value) {
    if (type == "{") return contCommasep(importSpec, "}");
    if (type == "variable") register(value);
    return cont();
  }
  function maybeFrom(_type, value) {
    if (value == "from") { cx.marked = "keyword"; return cont(expression); }
  }
  function arrayLiteral(type) {
    if (type == "]") return cont();
    return pass(expressionNoComma, maybeArrayComprehension);
  }
  function maybeArrayComprehension(type) {
    if (type == "for") return pass(comprehension, expect("]"));
    if (type == ",") return cont(commasep(maybeexpressionNoComma, "]"));
    return pass(commasep(expressionNoComma, "]"));
  }
  function comprehension(type) {
    if (type == "for") return cont(forspec, comprehension);
    if (type == "if") return cont(expression, comprehension);
  }

  function isContinuedStatement(state, textAfter) {
    return state.lastType == "operator" || state.lastType == "," ||
      isOperatorChar.test(textAfter.charAt(0)) ||
      /[,.]/.test(textAfter.charAt(0));
  }

  // Interface

  return {
    startState: function(basecolumn) {
      var state = {
        tokenize: tokenBase,
        lastType: "sof",
        cc: [],
        lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
        localVars: parserConfig.localVars,
        context: parserConfig.localVars && {vars: parserConfig.localVars},
        indented: 0
      };
      if (parserConfig.globalVars && typeof parserConfig.globalVars == "object")
        state.globalVars = parserConfig.globalVars;
      return state;
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (!state.lexical.hasOwnProperty("align"))
          state.lexical.align = false;
        state.indented = stream.indentation();
        findFatArrow(stream, state);
      }
      if (state.tokenize != tokenComment && stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      if (type == "comment") return style;
      state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
      return parseJS(state, style, type, content, stream);
    },

    indent: function(state, textAfter) {
      if (state.tokenize == tokenComment) return CodeMirror.Pass;
      if (state.tokenize != tokenBase) return 0;
      var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical;
      // Kludge to prevent 'maybelse' from blocking lexical scope pops
      if (!/^\s*else\b/.test(textAfter)) for (var i = state.cc.length - 1; i >= 0; --i) {
        var c = state.cc[i];
        if (c == poplex) lexical = lexical.prev;
        else if (c != maybeelse) break;
      }
      if (lexical.type == "stat" && firstChar == "}") lexical = lexical.prev;
      if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
        lexical = lexical.prev;
      var type = lexical.type, closing = firstChar == type;

      if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info + 1 : 0);
      else if (type == "form" && firstChar == "{") return lexical.indented;
      else if (type == "form") return lexical.indented + indentUnit;
      else if (type == "stat")
        return lexical.indented + (isContinuedStatement(state, textAfter) ? statementIndent || indentUnit : 0);
      else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false)
        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
      else if (lexical.align) return lexical.column + (closing ? 0 : 1);
      else return lexical.indented + (closing ? 0 : indentUnit);
    },

    electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
    blockCommentStart: jsonMode ? null : "/*",
    blockCommentEnd: jsonMode ? null : "*/",
    lineComment: jsonMode ? null : "//",
    fold: "brace",
    closeBrackets: "()[]{}''\"\"``",

    helperType: jsonMode ? "json" : "javascript",
    jsonldMode: jsonldMode,
    jsonMode: jsonMode
  };
});

CodeMirror.registerHelper("wordChars", "javascript", /[\w$]/);

CodeMirror.defineMIME("text/javascript", "javascript");
CodeMirror.defineMIME("text/ecmascript", "javascript");
CodeMirror.defineMIME("application/javascript", "javascript");
CodeMirror.defineMIME("application/x-javascript", "javascript");
CodeMirror.defineMIME("application/ecmascript", "javascript");
CodeMirror.defineMIME("application/json", {name: "javascript", json: true});
CodeMirror.defineMIME("application/x-json", {name: "javascript", json: true});
CodeMirror.defineMIME("application/ld+json", {name: "javascript", jsonld: true});
CodeMirror.defineMIME("text/typescript", { name: "javascript", typescript: true });
CodeMirror.defineMIME("application/typescript", { name: "javascript", typescript: true });

});

if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old}
if(typeof(__define__old) == 'function'){define=__define__old;delete __define__old};
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var t;"undefined"!=typeof window?t=window:"undefined"!=typeof global?t=global:"undefined"!=typeof self&&(t=self),t.Promise=e()}}(function(){return function e(t,n,r){function o(s,u){if(!n[s]){if(!t[s]){var c="function"==typeof require&&require;if(!u&&c)return c(s,!0);if(i)return i(s,!0);throw new Error("Cannot find module '"+s+"'")}var a=n[s]={exports:{}};t[s][0].call(a.exports,function(e){var n=t[s][1][e];return o(n?n:e)},a,a.exports,e,t,n,r)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<r.length;s++)o(r[s]);return o}({1:[function(e,t){"use strict";function n(){}t.exports=n},{}],2:[function(e,t){"use strict";var n=e("./promise"),r=e("./reject"),o=e("./resolve"),i=e("./INTERNAL"),s=e("./handlers"),u=r(new TypeError("must be an array"));t.exports=function(e){function t(e,t){function n(e){a[t]=e,++l===r&!c&&(c=!0,s.resolve(h,a))}o(e).then(n,function(e){c||(c=!0,s.reject(h,e))})}if("[object Array]"!==Object.prototype.toString.call(e))return u;var r=e.length,c=!1;if(!r)return o([]);for(var a=new Array(r),l=0,f=-1,h=new n(i);++f<r;)t(e[f],f);return h}},{"./INTERNAL":1,"./handlers":3,"./promise":5,"./reject":7,"./resolve":8}],3:[function(e,t,n){"use strict";function r(e){var t=e&&e.then;return e&&"object"==typeof e&&"function"==typeof t?function(){t.apply(e,arguments)}:void 0}var o=e("./tryCatch"),i=e("./resolveThenable"),s=e("./states");n.resolve=function(e,t){var u=o(r,t);if("error"===u.status)return n.reject(e,u.value);var c=u.value;if(c)i.safely(e,c);else{e.state=s.FULFILLED,e.outcome=t;for(var a=-1,l=e.queue.length;++a<l;)e.queue[a].callFulfilled(t)}return e},n.reject=function(e,t){e.state=s.REJECTED,e.outcome=t;for(var n=-1,r=e.queue.length;++n<r;)e.queue[n].callRejected(t);return e}},{"./resolveThenable":9,"./states":10,"./tryCatch":11}],4:[function(e,t,n){t.exports=n=e("./promise"),n.resolve=e("./resolve"),n.reject=e("./reject"),n.all=e("./all")},{"./all":2,"./promise":5,"./reject":7,"./resolve":8}],5:[function(e,t){"use strict";function n(e){if(!(this instanceof n))return new n(e);if("function"!=typeof e)throw new TypeError("reslover must be a function");this.state=s.PENDING,this.queue=[],this.outcome=void 0,e!==o&&i.safely(this,e)}var r=e("./unwrap"),o=e("./INTERNAL"),i=e("./resolveThenable"),s=e("./states"),u=e("./queueItem");t.exports=n,n.prototype["catch"]=function(e){return this.then(null,e)},n.prototype.then=function(e,t){if("function"!=typeof e&&this.state===s.FULFILLED||"function"!=typeof t&&this.state===s.REJECTED)return this;var i=new n(o);if(this.state!==s.PENDING){var c=this.state===s.FULFILLED?e:t;r(i,c,this.outcome)}else this.queue.push(new u(i,e,t));return i}},{"./INTERNAL":1,"./queueItem":6,"./resolveThenable":9,"./states":10,"./unwrap":12}],6:[function(e,t){"use strict";function n(e,t,n){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof n&&(this.onRejected=n,this.callRejected=this.otherCallRejected)}var r=e("./handlers"),o=e("./unwrap");t.exports=n,n.prototype.callFulfilled=function(e){r.resolve(this.promise,e)},n.prototype.otherCallFulfilled=function(e){o(this.promise,this.onFulfilled,e)},n.prototype.callRejected=function(e){r.reject(this.promise,e)},n.prototype.otherCallRejected=function(e){o(this.promise,this.onRejected,e)}},{"./handlers":3,"./unwrap":12}],7:[function(e,t){"use strict";function n(e){var t=new r(o);return i.reject(t,e)}var r=e("./promise"),o=e("./INTERNAL"),i=e("./handlers");t.exports=n},{"./INTERNAL":1,"./handlers":3,"./promise":5}],8:[function(e,t){"use strict";function n(e){if(e)return e instanceof r?e:i.resolve(new r(o),e);var t=typeof e;switch(t){case"boolean":return s;case"undefined":return c;case"object":return u;case"number":return a;case"string":return l}}var r=e("./promise"),o=e("./INTERNAL"),i=e("./handlers");t.exports=n;var s=i.resolve(new r(o),!1),u=i.resolve(new r(o),null),c=i.resolve(new r(o),void 0),a=i.resolve(new r(o),0),l=i.resolve(new r(o),"")},{"./INTERNAL":1,"./handlers":3,"./promise":5}],9:[function(e,t,n){"use strict";function r(e,t){function n(t){u||(u=!0,o.reject(e,t))}function r(t){u||(u=!0,o.resolve(e,t))}function s(){t(r,n)}var u=!1,c=i(s);"error"===c.status&&n(c.value)}var o=e("./handlers"),i=e("./tryCatch");n.safely=r},{"./handlers":3,"./tryCatch":11}],10:[function(e,t,n){n.REJECTED=["REJECTED"],n.FULFILLED=["FULFILLED"],n.PENDING=["PENDING"]},{}],11:[function(e,t){"use strict";function n(e,t){var n={};try{n.value=e(t),n.status="success"}catch(r){n.status="error",n.value=r}return n}t.exports=n},{}],12:[function(e,t){"use strict";function n(e,t,n){r(function(){var r;try{r=t(n)}catch(i){return o.reject(e,i)}r===e?o.reject(e,new TypeError("Cannot resolve promise with itself")):o.resolve(e,r)})}var r=e("immediate"),o=e("./handlers");t.exports=n},{"./handlers":3,immediate:13}],13:[function(e,t){"use strict";function n(){o=!0;for(var e,t,n=u.length;n;){for(t=u,u=[],e=-1;++e<n;)t[e]();n=u.length}o=!1}function r(e){1!==u.push(e)||o||i()}for(var o,i,s=[e("./nextTick"),e("./messageChannel"),e("./stateChange"),e("./timeout")],u=[],c=-1,a=s.length;++c<a;)if(s[c].test()){i=s[c].install(n);break}t.exports=r},{"./messageChannel":14,"./nextTick":15,"./stateChange":16,"./timeout":17}],14:[function(e,t,n){(function(e){"use strict";n.test=function(){return e.setImmediate?!1:"undefined"!=typeof e.MessageChannel},n.install=function(t){var n=new e.MessageChannel;return n.port1.onmessage=t,function(){n.port2.postMessage(0)}}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],15:[function(e,t,n){(function(e){"use strict";var t=e.MutationObserver||e.WebKitMutationObserver;n.test=function(){return t},n.install=function(n){var r=0,o=new t(n),i=e.document.createTextNode("");return o.observe(i,{characterData:!0}),function(){i.data=r=++r%2}}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],16:[function(e,t,n){(function(e){"use strict";n.test=function(){return"document"in e&&"onreadystatechange"in e.document.createElement("script")},n.install=function(t){return function(){var n=e.document.createElement("script");return n.onreadystatechange=function(){t(),n.onreadystatechange=null,n.parentNode.removeChild(n),n=null},e.document.documentElement.appendChild(n),t}}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],17:[function(e,t,n){"use strict";n.test=function(){return!0},n.install=function(e){return function(){setTimeout(e,0)}}},{}]},{},[4])(4)});;
//    PouchDB 3.0.5
//    
//    (c) 2012-2014 Dale Harvey and the PouchDB team
//    PouchDB may be freely distributed under the Apache license, version 2.0.
//    For all details and documentation:
//    http://pouchdb.com
!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var t;"undefined"!=typeof window?t=window:"undefined"!=typeof global?t=global:"undefined"!=typeof self&&(t=self),t.PouchDB=e()}}(function(){var define,module,exports;return function e(t,n,r){function o(s,a){if(!n[s]){if(!t[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(i)return i(s,!0);throw new Error("Cannot find module '"+s+"'")}var c=n[s]={exports:{}};t[s][0].call(c.exports,function(e){var n=t[s][1][e];return o(n?n:e)},c,c.exports,e,t,n,r)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<r.length;s++)o(r[s]);return o}({1:[function(e,t){"use strict";function n(e,t){for(var n=0;n<e.length;n++)if(t(e[n],n)===!0)return e[n];return!1}function r(e){return function(t,n){t||n[0].error?e(t||n[0]):e(null,n[0])}}function o(e){var t={},n=[];return u.traverseRevTree(e,function(e,r,o,i){var s=r+"-"+o;return e&&(t[s]=0),void 0!==i&&n.push({from:i,to:s}),s}),n.reverse(),n.forEach(function(e){t[e.from]=void 0===t[e.from]?1+t[e.to]:Math.min(t[e.from],1+t[e.to])}),t}function i(e,t,n){var r="limit"in t?t.keys.slice(t.skip,t.limit+t.skip):t.skip>0?t.keys.slice(t.skip):t.keys;if(t.descending&&r.reverse(),!r.length)return e._allDocs({limit:0},n);var o={offset:t.skip};return p.all(r.map(function(n){var r=a.extend(!0,{key:n,deleted:"ok"},t);return["limit","skip","keys"].forEach(function(e){delete r[e]}),new p(function(t,i){e._allDocs(r,function(e,r){return e?i(e):(o.total_rows=r.total_rows,void t(r.rows[0]||{key:n,error:"not_found"}))})})})).then(function(e){return o.rows=e,o})}function s(){var e=this;l.call(this),e.autoCompact=function(t){return e.auto_compaction&&"http"!==e.type()?function(n,r){if(n)t(n);else{var o=r.length,i=function(){o--,o||t(null,r)};if(!r.length)return t(null,r);r.forEach(function(t){t.ok&&t.id?e.compactDocument(t.id,1,i):i()})}}:t};var t,n=0,r=["change","delete","create","update"];this.on("newListener",function(o){if(~r.indexOf(o)){if(n)return void n++;n++;var i=0;t=this.changes({conflicts:!0,include_docs:!0,continuous:!0,since:"now",onChange:function(t){t.seq<=i||(i=t.seq,e.emit("change",t),t.doc._deleted?e.emit("delete",t):"1"===t.doc._rev.split("-")[0]?e.emit("create",t):e.emit("update",t))}})}}),this.on("removeListener",function(e){~r.indexOf(e)&&(n--,n||t.cancel())})}var a=e("./utils"),u=e("./merge"),c=e("./deps/errors"),l=e("events").EventEmitter,d=e("./deps/upsert"),f=e("./changes"),p=a.Promise;a.inherits(s,l),t.exports=s,s.prototype.post=a.adapterFun("post",function(e,t,n){return"function"==typeof t&&(n=t,t={}),"object"!=typeof e||Array.isArray(e)?n(c.NOT_AN_OBJECT):void this.bulkDocs({docs:[e]},t,this.autoCompact(r(n)))}),s.prototype.put=a.adapterFun("put",a.getArguments(function(e){var t,n,o,i,s=e.shift(),u="_id"in s;if("object"!=typeof s||Array.isArray(s))return(i=e.pop())(c.NOT_AN_OBJECT);for(s=a.clone(s);;)if(t=e.shift(),n=typeof t,"string"!==n||u?"string"!==n||!u||"_rev"in s?"object"===n?o=t:"function"===n&&(i=t):s._rev=t:(s._id=t,u=!0),!e.length)break;o=o||{};var l=a.invalidIdError(s._id);return l?i(l):a.isLocalId(s._id)&&"function"==typeof this._putLocal?s._deleted?this._removeLocal(s,i):this._putLocal(s,i):void this.bulkDocs({docs:[s]},o,this.autoCompact(r(i)))})),s.prototype.putAttachment=a.adapterFun("putAttachment",function(e,t,n,r,o,i){function s(e){return e._attachments=e._attachments||{},e._attachments[t]={content_type:o,data:r},a.put(e)}var a=this;return"function"==typeof o&&(i=o,o=r,r=n,n=null),"undefined"==typeof o&&(o=r,r=n,n=null),a.get(e).then(function(e){if(e._rev!==n)throw c.REV_CONFLICT;return s(e)},function(t){if(t.error===c.MISSING_DOC.error)return s({_id:e});throw t})}),s.prototype.removeAttachment=a.adapterFun("removeAttachment",function(e,t,n,r){var o=this;o.get(e,function(e,i){return e?void r(e):i._rev!==n?void r(c.REV_CONFLICT):i._attachments?(delete i._attachments[t],0===Object.keys(i._attachments).length&&delete i._attachments,void o.put(i,r)):r()})}),s.prototype.remove=a.adapterFun("remove",function(e,t,n,o){var i;"string"==typeof t?(i={_id:e,_rev:t},"function"==typeof n&&(o=n,n={})):(i=e,"function"==typeof t?(o=t,n={}):(o=n,n=t)),n=a.clone(n||{}),n.was_delete=!0;var s={_id:i._id,_rev:i._rev||n.rev};return s._deleted=!0,a.isLocalId(s._id)&&"function"==typeof this._removeLocal?this._removeLocal(i,o):void this.bulkDocs({docs:[s]},n,r(o))}),s.prototype.revsDiff=a.adapterFun("revsDiff",function(e,t,n){function r(e,t){c.has(e)||c.set(e,{missing:[]}),c.get(e).missing.push(t)}function o(t,n){var o=e[t].slice(0);u.traverseRevTree(n,function(e,n,i,s,a){var u=n+"-"+i,c=o.indexOf(u);-1!==c&&(o.splice(c,1),"available"!==a.status&&r(t,u))}),o.forEach(function(e){r(t,e)})}"function"==typeof t&&(n=t,t={}),t=a.clone(t);var i=Object.keys(e);if(!i.length)return n(null,{});var s=0,c=new a.Map;i.map(function(t){this._getRevisionTree(t,function(r,a){if(r&&404===r.status&&"missing"===r.message)c.set(t,{missing:e[t]});else{if(r)return n(r);o(t,a)}if(++s===i.length){var u={};return c.forEach(function(e,t){u[t]=e}),n(null,u)}})},this)}),s.prototype.compactDocument=a.adapterFun("compactDocument",function(e,t,n){var r=this;this._getRevisionTree(e,function(i,s){if(i)return n(i);var a=o(s),c=[],l=[];Object.keys(a).forEach(function(e){a[e]>t&&c.push(e)}),u.traverseRevTree(s,function(e,t,n,r,o){var i=t+"-"+n;"available"===o.status&&-1!==c.indexOf(i)&&(o.status="missing",l.push(i))}),r._doCompaction(e,s,l,n)})}),s.prototype.compact=a.adapterFun("compact",function(e,t){"function"==typeof e&&(t=e,e={});var n=this;this.changes({complete:function(e,r){if(e)return void t();var o=r.results.length;return o?void r.results.forEach(function(e){n.compactDocument(e.id,0,function(){o--,o||t()})}):void t()}})}),s.prototype.get=a.adapterFun("get",function(e,t,r){function o(){var n=[],o=i.length;return o?void i.forEach(function(i){s.get(e,{rev:i,revs:t.revs,attachments:t.attachments},function(e,t){n.push(e?{missing:i}:{ok:t}),o--,o||r(null,n)})}):r(null,n)}if("function"==typeof t&&(r=t,t={}),"string"!=typeof e)return r(c.INVALID_ID);if(a.isLocalId(e)&&"function"==typeof this._getLocal)return this._getLocal(e,r);var i=[],s=this;if(!t.open_revs)return this._get(e,t,function(e,o){if(t=a.clone(t),e)return r(e);var i=o.doc;if(!i)return r(new Error("no doc!"));var c=o.metadata,l=o.ctx;if(t.conflicts){var d=u.collectConflicts(c);d.length&&(i._conflicts=d)}if(t.revs||t.revs_info){var f=u.rootToLeaf(c.rev_tree),p=n(f,function(e){return-1!==e.ids.map(function(e){return e.id}).indexOf(i._rev.split("-")[1])}),h=p.ids.map(function(e){return e.id}).indexOf(i._rev.split("-")[1])+1,v=p.ids.length-h;if(p.ids.splice(h,v),p.ids.reverse(),t.revs&&(i._revisions={start:p.pos+p.ids.length-1,ids:p.ids.map(function(e){return e.id})}),t.revs_info){var m=p.pos+p.ids.length;i._revs_info=p.ids.map(function(e){return m--,{rev:m+"-"+e.id,status:e.opts.status}})}}if(t.local_seq&&(i._local_seq=o.metadata.seq),t.attachments&&i._attachments){var _=i._attachments,y=Object.keys(_).length;if(0===y)return r(null,i);Object.keys(_).forEach(function(e){this._getAttachment(_[e],{encode:!0,ctx:l},function(t,n){var o=i._attachments[e];o.data=n,delete o.stub,--y||r(null,i)})},s)}else{if(i._attachments)for(var g in i._attachments)i._attachments.hasOwnProperty(g)&&(i._attachments[g].stub=!0);r(null,i)}});if("all"===t.open_revs)this._getRevisionTree(e,function(e,t){e&&(t=[]),i=u.collectLeaves(t).map(function(e){return e.rev}),o()});else{if(!Array.isArray(t.open_revs))return r(c.error(c.UNKNOWN_ERROR,"function_clause"));i=t.open_revs;for(var l=0;l<i.length;l++){var d=i[l];if("string"!=typeof d||!/^\d+-/.test(d))return r(c.error(c.BAD_REQUEST,"Invalid rev format"))}o()}}),s.prototype.getAttachment=a.adapterFun("getAttachment",function(e,t,n,r){var o=this;n instanceof Function&&(r=n,n={}),n=a.clone(n),this._get(e,n,function(e,i){return e?r(e):i.doc._attachments&&i.doc._attachments[t]?(n.ctx=i.ctx,void o._getAttachment(i.doc._attachments[t],n,r)):r(c.MISSING_DOC)})}),s.prototype.allDocs=a.adapterFun("allDocs",function(e,t){if("function"==typeof e&&(t=e,e={}),e=a.clone(e),e.skip="undefined"!=typeof e.skip?e.skip:0,"keys"in e){if(!Array.isArray(e.keys))return t(new TypeError("options.keys must be an array"));var n=["startkey","endkey","key"].filter(function(t){return t in e})[0];if(n)return void t(c.error(c.QUERY_PARSE_ERROR,"Query parameter `"+n+"` is not compatible with multi-get"));if("http"!==this.type())return i(this,e,t)}return this._allDocs(e,t)}),s.prototype.changes=function(e,t){return"function"==typeof e&&(t=e,e={}),new f(this,e,t)},s.prototype.close=a.adapterFun("close",function(e){return this._closed=!0,this._close(e)}),s.prototype.info=a.adapterFun("info",function(e){var t=this;this._info(function(n,r){return n?e(n):(r.db_name=r.db_name||t._db_name,void e(null,r))})}),s.prototype.id=a.adapterFun("id",function(e){return this._id(e)}),s.prototype.type=function(){return"function"==typeof this._type?this._type():this.adapter},s.prototype.bulkDocs=a.adapterFun("bulkDocs",function(e,t,n){if("function"==typeof t&&(n=t,t={}),t=a.clone(t),Array.isArray(e)&&(e={docs:e}),!e||!e.docs||!Array.isArray(e.docs))return n(c.MISSING_BULK_DOCS);for(var r=0;r<e.docs.length;++r)if("object"!=typeof e.docs[r]||Array.isArray(e.docs[r]))return n(c.NOT_AN_OBJECT);return e=a.clone(e),"new_edits"in t||(t.new_edits="new_edits"in e?e.new_edits:!0),this._bulkDocs(e,t,this.autoCompact(n))}),s.prototype.registerDependentDatabase=a.adapterFun("registerDependentDatabase",function(e,t){function n(t){return t.dependentDbs=t.dependentDbs||{},t.dependentDbs[e]?!1:(t.dependentDbs[e]=!0,t)}var r=new this.constructor(e,{adapter:this._adapter});d(this,"_local/_pouch_dependentDbs",n,function(e){return e?t(e):t(null,{db:r})})})},{"./changes":6,"./deps/errors":11,"./deps/upsert":13,"./merge":18,"./utils":23,events:27}],2:[function(e,t){(function(n){"use strict";function r(e){for(var t=r.options,n=t.parser[t.strictMode?"strict":"loose"].exec(e),o={},i=14;i--;)o[t.key[i]]=n[i]||"";return o[t.q.name]={},o[t.key[12]].replace(t.q.parser,function(e,n,r){n&&(o[t.q.name][n]=r)}),o}function o(e){return/^_(design|local)/.test(e)?e:encodeURIComponent(e)}function i(e){return e._attachments&&Object.keys(e._attachments)?d.Promise.all(Object.keys(e._attachments).map(function(t){var r=e._attachments[t];if(r.data&&"string"!=typeof r.data){if(void 0===typeof n||n.browser)return new d.Promise(function(e){var t=new FileReader;t.onloadend=function(t){r.data=d.btoa(d.arrayBufferToBinaryString(t.target.result)),e()},t.readAsArrayBuffer(r.data)});r.data=r.data.toString("base64")}})):d.Promise.resolve()}function s(e,t){if(/http(s?):/.test(e)){var n=r(e);n.remote=!0,(n.user||n.password)&&(n.auth={username:n.user,password:n.password});var o=n.path.replace(/(^\/|\/$)/g,"").split("/");if(n.db=o.pop(),n.path=o.join("/"),t=t||{},t=d.clone(t),n.headers=t.headers||{},t.auth||n.auth){var i=t.auth||n.auth,s=d.btoa(i.username+":"+i.password);n.headers.Authorization="Basic "+s}return t.headers&&(n.headers=t.headers),n}return{host:"",path:"/",db:e,auth:!1}}function a(e,t){return u(e,e.db+"/"+t)}function u(e,t){if(e.remote){var n=e.path?"/":"";return e.protocol+"://"+e.host+":"+e.port+"/"+e.path+n+t}return"/"+t}function c(e,t){function n(e,t){return d.ajax(d.extend({},h,e),t)}var r=this;r.getHost=e.getHost?e.getHost:s;var c=r.getHost(e.name,e),p=a(c,"");r.getUrl=function(){return p},r.getHeaders=function(){return d.clone(c.headers)};var h=e.ajax||{};e=d.clone(e);var v=function(){n({headers:c.headers,method:"PUT",url:p},function(e){e&&401===e.status?n({headers:c.headers,method:"HEAD",url:p},function(e){e?t(e):t(null,r)}):e&&412!==e.status?t(e):t(null,r)})};e.skipSetup||n({headers:c.headers,method:"GET",url:p},function(e){e?404===e.status?v():t(e):t(null,r)}),r.type=function(){return"http"},r.id=d.adapterFun("id",function(e){n({headers:c.headers,method:"GET",url:u(c,"")},function(t,n){var r=n&&n.uuid?n.uuid+c.db:a(c,"");e(null,r)})}),r.request=d.adapterFun("request",function(e,t){e.headers=c.headers,e.url=a(c,e.url),n(e,t)}),r.compact=d.adapterFun("compact",function(e,t){"function"==typeof e&&(t=e,e={}),e=d.clone(e),n({headers:c.headers,url:a(c,"_compact"),method:"POST"},function(){function n(){r.info(function(r,o){o.compact_running?setTimeout(n,e.interval||200):t()})}"function"==typeof t&&n()})}),r._info=function(e){n({headers:c.headers,method:"GET",url:a(c,"")},function(t,n){t?e(t):(n.host=a(c,""),e(null,n))})},r.get=d.adapterFun("get",function(e,t,r){"function"==typeof t&&(r=t,t={}),t=d.clone(t),void 0===t.auto_encode&&(t.auto_encode=!0);var i=[];t.revs&&i.push("revs=true"),t.revs_info&&i.push("revs_info=true"),t.local_seq&&i.push("local_seq=true"),t.open_revs&&("all"!==t.open_revs&&(t.open_revs=JSON.stringify(t.open_revs)),i.push("open_revs="+t.open_revs)),t.attachments&&i.push("attachments=true"),t.rev&&i.push("rev="+t.rev),t.conflicts&&i.push("conflicts="+t.conflicts),i=i.join("&"),i=""===i?"":"?"+i,t.auto_encode&&(e=o(e));var s={headers:c.headers,method:"GET",url:a(c,e+i)},u=e.split("/");(u.length>1&&"_design"!==u[0]&&"_local"!==u[0]||u.length>2&&"_design"===u[0]&&"_local"!==u[0])&&(s.binary=!0),n(s,function(e,t,n){return e?r(e):void r(null,t,n)})}),r.remove=d.adapterFun("remove",function(e,t,r,i){var s;"string"==typeof t?(s={_id:e,_rev:t},"function"==typeof r&&(i=r,r={})):(s=e,"function"==typeof t?(i=t,r={}):(i=r,r=t));var u=s._rev||r.rev;n({headers:c.headers,method:"DELETE",url:a(c,o(s._id))+"?rev="+u},i)}),r.getAttachment=d.adapterFun("getAttachment",function(e,t,n,i){"function"==typeof n&&(i=n,n={}),n=d.clone(n),void 0===n.auto_encode&&(n.auto_encode=!0),n.auto_encode&&(e=o(e)),n.auto_encode=!1,r.get(e+"/"+t,n,i)}),r.removeAttachment=d.adapterFun("removeAttachment",function(e,t,r,i){n({headers:c.headers,method:"DELETE",url:a(c,o(e)+"/"+t)+"?rev="+r},i)}),r.putAttachment=d.adapterFun("putAttachment",function(e,t,r,i,s,u){"function"==typeof s&&(u=s,s=i,i=r,r=null),"undefined"==typeof s&&(s=i,i=r,r=null);var l=o(e)+"/"+t,f=a(c,l);r&&(f+="?rev="+r);var p={headers:d.clone(c.headers),method:"PUT",url:f,processData:!1,body:i,timeout:6e4};p.headers["Content-Type"]=s,n(p,u)}),r.put=d.adapterFun("put",d.getArguments(function(e){var t,r,s,u=e.shift(),l="_id"in u,p=e.pop();return"object"!=typeof u||Array.isArray(u)?p(f.NOT_AN_OBJECT):(u=d.clone(u),void i(u).then(function(){for(;;)if(t=e.shift(),r=typeof t,"string"!==r||l?"string"!==r||!l||"_rev"in u?"object"===r&&(s=d.clone(t)):u._rev=t:(u._id=t,l=!0),!e.length)break;s=s||{};var i=d.invalidIdError(u._id);if(i)throw i;var f=[];s&&"undefined"!=typeof s.new_edits&&f.push("new_edits="+s.new_edits),f=f.join("&"),""!==f&&(f="?"+f),n({headers:c.headers,method:"PUT",url:a(c,o(u._id))+f,body:u},function(e,t){return e?p(e):(t.ok=!0,void p(null,t))})})["catch"](p))})),r.post=d.adapterFun("post",function(e,t,n){return"function"==typeof t&&(n=t,t={}),t=d.clone(t),"object"!=typeof e?n(f.NOT_AN_OBJECT):("_id"in e||(e._id=d.uuid()),void r.put(e,t,function(e,t){return e?n(e):(t.ok=!0,void n(null,t))}))}),r._bulkDocs=function(e,t,r){"undefined"!=typeof t.new_edits&&(e.new_edits=t.new_edits),d.Promise.all(e.docs.map(i)).then(function(){n({headers:c.headers,method:"POST",url:a(c,"_bulk_docs"),body:e},function(e,t){return e?r(e):(t.forEach(function(e){e.ok=!0}),void r(null,t))})})["catch"](r)},r.allDocs=d.adapterFun("allDocs",function(e,t){"function"==typeof e&&(t=e,e={}),e=d.clone(e);var r,o=[],i="GET";if(e.conflicts&&o.push("conflicts=true"),e.descending&&o.push("descending=true"),e.include_docs&&o.push("include_docs=true"),e.key&&o.push("key="+encodeURIComponent(JSON.stringify(e.key))),e.startkey&&o.push("startkey="+encodeURIComponent(JSON.stringify(e.startkey))),e.endkey&&o.push("endkey="+encodeURIComponent(JSON.stringify(e.endkey))),"undefined"!=typeof e.inclusive_end&&o.push("inclusive_end="+!!e.inclusive_end),"undefined"!=typeof e.limit&&o.push("limit="+e.limit),"undefined"!=typeof e.skip&&o.push("skip="+e.skip),o=o.join("&"),""!==o&&(o="?"+o),"undefined"!=typeof e.keys){var s=2e3,u="keys="+encodeURIComponent(JSON.stringify(e.keys));u.length+o.length+1<=s?o+=(-1!==o.indexOf("?")?"&":"?")+u:(i="POST",r=JSON.stringify({keys:e.keys}))}n({headers:c.headers,method:i,url:a(c,"_all_docs"+o),body:r},t)}),r._changes=function(e){var t="batch_size"in e?e.batch_size:l;e=d.clone(e),e.timeout=e.timeout||3e4;var r={timeout:e.timeout-5e3},o="undefined"!=typeof e.limit?e.limit:!1;0===o&&(o=1);var i;i="returnDocs"in e?e.returnDocs:!0;var s=o;if(e.style&&(r.style=e.style),(e.include_docs||e.filter&&"function"==typeof e.filter)&&(r.include_docs=!0),e.continuous&&(r.feed="longpoll"),e.conflicts&&(r.conflicts=!0),e.descending&&(r.descending=!0),e.filter&&"string"==typeof e.filter&&(r.filter=e.filter,"_view"===e.filter&&e.view&&"string"==typeof e.view&&(r.view=e.view)),e.query_params&&"object"==typeof e.query_params)for(var u in e.query_params)e.query_params.hasOwnProperty(u)&&(r[u]=e.query_params[u]);var p,h,v=function(i,u){if(!e.aborted){r.since=i,e.descending?o&&(r.limit=s):r.limit=!o||s>t?t:s;var l="?"+Object.keys(r).map(function(e){return e+"="+r[e]}).join("&"),d={headers:c.headers,method:"GET",url:a(c,"_changes"+l),timeout:e.timeout};h=i,e.aborted||(p=n(d,u))}},m=10,_=0,y={results:[]},g=function(n,r){if(!e.aborted){var a=0;if(r&&r.results){a=r.results.length,y.last_seq=r.last_seq;var u={};u.query=e.query_params,r.results=r.results.filter(function(t){s--;var n=d.filterChange(e)(t);return n&&(i&&y.results.push(t),d.call(e.onChange,t)),n})}else if(n)return e.aborted=!0,void d.call(e.complete,n);r&&r.last_seq&&(h=r.last_seq);var c=o&&0>=s||r&&t>a||e.descending;if((!e.continuous||o&&0>=s)&&c)d.call(e.complete,null,y);else{n?_+=1:_=0;var l=1<<_,p=m*l,b=e.maximumWait||3e4;if(p>b)return void d.call(e.complete,n||f.UNKNOWN_ERROR);setTimeout(function(){v(h,g)},p)}}};return v(e.since||0,g),{cancel:function(){e.aborted=!0,p&&p.abort()}}},r.revsDiff=d.adapterFun("revsDiff",function(e,t,r){"function"==typeof t&&(r=t,t={}),n({headers:c.headers,method:"POST",url:a(c,"_revs_diff"),body:JSON.stringify(e)},r)}),r._close=function(e){e()},r.destroy=d.adapterFun("destroy",function(e){n({url:a(c,""),method:"DELETE",headers:c.headers},function(t,n){t?(r.emit("error",t),e(t)):(r.emit("destroyed"),e(null,n))})})}var l=25,d=e("../utils"),f=e("../deps/errors");r.options={strictMode:!1,key:["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],q:{name:"queryKey",parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}},c.destroy=d.toPromise(function(e,t,n){var r=s(e,t);t=t||{},"function"==typeof t&&(n=t,t={}),t=d.clone(t),t.headers=r.headers,t.method="DELETE",t.url=a(r,"");var o=t.ajax||{};t=d.extend({},t,o),d.ajax(t,n)}),c.valid=function(){return!0},t.exports=c}).call(this,e("/Users/nolan/workspace/pouchdb/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))},{"../deps/errors":11,"../utils":23,"/Users/nolan/workspace/pouchdb/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":28}],3:[function(e,t){(function(n,r){"use strict";function o(e,t,n){try{e.apply(t,n)}catch(r){window.PouchDB&&window.PouchDB.emit("error",r)}}function i(){if(!y.running&&y.queue.length){y.running=!0;var e=y.queue.shift();e.action(function(t,r){o(e.callback,this,[t,r]),y.running=!1,n.nextTick(i)})}}function s(e){return function(t){var n=t.target&&t.target.error&&t.target.error.name||t.target;e(v.error(v.IDB_ERROR,n,t.type))}}function a(){var e="_pouch__checkModernIdb_"+(r.navigator&&r.navigator.appVersion),t=p.hasLocalStorage()&&r.localStorage[e];if(t)return JSON.parse(t);var n="_pouch__checkModernIdb",o=null===r.indexedDB.open(n,1).onupgradeneeded;return r.indexedDB.deleteDatabase&&r.indexedDB.deleteDatabase(n),p.hasLocalStorage()&&(r.localStorage[e]=JSON.stringify(o)),o}function u(e,t,n){var r={data:m.stringify(e)};return r.winningRev=t,r.deletedOrLocal=n?"1":"0",r.id=e.id,r}function c(e){if(!e)return null;if(!e.data)return e;var t=m.parse(e.data);return t.winningRev=e.winningRev,t.deletedOrLocal="1"===e.deletedOrLocal,t}function l(e,t){var n=this;y.queue.push({action:function(t){d(n,e,t)},callback:t}),i()}function d(e,t,o){function i(e){e.createObjectStore(b,{keyPath:"id"}).createIndex("seq","seq",{unique:!0}),e.createObjectStore(w,{autoIncrement:!0}).createIndex("_doc_id_rev","_doc_id_rev",{unique:!0}),e.createObjectStore(E,{keyPath:"digest"}),e.createObjectStore(S,{keyPath:"id",autoIncrement:!1}),e.createObjectStore(x)}function a(e,t){var n=e.currentTarget.transaction,r=n.objectStore(b);r.createIndex("deletedOrLocal","deletedOrLocal",{unique:!1}),r.openCursor().onsuccess=function(e){var o=e.target.result;if(o){var i=o.value,s=p.isDeleted(i);i.deletedOrLocal=s?"1":"0",r.put(i),o["continue"]()}else t(n)}}function d(e){e.createObjectStore(k,{keyPath:"_id"}).createIndex("_doc_id_rev","_doc_id_rev",{unique:!0})}function f(e,t){t=t||e.currentTarget.transaction;var n=t.objectStore(k),o=t.objectStore(b),i=t.objectStore(w),s=o.openCursor();s.onsuccess=function(e){var t=e.target.result;if(t){var s=t.value,a=s.id,u=p.isLocalId(a),c=h.winningRev(s);if(u){var l=a+"::"+c,d=a+"::",f=a+"::~",v=i.index("_doc_id_rev"),m=r.IDBKeyRange.bound(d,f,!1,!1),_=v.openCursor(m);_.onsuccess=function(e){if(_=e.target.result){var r=_.value;r._doc_id_rev===l&&n.put(r),i["delete"](_.primaryKey),_["continue"]()}else o["delete"](t.primaryKey),t["continue"]()}}else t["continue"]()}}}function m(e,t,n){var o="startkey"in t?t.startkey:!1,i="endkey"in t?t.endkey:!1,s="key"in t?t.key:!1,a=t.skip||0,u="number"==typeof t.limit?t.limit:-1,l=t.inclusive_end!==!1,d="descending"in t&&t.descending?"prev":null,f=!1;d&&o&&i&&(f=i,i=!1);var m=null;try{o&&i?m=r.IDBKeyRange.bound(o,i,!1,!l):o?m=d?r.IDBKeyRange.upperBound(o):r.IDBKeyRange.lowerBound(o):i?m=d?r.IDBKeyRange.lowerBound(i,!l):r.IDBKeyRange.upperBound(i,!l):s&&(m=r.IDBKeyRange.only(s))}catch(_){return"DataError"===_.name&&0===_.code?n(null,{total_rows:e,offset:t.skip,rows:[]}):n(v.error(v.IDB_ERROR,_.name,_.message))}var y=L.transaction([b,w],"readonly");y.oncomplete=function(){n(null,{total_rows:e,offset:t.skip,rows:S})};var g=y.objectStore(b),E=d?g.openCursor(m,d):g.openCursor(m),S=[];E.onsuccess=function(e){function n(e,n){var o={id:e.id,key:e.id,value:{rev:i}};if(t.include_docs){o.doc=n,o.doc._rev=i,o.doc._doc_id_rev&&delete o.doc._doc_id_rev,t.conflicts&&(o.doc._conflicts=h.collectConflicts(e));for(var s in o.doc._attachments)o.doc._attachments.hasOwnProperty(s)&&(o.doc._attachments[s].stub=!0)}var c=p.isDeleted(e,i);if("ok"===t.deleted)c&&(o.value.deleted=!0,o.doc=null),S.push(o);else if(!c&&a--<=0){if(f){if(l&&o.key<f)return;if(!l&&o.key<=f)return}if(S.push(o),0===--u)return}r["continue"]()}if(e.target.result){var r=e.target.result,o=c(r.value),i=o.winningRev||h.winningRev(o);if(t.include_docs){var s=y.objectStore(w).index("_doc_id_rev"),d=o.id+"::"+i;s.get(d).onsuccess=function(e){n(c(r.value),e.target.result)}}else n(o)}}}function y(e){if(-1!==R)return e(null,R);var t,n=L.transaction([b],"readonly"),o=n.objectStore(b).index("deletedOrLocal");o.count(r.IDBKeyRange.only("0")).onsuccess=function(e){t=e.target.result},n.onerror=s(e),n.oncomplete=function(){R=t,e(null,R)}}var g=3,b="document-store",w="by-sequence",E="attach-store",S="meta-store",k="local-store",x="detect-blob-support",q=t.name,T=null,A=null,O=!1,L=null,R=-1;e.type=function(){return"idb"},e._id=p.toPromise(function(e){e(null,A)}),e._bulkDocs=function(t,n,r){function o(e){var t=e.target.result;t.updateSeq=(t.updateSeq||0)+M,j.objectStore(S).put(t)}function i(){++P===C.length&&(j.objectStore(S).get(S).onsuccess=o)}function a(){if(C.length){var t=new p.Map;C.forEach(function(n,r){if(n._id&&p.isLocalId(n._id))return void e[n._deleted?"_removeLocal":"_putLocal"](n,{ctx:j},function(e){F[r]=e?e:{},i()});var o=n.metadata.id;t.has(o)?t.get(o).push([n,r]):t.set(o,[[n,r]])}),t.forEach(function(e,t){function n(){i(),++o<e.length&&r()}function r(){var r=e[o],i=r[0],s=r[1];B.has(t)?g(B.get(t),i,s,n):x(i,s,n)}var o=0;r()})}}function d(e){function t(){++n===C.length&&e()}if(!C.length)return e();var n=0;C.forEach(function(e){if(e._id&&p.isLocalId(e._id))return t();var n=e.metadata.id,r=j.objectStore(b).get(n);r.onsuccess=function(e){var r=c(e.target.result);r&&B.set(n,r),t()}})}function f(){var e=F.map(function(e){if(e._bulk_seq)delete e._bulk_seq;else if(!Object.keys(e).length)return{ok:!0};if(e.error)return e;var t=e.metadata,n=h.winningRev(t);return{ok:!0,id:t.id,rev:n}});l.Changes.notify(q),R=-1,r(null,e)}function m(e,t){if(e.stub)return t();if("string"==typeof e.data){var n;try{n=atob(e.data)}catch(o){var i=v.error(v.BAD_ARG,"Attachments need to be base64 encoded");return r(i)}if(T){var s=e.content_type;n=p.fixBinary(n),e.data=p.createBlob([n],{type:s})}return void p.MD5(n).then(function(n){e.digest="md5-"+n,t()})}var a=new FileReader;a.onloadend=function(){var n=p.arrayBufferToBinaryString(this.result||"");T||(e.data=btoa(n)),p.MD5(n).then(function(n){e.digest="md5-"+n,t()})},a.readAsArrayBuffer(e.data)}function _(e){function t(){n++,C.length===n&&e()}if(!C.length)return e();var n=0;C.forEach(function(e){function n(){o++,o===r.length&&t()}var r=e.data&&e.data._attachments?Object.keys(e.data._attachments):[];if(!r.length)return t();var o=0;for(var i in e.data._attachments)e.data._attachments.hasOwnProperty(i)&&m(e.data._attachments[i],n)})}function y(e,t,n,r,o){function i(e){c||(e?(c=e,r(c)):l===d.length&&a())}function s(e){l++,i(e)}function a(){function i(i){var s=e.metadata;s.seq=i.target.result,delete s.rev;var a=u(s,t,n),c=j.objectStore(b).put(a);c.onsuccess=function(){delete s.deletedOrLocal,delete s.winningRev,F[o]=e,B.set(e.metadata.id,e.metadata),p.call(r)}}M++,e.data._doc_id_rev=e.data._id+"::"+e.data._rev;var s=j.objectStore(w),a=s.index("_doc_id_rev"),c=s.put(e.data);c.onsuccess=i,c.onerror=function(t){t.preventDefault(),t.stopPropagation();var n=a.getKey(e.data._doc_id_rev);n.onsuccess=function(t){var n=s.put(e.data,t.target.result);M--,n.onsuccess=i}}}var c=null,l=0;e.data._id=e.metadata.id,e.data._rev=e.metadata.rev,n&&(e.data._deleted=!0);var d=e.data._attachments?Object.keys(e.data._attachments):[];for(var f in e.data._attachments)if(e.data._attachments[f].stub)l++,i();else{var h=e.data._attachments[f].data;delete e.data._attachments[f].data;var v=e.data._attachments[f].digest;O(e,v,h,s)}d.length||a()}function g(e,t,n,r){var o=h.merge(e.rev_tree,t.metadata.rev_tree[0],1e3),i=p.isDeleted(e),s=p.isDeleted(t.metadata),a=i&&s&&I||!i&&I&&"new_leaf"!==o.conflicts;if(a)return F[n]=A(v.REV_CONFLICT,t._bulk_seq),r();t.metadata.rev_tree=o.tree;var u=h.winningRev(t.metadata);s=p.isDeleted(t.metadata,u),y(t,u,s,r,n)}function x(e,t,r){var o=h.winningRev(e.metadata),i=p.isDeleted(e.metadata,o);return"was_delete"in n&&i?(F[t]=v.MISSING_DOC,r()):void y(e,o,i,r,t)}function A(e,t){return e._bulk_seq=t,e}function O(e,t,n,r){var o=j.objectStore(E);o.get(t).onsuccess=function(i){var s=i.target.result&&i.target.result.refs||{},a=[e.metadata.id,e.metadata.rev].join("@"),u={digest:t,body:n,refs:s};u.refs[a]=!0,o.put(u).onsuccess=function(){p.call(r)}}}var I=n.new_edits,D=t.docs,C=D.map(function(e,t){if(e._id&&p.isLocalId(e._id))return e;var n=p.parseDoc(e,I);return n._bulk_seq=t,n}),N=C.filter(function(e){return e.error});if(N.length)return r(N[0]);var j,F=new Array(C.length),B=new p.Map,M=0,P=0;_(function(){var e=[b,w,E,S,k];j=L.transaction(e,"readwrite"),j.onerror=s(r),j.ontimeout=s(r),j.oncomplete=f,d(a)})},e._get=function(e,t,n){function r(){n(s,{doc:o,metadata:i,ctx:a})}var o,i,s,a;t=p.clone(t),a=t.ctx?t.ctx:L.transaction([b,w,E],"readonly"),a.objectStore(b).get(e).onsuccess=function(e){if(i=c(e.target.result),!i)return s=v.MISSING_DOC,r();if(p.isDeleted(i)&&!t.rev)return s=v.error(v.MISSING_DOC,"deleted"),r();var n=a.objectStore(w),u=t.rev||i.winningRev||h.winningRev(i),l=i.id+"::"+u;n.index("_doc_id_rev").get(l).onsuccess=function(e){return o=e.target.result,o&&o._doc_id_rev&&delete o._doc_id_rev,o?void r():(s=v.MISSING_DOC,r())}}},e._getAttachment=function(e,t,n){var r,o;t=p.clone(t),o=t.ctx?t.ctx:L.transaction([b,w,E],"readonly");var i=e.digest,s=e.content_type;o.objectStore(E).get(i).onsuccess=function(e){var o=e.target.result.body;if(t.encode)if(T){var i=new FileReader;i.onloadend=function(){var e=p.arrayBufferToBinaryString(this.result||"");r=btoa(e),n(null,r)},i.readAsArrayBuffer(o)}else r=o,n(null,r);else T?r=o||p.createBlob([""],{type:s}):(o=p.fixBinary(atob(o)),r=p.createBlob([o],{type:s})),n(null,r)}},e._allDocs=function(e,t){y(function(n,r){return n?t(n):0===e.limit?t(null,{total_rows:r,offset:e.skip,rows:[]}):void m(r,e,t)})},e._info=function(e){y(function(t,n){if(t)return e(t);if(null===L){var r=new Error("db isn't open");return r.id="idbNull",e(r)}var o=0,i=L.transaction([S],"readonly");i.objectStore(S).get(S).onsuccess=function(e){o=e.target.result&&e.target.result.updateSeq||0},i.oncomplete=function(){e(null,{doc_count:n,update_seq:o})}})},e._changes=function(t){function n(){v=L.transaction([b,w],"readonly"),v.oncomplete=i;var e;e=a?v.objectStore(w).openCursor(r.IDBKeyRange.lowerBound(t.since,!0),a):v.objectStore(w).openCursor(r.IDBKeyRange.lowerBound(t.since,!0)),e.onsuccess=o,e.onerror=onerror}function o(e){var n=e.target.result;if(n){var r=n.value;if(t.doc_ids&&-1===t.doc_ids.indexOf(r._id))return n["continue"]();var o=v.objectStore(b);o.get(r._id).onsuccess=function(e){var o=c(e.target.result);u<o.seq&&(u=o.seq);var i=o.winningRev||h.winningRev(o);if(r._rev!==i)return n["continue"]();delete r._doc_id_rev;var s=t.processChange(r,o,t);s.seq=n.key,y(s)&&(_++,f&&m.push(s),t.onChange(s)),_!==d&&n["continue"]()}}}function i(){t.continuous||t.complete(null,{results:m,last_seq:u})}if(t=p.clone(t),t.continuous){var s=q+":"+p.uuid();return l.Changes.addListener(q,s,e,t),l.Changes.notify(q),{cancel:function(){l.Changes.removeListener(q,s)}}}var a=t.descending?"prev":null,u=0;t.since=t.since&&!a?t.since:0;var d="limit"in t?t.limit:-1;0===d&&(d=1);var f;f="returnDocs"in t?t.returnDocs:!0;var v,m=[],_=0,y=p.filterChange(t);n()},e._close=function(e){return null===L?e(v.NOT_OPEN):(L.close(),delete _[q],L=null,void e())},e._getRevisionTree=function(e,t){var n=L.transaction([b],"readonly"),r=n.objectStore(b).get(e);r.onsuccess=function(e){var n=c(e.target.result);n?t(null,n.rev_tree):t(v.MISSING_DOC)}},e._doCompaction=function(e,t,n,r){var o=L.transaction([b,w],"readwrite"),i=o.objectStore(b);i.get(e).onsuccess=function(r){var i=c(r.target.result);i.rev_tree=t;var s=n.length;n.forEach(function(t){var n=o.objectStore(w).index("_doc_id_rev"),r=e+"::"+t;n.getKey(r).onsuccess=function(e){var t=e.target.result;if(t&&(o.objectStore(w)["delete"](t),s--,!s)){var n=i.winningRev||h.winningRev(i),r=i.deletedOrLocal;o.objectStore(b).put(u(i,n,r))}}})},o.oncomplete=function(){p.call(r)}},e._getLocal=function(e,t){var n=L.transaction([k],"readonly"),r=n.objectStore(k).get(e);r.onerror=s(t),r.onsuccess=function(e){var n=e.target.result;n?(delete n._doc_id_rev,t(null,n)):t(v.MISSING_DOC)}},e._putLocal=function(e,t,n){"function"==typeof t&&(n=t,t={}),delete e._revisions;var r=e._rev,o=e._id;e._rev=r?"0-"+(parseInt(r.split("-")[1],10)+1):"0-1",e._doc_id_rev=o+"::"+e._rev;var i,a=t.ctx;a||(a=L.transaction([k],"readwrite"),a.onerror=s(n),a.oncomplete=function(){i&&n(null,i)});var u,c=a.objectStore(k);if(r){var l=c.index("_doc_id_rev"),d=o+"::"+r;u=l.get(d),u.onsuccess=function(r){if(r.target.result){var o=c.put(e);o.onsuccess=function(){i={ok:!0,id:e._id,rev:e._rev},t.ctx&&n(null,i)}}else n(v.REV_CONFLICT)}}else u=c.get(o),u.onsuccess=function(r){if(r.target.result)n(v.REV_CONFLICT);
else{var o=c.put(e);o.onsuccess=function(){i={ok:!0,id:e._id,rev:e._rev},t.ctx&&n(null,i)}}}},e._removeLocal=function(e,t){var n,r=L.transaction([k],"readwrite");r.oncomplete=function(){n&&t(null,n)};var o=e._id+"::"+e._rev,i=r.objectStore(k),a=i.index("_doc_id_rev"),u=a.get(o);u.onerror=s(t),u.onsuccess=function(e){var r=e.target.result;if(r){var s=a.getKey(o);s.onsuccess=function(e){var t=e.target.result;i["delete"](t),n={ok:!0,id:r._id,rev:"0-0"}}}else t(v.MISSING_DOC)}};var I=_[q];if(I)return L=I.idb,T=I.blobSupport,A=I.instanceId,O=I.idStored,void n.nextTick(function(){o(null,e)});var D=r.indexedDB.open(q,g);"openReqList"in l||(l.openReqList={}),l.openReqList[q]=D,D.onupgradeneeded=function(e){var t=e.target.result;e.oldVersion<1&&i(t),e.oldVersion<3&&(d(t),e.oldVersion<2?a(e,function(t){f(e,t)}):f(e))},D.onsuccess=function(t){L=t.target.result,L.onversionchange=function(){L.close(),delete _[q]},L.onabort=function(){L.close(),delete _[q]};var n=L.transaction([S,x],"readwrite"),r=n.objectStore(S).get(S);r.onsuccess=function(t){var r=function(){null!==T&&O&&(_[q]={idb:L,blobSupport:T,instanceId:A,idStored:O,loaded:!0},o(null,e))},i=t.target.result||{id:S};q+"_id"in i?(A=i[q+"_id"],O=!0,r()):(A=p.uuid(),i[q+"_id"]=A,n.objectStore(S).put(i).onsuccess=function(){O=!0,r()});try{var s=p.createBlob([""],{type:"image/png"});n.objectStore(x).put(s,"key"),n.oncomplete=function(){n=L.transaction([S,x],"readwrite");var e=n.objectStore(x).get("key");e.onsuccess=function(e){var t=e.target.result,n=URL.createObjectURL(t);p.ajax({url:n,cache:!0,binary:!0},function(e,t){T=e&&405===e.status?!0:!(!t||"image/png"!==t.type),r()})}}}catch(a){T=!1,r()}}},D.onerror=s(o)}function f(e,t,n){"openReqList"in l||(l.openReqList={}),l.Changes.removeAllListeners(e),l.openReqList[e]&&l.openReqList[e].result&&l.openReqList[e].result.close();var o=r.indexedDB.deleteDatabase(e);o.onsuccess=function(){l.openReqList[e]&&(l.openReqList[e]=null),p.hasLocalStorage()&&e in r.localStorage&&delete r.localStorage[e],delete _[e],n(null,{ok:!0})},o.onerror=s(n)}var p=e("../utils"),h=e("../merge"),v=e("../deps/errors"),m=e("vuvuzela"),_={},y={running:!1,queue:[]};l.valid=function(){return r.indexedDB&&a()},l.destroy=p.toPromise(function(e,t,n){y.queue.push({action:function(n){f(e,t,n)},callback:n}),i()}),l.Changes=new p.Changes,t.exports=l}).call(this,e("/Users/nolan/workspace/pouchdb/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../deps/errors":11,"../merge":18,"../utils":23,"/Users/nolan/workspace/pouchdb/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":28,vuvuzela:57}],4:[function(e,t){t.exports=["idb","websql"]},{}],5:[function(e,t){(function(n){"use strict";function r(e){return"'"+e+"'"}function o(e,t,n,r,o){return"SELECT "+e+" FROM "+("string"==typeof t?t:t.join(" JOIN "))+(n?" ON "+n:"")+(r?" WHERE "+("string"==typeof r?r:r.join(" AND ")):"")+(o?" ORDER BY "+o:"")}function i(e){return function(t){var n=t&&t.constructor.toString().match(/function ([^\(]+)/),r=n&&n[1]||t.type,o=t.target||t.message;e(h.error(h.WSQ_ERROR,o,r))}}function s(e){return decodeURIComponent(window.escape(e))}function a(e,t){for(var n="",r="UTF-8"===t?2:4,o=0,i=e.length;i>o;o+=r){var a=e.substring(o,o+r);4===r&&(a=a.substring(2,4)+a.substring(0,2)),n+=String.fromCharCode(parseInt(a,16))}return n="UTF-8"===t?s(n):n}function u(e){return delete e._id,delete e._rev,JSON.stringify(e)}function c(e,t,n){return e=JSON.parse(e),e._id=t,e._rev=n,e}function l(e){if("size"in e)return 1e6*e.size;var t=/Android/.test(window.navigator.userAgent);return t?5e6:1}function d(e,t){function r(){f.hasLocalStorage()&&(n.localStorage["_pouch__websqldb_"+M]=!0),t(null,F)}function s(e,t){e.executeSql(T),e.executeSql("ALTER TABLE "+w+" ADD COLUMN deleted TINYINT(1) DEFAULT 0",[],function(){e.executeSql(x),e.executeSql("ALTER TABLE "+b+" ADD COLUMN local TINYINT(1) DEFAULT 0",[],function(){e.executeSql("CREATE INDEX IF NOT EXISTS 'doc-store-local-idx' ON "+b+" (local, id)");var n="SELECT "+b+".winningseq AS seq, "+b+".json AS metadata FROM "+w+" JOIN "+b+" ON "+w+".seq = "+b+".winningseq";e.executeSql(n,[],function(e,n){for(var r=[],o=[],i=0;i<n.rows.length;i++){var s=n.rows.item(i),a=s.seq,u=JSON.parse(s.metadata);f.isDeleted(u)&&r.push(a),f.isLocalId(u.id)&&o.push(u.id)}e.executeSql("UPDATE "+b+"SET local = 1 WHERE id IN ("+o.map(function(){return"?"}).join(",")+")",o,function(){e.executeSql("UPDATE "+w+" SET deleted = 1 WHERE seq IN ("+r.map(function(){return"?"}).join(",")+")",r,t)})})})})}function m(e,t){var n="CREATE TABLE IF NOT EXISTS "+S+" (id UNIQUE, rev, json)";e.executeSql(n,[],function(){var n="SELECT "+b+".id AS id, "+w+".json AS data FROM "+w+" JOIN "+b+" ON "+w+".seq = "+b+".winningseq WHERE local = 1";e.executeSql(n,[],function(e,n){function r(){if(!o.length)return t();var n=o.shift(),i=JSON.parse(n.data)._rev;e.executeSql("INSERT INTO "+S+" (id, rev, json) VALUES (?,?,?)",[n.id,i,n.data],function(e){e.executeSql("DELETE FROM "+b+" WHERE id=?",[n.id],function(e){e.executeSql("DELETE FROM "+w+" WHERE seq=?",[n.seq],function(){r()})})})}for(var o=[],i=0;i<n.rows.length;i++)o.push(n.rows.item(i));r()})})}function L(e,t){function n(n,r){function o(){if(!n.length)return t();var i=n.shift(),s=a(i.hex,r),u=s.lastIndexOf("::"),c=s.substring(0,u),l=s.substring(u+2),d="UPDATE "+w+" SET doc_id=?, rev=? WHERE doc_id_rev=?";e.executeSql(d,[c,l,s],function(){o()})}o()}var r="ALTER TABLE "+w+" ADD COLUMN doc_id";e.executeSql(r,[],function(e){var t="ALTER TABLE "+w+" ADD COLUMN rev";e.executeSql(t,[],function(e){e.executeSql(q,[],function(e){var t="SELECT hex(doc_id_rev) as hex FROM "+w;e.executeSql(t,[],function(e,t){for(var r=[],o=0;o<t.rows.length;o++)r.push(t.rows.item(o));e.executeSql("SELECT dbid, hex(dbid) AS hexId FROM "+k,[],function(e,t){var o=t.rows.item(0).dbid,i=t.rows.item(0).hexId,s=i.length===2*o.length?"UTF-8":"UTF-16";n(r,s)})})})})})}function R(e){for(;U.length>0;){var t=U.pop();t(null,B)}I(e)}function I(e){e.executeSql("SELECT dbid, hex(dbid) AS hexId FROM "+k,[],function(e,t){var n=t.rows.item(0).dbid,r=t.rows.item(0).hexId;j=r.length===2*n.length?"UTF-8":"UTF-16"})}function D(e,t){if(0===t){var n="CREATE TABLE IF NOT EXISTS "+k+" (update_seq INTEGER, dbid, db_version INTEGER)",r="CREATE TABLE IF NOT EXISTS "+E+" (digest, json, body BLOB)",o="CREATE TABLE IF NOT EXISTS "+b+" (id unique, json, winningseq)",i="CREATE TABLE IF NOT EXISTS "+w+" (seq INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, json, deleted TINYINT(1), doc_id, rev)",a="CREATE TABLE IF NOT EXISTS "+S+" (id UNIQUE, rev, json)";e.executeSql(r),e.executeSql(a),e.executeSql(o,[],function(){e.executeSql(T),e.executeSql(i,[],function(){e.executeSql(x),e.executeSql(q),e.executeSql(n,[],function(){var t="INSERT INTO "+k+" (update_seq, db_version, dbid) VALUES (?, ?, ?)";B=f.uuid();var n=[0,g,B];e.executeSql(t,n,function(e){R(e)})})})})}else{var u=function(){var n=g>t;n&&e.executeSql("UPDATE "+k+" SET db_version = "+g);var r="SELECT dbid FROM "+k;e.executeSql(r,[],function(e,t){B=t.rows.item(0).dbid,R(e)})};switch(t){case 1:s(e,function(){m(e,function(){L(e,u)})});break;case 2:m(e,function(){L(e,u)});break;case 3:L(e,u);break;default:u()}}}function C(){J.transaction(function(e){e.executeSql("SELECT sql FROM sqlite_master WHERE tbl_name = "+k,[],function(e,t){t.rows.length?/db_version/.test(t.rows.item(0).sql)?e.executeSql("SELECT db_version FROM "+k,[],function(e,t){var n=t.rows.item(0).db_version;D(e,n)}):e.executeSql("ALTER TABLE "+k+" ADD COLUMN db_version INTEGER",[],function(){D(e,1)}):D(e,0)})},i(t),r)}function N(e,t){if(-1!==G)return t(G);var n=o("COUNT("+b+".id) AS 'num'",[b,w],A,w+".deleted=0");e.executeSql(n,[],function(e,n){G=n.rows.item(0).num,t(G)})}var j,F=this,B=null,M=e.name,P=l(e),U=[],G=-1,J=_(M,y,M,P);return J?("function"!=typeof J.readTransaction&&(J.readTransaction=J.transaction),f.isCordova()&&"undefined"!=typeof n?n.addEventListener(M+"_pouch",function V(){n.removeEventListener(M+"_pouch",V,!1),C()},!1):C(),F.type=function(){return"websql"},F._id=f.toPromise(function(e){e(null,B)}),F._info=function(e){J.readTransaction(function(t){N(t,function(n){var r="SELECT update_seq FROM "+k;t.executeSql(r,[],function(t,r){var o=r.rows.item(0).update_seq;e(null,{doc_count:n,update_seq:o})})})},i(e))},F._bulkDocs=function(e,t,n){function r(){var e=R.map(function(e){if(e._bulk_seq)delete e._bulk_seq;else if(!Object.keys(e).length)return{ok:!0};if(e.error)return e;var t=e.metadata,n=p.winningRev(t);return{ok:!0,id:t.id,rev:n}});d.Changes.notify(M);var t="SELECT update_seq FROM "+k;L.executeSql(t,[],function(t,r){var o=r.rows.item(0).update_seq+I,i="UPDATE "+k+" SET update_seq=?";t.executeSql(i,[o],function(){n(null,e)})})}function s(e,t){if(e.stub)return t();if("string"==typeof e.data){try{e.data=atob(e.data)}catch(r){var o=h.error(h.BAD_ARG,"Attachments need to be base64 encoded");return n(o)}var i=f.fixBinary(e.data);e.data=f.createBlob([i],{type:e.content_type})}var s=new FileReader;s.onloadend=function(){var n=f.arrayBufferToBinaryString(this.result);e.data=n,f.MD5(n).then(function(n){e.digest="md5-"+n,t()})},s.readAsArrayBuffer(e.data)}function a(e){function t(){n++,A.length===n&&e()}if(!A.length)return e();var n=0;A.forEach(function(e){function n(){o++,o===r.length&&t()}var r=e.data&&e.data._attachments?Object.keys(e.data._attachments):[],o=0;if(!r.length)return t();for(var i in e.data._attachments)e.data._attachments.hasOwnProperty(i)&&s(e.data._attachments[i],n)})}function c(e,t,n,r,i,s){function a(){I++;var t=e.data,r=n?1:0,i=t._id,s=t._rev,a=u(t),c="INSERT INTO "+w+" (doc_id, rev, json, deleted) VALUES (?, ?, ?, ?);",l=[i,s,a,r];L.executeSql(c,l,function(e,t){d(e,t.insertId)},function(){var e=o("seq",w,null,"doc_id=? AND rev=?");return L.executeSql(e,[i,s],function(e,t){var n=t.rows.item(0).seq,o="UPDATE "+w+" SET json=?, deleted=? WHERE doc_id=? AND rev=?;",u=[a,r,i,s];e.executeSql(o,u,function(e){I--,d(e,n)})}),!1})}function c(e){f||(e?(f=e,r(f)):p===h.length&&a())}function l(e){p++,c(e)}function d(n,o){e.metadata.seq=o,delete e.metadata.rev;var a=i?"UPDATE "+b+" SET json=?, winningseq=(SELECT seq FROM "+w+" WHERE doc_id="+b+".id AND rev=?) WHERE id=?":"INSERT INTO "+b+" (id, winningseq, json) VALUES (?, ?, ?);",u=v.stringify(e.metadata),c=e.metadata.id,l=i?[u,t,c]:[c,o,u];n.executeSql(a,l,function(){R[s]=e,D.set(c,e.metadata),r()})}var f=null,p=0;e.data._id=e.metadata.id,e.data._rev=e.metadata.rev,n&&(e.data._deleted=!0);var h=e.data._attachments?Object.keys(e.data._attachments):[];for(var m in e.data._attachments)if(e.data._attachments[m].stub)p++,c();else{var _=e.data._attachments[m].data;delete e.data._attachments[m].data;var y=e.data._attachments[m].digest;x(e,y,_,l)}h.length||a()}function l(e,t,n,r){var o=p.merge(e.rev_tree,t.metadata.rev_tree[0],1e3),i=f.isDeleted(t.metadata),s=f.isDeleted(e),a=s&&i&&q||!s&&q&&"new_leaf"!==o.conflicts;if(a)return R[n]=S(h.REV_CONFLICT,t._bulk_seq),r();t.metadata.rev_tree=o.tree;var u=p.winningRev(t.metadata);i=f.isDeleted(t.metadata,u),c(t,u,i,r,!0,n)}function m(e,n,r){var o=p.winningRev(e.metadata),i=f.isDeleted(e.metadata,o);return"was_delete"in t&&i?(R[n]=h.MISSING_DOC,r()):void c(e,o,i,r,!1,n)}function _(){++C===A.length&&r()}function y(){if(!A.length)return r();var e=new f.Map;A.forEach(function(t,n){if(t._id&&f.isLocalId(t._id))return void F[t._deleted?"_removeLocal":"_putLocal"](t,{ctx:L},function(e){R[n]=e?e:{},_()});var r=t.metadata.id;e.has(r)?e.get(r).push([t,n]):e.set(r,[[t,n]])}),e.forEach(function(e,t){function n(){_(),++o<e.length&&r()}function r(){var r=e[o],i=r[0],s=r[1];D.has(t)?l(D.get(t),i,s,n):m(i,s,n)}var o=0;r()})}function g(e){function t(){++n===A.length&&e()}if(!A.length)return e();var n=0;A.forEach(function(e){if(e._id&&f.isLocalId(e._id))return t();var n=e.metadata.id;L.executeSql("SELECT json FROM "+b+" WHERE id = ?",[n],function(e,r){if(r.rows.length){var o=v.parse(r.rows.item(0).json);D.set(n,o)}t()})})}function S(e,t){return e._bulk_seq=t,e}function x(e,t,n,r){var o=[e.metadata.id,e.metadata.rev].join("@"),i={digest:t},s="SELECT digest, json FROM "+E+" WHERE digest=?";L.executeSql(s,[t],function(e,a){a.rows.length?(i.refs=JSON.parse(a.rows.item(0).json).refs,s="UPDATE "+E+" SET json=?, body=? WHERE digest=?",e.executeSql(s,[JSON.stringify(i),n,t],function(){r()})):(i.refs={},i.refs[o]=!0,s="INSERT INTO "+E+"(digest, json, body) VALUES (?, ?, ?)",e.executeSql(s,[t,JSON.stringify(i),n],function(){r()}))})}var q=t.new_edits,T=e.docs,A=T.map(function(e,t){if(e._id&&f.isLocalId(e._id))return e;var n=f.parseDoc(e,q);return n._bulk_seq=t,n}),O=A.filter(function(e){return e.error});if(O.length)return n(O[0]);var L,R=new Array(A.length),I=0,D=new f.Map,C=0;a(function(){J.transaction(function(e){L=e,g(y)},i(n),function(){G=-1})})},F._get=function(e,t,n){function r(){n(a,{doc:i,metadata:s,ctx:d})}t=f.clone(t);var i,s,a;if(!t.ctx)return void J.readTransaction(function(r){t.ctx=r,F._get(e,t,n)});var u,l,d=t.ctx;t.rev?(u=o(O,[b,w],b+".id="+w+".doc_id",[w+".doc_id=?",w+".rev=?"]),l=[e,t.rev]):(u=o(O,[b,w],A,b+".id=?"),l=[e]),d.executeSql(u,l,function(e,n){if(!n.rows.length)return a=h.MISSING_DOC,r();var o=n.rows.item(0);return s=v.parse(o.metadata),o.deleted&&!t.rev?(a=h.error(h.MISSING_DOC,"deleted"),r()):(i=c(o.data,s.id,o.rev),void r())})},F._allDocs=function(e,t){var n,r=[],s="startkey"in e?e.startkey:!1,a="endkey"in e?e.endkey:!1,u="key"in e?e.key:!1,l="descending"in e?e.descending:!1,d="limit"in e?e.limit:-1,f="skip"in e?e.skip:0,h=e.inclusive_end!==!1,m=[],_=[];if(u!==!1)_.push(b+".id = ?"),m.push(u);else if(s!==!1||a!==!1){if(s!==!1&&(_.push(b+".id "+(l?"<=":">=")+" ?"),m.push(s)),a!==!1){var y=l?">":"<";h&&(y+="="),_.push(b+".id "+y+" ?"),m.push(a)}u!==!1&&(_.push(b+".id = ?"),m.push(u))}"ok"!==e.deleted&&_.push(w+".deleted = 0"),J.readTransaction(function(t){N(t,function(i){if(n=i,0!==d){var s=o(O,[b,w],A,_,b+".id "+(l?"DESC":"ASC"));s+=" LIMIT "+d+" OFFSET "+f,t.executeSql(s,m,function(t,n){for(var o=0,i=n.rows.length;i>o;o++){var s=n.rows.item(o),a=v.parse(s.metadata),u=c(s.data,a.id,s.rev),l=u._rev,d={id:a.id,key:a.id,value:{rev:l}};if(e.include_docs){d.doc=u,d.doc._rev=l,e.conflicts&&(d.doc._conflicts=p.collectConflicts(a));for(var f in d.doc._attachments)d.doc._attachments.hasOwnProperty(f)&&(d.doc._attachments[f].stub=!0)}if(s.deleted){if("ok"!==e.deleted)continue;d.value.deleted=!0,d.doc=null}r.push(d)}})}})},i(t),function(){t(null,{total_rows:n,offset:e.skip,rows:r})})},F._changes=function(e){function t(){var t=[b+".winningseq > "+e.since],n=[];e.doc_ids&&(t.push(b+".id IN ("+e.doc_ids.map(function(){return"?"}).join(",")+")"),n=e.doc_ids);var l=o(O,[b,w],A,t,b+".winningseq "+(r?"DESC":"ASC")),d=f.filterChange(e);e.view||e.filter||(l+=" LIMIT "+i),J.readTransaction(function(t){t.executeSql(l,n,function(t,n){for(var r=0,o=0,l=n.rows.length;l>o;o++){var f=n.rows.item(o),p=v.parse(f.metadata);r<f.seq&&(r=f.seq);var h=c(f.data,p.id,f.rev),m=e.processChange(h,p,e);if(m.seq=f.seq,d(m)&&(u++,s&&a.push(m),e.onChange(m)),u===i)break}e.continuous||e.complete(null,{results:a,last_seq:r})})})}if(e=f.clone(e),e.continuous){var n=M+":"+f.uuid();return d.Changes.addListener(M,n,F,e),d.Changes.notify(M),{cancel:function(){d.Changes.removeListener(M,n)}}}var r=e.descending;e.since=e.since&&!r?e.since:0;var i="limit"in e?e.limit:-1;0===i&&(i=1);var s;s="returnDocs"in e?e.returnDocs:!0;var a=[],u=0;t()},F._close=function(e){e()},F._getAttachment=function(e,t,n){var r,o=t.ctx,i=e.digest,s=e.content_type,u="SELECT hex(body) as body FROM "+E+" WHERE digest=?";o.executeSql(u,[i],function(e,o){var i=a(o.rows.item(0).body,j);t.encode?r=btoa(i):(i=f.fixBinary(i),r=f.createBlob([i],{type:s})),n(null,r)})},F._getRevisionTree=function(e,t){J.readTransaction(function(n){var r="SELECT json AS metadata FROM "+b+" WHERE id = ?";n.executeSql(r,[e],function(e,n){if(n.rows.length){var r=v.parse(n.rows.item(0).metadata);t(null,r.rev_tree)}else t(h.MISSING_DOC)})})},F._doCompaction=function(e,t,n,r){return n.length?void J.transaction(function(o){var i="SELECT json AS metadata FROM "+b+" WHERE id = ?";o.executeSql(i,[e],function(o,i){if(!i.rows.length)return f.call(r);var s=v.parse(i.rows.item(0).metadata);s.rev_tree=t;var a=0;n.forEach(function(t){var i="DELETE FROM "+w+" WHERE doc_id=? AND rev=?";o.executeSql(i,[e,t],function(t){if(++a===n.length){var o="UPDATE "+b+" SET json = ? WHERE id = ?";t.executeSql(o,[v.stringify(s),e],function(){r()})}})})})}):r()},F._getLocal=function(e,t){J.readTransaction(function(n){var r="SELECT json, rev FROM "+S+" WHERE id=?";n.executeSql(r,[e],function(n,r){if(r.rows.length){var o=r.rows.item(0),i=c(o.json,e,o.rev);t(null,i)}else t(h.MISSING_DOC)})})},F._putLocal=function(e,t,n){function r(e){var r,i;s?(r="UPDATE "+S+" SET rev=?, json=? WHERE id=? AND rev=?",i=[o,l,a,s]):(r="INSERT INTO "+S+" (id, rev, json) VALUES (?,?,?)",i=[a,o,l]),e.executeSql(r,i,function(e,r){r.rowsAffected?(c={ok:!0,id:a,rev:o},t.ctx&&n(null,c)):n(h.REV_CONFLICT)},function(){return n(h.REV_CONFLICT),!1})}"function"==typeof t&&(n=t,t={}),delete e._revisions;var o,s=e._rev,a=e._id;o=e._rev=s?"0-"+(parseInt(s.split("-")[1],10)+1):"0-1";var c,l=u(e);t.ctx?r(t.ctx):J.transaction(function(e){r(e)},i(n),function(){c&&n(null,c)})},void(F._removeLocal=function(e,t){var n;J.transaction(function(r){var o="DELETE FROM "+S+" WHERE id=? AND rev=?",i=[e._id,e._rev];r.executeSql(o,i,function(r,o){return o.rowsAffected?void(n={ok:!0,id:e._id,rev:"0-0"}):t(h.REV_CONFLICT)})},i(t),function(){t(null,n)})})):t(h.UNKNOWN_ERROR)}var f=e("../utils"),p=e("../merge"),h=e("../deps/errors"),v=e("vuvuzela"),m={},_=f.getArguments(function(e){if("undefined"!=typeof n){if(n.navigator&&n.navigator.sqlitePlugin&&n.navigator.sqlitePlugin.openDatabase)return navigator.sqlitePlugin.openDatabase.apply(navigator.sqlitePlugin,e);if(n.sqlitePlugin&&n.sqlitePlugin.openDatabase)return n.sqlitePlugin.openDatabase.apply(n.sqlitePlugin,e);var t=m[e[0]];return t||(t=m[e[0]]=n.openDatabase.apply(n,e)),t}}),y=1,g=4,b=r("document-store"),w=r("by-sequence"),E=r("attach-store"),S=r("local-store"),k=r("metadata-store"),x="CREATE INDEX IF NOT EXISTS 'by-seq-deleted-idx' ON "+w+" (seq, deleted)",q="CREATE UNIQUE INDEX IF NOT EXISTS 'by-seq-doc-id-rev' ON "+w+" (doc_id, rev)",T="CREATE INDEX IF NOT EXISTS 'doc-winningseq-idx' ON "+b+" (winningseq)",A=w+".seq = "+b+".winningseq",O=w+".seq AS seq, "+w+".deleted AS deleted, "+w+".json AS data, "+w+".rev AS rev, "+b+".json AS metadata";d.valid=function(){if("undefined"!=typeof n){if(n.navigator&&n.navigator.sqlitePlugin&&n.navigator.sqlitePlugin.openDatabase)return!0;if(n.sqlitePlugin&&n.sqlitePlugin.openDatabase)return!0;if(n.openDatabase)return!0}return!1},d.destroy=f.toPromise(function(e,t,r){d.Changes.removeAllListeners(e);var o=l(t),s=_(e,y,e,o);s.transaction(function(e){var t=[b,w,E,k,S];t.forEach(function(t){e.executeSql("DROP TABLE IF EXISTS "+t,[])})},i(r),function(){f.hasLocalStorage()&&(delete n.localStorage["_pouch__websqldb_"+e],delete n.localStorage[e]),r(null,{ok:!0})})}),d.Changes=new f.Changes,t.exports=d}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../deps/errors":11,"../merge":18,"../utils":23,vuvuzela:57}],6:[function(e,t){"use strict";function n(e,t,n){function r(){i.cancel()}a.call(this);var i=this;this.db=e,t=t?o.clone(t):{};var s=n||t.complete||function(){},u=t.complete=o.once(function(t,n){t?i.emit("error",t):i.emit("complete",n),i.removeAllListeners(),e.removeListener("destroyed",r)});s&&(i.on("complete",function(e){s(null,e)}),i.on("error",function(e){s(e)}));var c=t.onChange;c&&i.on("change",c),e.once("destroyed",r),t.onChange=function(e){t.isCancelled||(i.emit("change",e),i.startSeq&&i.startSeq<=e.seq&&(i.emit("uptodate"),i.startSeq=!1),e.deleted?i.emit("delete",e):1===e.changes.length&&"1-"===e.changes[0].rev.slice(0,2)?i.emit("create",e):i.emit("update",e))};var l=new o.Promise(function(e,n){t.complete=function(t,r){t?n(t):e(r)}});i.once("cancel",function(){c&&i.removeListener("change",c),t.complete(null,{status:"cancelled"})}),this.then=l.then.bind(l),this["catch"]=l["catch"].bind(l),this.then(function(e){u(null,e)},u),e.taskqueue.isReady?i.doChanges(t):e.taskqueue.addTask(function(){i.isCancelled?i.emit("cancel"):i.doChanges(t)})}function r(e,t,n){var r=[{rev:e._rev}];"all_docs"===n.style&&(r=i.collectLeaves(t.rev_tree).map(function(e){return{rev:e.rev}}));var s={id:t.id,changes:r,doc:e};return o.isDeleted(t,e._rev)&&(s.deleted=!0),n.conflicts&&(s.doc._conflicts=i.collectConflicts(t),s.doc._conflicts.length||delete s.doc._conflicts),s}var o=e("./utils"),i=e("./merge"),s=e("./deps/errors"),a=e("events").EventEmitter,u=e("./evalFilter"),c=e("./evalView");t.exports=n,o.inherits(n,a),n.prototype.cancel=function(){this.isCancelled=!0,this.db.taskqueue.isReady&&this.emit("cancel")},n.prototype.doChanges=function(e){var t=this,n=e.complete;if(e=o.clone(e),"live"in e&&!("continuous"in e)&&(e.continuous=e.live),e.processChange=r,"latest"===e.since&&(e.since="now"),e.since||(e.since=0),"now"===e.since)return void this.db.info().then(function(r){return t.isCancelled?void n(null,{status:"cancelled"}):(e.since=r.update_seq-1,void t.doChanges(e))},n);if(e.continuous&&"now"!==e.since&&this.db.info().then(function(e){t.startSeq=e.update_seq-1},function(e){if("idbNull"!==e.id)throw e}),"http"!==this.db.type()&&e.filter&&"string"==typeof e.filter)return this.filterChanges(e);"descending"in e||(e.descending=!1),e.limit=0===e.limit?1:e.limit,e.complete=n;var i=this.db._changes(e);if(i&&"function"==typeof i.cancel){var s=t.cancel;t.cancel=o.getArguments(function(e){i.cancel(),s.apply(this,e)})}},n.prototype.filterChanges=function(e){var t=this,n=e.complete;if("_view"===e.filter){if(!e.view||"string"!=typeof e.view){var r=new Error("`view` filter parameter is not provided.");return r.status=s.BAD_REQUEST.status,r.name=s.BAD_REQUEST.name,r.error=!0,void n(r)}var o=e.view.split("/");this.db.get("_design/"+o[0],function(r,i){if(t.isCancelled)return void n(null,{status:"cancelled"});if(r)return void n(r);if(i&&i.views&&i.views[o[1]]){var a=c(i.views[o[1]].map);return e.filter=a,void t.doChanges(e)}var u=i.views?"missing json key: "+o[1]:"missing json key: views";r||(r=new Error(u),r.status=s.MISSING_DOC.status,r.name=s.MISSING_DOC.name,r.error=!0),n(r)})}else{var i=e.filter.split("/");this.db.get("_design/"+i[0],function(r,o){if(t.isCancelled)return void n(null,{status:"cancelled"});if(r)return void n(r);if(o&&o.filters&&o.filters[i[1]]){var a=u(o.filters[i[1]]);return e.filter=a,void t.doChanges(e)}var c=o&&o.filters?"missing json key: "+i[1]:"missing json key: filters";return r||(r=new Error(c),r.status=s.MISSING_DOC.status,r.name=s.MISSING_DOC.name,r.error=!0),void n(r)})}}},{"./deps/errors":11,"./evalFilter":15,"./evalView":16,"./merge":18,"./utils":23,events:27}],7:[function(e,t){(function(n){"use strict";function r(e){e&&n.debug&&console.error(e)}function o(e,t,n){if(!(this instanceof o))return new o(e,t,n);var c=this;("function"==typeof t||"undefined"==typeof t)&&(n=t,t={}),e&&"object"==typeof e&&(t=e,e=void 0),"undefined"==typeof n&&(n=r),t=t||{};var l=n;c.auto_compaction=t.auto_compaction,c.prefix=o.prefix,i.call(c),c.taskqueue=new a;var d=new u(function(r,i){n=function(e,t){return e?i(e):(delete t.then,void r(t))},t=s.clone(t);var a,u,l=t.name||e;return function(){try{if("string"!=typeof l)throw u=new Error("Missing/invalid DB name"),u.code=400,u;if(a=o.parseAdapter(l,t),t.originalName=l,t.name=a.name,t.prefix&&"http"!==a.adapter&&"https"!==a.adapter&&(t.name=t.prefix+t.name),t.adapter=t.adapter||a.adapter,c._adapter=t.adapter,c._db_name=l,!o.adapters[t.adapter])throw u=new Error("Adapter is missing"),u.code=404,u;if(!o.adapters[t.adapter].valid())throw u=new Error("Invalid Adapter"),u.code=404,u}catch(e){c.taskqueue.fail(e),c.changes=s.toPromise(function(t){t.complete&&t.complete(e)})}}(),u?i(u):(c.adapter=t.adapter,c.replicate={},c.replicate.from=function(e,t,n){return c.constructor.replicate(e,c,t,n)},c.replicate.to=function(e,t,n){return c.constructor.replicate(c,e,t,n)},c.sync=function(e,t,n){return c.constructor.sync(c,e,t,n)},c.replicate.sync=c.sync,c.destroy=s.adapterFun("destroy",function(e){var t=this;t.info(function(n,r){return n?e(n):void t.constructor.destroy(r.db_name,e)})}),o.adapters[t.adapter].call(c,t,function(e){function r(e){"destroyed"===e&&(c.emit("destroyed"),o.removeListener(l,r))}return e?void(n&&(c.taskqueue.fail(e),n(e))):(o.on(l,r),c.emit("created",c),o.emit("created",t.originalName),c.taskqueue.ready(c),void n(null,c))}),t.skipSetup&&c.taskqueue.ready(c),void(s.isCordova()&&cordova.fireWindowEvent(t.name+"_pouch",{})))});d.then(function(e){l(null,e)},l),c.then=d.then.bind(d),c["catch"]=d["catch"].bind(d)}var i=e("./adapter"),s=e("./utils"),a=e("./taskqueue"),u=s.Promise;s.inherits(o,i),t.exports=o}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./adapter":1,"./taskqueue":22,"./utils":23}],8:[function(e,t){"use strict";function n(e,t){function n(t,n,r){if(e.binary||e.json||!e.processData||"string"==typeof t){if(!e.binary&&e.json&&"string"==typeof t)try{t=JSON.parse(t)}catch(o){return r(o)}}else t=JSON.stringify(t);Array.isArray(t)&&(t=t.map(function(e){var t;return e.ok?e:e.error&&"conflict"===e.error?(t=i.REV_CONFLICT,t.id=e.id,t):e.error&&"forbidden"===e.error?(t=i.FORBIDDEN,t.id=e.id,t.reason=e.reason,t):e.missing?(t=i.MISSING_DOC,t.missing=e.missing,t):e})),r(null,t,n)}function a(e,t){var n,r,o,s;try{n=JSON.parse(e.responseText);for(s in i)if(i.hasOwnProperty(s)&&i[s].name===n.error){o=i[s];break}o||(o=i.UNKNOWN_ERROR,e.status&&(o.status=e.status),e.statusText&&(e.name=e.statusText)),r=i.error(o,n.reason)}catch(a){for(var s in i)if(i.hasOwnProperty(s)&&i[s].status===e.status){o=i[s];break}o||(o=i.UNKNOWN_ERROR,e.status&&(o.status=e.status),e.statusText&&(e.name=e.statusText)),r=i.error(o)}e.withCredentials&&0===e.status&&(r.status=405,r.statusText="Method Not Allowed"),t(r)}var u=!1,c=s.getArguments(function(e){u||(t.apply(this,e),u=!0)});"function"==typeof e&&(c=e,e={}),e=s.clone(e);var l={method:"GET",headers:{},json:!0,processData:!0,timeout:1e4,cache:!1};if(e=s.extend(!0,l,e),"GET"===e.method&&!e.cache){var d=-1!==e.url.indexOf("?");e.url+=(d?"&":"?")+"_nonce="+s.uuid(16)}var f,p;p=e.xhr?new e.xhr:new XMLHttpRequest,p.open(e.method,e.url),p.withCredentials=!0,e.json&&(e.headers.Accept="application/json",e.headers["Content-Type"]=e.headers["Content-Type"]||"application/json",e.body&&e.processData&&"string"!=typeof e.body&&(e.body=JSON.stringify(e.body))),e.binary&&(p.responseType="arraybuffer");var h=function(e,t,n){var r="";if(n){var o=new Date;o.setTime(o.getTime()+24*n*60*60*1e3),r="; expires="+o.toGMTString()}document.cookie=e+"="+t+r+"; path=/"};for(var v in e.headers)if("Cookie"===v){var m=e.headers[v].split("=");h(m[0],m[1],10)}else p.setRequestHeader(v,e.headers[v]);"body"in e||(e.body=null);var _=function(){u||(p.abort(),a(p,c))};if(p.onreadystatechange=function(){if(4===p.readyState&&!u)if(clearTimeout(f),p.status>=200&&p.status<300){var t;t=e.binary?o([p.response||""],{type:p.getResponseHeader("Content-Type")}):p.responseText,n(t,p,c)}else a(p,c)},e.timeout>0&&(f=setTimeout(_,e.timeout),p.onprogress=function(){clearTimeout(f),f=setTimeout(_,e.timeout)},"undefined"==typeof r&&(r=-1!==Object.keys(p).indexOf("upload")),r&&(p.upload.onprogress=p.onprogress)),e.body&&e.body instanceof Blob){var y=new FileReader;y.onloadend=function(){for(var e="",t=new Uint8Array(this.result),n=t.byteLength,r=0;n>r;r++)e+=String.fromCharCode(t[r]);e=s.fixBinary(e),p.send(e)},y.readAsArrayBuffer(e.body)}else p.send(e.body);return{abort:_}}var r,o=e("./blob.js"),i=e("./errors"),s=e("../utils");t.exports=n},{"../utils":23,"./blob.js":9,"./errors":11}],9:[function(e,t){(function(e){"use strict";function n(t,n){t=t||[],n=n||{};try{return new Blob(t,n)}catch(r){if("TypeError"!==r.name)throw r;for(var o=e.BlobBuilder||e.MSBlobBuilder||e.MozBlobBuilder||e.WebKitBlobBuilder,i=new o,s=0;s<t.length;s+=1)i.append(t[s]);return i.getBlob(n.type)}}t.exports=n}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],10:[function(e,t,n){"use strict";function r(){this.store={}}function o(){this.store=new r}n.Map=r,n.Set=o,r.prototype.mangle=function(e){if("string"!=typeof e)throw new TypeError("key must be a string but Got "+e);return"$"+e},r.prototype.unmangle=function(e){return e.substring(1)},r.prototype.get=function(e){var t=this.mangle(e);return t in this.store?this.store[t]:void 0},r.prototype.set=function(e,t){var n=this.mangle(e);return this.store[n]=t,!0},r.prototype.has=function(e){var t=this.mangle(e);return t in this.store},r.prototype["delete"]=function(e){var t=this.mangle(e);return t in this.store?(delete this.store[t],!0):!1},r.prototype.forEach=function(e){var t=this,n=Object.keys(t.store);n.forEach(function(n){var r=t.store[n];n=t.unmangle(n),e(r,n)})},o.prototype.add=function(e){return this.store.set(e,!0)},o.prototype.has=function(e){return this.store.has(e)},o.prototype["delete"]=function(e){return this.store["delete"](e)}},{}],11:[function(e,t,n){"use strict";function r(e){this.status=e.status,this.name=e.error,this.message=e.reason,this.error=!0}r.prototype__proto__=Error.prototype,r.prototype.toString=function(){return JSON.stringify({status:this.status,name:this.name,message:this.message})},n.UNAUTHORIZED=new r({status:401,error:"unauthorized",reason:"Name or password is incorrect."}),n.MISSING_BULK_DOCS=new r({status:400,error:"bad_request",reason:"Missing JSON list of 'docs'"}),n.MISSING_DOC=new r({status:404,error:"not_found",reason:"missing"}),n.REV_CONFLICT=new r({status:409,error:"conflict",reason:"Document update conflict"}),n.INVALID_ID=new r({status:400,error:"invalid_id",reason:"_id field must contain a string"}),n.MISSING_ID=new r({status:412,error:"missing_id",reason:"_id is required for puts"}),n.RESERVED_ID=new r({status:400,error:"bad_request",reason:"Only reserved document ids may start with underscore."}),n.NOT_OPEN=new r({status:412,error:"precondition_failed",reason:"Database not open"}),n.UNKNOWN_ERROR=new r({status:500,error:"unknown_error",reason:"Database encountered an unknown error"}),n.BAD_ARG=new r({status:500,error:"badarg",reason:"Some query argument is invalid"}),n.INVALID_REQUEST=new r({status:400,error:"invalid_request",reason:"Request was invalid"}),n.QUERY_PARSE_ERROR=new r({status:400,error:"query_parse_error",reason:"Some query parameter is invalid"}),n.DOC_VALIDATION=new r({status:500,error:"doc_validation",reason:"Bad special document member"}),n.BAD_REQUEST=new r({status:400,error:"bad_request",reason:"Something wrong with the request"}),n.NOT_AN_OBJECT=new r({status:400,error:"bad_request",reason:"Document must be a JSON object"}),n.DB_MISSING=new r({status:404,error:"not_found",reason:"Database not found"}),n.IDB_ERROR=new r({status:500,error:"indexed_db_went_bad",reason:"unknown"}),n.WSQ_ERROR=new r({status:500,error:"web_sql_went_bad",reason:"unknown"}),n.LDB_ERROR=new r({status:500,error:"levelDB_went_went_bad",reason:"unknown"}),n.FORBIDDEN=new r({status:403,error:"forbidden",reason:"Forbidden by design doc validate_doc_update function"}),n.error=function(e,t,n){function r(){this.message=t,n&&(this.name=n)}return r.prototype=e,new r(t)}},{}],12:[function(e,t){(function(n,r){"use strict";function o(e,t,n){if("function"==typeof e.slice)return t?n?e.slice(t,n):e.slice(t):e.slice();t=Math.floor(t||0),n=Math.floor(n||0);var r=e.byteLength;if(t=0>t?Math.max(t+r,0):Math.min(r,t),n=0>n?Math.max(n+r,0):Math.min(r,n),0>=n-t)return new ArrayBuffer(0);var o=new ArrayBuffer(n-t),i=new Uint8Array(o),s=new Uint8Array(e,t,n-t);return i.set(s),o}function i(e){var t=[255&e,e>>>8&255,e>>>16&255,e>>>24&255];return t.map(function(e){return String.fromCharCode(e)}).join("")}function s(e){for(var t="",n=0;n<e.length;n++)t+=i(e[n]);
return r.btoa(t)}var a=e("crypto"),u=e("spark-md5"),c=r.setImmediate||r.setTimeout;t.exports=function(e,t){function r(e,t,n,r){d?e.appendBinary(t.substring(n,r)):e.append(o(t,n,r))}function i(){var n=v*p,o=n+p;if(n+p>=e.size&&(o=e.size),v++,h>v)r(m,e,n,o),c(i);else{r(m,e,n,o);var a=m.end(!0),u=s(a);t(null,u),m.destroy()}}if(!n.browser){var l=a.createHash("md5").update(e).digest("base64");return void t(null,l)}var d="string"==typeof e,f=d?e.length:e.byteLength,p=Math.min(524288,f),h=Math.ceil(f/p),v=0,m=d?new u:new u.ArrayBuffer;i()}}).call(this,e("/Users/nolan/workspace/pouchdb/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"/Users/nolan/workspace/pouchdb/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":28,crypto:26,"spark-md5":56}],13:[function(e,t){"use strict";function n(e,t,n){return new o(function(o,i){return t&&"object"==typeof t&&(t=t._id),"string"!=typeof t?i(new Error("doc id is required")):void e.get(t,function(s,a){if(s)return 404!==s.status?i(s):o(r(e,n({_id:t}),n));var u=n(a);return u?void o(r(e,u,n)):o(a)})})}function r(e,t,r){return e.put(t)["catch"](function(o){if(409!==o.status)throw o;return n(e,t,r)})}var o=e("../utils").Promise;t.exports=function(e,t,r,o){return"function"!=typeof o?n(e,t,r):void n(e,t,r).then(function(e){o(null,e)},o)}},{"../utils":23}],14:[function(e,t){"use strict";function n(e){return 0|Math.random()*e}function r(e,t){t=t||o.length;var r="",i=-1;if(e){for(;++i<e;)r+=o[n(t)];return r}for(;++i<36;)switch(i){case 8:case 13:case 18:case 23:r+="-";break;case 19:r+=o[3&n(16)|8];break;default:r+=o[n(16)]}return r}var o="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");t.exports=r},{}],15:[function(_dereq_,module,exports){"use strict";function evalFilter(input){return eval(["(function () { return ",input," })()"].join(""))}module.exports=evalFilter},{}],16:[function(_dereq_,module,exports){"use strict";function evalView(input){return eval(["(function () {","  return function (doc) {","    var emitted = false;","    var emit = function (a, b) {","      emitted = true;","    };","    var view = "+input+";","    view(doc);","    if (emitted) {","      return true;","    }","  }","})()"].join("\n"))}module.exports=evalView},{}],17:[function(e,t){(function(n){"use strict";var r=e("./setup");t.exports=r,r.ajax=e("./deps/ajax"),r.extend=e("pouchdb-extend"),r.utils=e("./utils"),r.Errors=e("./deps/errors"),r.replicate=e("./replicate").replicate,r.sync=e("./sync"),r.version=e("./version");var o=e("./adapters/http");if(r.adapter("http",o),r.adapter("https",o),r.adapter("idb",e("./adapters/idb")),r.adapter("websql",e("./adapters/websql")),r.plugin(e("pouchdb-mapreduce")),!n.browser){var i=e("./adapters/leveldb");r.adapter("ldb",i),r.adapter("leveldb",i)}}).call(this,e("/Users/nolan/workspace/pouchdb/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))},{"./adapters/http":2,"./adapters/idb":3,"./adapters/leveldb":26,"./adapters/websql":5,"./deps/ajax":8,"./deps/errors":11,"./replicate":19,"./setup":20,"./sync":21,"./utils":23,"./version":24,"/Users/nolan/workspace/pouchdb/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":28,"pouchdb-extend":47,"pouchdb-mapreduce":50}],18:[function(e,t){"use strict";function n(e){for(var t,n=e.shift(),r=[n.id,n.opts,[]],o=r;e.length;)n=e.shift(),t=[n.id,n.opts,[]],o[2].push(t),o=t;return r}function r(e,t){for(var n=[{tree1:e,tree2:t}],r=!1;n.length>0;){var o=n.pop(),i=o.tree1,s=o.tree2;(i[1].status||s[1].status)&&(i[1].status="available"===i[1].status||"available"===s[1].status?"available":"missing");for(var a=0;a<s[2].length;a++)if(i[2][0]){for(var u=!1,c=0;c<i[2].length;c++)i[2][c][0]===s[2][a][0]&&(n.push({tree1:i[2][c],tree2:s[2][a]}),u=!0);u||(r="new_branch",i[2].push(s[2][a]),i[2].sort())}else r="new_leaf",i[2][0]=s[2][a]}return{conflicts:r,tree:e}}function o(e,t,n){var o,i=[],s=!1,a=!1;return e.length?(e.forEach(function(e){if(e.pos===t.pos&&e.ids[0]===t.ids[0])o=r(e.ids,t.ids),i.push({pos:e.pos,ids:o.tree}),s=s||o.conflicts,a=!0;else if(n!==!0){var u=e.pos<t.pos?e:t,c=e.pos<t.pos?t:e,l=c.pos-u.pos,d=[],f=[];for(f.push({ids:u.ids,diff:l,parent:null,parentIdx:null});f.length>0;){var p=f.pop();0!==p.diff?p.ids&&p.ids[2].forEach(function(e,t){f.push({ids:e,diff:p.diff-1,parent:p.ids,parentIdx:t})}):p.ids[0]===c.ids[0]&&d.push(p)}var h=d[0];h?(o=r(h.ids,c.ids),h.parent[2][h.parentIdx]=o.tree,i.push({pos:u.pos,ids:u.ids}),s=s||o.conflicts,a=!0):i.push(e)}else i.push(e)}),a||i.push(t),i.sort(function(e,t){return e.pos-t.pos}),{tree:i,conflicts:s||"internal_node"}):{tree:[t],conflicts:"new_leaf"}}function i(e,t){var r=a.rootToLeaf(e).map(function(e){var r=e.ids.slice(-t);return{pos:e.pos+(e.ids.length-r.length),ids:n(r)}});return r.reduce(function(e,t){return o(e,t,!0).tree},[r.shift()])}var s=e("pouchdb-extend"),a={};a.merge=function(e,t,n){e=s(!0,[],e),t=s(!0,{},t);var r=o(e,t);return{tree:i(r.tree,n),conflicts:r.conflicts}},a.winningRev=function(e){var t=[];return a.traverseRevTree(e.rev_tree,function(e,n,r,o,i){e&&t.push({pos:n,id:r,deleted:!!i.deleted})}),t.sort(function(e,t){return e.deleted!==t.deleted?e.deleted>t.deleted?1:-1:e.pos!==t.pos?t.pos-e.pos:e.id<t.id?1:-1}),t[0].pos+"-"+t[0].id},a.traverseRevTree=function(e,t){for(var n,r=e.slice();n=r.pop();)for(var o=n.pos,i=n.ids,s=i[2],a=t(0===s.length,o,i[0],n.ctx,i[1]),u=0,c=s.length;c>u;u++)r.push({pos:o+1,ids:s[u],ctx:a})},a.collectLeaves=function(e){var t=[];return a.traverseRevTree(e,function(e,n,r,o,i){e&&t.unshift({rev:n+"-"+r,pos:n,opts:i})}),t.sort(function(e,t){return t.pos-e.pos}),t.map(function(e){delete e.pos}),t},a.collectConflicts=function(e){var t=a.winningRev(e),n=a.collectLeaves(e.rev_tree),r=[];return n.forEach(function(e){e.rev===t||e.opts.deleted||r.push(e.rev)}),r},a.rootToLeaf=function(e){var t=[];return a.traverseRevTree(e,function(e,n,r,o,i){if(o=o?o.slice(0):[],o.push({id:r,opts:i}),e){var s=n+1-o.length;t.unshift({pos:s,ids:o})}return o}),t},t.exports=a},{"pouchdb-extend":47}],19:[function(e,t,n){"use strict";function r(){d.call(this),this.cancelled=!1;var e=this,t=new l.Promise(function(t,n){e.once("complete",t),e.once("error",n)});e.then=function(e,n){return t.then(e,n)},e["catch"]=function(e){return t["catch"](e)},e["catch"](function(){})}function o(e,t,n){var r=n.filter?n.filter.toString():"";return e.id().then(function(e){return t.id().then(function(t){var o=e+t+r+JSON.stringify(n.query_params)+n.doc_ids;return l.MD5(o).then(function(e){return e=e.replace(/\//g,".").replace(/\+/g,"_"),"_local/"+e})})})}function i(e,t,n,r){return e.get(t)["catch"](function(e){if(404===e.status)return{_id:t};throw e}).then(function(t){return r.cancelled?void 0:(t.last_seq=n,e.put(t))})}function s(e,t,n,r){this.src=e,this.target=t,this.id=n,this.returnValue=r}function a(e,t,n,r,o){function i(){if(0!==k.docs.length){var e=k.docs;return n.bulkDocs({docs:e},{new_edits:!1}).then(function(e){if(o.cancelled)throw y(),new Error("cancelled");var t=[];if(e.forEach(function(e){e.ok||(B.doc_write_failures++,t.push(new Error(e.reason||e.message||"Unknown reason")))}),t.length>0){var n=new Error("bulkDocs error");throw n.other_errors=t,_("target.bulkDocs failed to write docs",n),new Error("bulkWrite partial failure")}},function(t){throw B.doc_write_failures+=e.length,t})}}function a(){for(var e=k.diffs,n=Object.keys(e)[0],r=e[n].missing,i=[],s=0;s<r.length;s+=f)i.push(r.slice(s,Math.min(r.length,s+f)));return l.Promise.all(i.map(function(r){return t.get(n,{revs:!0,open_revs:r,attachments:!0}).then(function(t){t.forEach(function(t){return o.cancelled?y():void(t.ok&&(B.docs_read++,k.pendingRevs++,k.docs.push(t.ok),delete e[t.ok._id]))})})}))}function u(){return Object.keys(k.diffs).length>0?a().then(u):l.Promise.resolve()}function c(){var e=Object.keys(k.diffs).filter(function(e){var t=k.diffs[e].missing;return 1===t.length&&"1-"===t[0].slice(0,2)});return t.allDocs({keys:e,include_docs:!0}).then(function(e){if(o.cancelled)throw y(),new Error("cancelled");e.rows.forEach(function(e){!e.doc||e.deleted||"1-"!==e.value.rev.slice(0,2)||e.doc._attachments&&0!==Object.keys(e.doc._attachments).length||(B.docs_read++,k.pendingRevs++,k.docs.push(e.doc),delete k.diffs[e.id])})})}function d(){return c().then(u)}function p(){return T=!0,F.writeCheckpoint(k.seq).then(function(){if(T=!1,o.cancelled)throw y(),new Error("cancelled");B.last_seq=L=k.seq,B.docs_written+=k.docs.length,o.emit("change",l.clone(B)),k=void 0,E()})["catch"](function(e){throw T=!1,_("writeCheckpoint completed with error",e),e})}function h(){var e={};return k.changes.forEach(function(t){e[t.id]=t.changes.map(function(e){return e.rev})}),n.revsDiff(e).then(function(e){if(o.cancelled)throw y(),new Error("cancelled");k.diffs=e,k.pendingRevs=0})}function v(){if(!o.cancelled&&!k){if(0===x.length)return void m(!0);k=x.shift(),h().then(d).then(i).then(p).then(v)["catch"](function(e){_("batch processing terminated with error",e)})}}function m(e){return 0===q.changes.length?void(0!==x.length||k||((R&&M.live||A)&&o.emit("uptodate",l.clone(B)),A&&y())):void((e||A||q.changes.length>=I)&&(x.push(q),q={seq:0,changes:[],docs:[]},v()))}function _(e,t){O||(B.ok=!1,B.status="aborted",B.errors.push(t),x=[],q={seq:0,changes:[],docs:[]},y())}function y(){if(!(O||o.cancelled&&(B.status="cancelled",T))){if(B.status=B.status||"complete",B.end_time=new Date,B.last_seq=L,O=o.cancelled=!0,B.errors.length>0){var e=B.errors.pop();B.errors.length>0&&(e.other_errors=B.errors),e.result=B,o.emit("error",e)}else o.emit("complete",B);o.removeAllListeners()}}function g(e){return o.cancelled?y():(N++,0!==q.changes.length||0!==x.length||k||o.emit("outofdate",l.clone(B)),q.seq=e.seq,q.changes.push(e),void m(0===x.length))}function b(e){return C=!1,o.cancelled?y():(N>0?(M.since=e.last_seq,E()):R?(M.live=!0,E()):A=!0,void m(!0))}function w(e){return C=!1,o.cancelled?y():void _("changes rejected",e)}function E(){function e(){r.cancel()}function n(){o.removeListener("cancel",e)}if(!C&&!A&&x.length<D){C=!0,N=0,o.once("cancel",e);var r=t.changes(M).on("change",g);r.then(n,n),r.then(b)["catch"](w)}}function S(){F.getCheckpoint().then(function(e){L=e,M={since:L,limit:I,batch_size:I,style:"all_docs",doc_ids:j,returnDocs:!1},r.filter&&(M.filter=r.filter),r.query_params&&(M.query_params=r.query_params),E()})["catch"](function(e){_("getCheckpoint rejected with ",e)})}var k,x=[],q={seq:0,changes:[],docs:[]},T=!1,A=!1,O=!1,L=0,R=r.continuous||r.live||!1,I=r.batch_size||100,D=r.batches_limit||10,C=!1,N=0,j=r.doc_ids,F=new s(t,n,e,o),B={ok:!0,start_time:new Date,docs_read:0,docs_written:0,doc_write_failures:0,errors:[]},M={};o.ready(t,n),o.once("cancel",y),"function"==typeof r.onChange&&o.on("change",r.onChange),"function"==typeof r.complete&&(o.once("error",r.complete),o.once("complete",function(e){r.complete(null,e)})),"undefined"==typeof r.since?S():(T=!0,F.writeCheckpoint(r.since).then(function(){return T=!1,o.cancelled?void y():(L=r.since,void S())})["catch"](function(e){throw T=!1,_("writeCheckpoint completed with error",e),e}))}function u(e,t){var n=t.PouchConstructor;return"string"==typeof e?new n(e):e.then?e:l.Promise.resolve(e)}function c(e,t,n,i){"function"==typeof n&&(i=n,n={}),"undefined"==typeof n&&(n={}),n.complete||(n.complete=i||function(){}),n=l.clone(n),n.continuous=n.continuous||n.live,n.PouchConstructor=n.PouchConstructor||this;var s=new r(n);return u(e,n).then(function(e){return u(t,n).then(function(t){return o(e,t,n).then(function(r){a(r,e,t,n,s)})})})["catch"](function(e){s.emit("error",e),n.complete(e)}),s}var l=e("./utils"),d=e("events").EventEmitter,f=50;l.inherits(r,d),r.prototype.cancel=function(){this.cancelled=!0,this.emit("cancel")},r.prototype.ready=function(e,t){function n(){o.cancel()}function r(){e.removeListener("destroyed",n),t.removeListener("destroyed",n)}var o=this;e.once("destroyed",n),t.once("destroyed",n),this.then(r,r)},s.prototype.writeCheckpoint=function(e){var t=this;return this.updateTarget(e).then(function(){return t.updateSource(e)})},s.prototype.updateTarget=function(e){return i(this.target,this.id,e,this.returnValue)},s.prototype.updateSource=function(e){var t=this;return this.readOnlySource?l.Promise.resolve(!0):i(this.src,this.id,e,this.returnValue)["catch"](function(e){var n="number"==typeof e.status&&4===Math.floor(e.status/100);if(n)return t.readOnlySource=!0,!0;throw e})},s.prototype.getCheckpoint=function(){var e=this;return e.target.get(e.id).then(function(t){return e.src.get(e.id).then(function(e){return t.last_seq===e.last_seq?e.last_seq:0},function(n){if(404===n.status&&t.last_seq)return e.src.put({_id:e.id,last_seq:0}).then(function(){return 0},function(n){return 401===n.status?(e.readOnlySource=!0,t.last_seq):0});throw n})})["catch"](function(e){if(404!==e.status)throw e;return 0})},n.toPouch=u,n.replicate=c},{"./utils":23,events:27}],20:[function(e,t){(function(n){"use strict";var r=e("./constructor"),o=e("./utils"),i=o.Promise,s=e("events").EventEmitter;r.adapters={},r.preferredAdapters=e("./adapters/preferredAdapters.js"),r.prefix="_pouch_";var a=new s,u=["on","addListener","emit","listeners","once","removeAllListeners","removeListener","setMaxListeners"];u.forEach(function(e){r[e]=a[e].bind(a)}),r.setMaxListeners(0),r.parseAdapter=function(e,t){var i,s,a=e.match(/([a-z\-]*):\/\/(.*)/);if(a){if(e=/http(s?)/.test(a[1])?a[1]+"://"+a[2]:a[2],i=a[1],!r.adapters[i].valid())throw"Invalid adapter";return{name:e,adapter:a[1]}}var u="idb"in r.adapters&&"websql"in r.adapters&&o.hasLocalStorage()&&n.localStorage["_pouch__websqldb_"+r.prefix+e];if("undefined"!=typeof t&&t.db)s="leveldb";else for(var c=0;c<r.preferredAdapters.length;++c)if(s=r.preferredAdapters[c],s in r.adapters){if(u&&"idb"===s)continue;break}if(i=r.adapters[s],s&&i){var l="use_prefix"in i?i.use_prefix:!0;return{name:l?r.prefix+e:e,adapter:s}}throw"No valid adapter found"},r.destroy=o.toPromise(function(e,t,n){function s(){c.destroy(f,t,function(t,o){t?n(t):(r.emit("destroyed",e),r.emit(e,"destroyed"),n(null,o||{ok:!0}))})}("function"==typeof t||"undefined"==typeof t)&&(n=t,t={}),e&&"object"==typeof e&&(t=e,e=void 0);var a=r.parseAdapter(t.name||e,t),u=a.name,c=r.adapters[a.adapter],l="use_prefix"in c?c.use_prefix:!0,d=l?u.replace(new RegExp("^"+r.prefix),""):u,f=("http"===a.adapter||"https"===a.adapter?"":t.prefix||"")+u,p=o.extend(!0,{},t,{adapter:a.adapter});new r(d,p,function(e,u){return e?n(e):void u.get("_local/_pouch_dependentDbs",function(e,u){if(e)return 404!==e.status?n(e):s();var c=u.dependentDbs,d=Object.keys(c).map(function(e){var n=l?e.replace(new RegExp("^"+r.prefix),""):e,i=o.extend(!0,t,{adapter:a.adapter});return r.destroy(n,i)});i.all(d).then(s,function(e){n(e)})})})}),r.allDbs=o.toPromise(function(e){var t=new Error("allDbs method removed");t.stats="400",e(t)}),r.adapter=function(e,t){t.valid()&&(r.adapters[e]=t)},r.plugin=function(e){Object.keys(e).forEach(function(t){r.prototype[t]=e[t]})},r.defaults=function(e){function t(t,n,i){("function"==typeof n||"undefined"==typeof n)&&(i=n,n={}),t&&"object"==typeof t&&(n=t,t=void 0),n=o.extend(!0,{},e,n),r.call(this,t,n,i)}return o.inherits(t,r),t.destroy=o.toPromise(function(t,n,i){return("function"==typeof n||"undefined"==typeof n)&&(i=n,n={}),t&&"object"==typeof t&&(n=t,t=void 0),n=o.extend(!0,{},e,n),r.destroy(t,n,i)}),u.forEach(function(e){t[e]=a[e].bind(a)}),t.setMaxListeners(0),t.preferredAdapters=r.preferredAdapters.slice(),Object.keys(r).forEach(function(e){e in t||(t[e]=r[e])}),t},t.exports=r}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./adapters/preferredAdapters.js":4,"./constructor":7,"./utils":23,events:27}],21:[function(e,t){"use strict";function n(e,t,n,s){return"function"==typeof n&&(s=n,n={}),"undefined"==typeof n&&(n={}),n=o.clone(n),n.PouchConstructor=n.PouchConstructor||this,e=i.toPouch(e,n),t=i.toPouch(t,n),new r(e,t,n,s)}function r(e,t,n,r){function i(e){p||(p=!0,l.emit("cancel",e))}function a(e){l.emit("change",{direction:"pull",change:e})}function u(e){l.emit("change",{direction:"push",change:e})}function c(e){return function(t,n){var r="change"===t&&(n===a||n===u),o="cancel"===t&&n===i,s=t in h&&n===h[t];(r||o||s)&&(t in v||(v[t]={}),v[t][e]=!0,2===Object.keys(v[t]).length&&l.removeAllListeners(t))}}var l=this;this.canceled=!1;var d,f;"onChange"in n&&(d=n.onChange,delete n.onChange),"function"!=typeof r||n.complete?"complete"in n&&(f=n.complete,delete n.complete):f=r,this.push=s(e,t,n),this.pull=s(t,e,n);var p=!1,h={},v={};this.on("newListener",function(e){"change"===e?(l.pull.on("change",a),l.push.on("change",u)):"cancel"===e?(l.pull.on("cancel",i),l.push.on("cancel",i)):"error"===e||"removeListener"===e||"complete"===e||e in h||(h[e]=function(t){l.emit(e,t)},l.pull.on(e,h[e]),l.push.on(e,h[e]))}),this.on("removeListener",function(e){"change"===e?(l.pull.removeListener("change",a),l.push.removeListener("change",u)):"cancel"===e?(l.pull.removeListener("cancel",i),l.push.removeListener("cancel",i)):e in h&&"function"==typeof h[e]&&(l.pull.removeListener(e,h[e]),l.push.removeListener(e,h[e]),delete h[e])}),this.pull.on("removeListener",c("pull")),this.push.on("removeListener",c("push"));var m=o.Promise.all([this.push,this.pull]).then(function(e){var t={push:e[0],pull:e[1]};return l.emit("complete",t),f&&f(null,t),l.removeAllListeners(),t},function(e){throw l.cancel(),l.emit("error",e),f&&f(e),l.removeAllListeners(),e});this.then=function(e,t){return m.then(e,t)},this["catch"]=function(e){return m["catch"](e)}}var o=e("./utils"),i=e("./replicate"),s=i.replicate,a=e("events").EventEmitter;o.inherits(r,a),t.exports=n,r.prototype.cancel=function(){this.canceled||(this.canceled=!0,this.push.cancel(),this.pull.cancel())}},{"./replicate":19,"./utils":23,events:27}],22:[function(e,t){"use strict";function n(){this.isReady=!1,this.failed=!1,this.queue=[]}t.exports=n,n.prototype.execute=function(){var e,t;if(this.failed)for(;e=this.queue.shift();)"function"!=typeof e?(t=e.parameters[e.parameters.length-1],"function"==typeof t?t(this.failed):"changes"===e.name&&"function"==typeof t.complete&&t.complete(this.failed)):e(this.failed);else if(this.isReady)for(;e=this.queue.shift();)"function"==typeof e?e():e.task=this.db[e.name].apply(this.db,e.parameters)},n.prototype.fail=function(e){this.failed=e,this.execute()},n.prototype.ready=function(e){return this.failed?!1:0===arguments.length?this.isReady:(this.isReady=e?!0:!1,this.db=e,void this.execute())},n.prototype.addTask=function(e,t){if("function"!=typeof e){var n={name:e,parameters:t};return this.queue.push(n),this.failed&&this.execute(),n}this.queue.push(e),this.failed&&this.execute()}},{}],23:[function(e,t,n){(function(t,r){function o(e){var t={};return e.forEach(function(e){t[e]=!0}),t}function i(){return"undefined"!=typeof chrome&&"undefined"!=typeof chrome.storage&&"undefined"!=typeof chrome.storage.local}function s(){if(!(this instanceof s))return new s;var e=this;l.call(this),this.isChrome=i(),this.listeners={},this.hasLocal=!1,this.isChrome||(this.hasLocal=n.hasLocalStorage()),this.isChrome?chrome.storage.onChanged.addListener(function(t){null!=t.db_name&&e.emit(t.dbName.newValue)}):this.hasLocal&&(r.addEventListener?r.addEventListener("storage",function(t){e.emit(t.key)}):r.attachEvent("storage",function(t){e.emit(t.key)}))}var a=e("./merge");n.extend=e("pouchdb-extend"),n.ajax=e("./deps/ajax"),n.createBlob=e("./deps/blob"),n.uuid=e("./deps/uuid"),n.getArguments=e("argsarray");var u=e("./deps/buffer"),c=e("./deps/errors"),l=e("events").EventEmitter,d=e("./deps/collections");n.Map=d.Map,n.Set=d.Set,n.Promise="function"==typeof r.Promise?r.Promise:e("bluebird");var f=n.Promise,p=o(["_id","_rev","_attachments","_deleted","_revisions","_revs_info","_conflicts","_deleted_conflicts","_local_seq","_rev_tree","_replication_id","_replication_state","_replication_state_time","_replication_state_reason","_replication_stats"]);n.clone=function(e){return n.extend(!0,{},e)},n.inherits=e("inherits"),n.invalidIdError=function(e){var t;if(e?"string"!=typeof e?(t=new TypeError(c.INVALID_ID.message),t.status=400):/^_/.test(e)&&!/^_(design|local)/.test(e)&&(t=new TypeError(c.RESERVED_ID.message),t.status=400):(t=new TypeError(c.MISSING_ID.message),t.status=412),t)throw t},n.call=n.getArguments(function(e){if(e.length){var t=e.shift();"function"==typeof t&&t.apply(this,e)}}),n.isLocalId=function(e){return/^_local/.test(e)},n.isDeleted=function(e,t){t||(t=a.winningRev(e));var n=t.indexOf("-");-1!==n&&(t=t.substring(n+1));var r=!1;return a.traverseRevTree(e.rev_tree,function(e,n,o,i,s){o===t&&(r=!!s.deleted)}),r},n.filterChange=function(e){return function(t){var n={},r=e.filter&&"function"==typeof e.filter;if(n.query=e.query_params,e.filter&&r&&!e.filter.call(this,t.doc,n))return!1;if(e.doc_ids&&-1===e.doc_ids.indexOf(t.id))return!1;if(e.include_docs)for(var o in t.doc._attachments)t.doc._attachments.hasOwnProperty(o)&&(t.doc._attachments[o].stub=!0);else delete t.doc;return!0}},n.parseDoc=function(e,t){var r,o,i,s,a={status:"available"};if(e._deleted&&(a.deleted=!0),t)if(e._id||(e._id=n.uuid()),o=n.uuid(32,16).toLowerCase(),e._rev){if(i=/^(\d+)-(.+)$/.exec(e._rev),!i){var u=new TypeError("invalid value for property '_rev'");u.status=400}e._rev_tree=[{pos:parseInt(i[1],10),ids:[i[2],{status:"missing"},[[o,a,[]]]]}],r=parseInt(i[1],10)+1}else e._rev_tree=[{pos:1,ids:[o,a,[]]}],r=1;else if(e._revisions&&(e._rev_tree=[{pos:e._revisions.start-e._revisions.ids.length+1,ids:e._revisions.ids.reduce(function(e,t){return null===e?[t,a,[]]:[t,{status:"missing"},[e]]},null)}],r=e._revisions.start,o=e._revisions.ids[0]),!e._rev_tree){if(i=/^(\d+)-(.+)$/.exec(e._rev),!i)throw s=new TypeError(c.BAD_ARG.message),s.status=c.BAD_ARG.status,s;r=parseInt(i[1],10),o=i[2],e._rev_tree=[{pos:parseInt(i[1],10),ids:[i[2],a,[]]}]}n.invalidIdError(e._id),e._rev=[r,o].join("-");var l={metadata:{},data:{}};for(var d in e)if(e.hasOwnProperty(d)){var f="_"===d[0];if(f&&!p[d])throw s=new Error(c.DOC_VALIDATION.message+": "+d),s.status=c.DOC_VALIDATION.status,s;f&&"_attachments"!==d?l.metadata[d.slice(1)]=e[d]:l.data[d]=e[d]}return l},n.isCordova=function(){return"undefined"!=typeof cordova||"undefined"!=typeof PhoneGap||"undefined"!=typeof phonegap},n.hasLocalStorage=function(){if(i())return!1;try{return r.localStorage}catch(e){return!1}},n.Changes=s,n.inherits(s,l),s.prototype.addListener=function(e,t,r,o){function i(){r.changes({include_docs:o.include_docs,conflicts:o.conflicts,continuous:!1,descending:!1,filter:o.filter,view:o.view,since:o.since,query_params:o.query_params,onChange:function(e){e.seq>o.since&&!o.cancelled&&(o.since=e.seq,n.call(o.onChange,e))}})}this.listeners[t]||(this.listeners[t]=i,this.on(e,i))},s.prototype.removeListener=function(e,t){t in this.listeners&&l.prototype.removeListener.call(this,e,this.listeners[t])},s.prototype.notifyLocalWindows=function(e){this.isChrome?chrome.storage.local.set({dbName:e}):this.hasLocal&&(localStorage[e]="a"===localStorage[e]?"b":"a")},s.prototype.notify=function(e){this.emit(e),this.notifyLocalWindows(e)},n.atob=t.browser&&"atob"in r?function(e){return atob(e)}:function(e){var t=new u(e,"base64");if(t.toString("base64")!==e)throw"Cannot base64 encode full string";return t.toString("binary")},n.btoa=t.browser&&"btoa"in r?function(e){return btoa(e)}:function(e){return new u(e,"binary").toString("base64")},n.fixBinary=function(e){if(!t.browser)return e;for(var n=e.length,r=new ArrayBuffer(n),o=new Uint8Array(r),i=0;n>i;i++)o[i]=e.charCodeAt(i);return r},n.once=function(e){var t=!1;return n.getArguments(function(n){if(t)throw"function"==typeof console.trace&&console.trace(),new Error("once called  more than once");t=!0,e.apply(this,n)})},n.toPromise=function(e){return n.getArguments(function(r){var o,i=this,s="function"==typeof r[r.length-1]?r.pop():!1;s&&(o=function(e,n){t.nextTick(function(){s(e,n)})});var a=new f(function(t,o){var s;try{var a=n.once(function(e,n){e?o(e):t(n)});r.push(a),s=e.apply(i,r),s&&"function"==typeof s.then&&t(s)}catch(u){o(u)}});return o&&a.then(function(e){o(null,e)},o),a.cancel=function(){return this},a})},n.adapterFun=function(e,t){return n.toPromise(n.getArguments(function(r){if(this._closed)return f.reject(new Error("database is closed"));var o=this;return this.taskqueue.isReady?t.apply(this,r):new n.Promise(function(t,n){o.taskqueue.addTask(function(i){i?n(i):t(o[e].apply(o,r))})})}))},n.arrayBufferToBinaryString=function(e){for(var t="",n=new Uint8Array(e),r=n.byteLength,o=0;r>o;o++)t+=String.fromCharCode(n[o]);return t},n.cancellableFun=function(e,t,r){r=r?n.clone(!0,{},r):{};var o=new l,i=r.complete||function(){},s=r.complete=n.once(function(e,t){e?i(e):(o.emit("end",t),i(null,t)),o.removeAllListeners()}),a=r.onChange||function(){},u=0;t.on("destroyed",function(){o.removeAllListeners()}),r.onChange=function(e){a(e),e.seq<=u||(u=e.seq,o.emit("change",e),e.deleted?o.emit("delete",e):1===e.changes.length&&"1-"===e.changes[0].rev.slice(0,1)?o.emit("create",e):o.emit("update",e))};var c=new f(function(e,t){r.complete=function(n,r){n?t(n):e(r)}});return c.then(function(e){s(null,e)},s),c.cancel=function(){c.isCancelled=!0,t.taskqueue.isReady&&r.complete(null,{status:"cancelled"})},t.taskqueue.isReady?e(t,r,c):t.taskqueue.addTask(function(){c.isCancelled?r.complete(null,{status:"cancelled"}):e(t,r,c)}),c.on=o.on.bind(o),c.once=o.once.bind(o),c.addListener=o.addListener.bind(o),c.removeListener=o.removeListener.bind(o),c.removeAllListeners=o.removeAllListeners.bind(o),c.setMaxListeners=o.setMaxListeners.bind(o),c.listeners=o.listeners.bind(o),c.emit=o.emit.bind(o),c},n.MD5=n.toPromise(e("./deps/md5"))}).call(this,e("/Users/nolan/workspace/pouchdb/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./deps/ajax":8,"./deps/blob":9,"./deps/buffer":26,"./deps/collections":10,"./deps/errors":11,"./deps/md5":12,"./deps/uuid":14,"./merge":18,"/Users/nolan/workspace/pouchdb/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":28,argsarray:25,bluebird:33,events:27,inherits:29,"pouchdb-extend":47}],24:[function(e,t){t.exports="3.0.5"},{}],25:[function(e,t){"use strict";function n(e){return function(){var t=arguments.length;if(t){for(var n=[],r=-1;++r<t;)n[r]=arguments[r];return e.call(this,n)}return e.call(this,[])}}t.exports=n},{}],26:[function(){},{}],27:[function(e,t){function n(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function r(e){return"function"==typeof e}function o(e){return"number"==typeof e}function i(e){return"object"==typeof e&&null!==e}function s(e){return void 0===e}t.exports=n,n.EventEmitter=n,n.prototype._events=void 0,n.prototype._maxListeners=void 0,n.defaultMaxListeners=10,n.prototype.setMaxListeners=function(e){if(!o(e)||0>e||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},n.prototype.emit=function(e){var t,n,o,a,u,c;if(this._events||(this._events={}),"error"===e&&(!this._events.error||i(this._events.error)&&!this._events.error.length)){if(t=arguments[1],t instanceof Error)throw t;throw TypeError('Uncaught, unspecified "error" event.')}if(n=this._events[e],s(n))return!1;if(r(n))switch(arguments.length){case 1:n.call(this);break;case 2:n.call(this,arguments[1]);break;case 3:n.call(this,arguments[1],arguments[2]);break;default:for(o=arguments.length,a=new Array(o-1),u=1;o>u;u++)a[u-1]=arguments[u];n.apply(this,a)}else if(i(n)){for(o=arguments.length,a=new Array(o-1),u=1;o>u;u++)a[u-1]=arguments[u];for(c=n.slice(),o=c.length,u=0;o>u;u++)c[u].apply(this,a)}return!0},n.prototype.addListener=function(e,t){var o;if(!r(t))throw TypeError("listener must be a function");if(this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,r(t.listener)?t.listener:t),this._events[e]?i(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,i(this._events[e])&&!this._events[e].warned){var o;o=s(this._maxListeners)?n.defaultMaxListeners:this._maxListeners,o&&o>0&&this._events[e].length>o&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace())}return this},n.prototype.on=n.prototype.addListener,n.prototype.once=function(e,t){function n(){this.removeListener(e,n),o||(o=!0,t.apply(this,arguments))}if(!r(t))throw TypeError("listener must be a function");var o=!1;return n.listener=t,this.on(e,n),this},n.prototype.removeListener=function(e,t){var n,o,s,a;if(!r(t))throw TypeError("listener must be a function");if(!this._events||!this._events[e])return this;if(n=this._events[e],s=n.length,o=-1,n===t||r(n.listener)&&n.listener===t)delete this._events[e],this._events.removeListener&&this.emit("removeListener",e,t);else if(i(n)){for(a=s;a-->0;)if(n[a]===t||n[a].listener&&n[a].listener===t){o=a;break}if(0>o)return this;1===n.length?(n.length=0,delete this._events[e]):n.splice(o,1),this._events.removeListener&&this.emit("removeListener",e,t)}return this},n.prototype.removeAllListeners=function(e){var t,n;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this;if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t);return this.removeAllListeners("removeListener"),this._events={},this}if(n=this._events[e],r(n))this.removeListener(e,n);else for(;n.length;)this.removeListener(e,n[n.length-1]);return delete this._events[e],this},n.prototype.listeners=function(e){var t;return t=this._events&&this._events[e]?r(this._events[e])?[this._events[e]]:this._events[e].slice():[]},n.listenerCount=function(e,t){var n;return n=e._events&&e._events[t]?r(e._events[t])?1:e._events[t].length:0}},{}],28:[function(e,t){var n=t.exports={};n.nextTick=function(){var e="undefined"!=typeof window&&window.setImmediate,t="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(e)return function(e){return window.setImmediate(e)};if(t){var n=[];return window.addEventListener("message",function(e){var t=e.source;if((t===window||null===t)&&"process-tick"===e.data&&(e.stopPropagation(),n.length>0)){var r=n.shift();r()}},!0),function(e){n.push(e),window.postMessage("process-tick","*")}}return function(e){setTimeout(e,0)}}(),n.title="browser",n.browser=!0,n.env={},n.argv=[],n.binding=function(){throw new Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(){throw new Error("process.chdir is not supported")}},{}],29:[function(e,t){t.exports="function"==typeof Object.create?function(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}:function(e,t){e.super_=t;var n=function(){};n.prototype=t.prototype,e.prototype=new n,e.prototype.constructor=e}},{}],30:[function(e,t){"use strict";function n(){}t.exports=n},{}],31:[function(e,t){"use strict";var n=e("./promise"),r=e("./reject"),o=e("./resolve"),i=e("./INTERNAL"),s=e("./handlers"),a=r(new TypeError("must be an array"));t.exports=function(e){function t(e,t){function n(e){c[t]=e,++l===r&!u&&(u=!0,s.resolve(f,c))}o(e).then(n,function(e){u||(u=!0,s.reject(f,e))})}if("[object Array]"!==Object.prototype.toString.call(e))return a;var r=e.length,u=!1;if(!r)return o([]);for(var c=new Array(r),l=0,d=-1,f=new n(i);++d<r;)t(e[d],d);return f}},{"./INTERNAL":30,"./handlers":32,"./promise":34,"./reject":36,"./resolve":37}],32:[function(e,t,n){"use strict";function r(e){var t=e&&e.then;return e&&"object"==typeof e&&"function"==typeof t?function(){t.apply(e,arguments)}:void 0}var o=e("./tryCatch"),i=e("./resolveThenable"),s=e("./states");
n.resolve=function(e,t){var a=o(r,t);if("error"===a.status)return n.reject(e,a.value);var u=a.value;if(u)i.safely(e,u);else{e.state=s.FULFILLED,e.outcome=t;for(var c=-1,l=e.queue.length;++c<l;)e.queue[c].callFulfilled(t)}return e},n.reject=function(e,t){e.state=s.REJECTED,e.outcome=t;for(var n=-1,r=e.queue.length;++n<r;)e.queue[n].callRejected(t);return e}},{"./resolveThenable":38,"./states":39,"./tryCatch":40}],33:[function(e,t,n){t.exports=n=e("./promise"),n.resolve=e("./resolve"),n.reject=e("./reject"),n.all=e("./all")},{"./all":31,"./promise":34,"./reject":36,"./resolve":37}],34:[function(e,t){"use strict";function n(e){if(!(this instanceof n))return new n(e);if("function"!=typeof e)throw new TypeError("reslover must be a function");this.state=s.PENDING,this.queue=[],this.outcome=void 0,e!==o&&i.safely(this,e)}var r=e("./unwrap"),o=e("./INTERNAL"),i=e("./resolveThenable"),s=e("./states"),a=e("./queueItem");t.exports=n,n.prototype["catch"]=function(e){return this.then(null,e)},n.prototype.then=function(e,t){if("function"!=typeof e&&this.state===s.FULFILLED||"function"!=typeof t&&this.state===s.REJECTED)return this;var i=new n(o);if(this.state!==s.PENDING){var u=this.state===s.FULFILLED?e:t;r(i,u,this.outcome)}else this.queue.push(new a(i,e,t));return i}},{"./INTERNAL":30,"./queueItem":35,"./resolveThenable":38,"./states":39,"./unwrap":41}],35:[function(e,t){"use strict";function n(e,t,n){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof n&&(this.onRejected=n,this.callRejected=this.otherCallRejected)}var r=e("./handlers"),o=e("./unwrap");t.exports=n,n.prototype.callFulfilled=function(e){r.resolve(this.promise,e)},n.prototype.otherCallFulfilled=function(e){o(this.promise,this.onFulfilled,e)},n.prototype.callRejected=function(e){r.reject(this.promise,e)},n.prototype.otherCallRejected=function(e){o(this.promise,this.onRejected,e)}},{"./handlers":32,"./unwrap":41}],36:[function(e,t){"use strict";function n(e){var t=new r(o);return i.reject(t,e)}var r=e("./promise"),o=e("./INTERNAL"),i=e("./handlers");t.exports=n},{"./INTERNAL":30,"./handlers":32,"./promise":34}],37:[function(e,t){"use strict";function n(e){if(e)return e instanceof r?e:i.resolve(new r(o),e);var t=typeof e;switch(t){case"boolean":return s;case"undefined":return u;case"object":return a;case"number":return c;case"string":return l}}var r=e("./promise"),o=e("./INTERNAL"),i=e("./handlers");t.exports=n;var s=i.resolve(new r(o),!1),a=i.resolve(new r(o),null),u=i.resolve(new r(o),void 0),c=i.resolve(new r(o),0),l=i.resolve(new r(o),"")},{"./INTERNAL":30,"./handlers":32,"./promise":34}],38:[function(e,t,n){"use strict";function r(e,t){function n(t){a||(a=!0,o.reject(e,t))}function r(t){a||(a=!0,o.resolve(e,t))}function s(){t(r,n)}var a=!1,u=i(s);"error"===u.status&&n(u.value)}var o=e("./handlers"),i=e("./tryCatch");n.safely=r},{"./handlers":32,"./tryCatch":40}],39:[function(e,t,n){n.REJECTED=["REJECTED"],n.FULFILLED=["FULFILLED"],n.PENDING=["PENDING"]},{}],40:[function(e,t){"use strict";function n(e,t){var n={};try{n.value=e(t),n.status="success"}catch(r){n.status="error",n.value=r}return n}t.exports=n},{}],41:[function(e,t){"use strict";function n(e,t,n){r(function(){var r;try{r=t(n)}catch(i){return o.reject(e,i)}r===e?o.reject(e,new TypeError("Cannot resolve promise with itself")):o.resolve(e,r)})}var r=e("immediate"),o=e("./handlers");t.exports=n},{"./handlers":32,immediate:42}],42:[function(e,t){"use strict";function n(){o=!0;for(var e,t,n=a.length;n;){for(t=a,a=[],e=-1;++e<n;)t[e]();n=a.length}o=!1}function r(e){1!==a.push(e)||o||i()}for(var o,i,s=[e("./nextTick"),e("./mutation.js"),e("./messageChannel"),e("./stateChange"),e("./timeout")],a=[],u=-1,c=s.length;++u<c;)if(s[u]&&s[u].test&&s[u].test()){i=s[u].install(n);break}t.exports=r},{"./messageChannel":43,"./mutation.js":44,"./nextTick":26,"./stateChange":45,"./timeout":46}],43:[function(e,t,n){(function(e){"use strict";n.test=function(){return e.setImmediate?!1:"undefined"!=typeof e.MessageChannel},n.install=function(t){var n=new e.MessageChannel;return n.port1.onmessage=t,function(){n.port2.postMessage(0)}}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],44:[function(e,t,n){(function(e){"use strict";var t=e.MutationObserver||e.WebKitMutationObserver;n.test=function(){return t},n.install=function(n){var r=0,o=new t(n),i=e.document.createTextNode("");return o.observe(i,{characterData:!0}),function(){i.data=r=++r%2}}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],45:[function(e,t,n){(function(e){"use strict";n.test=function(){return"document"in e&&"onreadystatechange"in e.document.createElement("script")},n.install=function(t){return function(){var n=e.document.createElement("script");return n.onreadystatechange=function(){t(),n.onreadystatechange=null,n.parentNode.removeChild(n),n=null},e.document.documentElement.appendChild(n),t}}}).call(this,"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],46:[function(e,t,n){"use strict";n.test=function(){return!0},n.install=function(e){return function(){setTimeout(e,0)}}},{}],47:[function(e,t){"use strict";function n(e){return null===e?String(e):"object"==typeof e||"function"==typeof e?u[f.call(e)]||"object":typeof e}function r(e){return null!==e&&e===e.window}function o(e){if(!e||"object"!==n(e)||e.nodeType||r(e))return!1;try{if(e.constructor&&!p.call(e,"constructor")&&!p.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(t){return!1}var o;for(o in e);return void 0===o||p.call(e,o)}function i(e){return"function"===n(e)}function s(){for(var e=[],t=-1,n=arguments.length,r=new Array(n);++t<n;)r[t]=arguments[t];var o={};e.push({args:r,result:{container:o,key:"key"}});for(var i;i=e.pop();)a(e,i.args,i.result);return o.key}function a(e,t,n){var r,s,a,u,c,l,d,f=t[0]||{},p=1,v=t.length,m=!1,_=/\d+/;for("boolean"==typeof f&&(m=f,f=t[1]||{},p=2),"object"==typeof f||i(f)||(f={}),v===p&&(f=this,--p);v>p;p++)if(null!=(r=t[p])){d=h(r);for(s in r)if(!(s in Object.prototype)){if(d&&!_.test(s))continue;if(a=f[s],u=r[s],f===u)continue;m&&u&&(o(u)||(c=h(u)))?(c?(c=!1,l=a&&h(a)?a:[]):l=a&&o(a)?a:{},e.push({args:[m,l,u],result:{container:f,key:s}})):void 0!==u&&(h(r)&&i(u)||(f[s]=u))}}n.container[n.key]=f}for(var u={},c=["Boolean","Number","String","Function","Array","Date","RegExp","Object","Error"],l=0;l<c.length;l++){var d=c[l];u["[object "+d+"]"]=d.toLowerCase()}var f=u.toString,p=u.hasOwnProperty,h=Array.isArray||function(e){return"array"===n(e)};t.exports=s},{}],48:[function(e,t){"use strict";var n=e("./upsert"),r=e("./utils"),o=r.Promise;t.exports=function(e){var t=e.db,i=e.viewName,s=e.map,a=e.reduce,u=e.temporary,c=s.toString()+(a&&a.toString())+"undefined";if(!u&&t._cachedViews){var l=t._cachedViews[c];if(l)return o.resolve(l)}return t.info().then(function(e){function o(e){e.views=e.views||{};var t=i;-1===t.indexOf("/")&&(t=i+"/"+i);var n=e.views[t]=e.views[t]||{};if(!n[l])return n[l]=!0,e}var l=e.db_name+"-mrview-"+(u?"temp":r.MD5(c));return n(t,"_local/mrviews",o).then(function(){return t.registerDependentDatabase(l).then(function(e){var n=e.db;n.auto_compaction=!0;var r={name:l,db:n,sourceDB:t,adapter:t.adapter,mapFun:s,reduceFun:a};return r.db.get("_local/lastSeq")["catch"](function(e){if(404!==e.status)throw e}).then(function(e){return r.seq=e?e.seq:0,u||(t._cachedViews=t._cachedViews||{},t._cachedViews[c]=r,r.db.on("destroyed",function(){delete t._cachedViews[c]})),r})})})})}},{"./upsert":54,"./utils":55}],49:[function(_dereq_,module,exports){"use strict";module.exports=function(func,emit,sum,log,isArray,toJSON){return eval("'use strict'; ("+func.replace(/;\s*$/,"")+");")}},{}],50:[function(e,t,n){(function(t){"use strict";function r(e){return-1===e.indexOf("/")?[e,e]:e.split("/")}function o(e,t,n){try{return{output:t.apply(null,n)}}catch(r){return e.emit("error",r),{error:r}}}function i(e,t){var n=S(e.key,t.key);return 0!==n?n:S(e.value,t.value)}function s(e,t,n){return n=n||0,"number"==typeof t?e.slice(n,t+n):n>0?e.slice(n):e}function a(e){var t=new Error("builtin "+e+" function requires map values to be numbers or number arrays");return t.name="invalid_value",t.status=500,t}function u(e){for(var t=0,n=0,r=e.length;r>n;n++){var o=e[n];if("number"!=typeof o){if(!Array.isArray(o))throw a("_sum");t="number"==typeof t?[t]:t;for(var i=0,s=o.length;s>i;i++){var u=o[i];if("number"!=typeof u)throw a("_sum");"undefined"==typeof t[i]?t.push(u):t[i]+=u}}else"number"==typeof t?t+=o:t[0]+=o}return t}function c(e,t,n,r){var o=t[e];"undefined"!=typeof o&&(r&&(o=encodeURIComponent(JSON.stringify(o))),n.push(e+"="+o))}function l(e,t){var n=e.descending?"endkey":"startkey",r=e.descending?"startkey":"endkey";if("undefined"!=typeof e[n]&&"undefined"!=typeof e[r]&&S(e[n],e[r])>0)throw new y("No rows can match your key range, reverse your start_key and end_key or set {descending : true}");if(t.reduce&&e.reduce!==!1){if(e.include_docs)throw new y("{include_docs:true} is invalid for reduce");if(e.keys&&e.keys.length>1&&!e.group&&!e.group_level)throw new y("Multi-key fetches for reduce views must use {group: true}")}if(e.group_level){if("number"!=typeof e.group_level)throw new y('Invalid value for integer: "'+e.group_level+'"');if(e.group_level<0)throw new y('Invalid value for positive integer: "'+e.group_level+'"')}}function d(e,t,n){var o,i=[],s="GET";if(c("reduce",n,i),c("include_docs",n,i),c("limit",n,i),c("descending",n,i),c("group",n,i),c("group_level",n,i),c("skip",n,i),c("stale",n,i),c("startkey",n,i,!0),c("endkey",n,i,!0),c("inclusive_end",n,i),c("key",n,i,!0),i=i.join("&"),i=""===i?"":"?"+i,"undefined"!=typeof n.keys){var a=2e3,u="keys="+encodeURIComponent(JSON.stringify(n.keys));u.length+i.length+1<=a?i+=("?"===i[0]?"&":"?")+u:(s="POST","string"==typeof t?o=JSON.stringify({keys:n.keys}):t.keys=n.keys)}if("string"==typeof t){var l=r(t);return e.request({method:s,url:"_design/"+l[0]+"/_view/"+l[1]+i,body:o})}return o=o||{},Object.keys(t).forEach(function(e){o[e]=Array.isArray(t[e])?t[e]:t[e].toString()}),e.request({method:"POST",url:"_temp_view"+i,body:o})}function f(e){return function(t){if(404===t.status)return e;throw t}}function p(e,t,n){var r="_local/doc_"+e;return t.db.get(r)["catch"](f({_id:r,keys:[]})).then(function(r){return O.resolve().then(function(){return r.keys.length?t.db.allDocs({keys:r.keys,include_docs:!0}):{rows:[]}}).then(function(t){var o=t.rows.map(function(e){return e.doc}).filter(function(e){return e}),i=n[e],s={};o.forEach(function(e){if(s[e._id]=!0,e._deleted=!i[e._id],!e._deleted){var t=i[e._id];"value"in t&&(e.value=t.value)}});var a=Object.keys(i);return a.forEach(function(e){if(!s[e]){var t={_id:e},n=i[e];"value"in n&&(t.value=n.value),o.push(t)}}),r.keys=A.uniq(a.concat(r.keys)),o.splice(0,0,r),o})})}function h(e,t,n){var r="_local/lastSeq";return e.db.get(r)["catch"](f({_id:r,seq:0})).then(function(r){var o=Object.keys(t);return O.all(o.map(function(n){return p(n,e,t)})).then(function(t){var o=[];return t.forEach(function(e){o=o.concat(e)}),r.seq=n,o.push(r),e.db.bulkDocs({docs:o})})})}function v(e,t,n){0===n.group_level&&delete n.group_level;var r,i=n.group||n.group_level;r=D[e.reduceFun]?D[e.reduceFun]:T(e.reduceFun.toString(),null,u,b,Array.isArray,JSON.parse);var a=[],c=n.group_level;t.forEach(function(e){var t=a[a.length-1],n=i?e.key:null;return i&&Array.isArray(n)&&"number"==typeof c&&(n=n.length>c?n.slice(0,c):n),t&&0===S(t.key[0][0],n)?(t.key.push([n,e.id]),void t.value.push(e.value)):void a.push({key:[[n,e.id]],value:[e.value]})});for(var l=0,d=a.length;d>l;l++){var f=a[l],p=o(e.sourceDB,r,[f.key,f.value,!1]);f.value=p.error?null:p.output,f.key=f.key[0][0]}return{rows:s(a,n.limit,n.skip)}}function m(e){return e.request({method:"POST",url:"_view_cleanup"})}function _(e,n,o){if("http"===e.type())return d(e,n,o);if("string"!=typeof n){l(o,n);var i={db:e,viewName:"temp_view/temp_view",map:n.map,reduce:n.reduce,temporary:!0};return R.add(function(){return q(i).then(function(e){function t(){return e.db.destroy()}return A.fin(C(e).then(function(){return N(e,o)}),t)})}),R.finish()}var s=n,a=r(s),u=a[0],c=a[1];return e.get("_design/"+u).then(function(n){var r=n.views&&n.views[c];if(!r||"string"!=typeof r.map)throw new g("ddoc "+u+" has no view named "+c);l(o,r);var i={db:e,viewName:s,map:r.map,reduce:r.reduce};return q(i).then(function(e){return"ok"===o.stale||"update_after"===o.stale?("update_after"===o.stale&&t.nextTick(function(){C(e)}),N(e,o)):C(e).then(function(){return N(e,o)})})})}function y(e){this.status=400,this.name="query_parse_error",this.message=e,this.error=!0;try{Error.captureStackTrace(this,y)}catch(t){}}function g(e){this.status=404,this.name="not_found",this.message=e,this.error=!0;try{Error.captureStackTrace(this,g)}catch(t){}}var b,w=e("pouchdb-collate"),E=e("./taskqueue"),S=w.collate,k=w.toIndexableString,x=w.normalizeKey,q=e("./create-view"),T=e("./evalfunc");b="undefined"!=typeof console&&"function"==typeof console.log?Function.prototype.bind.call(console.log,console):function(){};var A=e("./utils"),O=A.Promise,L=new E,R=new E,I=50,D={_sum:function(e,t){return u(t)},_count:function(e,t){return t.length},_stats:function(e,t){function n(e){for(var t=0,n=0,r=e.length;r>n;n++){var o=e[n];t+=o*o}return t}return{sum:u(t),min:Math.min.apply(null,t),max:Math.max.apply(null,t),count:t.length,sumsqr:n(t)}}},C=A.sequentialize(L,function(e){function t(e,t){var n={id:s._id,key:x(e)};"undefined"!=typeof t&&null!==t&&(n.value=x(t)),r.push(n)}function n(t,n){return function(){return h(e,t,n)}}var r,s,a;if("function"==typeof e.mapFun&&2===e.mapFun.length){var c=e.mapFun;a=function(e){return c(e,t)}}else a=T(e.mapFun.toString(),t,u,b,Array.isArray,JSON.parse);var l=e.seq||0,d=new E;return new O(function(t,u){function c(){d.finish().then(function(){e.seq=l,t()})}function f(){function t(e){u(e)}e.sourceDB.changes({conflicts:!0,include_docs:!0,since:l,limit:I}).on("complete",function(t){var u=t.results;if(!u.length)return c();for(var p={},h=0,v=u.length;v>h;h++){var m=u[h];if("_"!==m.doc._id[0]){r=[],s=m.doc,s._deleted||o(e.sourceDB,a,[s]),r.sort(i);for(var _,y={},g=0,b=r.length;b>g;g++){var w=r[g],E=[w.key,w.id];w.key===_&&E.push(g);var S=k(E);y[S]=w,_=w.key}p[m.doc._id]=y}l=m.seq}return d.add(n(p,l)),u.length<I?c():f()}).on("error",t)}f()})}),N=A.sequentialize(L,function(e,t){function n(t){return t.include_docs=!0,e.db.allDocs(t).then(function(e){return o=e.total_rows,e.rows.map(function(e){if("value"in e.doc&&"object"==typeof e.doc.value&&null!==e.doc.value){var t=Object.keys(e.doc.value).sort(),n=["id","key","value"];if(!(n>t||t>n))return e.doc.value}var r=w.parseIndexableString(e.doc._id);return{key:r[0],id:r[1],value:"value"in e.doc?e.doc.value:null}})})}function r(n){var r;if(r=i?v(e,n,t):{total_rows:o,offset:s,rows:n},t.include_docs){var a=n.map(function(t){var n=t.value,r=n&&"object"==typeof n&&n._id||t.id;return e.sourceDB.get(r).then(function(e){t.doc=e},function(){})});return O.all(a).then(function(){return r})}return r}var o,i=e.reduceFun&&t.reduce!==!1,s=t.skip||0;"undefined"==typeof t.keys||t.keys.length||(t.limit=0,delete t.keys);var a=function(e){return e.reduce(function(e,t){return e.concat(t)})};if("undefined"!=typeof t.keys){var u=t.keys,c=u.map(function(e){var t={startkey:k([e]),endkey:k([e,{}])};return n(t)});return O.all(c).then(a).then(r)}var l={descending:t.descending};if("undefined"!=typeof t.startkey&&(l.startkey=k(t.descending?[t.startkey,{}]:[t.startkey])),"undefined"!=typeof t.endkey){var d=t.inclusive_end!==!1;t.descending&&(d=!d),l.endkey=k(d?[t.endkey,{}]:[t.endkey])}if("undefined"!=typeof t.key){var f=k([t.key]),p=k([t.key,{}]);l.descending?(l.endkey=f,l.startkey=p):(l.startkey=f,l.endkey=p)}return i||("number"==typeof t.limit&&(l.limit=t.limit),l.skip=s),n(l).then(r)}),j=A.sequentialize(L,function(e){return e.get("_local/mrviews").then(function(t){var n={};Object.keys(t.views).forEach(function(e){var t=r(e),o="_design/"+t[0],i=t[1];n[o]=n[o]||{},n[o][i]=!0});var o={keys:Object.keys(n),include_docs:!0};return e.allDocs(o).then(function(r){var o={};r.rows.forEach(function(e){var r=e.key.substring(8);Object.keys(n[e.key]).forEach(function(n){var i=r+"/"+n;t.views[i]||(i=n);var s=Object.keys(t.views[i]),a=e.doc&&e.doc.views&&e.doc.views[n];s.forEach(function(e){o[e]=o[e]||a})})});var i=Object.keys(o).filter(function(e){return!o[e]}),s=i.map(function(t){return e.constructor.destroy(t,{adapter:e.adapter})});return O.all(s).then(function(){return{ok:!0}})})},f({ok:!0}))});n.viewCleanup=A.callbackify(function(){var e=this;return"http"===e.type()?m(e):j(e)}),n.query=function(e,t,n){"function"==typeof t&&(n=t,t={}),t=A.extend(!0,{},t),"function"==typeof e&&(e={map:e});var r=this,o=O.resolve().then(function(){return _(r,e,t)});return A.promisedCallback(o,n),o},A.inherits(y,Error),A.inherits(g,Error)}).call(this,e("/Users/nolan/workspace/pouchdb/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))},{"./create-view":48,"./evalfunc":49,"./taskqueue":53,"./utils":55,"/Users/nolan/workspace/pouchdb/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":28,"pouchdb-collate":51}],51:[function(e,t,n){"use strict";function r(e){if(null!==e)switch(typeof e){case"boolean":return e?1:0;case"number":return l(e);case"string":return e.replace(/\u0002/g,"").replace(/\u0001/g,"").replace(/\u0000/g,"");case"object":var t=Array.isArray(e),r=t?e:Object.keys(e),o=-1,i=r.length,s="";if(t)for(;++o<i;)s+=n.toIndexableString(r[o]);else for(;++o<i;){var a=r[o];s+=n.toIndexableString(a)+n.toIndexableString(e[a])}return s}return""}function o(e,t){var n,r=t,o="1"===e[t];if(o)n=0,t++;else{var i="0"===e[t];t++;var s="",a=e.substring(t,t+f),u=parseInt(a,10)+d;for(i&&(u=-u),t+=f;;){var c=e[t];if("\x00"===c)break;s+=c,t++}s=s.split("."),n=1===s.length?parseInt(s,10):parseFloat(s[0]+"."+s[1]),i&&(n-=10),0!==u&&(n=parseFloat(n+"e"+u))}return{num:n,length:t-r}}function i(e,t){var n=e.pop();if(t.length){var r=t[t.length-1];n===r.element&&(t.pop(),r=t[t.length-1]);var o=r.element,i=r.index;if(Array.isArray(o))o.push(n);else if(i===e.length-2){var s=e.pop();o[s]=n}else e.push(n)}}function s(e,t){for(var r=Math.min(e.length,t.length),o=0;r>o;o++){var i=n.collate(e[o],t[o]);if(0!==i)return i}return e.length===t.length?0:e.length>t.length?1:-1}function a(e,t){return e===t?0:e>t?1:-1}function u(e,t){for(var r=Object.keys(e),o=Object.keys(t),i=Math.min(r.length,o.length),s=0;i>s;s++){var a=n.collate(r[s],o[s]);if(0!==a)return a;if(a=n.collate(e[r[s]],t[o[s]]),0!==a)return a}return r.length===o.length?0:r.length>o.length?1:-1}function c(e){var t=["boolean","number","string","object"],n=t.indexOf(typeof e);return~n?null===e?1:Array.isArray(e)?5:3>n?n+2:n+3:Array.isArray(e)?5:void 0}function l(e){if(0===e)return"1";var t=e.toExponential().split(/e\+?/),n=parseInt(t[1],10),r=0>e,o=r?"0":"2",i=(r?-n:n)-d,s=h.padLeft(i.toString(),"0",f);o+=p+s;var a=Math.abs(parseFloat(t[0]));r&&(a=10-a);var u=a.toFixed(20);return u=u.replace(/\.?0+$/,""),o+=p+u}var d=-324,f=3,p="",h=e("./utils");n.collate=function(e,t){if(e===t)return 0;e=n.normalizeKey(e),t=n.normalizeKey(t);var r=c(e),o=c(t);if(r-o!==0)return r-o;if(null===e)return 0;switch(typeof e){case"number":return e-t;case"boolean":return e===t?0:t>e?-1:1;case"string":return a(e,t)}return Array.isArray(e)?s(e,t):u(e,t)},n.normalizeKey=function(e){switch(typeof e){case"undefined":return null;case"number":return 1/0===e||e===-1/0||isNaN(e)?null:e;case"object":var t=e;if(Array.isArray(e)){var r=e.length;e=new Array(r);for(var o=0;r>o;o++)e[o]=n.normalizeKey(t[o])}else{if(e instanceof Date)return e.toJSON();if(null!==e){e={};for(var i in t)if(t.hasOwnProperty(i)){var s=t[i];"undefined"!=typeof s&&(e[i]=n.normalizeKey(s))}}}}return e},n.toIndexableString=function(e){var t="\x00";return e=n.normalizeKey(e),c(e)+p+r(e)+t},n.parseIndexableString=function(e){for(var t=[],n=[],r=0;;){var s=e[r++];if("\x00"!==s)switch(s){case"1":t.push(null);break;case"2":t.push("1"===e[r]),r++;break;case"3":var a=o(e,r);t.push(a.num),r+=a.length;break;case"4":for(var u="";;){var c=e[r];if("\x00"===c)break;u+=c,r++}u=u.replace(/\u0001\u0001/g,"\x00").replace(/\u0001\u0002/g,"").replace(/\u0002\u0002/g,""),t.push(u);break;case"5":var l={element:[],index:t.length};t.push(l.element),n.push(l);break;case"6":var d={element:{},index:t.length};t.push(d.element),n.push(d);break;default:throw new Error("bad collationIndex or unexpectedly reached end of input: "+s)}else{if(1===t.length)return t.pop();i(t,n)}}}},{"./utils":52}],52:[function(e,t,n){"use strict";function r(e,t,n){for(var r="",o=n-e.length;r.length<o;)r+=t;return r}n.padLeft=function(e,t,n){var o=r(e,t,n);return o+e},n.padRight=function(e,t,n){var o=r(e,t,n);return e+o},n.stringLexCompare=function(e,t){var n,r=e.length,o=t.length;for(n=0;r>n;n++){if(n===o)return 1;var i=e.charAt(n),s=t.charAt(n);if(i!==s)return s>i?-1:1}return o>r?-1:0},n.intToDecimalForm=function(e){var t=0>e,n="";do{var r=t?-Math.ceil(e%10):Math.floor(e%10);n=r+n,e=t?Math.ceil(e/10):Math.floor(e/10)}while(e);return t&&"0"!==n&&(n="-"+n),n}},{}],53:[function(e,t){"use strict";function n(){this.promise=new r(function(e){e()})}var r=e("./utils").Promise;n.prototype.add=function(e){return this.promise=this.promise["catch"](function(){}).then(function(){return e()}),this.promise},n.prototype.finish=function(){return this.promise},t.exports=n},{"./utils":55}],54:[function(e,t){"use strict";function n(e,t,n){return new o(function(o,i){return t&&"object"==typeof t&&(t=t._id),"string"!=typeof t?i(new Error("doc id is required")):void e.get(t,function(s,a){if(s)return 404!==s.status?i(s):o(r(e,n({_id:t}),n));var u=n(a);return u?void o(r(e,u,n)):o(a)})})}function r(e,t,r){return e.put(t)["catch"](function(o){if(409!==o.status)throw o;return n(e,t,r)})}var o=e("./utils").Promise;t.exports=n},{"./utils":55}],55:[function(e,t,n){(function(t,r){"use strict";n.Promise="function"==typeof r.Promise?r.Promise:e("lie"),n.uniq=function(e){var t={};return e.forEach(function(e){t[e]=!0}),Object.keys(t)},n.inherits=e("inherits"),n.extend=e("pouchdb-extend");var o=e("argsarray");n.promisedCallback=function(e,n){return n&&e.then(function(e){t.nextTick(function(){n(null,e)})},function(e){t.nextTick(function(){n(e)})}),e},n.callbackify=function(e){return o(function(t){var r=t.pop(),o=e.apply(this,t);return"function"==typeof r&&n.promisedCallback(o,r),o})},n.fin=function(e,t){return e.then(function(e){var n=t();return"function"==typeof n.then?n.then(function(){return e}):e},function(e){var n=t();if("function"==typeof n.then)return n.then(function(){throw e});throw e})},n.sequentialize=function(e,t){return function(){var n=arguments,r=this;return e.add(function(){return t.apply(r,n)})}};var i=e("crypto"),s=e("spark-md5");n.MD5=function(e){return t.browser?s.hash(e):i.createHash("md5").update(e).digest("hex")}}).call(this,e("/Users/nolan/workspace/pouchdb/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"),"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"/Users/nolan/workspace/pouchdb/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":28,argsarray:25,crypto:26,inherits:29,lie:33,"pouchdb-extend":47,"spark-md5":56}],56:[function(e,t,n){!function(e){if("object"==typeof n)t.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var r;try{r=window}catch(o){r=self}r.SparkMD5=e()}}(function(){"use strict";var e=function(e,t){return e+t&4294967295},t=function(t,n,r,o,i,s){return n=e(e(n,t),e(o,s)),e(n<<i|n>>>32-i,r)},n=function(e,n,r,o,i,s,a){return t(n&r|~n&o,e,n,i,s,a)},r=function(e,n,r,o,i,s,a){return t(n&o|r&~o,e,n,i,s,a)},o=function(e,n,r,o,i,s,a){return t(n^r^o,e,n,i,s,a)},i=function(e,n,r,o,i,s,a){return t(r^(n|~o),e,n,i,s,a)},s=function(t,s){var a=t[0],u=t[1],c=t[2],l=t[3];a=n(a,u,c,l,s[0],7,-680876936),l=n(l,a,u,c,s[1],12,-389564586),c=n(c,l,a,u,s[2],17,606105819),u=n(u,c,l,a,s[3],22,-1044525330),a=n(a,u,c,l,s[4],7,-176418897),l=n(l,a,u,c,s[5],12,1200080426),c=n(c,l,a,u,s[6],17,-1473231341),u=n(u,c,l,a,s[7],22,-45705983),a=n(a,u,c,l,s[8],7,1770035416),l=n(l,a,u,c,s[9],12,-1958414417),c=n(c,l,a,u,s[10],17,-42063),u=n(u,c,l,a,s[11],22,-1990404162),a=n(a,u,c,l,s[12],7,1804603682),l=n(l,a,u,c,s[13],12,-40341101),c=n(c,l,a,u,s[14],17,-1502002290),u=n(u,c,l,a,s[15],22,1236535329),a=r(a,u,c,l,s[1],5,-165796510),l=r(l,a,u,c,s[6],9,-1069501632),c=r(c,l,a,u,s[11],14,643717713),u=r(u,c,l,a,s[0],20,-373897302),a=r(a,u,c,l,s[5],5,-701558691),l=r(l,a,u,c,s[10],9,38016083),c=r(c,l,a,u,s[15],14,-660478335),u=r(u,c,l,a,s[4],20,-405537848),a=r(a,u,c,l,s[9],5,568446438),l=r(l,a,u,c,s[14],9,-1019803690),c=r(c,l,a,u,s[3],14,-187363961),u=r(u,c,l,a,s[8],20,1163531501),a=r(a,u,c,l,s[13],5,-1444681467),l=r(l,a,u,c,s[2],9,-51403784),c=r(c,l,a,u,s[7],14,1735328473),u=r(u,c,l,a,s[12],20,-1926607734),a=o(a,u,c,l,s[5],4,-378558),l=o(l,a,u,c,s[8],11,-2022574463),c=o(c,l,a,u,s[11],16,1839030562),u=o(u,c,l,a,s[14],23,-35309556),a=o(a,u,c,l,s[1],4,-1530992060),l=o(l,a,u,c,s[4],11,1272893353),c=o(c,l,a,u,s[7],16,-155497632),u=o(u,c,l,a,s[10],23,-1094730640),a=o(a,u,c,l,s[13],4,681279174),l=o(l,a,u,c,s[0],11,-358537222),c=o(c,l,a,u,s[3],16,-722521979),u=o(u,c,l,a,s[6],23,76029189),a=o(a,u,c,l,s[9],4,-640364487),l=o(l,a,u,c,s[12],11,-421815835),c=o(c,l,a,u,s[15],16,530742520),u=o(u,c,l,a,s[2],23,-995338651),a=i(a,u,c,l,s[0],6,-198630844),l=i(l,a,u,c,s[7],10,1126891415),c=i(c,l,a,u,s[14],15,-1416354905),u=i(u,c,l,a,s[5],21,-57434055),a=i(a,u,c,l,s[12],6,1700485571),l=i(l,a,u,c,s[3],10,-1894986606),c=i(c,l,a,u,s[10],15,-1051523),u=i(u,c,l,a,s[1],21,-2054922799),a=i(a,u,c,l,s[8],6,1873313359),l=i(l,a,u,c,s[15],10,-30611744),c=i(c,l,a,u,s[6],15,-1560198380),u=i(u,c,l,a,s[13],21,1309151649),a=i(a,u,c,l,s[4],6,-145523070),l=i(l,a,u,c,s[11],10,-1120210379),c=i(c,l,a,u,s[2],15,718787259),u=i(u,c,l,a,s[9],21,-343485551),t[0]=e(a,t[0]),t[1]=e(u,t[1]),t[2]=e(c,t[2]),t[3]=e(l,t[3])},a=function(e){var t,n=[];for(t=0;64>t;t+=4)n[t>>2]=e.charCodeAt(t)+(e.charCodeAt(t+1)<<8)+(e.charCodeAt(t+2)<<16)+(e.charCodeAt(t+3)<<24);return n},u=function(e){var t,n=[];for(t=0;64>t;t+=4)n[t>>2]=e[t]+(e[t+1]<<8)+(e[t+2]<<16)+(e[t+3]<<24);return n},c=function(e){var t,n,r,o,i,u,c=e.length,l=[1732584193,-271733879,-1732584194,271733878];for(t=64;c>=t;t+=64)s(l,a(e.substring(t-64,t)));for(e=e.substring(t-64),n=e.length,r=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],t=0;n>t;t+=1)r[t>>2]|=e.charCodeAt(t)<<(t%4<<3);if(r[t>>2]|=128<<(t%4<<3),t>55)for(s(l,r),t=0;16>t;t+=1)r[t]=0;return o=8*c,o=o.toString(16).match(/(.*?)(.{0,8})$/),i=parseInt(o[2],16),u=parseInt(o[1],16)||0,r[14]=i,r[15]=u,s(l,r),l},l=function(e){var t,n,r,o,i,a,c=e.length,l=[1732584193,-271733879,-1732584194,271733878];for(t=64;c>=t;t+=64)s(l,u(e.subarray(t-64,t)));for(e=c>t-64?e.subarray(t-64):new Uint8Array(0),n=e.length,r=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],t=0;n>t;t+=1)r[t>>2]|=e[t]<<(t%4<<3);if(r[t>>2]|=128<<(t%4<<3),t>55)for(s(l,r),t=0;16>t;t+=1)r[t]=0;return o=8*c,o=o.toString(16).match(/(.*?)(.{0,8})$/),i=parseInt(o[2],16),a=parseInt(o[1],16)||0,r[14]=i,r[15]=a,s(l,r),l},d=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"],f=function(e){var t,n="";for(t=0;4>t;t+=1)n+=d[e>>8*t+4&15]+d[e>>8*t&15];return n},p=function(e){var t;for(t=0;t<e.length;t+=1)e[t]=f(e[t]);return e.join("")},h=function(e){return p(c(e))},v=function(){this.reset()};return"5d41402abc4b2a76b9719d911017c592"!==h("hello")&&(e=function(e,t){var n=(65535&e)+(65535&t),r=(e>>16)+(t>>16)+(n>>16);return r<<16|65535&n}),v.prototype.append=function(e){return/[\u0080-\uFFFF]/.test(e)&&(e=unescape(encodeURIComponent(e))),this.appendBinary(e),this},v.prototype.appendBinary=function(e){this._buff+=e,this._length+=e.length;var t,n=this._buff.length;for(t=64;n>=t;t+=64)s(this._state,a(this._buff.substring(t-64,t)));return this._buff=this._buff.substr(t-64),this},v.prototype.end=function(e){var t,n,r=this._buff,o=r.length,i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(t=0;o>t;t+=1)i[t>>2]|=r.charCodeAt(t)<<(t%4<<3);return this._finish(i,o),n=e?this._state:p(this._state),this.reset(),n},v.prototype._finish=function(e,t){var n,r,o,i=t;if(e[i>>2]|=128<<(i%4<<3),i>55)for(s(this._state,e),i=0;16>i;i+=1)e[i]=0;n=8*this._length,n=n.toString(16).match(/(.*?)(.{0,8})$/),r=parseInt(n[2],16),o=parseInt(n[1],16)||0,e[14]=r,e[15]=o,s(this._state,e)},v.prototype.reset=function(){return this._buff="",this._length=0,this._state=[1732584193,-271733879,-1732584194,271733878],this},v.prototype.destroy=function(){delete this._state,delete this._buff,delete this._length},v.hash=function(e,t){/[\u0080-\uFFFF]/.test(e)&&(e=unescape(encodeURIComponent(e)));var n=c(e);return t?n:p(n)},v.hashBinary=function(e,t){var n=c(e);return t?n:p(n)},v.ArrayBuffer=function(){this.reset()},v.ArrayBuffer.prototype.append=function(e){var t,n=this._concatArrayBuffer(this._buff,e),r=n.length;for(this._length+=e.byteLength,t=64;r>=t;t+=64)s(this._state,u(n.subarray(t-64,t)));return this._buff=r>t-64?n.subarray(t-64):new Uint8Array(0),this},v.ArrayBuffer.prototype.end=function(e){var t,n,r=this._buff,o=r.length,i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(t=0;o>t;t+=1)i[t>>2]|=r[t]<<(t%4<<3);return this._finish(i,o),n=e?this._state:p(this._state),this.reset(),n},v.ArrayBuffer.prototype._finish=v.prototype._finish,v.ArrayBuffer.prototype.reset=function(){return this._buff=new Uint8Array(0),this._length=0,this._state=[1732584193,-271733879,-1732584194,271733878],this},v.ArrayBuffer.prototype.destroy=v.prototype.destroy,v.ArrayBuffer.prototype._concatArrayBuffer=function(e,t){var n=e.length,r=new Uint8Array(n+t.byteLength);return r.set(e),r.set(new Uint8Array(t),n),r},v.ArrayBuffer.hash=function(e,t){var n=l(new Uint8Array(e));return t?n:p(n)},v})},{}],57:[function(e,t,n){"use strict";function r(e,t,n){var r=n[n.length-1];e===r.element&&(n.pop(),r=n[n.length-1]);var o=r.element,i=r.index;if(Array.isArray(o))o.push(e);else if(i===t.length-2){var s=t.pop();o[s]=e}else t.push(e)}n.stringify=function(e){var t=[];t.push({obj:e});for(var n,r,o,i,s,a,u,c,l,d,f,p="";n=t.pop();)if(r=n.obj,o=n.prefix||"",i=n.val||"",p+=o,i)p+=i;else if("object"!=typeof r)p+="undefined"==typeof r?null:JSON.stringify(r);else if(null===r)p+="null";else if(Array.isArray(r)){for(t.push({val:"]"}),s=r.length-1;s>=0;s--)a=0===s?"":",",t.push({obj:r[s],prefix:a});t.push({val:"["})}else{u=[];for(c in r)r.hasOwnProperty(c)&&u.push(c);for(t.push({val:"}"}),s=u.length-1;s>=0;s--)l=u[s],d=r[l],f=s>0?",":"",f+=JSON.stringify(l)+":",t.push({obj:d,prefix:f});t.push({val:"{"})}return p},n.parse=function(e){for(var t,n,o,i,s,a,u,c,l,d=[],f=[],p=0;;)if(t=e[p++],"}"!==t&&"]"!==t&&"undefined"!=typeof t)switch(t){case" ":case"	":case"\n":case":":case",":break;case"n":p+=3,r(null,d,f);break;case"t":p+=3,r(!0,d,f);break;case"f":p+=4,r(!1,d,f);break;case"0":case"1":case"2":case"3":case"4":case"5":case"6":case"7":case"8":case"9":case"-":for(n="",p--;;){if(o=e[p++],!/[\d\.\-e\+]/.test(o)){p--;break}n+=o}r(parseFloat(n),d,f);break;case'"':for(i="",s=void 0,a=0;;){if(u=e[p++],'"'===u&&("\\"!==s||a%2!==1))break;i+=u,s=u,"\\"===s?a++:a=0}r(JSON.parse('"'+i+'"'),d,f);break;case"[":c={element:[],index:d.length},d.push(c.element),f.push(c);break;case"{":l={element:{},index:d.length},d.push(l.element),f.push(l);break;default:throw new Error("unexpectedly reached end of input: "+t)}else{if(1===d.length)return d.pop();r(d.pop(),d,f)}}},{}]},{},[17])(17)});;
(function()
{
 var Global=this,Runtime=this.IntelliFactory.Runtime,List,Html,Client,Attr,Samples,PouchDB,Client1,Tags,Option,Piglets,Pervasives,Piglet,Utils,Builder,Date,String,Seq,jQuery,Controls,Controls1,Operators,T,Concurrency,Defaults,PouchDB1,CodeMirror,Result,Stream,Strings,Arrays;
 Runtime.Define(Global,{
  WebSharper:{
   Samples:{
    PouchDB:{
     Client:{
      AccordionId:Runtime.Field(function()
      {
       return"accordion";
      }),
      Accordions:Runtime.Field(function()
      {
       var arg10;
       arg10=List.ofArray([Attr.Attr().NewAttr("id",Client1.AccordionId()),Attr.Attr().NewAttr("class","panel-group")]);
       return Tags.Tags().NewTag("div",arg10);
      }),
      AdderPiglet:Runtime.Field(function()
      {
       var action,_arg10_,_builder_,_arg00_,x1,x2;
       action=function(x)
       {
        return Option.iter(function(c)
        {
         return c.setOption("mode",Client1.LangMode(x.Language));
        },Client1.cm());
       };
       _builder_=Runtime.New(Builder,{
        $:0
       });
       _arg10_=Pervasives.op_LessMultiplyGreater(Pervasives.op_LessMultiplyGreater(Piglet.Return(function(a)
       {
        return function(b)
        {
         return Utils.flip(function(lang)
         {
          return function(code)
          {
           return Client1.mkSnippet(lang,code);
          };
         },a,b);
        };
       }),Piglet.Yield("")),_builder_.Bind(Piglet.Yield({
        $:0
       }),function(_arg1)
       {
        return _arg1.$==3?_builder_.ReturnFrom(Piglet.Map(function(a)
        {
         return{
          $:3,
          $0:a.$0
         };
        },Piglet.Yield({
         $:1,
         $0:""
        }))):_builder_.ReturnFrom(Piglet.Map(function(_arg10_1)
        {
         return Utils.cnst(_arg1,_arg10_1);
        },Piglet.Yield({
         $:0
        })));
       }));
       _arg00_=Piglet.Run(action,_arg10_);
       x1=Piglet.WithSubmit(_arg00_);
       x2=Piglet.Run(function(res)
       {
        var d;
        d=Date.now();
        Client1.db().put(res,String(d)).then(function()
        {
         var title;
         title=Client1.SnippetToString(res,new Date(d));
         Seq.iter(function(el)
         {
          return jQuery(Client1.Accordions().Dom).prepend(el.Dom).ready(function()
          {
           return el.Render();
          });
         },List.rev(Client1.MkPanel(Global.String(d),Client1.AccordionId(),title,Client1.CodePre(res.Code))));
         return jQuery(".saved-modal").modal("show");
        });
        return;
       },x1);
       return Piglet.Render(function(x)
       {
        return function(y)
        {
         return function(submitter)
         {
          var patternInput,textarea,c,arg10,_,submit,arg101,arg102,arg103;
          patternInput=Controls.CodeMirror(x);
          textarea=patternInput[0];
          c=patternInput[1];
          arg10=List.ofArray([Tags.Tags().text("Code")]);
          textarea.AppendN(Tags.Tags().NewTag("label",arg10).Dom);
          _={
           $:1,
           $0:c
          };
          Client1.cm=function()
          {
           return _;
          };
          submit=Controls1.Submit(submitter);
          submit["HtmlProvider@33"].AddClass(submit.get_Body(),"btn btn-primary");
          arg101=List.ofArray([Attr.Attr().NewAttr("class","form-horizontal")]);
          arg102=Runtime.New(T,{
           $:0
          });
          Operators.OnAfterRender(function()
          {
           return c.setValue("");
          },textarea);
          arg103=Runtime.New(T,{
           $:0
          });
          return Operators.add(Tags.Tags().NewTag("div",arg101),List.ofArray([y.Chooser(function(stream)
          {
           return Utils.FormControl("",Controls1.Select(stream,List.map(function(a)
           {
            return[a,Client1.LangName(a)];
           },Client1.Languages("Other"))));
          }),Controls1.RenderChoice(y,function(strm)
          {
           return Controls.InputOption(strm);
          },Tags.Tags().NewTag("div",arg102)),textarea,submit,Controls1.ShowResult(submitter,function(_arg2)
          {
           return _arg2.$==1?List.map(function(m)
           {
            var x3;
            x3=m.get_Message();
            return Tags.Tags().text(x3);
           },_arg2.$0):Runtime.New(T,{
            $:0
           });
          },Tags.Tags().NewTag("div",arg103))]));
         };
        };
       },x2);
      }),
      CodePre:function(code)
      {
       var x,arg10;
       arg10=List.ofArray([Attr.Attr().NewAttr("class","prettyprint linenums")]);
       x=Operators.add(Tags.Tags().NewTag("pre",arg10),List.ofArray([Tags.Tags().text(code)]));
       Operators.OnAfterRender(function()
       {
        return Global.prettyPrint();
       },x);
       return x;
      },
      Data:Runtime.Field(function()
      {
       return function(arg00)
       {
        return function(arg10)
        {
         return Attr.Attr().NewAttr("data-"+arg00,arg10);
        };
       };
      }),
      Defaults:{
       PopulateDb:function(db)
       {
        return Utils.op_BarMultiplyGreater(Concurrency.Delay(function()
        {
         return Concurrency.Bind(Utils["Promise`1.ToAsync"](db.info()),function(_arg1)
         {
          return _arg1.doc_count===0?Concurrency.Parallel(List.map(function(_arg2)
          {
           return Utils["Promise`1.ToAsync"](db.put(Client1.mkSnippet(_arg2[0],_arg2[1]),Global.String(Date.now())));
          },Defaults.codes())):Concurrency.Return([]);
         });
        }),function()
        {
        });
       },
       codes:Runtime.Field(function()
       {
        return List.ofArray([[{
         $:0
        },Utils["String.StripMargin"]("\n                        |fibs :: [Integer]\n                        |fibs = 0 : scanl (+) 1 fibs\n                        |\n                        |main = print (take 10 fibs)","|")],[{
         $:1
        },Utils["String.StripMargin"]("\n                        |object Main extends App {\n                        |    val fibs: Stream[BigInt] = BigInt(0) #:: fibs.scan(BigInt(1))(_ + _)\n                        |    fibs take 10 foreach println\n                        |}","|")],[{
         $:2
        },Utils["String.StripMargin"]("\n                        #let fibs =\n                        #    let rec helper a b =\n                        #        seq {\n                        #            yield a;\n                        #            yield! helper b (a + b)\n                        #        }\n                        #    helper 0 1\n                        #\n                        #fibs\n                        #|> Seq.take 10\n                        #|> Seq.iter (printfn \"%d\")","#")]]);
       })
      },
      LangMode:function(_arg1)
      {
       return _arg1.$==1?"text/x-scala":_arg1.$==2?"text/x-ocaml":_arg1.$==3?_arg1.$0.toLowerCase():"text/x-haskell";
      },
      LangName:function(_arg1)
      {
       return _arg1.$==1?"Scala":_arg1.$==2?"F#":_arg1.$==3?_arg1.$0:"Haskell";
      },
      Languages:function(s)
      {
       return List.ofArray([{
        $:0
       },{
        $:1
       },{
        $:2
       },{
        $:3,
        $0:s
       }]);
      },
      Main:Runtime.Field(function()
      {
       return Concurrency.Start(Concurrency.Delay(function()
       {
        return Concurrency.Bind(Defaults.PopulateDb(Client1.db()),function()
        {
         var container,arg10;
         arg10=List.ofArray([Attr.Attr().NewAttr("style","margin: 0 auto; width: 50%; min-width: 400px")]);
         container=Operators.add(Tags.Tags().NewTag("div",arg10),List.ofArray([Client1.AdderPiglet(),Client1.Accordions()]));
         Client1.RefreshSnippets(Client1.Accordions());
         container.AppendTo("container");
         return Concurrency.Return(null);
        });
       }),{
        $:0
       });
      }),
      MkPanel:function(id,parent,title,body)
      {
       var arg10,arg101,arg102,arg103,arg104,arg105;
       arg10=List.ofArray([Attr.Attr().NewAttr("class","panel-heading")]);
       arg101=List.ofArray([Attr.Attr().NewAttr("class","panel-title")]);
       arg103="#"+id;
       arg102=List.ofArray([((Client1.Data())("toggle"))("collapse"),((Client1.Data())("parent"))(parent),Attr.Attr().NewAttr("href",arg103)]);
       arg104=List.ofArray([Attr.Attr().NewAttr("id",id),Attr.Attr().NewAttr("class","panel-collapse collapse")]);
       arg105=List.ofArray([Attr.Attr().NewAttr("class","panel-body")]);
       return List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg10),List.ofArray([Operators.add(Tags.Tags().NewTag("h4",arg101),List.ofArray([Operators.add(Tags.Tags().NewTag("a",arg102),List.ofArray([Tags.Tags().text(title)]))]))])),Operators.add(Tags.Tags().NewTag("div",arg104),List.ofArray([Operators.add(Tags.Tags().NewTag("div",arg105),List.ofArray([body]))]))]);
      },
      RefreshSnippets:function(container)
      {
       var action;
       action=function(a)
       {
        return container.AppendI(a);
       };
       return Concurrency.Start(Utils.op_BarMultiplyGreater(Client1.RenderSnippets(),function(list)
       {
        return Seq.iter(action,list);
       }),{
        $:0
       });
      },
      RenderSnippets:Runtime.Field(function()
      {
       return Concurrency.Delay(function()
       {
        return Concurrency.Bind(Utils["Promise`1.ToAsync"](Client1.db().allDocs({
         include_docs:true,
         descending:true
        })),function(_arg1)
        {
         return Concurrency.Return(List.concat(List.map(function(a)
         {
          var title;
          title=Client1.SnippetToString(a.doc,new Date(Global.parseInt(a.id,10)));
          return Client1.MkPanel(a.id,Client1.AccordionId(),title,Client1.CodePre(a.doc.Code));
         },List.ofArray(_arg1.rows))));
        });
       });
      }),
      SnippetToString:function(ann,d)
      {
       return Client1.LangName(ann.Language)+" - "+d.toLocaleString();
      },
      cm:Runtime.Field(function()
      {
       return{
        $:0
       };
      }),
      db:Runtime.Field(function()
      {
       return new PouchDB1("snippetdb");
      }),
      mkSnippet:function(lang,code)
      {
       return{
        Language:lang,
        Code:code
       };
      }
     },
     Controls:{
      CodeMirror:function(stream)
      {
       var x,container,cm,matchValue;
       x=Runtime.New(T,{
        $:0
       });
       container=Tags.Tags().NewTag("div",x);
       cm=new CodeMirror(function(e)
       {
        return Operators.OnAfterRender(function(c)
        {
         return c.AppendN(e);
        },container);
       },{
        lineNumbers:true
       });
       matchValue=stream.get_Latest();
       if(matchValue.$==1)
        {
        }
       else
        {
         cm.setValue(matchValue.$0);
        }
       stream.Subscribe(function(_arg1)
       {
        var s;
        if(_arg1.$==1)
         {
          return null;
         }
        else
         {
          s=_arg1.$0;
          return cm.getValue()!==s?cm.setValue(s):null;
         }
       });
       CodeMirror.on(cm,"change",function(c)
       {
        return stream.Trigger(Runtime.New(Result,{
         $:0,
         $0:c.getValue()
        }));
       });
       return[container,cm];
      },
      InputOption:function(stream)
      {
       var x,container,folder,mapped,x1,cnt,previous;
       x=Runtime.New(T,{
        $:0
       });
       container=Tags.Tags().NewTag("div",x);
       folder=function()
       {
        return function(v)
        {
         return v;
        };
       };
       mapped=Stream.Map(function(option)
       {
        return Option.fold(folder,"",option);
       },function(arg0)
       {
        return{
         $:1,
         $0:arg0
        };
       },stream);
       x1=Controls1.input("text",function(x2)
       {
        return x2;
       },function(x2)
       {
        return x2;
       },mapped);
       cnt=Utils.FormControl("Language",x1);
       previous=[false];
       stream.Subscribe(function(_arg1)
       {
        if(_arg1.$==0)
         {
          if(_arg1.$0.$==1)
           {
            if(!previous[0])
             {
              container.AppendN(cnt.Dom);
              previous[0]=true;
              return;
             }
            else
             {
              return null;
             }
           }
          else
           {
            if(previous[0])
             {
              container["HtmlProvider@33"].Clear(container.get_Body());
              previous[0]=false;
              return;
             }
            else
             {
              return null;
             }
           }
         }
        else
         {
          return null;
         }
       });
       return container;
      }
     },
     Utils:{
      FormControl:function(name,el)
      {
       var arg10,arg101;
       el["HtmlProvider@33"].AddClass(el.get_Body(),"form-control");
       arg10=List.ofArray([Attr.Attr().NewAttr("class","form-group")]);
       arg101=List.ofArray([Attr.Attr().NewAttr("for",el.get_Id()),Tags.Tags().text(name)]);
       return Operators.add(Tags.Tags().NewTag("div",arg10),List.ofArray([Tags.Tags().NewTag("label",arg101),el]));
      },
      "Promise`1.ToAsync":function(_)
      {
       return Concurrency.FromContinuations(function(tupledArg)
       {
        _.then(tupledArg[0],tupledArg[1]);
       });
      },
      "String.StripMargin":function(x,sep)
      {
       return Strings.concat("\n",Arrays.map(function(l)
       {
        var n;
        n=l.indexOf(sep);
        return n>=0?l.substring(n+1):l;
       },Strings.SplitChars(x,[13,10],1)));
      },
      cnst:function(a)
      {
       return a;
      },
      flip:function(f,a,b)
      {
       return(f(b))(a);
      },
      op_BarMultiplyGreater:function(comp,fn)
      {
       return Concurrency.Delay(function()
       {
        return Concurrency.Bind(comp,function(_arg1)
        {
         return Concurrency.Return(fn(_arg1));
        });
       });
      }
     }
    }
   }
  }
 });
 Runtime.OnInit(function()
 {
  List=Runtime.Safe(Global.WebSharper.List);
  Html=Runtime.Safe(Global.WebSharper.Html);
  Client=Runtime.Safe(Html.Client);
  Attr=Runtime.Safe(Client.Attr);
  Samples=Runtime.Safe(Global.WebSharper.Samples);
  PouchDB=Runtime.Safe(Samples.PouchDB);
  Client1=Runtime.Safe(PouchDB.Client);
  Tags=Runtime.Safe(Client.Tags);
  Option=Runtime.Safe(Global.WebSharper.Option);
  Piglets=Runtime.Safe(Global.WebSharper.Piglets);
  Pervasives=Runtime.Safe(Piglets.Pervasives);
  Piglet=Runtime.Safe(Piglets.Piglet);
  Utils=Runtime.Safe(PouchDB.Utils);
  Builder=Runtime.Safe(Piglet.Builder);
  Date=Runtime.Safe(Global.Date);
  String=Runtime.Safe(Global.String);
  Seq=Runtime.Safe(Global.WebSharper.Seq);
  jQuery=Runtime.Safe(Global.jQuery);
  Controls=Runtime.Safe(PouchDB.Controls);
  Controls1=Runtime.Safe(Piglets.Controls);
  Operators=Runtime.Safe(Client.Operators);
  T=Runtime.Safe(List.T);
  Concurrency=Runtime.Safe(Global.WebSharper.Concurrency);
  Defaults=Runtime.Safe(Client1.Defaults);
  PouchDB1=Runtime.Safe(Global.PouchDB);
  CodeMirror=Runtime.Safe(Global.CodeMirror);
  Result=Runtime.Safe(Piglets.Result);
  Stream=Runtime.Safe(Piglets.Stream);
  Strings=Runtime.Safe(Global.WebSharper.Strings);
  return Arrays=Runtime.Safe(Global.WebSharper.Arrays);
 });
 Runtime.OnLoad(function()
 {
  Client1.db();
  Client1.cm();
  Client1.RenderSnippets();
  Client1.Main();
  Defaults.codes();
  Client1.Data();
  Client1.AdderPiglet();
  Client1.Accordions();
  Client1.AccordionId();
  return;
 });
}());


if (typeof IntelliFactory !=='undefined')
  IntelliFactory.Runtime.Start();
