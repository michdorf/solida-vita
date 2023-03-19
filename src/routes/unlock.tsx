import {setCodice} from "~/stores/codice";
import {useNavigate} from "@solidjs/router";

export default function () {

    let navigate = useNavigate();
    function submit(input: HTMLInputElement) {
        setCodice(input.value);
        navigate("/");
    }

    return (
            <div style={{display: "flex", "flex-direction":"row",
                "align-items": "center",
                height: "100vh",
                width: "100vw",
                "text-align": "center"
            }}>
                <form method="post" style={{flex:1}} onsubmit={ev => {ev.preventDefault(); return false;}}>
                    <input type="password" name="codice" style={{"font-size": "3rem"}} onchange={ev => submit(ev.currentTarget)} />
                </form>
            </div>
    )
}