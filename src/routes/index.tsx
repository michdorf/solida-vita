import "./index.css";
import { For, Show } from "solid-js";
import initMemo from "~/lib/db"; '../lib/db'
import oauthclient, { autoLogin, oauthStatus } from "~/lib/oauth";
import Memo from "~/moduli/memo/memobase";
import note from "~/stores/note";

let memo: Memo;
export default function Home() {
  if (typeof window !== "undefined") {
    memo = initMemo();
  }

  autoLogin();
  function login() {
    oauthclient.authorizationCode("");
  }

  return (
    <main style="display: flex; flex-direction: column">
      <div class="header">
        <h1>Notes {note().length}</h1>
      </div>
      <div class="panel-cont">
        <div class="left panel" style="overflow: auto;">
          <For each={note()}>{(nota) => <div><b>{nota.titolo}</b></div>}</For>
        </div>
        <div class="right panel">
          <Show when={oauthStatus() !== "authorized"}>
            <button onclick={login}>Login</button>
          </Show>

          <button onclick={() => memo.riazzera()}>Reset</button>
        </div>
      </div>
    </main>
  );
}
