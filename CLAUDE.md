# Portfolio Julius Akyol – werkinstructies

Dit is de portfoliowebsite van Julius Akyol (mediavormgever, MBO Media Vormgeving ROC van Twente, Enschede).
Julius vraagt wijzigingen aan via Claude-chat. Hij is geen programmeur: leg dingen in gewone taal uit, in het Nederlands.

## Hoe het werkt
- Statische site, geen build-stap: 3 pagina's + `style.css` + `main.js` + `img/`.
- Hosting: Netlify, gekoppeld aan de `main`-branch van deze repo. Elke push naar `main` staat binnen ~1 minuut live.
- Wijzigingen dus direct op `main` committen en pushen (tenzij Julius iets anders vraagt).

## Structuur
- `index.html` – homepage: hero, 'wat ik doe' (intro + 3 vaardigheden), ervaring (#ervaring), contact (#contact).
- `over-mij.html` – aparte pagina Over mij (tekst, foto, vaardigheden/talen/buiten school).
- `projecten.html` – aparte pagina Projecten: header + 3D-stapel van 10 vakken (scrollen om te bladeren, klik = detailvenster). Logica in `projecten.js`.
- Navigatie staat in elk HTML-bestand apart: wijzig je het menu, doe het dan in alle drie.
  Menu: Over mij (pagina) · Projecten (pagina) · Ervaring (homepage #ervaring) · Contact (homepage #contact).
- `main.js` – jaartal footer + leeftijd (berekend uit geboortedatum, alleen leeftijd tonen).
- Secties zijn gemarkeerd met `<!-- ==== NAAM ==== -->`.
- `style.css` – kleuren en fonts als CSS-variabelen bovenaan (`:root`).
- `img/julius.jpg` – profielfoto (uit zijn CV). `img/favicon.svg` – icoon.
- `img/projecten/` – hier komen projectafbeeldingen.

## Stijl (sinds 17-11-2026: donkere 'portfolio-vibe', op basis van een voorbeeld dat Julius stuurde)
- Donkere achtergrond `--bg #0d0e12`, vlakken `--surface`. Accent: elektrisch blauw uit zijn CV (niet oranje zoals het voorbeeld).
- Grote afgeronde headers (`.hero` op de homepage, `.page-head` op subpagina's, radius 40px) met blauw verloop `--hero-grad`.
- Foto in de header: `img/julius-cut.webp` = zwart-wit uitsnede zonder achtergrond, krijgt kleur via `mix-blend-mode: luminosity`.
- Font: Plus Jakarta Sans (Google Fonts), heel vet (800) voor grote titels. Kleine blauwe `.eyebrow` boven titels.
- Knoppen: pil met rond pijltje (`.btn` + `.btn__icon`, varianten `--light`, `--blue`, `--ghost`).
- Menu (`#nav`): groot bovenin, wordt bij scrollen een kleiner zwevend balkje (`.nav--small`, gezet in main.js). Op mobiel toont de Contact-knop alleen het pijltje. Menu-items hebben allemaal dezelfde stijl (ook de huidige pagina, geen onderstreping); bij hover worden ze blauw.
- Ervaring: lijst met grote jaartallen + label (Werk/Stage/Opleiding, allemaal dezelfde neutrale stijl), class `.xp`. NIET als CV-tijdlijn.
- Animaties: openingsanimatie header (`.anim-up` / `.anim-photo` met `--d` vertraging in ms), scroll-animaties via `data-reveal` (+ optioneel `style="--d:100"`), lichte parallax op headerfoto (`data-parallax`). Alles uit bij 'prefers-reduced-motion'.
- Bewegende achtergrond (rustig): `body::before/::after` = zachte blauwe gloed die langzaam over de pagina drijft (38-46 s); `.hero/.page-head/.contact::before` = lichtvlek die langzaam door de blauwe headers schuift (24 s). Julius wil het rustig houden: niet sneller of feller maken zonder dat hij erom vraagt.
- Laadscherm (`#loader`, op alle 3 pagina's direct na `<body>`): naam + 'Mediavormgever' + blauwe balk 0→100%, minimaal 1,5 s, max 3,5 s, schuift dan omhoog weg en pas dan start de header-animatie. Alleen bij het eerste bezoek per sessie (`sessionStorage 'ja-loaded'`), niet bij elke paginawissel; overgeslagen bij 'minder beweging'. Logica bovenaan `main.js` + inline script in `<head>`.
- Nieuwe content? Geef het `data-reveal` zodat het meedoet met de animaties.

## Projecten toevoegen
De projectenpagina is een 3D-stapel (Julius' wens, naar een voorbeeld): je scrollt erdoorheen, het middelste vak staat recht,
de rest kantelt weg. Eén scroll (muiswiel/trackpad) of één veeg op mobiel = precies één vak verder, met een eigen soepele animatie (700 ms, `DURATION` in projecten.js); bij het eerste/laatste vak scrolt de pagina gewoon verder. Klik op het middelste vak opent een detailvenster (`<dialog id="detail">`); klik op een ander vak scrollt ernaartoe.
Er staan 10 vakken met witte placeholders ("Project 01" t/m "Project 10") tot Julius werk levert.

Een project invullen = één `<li class="stack__item">` in `projecten.html` aanpassen:
- `data-title` (groot links in beeld), `data-meta` (bijv. "Stepp Footcare · 2025"), `data-text` (2-3 zinnen voor het detailvenster)
- `<span class="card__ph">…</span>` vervangen door `<img src="img/projecten/NAAM.jpg" alt="…" loading="lazy">`
- Beeld liggend 16:10, ca. 1600px breed, gecomprimeerd (jpg/webp) in `img/projecten/`.
Meer/minder vakken: `<li>` kopiëren of verwijderen; JS en scrollhoogte passen zich aan.
Controleer na wijzigingen ook het detailvenster en mobiel (de titel staat daar onderin over een donkere fade).

## Privacy
Zet GEEN thuisadres, telefoonnummer of geboortedatum zichtbaar op de site (staat wel in zijn CV).
Contact gaat via zijn privémail julius.akyol@gmail.com, LinkedIn en Instagram.
Leeftijd wordt in JS berekend en mag zichtbaar blijven.

## Controleren
Maak na een wijziging een screenshot (desktop 1440px + mobiel 390px) en kijk of het klopt voordat je pusht.
