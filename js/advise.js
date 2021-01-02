"use strict";


/*----------------------- MAIN ------------------------*/ 
document.addEventListener('DOMContentLoaded', function(){
	/*------------------- LISTENERS -----------------*/
	// Boutons retour vers la liste de cocktails
	var backButton = document.querySelector('.back-button');
	backButton.addEventListener('click', () => {
		document.getElementById('cocktail').classList.toggle('displayed');
		document.querySelector('html body').style.overflowY = 'scroll';
	});

	// Barre de recherche
	var searchForm = document.querySelector('header form');
	searchForm.addEventListener('submit', searchFormSubmitted);

	/*------------- LISTENERS (MOBILE) --------------*/
	// Bouton pour afficher le formulaire en version
	var formDisplayer = document.querySelector('img.form-displayer');
	formDisplayer.addEventListener('click',() => {
		formDisplayer.classList.toggle('clicked');
	});

	// Écouteur pour replier le formulaire une fois le bouton submit cliqué 
	var submitButton = document.querySelector('form button');
	submitButton.addEventListener('click', ()=>{
		formDisplayer.classList.toggle('clicked');
	});

	/*------------------- CONTENU -------------------*/
	getCocktailsByLetter("a").then(cocktailList =>{
		displayCocktailList(cocktailList);
	});
	
});
/*--------------------- TRIGGERS ---------------------*/
function adviceClicked(evt){
	var sectionAdvice = document.getElementById('advice');

	sectionAdvice.classList.toggle('displayed');
	getCocktailById(this.getAttribute('data-id'));
	document.querySelector('html body').style.overflowY = 'hidden';
}

/*------------------ API REQUESTS -----------------*/
async function searchCocktailByRandom(){
	const reponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php', KEY);
	const cocktailList = await reponse.json();

    try{
		console.log('Cocktail random:', cocktail);
		displayCocktail(cocktail.drinks[0]);
	}catch(e){
		console.log('Some error happened', e);
	}
}
