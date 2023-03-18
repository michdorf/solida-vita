/* NB: der været problemer med at emojis med tilhørende farvenuance (color modifier)
   ødelægger kryptering - vist fordi de kan ses af enten et eller to tegn alt efter systemet
   Kig i string.js for at håndtere det. F.eks. kan skrives vha. string.js:

   if (contains_color_codes(contenuto)) {
     alert("Din tekst indeholder farvekoder, som ødelægger krypteringen.\nDisse emojis vil miste deres nuance");
     str = remove_color_codes(str);
   }
 */

function rand(min,max){//Returnerer ikke max
  if (!max)//Returner et tal i intervallet [1;min]
    return Math.floor(Math.random() * min + 1);
  else//Returner en et tal i intervallet [min;max[ dvs. [min;max-1]
    return Math.floor(Math.random() * (max-min) + min);
}

function num_casuale(min,max){

  if (crypto && crypto.getRandomValues){
    /* assuming that window.crypto.getRandomValues is available */

    var nummeri = new Uint32Array(10);
    crypto.getRandomValues(nummeri);

    var randPos = rand(nummeri.length+1);
    return nummeri[randPos-1]%(max-min)+min;
  }
  else
    return rand(min,max+1);
}

var cifra = function(){
  var alfabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789! .,#";
  var defKey = "Michele";

  function letteraPos(lettera){
    if (lettera.length > 1){
      console.error("Flere bogstaver i letteraPos(lettera): '"+lettera+"'");
      return false;
    }

    for (var i = 0; i < alfabet.length; i++){
      if (alfabet.substr(i,1) == lettera){
        return i;
      }
    }

    return false;
  }

  function tversum(num1,num2){//Con due nummeri sará la somma delle due "tværsummi"
    if (num2){
      return tversum(tversum(num2)+tversum(num1));
    }
    var i, sum = 0;
    if (num1 > 9){
      num1 = num1+"";
      for (i=0;i<num1.length;i++){
        sum += parseInt(num1[i]);
      }
      return sum<10?sum:tversum(sum);
    }
    else
      return num1;
  }

  function calc_checksum(str){

    var pos, checksum = 0;
    for (var i = 0; i < str.length; i++){
      pos = letteraPos(str[i]);
      if (pos !== false){
        checksum = (checksum+pos)%80;//tversum(pos,checksum);
      }
    }

    return checksum;
  }

  function gen_noise(maxlength){
    var ret = "";
    var noise = alfabet[num_casuale(0,alfabet.length-1)];//Måske kommer det sidste bogtav aldrig med
    while (noise!="g"){
      if (noise!=undefined) //Den kan finde på at tilføje et undefined bogstav til noise
        ret += noise;
      noise = alfabet[num_casuale(0,alfabet.length-1)];
    }
    ret += noise;

    if (ret.length>maxlength){//Gemmer den sidste del af noise (den med "g"-et til sidst)
      ret = ret.substr(ret.length-maxlength);
    }

    return ret;
  }

  // Bemærk: brug ikke agg_noise=false, kun agg_noise=true, hvis du har brug for det
  // agg_noise=false fungerer ikke pga. maxlength så også skal sættes
  function enc(str,key,versione,maxlength,agg_noise){
    key = key ? key : defKey;
    if (versione == 2) {
      var chksum_len = 2;
      if (typeof(agg_noise)==="undefined" || agg_noise)
        str = gen_noise(maxlength-str.length-chksum_len) + str;
      if (maxlength && str.length>maxlength)
        console.error("str er blevet for lang i cifra.enc(). Den må være: "+maxlength+" og er: "+str.length);
      var checksum = calc_checksum(str);
    }else if (maxlength && str.length>maxlength){
      console.error("str exceed max length. It can be "+maxlength+" and is "+str.length);
    }
    //str += checksum;
    var keyi = 0, pos, ret="";
    for (var i = 0; i < str.length; i++){
      pos = letteraPos(str[i]);
      if (pos !== false){
        if (keyi>=key.length)
          keyi = 0;
        pos = (pos+letteraPos(key[keyi]))%alfabet.length;
        ret += alfabet[pos];

        keyi++;
      }
      else
        ret += str[i];

      //keyi++;
    }

    if (versione==2) {
      if (checksum < 10) {checksum = "0" + checksum}
      return ret + checksum;
    }else{
      return ret;
    }
  }

  function dec(str,key,versione){
    key = key ? key : defKey;
    var keyi = 0, pos, ret="";

    if (versione==2) {
      var checksum = parseInt(str.substr(str.length - 2));
      str = str.substr(0, str.length - 2);
    }

    for (var i = 0; i < str.length; i++){
      pos = letteraPos(str[i]);
      if (pos !== false){
        if (keyi>=key.length)
          keyi = 0;
        pos = pos-letteraPos(key[keyi]);
        if (pos < 0)
          pos = pos+alfabet.length;
        ret += alfabet[pos];

        keyi++;
      }
      else
        ret += str[i];

      //keyi++;
    }

    if (versione==2) {
      //Check if checksum matches
      var cur_checksum = calc_checksum(ret);
      var check = (cur_checksum == checksum);

      //Elimina noise
      var cut = ret.indexOf("g");
      if (cut==-1){cut = 0}//Non succede mai
      ret = ret.substr(cut+1);

      return {ret: ret, check: check, checksum:cur_checksum, expected:checksum};
    }
    else
      return ret;
  }

  return {
    enc:enc,
    dec:dec,
    cur_versione:2,
    alfabet:alfabet
  }
}();

var diffie = function(){

  var stdKeyNum = 3;

  var mio_sec;
  var pub_p = 23;
  var pub_g = 5;//a primitive root modulo 23
  var diffie_key;

  function scegliChiave(){
    mio_sec = num_casuale(1,23);
    return mio_sec;
  }

  function exchange(pub_B){
    if ((!mio_sec) || (!pub_B)){
      console.error("Keys ikke definerede");
      return false;
    }
    //var pub = Math.pow(pub_g,mio_sec)%pub_p;//Send til den anden
    diffie_key = Math.pow(pub_B,mio_sec)%pub_p;//For Alice
    return diffie_key;
  }

  function ricChiave(){
    return (diffie_key) ? diffie_key : stdKeyNum;
  }

  function impChiave(chiave){
    return diffie_key = chiave;
  }

  function str2int(str){
    var num, i, ret="";
    for (i = 0, num = 0; i < str.length; i++){
      num = str.charCodeAt(i);
      //alert(str[i]+"\n"+num);
      if (num < 10)
        ret += "00"+num;
      else if (num < 100)
        ret += "0"+num;
      else
        ret += num;
    }

    return parseInt(ret);
  }

  function int2str(tal){
    var ret = "", talStr = tal+"";

    var rest = talStr.length%3;
    for (var i=Math.floor(talStr.length/3); i > 0;i--){
      if (rest)
        inx = (i == 0) ? 0 : i*3-rest+1;
      else
        inx = (i == 0) ? 0 : i*3-3;
      ret = String.fromCharCode(talStr.substr(inx,3))+ret;
      //alert("Hele tallet:"+talStr+"\nTal:"+talStr.substr(inx,3)+"\nI:"+i+"\nInx:"+inx+"\nRest:"+rest+"\nRet:"+ret);
    }

    ret = String.fromCharCode(talStr.substr(0,rest))+ret;

    return ret;
  }

  function encrypt(str,keyNum){
    keyNum = keyNum ? impChiave(keyNum) : ricChiave();
    var ret = "", block = 4;
    while (str.length > block){
      ret += (str2int(str.substr(0,block))*keyNum)+" ";
      //alert(ret);
      str = str.substr(block);
    }

    if (str.length > 0)
      ret += (str2int(str)*keyNum)+" ";

    return ret.substr(0,ret.length-1);
  }

  function decrypt(str,keyNum){
    keyNum = keyNum ? impChiave(keyNum) : ricChiave();
    var ret = "", blocks = str.split(" ");
    for (var i = 0; i < blocks.length; i++){
      ret += int2str(blocks[i]/keyNum);
    }

    return ret;
  }

  return {
    enc:encrypt,
    dec:decrypt,
    scegliChiave:scegliChiave,
    exchange:exchange
  }

}();

// Klasse til at skabe dialogboks til at modtage kode
var sicuro = function (){

  var c_salvato = "";//Den kan ikke hentes med sicuro.c_salvato, da den ikke er med i return{}
  var c_salvato_time = 1200; // 20 min - Sekunder før koden slettes igen
  var salva_c = true;
  var salva_c_timer;

  // Lås automatisk kode, hvis bruger forlader side
  var blurTimer;
  if (typeof window !== "undefined") {
    window.addEventListener("blur", function () {
      if (blurTimer) {
        clearTimeout(blurTimer);
      }
      blurTimer = setTimeout(function () {
        sicuro.azzeraCodice();
      }, (4*60 + 28) * 1000); // 4:28
    });
    window.addEventListener("focus", function () {
      if (blurTimer) {
        clearTimeout(blurTimer);
      }
    });
  }

  var autoSkabDialogHTML = false; // Skab automatisk dialogboksen, man taster kode i
  if (autoSkabDialogHTML){
    window.addEventListener("load",function autoSkaberCiffraDialog(){
      if (!document.getElementById("c_dialog")){
        creaCryptDialogo();
      }
    },false);
  }

  /**
   * Kører funz hver gang koden gemmes eller fjernes fra cache
   * @param funz - funz(aperto:boolean, codice:string)
   */
  function su_aperto(funz) {
    _su_aperto_f.push(funz);
  }
  var ult_codice_salvato = undefined;
  var _su_aperto_f = [];
  function esegui_su_aperto(aperto, codice) {
    if (codice === ult_codice_salvato) {
      return; // Only fire once when it changes
    }
    ult_codice_salvato = codice;
    for (var i = 0; i < _su_aperto_f.length; i++) {
      _su_aperto_f[i](aperto, codice);
    }
  }

  function set_salva_c(salva) {
    salva_c = salva;
  }

  // Indsætter kode-dialog på siden - kræver sicuro.css (som ikke findes????)
  // Den er inkluderet i /webApp/css/basic.css
  function creaCryptDialogo(){
    /*<div id="c_dialog">
     Immetti il tuo codice<br>
     <input id="cdia_c" type="password"><br>
     <button id="cdia_bot">Crittografi</button>&bull;
     <button id="cdia_canc">Cancella</button>
     </div>*/
    var c_dialog = document.createElement("div");
    c_dialog.id = "c_dialog";
    c_dialog.innerHTML = 'Immetti il tuo codice<br><input id="cdia_c" type="password"><br><button id="cdia_bot">Crittografi</button>&bull; <button id="cdia_canc">Cancella</button>';
    document.body.appendChild(c_dialog);
  }

  function azzeraCodice(){
    c_salvato = "";
    esegui_su_aperto(false);
  }

  function gen_testo_verifica(codice,len) {
    len = len || 32;
    var ret = "", noise;
    for (var i=0; i<len; i++){
      noise = cifra.alfabet[num_casuale(0,cifra.alfabet.length-1)];//Måske kommer det sidste bogtav aldrig med
      if (noise===undefined){
        i--;
        continue;
      }
      ret += noise;
    }

    return cifra.enc(ret,codice,cifra.cur_versione,null,false);
  }

  var testo_verif = "";
  function testo_verifica(codice,rigenera){
    if (testo_verif===""){
      if (!(testo_verif = localStorage.getItem("sicuro_t_verif")))
        rigenera = true;
    }
    if (rigenera){
     if (codice)
      testo_verif = gen_testo_verifica(codice);
     else
       console.error("Missing code in sicuro.testo_verifica()");
    }

    localStorage.setItem("sicuro_t_verif",testo_verif);
    return testo_verif;
  }

  function verifica_codice(codice) {
    return cifra.dec(testo_verifica(codice),codice,cifra.cur_versione).check;
  }

  function ric_codice_salvato(){ //Ritorna il codice se é salvato
    if (c_salvato)
      return c_salvato;
    else
      return false;
  }

  // Vis og håndter indtastning af kode
  // NB. funz bliver også kørt ved cancel (funz(undefined))
  function ric_codice(funz){
    if (typeof(funz) != "function"){
      w_debug("funz non é un funzione in sicuro.ric_codice()");
      return false;
    }

    //Hent koden automatisk, hvis den er gemt
    // Hvis ikke salva_c er true, skal den gemte kode ikke bruges
    if (c_salvato !== "" && salva_c){
      diac_eventListener(undefined,c_salvato);
      return true;
    }

    function diac_eventListener(event,c){
      c = c || document.getElementById("cdia_c").value;
      if (c){
        // Verficer, at det er den rigtige kode
        var verifica_success = true;
        if (!verifica_codice(c)){
          if (!confirm("Du har indtastet en anden kode end sidst\nTryk Ok for at benytte den nye kode"))
            verifica_success = false;
          else
            testo_verifica(c,true); // Regenerer en ny verificeringstekst
        }

        // Send koden tilbage hvis brugeren er tilfreds med koden
        if (verifica_success) {
          if (salva_c) {
            c_salvato = c;
            if (salva_c_timer)
              clearTimeout(salva_c_timer);
            salva_c_timer = setTimeout(function elimCSalvato() {
              c_salvato = "";
            }, c_salvato_time * 1000);

            esegui_su_aperto(true, c_salvato);
          } else {
            if (c_salvato) { // Hvis koden har været gemt, men nu slettes
              esegui_su_aperto(false, undefined);
            }
            c_salvato = "";
          }
          funz(c);
        }else{
          funz(undefined); // Send ingen kode tilbage
        }

        c = null; // Garbage collection
      }

      document.getElementById("cdia_c").value = "";

      //document.getElementById("cdia_bot").removeEventListener("click",diac_eventListener,false);
      remove_listeners();
      document.getElementById("c_dialog").style.display = "none";
    }

    function remove_listeners() {
      document.getElementById("cdia_bot").removeEventListener("click",diac_eventListener,false);
      document.getElementById("cdia_canc").removeEventListener("click",cancel_c_rechiesta,false);
      document.getElementById("cdia_c").removeEventListener("keydown", cach_keyboard, false);
    }

    function cach_keyboard(e){//Fanger enter og esc tastninger
      var keyCode = (e.which) ? e.which : e.keyCode;
      if (keyCode == 13) {
        diac_eventListener();
        //document.getElementById("cdia_c").removeEventListener("keydown", cach_keyboard, false);
        remove_listeners();
      }
      else if (keyCode == 27){
        document.getElementById("cdia_canc").click();
        //document.getElementById("cdia_c").removeEventListener("keydown", cach_keyboard, false);
        remove_listeners();
      }
    }

    document.getElementById("c_dialog").style.display = "block";
    document.getElementById("cdia_c").addEventListener("keydown",cach_keyboard,false);

    //cdia_c cdia_bot cdia_canc
    document.getElementById("cdia_bot").addEventListener("click",diac_eventListener,false);

    function cancel_c_rechiesta(){
      //document.getElementById("cdia_bot").removeEventListener("click",diac_eventListener,false);
      remove_listeners();
      document.getElementById("cdia_c").value = "";
      document.getElementById("c_dialog").style.display = "none";
      funz(undefined);
    }

    document.getElementById("cdia_canc").addEventListener("click",cancel_c_rechiesta,false);

    document.getElementById("cdia_c").focus();
    document.getElementById("cdia_c").select();
  }

  // Dekrypter testo og vis i en popup-boks
  function ric_info(testo){
    ric_codice(function (c) {
      if (c){
        alert(cifra.dec(testo,c));
        c = null;
      }
    });
  }

  return{
    ric_codice:ric_codice,
    ric_info:ric_info,
    creaCryptDialogo:creaCryptDialogo,
    salva_c:salva_c,
    set_salva_c:set_salva_c,
    azzeraCodice:azzeraCodice,
    su_aperto: su_aperto,
    ric_codice_salvato:ric_codice_salvato,
    /*testo_verifica:testo_verifica,
    verifica_codice:verifica_codice*/
  }

}();
