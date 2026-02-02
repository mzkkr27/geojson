// =======================
// KONFIG
// =======================
const TAHUN = 2022;
const view = { center: [5.18, 97.14], zoom: 12 };

// =======================
// MAP
// =======================
const map = L.map('map', { zoomControl: false })
  .setView(view.center, view.zoom);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// =======================
// DATA SEKOLAH (SDN)
// =======================
const dataSekolah = [
  { nama:"SDN 13 Banda Sakti", kec:"BANDA SAKTI", lat:5.191114611819906, lng: 97.14462703941624, link:"https://maps.app.goo.gl/hHTf4rVBGACyq5UY7" },
  { nama:"SDN 1 Banda Sakti", kec:"BANDA SAKTI", lat:5.180066230351357, lng: 97.15002107380735, link:"https://maps.app.goo.gl/vViYQqwfVZvRBGQo8" },
  { nama:"SDN 3 Banda Sakti", kec:"BANDA SAKTI", lat:5.181662584848781, lng: 97.14926451111033, link:"https://maps.app.goo.gl/r5VF9L2YbCEGdwC96" },
  { nama:"SDN 4 Banda Sakti", kec:"BANDA SAKTI", lat:5.182090759761694, lng: 97.14845021587398, link:"https://maps.app.goo.gl/M4krDb3ra5Fc1UU36" },
  { nama:"SDN 21 Banda Sakti", kec:"BANDA SAKTI", lat:5.193874886995566, lng: 97.140938468765, link:"https://maps.app.goo.gl/S1fW8cqpezM7CpDB9" },
  { nama:"SD IT Bunayya Lhokseumawe", kec:"BANDA SAKTI", lat:5.1948384476870055, lng: 97.12933973992942, link:"https://maps.app.goo.gl/QkAsk3HZ7MPRb9ym7" },
  { nama:"SDN 12 Muara Dua", kec:"MUARA DUA", lat:5.139454842661477, lng: 97.14546399280172, link:"https://maps.app.goo.gl/yhFHhE8t4DnZVZQU8" },
  { nama:"SDN 3 Muara Dua", kec:"MUARA DUA", lat:5.172799562273667, lng: 97.12997906636555, link:"https://maps.app.goo.gl/gPfBVmgHgMj3Kkfx9" },
  { nama:"SDN 6 Muara Dua", kec:"MUARA DUA", lat:5.136797343220887, lng: 97.14807750687683, link:"https://maps.app.goo.gl/MaprUNTjMGP8jCjZ8" },
  { nama:"SDN 14 Muara Dua", kec:"MUARA DUA", lat:5.177747831056718, lng: 97.11545685264682, link:"https://maps.app.goo.gl/beN2d2iMo1kxRTc9A" },
  { nama:"SDN 5 Blang Mangat", kec:"BLANG MANGAT", lat:5.1388079428500175, lng: 97.16386189946994, link:"https://maps.app.goo.gl/AvvCkh4dXzwDqtGj8" },
  { nama:"SDN 10 Blang Mangat", kec:"BLANG MANGAT", lat:5.1182955490369935, lng: 97.11848154547637, link:"https://maps.app.goo.gl/hazSN23TL62u51To9" },
  { nama:"SDN 11 Blang Mangat", kec:"BLANG MANGAT", lat:5.160063938920395, lng: 97.08943684179803, link:"https://maps.app.goo.gl/wdgMFnpazGbNLKbM7" },
  { nama:"SDN 2 Muara Satu", kec:"MUARA SATU", lat:5.227562542153415,lng: 97.04294341020008, link:"https://maps.app.goo.gl/mKUQQ8L7JbXFvEDYA" },
  { nama:"SDN 4 Muara Satu", kec:"MUARA SATU", lat:5.213593042380779, lng: 97.06377241479181, link:"https://maps.app.goo.gl/AnNpuCfTZDTXNqGC6" },
  { nama:"SDN 7 Muara Satu", kec:"MUARA SATU", lat:5.187829397767164, lng: 97.08384774867486, link:"https://maps.app.goo.gl/rmqCryhE9KpQMYzeA" }
];

// tombol + -
L.control.zoom({ position: 'topleft' }).addTo(map);

// =======================
// STATE
// =======================
let geoLayer;
let datasetAktif = "penduduk";
let dataMap = {};
let sekolahLayer = L.layerGroup().addTo(map);

// =======================
// UTIL
// =======================
const format = n => n.toLocaleString("id-ID");

// =======================
// WARNA (SATU SUMBER)
// =======================
function getColor(v) {

  // =====================
  // JUMLAH PENDUDUK
  // =====================
  if (datasetAktif === "penduduk") {
    return v > 90000 ? "#7f0000" :
           v > 50000 ? "#b30000" :
           v > 30000 ? "#d7301f" :
           v > 20000 ? "#fc8d59" :
           v > 2000  ? "#f8af73" :
           v > 1000  ? "#ffd1ae" :
                        "#ffffff";
  }

  // =====================
  // LAKI-LAKI
  // =====================
  if (datasetAktif === "laki") {
    return v > 60000 ? "#08306b" :
           v > 40000 ? "#08519c" :
           v > 25000 ? "#2171b5" :
           v > 15000 ? "#4292c6" :
           v > 5000  ? "#6baed6" :
           v > 1000  ? "#bdd7e7" :
                        "#eff3ff";
  }

  // =====================
  // PEREMPUAN
  // =====================
  if (datasetAktif === "perempuan") {
    return v > 60000 ? "#4a1486" :
           v > 40000 ? "#6a1b9a" :
           v > 25000 ? "#7b1fa2" :
           v > 15000 ? "#9c27b0" :
           v > 5000  ? "#ba68c8" :
           v > 1000  ? "#e1bee7" :
                        "#f3e5f5";
  }

  // =====================
  // KEPADATAN
  // =====================
  if (datasetAktif === "kepadatan") {
    return v > 3000 ? "#00441b" :
           v > 2000 ? "#006d2c" :
           v > 1500 ? "#238b45" :
           v > 1000 ? "#41ab5d" :
           v > 500  ? "#74c476" :
           v > 100  ? "#bae4b3" :
                        "#edf8e9";
  }

  return "#ffffff";
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.value),
    weight: 1,
    color: "#333",
    fillOpacity: 0.7
  };
}

// =======================
// POPUP
// =======================
function onEachFeature(feature, layer) {
  layer.bindPopup(`
    <b>${feature.properties.NAME_3}</b><br>
    <b>${datasetAktif.toUpperCase()}:</b>
    ${format(feature.properties.value)} jiwa<br>
    <small>Tahun ${TAHUN}</small>
  `);
}

// =======================
// GEOJSON
// =======================
async function loadGeo() {
  if (geoLayer) map.removeLayer(geoLayer);

  const res = await fetch("lhokseumawe.geojson");
  const geo = await res.json();

  geo.features.forEach(f => {
    const nama = f.properties.NAME_3.trim().toUpperCase();
    f.properties.value = dataMap[nama] || 0;
  });

  geoLayer = L.geoJSON(geo, {
    style,
    onEachFeature
  }).addTo(map);
}

// =======================
// DATA
// =======================
async function loadData() {
  const resource = {
    penduduk: "926144dc-92c2-4b56-8daa-ff71a0857e13",
    laki: "41ea73a3-01e5-4ad0-a5bf-5eb8d4758aff",
    perempuan: "3cb7b40c-fe89-480a-9373-a29f8c68823d",
    kepadatan: "135717de-7392-48d4-b509-6f120cf6380d"
  };

  const res = await fetch(
    `https://data.lhokseumawekota.go.id/api/3/action/datastore_search?resource_id=${resource[datasetAktif]}`
  );
  const json = await res.json();

  dataMap = {};
  json.result.records.forEach(r => {
    const kec = r.kemendagri_Nama_kecamatan.trim().toUpperCase();
    const nilai = Number(r.jumlah_penduduk || r.jumlah || 0);
    dataMap[kec] = (dataMap[kec] || 0) + nilai;
  });

  loadGeo();
  updateLegend();
}

// =======================
// LEGEND (AUTO WARNA)
// =======================
const legend = L.control({ position: 'bottomright' });

legend.onAdd = () => L.DomUtil.create("div", "legend");
legend.addTo(map);

function buildLegend() {
  if (datasetAktif === "kepadatan") return "";

  const grades = [0, 20000, 30000, 50000, 90000];
  let html = `<b>${datasetAktif.toUpperCase()}</b><br><br>`;

  grades.forEach((g, i) => {
    const to = grades[i + 1];
    html += `
      <div class="legend-item">
        <div class="legend-color" style="background:${getColor(g + 1)}"></div>
        ${format(g)}${to ? " – " + format(to) : "+"}
      </div>`;
  });

  return html;
}

function updateLegend() {
  legend.getContainer().innerHTML = buildLegend();
}

function loadSekolah() {
  sekolahLayer.clearLayers();

  dataSekolah.forEach(s => {
    const marker = L.marker([s.lat, s.lng]).bindPopup(`
      <b>${s.nama}</b><br>
      Kecamatan: ${s.kec}<br><br>
      <a href="${s.link}" target="_blank"
         style="display:inline-block;padding:6px 10px;
                background:#1a73e8;color:white;
                border-radius:6px;text-decoration:none">
        📍 Buka di Google Maps
      </a>
    `);

    sekolahLayer.addLayer(marker);
  });
}

// =======================
// SWITCH DATASET
// =======================
function setDataset(d) {
  datasetAktif = d;
  map.flyTo(view.center, view.zoom, {
    animate: true,
    duration: 0.7
  });

  loadData();
}

// =======================
// INIT
// =======================
loadData();
loadSekolah();
