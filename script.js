// syntax for custom attribute selector 
const inputSlider=document.querySelector("[password-length-slider]");
const lengthDisplay = document.querySelector("[password-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[password-strength-indicator]");
const generateBtn = document.querySelector(".generateButton");

// it will select/fetch all the input tags whose type=checkbox 
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerHTML=passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
}

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

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}
// await navigator. clipboard. writeText (passwordDisp1ay.va1ue) is a statement that uses the Clipboard to write the generated
// password to the clipboard.
// The writeText ( ) method of the Clipboard interface writes the provided text to the clipboard. It returns a Promise that resolves when the text
// has been successfully written to the clipboard.
// By using the await keyword before the navigator . clipboard.writeText (passwordDisp1ay. value) statement, the code waits until the
// Promise resolves before moving on to the next line of code. This ensures that the password is successfully written to the clipboard before any
// // further actions are taken. 
async function copyContent(){
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

inputSlider.addEventListener("input",(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener("click",()=>{
    if(passwordDisplay.value)
    {
        copyContent();
    }
})

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

generateBtn.addEventListener("click",()=>{
    if(checkCount<=0)
        return;

    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    var funcArr = [];
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addition 
    for(let i=0;i<checkCount;i++)
    {
        password+=funcArr[i]();
    }
    //remaining addition
    let remaining = passwordLength - checkCount;
    for(let i=0;i<remaining;i++)
    {
        let random_index = getRndInteger(0,funcArr.length);
        password+=funcArr[random_index]();
    }
    
    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;
    calcStrength();
});

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