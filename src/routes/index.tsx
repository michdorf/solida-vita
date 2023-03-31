import "./index.css";
import { createSignal, For, Show} from "solid-js";
import initMemo from "~/lib/db";
import oauthclient, { autoLogin, oauthStatus } from "~/lib/oauth";
import Memo from "~/moduli/memo/memo";
import note, {salvaNota} from "~/stores/note";
import NotaVoce from "~/components/NotaVoce";
import Nota from "~/components/Nota";
import NotaT from "~/interface/nota";
import {isServer} from "solid-js/web";
import {decrypt} from "~/stores/codice";
import INota from "~/interface/nota";
import {debounce} from "~/moduli/moduli/webapp.helper";

export type TPlainNota = NotaT & {plain: string}
let memo: Memo;
export default function Home() {
  const [notaSelto, setNotaSelto] = createSignal<NotaT>();

  const plainSelto = () => notaSelto() ? Object.assign({plain: decrypt(notaSelto()?.contenuto || "", notaSelto()?.enc_versione)}, notaSelto()) : undefined;

  if (!isServer) {
    memo = initMemo();
    autoLogin().catch(e => console.error(e));
  }

  let cambiato = false;
  let salva = /*debounce ??*/(nota: INota) => {
    cambiato = true;
    salvaNota(nota);
  }

  function seleziona(nota: INota) {
    if (cambiato && !confirm("Eliminare cambiamenti?")) {
      return;
    }else {
      cambiato = false;
    }

    setNotaSelto(nota);
  }

  function login() {
    oauthclient.authorizationCode("");
  }

  return (
    <main style="display: flex; flex-direction: column">
      <div class="header">
        <h1>Notes</h1>
      </div>
      <div class="panel-cont">
        <div class="left panel">
          <For each={note().sort((a,b) => b.d_time - a.d_time)}>{(nota) => <NotaVoce nota={nota} onselect={() => seleziona(nota)} />}</For>
        </div>
        <div class="right panel">
          <Show when={plainSelto()} keyed>{(plainNota) =>
            <Nota nota={plainNota} onUpdate={val => salva(val)} />
          }</Show>
          <Show when={oauthStatus() !== "authorized"} keyed={false}>
            <button onclick={login}>Login</button>
          </Show>
        </div>
      </div>
    </main>
  );
}
