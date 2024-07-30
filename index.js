let inputSlider=document.querySelector('[data-lengthslider]');
let lengthDisplay=document.querySelector('[data-lengthnum]');
let passwordDisplay=document.querySelector('[data-passwordDisplay]');
let copyBtn=document.querySelector('[data-copy]');
let copyMsg=document.querySelector('[data-copyMsg]');

let uppercaseCheck=document.querySelector('#uppercase');
let lowercaseCheck=document.querySelector('#lowercase');
let numberCheck=document.querySelector('#numbers');
let symbolCheck=document.querySelector('#symbol');
let indicator=document.querySelector('[data-indicator]');
let genrateBtn=document.querySelector('.genrateButton');
let allCheckBox = document.querySelectorAll('input[type="checkbox"]');
let symbol='~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
setIndicator("#ccc")

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;


    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}
function setIndicator(color){
    indicator.style.background=color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getRndInteger(max,min){
    return Math.floor(Math.random() * (max-min)) + min;
}
function genrateRandNumber(){
    return getRndInteger(0,9);
}
function genrateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function genrateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function genrateSymbol(){
    let randNum=getRndInteger(0,symbol.length);
    return symbol.charAt(randNum);
}

function caclStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if (uppercaseCheck.checked) hasUpper=true;
    if (lowercaseCheck.checked) hasLower=true;
    if (numberCheck.checked) hasNum=true;
    if (symbolCheck.checked) hasSym=true;
    if(hasUpper && hasLower &(hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if(
        (hasLower||hasUpper) &&(hasNum || hasSym) && passwordLength>=6
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }        
}

async function copyContent(){

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}


function shufflePassword(array){
    //fisher yates methord
    for (i = array.length -1; i > 0; i--) { 
        var j = Math.floor(Math.random() * (i+1));
        var temp = array[j];
        array[i] = array[j]; 
        array[j] = temp;
     } 
    let str='';
    array.forEach((el)=>(str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach( (checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}



allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider()
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
})

genrateBtn.addEventListener('click',()=>{
    if(checkCount == 0) 
        return;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    password='';

    // if(uppercaseCheck.checked){
    //     password += genrateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += genrateLowerCase();
    // }

    // if(numberCheck.checked){
    //     password += genrateRandNumber();
    // }

    // if(symbolCheck.checked){
    //     password += genrateSymbol();
    // }

    let funcArr=[];
    if(uppercaseCheck.checked)
        funcArr.push(genrateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(genrateLowerCase);

    if(numberCheck.checked)
        funcArr.push(genrateRandNumber);

    if(symbolCheck.checked)
        funcArr.push(genrateSymbol);

    for(let i=0;i<funcArr.length;i++){
        password +=funcArr[i]();
    }

    for(let i=0;i < passwordLength-funcArr.length; i++){
        let randIndex=getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    password=shufflePassword(Array.from(password));

    passwordDisplay.value=password;


    caclStrength();
})