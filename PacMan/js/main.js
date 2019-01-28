function displayMyComponent(component) {
	hideAll();
    document.getElementsByClassName(component)[0].style.display="block";
}

function hideAll()
{
	document.getElementsByClassName("game")[0].style.display="none";
	document.getElementsByClassName("help")[0].style.display="none";
	document.getElementsByClassName("about")[0].style.display="none";
}

function fakeLogin()
{
	document.getElementsByClassName("authentication")[0].style.display="none";
	startGame();
}