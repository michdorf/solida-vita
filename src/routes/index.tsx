import "./index.css";
import { createSignal, For, Show} from "solid-js";
import initMemo from "~/lib/db";
import oauthclient, { autoLogin, oauthStatus } from "~/lib/oauth";
import Memo from "~/moduli/memo/memo";
import note, {salvaInDb as memoSalvaInDb, notaEditato, notaSelto, nuovaNota as nuovaNotaStore, salvaNota, setNotaEditato, setNotaSelto} from "~/stores/note";
import NotaLista from '~/components/leftpanel/note'
import QuaderniLista from '~/components/leftpanel/quaderni'
import Nota from "~/components/Nota";
import NotaT from "~/interface/nota";
import {isServer} from "solid-js/web";
import {decrypt} from "~/stores/codice";
import DropdownBtn from "~/components/dropmenu";

export type TPlainNota = NotaT & {plain?: string, nuova?: boolean}
let memo: Memo;
export default function Home() {
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

  const [mostraQuaderni, setMostraQuaderni] = createSignal(false);
  function toggleQuaderni() {
    setMostraQuaderni(b => !b);
  }

  function login() {
    oauthclient.authorizationCode("");
  }

  return (
    <main style="display: flex; flex-direction: column">
      <div id="modal"></div>
      <div class="header">
        <div style={{'position':'absolute', left: 0, top: '1rem'}}>
          <button onClick={toggleQuaderni}>Quaderni</button>
        </div>
        <h1>Notes</h1>
        <div style={{'position':'absolute', right: 0, top: '1rem'}}>
          <DropdownBtn alignRight={true}>
            <button onClick={() => memo.riazzera()}>Nulstil</button>  
          </DropdownBtn>
        </div>
      </div>
      <div class="panel-cont">
        <div class="left panel">
          <Show when={mostraQuaderni()} fallback={<NotaLista onSelected={seleziona}></NotaLista>}>
            <QuaderniLista></QuaderniLista>
          </Show>
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
