var SEARCH_BASE = 'https://encrypted.google.com/search?q=';
var searchInput = document.querySelector('.search__input');

searchInput.addEventListener('keydown', handleKeyDown);

function handleKeyDown(event) {
	if (event.key === 'Enter') {
		google();
	}
}

function google() {
	var query = searchInput.value;
	window.location.href = SEARCH_BASE + query;
}