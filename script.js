const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber");
const passwordDisplay=document.querySelector("[data-passwordDisplay");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg");
const upperCaseCheck=document.querySelector("#uppercase");
const lowerCaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateBtn");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols='!@#$%^&*()~_+-/[]{}\|;<>/?=:"/';


let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
//Set strength color to grey


//Set password length
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength; 
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
}

function getRandomInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
   return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
    const RandomNumber=getRandomInteger(0,symbols.length);
    return symbols.charAt(RandomNumber);
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasSymbols=false;
    let hasNumber=false;
    if(upperCaseCheck.checked) hasUpper=true;
    if(lowerCaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNumber=true;
    if(symbolsCheck.checked) hasSymbols=true;
    if(hasUpper && hasLower && (hasNumber || hasSymbols) && passwordLength>=8){
        setIndicator('#0f0');
    }
    else if(
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbols) &&
        passwordLength>=6
    ){
        setIndicator('#ff0');
    }
    else{
        setIndicator('#f00');
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active");
        },2000);
}

function shufflePassword(array){
    //Fisher Yates Method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
    });
    //special condtion
    if(passwordLength<checkCount)
    passwordLength=checkCount;
    handleSlider();
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
});

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener('click',()=>{
    if(checkCount==0)
        return;
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
//let's start the journey to find the new password
    console.log("Starting the Journey");
//remove old password
    password="";
//let's put the stuff mentioned by the user
// if(upperCaseCheck.checked){
//     password+=generateUpperCase();
// }
// if(lowerCaseCheck.checked){
//     password+=generatelowerCase();
// }
// if(symbolsCheck.checked){
//     password+=generateSymbol();
// }
// if(numbersCheck.checked){
//     password+=generateRandomNum();
// }

let funcArr=[];
    if(upperCaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowerCaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

        //compulsory addition
        for(let i=0;i<funcArr.length;i++){
            password+=funcArr[i]();
        }
            console.log("Compulsory addition done");
        //remaining addition
        for(let i=0;i<passwordLength-funcArr.length;i++){
            let randIdx=getRandomInteger(0,funcArr.length);
            console.log("randIndex" + randIdx);
            password+=funcArr[randIdx]();
            
        }
        console.log("Remaining addition done");

//shuffle the password
        password=shufflePassword(Array.from(password));
        console.log("Shuffling done");

//show in UI
        passwordDisplay.value=password;
        console.log("UI update done");
//calculating strength
        calcStrength();
});