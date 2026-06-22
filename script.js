let fishPos = 150;
let state = "idle";

let rodPos = 150;
let holding = false;

let progress = 1;
let ini_mancing = false;
let max_kg = 1000000000;
let ikan_di_masa_depan = null;
let berat_ikan = null;
let uang = 0;

["touchstart","mousedown"].forEach(e =>
  document.addEventListener(e, () => holding = true)
);

["touchend","mouseup","touchcancel"].forEach(e =>
  document.addEventListener(e, () => holding = false)
);


function proses(){
  mancing()
  gerak()
  if (ini_mancing) {
    document.getElementById("fish").style.display = 'block';
    document.getElementById("bar").style.display = 'block'
    document.getElementById("rod").style.display = 'block';
    document.getElementById("start").style.display = 'none'
  }
  else {
      document.getElementById("fish").style.display = 'none';
    document.getElementById("bar").style.display = 'none'
    document.getElementById("rod").style.display = 'none'
    document.getElementById("start").style.display = 'block'
  }
}
setInterval(proses, 16);
// 🎲 random state tiap 1 detik
setInterval(randomState, 1000);

function randomState() {
    let r = Math.random();

    if (r < 0.3) state = "idle";
    else if (r < 0.65) state = "left";
    else state = "right";
}

function gerak() {
  if (!ikan_di_masa_depan) {
    return;
  }
  let ikan = ikan_di_masa_depan;
  let speed = ikan.kekuatan
    if (state == "left") {
        fishPos -= speed;
    }
    else if (state == "right") {
        fishPos += speed;
    }
    // idle = diam

    // batas layar
    if (fishPos < 0) fishPos = 0;
    if (fishPos > 240) fishPos = 240;
}

function mancing() {
  if (!ini_mancing || !ikan_di_masa_depan) {
    return
  }
  
  let ikan = ikan_di_masa_depan;
  let bonus_progres_dengan_perhitungan_mtk = 1.0 * ikan.progres
    

    // 🔴 rod
    if (holding) rodPos += 3;
    else rodPos -= 3;

    if (rodPos < 0) rodPos = 0;
    if (rodPos > 300) rodPos = 300;

    // 🎯 overlap
    let ikan_control = ikan.control;
  if (
    rodPos >= fishPos &&
    rodPos <= fishPos + ikan_control
  ) {
        progress += bonus_progres_dengan_perhitungan_mtk;
        document.getElementById("fish").style.backgroundColor = 'blue';
    } else {
        progress -= 0.1;
        document.getElementById("fish").style.backgroundColor = 'green';
    }

    if (progress < -10) {
      document.getElementById("bar").style.backgroundColor = '#BC0000FF';
    } else {
      document.getElementById("bar").style.backgroundColor = '#444';
    }
    if (progress < -30) {
      ini_mancing = false;
      alert("Ikan kabur!");
      ikan_di_masa_depan = null;
    }
    if (progress > 100) {
      ini_mancing = false;
      let harga = berat_ikan * 10;
      uang += harga
      document.getElementById("uang").innerText = uang.toLocaleString();
      alert(`dapet ikan: ${ikan.nama}  `+
      `berat ikan: ${berat_ikan} kg   `+
      `ikan ter jual di harga: ${harga} uang`
      );
    }

    // render
    document.getElementById("fish").style.left = fishPos + "px";
    document.getElementById("rod").style.left = rodPos + "px";
    document.getElementById("progress").innerText = progress;
}
async function cek_mancing() {
  progress = 0;
  rodPos = -1;
  fishPos = -1;
  ikan_di_masa_depan = dapet_ikan();
  notif_kelangkaan(ikan_di_masa_depan.kelangkaan)
  berat_ikan = random_berat_ikan(ikan_di_masa_depan)
  document.getElementById("fish").style.width =
    ikan_di_masa_depan.control + "px";
  await delay(1000)
  ini_mancing = true;
}
function dapet_ikan() {
    let list =
        dapettin_ikan_sesuai_kg(max_kg);
    return list[
        Math.floor(
            Math.random() * list.length
        )
    ];
}
function dapettin_ikan_sesuai_kg(rodKg) {
    let tersedia = [];
    for (let id in fish_DB.item_db) {
        let ikan = fish_DB.item_db[id];
        if (ikan.min_kg <= rodKg) {
            tersedia.push(ikan);
        }
    }

    return tersedia;
}
function notif_kelangkaan(kelangkaan) {
  let notif = document.getElementById("notif");
  notif.src = `asset/warning notif/${kelangkaan}.png`;
  notif.classList.remove("hidden");
  setTimeout(() => {
    notif.classList.add("hidden")
  }, 1000);
}
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function random_berat_ikan(ikan) {
  return Math.floor(
    Math.random() * (max_kg - ikan.min_kg + 1)
  ) + ikan.min_kg;
}
