// Jaartal in de footer en leeftijd rekenen zichzelf uit (geboren 20-10-2007)
const now = new Date();

const year = document.getElementById('year');
if (year) year.textContent = now.getFullYear();

const ageEl = document.getElementById('age');
if (ageEl) {
  const born = new Date(2007, 9, 20);
  let age = now.getFullYear() - born.getFullYear();
  if (now < new Date(now.getFullYear(), born.getMonth(), born.getDate())) age--;
  ageEl.textContent = age;
}
