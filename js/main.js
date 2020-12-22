// LIEN VERS LA DOC DE L'API: 
// https://www.thecocktaildb.com/api.php

"use strict";

const KEY = {key: '1'};

document.addEventListener('DOMContentLoaded', function(){
	getTheCocktails();
});

async function getTheCocktails(){
	const reponse = await fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=bloody mary', KEY);
	const listOfPlanet = await reponse.json();

	try{
		console.log('success!', listOfPlanet);
	}catch(e){
		console.log('Some error happened', e);
	}
}