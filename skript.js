//-------------------------1. osa Ostukorv ------------------------suurendaArtikkel

"use strict";
//toote pealt vajaliku info kogumine ja lisamine ostukorvi
let korv = [];
const korviSisu = document.querySelector(".korv");
const lisaKorviNupud = document.querySelectorAll('[data-action="lisa_korvi"]');
let tarnehind = -1;
lisaKorviNupud.forEach(lisaKorviNupp => {
    lisaKorviNupp.addEventListener('click', () => {
        const toodeInfo = lisaKorviNupp.parentNode;
        const toode = {
            nimi: toodeInfo.querySelector(".toode_nimi").innerText,
            hind: toodeInfo.querySelector(".toode_hind").innerText,
            kogus: 1
        };
        const onKorvis = (korv.filter(korvArtikkel => (korvArtikkel.nimi === toode.nimi)).length > 0);
        if (!onKorvis) {
            lisaArtikkel(toode); // selle funktsiooni loome allpool
            korv.push(toode);
            nupuOhjamine(lisaKorviNupp, toode); // selle funktsiooni loome allpool
        }
        ostukorviSumma(korv);
    });
});

//funktsioon toote lisamiseks
function lisaArtikkel(toode) {
    korviSisu.insertAdjacentHTML('beforeend', `
    <div class="korv_artikkel">
      <h3 class="korv_artikkel_nimi">${toode.nimi}</h3>
      <h3 class="korv_artikkel_hind">${toode.hind}</h3>    
      <div class="korv_artikkel_buttons">  
      <button class="btn-small" data-action="vahenda_artikkel">&minus;</button>
      <h3 class="korv_artikkel_kogus">${toode.kogus}</h3>
      <button class="btn btn-small" data-action="suurenda_artikkel">&plus;</button>
      <button class="btn btn-small" data-action="eemalda_artikkel">&times;</button>
      </div>
    </div>
  `);

    lisaKorviJalus(); // selle funktsiooni lisame allpool
}

//funktsioon nupu sündmusekuulutaja jaoks
function nupuOhjamine(lisaKorviNupp, toode) {
    lisaKorviNupp.innerText = 'Ostukorvis';
    lisaKorviNupp.disabled = true;

    const korvArtiklidD = korviSisu.querySelectorAll('.korv_artikkel');
    korvArtiklidD.forEach(korvArtikkelD => {
        if (korvArtikkelD.querySelector('.korv_artikkel_nimi').innerText === toode.nimi) {
            korvArtikkelD.querySelector('[data-action="suurenda_artikkel"]').addEventListener('click', () => suurendaArtikkel(toode, korvArtikkelD));
            korvArtikkelD.querySelector('[data-action="vahenda_artikkel"]').addEventListener('click', () => vahendaArtikkel(toode, korvArtikkelD));
            korvArtikkelD.querySelector('[data-action="eemalda_artikkel"]').addEventListener('click', () => eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp));
        }
    });
}

//toodete arvu suurendamine
function suurendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi) {
            //korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = ++korvArtikkel.kogus;
            toode.kogus += 1;
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = toode.kogus;
        }
    });
    ostukorviSumma(korv);
}

//Ülesanne 5.1: lisa funktsioon toodete hulga vähendamiseks.
function vahendaArtikkel(toode, korvArtikkelD) {
    korv.forEach(korvArtikkel => {
        if (korvArtikkel.nimi === toode.nimi && korvArtikkel.kogus > 1) {
            toode.kogus -= 1;
            korvArtikkelD.querySelector('.korv_artikkel_kogus').innerText = korvArtikkel.kogus;
        }
    });
    ostukorviSumma(korv);
}

//toodete eemaldamine ostukorvist
function eemaldaArtikkel(toode, korvArtikkelD, lisaKorviNupp) {
    korvArtikkelD.remove();
    korv = korv.filter(korvArtikkel => korvArtikkel.nimi !== toode.nimi);
    lisaKorviNupp.innerText = 'Lisa ostukorvi';
    lisaKorviNupp.disabled = false;
    if (korv.length < 1) {
        document.querySelector('.korv-jalus').remove();
    }
    ostukorviSumma(korv);
}

//ostukorvi jaluse ehk alumiste nuppude lisamine
function lisaKorviJalus() {
    if (document.querySelector('.korv-jalus') === null) {
        korviSisu.insertAdjacentHTML('afterend', `
      <div class="korv-jalus">
        <h2 id="hinna-tekst"></h2>
        <button class="btn" data-action="tyhjenda_korv">Tühjenda ostukorv</button>
        <button class="btn" data-action="kassa">Maksma</button>
      </div>
    `);
        document.querySelector('[data-action="tyhjenda_korv"]').addEventListener('click', () => tuhjendaKorv());
        document.querySelector('[data-action="kassa"]').addEventListener('click', () => alustaTaimer(60*2, document.getElementById("taimeri-tekst"), document.getElementById("time") ) );
    }
}

// ostukorvi tühjendamine
function tuhjendaKorv() {
    korviSisu.querySelectorAll('.korv_artikkel').forEach(korvArtikkelD => {
        korvArtikkelD.remove();
        korv = [];
    });

    document.querySelector('.korv-jalus').remove();

    lisaKorviNupud.forEach(lisaKorviNupp => {
        lisaKorviNupp.innerText = 'Lisa ostukorvi';
        lisaKorviNupp.disabled = false;
    });
    ostukorviSumma(korv);
}


//Ülesanne 5.2: lisa funktsioon, mis arvutab ostukorvi summa kokku.
function ostukorviSumma(tooted) {
    let tulemus = 0;
    korv.forEach(toode => {
        tulemus += toode.hind * toode.kogus;
    })
    const hinnaTekst = document.getElementById("hinna-tekst");
    if (tulemus > 0) {
        hinnaTekst.style.display = "block";
        hinnaTekst.innerHTML = "Kogu hind: " + tulemus + " €";
    }
    if (tarnehind >= 0 && korv.length > 0) {
        document.getElementById("hindTarnega").innerHTML = "Kogu hind koos tarnega: " + (tulemus + tarnehind) + " €";
    } else {
        document.getElementById("hindTarnega").innerHTML = "";
    }
}

//-------------------------2. osa Taimer ------------------------

//taimer
function alustaTaimer(kestvus, kuvaTekst, kuvaAeg) {
    let start = Date.now(),
        vahe,
        minutid,
        sekundid;

    let intervID;
    kuvaTekst.style.display = "block";

    function taimer() {
        let vahe = kestvus - Math.floor((Date.now() - start) / 1000);

        let minutid = Math.floor(vahe / 60);
        let sekundid = Math.floor(vahe % 60);

        if (minutid < 10) {
            minutid = "0" + minutid;
        }
        if (sekundid < 10) {
            sekundid = "0" + sekundid;
        }

        kuvaAeg.textContent = minutid + ":" + sekundid;

        if (vahe < 0) {
            clearInterval(intervID);
            document.getElementById("time").innerHTML = "alusta uuesti";
        }
    };
    
    taimer();
    intervID = setInterval(taimer, 1000);
    clearInterval(intervID-1);

};

window.onload = function () {
    
};


//-------------------------3. osa Tarne vorm ------------------------

const form = document.querySelector("form");
const eesnimi = document.getElementById("eesnimi");
const perenimi = document.getElementById("perenimi");
const telefon = document.getElementById("telefon");
const kinnitus = document.getElementById("kinnitus");
const aadress = document.getElementById("aadress");

const tarneValik1 = document.getElementById("tarne1");
const tarneValik2 = document.getElementById("tarne2");

const errorMessage = document.getElementById("errorMessage");
const edukaltTaidetud = document.getElementById("vormEduTekst");

const nimeKontroll = /^[a-zA-Zà-žÀ-Ž\s]+$/;
const telefKontroll = /^[0-9]{6,15}$/;
const aadrKontroll = /^[a-zA-Zà-žÀ-Ž\s]+\s[0-9]{1,3}\-[0-9]{1,3},[a-zA-Zà-žÀ-Ž\s\-]+$/;

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errors = [];

    if (eesnimi.value.trim() === "") {
        errors.push("Sisesta eesnimi")
    } else if ( !(nimeKontroll.test(eesnimi.value)) ) {
        errors.push("Sisesta eesnimi korrektselt");
    }

    if (perenimi.value.trim() === "") {
        errors.push("Sisesta perenimi")
    } else if ( !(nimeKontroll.test(perenimi.value)) ) {
        errors.push("Sisesta perenimi korrektselt");
    }
    
    if (telefon.value.trim() === "") {
        errors.push("Sisesta telefon")
    } else if ( telefon.value.length < 6 ) {
        errors.push("Telefoninumber ei tohi olla lühem kui 6 sümbolit");
    } else if ( !(telefKontroll.test(telefon.value)) ) {
        errors.push("Telefon peab koosnema ainult numbritest");
    }

    // Minu kood - ül 5.3
    if (aadress.value.trim() === "") {
        errors.push("Sisesta aadress")
    } else if ( !(aadrKontroll.test(aadress.value)) ) {
        errors.push("Sisesta aadress formaadis Tänav Maja-Korter, Linn (näiteks Kooli 1-1, Pärnu)");
    }

    if (!kinnitus.checked) {
        errors.push("Palun nõustu tingimustega");
    }

    if ( !(tarneValik1.checked || tarneValik2.checked) ) {
        errors.push("Palun vali tarneviis");
    }

    if (errors.length > 0) {
        e.preventDefault();
        errorMessage.innerHTML = errors.join('<br>');
        edukaltTaidetud.innerHTML = "";
    }
    else {
        errorMessage.innerHTML = "";
        edukaltTaidetud.innerHTML = "Info on sisestatud korrektselt";
    }

})

function hindKoosTarnega(uusTarneHind) {
    tarnehind = uusTarneHind;
    ostukorviSumma(korv);
}


/* Ülesanne 5.3: täienda vormi sisendi kontrolli:
- eesnime ja perenime väljal ei tohi olla numbreid;
- telefoni väli ei tohi olla lühem kui 6 sümbolit ning peab sisaldama ainult numbreid;
- üks raadionuppudest peab olema valitud;
- lisa oma valikul üks lisaväli ning sellele kontroll. Märgi see nii HTML kui JavaScripti
  koodis "minu kood" kommentaariga. */



