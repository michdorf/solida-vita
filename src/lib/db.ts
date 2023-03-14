// declare let Memo: any;
import Memo from "../moduli/memo/memo"

let memo;
if (typeof window !== "undefined") {
    debugger;
    memo = new Memo("vita", ["note"], [["d_time","cambiato"]]);
    memo.sinc.endpoint = "/vita/api/sinc.php";
    memo.suPronto(() => {
        console.log("Klar");
    });
}
export default memo;
