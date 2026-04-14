
// ── GEOJSON ZONE OMI (Comune di Genova – 81 zone, EPSG:4326) ──────────────────
// GEOJSON_ZONE viene caricato dinamicamente da zones.geojson
let GEOJSON_ZONE = null;
// Point-in-polygon (ray casting)
function pipPolygon(lon, lat, rings) {
  let inside = false;
  for (const ring of rings) {
    const n = ring.length;
    let j = n - 1;
    for (let i = 0; i < n; i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi)
        inside = !inside;
      j = i;
    }
  }
  return inside;
}

async function trovaZonaGeoAsync(lon, lat) {
  const geojson = await loadGeoJSON();
  // Fallback per zone mancanti (C05A, C13A, C20A, D41A non sono nel dataset OMI)
  const FALLBACK = { 'C05A':'C05', 'C13A':'C13', 'C20A':'C20', 'D41A':'D41' };
  for (const f of geojson.features) {
    const g = f.geometry, z = f.properties.z;
    if (g.type === 'Polygon') {
      if (pipPolygon(lon, lat, g.coordinates)) return { zona: z, exact: true };
    } else if (g.type === 'MultiPolygon') {
      for (const poly of g.coordinates)
        if (pipPolygon(lon, lat, poly)) return { zona: z, exact: true };
    }
  }
  return null;
}

// Quotazioni OMI ufficiali — AdE 2° semestre 2025 — Abitazioni civili NORMALE
const OMI_VALORI = {"B01": {"aq_min": 2050, "aq_max": 3000, "lc_min": 8.6, "lc_max": 12.8}, "B02": {"aq_min": 2250, "aq_max": 3300, "lc_min": 7.2, "lc_max": 10.7}, "B05": {"aq_min": 2250, "aq_max": 3300, "lc_min": 7.9, "lc_max": 11.7}, "B06": {"aq_min": 2000, "aq_max": 2950, "lc_min": 8.3, "lc_max": 12.3}, "B7": {"aq_min": 1750, "aq_max": 2600, "lc_min": 8.1, "lc_max": 12.1}, "B8": {"aq_min": 2100, "aq_max": 3100, "lc_min": 8.2, "lc_max": 12.2}, "C01": {"aq_min": 1400, "aq_max": 2050, "lc_min": 6.7, "lc_max": 9.9}, "C02": {"aq_min": 1350, "aq_max": 1950, "lc_min": 5.9, "lc_max": 8.8}, "C03": {"aq_min": 1250, "aq_max": 1850, "lc_min": 5.6, "lc_max": 8.2}, "C04": {"aq_min": 1450, "aq_max": 2150, "lc_min": 6.1, "lc_max": 9.0}, "C05": {"aq_min": 1700, "aq_max": 2500, "lc_min": 6.5, "lc_max": 9.6}, "C06": {"aq_min": 2500, "aq_max": 3700, "lc_min": 7.5, "lc_max": 11.1}, "C09": {"aq_min": 1350, "aq_max": 2000, "lc_min": 6.4, "lc_max": 9.5}, "C11": {"aq_min": 1950, "aq_max": 2900, "lc_min": 6.7, "lc_max": 9.9}, "C12": {"aq_min": 1600, "aq_max": 2350, "lc_min": 6.0, "lc_max": 8.9}, "C13": {"aq_min": 1600, "aq_max": 2350, "lc_min": 5.9, "lc_max": 8.8}, "C14": {"aq_min": 1400, "aq_max": 2050, "lc_min": 5.7, "lc_max": 8.4}, "C15": {"aq_min": 1250, "aq_max": 1850, "lc_min": 5.5, "lc_max": 8.1}, "C16": {"aq_min": 1000, "aq_max": 1450, "lc_min": 5.4, "lc_max": 8.0}, "C17": {"aq_min": 1250, "aq_max": 1850, "lc_min": 5.4, "lc_max": 8.0}, "C19": {"aq_min": 1300, "aq_max": 1900, "lc_min": 5.9, "lc_max": 8.8}, "C20": {"aq_min": 1200, "aq_max": 1750, "lc_min": 5.4, "lc_max": 8.0}, "C21": {"aq_min": 770, "aq_max": 1150, "lc_min": 4.9, "lc_max": 7.3}, "C22": {"aq_min": 710, "aq_max": 1050, "lc_min": 5.1, "lc_max": 7.5}, "C23": {"aq_min": 660, "aq_max": 980, "lc_min": 5.5, "lc_max": 8.1}, "D01": {"aq_min": 1250, "aq_max": 1850, "lc_min": 5.7, "lc_max": 8.4}, "D03": {"aq_min": 1150, "aq_max": 1700, "lc_min": 5.3, "lc_max": 7.9}, "D04": {"aq_min": 1200, "aq_max": 1750, "lc_min": 5.6, "lc_max": 8.3}, "D06": {"aq_min": 1150, "aq_max": 1700, "lc_min": 5.3, "lc_max": 7.8}, "D07": {"aq_min": 1400, "aq_max": 2050, "lc_min": 5.2, "lc_max": 7.5}, "D08": {"aq_min": 1250, "aq_max": 1850, "lc_min": 5.1, "lc_max": 7.6}, "D09": {"aq_min": 1450, "aq_max": 2150, "lc_min": 5.2, "lc_max": 7.5}, "D10": {"aq_min": 1400, "aq_max": 2050, "lc_min": 6.5, "lc_max": 9.7}, "D11": {"aq_min": 1050, "aq_max": 1550, "lc_min": 5.2, "lc_max": 7.7}, "D12": {"aq_min": 1400, "aq_max": 2050, "lc_min": 5.4, "lc_max": 7.8}, "D13": {"aq_min": 1200, "aq_max": 1750, "lc_min": 5.3, "lc_max": 7.9}, "D14": {"aq_min": 1300, "aq_max": 1900, "lc_min": 6.0, "lc_max": 8.7}, "D16": {"aq_min": 1650, "aq_max": 2400, "lc_min": 6.7, "lc_max": 9.9}, "D17": {"aq_min": 1700, "aq_max": 2500, "lc_min": 6.3, "lc_max": 9.4}, "D18": {"aq_min": 2050, "aq_max": 3000, "lc_min": 7.1, "lc_max": 10.5}, "D20": {"aq_min": 2300, "aq_max": 3400, "lc_min": 7.0, "lc_max": 10.4}, "D21": {"aq_min": 2050, "aq_max": 2950, "lc_min": 6.0, "lc_max": 8.8}, "D22": {"aq_min": 2750, "aq_max": 4100, "lc_min": 8.9, "lc_max": 13.3}, "D23": {"aq_min": 950, "aq_max": 1400, "lc_min": 5.5, "lc_max": 8.0}, "D24": {"aq_min": 2750, "aq_max": 4100, "lc_min": 8.4, "lc_max": 12.5}, "D25": {"aq_min": 920, "aq_max": 1350, "lc_min": 4.7, "lc_max": 7.0}, "D26": {"aq_min": 920, "aq_max": 1350, "lc_min": 4.9, "lc_max": 7.3}, "D27": {"aq_min": 1150, "aq_max": 1700, "lc_min": 4.6, "lc_max": 6.8}, "D30": {"aq_min": 1050, "aq_max": 1550, "lc_min": 4.9, "lc_max": 7.2}, "D31": {"aq_min": 1400, "aq_max": 2050, "lc_min": 5.9, "lc_max": 8.7}, "D33": {"aq_min": 1900, "aq_max": 2800, "lc_min": 6.4, "lc_max": 9.5}, "D34": {"aq_min": 1350, "aq_max": 2000, "lc_min": 5.5, "lc_max": 8.1}, "D35": {"aq_min": 1400, "aq_max": 2050, "lc_min": 5.5, "lc_max": 8.1}, "D37": {"aq_min": 1350, "aq_max": 1950, "lc_min": 5.8, "lc_max": 8.2}, "D38": {"aq_min": 1400, "aq_max": 2050, "lc_min": 6.0, "lc_max": 8.6}, "D40": {"aq_min": 1450, "aq_max": 2150, "lc_min": 6.0, "lc_max": 8.9}, "D41": {"aq_min": 1750, "aq_max": 2600, "lc_min": 5.5, "lc_max": 8.1}, "D42": {"aq_min": 1650, "aq_max": 2450, "lc_min": 5.7, "lc_max": 8.5}, "D43": {"aq_min": 1250, "aq_max": 1850, "lc_min": 5.4, "lc_max": 8.0}, "D44": {"aq_min": 840, "aq_max": 1250, "lc_min": 5.1, "lc_max": 7.5}, "D45": {"aq_min": 1150, "aq_max": 1700, "lc_min": 5.5, "lc_max": 8.1}, "D47": {"aq_min": 1150, "aq_max": 1700, "lc_min": 4.9, "lc_max": 7.2}, "D49": {"aq_min": 910, "aq_max": 1350, "lc_min": 5.6, "lc_max": 8.2}, "E1": {"aq_min": 1150, "aq_max": 1700, "lc_min": 4.4, "lc_max": 6.2}, "R2": {"aq_min": 1350, "aq_max": 2000, "lc_min": 4.6, "lc_max": 6.5}};
const OMI_DESC = {"B01": "Centro Portoria Ad.A", "B02": "Carignano Tu.A", "B05": "Porto Antico-Darsena Tu.A", "B06": "Molo-Sarzano Ts.M", "B7": "Pre' - Maddalena Ts.B", "B8": "Garibaldi Ts.A", "C01": "Principe-Castelletto Tu.M", "C02": "S.Fruttuoso Tu.M", "C03": "Marassi Tu.M", "C04": "S.Martino - Gastaldi Tu.M", "C05": "Sturla Tu.M", "C06": "Albaro - Boccadasse Tu.A", "C09": "Via Canevari - Borgo Incrociati - Corso Montegrappa Tu.B", "C11": "Foce  Tu.A", "C12": "Foce Montevideo Tu.M", "C13": "Manin-S.Nicola-Castelletto Tu.A", "C14": "S.Teodoro Tu.M", "C15": "Angeli-Venezia Tu.B", "C16": "Lagaccio Tu.B", "C17": "Oregina Tu.M", "C18": "Porto Ap.A", "C19": "S.Benigno Ad.A", "C20": "Via Montaldo Tu.M", "C21": "Rolando-Fillak Tu.M", "C22": "Cantore Tu.A", "C23": "Buranello-Sampierdarena Ts.M", "C24": "Fiumara-Eridania-Ansaldo Ad.M", "D01": "Quezzi-Fereggiano Fv.M", "D02": "Bavari Aab.M", "D03": "Molassana Tu.M", "D04": "Parenzo-Ginestre-Vecchia Tu.B", "D05": "Gavette-Trensasco-Cimitero Di Staglieno Aab.A", "D06": "Volpara-Montesignano-Terpi Ap.B", "D07": "Pino Soprano E Sottano Aab.M", "D08": "Cartagenova-Valle Geirato Aab.M", "D09": "S.Martino Di Struppa-S.Siro-S.Cosimo-Aggio-Creto Aab.M", "D10": "Struppa-Prato-Doria-Giro Del Fullo Tu.M", "D11": "Sponda Sinistra Alta Val Bisagno Fv.M", "D12": "S.Eusebio Tu.M", "D13": "Alta Valle Sturla Fv.M", "D14": "S.Fruttuoso Alta Aab.A", "D15": "Biscione Tu.B", "D16": "Borgoratti Tu.M", "D17": "Apparizione Aab.A", "D18": "Quarto Alta Tu.M", "D20": "Quarto-Quinto Tu.A", "D21": "Via Del Commercio Fv.A", "D22": "Nervi Tu.A", "D23": "Sampierdarena-Martinetti-Belvedere Tu.M", "D24": "S.Ilario Tu.A", "D25": "Pontedecimo-Cesino Tu.M", "D26": "Bolzaneto Tu.M.", "D27": "Murta Aab.A.", "D28": "Begato Tu.B.", "D29": "Val Secca Fv.B.", "D30": "S.Quirico Tu.M.", "D31": "S.Biagio Tu.A.", "D32": "Fegino Ap.B.", "D33": "Vesima E Crevari Aab.A.", "D34": "Voltri Centro Storico Ts.M.", "D35": "Voltri Tu.M.", "D36": "Ceep Di Pra` Tu.B.", "D37": "Pra` Palmaro Tu.M.", "D38": "Pra` Centro Storico Ts.M.", "D39": "Lavatrici Tu.B.", "D40": "Pegli Viale Modugno", "D41": "Pegli Piazza Bonavino", "D42": "Multedo Tu.M.", "D43": "Sestri Ponente Tu.A.", "D44": "Cornigliano Tu.B.", "D45": "Cornigliano Alta Aab.M.", "D46": "Cornigliano Industriale - Acciaierie Ap.A.", "D47": "Borzoli Aab.M.", "D48": "Campi", "D49": "Rivarolo Tu.M.", "E1": "Begato Paese-Geminiano-Fragoso Aab.M.", "R1": "Confine Con Davagna Aab.B", "R2": "Monte Fasce - Prati Di Bavari Aab.A", "R3": "Val Cerusa Fv.B.", "R5": "Entroterra Di Voltri - Pra`- Sestri Alture Aab.M.", "R6": "Val Varenna Fv.M."};

// Carica il GeoJSON al primo utilizzo
async function loadGeoJSON() {
  if (GEOJSON_ZONE) return GEOJSON_ZONE;
  const res = await fetch('./zones.geojson');
  if (!res.ok) throw new Error('Impossibile caricare i poligoni OMI');
  GEOJSON_ZONE = await res.json();
  return GEOJSON_ZONE;
}
