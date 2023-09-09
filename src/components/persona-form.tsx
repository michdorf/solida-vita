import { createEffect, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import IPersona, { TSesso } from "~/interface/persona";
import persone, { nuovaPersona } from "~/stores/persone";

export default function PersonaForm(props: {onSubmit: (persona: IPersona) => void}) {
    let nomeInput: HTMLInputElement | undefined;
    const [persona, setPersona] = createStore<IPersona>(nuovaPersona());

    createEffect(() => {
        let key = persona.nome.toLowerCase().replace(/[^a-z]/g, "");
        let i = 0;
        while (persone.find(pr => pr.keyid === key)) {
            key = persona.nome.toLowerCase().replace(/[^a-z]/g, "") + "-" + i;
            i++;
        }
        setPersona('keyid', key);
    });

    onMount(() => {
        if (nomeInput) {
            nomeInput.focus();
            nomeInput.select();
        }
    });

    let keytaken = () => typeof persone.find(pr => pr.keyid === persona.keyid) !== "undefined";

    return (
        <form onsubmit={e => {
            e.preventDefault();
            props.onSubmit({ ...persona });
            setPersona(nuovaPersona());
        }}>
            <input placeholder="Key" value={persona.keyid} onChange={(e) => setPersona({keyid: e.currentTarget.value})} /><br/>
            <input ref={nomeInput} placeholder="Nome" value={persona.nome} onChange={(e) => setPersona({nome: e.currentTarget.value})} /><br/>
            <select onChange={(e) => setPersona("sesso", () => e.currentTarget.value as TSesso)}>
                <option value="f">Femine</option>
                <option value="m">Machio</option>
                <option value="o">Altro</option>
            </select><br/>
            <input placeholder="Nota" value={persona.nota} onChange={(e) => setPersona({nota: e.currentTarget.value})} /><br/>
            <button type="submit" disabled={keytaken()}>Salva</button>
        </form>
    )
}