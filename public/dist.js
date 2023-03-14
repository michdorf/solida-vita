
/*
 * Copyright © 2016 Michele De Chiffre
 * */

function w_debug(mes,tipo){
	if (false)
		return false;
	switch (tipo){
		case "error":
			console.error(mes);
		break;
		case "warning":
			console.warn(mes);
		break;
		case "info":
			console.info(mes);
          break;
		default:
			console.log(mes);
	}
}

function isset(variable,default_value){
  return (typeof(variable)==="undefined")?(default_value?default_value:null):variable;
}

function documentReady(){//Returnerer om hele siden er loaded
  return (document.readyState === "complete");
}

function isiOS(){
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function forceHTTPS() {
  if (location.hostname === "localhost") {
    return;
  }
  if (location.protocol != 'https:') {
    location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
  }
}

function traduzioniDisponibili(){
  return (typeof t == 'function' && (t && t.agg));
}

function aggWebAppTraduzioni(){
  if (traduzioniDisponibili()){
    t.agg({
      "Sei inlinea":"Du er online",
      "Non sei inlinea":"Du er offline"
    },"da");
    t.agg({
      "Sei inlinea":"Sei inlinea",
      "Non sei inlinea":"Non sei inlinea"
    },"it");
    t.agg({
      "Sei inlinea":"You are online",
      "Non sei inlinea":"You are offline"
    },"en");
  }
}

/// Function that will parse all numbers in json string correctly
/// F.eks. '{"inx":"5","tekst":"Min tekst 123"}' => {inx:5,tekst:"Min tekst 123"}
/// Good for parsing json sent from PHP
function JSONparseNums(json_str){
  return JSON.parse(json_str, function(k, v) {
    return (typeof v === "object" || isNaN(v) || v==="") ? v : parseFloat(v, 10);
  });
}

function loop(variable,func){
  if (typeof func !== "function")
    return false;
  for (var i = 0; i < variable.length; i++){
    func(i);
  }
}

// Udnytter browserens evne til at udtrække innerText
String.prototype.stripHTML = function strip()
{
  return this.replace(/(<([^>]+)>)/ig,"");

  // Er usikker på om det åbner for XSS
  /* var tmp = document.createElement("DIV");
  tmp.innerHTML = this;
  return tmp.textContent || tmp.innerText || ""; */
};

String.prototype.strpos = function strpos(needle,offset) {
    offset = offset ? offset : 0;
    if (typeof needle !== "string"){
        console.error("String.strpos(needle,offset) accepterer kun Strings.");
    }
    for (var i = 0; i < this.length+1-needle.length; i++){
        if (this.substr(i,needle.length) == needle)
            return i;
    }
    return false;
};

//Di come il browser deve usare split() su un numero. Questo va bene 1234.split()
Number.prototype.split = function (delim) {
  return String(this).split(delim);
};

function is_touch_device() {
  return 'ontouchstart' in window        // works on most browsers
      || navigator.maxTouchPoints;       // works on IE10/11 and Surface
}

if (typeof _ != "function"){
  function _(id) {
    return document.getElementById(id);
  }
}

if (typeof cerci_array != "function"){
  function cerci_array(matrix,search,striks){//Striks skifter fra if ( == ) til if ( === )
    if (!Array.isArray(matrix)){
      console.error("'"+matrix+"' (matrix-argumentet) er ikke en array (array_search(matrix,search))");
      return false;
    }
    striks = (striks) ? striks : false;
    for (key in matrix){
      if (striks){
        if (matrix[key] === search)
          return key;
      }
      else{
        if (matrix[key] == search)
          return key;
      }
    }

    return false;
  }
}

function eSuccesso(evento) {//= "è successo?". Vede se qualche evento è successo vedi sotto.
  return cerci_array(appEventi,evento) !== false;
}

//NB. devi ePronto.push(function customListener(cheESucesso){alert(cheESucesso)} ) prima della cosa che vuoi sentire viene eseguita
//Però puoi sempre usare cerci_array per vedere, se qualcosa è già successo
var ePronto = [];// = "è pronto?" Questo sente, se è pronto la pagina - viene eseguito ogni volta, che qualcosa è caricata

var appEventi = [];//Salva ogni cosa, che è successo
function preparato(cheESucesso) {// = "qualcosa è preparato" Ogni volta, che qualcosa è successo, devi eseguire questo
  if (eSuccesso(cheESucesso))//Ingen dubletter, som skaber uendelige løkker
    return false;

  appEventi.push(cheESucesso);
  loop(ePronto, function (i) {
    ePronto[i](cheESucesso);//= "che cosa è successo?"
  });
}

//rimuovi_event rimuove l'evento, così che non viene visto piu volte - eseguito lo stesso piu volte
function senti(evento,funz,rimuovi_event){
  rimuovi_event = rimuovi_event !== false;
  if (typeof funz != "function"){
    console.error("senti(funz,rimuovi_event): funz non e una funziona");
    return false;
  }

	//Find ud af, om begivenheden allerede er sket
	var indx = appEventi.indexOf(evento);
  if (indx != -1){//indexOf er lidt ligesom cerci_array = evento ER sket
    funz(evento);
		if (rimuovi_event)
      appEventi.splice(indx,1);

		return true;
  }

  ePronto.push(function (cheESuccesso){
    var indx = appEventi.indexOf(evento);
    if (indx != -1){//indexOf er lidt ligesom cerci_array
      funz(cheESuccesso);
			if (rimuovi_event)
       appEventi.splice(indx,1);
    }
		else{
			w_debug("L'evento \""+evento+"\" non è successo. Nota che può essere stato rimosso","info");
		}
  });
}

if (!mich)
  var mich = {};

var MLINEA_STATO_DOT = true; // Brug en grøn eller rød prik i stedet for tekst

//Global-variables used by mich.linea
var mlinea_stato_trovato_funz = function(stato){return true};//Funzione, che viene esegito quando lo stato è trovato
var mlinea_appOnline = typeof navigator !== "undefined" ? navigator.onLine : false; //Appens svar på, om man er online
var lineaStato = "online"; //Appens svar på, om man er online
var mlinea_ultimoStato = "";
/**
 * @type {Array<Function>}
 * Gets called when change between online and offline state
 */
var lineastato_cambioFunz = [];//Funzioni, che vengono esegiuiti quando lo stato cambia

mich.linea = function(){

  var _e_trovato_stato = false; // Hvorvidt ajax-request er fuldendt

  function lineastato_sorvegli(funz){
    if (typeof funz === "function")
      lineastato_cambioFunz.push(funz);
  }

  var lineaStatoDivEsiste = true;
  function mostraLineaStato(){
    var lineaStatoDiv = document.getElementById("lineaStato");
    if (!documentReady()){//Hvis ikke siden er loaded endnu, så vent og prøv igen
      setTimeout(mostraLineaStato,200);
      return false;
    }
    if ((!lineaStatoDivEsiste) || (!lineaStatoDiv)){
      //console.warn("#lineaStato findes ikke");
      lineaStatoDivEsiste = false;
      return false;
    }
    if (mlinea_appOnline){
      if (traduzioniDisponibili())//Se, om det kan oversættes
        lineaStatoDiv.innerHTML =  t("Sei inlinea");
      else
        lineaStatoDiv.innerHTML = "Sei inlinea";
      lineaStatoDiv.style.color = "#007100";
    }
    else
    {
      if (traduzioniDisponibili())//Se, om det kan oversættes
        lineaStatoDiv.innerHTML = t("Non sei inlinea");
      else
        lineaStatoDiv.innerHTML = "Non sei inlinea. Clicca qui per ricaricare";
      lineaStatoDiv.style.color = "#db0707";
    }

    if (MLINEA_STATO_DOT) {
      lineaStatoDiv.innerHTML = "&bull;";
      lineaStatoDiv.style.fontSize = "2em";
      lineaStatoDiv.style.top = "2px";
    }
  }

  function inlineastato(online){
    if (online === false || online === true)
      mlinea_appOnline = online;
    if (mlinea_appOnline === true){
      lineaStato = "online";
    }
    else{
      lineaStato = "offline";
    }

    mostraLineaStato();

    if (mlinea_ultimoStato !== lineaStato){
      loop(lineastato_cambioFunz,function(i){lineastato_cambioFunz[i](lineaStato, mlinea_appOnline)});
      mlinea_ultimoStato = lineaStato;
    }
  }

  function stato_attuale(){
    return lineaStato;
  }

  function inlinea(){
    // Redundans med både eget resultat OG navigator.onLine
    // Har fundet navigator.onLine til at være ret god
    return (mlinea_appOnline && navigator.onLine);
  }

  //Køres når mich.linea defineres, og laver simpelt ajax-call for at se, om man er online
  //NB. filen, den søger efter SKAL være tilgængelig online (findes)
  function trovi_stato(){
    var ajaxRic = new XMLHttpRequest();
    var url = "/webApp/api/onlinefile.txt?" + (new Date()).getTime(); // Bypass cache
    ajaxRic.open("GET", url, true);
    ajaxRic.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var successo = 2;
    ajaxRic.onreadystatechange = function() {
      if(ajaxRic.readyState === 4) {
        if (ajaxRic.status === 200){
          inlineastato(true);
          _e_trovato_stato = true;
          mlinea_stato_trovato_funz(mich.linea.inlinea());
          successo = 1;
        }else{
          inlineastato(false);
          _e_trovato_stato = true;
          mlinea_stato_trovato_funz(mich.linea.inlinea());
          successo = 0;
        }
      }
    };

    var maxSec = 10;
    var tempo = 0;
    setTimeout(function(){
      if (tempo > maxSec){
        inlineastato(false);
        _e_trovato_stato = true;
        mlinea_stato_trovato_funz(mich.linea.inlinea());
        return false;
      }
      if (successo === 2){//Venter/loader
        tempo++;
      }
    },1000);

    ajaxRic.send();
    return ajaxRic;
  }

  function onStatoTrovato(funz){
    if (typeof funz === "function") {
      mlinea_stato_trovato_funz = funz;

      if (_e_trovato_stato) {
        funz(this.inlinea());
      }
    }
  }

  //Initiate
  if (typeof(document) !== "undefined") { // Compatibile con web workers
    trovi_stato();
  }

  return{
    inlinea:inlinea,
    stato:stato_attuale,
    mettistato:inlineastato,
    funzioni:lineastato_cambioFunz,
    sorvegli:lineastato_sorvegli,
    onStatoTrovato: onStatoTrovato
  };
}();

if (typeof window !== "undefined") { // Skal kunne importeres i web worker
  window.addEventListener("load",function (){
    window.addEventListener("online",function online_event(){mich.linea.mettistato(true)},false);
    window.addEventListener("offline",function online_event(){mich.linea.mettistato(false)},false);
  },false);
}

/// Da il utente la possibilta di salvare filecontent in un file
function save2file(filecontent, header, std_fnome, f_ext) {
  var element = document.createElement('a');
  header = header || 'data:text/html;charset=utf-8,';
  element.setAttribute('href', header + encodeURIComponent(filecontent));
  var nome_file = prompt("Scegli un nome per il file: ",std_fnome);
  nome_file=nome_file?nome_file:std_fnome;
  if (f_ext && f_ext.substr(0,1) === "."){
    f_ext = f_ext.substr(1); // Remove leading dot
  }
  f_ext = f_ext || "txt";
  element.setAttribute('download', nome_file.replace(/[^0-9a-zA-Z -:]/g,"?")+"."+f_ext);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function makeArray(variable){
    if (!(variable instanceof Array)){
        return [variable];
    }
    else
     return variable;
}

function appendElement(elemtype,attributi,appendTo){
    //Hvis en streng gives, så er attributi elementets "innerText"
    attributi = (attributi.constructor == Object) ? attributi : {"innerText":attributi};
    appendTo = appendTo ? appendTo : document.body;
    var element = document.createElement(elemtype);
    if (attributi.innerText && attributi.innerText != "")
      element.innerHTML = attributi.innerText;
    for (chiave in attributi){
      if (chiave != "innerText")
        element.setAttribute(chiave,attributi[chiave]);
    }
    appendTo.appendChild(element);
    return element;
}

function esegui_scritti(elem){
  var scriptTags = document.getElementsByTagName("mich-scritto");
  var tag;
  for (var i = 0; i < scriptTags.length; i++){
    tag = document.createElement('script');
    tag.setAttribute("type","text/javascript");
    tag.innerHTML = scriptTags[i].innerHTML.replace(/&lt;/g,"<").replace(/&gt;/g,">");
    scriptTags[i].parentNode.appendChild(tag);
    scriptTags[i].parentNode.removeChild(scriptTags[i]);
  }
}

function include_script(url,id,callbackFunc) {//Indsætter script på siden
  var ext = url.substr(-3);

  carica_file(url,id, function (testo_file) {
    if (ext == "css")
      var style = appendElement("style",testo_file,document.head);
    else if (ext == ".js") {//ext er bare de sidste tre bogstaver
      var scriptTag = appendElement("script", testo_file, document.head);
      scriptTag.setAttribute("type","text/javascript");
    }
    else
      console.error("include_script non riesce ad usare i file \""+ext+"\"");
    //eval(scriptIndhold);

    if (typeof callbackFunc == "function")
      callbackFunc(id);
  });
}

function carica_file(url,id,callbackFunc){
  var caricatoDaStorage = false;//Se è già caricato
  if (id && typeof(Storage)!=="undefined"){//Hvis den skal og kan gemme lokalt
    var scriptIndhold = localStorage.getItem(id);
    if (scriptIndhold){
      if (typeof callbackFunc == "function")
        callbackFunc(scriptIndhold);

      caricatoDaStorage = true;
    }
  }

  //Find opdatering, hvis den er tilstede - den loades først ved refresh - offline first
  if (mich.linea.inlinea()){
    if (typeof mich.Ajax != "undefined"){//Gem scripten lokalt, hvis det er muligt
      mich.Ajax({
        url: url,
        run: function gemILocalStorage(data){
          if (id && typeof(Storage)!=="undefined"){
            localStorage.setItem(id,data);
          }

          if (caricatoDaStorage == false){//Load, hvis ikke den fandtes offline
            if (typeof callbackFunc == "function")
              callbackFunc(data);
          }

          mich.linea.mettistato(true);
        },
        onerror: function (motivazione,ajax_url){
          if (motivazione == "non accessibile")
            console.log(url+" non è accessibile");
          mich.linea.mettistato(false);
        }
      });
    }
    else
      console.log("Kunne ikke gemme scriptet, da ajax ikke er muligt ("+typeof(mich.Ajax)+")");
  }
}

var paginaDivId = "pagina";
function carica_pagina(url,id,container,callbackFunc){
  var ext = url.substr(-3);
  var contElem = container ? document.getElementById(container) : document.getElementById(paginaDivId);

  carica_file(url,id, function (testo_file) {
    if (ext == "htm"){
      contElem.innerHTML = testo_file;
    }
    else
      contElem.innerHTML = testo_file;

    if (typeof callbackFunc == "function")
      callbackFunc(testo_file);
  });
}

var md = function (){

  var ls_available = null, debug_enabled = true;
  function isLSAvailable(){//Checks if localStorage is available
    var test = 'test';
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch(e) {
      return false;
    }
  }
  function save(key,value) {
    if (ls_available === null)
      ls_available = isLSAvailable();
    if (ls_available === true) {
      if (typeof value != "undefined")
        localStorage.setItem(key, value);
      return localStorage.getItem(key);
    } else {//If localstorage isn't available use cookies
      //document.cookie="username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
      var exdays = 20;
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      if (typeof value != "undefined")
        document.cookie = key + "=" + value + "; expires=" + d.toUTCString() + "; path=/";
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    }
  }
  function get(key){
    return save(key);
  }
  function remove(key){
    if (ls_available === null)
      ls_available = isLSAvailable();
    if (ls_available === true){
      localStorage.removeItem(key);
    }
    else{
      var exdays = -2;
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      if (typeof value != "undefined")
        document.cookie = key + "=" + value + "; expires=" + d.toUTCString() + "; path=/";
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(key).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    }
  }

  function debug(mes,tipo){
    if (debug_enabled){
      switch (tipo){
        case "log":
          console.log(mes);
          break;
        case "error":
          console.error(mes);
        case "info":
          console.info(mes);
          break;
        case "dir":
          console.dir(mes);
          break;
        default:
          console.log(mes);
      }
    }
  }

  return {
    save:save,
    get:get,
    remove:remove,
    debug:debug
  }
}();

if (typeof m_el !== "function" && typeof HTMLElement !== "undefined") {
  function m_el(elemIdentifier,tipo){
    var parent = (this === window) ? document : this;
    switch (tipo){
      case "id":
        return parent.getElementById(elemIdentifier);
        break;
      case "class":
        return parent.getElementsByClassName(elemIdentifier);
        break;
      case "tag":
        return parent.getElementsByClassName(elemIdentifier);
        break;
      default:
        return parent.getElementById(elemIdentifier);
    }
  }

  HTMLElement.prototype.m = m_el;
}

mich.storia = function(){
  if (typeof history === "undefined")
    return; // For web workers
  var stato = history.state;
  function naviga(url,data,titolo){
    titolo = (titolo) ? titolo : "";
    data = (data) ? data : {};
    history.pushState(data, titolo, url);
  }

  return{
    naviga:naviga,
    stato: stato
  }
}();

/**
 * Merges into obj1 properties of obj2, obj3 etc.
 * NB. obj1 will be modified - use {} to prevent this
 * @param obj1
 * @param obj2
 * @param obj3
 */
function merge(obj1, obj2, obj3) {
  var key;
  for (var i = 1; i < arguments.length; i++){

    if (typeof arguments[i] !== "object"){
      continue;
    }

    for (key in arguments[i]){
      if (!arguments[i].hasOwnProperty(key)){
        continue;
      }
      obj1[key] = arguments[i][key];
    }

  }

  return obj1;
}

function debounce(func, wait, immediate) {
  // 'private' variable for instance
  // The returned function will be able to reference this due to closure.
  // Each call to the returned function will share this common timer.
  var timeout;

  // Calling debounce returns a new anonymous function
  return function() {
    // reference the context and args for the setTimeout function
    var context = this,
      args = arguments;

    // Should the function be called now? If immediate is true
    //   and not already in a timeout then the answer is: Yes
    var callNow = immediate && !timeout;

    // This is the basic debounce behaviour where you can call this
    //   function several times, but it will only execute once
    //   [before or after imposing a delay].
    //   Each time the returned function is called, the timer starts over.
    clearTimeout(timeout);

    // Set the new timeout
    timeout = setTimeout(function() {

      // Inside the timeout function, clear the timeout variable
      // which will let the next execution run when in 'immediate' mode
      timeout = null;

      // Check if the function already ran with the immediate flag
      if (!immediate) {
        // Call the original function with apply
        // apply lets you define the 'this' object as well as the arguments
        //    (both captured before setTimeout)
        func.apply(context, args);
      }
    }, wait);

    // Immediate mode and no wait timer? Execute the function..
    if (callNow) func.apply(context, args);
  };
};

/**
 *
 * @param {*} obj
 * @param boolean classe - se deve clonare class-object - se no copia soltanto le properties
 */
function clone(obj, classe) {
  if (null === obj || "object" !== typeof obj) return obj;
  if (Array.isArray(obj)){
    return obj.map(function(a){return Object.assign({}, a)});
  }
  var copy = classe ? obj.constructor() : {};
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

/**
* @param array array
* @return unici_elements
*/
var unico = function unique(array) {
	var r = [];
	for (var i = 0; i < array.length; i++) {
		if (r.indexOf(array[i]) === -1) {
			r.push(array[i]);
		}
	}
	return r;
}

/* Fra wb_note/js/helper.js */

function elem(DOMSelectStr,start_elem){
  start_elem = start_elem || document;
  return start_elem.querySelector(DOMSelectStr);
}

function elems(DOMSelectStr,start_elem){
  start_elem = start_elem || document;
  return start_elem.querySelectorAll(DOMSelectStr);
}

// Come elem.innerHTML += html;
if (typeof HTMLElement !== "undefined") {
  HTMLElement.prototype.appendHTML = function (html) {
    this.insertAdjacentHTML('beforeend',html);
  };
}

function bubbleTillTag(startElem,tagname){//cerca dal elemento startElem finche non ha trovato un parente che ha il tagname
  if (!startElem)
    return null;
  while (startElem.tagName!==tagname.toUpperCase()){
    if (startElem===document.body)
      return null;
    startElem = startElem.parentNode;
  }
  return startElem;
}
function bubbleTillClass(startElem,classname){//cerca dal elemento startElem finche non ha trovato un parente che ha il tagname
  if (!startElem)
    return null;
  while (startElem.className.split(" ").indexOf(classname)===-1){
    if (startElem===document.body)
      return null;
    startElem = startElem.parentNode;
  }
  return startElem;
}

function moveCaretToEnd(el){//Flyt textcursor til sidst
  if (typeof el.selectionStart == "number"){
    el.selectionStart = el.selectionEnd = el.value.length;
  } else if (typeof el.createTextRange != "undefined"){
    el.focus();
    var range = el.createTextRange();
    range.collapse(false);
    range.select();
  }
}
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
}// NB. Questo e' la versione giusta. NON usi quello in /wb_note/js/indexedDB.js
// import {makeArray} from '../js/webapp.helper.js';

if (typeof APP == "undefined") {
  const APP = {};
}

if (typeof debug !== "object" && typeof debug !== "function"){
  console.error("Devi includere webApp/js/debug.js PRIMA del webApp/js/indexedDB.js");
}

if (typeof window !== "undefined") {
  //prefixes of implementation that we want to test
  indexedDB = indexedDB || mozIndexedDB || webkitIndexedDB || msIndexedDB;

  //prefixes of window.IDB objects
  IDBTransaction = IDBTransaction || webkitIDBTransaction || msIDBTransaction;
  IDBKeyRange = IDBKeyRange || webkitIDBKeyRange || msIDBKeyRange;
}

var iDB = {
  macchina: "indexedDB",
  db_HDL:0,
  insert_id:0,
  compat:true,
  db_nome:"de_data",
  std_primaryKey:"id"//Jeg er stadig ikke sikker på hvordan man læser denne værdi dynamisk
};

if (typeof indexedDB !== "undefined" && !indexedDB) {
    iDB.compat = false;
    debug.warn("Your browser doesn't support a stable version of IndexedDB.","iDB");
}

// Returnerer hvorvidt iDB virker - sådan rent generelt
iDB.isWorking = function () {
  if (iDB.compat === false){
    debug.error("Browser non compattibile. iDB.select()","iDB");
    return false;
  }
  if (typeof iDB.db_HDL !== "object"){
    debug.error("La banca dati non e' aperta in iDB.isWorking()","iDB");
    return false;
  }

  return true;
};

iDB.apri = function (nomebanca,inc_versione){
  iDB.db_nome = nomebanca = nomebanca?nomebanca:iDB.db_nome;

  return new Promise(function(resolve,reject){
    var db_versione = typeof iDB.db_HDL==="object"?parseInt(iDB.db_HDL.version)+1:1;
    var request = indexedDB.open(nomebanca);
    request.onerror = function(event) {
      debug.log("error: med at requeste","iDB");
      reject(new Error("error: med at requeste"));
     };

     request.onsuccess = function(event) {
      iDB.db_HDL = request.result;
      //debug.log("success: "+ iDB.db_HDL,"iDB");
      resolve(iDB.db_HDL);
     };

     request.onupgradeneeded = function(event) {
      iDB.db_HDL = event.target.result;
      debug.log("database upgraderet","iDB");
      resolve(iDB.db_HDL);
     };

     iDB.db_HDL.onversionchange = function(event){
      iDB.db_HDL.close();
      alert("A new version of the page is ready Please reload!");
    };
  });
};

iDB.primary_key = function(db_nome,nome_tabella){
  return iDB.std_primaryKey;//Jeg er stadig ikke sikker på hvordan man læser denne værdi dynamisk
};

iDB.essisteTabella = function (tabella_nome) {
  return iDB.db_HDL.objectStoreNames.contains(tabella_nome); // DOMStringList != Array
};

//Crea una nuova banca dati e ritorna un oggetto Promise
//Puoi specificare:
// JSON_args.primary_key - helst ikke ændrer den fra "id" endnu..
// JSON_args.databasenavn
// JSON_args.tabelle
// JSON_args.index
iDB.creaBanca = function iDBUpgrade(JSON_args){
    if (iDB.compat === false){
     	debug.error("Non è riuscito a creare la tabella. (Il browser non è compattibile)  - iDB.creaTabella()","iDB");
      reject(new Error("Non è riuscito a creare la tabella. (Il browser non è compattibile) - iDB.creaTabella()"));
     	return false;
     }

    iDB.db_nome = JSON_args.databasenavn ? JSON_args.databasenavn : iDB.db_nome;
    var primary_key = JSON_args.primary_key ? JSON_args.primary_key : iDB.primary_key(iDB.db_nome,"tabella");
    if (typeof JSON_args.callBackFunc!=="undefined")
      debug.warn("JSON_args.callBackFunc non funziona piu in iDB.creaTabella(). Usa .then()","iDB");

    var promise = new Promise(function(resolve,reject){

    if (typeof JSON_args.tabelle==="undefined"){
      reject(new Error("Devi specificare JSON_args.tabelle in iDB.creaTabella()"));
      return false;
    }

    var request;
    if (typeof iDB.db_HDL==="object"){
      iDB.db_HDL.close();//Se vuoi fare l'upgrade deve essere chiuso
      var db_versione=parseInt(iDB.db_HDL.version)+1;
      //Man skal bruge databasen version (2nd argument) og forøge det for at trigge onupgradeneeded, som er det eneste sted, man kan skabe en tabel
      request = indexedDB.open(iDB.db_nome, db_versione);
      //Versionen kan i onsucces-eventen som parseInt(db.version) - se skabNyTabel()
    }else{
      debug.info("Forse la tabella non viene creata. Non è possibile incrementare la versione.\niDB.creaBanca()","iDB");
      request = indexedDB.open(iDB.db_nome);
    }

    request.onerror = function(event) {
     debug.log("error: med at requeste","iDB");
     reject(new Error("error: med at requeste"));
    };

    request.onsuccess = function(event) {
     iDB.db_HDL = request.result;
     //debug.log("success: "+ iDB.db_HDL,"iDB");
     resolve("success");
    };

    request.onupgradeneeded = function(event) {
     iDB.db_HDL = event.target.result;

     var indexer;
     var tabelle = makeArray(JSON_args.tabelle);
     if (JSON_args.index)
      indexer = makeArray(JSON_args.index);
     else
      indexer = [];

     //Skab tabellerne, der skal bruges
     var i, j;
     for (i = 0; i < tabelle.length; i++)
     {
        //tabeller array af keys med en SQL syntax som: "brugere(id int unique,navn varchar(255),...)
        tabelle[i] = tabelle[i];
        var objectStore = iDB.db_HDL.createObjectStore(tabelle[i], {keyPath: primary_key, autoIncrement:true });
        j = 0;
        while ((indexer) && (indexer[i]) && (typeof indexer[i][j] !== "undefined")){
          objectStore.createIndex(indexer[i][j],indexer[i][j],{unique: false});// (objectIndexName,objectKeypath, optionalObjectParameters)
          j++;
        }
     }
     debug.log("database upgraderet","iDB");
     resolve("upgraded");
    };

   });//Fine del promise

   return promise;
};

//Lo stesso a iDB.creaBanca - ma un nome diverso
//NB: a non confondere a creaTabella()
iDB.creaTabelle = function creaTabelle(JSON_args) {
  return iDB.creaBanca(JSON_args);
};

//Come iDB.creaBanca - ma se vuoi creare una sola tabella
//NB: a non confondere a creaTabelle()
iDB.creaTabella = function creaTabella(nomeTabella,index_arr,args){
  args = args?args:{};
  args.tabelle = [nomeTabella];
  if (!Array.isArray(index_arr))
    debug.error("index_arr deve essere un array in iDB.creaTabella()","iDB");
  args.index = [index_arr];
  return iDB.creaBanca(args);
};

iDB.inserisci = function insert(nomeTabella,JSON_values) {

  return new Promise(function(resolve,reject){

    if (typeof iDB.db_HDL!=="object"){
      debug.warn("Nessun BancaDati aperto. iDB.inserisci()","iDB");
      iDB.apri().then(function(){
        iDB.inserisci(nomeTabella,JSON_values).then(function (ins_id, valori) {
          resolve(ins_id, valori);
        }).catch(function (err) {
          reject(err);
        });
      },function(mes){
        debug.error("Non è riuscito ad aprire il BancaDati. iDB.inserisci()","iDB");
      });//Apre il default
  
      return;
    }

     var request = iDB.db_HDL.transaction([nomeTabella], "readwrite")
        .objectStore(nomeTabella)
        .add(JSON_values);

     request.onsuccess = function(event) {
        iDB.insert_id = event.target.result;
        resolve(event.target.result,JSON_values);
     };

     request.onerror = function(event) {
      reject(new Error("Unable to add data\r\nthe row already exist in your database!"));
      debug.log("Unable to add data\r\n"+JSON.stringify(request.error),"iDB");
     };
   });//Fine del promise
};

/* NB. Der er også en mulighed for at hente rækken med en bestemt id/primary_key værdi - se iDB.with_key()
* JSON_args:
*  - order (asc,desc)
*  - field (to sort after)
*  - valore (only field with that value)
*  - startinx: number (primary-key index to start at - including that index) default to 1
*  - limit: number (how many results you want)
*/
iDB.select = function selecte(tabella,args){//(tabel,key_value,callbackFunc)
  args = args?args:{};
  return new Promise(function(resolve,reject){
    if (!iDB.isWorking()){
      reject(new Error("Browser non compattibile. iDB.select()"));
      return false;
    }
    if (!tabella){
      reject(new Error("Devi specificare una tabella. iDB.select()"));
      return false;
    }

    if (!iDB.essisteTabella(tabella)) {
      reject(new Error("La tabella '" + tabella + "' non e stata creata. iDB.select()"));
      return false;
    }

    var objectStore = iDB.db_HDL.transaction([tabella]).objectStore(tabella);
    var request = objectStore;
    if (args.field){
      try {
        request = objectStore.index(args.field);//Man SKAL have skabt indexet i onversionchange-eventet
      }catch (error){
        debug.error("Indexet "+args.field+" kunne ikke indexeres, da du skal have skabt indexet i onversionchange-eventet","iDB");
        reject(new Error("Indexet "+args.field+" kunne ikke indexeres, da du skal have skabt indexet i onversionchange-eventet"));
        return false;
      }
    }

    var keyRangeValue = null; // Default
    /* Følgende havde jeg problemer med hvis også args.field var blevet sat


    args.startinx = typeof args.startinx!=="undefined"?args.startinx:1;
    if (args.limit)
      keyRangeValue = IDBKeyRange.bound(args.startinx,args.limit+args.startinx-1);
    else
      keyRangeValue = IDBKeyRange.lowerBound(args.startinx);
      */

    var direction="next"; // Default
    if (args.order && args.order.toLowerCase() === "desc")
      direction = "prev";//Den bytter om på rækkefølgen, så den sidste bliver den første etc.

    var returneringer = [];
    var cursorInx = 0;
    request.openCursor(keyRangeValue,direction).onsuccess = function(event) {
      var cursor = event.target.result;
      //Tanke man kan implementere: Til når man kun skal have en bestemt værdi, skal man kun køre til den sidste række med den værdi (fordi det er sorteret efter args.field)
      //Til ideen skal du hoppe til afslutningen og ikke kalde cursor.continue()
      if (args.limit && returneringer.length >= args.limit){
        resolve(returneringer); // Stop med at hente flere rækker
      }
      else if (cursor) {
        if (typeof args.startinx==="undefined" || cursorInx >= args.startinx) {
          if (args.valore && args.field) {
            if (cursor.value[args.field] === args.valore)
              returneringer.push(cursor.value);
          }
          else {
            returneringer.push(cursor.value);
          }
        }
        cursor.continue();
      }
      else {
        //Færdig - ikke flere rækker
        //Da .onsuccess er et slags loop, skal man først returnere når alle rækker er fundet

        resolve(returneringer);
      }

      cursorInx++;
    };

  });//Fine del promise
};

iDB.num_rows = function (tabella){
  return new Promise(function (resolve,reject) {
    if (!iDB.isWorking()){
      debug.error("Browser non compattibile. iDB.num_rows()","iDB");
      reject(new Error("Browser non compattibile. iDB.select()"));
      return false;
    }
    if (!tabella){
      reject(new Error("Devi specificare una tabella. iDB.select()"));
      return false;
    }

    var request = iDB.db_HDL.transaction([tabella]).objectStore(tabella);
    var countRequest = request.count();
    countRequest.onsuccess = function() {
      resolve(countRequest.result);
    };
  });
};

iDB.update = function update(nometabella,primaryKeyValore,valori){
  var promise = new Promise(function(resolve,reject){
    if (nometabella === undefined || primaryKeyValore === undefined){
      reject(new Error("nometabella eller primaryKeyValore er ikke sat i iDB.update()"));
      return false;
    }

    if (typeof iDB.db_HDL !== "object"){
      reject(new Error("Devi aprire la DB prima - usi iDB.apri(<db_nome>). iDB.update()"));
      return false;
    }

    var objectStore = iDB.db_HDL.transaction([nometabella],"readwrite").objectStore(nometabella);
    var request = objectStore.get(primaryKeyValore);

    request.onerror = function updateError(event){
      // Handle errors!
      reject(event);
    };

    request.onsuccess = function updatePrimoSuc(event){
      //Get the old value we want to update
      var data  = request.result;
      if (data === undefined){
        reject(new Error("Ingen række fundet i iDB.update()"));
        return false;
      }

      //Update the value(s) in the object
      for (var chiave in valori){
        if (valori.hasOwnProperty(chiave))
          data[chiave] = valori[chiave];
      }

      //Put the updated object back
      var requestUpdate = objectStore.put(data);
      requestUpdate.onerror = function updateErrorSecondo(event){
        reject(event);
      };
      requestUpdate.onsuccess = function updateSecondoSuc(event){
        //Success - the value is updated
        resolve(event);
      }
    };
  });

  return promise;
};

iDB.cancella = function cancellaRiga(nometabella, primaryKeyValore) {
  var promise = new Promise(function(resolve,reject){
    if (primaryKeyValore === undefined){
      reject(new Error("primaryKeyValore er ikke sat i iDB.cancella()"));
      return false;
    }

    var objectStore = iDB.apriTabella(nometabella);
    if (!objectStore) {
      return false;
    }
    
    var request = objectStore.delete(primaryKeyValore);

    request.onsuccess = function(event) {
      resolve(event);
    };
  });
};

//Returner specifik række med bestemt id (primary key)
iDB.with_key = function con_primaryKey(tabella,primary_key_value){
  return new Promise(function(resolve,reject){

    if (typeof iDB.db_HDL!=="object"){
      reject(new Error("La banca dati non e' ancora aperta. iDB.with_key()"));
      return false;
    }

    var transaction = iDB.db_HDL.transaction([tabella]);
    var objectStore = transaction.objectStore(tabella);
    var request = objectStore.get(primary_key_value);

    request.onerror = function(event) {
      reject(new Error("Unable to retrieve data from database! iDB.with_key()"));
    };
    request.onsuccess = function(event) {
      // Do something with the request.result!
      if(request.result) {
        resolve(request.result);
      } else {
        reject(new Error("Ingen med keyen "+primary_key_value+" i tabellen "+tabella));
      }
    };
  });
};

/**
 * Funzione d'aiuto per creare una transazione
 */
iDB.apriTabella = function (nometabella) {
  var nome_funz = iDB.apriTabella.caller ? iDB.apriTabella.caller.name : "iDB.apriTabella";

  if (nometabella === undefined){
    reject(new Error("nometabella er ikke sat i iDB." + nome_funz + "()"));
    return false;
  }

  if (typeof iDB.db_HDL !== "object"){
    reject(new Error("Devi aprire la DB prima - usi iDB.apri(<db_nome>). iDB." + nome_funz + "()"));
    return false;
  }

  var transazione = iDB.db_HDL.transaction([nometabella],"readwrite");

  // report on the success of the transaction completing, when everything is done
  transazione.oncomplete = function(event) {
    // console.log("Transazione e andata bene in " + nome_funz + "()");
  };

  transazione.onerror = function(event) {
    console.error("Transazione e andata storta in " + nome_funz + "()\nError: " + transaction.error);
  };

  return transazione.objectStore(nometabella);
};

iDB.eliminaDB = function sletDatabase(db_nome, callback){
  db_nome = db_nome?db_nome:iDB.db_nome;
  callback = typeof callback === "function" ? callback : function (tipo, msg) {};
  var request = indexedDB.deleteDatabase(db_nome);
  request.onsuccess = function (event){
    debug.log("Databse "+db_nome+" slettet","iDB");
    callback("success", "Databse "+db_nome+" slettet","iDB");
  };

  request.onerror = function (event){
    console.log("Database "+db_nome+" ikke slettet");
    callback("error", "Database "+db_nome+" ikke slettet");
  };

  request.onblocked = function (event){
    console.log("Database "+db_nome+" ikke slettet, fordi operationen blev blokeret");
    callback("blocked", "Database "+db_nome+" ikke slettet, fordi operationen blev blokeret");
  }
};

// export default iDB;
/**
 * Copyright © 2017 Michele Dorph - michele (at) dorph.dk
 * Interface for storing large amount of data in rows using localStorage
 */

if (typeof clone !== "function" || typeof makeArray !== "function"){
  alert("stellaDB.js richiede clone() e makeArray() da webapp.helper.js");
}

var stellaDB = function (db_nome) {
  if (stellaDB.maxSpazio === undefined){
    var maxSpazioKey = stellaDB.storagePrefisso+"max_spazio";

    if (!localStorage[maxSpazioKey]){
      localStorage[maxSpazioKey] = stellaDB.calcolaMaxSpazio();
    }

    stellaDB.maxSpazio = parseInt(localStorage[maxSpazioKey]);
  }

  if (stellaDB.perc_disponibile < 0.1){
    alert("Du har kun 10% lager tilbage");
  }else if (stellaDB.perc_disponibile < 0.2){
    alert("Du har 20% lager tilbage");
  }

  this.db_nome = db_nome || stellaDB.std_db_nome;
  var db_stat = stellaDB.get_db_stat(db_nome);
  this.tabelle = db_stat.tabelle || [];

  stellaDB.get_tabelle(db_nome);
};

stellaDB.prototype.macchina = "stellaDB";
stellaDB.storagePrefisso = "sDB_";
stellaDB.std_db_nome = "stellaDB";
stellaDB.vuota_tabella = [];
// {db_nome1: {tabella1:[rige..], tabella2: [rige..]}, db_nome2: {...}}
stellaDB.db_cache = {};
stellaDB.maxSpazio = undefined;

Object.defineProperties(stellaDB.prototype, {
  'tabelle':{
    get: function () {
      return stellaDB.get_tabelle(this.db_nome)
    }
  },
  'spazio_usato': {
    get: function () {
      return stellaDB.spazio_usato;
    }
  },
  'spazio_disponibile': {
    get: function () {
      return stellaDB.spazio_disponibile;
    }
  },
  'perc_disponibile': {
    get: function () {
      return stellaDB.perc_disponibile;
    }
  }
});

Object.defineProperties(stellaDB, {
  'spazio_usato': {
    get: function () {
      return Math.round(JSON.stringify(localStorage).length);
    }
  },
  'spazio_disponibile': {
    get: function () {
      return stellaDB.maxSpazio - Math.round(JSON.stringify(localStorage).length);
    }
  },
  'perc_disponibile': {
    get: function () {
      return 1 - (this.spazio_usato / this.maxSpazio);
    }
  }
});

stellaDB.prototype.apri = function (nomebanca) {
  return new Promise(function (resolve){
    resolve(new stellaDB(nomebanca));
  });
};

/**
 * Crea una tabella - a non confondere con stellaDB.creaBanca()
 * @param db_nome
 * @param tabella_nome
 */
stellaDB.creaTabella = function (db_nome, tabella_nome) {
  var db_stat = stellaDB.get_db_stat(db_nome);
  if (typeof db_stat.tabelle !== "undefined" && db_stat.tabelle.indexOf(tabella_nome) !== -1){
    console.error("Tabella " + tabella_nome + "essiste gia");
    return false;
  }
  if (typeof db_stat.tabelle === "undefined"){
    db_stat.tabelle = [];
  }
  db_stat.tabelle.push(tabella_nome);
  stellaDB.salva_db_stat(db_nome, db_stat);


  stellaDB.agg_tabella(db_nome, tabella_nome, stellaDB.vuota_tabella);
  // TODO: lav evt. indexering
};

/**
 * Crea tabelle in stellaDB
 * @param {object} args - props: tabelle
 */
stellaDB.prototype.creaBanca = function (args) {
  return new Promise(function (resolve, reject) {
    var db_nome = this.db_nome;

    if (typeof args.tabella !== "undefined"){
      args.tabelle = args.tabella;
    }
    if (typeof args.tabelle === "undefined"){
      reject(new Error("Devi specificare JSON_args.tabelle in iDB.creaTabella()"));
      return false;
    }

    var tabelle = makeArray(args.tabelle);
    for (var i=0; i < tabelle.length; i++){
      stellaDB.creaTabella(db_nome, tabelle[i]);
    }

    resolve("ready");
  }.bind(this))
};
stellaDB.prototype.creaTabelle = function (args) {
  return this.creaBanca(args);
};
/**
 * Ritorna se la tabella e stata creata
 * @param tabella_nome - nome tabella in db
 * @returns {boolean} se tabella esssite in db
 */
stellaDB.prototype.essisteTabella = function (tabella_nome) {
  var db_stat = stellaDB.get_db_stat(this.db_nome);
  if (typeof db_stat.tabelle === "undefined"){
    return false;
  }
  return db_stat.tabelle.indexOf(tabella_nome) !== -1;
};

/**
 *
 * @param nome_tabella - il nome della tabella
 * @param riga - valore per inserire nella riga
 */
stellaDB.prototype.inserisci = function (nome_tabella, riga) {
  return new Promise(function (resolve, reject) {
    if (!this.essisteTabella(nome_tabella)){
      reject(new Error("Tabella " + nome_tabella + " non essiste"));
      return false;
    }

    riga = clone(riga); // Crea copia per mettere in DB

    var tabellaKey = stellaDB.get_tabella_key(this.db_nome, nome_tabella);
    var tabella = stellaDB.get_tabella(this.db_nome, nome_tabella, false);
    // Auto-add id as prop
    var ins_inx = tabella.length+1;
    if (typeof riga === "object"){
      if (typeof riga.id !== "undefined"){
        console.warn("Please don't provide hard-coded id property for row");
      }else {
        riga["id"] = ins_inx;
      }
    }

    tabella.push(riga); // tabella peger på stellaDB.db_cache
    localStorage[tabellaKey] = JSON.stringify(tabella);
    resolve(ins_inx, riga);
  }.bind(this))
};

stellaDB.prototype.select = function (nome_tabella, args) {
  return new Promise(function (resolve, reject) {

    // Run async
    stellaDB.run_async(this, function async_select() {

      if (!nome_tabella){
        reject(new Error("Devi specificare una tabella. stellaDB.select()"));
        return false;
      }

      args = args || {};
      var rige = stellaDB.get_tabella(this.db_nome, nome_tabella, true);

      if (!Array.isArray(rige)){
        reject(new Error("Fatal error: rige non array"));
        return false;
      }

      if (args.valore && args.field){
        rige = rige.filter(function (item) {
          if (typeof item !== "object" || typeof item[args.field] === "undefined"){
            reject(new Error("Riga:" + JSON.stringify(item) + " non contiene field " + args.field));
            return false;
          }
          return item[args.field] === args.valore;
        });
      }

      if (args.field){
        rige = stellaDB.sort(rige, args.field);
      }
      if (args.order && args.order.toLowerCase() === "desc"){
        rige.reverse();
      }

      var startinx = typeof args.startinx==="undefined" ? 0 : args.startinx;
      var end_inx = args.limit ? args.limit+startinx : undefined;
      rige = rige.slice(startinx, end_inx);

      resolve(rige);


    }); // End of setTimeout

  }.bind(this));
};

/**
 *
 * @param nome_tabella
 * @param riga_id - primary key ikke 0-baseret
 * @param valori
 * @returns {*}
 */
stellaDB.prototype.update = function (nome_tabella, riga_id, valori) {
  return new Promise(function (resolve, reject) {
    if (nome_tabella === undefined || riga_id === undefined || typeof valori === "undefined"){
      reject(new Error("nome_tabella o riga_id valori non definiti"));
      return false;
    }

    var riga_inx = riga_id-1;

    // Check om rækken eksisterer
    this.with_key(nome_tabella, riga_inx+1).then(function (riga) {

      if (riga === null){
        return false; // stellaDB.prototype.with_key smider en fejl i konsollen
      }

      if (typeof valori === "object"){
        valori = merge({}, riga, valori);
      }

      var tabellaKey = stellaDB.get_tabella_key(this.db_nome, nome_tabella);
      stellaDB.db_cache[this.db_nome][nome_tabella][riga_inx] = valori;
      localStorage[tabellaKey] = JSON.stringify(
        stellaDB.db_cache[this.db_nome][nome_tabella]
      );

      resolve(valori, riga_id);

    }.bind(this));

  }.bind(this));
};

/**
 *
 * @param nome_tabella
 * @param riga_id - primary key ikke 0-baseret
 * @param valori
 * @returns {*}
 */
stellaDB.prototype.cancella = function (nome_tabella, riga_id) {
  return new Promise(function (resolve, reject) {
    if (nome_tabella === undefined || riga_id === undefined){
      reject(new Error("nome_tabella o riga_id valori non definiti"));
      return false;
    }

    // Check om rækken eksisterer
    this.with_key(nome_tabella, riga_id).then(function (riga) {

      if (riga === null) {
        return false; // stellaDB.prototype.with_key smider en fejl i konsollen
      }

      var tabellaKey = stellaDB.get_tabella_key(this.db_nome, nome_tabella);
      stellaDB.db_cache[this.db_nome][nome_tabella].splice(riga_id-1,1);
      localStorage[tabellaKey] = JSON.stringify(
        stellaDB.db_cache[this.db_nome][nome_tabella]
      );

      resolve(riga_id);

    }.bind(this));
  }.bind(this));
}

/**
 * Returner specifik række med bestemt id (primary key)
 * @param nome_tabella
 * @param riga_id - primary key e "id" - ikke nul-baseret
 */
stellaDB.prototype.with_key = function (nome_tabella, riga_id) {
  return new Promise(function(resolve,reject) {
    if (!nome_tabella || typeof riga_id === "undefined"){
      reject(new Error("nome_tabella o riga_id non definito"));
      return false;
    }

    var riga_inx = riga_id-1;

    var rige = stellaDB.get_righe(this.db_nome, nome_tabella, true);
    if (!rige[riga_inx]){
      if (!rige.length){
        console.error("Tabella "+nome_tabella+" non essiste");
      }else {
        console.error("Riga "+riga_inx+" in "+nome_tabella+" non essiste");
      }
    }
    resolve(rige[riga_inx] || null);
  }.bind(this));
};

stellaDB.prototype.num_rows = function (nome_tabella){
  return new Promise(function (resolve, reject) {
    if (!nome_tabella){
      reject(new Error("Devi specificare una tabella. stellaDB.select()"));
      return false;
    }

    var tabella = stellaDB.get_tabella(this.db_nome, nome_tabella, false);

    if (!Array.isArray(tabella)){
      reject(new Error("Fatal error: tabella non array"));
      return false;
    }

    resolve(tabella.length);

  }.bind(this));
};

stellaDB.prototype.elimina = function (db_nome) {
  db_nome = db_nome || this.db_nome;
  // Fjern alle tabeller
  var db_stat = stellaDB.get_db_stat(db_nome);
  var nomi_tabelle = (db_stat && db_stat.tabelle) ? db_stat.tabelle : [];
  for (var i = 0; i < nomi_tabelle.length; i++){
    stellaDB.eliminaTabella(db_nome, nomi_tabelle[i]);
  }
  localStorage.removeItem(stellaDB.get_db_stat_key(db_nome));
};
stellaDB.eliminaTabella = function (db_nome, nome_tabella) {
  var tabellaKey = stellaDB.get_tabella_key(db_nome, nome_tabella);
  localStorage.removeItem(tabellaKey);
};
stellaDB.prototype.eliminaDB = function (db_nome) { // Compatibilitet til iDB
  return this.elimina(db_nome);
};

/**
 * Ritorna impostazioni della database
 * @param {object} db_nome
 * @param {object} db_stat
 * @returns {object} db_stat - impstazioni della db
 */
stellaDB.salva_db_stat = function (db_nome, db_stat) {
  localStorage[stellaDB.get_db_stat_key(db_nome)] = JSON.stringify(db_stat);
  return db_stat;
};

/**
 * Ritorna impostazioni della database
 * @param {string} db_nome
 * @returns {object} db_stat - impstazioni della db
 */
stellaDB.get_db_stat = function (db_nome) {
  if (!db_nome){
    return new Error("Devi specificare db_nome");
  }
  var storKey = stellaDB.get_db_stat_key(db_nome);
  if (!localStorage[storKey]){
    localStorage[storKey] = JSON.stringify({});
  }
  return JSON.parse(localStorage[storKey]);
};

/**
 * Ritorna la chiave usato in localStorage per salvare impostazioni per la db
 * @param db_nome
 */
stellaDB.get_db_stat_key = function (db_nome) {
  return stellaDB.storagePrefisso+db_nome;
};

/**
 * Ritorna un object della tabella
 * @param db_nome
 * @param nome_tabella
 * @param {boolean} copia - se fare una immutable copia
 * @returns {object} tabella
 */
stellaDB.get_righe = function (db_nome, nome_tabella, copia) {
  if (!db_nome || !nome_tabella){
    console.log("db_nome o nome_tabella non definito");
    return false;
  }

  if (typeof stellaDB.db_cache[db_nome] === "undefined") {
    stellaDB.db_cache[db_nome] = {};
  }

  if (typeof stellaDB.db_cache[db_nome][nome_tabella] === "undefined") {
    // Get from localStorage
    var storKey = stellaDB.get_tabella_key(db_nome, nome_tabella);

    if (!localStorage[storKey]){
      stellaDB.db_cache[db_nome][nome_tabella] = [];
    }else {
      stellaDB.db_cache[db_nome][nome_tabella] = JSON.parse(localStorage[storKey]);
    }
  }

  if (typeof copia === "undefined" || copia){
    return clone(stellaDB.db_cache[db_nome][nome_tabella]);
  }else {
    return stellaDB.db_cache[db_nome][nome_tabella];
  }
};
stellaDB.get_tabella = function (db_nome, nome_tabella, clone) {
  return stellaDB.get_righe(db_nome, nome_tabella, clone);
};

/**
 *
 * @param {string} db_nome
 * @returns {object} tabelle - key-paired
 */
stellaDB.get_tabelle = function (db_nome) {
  if (!db_nome){
    console.log("db_nome non definito");
    return false;
  }

  if (typeof stellaDB.db_cache[db_nome] === "undefined"){
    var db_stat = stellaDB.get_db_stat(db_nome);
    var nomi_tabelli = db_stat.tabelle || [];
    var tabelle_obj = {};
    for (var i = 0; i < nomi_tabelli.length; i++){
      tabelle_obj[nomi_tabelli[i]] = stellaDB.get_tabella(db_nome, nomi_tabelli[i], false);
    }
    stellaDB.db_cache[db_nome] = tabelle_obj;
  }

  return clone(stellaDB.db_cache[db_nome]);
};

stellaDB.agg_tabella = function (db_nome, nome_tabella, contenuto){
  if (!db_nome || !nome_tabella){
    console.error("db_nome o nome_tabella non definito");
    return false;
  }
  contenuto = contenuto || [];
  var storKey = stellaDB.get_tabella_key(db_nome, nome_tabella);
  localStorage[storKey] = JSON.stringify(contenuto);

  if (typeof stellaDB.db_cache[db_nome] === "undefined"){
    stellaDB.db_cache[db_nome] = {};
  }

  stellaDB.db_cache[db_nome][nome_tabella] = contenuto;
};

/**
 * Ritorna la chiave usato in localStorage per salvare una tabella
 * @param db_nome
 * @param nome_tabella
 */
stellaDB.get_tabella_key = function (db_nome, nome_tabella) {
  return stellaDB.storagePrefisso+db_nome+"_"+nome_tabella;
};

stellaDB.sort = function (array, prop2sort) {
  // Check type of prop
  if (typeof array[0]==="undefined"){ // Empty array
    return array;
  }
  var prop_type = typeof array[0][prop2sort];
  if (prop_type === "undefined"){
    console.error("Prop to sort on is not defined on first element of array");
    return array;
  }
  if (prop_type === "string"){
    return array.sort(function (a, b) {
      return a[prop2sort].localeCompare(b[prop2sort]);
    })
  }

  // Def:
  return array.sort(function (a, b) {
    return a[prop2sort]-b[prop2sort];
  })
};

stellaDB.calcolaMaxSpazio = function () {
  for (var i = 0, data = "m"; i < 40; i++) {
    try {
      localStorage.setItem("DATA", data);
      data = data + data;
    } catch(e) {
      var storageSize = Math.round(JSON.stringify(localStorage).length);
      // console.log("LIMIT REACHED: (" + i + ") " + storageSize + "K");
      // console.log(e);
      break;
    }
  }
  localStorage.removeItem("DATA");
  return storageSize;
};

stellaDB.run_async = function (this_obj, funz) {
  return setTimeout(funz.bind(this_obj), 0);
};
/**
 * [Memo description]
 * @param       {String} nome_db      Il nome del app/DB
 * @param       {Array<String>} nomi_tabelle nomi delle tabelle che il app usera
 * @param       {Array<Array<String>>} indexes de indexes hver tabel skal have
 * @constructor
 */
const Memo = function Memo(nome_db, nomi_tabelle, indexes) {
    var is_web_worker = typeof window === "undefined";
    if (!("init_sinc" in Memo.prototype) && !is_web_worker) { // Ignore for web workers
      alert("memo.js ha bisogno di memo.sinc.js per funzionare!");
    }

    this.nome_db = nome_db;
    this.nomi_tabelle = nomi_tabelle;
    this.unico_chiave = "UUID";
    this.sonoPronto = false;
    this.uuid = uuid; // Funzione per creare identificativo unico
    var indexedDB_supportato = typeof iDB === "object" && iDB.compat;

    function iniz_tabelle(nomi_tabelle, suFinito, indexes) {
      n_finiti = 0;
      nomi_tabelle = typeof nomi_tabelle !== "undefined" ? nomi_tabelle : [];
      for (var i = 0; i < nomi_tabelle.length; i++) {
        this.autocrea_tabella(nomi_tabelle[i], function () {
          n_finiti++;
          if (n_finiti === nomi_tabelle.length) {
            suFinito();
          }
        }, (indexes ? (indexes[i] || indexes) : undefined));
      }

      if (nomi_tabelle.length === 0) {
        suFinito();
      }
    }

    suPronto = function () {this.sonoPronto = true; this._esegui_suPronto(this)}.bind(this);
    if (indexedDB_supportato) {
      iDB.apri(this.nome_db).then(function () {iniz_tabelle.bind(this)(nomi_tabelle, suPronto, indexes)}.bind(this));
      this.db = iDB;
    } else {
      this.db = new stellaDB(this.nome_db);
      iniz_tabelle.bind(this)(nomi_tabelle, suPronto, indexes);
    }

    if (!is_web_worker) {
      this.init_sinc();
    }
};

// NB. suPronto kaldes ikke, hvis nomi_tabelle.length === 0. Det kan fikses i iniz_tabelle()
Memo.prototype.suPronto = function (funz) {
  this._esegui_suPronto = funz;
  if (this.sonoPronto) {
    funz(this);
  }
};
Memo.prototype._esegui_suPronto = function () {console.log("Memo e' pronto #stockfunz")}

Memo.update_tipo = Object.freeze({UPDATE: "update", INSERIMENTO: "inserisci", CANCELLAZIONE: "cancella"});

Memo.prototype.$before_update = [];
/**
 * Funzione dove puoi modificare una riga prima che venne mandato al server
 * @param  {String} nome_tabella [description]
 * @param  {function} funz         funz(tipo, riga) - devi ritornare un versione di riga
 * @return {[type]}              [description]
 */
Memo.prototype.before_update = function (nome_tabella, funz) {
  if (typeof funz === "function") {
    this.$before_update.push({nome_tabella: nome_tabella, funz: funz});
  }
};
Memo.prototype.esegui_before_update = function (nome_tabella, tipo, riga) {
  for (var i = 0; i < this.$before_update.length; i++) {
    var m = this.$before_update[i], r;
    if (m.nome_tabella === nome_tabella) {
      r = m.funz(tipo, riga);
      if (r) {
        riga = r; // Update riga med nyeste ændringer
      }
    }
  }

  return riga;
};

/**
 * Skal køre HVER gang en opdatering sker (både lokalt og fra server)
 * @param  {[type]} nome_tabella [description]
 * @param  {[type]} funz         [description]
 * @return {[type]}              [description]
 */
Memo.prototype.dopo_update = function (nome_tabella, funz) {
  this.$dopo_update.push({
    nome_tabella: nome_tabella,
    funz: funz});
};
Memo.prototype.$dopo_update = [];
Memo.prototype.esegui_dopo_update = function (nome_tabella, tipo, riga) {
  this.esegui_funzioni(this.$dopo_update, nome_tabella, tipo, riga);
};
Memo.prototype.esegui_funzioni = function (funz_arr, nome_tabella, tipo, riga) {
  for (var i = 0; i < funz_arr.length; i++) {
    var m = funz_arr[i], r;
    if (m.nome_tabella === nome_tabella) {
      m.funz(tipo, riga);
    }
  }

  return riga;
};

// Lidt en kopi af selve before_update - systemet
Memo.prototype._esegue_senti = false; // Per evitare che Memo.inserisci viene eseguito dentro Memo.senti()
Memo.prototype.$senti_funz = [];
Memo.prototype.senti = function(nome_tabella, funz) {
  this.$senti_funz.push({
    nome_tabella: nome_tabella,
    funz: funz});
};
Memo.prototype.esegui_senti = function (nome_tabella, tipo, riga) {
  this._esegue_senti = true;

  this.esegui_funzioni(this.$senti_funz, nome_tabella, tipo, riga);

  this._esegue_senti = false;
  return riga;
};

Memo.prototype.autocrea_tabella = function (nome_tabella, suFinito, indexes) {
  suFinito = typeof suFinito === "function" ? suFinito : function () {};
  indexes = Array.isArray(indexes) ? indexes : [];
  nome_tabella = this.pulisci_t_nome(nome_tabella);
    if (!this.db.essisteTabella(nome_tabella)) {
      if (this.db.macchina === "stellaDB"){
        stellaDB.creaTabella(this.nome_db, nome_tabella);
        suFinito();
      } else { // indexedDB
        this.db.creaTabella(nome_tabella, ["UUID"].concat(indexes)).then(function () {
          suFinito();
        });
      }
    } else {
      suFinito();
    }
};

Memo.prototype.impacchetta_camb = function (nome_tabella, riga) {
  nome_tabella = this.pulisci_t_nome(nome_tabella);
    return {
        tabella: nome_tabella,
        dati: encodeURIComponent(JSON.stringify(riga)),
        ora: Math.round((new Date().getTime()) / 1000)
    };
};

Memo.prototype.pulisci_t_nome = function (nome_tabella) {
  return nome_tabella.replace(/[^0-9a-z]/gi, "");
};

Memo.prototype.inserisci = function (nome_tabella, riga, callback) {
  if (this._esegue_senti) {
    console.error("Non e' una buona idea di eseguire Memo.inserisci() dentro Memo.senti(). Aborta!");
    return;
  }
  nome_tabella = this.pulisci_t_nome(nome_tabella);
    if (riga.hasOwnProperty(this.unico_chiave) && riga[this.unico_chiave]) {
        console.warn("Per cortesia lascia a memo.js a creare un UUID");
    }
    riga[this.unico_chiave] = this.uuid();
    riga = this.esegui_before_update(nome_tabella, Memo.update_tipo.INSERIMENTO, riga);
    return this.db.inserisci(nome_tabella, riga).then(function (){
        this.sinc_cambia("inserisci", nome_tabella, riga);
        this.esegui_dopo_update(nome_tabella, Memo.update_tipo.INSERIMENTO, riga);
        if (typeof callback === "function") {
            callback(riga[this.unico_chiave]);
        }
    }.bind(this));
};

Memo.prototype.seleziona = function (nome_tabella, args) {
  nome_tabella = this.pulisci_t_nome(nome_tabella);
    return this.db.select(nome_tabella, args);
};
Memo.prototype.select = function (nome_tabella, args) {
    return this.seleziona(nome_tabella, args);
};

/**
 *
 * @param nome_tabella
 * @param id_unico - UUID
 * @param valori
 * @returns {*}
 */
Memo.prototype.update = function (nome_tabella, id_unico, valori) {
  if (this._esegue_senti) {
    console.error("Non e' una buona idea di eseguire Memo.update() dentro Memo.senti(). Aborta!");
    return;
  }
  nome_tabella = this.pulisci_t_nome(nome_tabella);
  return new Promise(function (resolve, reject) {
    memo.seleziona(nome_tabella, {
      field: this.unico_chiave,
      valore: id_unico
    }).then(function (rige) {
      if (rige.length > 1) {
        this.errore("memo ha trovato piu rige con " + this.unico_chiave + " = '" + id_unico + "'");
        reject("memo ha trovato piu rige con " + this.unico_chiave + " = '" + id_unico + "'");
        return false;
      }
      valori = this.esegui_before_update(nome_tabella, Memo.update_tipo.UPDATE, valori);
      resolve(this.db.update(nome_tabella, rige[0].id, valori).then(function () {
        valori[this.unico_chiave] = id_unico;
        this.sinc_cambia("update", nome_tabella, valori);
        this.esegui_dopo_update(nome_tabella, Memo.update_tipo.UPDATE, valori);
      }.bind(this)));
    }.bind(this));
  }.bind(this));
};

/**
 *
 * @param nome_tabella
 * @param id_unico - UUID
 * @returns {*}
 */
Memo.prototype.cancella = function (nome_tabella, id_unico) {
  if (this._esegue_senti) {
    console.error("Non e' una buona idea di eseguire Memo.cancella() dentro Memo.senti(). Aborta!");
    return;
  }
  nome_tabella = this.pulisci_t_nome(nome_tabella);
  return new Promise(function (resolve, reject) {
    memo.seleziona(nome_tabella, {
      field: this.unico_chiave,
      valore: id_unico
    }).then(function (rige) {
      if (rige.length > 1) {
        this.errore("memo ha trovato piu rige con " + this.unico_chiave + " = '" + id_unico + "'");
        reject("memo ha trovato piu rige con " + this.unico_chiave + " = '" + id_unico + "'");
        return false;
      }
      resolve(this.db.cancella(nome_tabella, rige[0].id, valori).then(function () {
        valori[this.unico_chiave] = id_unico;
        this.sinc_cambia("update", nome_tabella, valori);
        this.esegui_dopo_update(nome_tabella, Memo.update_tipo.UPDATE, valori);
      }.bind(this)));
    }.bind(this));
  }.bind(this));
};

/**
 * Una funzione ajax fatto per Memo.js
 * @param  {string} url      il url da richiedere
 * @param  {string} post_vars mm
 * @param  {function} suFinito viene esseguito quando ha finito
 * @return {Promise}          un promise
 */
Memo.ajax = function (url, post_vars, suFinito) {
  return new Promise(function (resolve, reject) {

    var xhr = new XMLHttpRequest();
    xhr.open((post_vars ? "POST" : "GET"), url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function() {
      // NB. this is xhr
      if (this.readyState == 4) {
        if (this.status == 200) {
          resolve(xhr.responseText, xhr);
          if (typeof suFinito === "function") {
            suFinito(this.responseText, xhr)
          }
        }else {
          reject(this.status, xhr);
        }
      }
    };

    xhr.send(post_vars || null);

  });
};

Memo.prototype._err_ascolatori = [];
Memo.prototype.suErrore = function (funz) {
  this._err_ascolatori.push(funz);
};
Memo.prototype.errore = function (msg) {
  console.error(msg); // console.error(arguments.apply(null, arguments));
  for (var i = 0; i < this._err_ascolatori.length; i++) {
    this._err_ascolatori[i].bind(this)(msg);
  }
};

Memo.prototype.riazzera = function () {
    this.sinc_riazzera();
    this.db.eliminaDB(this.nome_db, function (tipo, msg) {
      location.reload();
    });
};

let is_serverish = typeof window === "undefined";
if (typeof stellaDB !== "function" && typeof iDB !== "object" && !is_serverish) {
    alert("memo.js ha bisogno di stellaDB o indexedDB (iDB) per funzionare!");
}

if (typeof JSONparseNums !== "function" && !is_serverish) {
    alert("memo.js ha bisogno di webapp.helper.js per funzionare!");
}


if (typeof uuid !== "function") {
  let uuid_caratteri = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");

  var uuid = function() {
    var chars = uuid_caratteri,
      uuid = new Array(36),
      rnd = 0,
      r;
    for (var i = 0; i < 36; i++) {
      if (i == 8 || i == 13 || i == 18 || i == 23) {
        uuid[i] = "-";
      } else if (i == 14) {
        uuid[i] = "4";
      } else {
        if (rnd <= 0x02) rnd = (0x2000000 + Math.random() * 0x1000000) | 0;
        r = rnd & 0xf;
        rnd = rnd >> 4;
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
    return uuid.join("");
  };
}
Memo.prototype.sinc = {
  storage_chiave: "memo_sinc",
  inpausa: false,
  debounce_hdl: 0,
  fetch_interval: 1000,
  min_fetch_interval: 200,
  max_fetch_interval: 20000,
  endpoint: "/memo/api/sinc.php" 
};

Memo.prototype.init_sinc = function () {
  const stato_predef = '{}';
  this.sinc_global_stato = JSON.parse((localStorage.getItem(this.sinc.storage_chiave) || stato_predef));
  this.sinc_stato = this.sinc_global_stato[this.nome_db] || {};
  this.sinc_stato.camb_aspettanti = this.sinc_stato.camb_aspettanti || [];

  this.sinc_comunica();
};

Memo.prototype.pausa_sinc = function (pausa) {
  this.sinc.inpausa = typeof pausa !== "undefined" ? !!pausa : true;
};
Memo.prototype.riprendi_sinc = function () {
  this.pausa_sinc(false);
};

Memo.prototype.sinc_salva_stato = function () {
  var stato = {
    camb_aspettanti: this.sinc_stato.camb_aspettanti,
    ultimo_update: this.sinc_stato.ultimo_update
  };
  this.sinc_global_stato[this.nome_db] = stato;
  localStorage.setItem(this.sinc.storage_chiave, JSON.stringify(this.sinc_global_stato));
};

/**
 * Registra un cambiamento per l'algoritmo di sinc
 * @param  {Memo.update_tipo} tipo      [description]
 * @param  {String} nome_tabella      [description]
 * @param  {Object} camb_data [description]
 * @return {[type]}           [description]
 */
Memo.prototype.sinc_cambia = function (tipo, nome_tabella, camb_data) {
  this.sinc_stato.camb_aspettanti.push(this.impacchetta_camb(nome_tabella, camb_data));
  this.sinc_salva_stato(this.sinc);

  this.sinc_comunica();
};

Memo.prototype.sinc.ult_num_camb = -1; // Per il debounce
Memo.prototype.sinc.sta_comunicando = false;
Memo.prototype.sinc_comunica = function () {
  if (this.sinc.inpausa) {
    setTimeout(function () {this.sinc_repeat()}.bind(this), 5000);
    return;
  }
  if (this.sinc_stato.camb_aspettanti.length !== this.sinc.ult_num_camb
      || this.sinc.num_in_coda > 0) {

    if (this.sinc.num_in_coda) {
      console.warn("Memo.sinc.num_in_coda > 0. Forse Memo.sinc_comunica() viene eseguito troppo spesso");
    }

    this.sinc.ult_num_camb = this.sinc_stato.camb_aspettanti.length;

    if (this.sinc.debounce_hdl) {
      clearTimeout(this.sinc.debounce_hdl);
    }
    this.sinc.debounce_hdl = setTimeout(this.sinc_comunica.bind(this), 2000);

    return;
  }

  if (this.sinc.sta_comunicando) {
    console.warn("sinc_comunica: Problema: Hai cercato di comunicare, ma Memo.sinc_comunica() sta gia' comunicando.");
    return;
  }

  this.sinc.sta_comunicando = true;
  // Gem hvor mange ændringer, der sendes, så disse kan fjernes, når ajax er fuldført
  this.sinc.sinc_finoa_inx = this.sinc_stato.camb_aspettanti.length;

  /* console.log("comunica col server", this.sinc_stato.camb_aspettanti); */
  const post = "memo_cambs=" + encodeURIComponent(JSON.stringify(this.sinc_stato.camb_aspettanti));
  const ultimo_update = this.sinc_stato.ultimo_update || 0;
  const url = (this.sinc.endpoint || "/memo/api/sinc.php") + "?db=" + this.nome_db + "&ultimo_update=" + ultimo_update;
  Memo.ajax(url, post).then(function (responseText) {
    if (responseText.substr(0,7)==="Errore:"){
      this.errore("Memo.sinc_comunica() " + responseText);
      this.sinc_comu_err();
      return false;
    }

    var data = JSON.parse(responseText); // JSONparseNums(responseText);
    this.sinc_stato.ultimo_update = data.ultimo_update;
    this.sinc_salva_stato();

    // Juster fetch interval alt efter antal ændringer
    var num_righe = Object.keys(data.novita).reduce(function (n, key) {
      return n + data.novita[key].length;
    }, 0);
    this.sinc.fetch_interval = parseInt(this.sinc.fetch_interval * (num_righe ? 0.4 : 1.2) );
    if (this.sinc.fetch_interval > this.sinc.max_fetch_interval) { this.sinc.fetch_interval = this.sinc.max_fetch_interval}
    if (this.sinc.fetch_interval < this.sinc.min_fetch_interval) { this.sinc.fetch_interval = this.sinc.min_fetch_interval}

    var righe = [], i;
    for (nome_tabella in data.novita) {

      righe = data.novita[nome_tabella];

      for (i = 0; i < righe.length; i++) {

        if (righe[i].eliminatoil === 0) {
          delete righe[i].eliminatoil;
        } else if (righe[i].eliminatoil) {
          console.info("Synker ikke fordi den er slettet (memo.js)", righe[i]);
          continue;
        }

        this.sinc_dati_server(nome_tabella, righe[i]);
      }
    }

    // Clean up and reset
    this.sinc_stato.camb_aspettanti.splice(0, this.sinc.sinc_finoa_inx);
    this.sinc.ult_num_camb = -1;
    this.sinc_salva_stato(this.sinc);

    if (!num_righe) { // num_righe = numero totale di tutte tabelle
      this.sinc_repeat();
    }

    /* console.log("From comunica: ", data); */
    this.sinc.sta_comunicando = false;
  }.bind(this))
  .catch(function (err_stato) {
    this.sinc_comu_err();
    if (err_stato !== 0) {
      this.errore("Memo.sinc.comunica() ajax error status: " + err_stato);
    }
  }.bind(this));
};

Memo.prototype.sinc.num_in_coda = 0;
Memo.prototype.sinc_dati_server = function (nome_tabella, valori) {
  delete valori.id; // Brug ikke serverens id-værdi!

  nome_tabella = this.pulisci_t_nome(nome_tabella);

  memo.seleziona(nome_tabella, {
    field: this.unico_chiave,
    valore: valori[this.unico_chiave]
  }).then(function (righe) {
    /* console.log("Devo salvare " + (righe.length < 1 ? "inserimento": "update") + ": ", valori); */

    var update_tipo;
    if (righe.length === 0) {
      update_tipo = Memo.update_tipo.INSERIMENTO;
    } else if (righe.length === 1) {
      update_tipo = Memo.update_tipo.UPDATE;
    } else {
      var msg = "memo ha trovato piu righe con " + this.unico_chiave + " = '" + valori[this.unico_chiave] + "'";
      console.error(msg);
      return false;
    }

    Memo.prototype.sinc.num_in_coda++;

    valori = this.esegui_before_update(nome_tabella, update_tipo, valori);

    if (update_tipo === Memo.update_tipo.INSERIMENTO) {
      this.db.inserisci(nome_tabella, valori).then(function () {
        this.esegui_dopo_update(nome_tabella, "inserisci", valori);
        this.esegui_senti(nome_tabella, "inserisci", valori);
        this.sinc_decrease_n_repeat();
      }.bind(this));
    }

    if (update_tipo === Memo.update_tipo.UPDATE) {
      this.db.update(nome_tabella, righe[0].id, valori).then(function () {
        this.esegui_dopo_update(nome_tabella, "update", valori);
        this.esegui_senti(nome_tabella, "update", valori);
        this.sinc_decrease_n_repeat();
      }.bind(this));
    }

  }.bind(this));
};

/**
 * Quando la comunicazione non e' riuscita
 * @return {[type]} [description]
 */
Memo.prototype.sinc_comu_err = function () {
  this.sinc_repeat();
  this.pausa_sinc(true);
  setTimeout(function () {
    this.pausa_sinc(false);
  }.bind(this), 30000);
  this.sinc.sta_comunicando = false;
};

/**
 * Hver gang et input fra serveren er gemt skal man tælle ned
 * indtil der ikke er flere ændringer i kø,
 * så er vi klar til at synkronisere igen - ikke før
 */
Memo.prototype.sinc_decrease_n_repeat = function (non_diminuire) {
  if (!non_diminuire) {
    this.sinc.num_in_coda--;
  }

  if (this.sinc.num_in_coda < 0) {
    this.errore("Fatal: sinc_num_in_coda < 0");
  }
  if (this.sinc.num_in_coda === 0) {
    this.sinc_repeat();
  }
};
Memo.prototype.sinc_repeat = function () {
  setTimeout(this.sinc_comunica.bind(this), this.sinc.fetch_interval);
};

Memo.prototype.sinc_riazzera = function () {
  this.sinc_stato.ultimo_update = -1;
  this.sinc_stato.camb_aspettanti = [];
  localStorage.removeItem(this.sinc.storage_chiave);
};
