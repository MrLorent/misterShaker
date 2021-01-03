// LIEN VERS LA DOC DE L'API: 
// https://www.thecocktaildb.com/api.php

"use strict";

const KEY = {key: '1'};

/*----------------------- MAIN ------------------------*/ 
document.addEventListener('DOMContentLoaded', function(){
	/*------------------- LISTENERS -----------------*/
	// Bouton pour les conseils
	var adviceButton = document.querySelector('#grosse-bulle');
	adviceButton.addEventListener('click', adviceClicked);

	var resetAdviceButton = document.querySelector('#another-bulle');
	resetAdviceButton.addEventListener('click',()=>{
		getRandomCocktail().then(randomCocktail => {
			fillSection("advice", randomCocktail);
		});
	});
	// Boutons retour vers la liste de cocktails
	var backButtons = document.querySelectorAll('.back-button');

	backButtons.forEach((backButton, index) => {
		backButton.addEventListener('click', () => {
			document.querySelector('section.displayed').classList.toggle('displayed');
			document.querySelector('html body').style.overflowY = 'scroll';
		});
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
function cocktailClicked(evt){
	var sectionCocktail = document.querySelector('#cocktail');

	displaySection(sectionCocktail);
	getCocktailById(this.getAttribute('data-id')).then(cocktail => {
		fillSection("cocktail", cocktail);
	});
}

function searchFormSubmitted(evt){
	var researchType = document.querySelector('.search-type').value;
	var research = document.querySelector('.search-bar').value;

	evt.preventDefault();
	
	if(researchType === "name"){
		searchCocktailsByName(research).then(cocktailsByName => {
			displayCocktailList(cocktailsByName);
		});
	}else{
		searchCocktailsByIngredient(research).then(cocktailsByIngredient => {
			displayCocktailList(cocktailsByIngredient);
		});
	}
}

function adviceClicked(evt){
	var sectionAdvice = document.querySelector('#advice');

	displaySection(sectionAdvice);
	getRandomCocktail().then(randomCocktail => {
		fillSection("advice", randomCocktail);
	});
}

/*------------------- DISPLAYERS -------------------*/
function displayCocktailList(cocktailList){
	// SUPRESSION DES ÉLÉMENTS PRÉEXISTANTS
	// Supression des cocktails
	var previousCocktails = document.querySelectorAll('#cocktailList .cocktail');
	previousCocktails.forEach((previousCocktail, index) => {
		previousCocktail.remove();
	});
	// Supression d'un potentiel message d'erreur
	var previousErrorMessage = document.querySelector('.error-message');
	if(previousErrorMessage !== null){
		previousErrorMessage.remove();
	}

	//AFFICHAGE DES NOUVEAUX ÉLÉMENTS
	if(cocktailList.drinks === null){
		// Affichage d'un message d'erreur si la liste est vide
		var errorMessage = document.createElement('p');
		errorMessage.classList.add('error-message');
		errorMessage.innerText = "No result found, sorry... ^^'";
		document.querySelector('#cocktailList').appendChild(errorMessage);
	}else{
		for(let i=0; i<cocktailList.drinks.length;i++){
			createCocktailElement(cocktailList.drinks[i]);
		}
	}
}

function displaySection(section){
	section.classList.toggle('displayed');
	document.querySelector('html body').style.overflowY = 'hidden';
}

/*---------------- ELEMENT CONSTRUCTORS -----------*/
async function createCocktailElement(cocktail){
	var id = cocktail.idDrink;
	var name = cocktail.strDrink;
	var picturePath = cocktail.strDrinkThumb;
	var ingredients = [];

	if(!cocktail.hasOwnProperty('strIngredient1')){
		ingredients = getCocktailIngredients(await getCocktailById(id));
	}else{
		ingredients = getCocktailIngredients(cocktail);
	}

	let newCocktail = document.createElement('div');
	newCocktail.dataset.id = id;
	newCocktail.classList.add('cocktail');

	let picture = document.createElement('img');
	picture.classList.add('picture');
	picture.setAttribute('src', ''+picturePath+'');
	picture.setAttribute('alt', "Cocktail's picture");
	newCocktail.appendChild(picture);

	let cocktailResume = document.createElement('div');
	cocktailResume.classList.add('cocktail-resume');

	let cocktailName = document.createElement('h2');
	cocktailName.classList.add('cocktail-title');
	cocktailName.innerText = name;
	cocktailResume.appendChild(cocktailName);

	let cocktailIngredients = document.createElement('p');
	cocktailIngredients.innerText = ""+ingredients[0]+", "+ingredients[1]+", "+ingredients[2]+"...";
	cocktailResume.appendChild(cocktailIngredients);

	newCocktail.appendChild(cocktailResume);

	newCocktail.addEventListener('click', cocktailClicked);

	document.getElementById('cocktailList').appendChild(newCocktail);
}

function fillSection(section, cocktail){
	var cocktailPicture = document.querySelector('#'+section+' .picture');

	cocktailPicture.setAttribute('src', ''+cocktail.strDrinkThumb+'');

	var cocktailName = document.querySelector('#'+section+' h2');

	cocktailName.innerText = cocktail.strDrink;

	var cocktailCategory = document.querySelector('#'+section+' h3');

	cocktailCategory.innerHTML = cocktail.strCategory;

	var previousIngredients = document.querySelectorAll('#'+section+' .ingredients li');

	previousIngredients.forEach((previousIngredient, index) => {
		previousIngredient.remove();
	});

	var ingredientList = document.querySelector('#'+section+' .ingredients');

	var ingredients = getCocktailIngredients(cocktail);

	ingredients.forEach((ingredient, index) => {
		var newIngredient = document.createElement('li');
		if(cocktail['strMeasure'+(index+1)] !== null){
			newIngredient.innerText = ""+ingredient+" ("+cocktail['strMeasure'+(index+1)]+") ;";
		}else{
			newIngredient.innerText = ""+ingredient+" ;";
		}

		ingredientList.appendChild(newIngredient);
	});
}

function getCocktailIngredients(cocktail){
	var count=1;
	var ingredients = [];

	while(cocktail['strIngredient'+count] !== null){
		ingredients[count - 1] = cocktail['strIngredient'+count];
		count++;
	}

	return ingredients;
}

/*------------------ API REQUESTS -----------------*/
async function getCocktailById(id){
	const reponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i='+id, KEY);
	const cocktail = await reponse.json();

	try{
		console.log('Cocktail clicked:', cocktail);
		return cocktail.drinks[0];
	}catch(e){
		console.log('Some error happened', e);
		return null;
	}
}

async function getCocktailsByLetter(letter){
	const reponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?f='+letter, KEY);
	const cocktailList = await reponse.json();

	try{
		console.log('Cocktail listed by letter', cocktailList);
		return cocktailList;
	}catch(e){
		console.log('Some error happened', e);
		return null;
	}
}

async function searchCocktailsByName(name){
	const reponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s='+name, KEY);
	const cocktailList = await reponse.json();

	try{
		console.log('Cocktail listed by name', cocktailList);
		return cocktailList;
	}catch(e){
		console.log('Some error happened', e);
		return null;
	}
}

async function searchCocktailsByIngredient(ingredient){
	const reponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i='+ingredient, KEY);
	const cocktailList = await reponse.json();

	try{
		console.log('Cocktail listed by ingredient', cocktailList);
		return cocktailList;
	}catch(e){
		console.log('Some error happened', e);
		return null;
	}
}

async function getRandomCocktail(){
	const reponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php', KEY);
	const randomCocktail = await reponse.json();

    try{
		console.log('Cocktail random:', randomCocktail);
		return randomCocktail.drinks[0];
	}catch(e){
		console.log('Some error happened', e);
	}
}