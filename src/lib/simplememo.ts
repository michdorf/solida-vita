// Download changes
let ult_id = 0;
let dbnome = "vita";
let url = `https://dechiffre.dk/vita/api/sinc.php?ultimo_update=${ult_id}&db=${dbnome}`;
fetch(url).then(async (response) => {
    console.log(await response.json());
});