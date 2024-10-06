const inputSlider=document.querySelector("[password-length-slider]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const lengthDisplay = document.querySelector("[password-lengthNumber]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[password-strength-indicator]");
const generateBtn = document.querySelector(".generateButton");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// by default passwordLength is set to 10 
var passwordLength=10;
inputSlider.value=passwordLength;

//copy function - it will copy the password only when password is not empty
// await navigator. clipboard. writeText (passwordDisp1ay.va1ue) is a statement that uses the Clipboard to write the generated
// password to the clipboard.
// The writeText ( ) method of the Clipboard interface writes the provided text to the clipboard. It returns a Promise that resolves when the text
// has been successfully written to the clipboard.
// By using the await keyword before the navigator . clipboard.writeText (passwordDisp1ay. value) statement, the code waits until the
// Promise resolves before moving on to the next line of code. This ensures that the password is successfully written to the clipboard before any
// // further actions are taken.
async function copyMsgHandler(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerHTML="Copied!";
    }
    catch(e){
        copyMsg.innerHTML="Failed!";
    }
    //to make copy msg wala span visible;
    copyMsg.classList.add("active");

    setTimeout(()=>{
        // copyMsg.classList.remove("active");
        copyMsg.innerHTML="";
    },2000);
}
copyBtn.addEventListener("click",()=>{
    if(passwordDisplay.value!="")
        copyMsgHandler();
});

// inputSlider - when slider changes then value of password length changes and in the UI password length will also change
inputSlider.addEventListener("input",(e)=>{
    passwordLength=e.target.value;
    lengthDisplay.innerHTML=passwordLength;
});


//Random uppercase , lowercase , symbol , number generation
function getRndInteger(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,122));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,90));
}

function generateSymbol(){
    const random_index= getRndInteger(0,symbols.length);
    return symbols.charAt(random_index);
}


//generate password button
function generatePassword(){
    var funcArr = [];
    var checked=0;
    if(uppercaseCheck.checked){
        checked++;
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        checked++;
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        checked++;
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        checked++;
        funcArr.push(generateSymbol);
    }

    //if nothing checked then return , means return from the function and dont generate password
    if(checked==0)
        return;
    
    //special case - when number of checked boxes is greater than the password length , in this case set the passwor length to the number of checked boxes
    if(checked>passwordLength){
        passwordLength=checked;
        lengthDisplay.innerHTML=passwordLength;
        inputSlider.value=passwordLength;
    }

    //password generation
    let password="";

    // compulsory addition - suppose uppercase and symbol is checked so it is compulsory to add atleast one uppercase and one symbol 
    for(let i=0;i<checked;i++)
    {
        password+=funcArr[i]();
    }

    //remaining addition
    let remaining = passwordLength - checked ;
    for(let i=0;i<remaining;i++)
    {
        let random_index = getRndInteger(0,funcArr.length);
        password+=funcArr[random_index]();
    }

    // for more security shuffle the password generated 
    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength(password,checked);
}
generateBtn.addEventListener("click",generatePassword);


//shuffling of the generated password
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


// calculating strength of the password 
function calcStrength(password,checked){
    if(checked>=2 && password.length>=8 || (password.length>=15)){
        indicator.style.backgroundColor="green";
    }
    else{
        indicator.style.backgroundColor="red";
    }
}