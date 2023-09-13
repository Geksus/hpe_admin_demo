document.getElementById('prankButton').addEventListener('click', function(){
    let divs = document.body.querySelectorAll('*'); // This gets all the div elements

    for (let i = 0; i < divs.length; i++) {
        let randomColor = '#' + Math.floor(Math.random()*16777215).toString(16); // This generates a random color
        let randomFontSize = Math.floor((Math.random() * 40) + 20); // This generates a random font size between 20 and 60

        divs[i].style.backgroundColor = randomColor; // This sets the random color as background
        divs[i].style.fontSize = randomFontSize + 'px'; // This sets the random font size
    }
});