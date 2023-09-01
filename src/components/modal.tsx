import { ParentProps, Show, createEffect } from "solid-js";
import { Portal } from "solid-js/web";

export default function Modal(props: ParentProps & {show: boolean}) {
    const modal = document.getElementById("modal");
    createEffect(() => {
        if (modal) {
            modal.style.display = props.show ? "block" : "none";
        }
    });

    return (
        <Show when={modal}>
        <Portal mount={document.getElementById("modal")!}>
            {props.children}
        </Portal>
        </Show>
    );
}