/**
 * Created by mich on 14-02-17.
 */

var debug = function (txt,app,tipo) { //app is a unique name for the app you are debugging - can be anything
  if (app && (debug.sections!=["all"] && debug.sections.indexOf(app)==-1))
    return false;
  debug.log.store(txt,app);
  switch (tipo){
    case "error":
      console.error(txt);
      break;
    case "warning":
    case "warn":
      console.warn(txt);
      break;
    case "info":
      console.info(txt);
      break;
    default:
      console.log(txt);
  }
};
debug.sections = ["main","wb_note","sinc"]; // ["all"] vil vise alle debug-meddelser
debug.log=function(txt,app){debug(txt,app)};debug.error=function(txt,app){debug(txt,app,"error")};debug.warn=function(txt,app){debug(txt,app,"warn")};debug.info=function(txt,app){debug(txt,app,"info")};
debug.touch_debug = false; // Whether to show alerts on error

debug.log.store = function(txt,tags){
  tags = tags?tags:"";
  tags = Array.isArray(tags)?tags:[tags];
  debug.log.full_log.push({txt:txt,tags:tags,ora:new Date().getTime()});
  sessionStorage.setItem(debug.log.store_key,JSON.stringify(debug.log.full_log));
}

// Mock sessionStorage for web workers
if (typeof sessionStorage === "undefined") {
  var sessionStorage = {
    setItem: function (key) {
      return;
    },
    getItem: function (key) {
      return;
    }
  }
}

debug.log.store_key = "m_log_txt";
if (sessionStorage.getItem(debug.log.store_key))
  debug.log.full_log = JSON.parse(sessionStorage.getItem(debug.log.store_key));
else
  debug.log.full_log = [];

debug.log.mostra = function(){
  var win = window.open("", "Title", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=780, height=200, top="+(screen.height-400)+", left="+(screen.width-840));
  win.document.body.innerHTML = '';//'<button onclick="sessionStorage.removeItem(\''+debug.log.store_key+'\')">Slet</button><br>';
  var d;
  var ultimo_ora = 0;
  for (var i=0;i<debug.log.full_log.length;i++){
    if (ultimo_ora!=0 && (ultimo_ora-debug.log.full_log[i].ora)>10000)
      win.document.body.innerHTML += "<br>";

    d = new Date(debug.log.full_log[i].ora);
    win.document.body.innerHTML += d.getHours()+":"+(d.getMinutes()<10?"0"+d.getMinutes():d.getMinutes())+" ";
    win.document.body.innerHTML += "<b>"+debug.log.full_log[i].txt+"<b>";
    for (k in debug.log.full_log[i].tags){
      win.document.body.innerHTML += " <span style='background:green;color:white'>"+debug.log.full_log[i].tags[k]+"</span>";
    }
    win.document.body.innerHTML += "<br><br>";
    ultimo_ora = debug.log.full_log[i].ora;
  }
}

debug.mirror_console = function attiva_touch_debug(log_container) {
  if (typeof log_container==="string")
    log_container = document.getElementById(log_container);
  console.log = (function (old_function, div_log) {
    return function (text) {
      old_function.apply(this, arguments);
      div_log.innerHTML += "Log: "+String(text).replace(/\n/g,"<br>")+"<br><br>";
      //alert("Log:\n"+text);
    };
  } (console.log.bind(console), log_container));

  console.error = (function (old_function, div_log) {
    return function (text) {
      old_function(text);
      div_log.innerHTML += "<span style='color:red'>Error: "+String(text).replace(/\n/g,"<br>")+"</span><br><br>";
      //alert("Error:\n"+text);
    };
  } (console.error.bind(console), log_container));

  console.warn = (function (old_function, div_log) {
    return function (text) {
      old_function(text);
      div_log.innerHTML += "<span style='color:orange'>Warning: "+String(text).replace(/\n/g,"<br>")+"</span><br><br>";
      //alert("Warning:\n"+text);
    };
  } (console.warn.bind(console), log_container));

  console.info = (function (old_function, div_log) {
    return function (text) {
      old_function(text);
      div_log.innerHTML += "<span style='color:blue'>Info: "+String(text).replace(/\n/g,"<br>")+"</span><br><br>";
      //alert("Info:\n"+text);
    };
  } (console.info.bind(console), log_container));

  window.addEventListener("error", handleError, true);
  function handleError(evt) {
    if (debug.touch_debug) {
      if (evt.message) { // Chrome sometimes provides this
        alert("error: " + evt.message + " at linenumber: " + evt.lineno + " of file: " + evt.filename);
      } else {
        alert("error: " + evt.type + " from element: " + (evt.srcElement || evt.target));
      }
    }
  }
}