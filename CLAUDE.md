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
- `projecten.html` – aparte pagina Projecten.
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
- Ervaring: lijst met grote jaartallen + label (Werk/Stage/Opleiding), class `.xp`. NIET als CV-tijdlijn.
- Animaties: openingsanimatie header (`.anim-up` / `.anim-photo` met `--d` vertraging in ms), scroll-animaties via `data-reveal` (+ optioneel `style="--d:100"`), lichte parallax op headerfoto (`data-parallax`). Alles uit bij 'prefers-reduced-motion'.
- Nieuwe content? Geef het `data-reveal` zodat het meedoet met de animaties.

## Projecten toevoegen
In `projecten.html` onder PROJECTEN staat een uitgecommentarieerd sjabloon (`<article class="project">`).
Kopieer het, vul titel/context/tekst in, zet afbeelding in `img/projecten/` (max ~1600px breed, jpg/webp, comprimeren).
Verwijder het `projects__empty`-blok zodra er een echt project staat.

## Privacy
Zet GEEN thuisadres, telefoonnummer of geboortedatum zichtbaar op de site (staat wel in zijn CV).
Contact gaat via zijn privémail julius.akyol@gmail.com, LinkedIn en Instagram.
Leeftijd wordt in JS berekend en mag zichtbaar blijven.

## Controleren
Maak na een wijziging een screenshot (desktop 1440px + mobiel 390px) en kijk of het klopt voordat je pusht.
