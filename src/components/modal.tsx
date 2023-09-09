import { JSX, ParentComponent, ParentProps, Setter, Show, createEffect, createSignal, onMount } from "solid-js";
import styles from './modal.module.css';

export default function Modal(props: ParentProps & {show: boolean, onHide: () => void}) {
    return (
        <Show when={props.show}>
        <div class={styles.modal}>
            <button onClick={props.onHide}>Luk</button>
            {props.children}
        </div>
        </Show>
    );
}