"use strict";

document.addEventListener('DOMContentLoaded', function(){
	var backButton = document.querySelector('.back-button');

	backButton.addEventListener('click', () => {
		document.getElementById('cocktail').classList.toggle('displayed');
		document.querySelector('html body').style.overflowY = 'scroll';
	});

	var searchForm = document.querySelector('header form');

	searchForm.addEventListener('submit', searchFormSubmitted);

	getCocktailsByLetter("a");
	
	/*------------------- MOBILE --------------------*/
	var formDisplayer = document.querySelector('img.form-displayer');

	formDisplayer.addEventListener('click',() => {
		formDisplayer.classList.toggle('clicked');
	});

	var submitButton = document.querySelector('form button');
	
	submitButton.addEventListener('click', ()=>{
		formDisplayer.classList.toggle('clicked');
	});
});


function adviceClicked(evt){
	var sectionAdvice = document.getElementById('advice');

	sectionAdvice.classList.toggle('displayed');
	getCocktailById(this.getAttribute('data-id'));
	document.querySelector('html body').style.overflowY = 'hidden';
}

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
