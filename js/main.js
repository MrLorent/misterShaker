// LIEN VERS LA DOC DE L'API: 
// https://www.thecocktaildb.com/api.php

"use strict";

const KEY = {key: '1'};

document.addEventListener('DOMContentLoaded', function(){
	var backButton = document.querySelector('.back-button');

	backButton.addEventListener('click', () => {
		document.getElementById('cocktail').classList.toggle('displayed');
	});

	var searchForm = document.querySelector('header form');

	searchForm.addEventListener('submit', searchFormSubmitted);

	getCocktailsByLetter("a");
});

function displayCocktailList(cocktailList){
	var previousCocktails = document.querySelectorAll('#cocktailList .cocktail');
	var previousErrorMessage = document.querySelector('.error-message');

	previousCocktails.forEach((previousCocktail, index) => {
		previousCocktail.remove();
	});

	if(previousErrorMessage !== null){
		previousErrorMessage.remove();
	}

	if(cocktailList.drinks === null){
		var errorMessage = document.createElement('p');
		errorMessage.classList.add('error-message');
		errorMessage.innerText = "No result found, sorry... ^^'";

		document.getElementById('cocktailList').appendChild(errorMessage);
	}else{
		for(let i=0; i<cocktailList.drinks.length;i++){
			var ingredients = [];
	
			ingredients = getCocktailIngredients(cocktailList.drinks[i]);
	
			generateCocktail(cocktailList.drinks[i].idDrink, cocktailList.drinks[i].strDrink, cocktailList.drinks[i].strDrinkThumb, ingredients);
		}
	}
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

function generateCocktail(id, name, picturePath, ingredients){
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

function cocktailClicked(evt){
	var sectionCocktail = document.getElementById('cocktail');

	sectionCocktail.classList.toggle('displayed');
	getCocktailById(this.getAttribute('data-id'));
}

function searchFormSubmitted(evt){
	var typeOfResearch = document.querySelector('.search-type').value;
	var userResearch = document.querySelector('.search-bar').value;

	evt.preventDefault();
	
	if(typeOfResearch === "name"){
		searchCocktailByName(userResearch);
	}else{
		searchCocktailByIngredient(userResearch);
	}
}

function displayCocktail(cocktail){
	var cocktailPicture = document.querySelector('#cocktail .picture');

	cocktailPicture.setAttribute('src', ''+cocktail.strDrinkThumb+'');

	var cocktailName = document.querySelector('#cocktail h2');

	cocktailName.innerText = cocktail.strDrink;

	var cocktailCategory = document.querySelector('#cocktail h3');

	cocktailCategory.innerHTML = cocktail.strCategory;

	var previousIngredients = document.querySelectorAll('.ingredients li');

	previousIngredients.forEach((previousIngredient, index) => {
		previousIngredient.remove();
	});

	var ingredientList = document.querySelector('.ingredients');

	var ingredients = getCocktailIngredients(cocktail);

	ingredients.forEach((ingredient, index) => {
		var newIngredient = document.createElement('li');
		newIngredient.innerText = ""+ingredient+" ("+cocktail['strMeasure'+(index+1)]+");";

		ingredientList.appendChild(newIngredient);
	});

}

/*------------------ API REQUESTS -----------------*/
async function getCocktailById(id){
	const reponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i='+id, KEY);
	const cocktail = await reponse.json();

	try{
		console.log('Cocktail clicked:', cocktail);
		displayCocktail(cocktail.drinks[0]);
	}catch(e){
		console.log('Some error happened', e);
	}
}

async function getCocktailsByLetter(letter){
	const reponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?f='+letter, KEY);
	const cocktailList = await reponse.json();

	try{
		console.log('Cocktail listed by letter', cocktailList);
		displayCocktailList(cocktailList);
	}catch(e){
		console.log('Some error happened', e);
	}
}

async function searchCocktailByName(name){
	const reponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s='+name, KEY);
	const cocktailList = await reponse.json();

	try{
		console.log('Cocktail listed by name', cocktailList);
		displayCocktailList(cocktailList);
	}catch(e){
		console.log('Some error happened', e);
	}
}

async function searchCocktailByIngredient(ingredient){
	const reponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i='+ingredient, KEY);
	const cocktailList = await reponse.json();

	try{
		console.log('Cocktail listed by ingredient', cocktailList);
		displayCocktailList(cocktailList);
	}catch(e){
		console.log('Some error happened', e);
	}
}