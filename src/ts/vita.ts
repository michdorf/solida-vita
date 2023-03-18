if (typeof window !== "undefined") {
    let is_iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
}

function strip_html(s: string) {
    return s.replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

export function clean_html(s: string) {
    return s.replace(/>/g, "&gt;").replace(/</g, "&lt;");
}

function advanced_clean_html(s, acceptedTags, acceptedProps) {
    var r = "";
    var isTag = false;
    acceptedTags = typeof acceptedTags === "object" ? acceptedTags : ["p", "strong", "a", "img"];
    acceptedProps = typeof acceptedProps === "object" ? acceptedProps : ["href", "target", "src"];
    var m = s.split(/(<\/?|>)/g)
    for (var i = 0; i < m.length; i++) {
        if (m[i][0] === "<") {
            isTag = true;
            i++;
        } else if (m[i][0] === ">") {
            isTag = false;
            i++;
        }

        if (isTag) {
            exp = m[i].split(" ");
            if (acceptedTags.indexOf(exp[0]) !== -1) {
                r += m[i-1] + exp[0];
                exp = exp.slice(1);
                r += exp.length
                ? " " + exp.filter((prop) => acceptedProps.indexOf(prop.substr(0, prop.indexOf("="))) !== -1).join(" ")
                : "";
                r += ">";
            } else {
                r += "&lt;" + (m[i-1][1] || "") + exp[0];
                if (typeof m[i+1] !== "undefined" && m[i+1].substr(0,1) === ">") { // Hvis ikke, bliver tagget ikke lukket
                    r += "&gt;";
                }
        else { // tagget bliver ikke lukket
            r += m[i];
        }
            }
        }else {
            r += m[i];
        }
    }

    return r;
}

export function getHashtagRegEx() {
    // return /\#[^\n \.]+/g;
    // return /\#[\p{L}0-9_-]+/g;
    // return /#([a-zæøåéè0-9_\-<\/>]+)/gi;
    return /#(((<\/?span.+?>)|[a-zæøåéè0-9_\-])+)/gi;
}

/**
 * Helper til stabil måde at fokusere på et DOM element
 * @param el
 */
function concentraSu(el) {
    setTimeout(function () {
        el.focus();
        }, 100);
}

var cerca = {};
cerca.ult_nota_cercato = 0;
cerca.prima_nota_cercata = 42;
cerca.estrattiTermini = function term(s){
    return s.split(/"(.+?)"/).map((t, i) => i%2===0 ? t.split(" ") : t.trim()).flat().filter(t => t!=="")
};
cerca.strictmatch = function strictsearch(str, ricerca) {
    var terms = cerca.estrattiTermini(ricerca);
    var j, ret = [];
    var success = true;
    for (j = 0; j < terms.length; j++) {
        if (str.toLowerCase().indexOf(terms[j].toLowerCase()) === -1) {
            success = false;
            break;
        }
    }


    return success;
};
cerca.match = function (txt,match) {
    var plain = modello.markdown(match).stripHTML().toLowerCase();
    return cerca.strictmatch(plain, txt);
    // return plain.indexOf(txt.toLowerCase())!==-1;
};
cerca.highlight_match = function (txt,full_txt) {
    // Sørg for at matche trods markdown - fx. søger man på "er glad" i teksten "jeg er *glad*"
    // m er en variabel med et regexp til at matche alle markdown tegn (*,_,~)
    var termini = cerca.estrattiTermini(txt);
    var m = ("("+modello.markdown_chars.join("|")+")").replace("*","\\*")+"?"; // => (\*|_|~)?
    // var regstr = "("+m+txt.join(m+" "+m)+m+")"; // => fx. ((\*|_|~)?er(\*|_|~) (\*|_|~)?glad(\*|_|~)?)"
    var regstr = "("+m+termini.join(m+"|"+m)+m+")";
    return full_txt.replace(new RegExp(regstr,"gi"),'<span class="highlighted">$1</span>');
};

function cerca_nota(s, note, mostra_n, startinx, dir) { // dir = 0 (giu), dir = 1 (su)
    document.getElementById("sta_ricercando").style.display = "block";
    return new Promise(function (resolve) {
        if (!window.Worker) {
            cerca_nota_async(s, note, mostra_n, startinx, dir, function (r) {
                resolve(r);
            });

            return;
        }

        var s_codice = sicuro.ric_codice_salvato();
        var cerca_worker;
        cerca_worker = new Worker('js/cerca.worker.js');

        cerca_worker.postMessage({s: s, note: note, mostra_n: mostra_n, startinx: startinx, dir: dir, codice: s_codice});

        cerca_worker.onerror = function (ev) {
            console.error("Worker: " + ev.message + " line: " + ev.lineno + " (" + ev.filename + ")");
        };

        cerca_worker.onmessage = function (ev) {
            resolve(ev.data.note_trovate);
            // Alt efter hvilken retning, er det ene tal blevet opdateret
            if (dir) {
                cerca.prima_nota_cercata = ev.data.prima_nota_cercata;
            } else {
                cerca.ult_nota_cercato = ev.data.ult_nota_cercato;
            }
            document.getElementById("sta_ricercando").style.display = "none";
            cerca_worker.terminate();
        };
    });
}
function cerca_nota_async(s, note, mostra_n, startinx, dir, suFinito, codice) {
    var s_codice = codice || sicuro.ric_codice_salvato();
    s = s || "";
    s = s.trim();

    var c, r = [], matches = false, match_count = 0;

    // De bør allerede være sorterede rigtigt: note = note.slice().reverse(); // Søg fra nyeste til ældste

    startinx = startinx ? startinx : 0;
    var i = startinx;
    while (i < note.length && i >= 0) {
        if (match_count >= mostra_n) {
            break;
        }

        var nota = note[i];
        matches = false;
        // Gennemsøger titolo, contenuto (se possibile) og data
        if (cerca.match(s, nota.titolo)) {
            matches = true;
        } else {
            var contenuto = nota.contenuto;
            if (nota.enc_versione && s_codice !== false) {
                contenuto = deciffra(contenuto, s_codice, nota.enc_versione);
            }
            var dec_riuscito = (!nota.enc_versione) || (s_codice !== false);
            if (cerca.match(s, contenuto) && dec_riuscito) {
                matches = true;
            }
        }

        if (matches) {
            r.push(nota);
            match_count++;
        }

        i += dir ? -1 : 1; // Søg op (dir=1) eller nedad (dir=0)
    }

    if (dir === 1) {
        cerca.prima_nota_cercata = i + 1;
    } else { // Gem ikke ult_nota_cercato, hvis man søger "baglæns" i programmet
        cerca.ult_nota_cercato = i;
    }

    if (typeof suFinito === "function") {
        suFinito(r, cerca.prima_nota_cercata, cerca.ult_nota_cercato);
    }
    return r;
}

function salva_nota(nota_orig,nota_nuova) {
    unisci_vue_oggetti(nota_orig, nota_nuova);
    if (nota_orig[memo.unico_chiave].substr(0, 6) === "nuova.") {
        delete nota_orig[memo.unico_chiave];
        memo.inserisci("note", nota_orig);
    } else {
        memo.update("note", nota_orig[memo.unico_chiave], nota_orig);
    }
}

function deciffra(s, codice, versione) {
    var dec_txt = cifra.dec(s, codice, versione);
    return versione > 1 ? dec_txt["ret"] : dec_txt;
}

function sottoinsieme(note, max_number, startinx) {
    startinx = startinx || 0;
    return note.slice(startinx, max_number + startinx);
    // return note.slice().reverse().slice(0, max_number);
}

var tags_estratti = [];
function estratti_tags(str) {
    var rx = getHashtagRegEx();
    var arr = str.match(rx);
    if (arr) {
        agg_tags(arr.map(tag => tag.substr(1)).filter(function (tag) {
            return tag;
        })
        );

        if (typeof app !== "undefined") {
            app.$store.commit("aggiorna_tags", tags_estratti);
        }
        //app.tutte_tags = app.tutte_tags.concat(arr.map(tag => tag.substr(1) /* remove "#" */).filter(function (tag) {
        //  return tag;
        //}));
    }
}

function agg_tags(tag_arr) {
    tag_arr.forEach(function (tag) {
        agg_tag(tag);
    });
}
function agg_tag(tag) {
    if (tags_estratti.indexOf(tag) === -1) {
        tags_estratti.push(tag);
    }
}

function carica_note(memo) {
    memo.seleziona("note").then(function (righe) {
        var rnote = [];
        for (var i = 0; i < righe.length; i++) {
            if (righe[i].eliminatoil) {
                continue;
            }
            rnote.push(righe[i]);
        }
        unisci_vue_oggetti(app.note, righe);
        app.note.sort(function (a, b) { return b.d_time - a.d_time });
    });
}

/**
 * Cambia il codice per tutte le note
 */
function cambia_codice(vecchia, nuova) {
    var note = app.note;
    var contenuto = "", enc_versione, plain, success = true;
    for (var i = 0; i < note.length; i++) {
        enc_versione = note[i].enc_versione;
        if (!enc_versione) {
            continue;
        }
        contenuto = note[i].contenuto;
        plain = cifra.dec(contenuto, vecchia, enc_versione);
        success = true;
        if (typeof plain["check"] !== "undefined") {
            success = plain["check"];
            plain = plain["ret"];
        }
        if (success) {
            note[i].contenuto = cifra.enc(plain, nuova, app.def_enc_ver, );
            note[i].enc_versione = app.def_enc_ver;
            salva_nota(note[i], note[i]);
        } else {
            console.warn("Noten \"" + note[i].titolo + "\" blev ikke ændret, da den bruger en anden kode.");
            alert("Noten \"" + note[i].titolo + "\" blev ikke ændret, da den bruger en anden kode.");
        }
    }

    sicuro.azzeraCodice();
    alert("Krypteringsnøglen er blevet ændret!");
}
function cambia_codice_ux() {
    var vecchia, nuova;
    var c_salvato = sicuro.ric_codice_salvato();
    if (c_salvato) {
        vecchia = c_salvato;
    } else {
        vecchia = prompt("Gamle kode: ");
    }
    nuova = prompt("Ny kode:");
    if (!vecchia || !nuova) {
        confirm("Der gik noget galt med indtastningen af koderne");
        return false;
    }
    cambia_codice(vecchia, nuova);
}

function sort_app_note(note) {
    note = typeof note !== "undefined" ? note : app.note;
    note.sort(function (a, b) { return b.d_time - a.d_time });
}

function findTop(elem) {
    var cur = 0;
    if (elem.offsetParent) {
        do {
            cur += elem.offsetTop;
        } while (elem = elem.offsetParent);
    }

    return cur;
}

function getCaretPosition(editableDiv) {
    var caretPos = 0,
        sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            if (range.commonAncestorContainer.parentNode == editableDiv) {
                caretPos = range.endOffset;
            }
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        if (range.parentElement() == editableDiv) {
            var tempEl = document.createElement("span");
            editableDiv.insertBefore(tempEl, editableDiv.firstChild);
            var tempRange = range.duplicate();
            tempRange.moveToElementText(tempEl);
            tempRange.setEndPoint("EndToEnd", range);
            caretPos = tempRange.text.length;
        }
    }
    return caretPos;
}
