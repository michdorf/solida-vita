import {setCodice} from "~/stores/codice";
import {useNavigate} from "@solidjs/router";

export default function () {

    let navigate = useNavigate();
    function submit(form: HTMLFormElement) {
        setCodice((form.children[0] as HTMLInputElement).value);
        navigate("/");
    }

    return (
            <div style={{display: "flex", "flex-direction":"row",
                "align-items": "center",
                height: "100vh",
                width: "100vw",
                "text-align": "center"
            }}>
                <form style={{flex:1}} onsubmit={ev => {submit(ev.currentTarget); ev.preventDefault();}}>
                    <input type="password" name="codice" style={{"font-size": "3rem"}} />
                </form>
            </div>
    )
}