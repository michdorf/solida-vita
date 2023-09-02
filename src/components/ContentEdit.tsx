import {clean_html, getHashtagRegEx} from "~/ts/vita";
import {TPlainNota} from "~/routes";
// tributejs ha `if window` (invece di `typeof window`) che non funziona su server
import Tribute, { TributeItem } from "tributejs";
import { createSignal, onMount} from "solid-js";
import { isServer } from "solid-js/web";
import getDifference from "~/lib/diff";
import Modal from "./modal";
import PersonaForm from "./persona-form";
import persone, { salvaPersona } from "~/stores/persone";

export default function ContentEdit(params: {nota: TPlainNota, onUpdate: (val: string) => void}) {
    let divEl: HTMLDivElement | undefined;
    const [aggPersona, setAggPersona] = createSignal(false);

    const plain = () => params.nota.plain || params.nota.contenuto;
    const htmlContenuto = () => {
        let s = plain() || "";
        s = clean_html(s);
        /* if (ricerca_filter) {
            s = cerca.highlight_match(this.ricerca_filter, s);
        } */
        s = s.replace(getHashtagRegEx(), "<span class='hashtag'>#$1</span>");
        // s = modello.markdown(s);
        s = s.replace(/\n/g, "<br>");
        return s;
    }

    onMount(() => {
        const newTriggerString = "-nuova";
        if (!divEl || isServer) {return}
        let tribute = new Tribute({
            trigger: '@',
            values: [...persone.map(persona => {return {key: persona.nome, value: persona.key}}), {key: "+ Nuova persona", value: newTriggerString}]
        });
        tribute.attach(divEl);
        divEl.addEventListener("tribute-replaced", function(e) {
            console.log("Matched item:", e.detail.item);
            const item = e.detail.item;
            if (item.original.value === newTriggerString && divEl) {
                setAggPersona(true);
                divEl.innerHTML = cacheTxt;
            }
        });

        let cacheTxt = htmlContenuto();
        divEl.addEventListener("tribute-active-false", function(e) {
            cacheTxt = divEl?.innerHTML || "";
        });

        /* divEl.addEventListener("tribute-no-match", function(e) {
            tribute.appendCurrent([
                { key: "+ Nuova persona", value: "-nuova"}
            ]);
        }); */
    });

    return (
            <>
            <Modal show={aggPersona()}>
                <PersonaForm onSubmit={persona => {salvaPersona(persona); setAggPersona(false);}}></PersonaForm>
            </Modal>
            <div ref={divEl} style={{height: "100%", width: "100%", 'overflow-y': 'auto'}}
                 contenteditable={true}
                 class="contenuto"
                 innerHTML={htmlContenuto()}
                 onkeyup={ev => params.onUpdate(ev.currentTarget.innerText)}>
            </div>
            </>
    )
}