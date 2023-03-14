import "./index.css";
import { Show } from "solid-js";
import initMemo from "~/lib/db"; '../lib/db'
import oauthclient, { autoLogin, oauthStatus } from "~/lib/oauth";
import Memo from "~/moduli/memo/memobase";

let memo: Memo;
if (typeof window !== "undefined") {
  memo = initMemo();
}
export default function Home() {
  console.log(memo);

  autoLogin();
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
        </div>
        <div class="right panel">
          <Show when={oauthStatus() !== "authorized"}>
            <button onclick={login}>Login</button>
          </Show>
        </div>
      </div>
    </main>
  );
}
