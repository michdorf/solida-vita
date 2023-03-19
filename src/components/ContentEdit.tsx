import INota from "~/interface/nota";
import {clean_html, getHashtagRegEx} from "~/ts/vita";
import {TPlainNota} from "~/routes";

export default function ContentEdit(params: {nota: TPlainNota, onUpdate: (val: string) => void}) {
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

    return (
            <div style={{height: "100%", width: "100%"}}
                 contenteditable={true}
                 class="contenuto"
                 innerHTML={htmlContenuto()}
                 onkeyup={ev => params.onUpdate(ev.currentTarget.innerText)}>
            </div>
    )
}