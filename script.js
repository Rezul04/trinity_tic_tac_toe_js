
let boxes1 = document.querySelectorAll('.b1');

let boxes2 = document.querySelectorAll('.b2');

let boxes3 = document.querySelectorAll('.b3');

let newGame=document.querySelector('.hide');

let howToPlay = document.querySelector('.how');

let rules1=document.querySelector('.rulesprompt1');

let rules2=document.querySelector('.rulesprompt2');

let rules3=document.querySelector('.rulesprompt3');

let rules4=document.querySelector('.rulesprompt4');

let toResetGame = document.querySelector('.game-reset');  

let winner=document.querySelector('#msg');

let turnText=document.querySelector('.turn');

let outScreen=document.querySelector('.overlay');

let allThreeDone = 1;

let player1 = true;

let iconCross=document.querySelectorAll('.icons');

const winPatterns = [

    [0, 1, 2],

    [0, 3, 6],

    [0, 4, 8],

    [1, 4, 7],

    [2, 5, 8],

    [2, 4, 6],

    [3, 4, 5],

    [6, 7, 8],

];








function checkboxHandler(box) {

    box.innerText = "X";

    box.disabled=true;

    player1 = !player1;
    box.classList.add('cursor-notAllowed');
    box.style.backgroundColor = "rgb(134, 88, 200)";

    if(player1){

        turnText.innerText="Player1 turn";

    }

    else{

        turnText.innerText="Player2 turn";

    }

    

}




function createCheckboxHandler1(box) {

    return function() {

        checkboxHandler(box);

        checkbox1();

    };

}

function createCheckboxHandler2(box) {

    return function() {

        checkboxHandler(box);

        checkbox2();

    };

}

function createCheckboxHandler3(box) {

    return function() {

        checkboxHandler(box);

        checkbox3();

    };

}






boxes1.forEach(box => {

    const handler = createCheckboxHandler1(box);

    box.addEventListener('click', handler);

    box.handler1 = handler;

});




boxes2.forEach(box => {

    const handler = createCheckboxHandler2(box);

    box.addEventListener('click', handler);

    box.handler2 = handler;

});




boxes3.forEach(box => {

    const handler = createCheckboxHandler3(box);

    box.addEventListener('click', handler);

    box.handler3 = handler;

});




function winnerName(){

    outScreen.classList.add("overlayactive");

if(player1){

    winner.innerText="Congratulations Player1";

}

else winner.innerText="Congratulations Player2";






}

function checkbox1() {

    for (let pattern of winPatterns) {

        let posn1 = boxes1[pattern[0]].innerText;

        let posn2 = boxes1[pattern[1]].innerText;

        let posn3 = boxes1[pattern[2]].innerText;




        if (posn1 === 'X' && posn2 === 'X' && posn3 === 'X') {

            if (allThreeDone !== 3) {

                allThreeDone++;

                boxes1.forEach(box => box.removeEventListener('click', box.handler1));

                boxes1.forEach(box => box.classList.add('cursor-notAllowed'));
                

            } else {

                winnerName();

                newGame.classList.remove("hide");
                boxes1.forEach(box => box.classList.remove('cursor-notAllowed'));
                boxes2.forEach(box => box.classList.add('cursor-notAllowed'));
                boxes3.forEach(box => box.classList.add('cursor-notAllowed'));



            }

            break;

        }

    }

}




// Function to handle win checking and event listener removal for section 2

function checkbox2() {

    for (let pattern of winPatterns) {

        let posn1 = boxes2[pattern[0]].innerText;

        let posn2 = boxes2[pattern[1]].innerText;

        let posn3 = boxes2[pattern[2]].innerText;




        if (posn1 === 'X' && posn2 === 'X' && posn3 === 'X') {

            if (allThreeDone !== 3) {

                allThreeDone++;

                boxes2.forEach(box => box.removeEventListener('click', box.handler2));

                boxes2.forEach(box => box.classList.add('cursor-notAllowed'));

            } else {

                winnerName();

                newGame.classList.remove("hide");
                boxes1.forEach(box => box.classList.remove('cursor-notAllowed'));
                boxes2.forEach(box => box.classList.add('cursor-notAllowed'));
                boxes3.forEach(box => box.classList.add('cursor-notAllowed'));
            }

            break;

        }

    }

}




// Function to handle win checking and event listener removal for section 3

function checkbox3() {

    for (let pattern of winPatterns) {

        let posn1 = boxes3[pattern[0]].innerText;

        let posn2 = boxes3[pattern[1]].innerText;

        let posn3 = boxes3[pattern[2]].innerText;




        if (posn1 === 'X' && posn2 === 'X' && posn3 === 'X') {

            if (allThreeDone !== 3) {

                allThreeDone++;

                boxes3.forEach(box => box.removeEventListener('click', box.handler3));

                boxes3.forEach(box => box.classList.add('cursor-notAllowed'));
 
            } else {

                winnerName();

                newGame.classList.remove("hide");
                boxes1.forEach(box => box.classList.remove('cursor-notAllowed'));
                boxes2.forEach(box => box.classList.add('cursor-notAllowed'));
                boxes3.forEach(box => box.classList.add('cursor-notAllowed'));
            }

            break;

        }

    }

}




function resetAndNew(){

boxes1.forEach((box)=>{

box.innerText="";

box.disabled=false;

box.style.backgroundColor = "white";

box.addEventListener('click', box.handler1);

box.classList.remove('cursor-notAllowed');
                

})

boxes2.forEach((box)=>{

    box.innerText="";

    box.disabled=false;

    

    box.style.backgroundColor = "white";

    box.addEventListener('click', box.handler2);

    box.classList.remove('cursor-notAllowed');

    })

    boxes3.forEach((box)=>{

        box.innerText="";

        box.disabled=false;

        

        box.style.backgroundColor = "white";

        box.addEventListener('click', box.handler3);

        box.classList.remove('cursor-notAllowed');

        })

        player1=true;

        newGame.classList.add("hide");

        

        allThreeDone = 1;

        turnText.innerText="Player1 turn";

        outScreen.classList.remove("overlayactive");




}




function rule1(){

    rules1.classList.remove("hide1");

    outScreen.classList.add("overlayactive");

    rules2.classList.add("hide2");

}

function rule2(){

    rules1.classList.add("hide1");

    rules2.classList.remove("hide2");

    outScreen.classList.add("overlayactive");

    rules3.classList.add("hide3");

}

function rule3(){

    rules2.classList.add("hide2");

    rules3.classList.remove("hide3");

    outScreen.classList.add("overlayactive");

    rules4.classList.add("hide4");

}

function rule4(){

    rules3.classList.add("hide3");

    rules4.classList.remove("hide4");

    outScreen.classList.add("overlayactive");

    

}

function back(){

    rules1.classList.add("hide1");

    outScreen.classList.remove("overlayactive");

    

}

function playGame(){

    rules4.classList.add("hide4");

    outScreen.classList.remove("overlayactive");

    

}






iconCross.forEach((icon) => {

    icon.addEventListener('click', () => {




        rules1.classList.add("hide1");

        rules2.classList.add("hide2");

        rules3.classList.add("hide3");

        rules4.classList.add("hide4");

        outScreen.classList.remove("overlayactive");

    });

});