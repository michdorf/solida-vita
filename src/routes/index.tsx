import "./index.css";
import { createSignal } from "solid-js";
import '../lib/simplememo'
import memo from '../lib/db'

export default function Home() {
  const [feedInx, setFeedInx] = createSignal(1);

  console.log(memo);

  return (
    <main style="display: flex; flex-direction: column">
      <div class="header">
        <h1>Notes</h1>
      </div>
      <div class="panel-cont">
        <div class="left panel" style="overflow: auto;">
        </div>
        <div class="right panel">
          
        </div>
      </div>
    </main>
  );
}
