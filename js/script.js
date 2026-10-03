console.log("script.js chargé");

// ---------- 1. Menu "hamburger" ----------
const boutonMenu = document.querySelector("#bouton-menu");
const nav = document.querySelector("nav");
if (boutonMenu) {
  boutonMenu.addEventListener("click", () => {
    nav.classList.toggle("ouvert");
  });
}

// ---------- 2. Vérification du formulaire de réservation ----------
const form = document.querySelector("#form-reservation");
if (form) {
  const erreur = document.querySelector("#erreur");
  form.addEventListener("submit", (evenement) => {
    const messages = [];
    const tel = form.telephone.value.replace(/\s/g, "");
    const personnes = Number(form.personnes.value);
    const jour = new Date(form.date.value);
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);

    if (form.nom.value.trim() === "") messages.push("Indiquez votre nom.");
    if (!/^6\d{8}$/.test(tel)) messages.push("Numéro invalide : 9 chiffres commençant par 6.");
    if (!(personnes >= 1 && personnes <= 20)) messages.push("Entre 1 et 20 personnes.");
    if (isNaN(jour) || jour < aujourdhui) messages.push("Choisissez une date à venir.");

    if (messages.length > 0) {
      evenement.preventDefault();
      erreur.textContent = messages.join(" ");
    }
  });
}

// ---------- 3. Menu chargé depuis un fichier JSON, avec filtre ----------
const liste = document.querySelector("#liste-menu");
let tousLesPlats = [];

function afficherPlats(categorie) {
  liste.textContent = "";
  const plats = categorie === "tout"
    ? tousLesPlats
    : tousLesPlats.filter((p) => p.categorie === categorie);
  for (const p of plats) {
    const li = document.createElement("li");
    li.textContent = `${p.nom} : ${p.prix} FCFA`;
    liste.appendChild(li);
  }
}

async function chargerMenu() {
  try {
    const reponse = await fetch("menu.json");
    if (!reponse.ok) throw new Error("Erreur " + reponse.status);
    tousLesPlats = await reponse.json();
    afficherPlats("tout");
  } catch (e) {
    liste.textContent = "Le menu est momentanément indisponible.";
    console.error(e);
  }
}

if (liste) {
  chargerMenu();
  for (const bouton of document.querySelectorAll(".filtre")) {
    bouton.addEventListener("click", () => afficherPlats(bouton.dataset.categorie));
  }
}
