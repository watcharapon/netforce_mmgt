//FIXME IE version 7, 8, 9 -->
if (typeof console == "undefined" || typeof console.log == "undefined") var console = { log: function() {} }; 
if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  }
}
//---------------
function round2Two(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

function set_num(num){
    if(!num){
        return num;
    }else{
        return parseFloat(num.replace(",",""));
    }
}

function get_date(day_count){
    var date=moment().add('days', day_count);
    var day_txt=date.format("dddd");
    var datenow=date.format("YYYY-MM-DD");
    if(day_count==0){
        day_txt='Today'; 
    }else if(day_count==-1){
        day_txt='Yesterday'; 
    }else if(day_count==1){
        day_txt='Tomorrow'; 
    }else{
        day_txt=date.format("dddd, D MMM YYYY");
    }
    return {
        'date': datenow,
        'day_txt': day_txt,
    }
}

function get_cookies(){
    var cookies = document.cookie.split(";");
    var lines=[];
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        lines.push(name);
    } 
    return lines;
}

function set_cookie(name,value,days) {
    log("set_cookie",name,value,days);
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    var cookie=name+"="+encodeURIComponent(value)+expires+"; path=/";
    document.cookie = cookie;
}

function clear_cookie(name) {
    set_cookie(name,"",-1);
}

function set_cookies(data) {
    log("set_cookies",data);
    for (var n in data) {
        var v=data[n];
        if (v) {
            var val;
            var days;
            if (_.isArray(v)) {
                val=v[0];
                days=v[1];
            } else {
                val=v;
                days=null;
            }
            set_cookie(n,val,days);
        } else {
            clear_cookie(n);
        }
    }
}

function rpc_execute(model,method,args,opts,cb) {
    console.log("RPC",model,method,args,opts);
    var params=[model,method];
    params.push(args);
    if (opts) {
        params.push(opts);
    }
    $.ajax({
        url: "/json_rpc",
        type: "POST",
        data: JSON.stringify({
            id: (new Date()).getTime(),
            method: "execute",
            params: params
        }),
        dataType: "json",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: function(data) {
            if (data.error) {
                console.log("RPC ERROR",model,method,data.error.message);
            } else {
                console.log("RPC OK", model, method);
            }
            if (cb) {
                cb(data.error,data.result);
            }
        },
        error: function() {
            console.log("RPC ERROR",model,method);
        }
    });
}

function get_host(){
    var url=window.location.href;
    var arr=url.split("/");
    var hostname=arr[2];
    var link="http://"+hostname+"";
    return link;
}

var Router=Backbone.Router.extend({
    routes: {
        "": "test",
        "test": "test",
    },

    test: function() {
        console.log("Router.test");
        var args={};
        view=new TestView(args);
        view.render(this.remove_loading);
        var layout=new LayoutView({content:view.el});
        view.layout=layout; //
        layout.render();
        $("body").empty();
        $("body").append(layout.el);
    },

});

var router=new Router();

$(function() {
    Backbone.history.start({silent:false});
});

Handlebars.registerHelper('ifeq', function(val1, val2, options) {
  if (val1==val2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('currency', function(val,options) {
    if(options){
        h=options['hash'];
        if(!val && h.zero){
            return h.zero;
        }
    }
    var c='2', d='.', t=',';
    if(h.type && h.type=='int'){
        c='0';
    }else if(h.decimal && h.type=='float'){
        c=h.decimal;
    }

    var n = val, 
        c = isNaN(c = Math.abs(c)) ? 2 : c, 
        d = d == undefined ? "." : d, 
        t = t == undefined ? "," : t, 
        s = n < 0 ? "-" : "", 
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
        j = (j = i.length) > 3 ? j % 3 : 0;
       return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
});

Handlebars.registerHelper('breakline', function(val) {
    if(_.isEmpty(val)) return;

    val=val.split(",");
    var res="";
    var len=val.length;
    for(var i=0; i<val.length;i++){
        res+=val[i].trim();
        if(i<len-1){ res+=",\n"; }
    }
    return res;
});

function log(params){
    for(var i=0; i<params.length;i++){
        console.log(params[i]);    
    }
};

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function obj2val(dict){
    res=""
    for(d in dict){
       val=dict[d];
       res+=d+"="+val+"?";
    }
    return res;
}
