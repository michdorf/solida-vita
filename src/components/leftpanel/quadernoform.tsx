import { createStore } from "solid-js/store";
import IQuaderno from "~/interface/quaderno";
import { nuovoQuaderno } from "~/stores/quaderni"

export default function QuadernoForm(props: {onSubmit: (qu: IQuaderno) => void}) {
    const [quaderno, setQuaderno] = createStore<IQuaderno>(nuovoQuaderno());

    return (
        <form onsubmit={e => {
            e.preventDefault();
            props.onSubmit({ ...quaderno });
            setQuaderno(nuovoQuaderno());
        }}>
            <input placeholder="titolo" value={quaderno.titolo} onChange={(e) => setQuaderno({titolo: e.currentTarget.value})} />
            <button type="submit">Salva</button>
        </form>
    )
}