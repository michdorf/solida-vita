import { createSignal, children, JSX, onCleanup, onMount } from 'solid-js'
import styles from './dropmenu.module.css'

export default function DropdownBtn(props: {alignRight?: boolean, children?: JSX.Element}) {
    let [show, setShow] = createSignal(false);
    let slot = children(() => props.children);
    let btn: HTMLDivElement | undefined;

    function autoClose(event: MouseEvent) {
        if (event.target !== btn) {
            setShow(false);
        }
    }
    onMount(() => {
        document.body.addEventListener("click", autoClose);
    })

    onCleanup(() => {
        document.body.removeEventListener("click", autoClose);
    });

    return (
        <div ref={btn} class={styles.dropdown + (show() ? ` ${styles.open}` : '')}>
            <button class={styles.dropbtn} onClick={() => {setShow(s => !s)}}>...</button>
            <div class={styles.dropdownContent + (!!props.alignRight ? ` ${styles.rightAligned}` : '')}>
                {slot()}
            </div>
        </div>
    );
}