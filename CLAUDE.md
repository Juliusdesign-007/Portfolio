# Portfolio Julius Akyol – werkinstructies

Dit is de portfoliowebsite van Julius Akyol (mediavormgever, MBO Media Vormgeving ROC van Twente, Enschede).
Julius vraagt wijzigingen aan via Claude-chat. Hij is geen programmeur: leg dingen in gewone taal uit, in het Nederlands.

## Hoe het werkt
- Statische site, geen build-stap: `index.html` + `style.css` + `img/`.
- Hosting: Netlify, gekoppeld aan de `main`-branch van deze repo. Elke push naar `main` staat binnen ~1 minuut live.
- Wijzigingen dus direct op `main` committen en pushen (tenzij Julius iets anders vraagt).

## Structuur
- `index.html` – alle content, per sectie gemarkeerd met `<!-- ==== NAAM ==== -->`:
  navigatie, hero, over mij, projecten, ervaring (werk & stage + opleiding), contact, footer.
- `style.css` – kleuren en fonts als CSS-variabelen bovenaan (`:root`).
- `img/julius.jpg` – profielfoto (uit zijn CV). `img/favicon.svg` – icoon.
- `img/projecten/` – hier komen projectafbeeldingen.

## Stijl (afgeleid van zijn CV)
- Donker navy `#10131f` + elektrisch blauw verloop (`--band`), schuine banden zoals de CV-kop.
- Sectiekoppen als blauw tabblad met schuine punt (`.tab`), tijdlijn met blauwe bollen.
- Font: Outfit (Google Fonts). Strak en rustig houden: Julius wil het strak.

## Projecten toevoegen
In `index.html` onder PROJECTEN staat een uitgecommentarieerd sjabloon (`<article class="project">`).
Kopieer het, vul titel/context/tekst in, zet afbeelding in `img/projecten/` (max ~1600px breed, jpg/webp, comprimeren).
Verwijder de `projects__empty`-paragraaf zodra er een echt project staat.

## Privacy
Zet GEEN thuisadres, telefoonnummer of geboortedatum zichtbaar op de site (staat wel in zijn CV).
Contact gaat via zijn privémail julius.akyol@gmail.com, LinkedIn en Instagram.
Leeftijd wordt in JS berekend en mag zichtbaar blijven.

## Controleren
Maak na een wijziging een screenshot (desktop 1440px + mobiel 390px) en kijk of het klopt voordat je pusht.
