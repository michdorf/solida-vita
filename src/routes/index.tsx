import "./index.css";
import { createSignal, For, Show} from "solid-js";
import initMemo from "~/lib/db";
import oauthclient, { autoLogin, oauthStatus } from "~/lib/oauth";
import Memo from "~/moduli/memo/memo";
import note, {salvaInDb as memoSalvaInDb, salvaNota} from "~/stores/note";
import NotaVoce from "~/components/NotaVoce";
import Nota from "~/components/Nota";
import NotaT from "~/interface/nota";
import {isServer} from "solid-js/web";
import {decrypt} from "~/stores/codice";
import INota from "~/interface/nota";

export type TPlainNota = NotaT & {plain?: string}
let memo: Memo;
export default function Home() {
  const [notaSelto, setNotaSelto] = createSignal<INota>();
  const [notaEditato, setNotaEditato] = createSignal<TPlainNota>();
  // let notaSelto = () => note().filter(n => n.UUID === notaIdSelto())[0] || undefined;

  const plainSelto = () => notaSelto() ? Object.assign({plain: decrypt(notaSelto()?.contenuto || "", notaSelto()?.enc_versione)}, notaSelto()) : undefined;

  if (!isServer) {
    memo = initMemo();
    autoLogin().catch(e => console.error(e));
  }

  let cambiato = false;
  let salva = /*debounce ??*/(nota: TPlainNota) => {
    cambiato = true;
    setNotaEditato(nota);
    salvaNota(nota);
  }

  function salvaInDb() {
    let notaSelez = notaEditato();
    if (!notaSelez) {
      return;
    }
    memoSalvaInDb(notaSelez);
    cambiato = false;
  }

  function seleziona(nota: TPlainNota) {
    if (cambiato && !confirm("Salva prima di chiudere?")) {
      salvaInDb();
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
          <For each={note().sort((a,b) => b.d_time - a.d_time)}>{(nota) => 
            <NotaVoce nota={nota} onselect={() => seleziona(nota)} onpin={(pin) => {memoSalvaInDb(Object.assign(nota, {pinned: pin}))}} />
          }</For>
        </div>
        <div class="right panel">
          <Show when={plainSelto()} keyed>{(plainNota) =>
            <Nota nota={plainNota} onUpdate={val => salva(val)} onSalva={salvaInDb} />
          }</Show>
          <Show when={oauthStatus() !== "authorized"} keyed={false}>
            <button onclick={login}>Login</button>
          </Show>
        </div>
      </div>
    </main>
  );
}
