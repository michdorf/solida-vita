import "./index.css";
import {createEffect, createSignal, For, Show} from "solid-js";
import initMemo from "~/lib/db"; '../lib/db'
import oauthclient, { autoLogin, oauthStatus } from "~/lib/oauth";
import Memo from "~/moduli/memo/memo";
import note from "~/stores/note";
import NotaVoce from "~/components/NotaVoce";
import Nota from "~/interface/nota";
import {isServer} from "solid-js/web";

let memo: Memo;
export default function Home() {
  const [notaSelto, setNotaSelto] = createSignal<Nota>();

  if (!isServer) {
    try {
      memo = initMemo();
      autoLogin();
    } catch (e) {
      console.error(e);
    }
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
        <div class="left panel" style="overflow: auto;">
          <For each={note()}>{(nota) => <NotaVoce nota={nota} onselect={() => setNotaSelto(nota)} />}</For>
        </div>
        <div class="right panel">
          <Show when={notaSelto()}>

          </Show>
          <Show when={oauthStatus() !== "authorized"}>
            <button onclick={login}>Login</button>
          </Show>
        </div>
      </div>
    </main>
  );
}
