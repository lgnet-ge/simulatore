# Simulatore Locazione Genova 2025

## File

| File | Dimensione | Contenuto |
|------|-----------|-----------|
| `index.html` | ~73 KB | App React, CSS, logica calcoli |
| `data.js` | ~9 KB | Poligoni on-demand, costanti OMI e fiscali |
| `zones.geojson` | ~757 KB | Poligoni geometrici zone OMI (caricato solo al primo geocoding) |

## Deployment

Carica tutti e 3 i file nella stessa cartella del server web.

### Netlify / GitHub Pages / Vercel
1. Crea un repository con i 3 file
2. Collega al servizio di hosting
3. Deploy automatico

### Server tradizionale (Apache/Nginx)
Carica i 3 file nella stessa directory pubblica.

## Note tecniche
- `zones.geojson` viene scaricato dal browser solo al primo click su "Cerca indirizzo"
- Dopo il primo download viene cachato — le ricerche successive sono istantanee
- **Non funziona aprendo index.html da file locale** (limitazione browser sui fetch locali)
  - Per testare in locale usa: `python3 -m http.server 8080` nella cartella dei file

## Dati
- **Accordo Territoriale Genova**: 29/05/2025, in vigore dal 16/06/2025
- **Quotazioni OMI**: Agenzia delle Entrate, 2° semestre 2025
- **IMU 2026**: DCC 57/2024 + DCC 41/2025
- **TARI 2025**: DCC 60 del 19/12/2024 (AMIU Genova)
