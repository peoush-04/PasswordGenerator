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
let checkCount=1;
handleSlider();

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerHTML=passwordLength;
}

function setIndicator(color){
    indicator.computedStyleMap.backgroundColor=color;
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
        copyMsg.classList.remove("active");
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
    if(uppercaseCheck.checked){
        password += generateUpperCase();
    }
    if(lowercaseCheck.checked){
        password += generateLowerCase();
    }
    if(numbersCheck.checked){
        password += generateRandomNumber();
    }
    if(symbolsCheck.checked){
        password += generateSymbol();
    }
})