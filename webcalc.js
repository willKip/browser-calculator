function operate(a, b, op) {
    let result;
    switch (op) {
        case "+": result = a + b; break;
        case "-": result = a - b; break;
        case "*": result = a * b; break;
        case "/": result = a / b; break;    // Div by zero avoided separately
        default: return null;
    }
    return +result.toFixed(fractionDigitsValue);  // '+' converts result back to number
}

function initPageElems() {
    Array.from(document.getElementsByClassName("button-number")).
    forEach(function(element) {
        element.addEventListener("click", putDigit);
    });

    Array.from(document.getElementsByClassName("button-operator")).
    forEach(function(element) {
        element.addEventListener("click", putOperator);
    });

    document.getElementById("clear-button").
    addEventListener("click", resetCalc);
    document.getElementById("equals-button").
    addEventListener("click", equals);
    document.getElementById("sign-change-button").
    addEventListener("click", changeSign);
    document.getElementById("point-button").
    addEventListener("click", putPoint);
    document.getElementById("delete-button").
    addEventListener("click", deleteOne);

    resetCalcValues();
    updateCurDisplay(currentNumStr);
}

function deleteOne() {
    currentNumStr = currentNumStr.slice(0, -1);
    if (currentNumStr.length === 0) currentNumStr = "0";
    updateCurDisplay(currentNumStr);
}

function changeSign() {
    currentNumStr = (Number(currentNumStr) * -1).toString();
    updateCurDisplay(currentNumStr);
}

function putDigit() {
    let digit = this.textContent;
    if (currentNumStr === "0")
        currentNumStr = digit;
    else
        currentNumStr += digit; // concatenate to currentNumStr string
    updateCurDisplay(currentNumStr);
}

function putPoint() {
    // Only allow one decimal point to exist!
    if (Number.isInteger(Number(currentNumStr))){
        currentNumStr += ".";
        updateCurDisplay(currentNumStr);
    }
}

function putOperator() {
    equals();   // Calc what was previously there first, if possible
    currentOperator = this.textContent;
}

function equals() {
    if (memoryStr === null) {
        // Loading current number to memory as first term
        memoryStr = currentNumStr;
        currentNumStr = "0";
        updateCurDisplay(currentNumStr);
    } else if (currentOperator !== null) {
        if (currentNumStr !== "0" || currentOperator !== "/") {
            // Calculating with second term
            memoryStr = operate(Number(memoryStr), Number(currentNumStr), currentOperator).toString();
            currentNumStr = "0";
            updateCurDisplay(memoryStr);
        } else {
            updateCurDisplay("division by 0");
            resetCalcValues();
        }
    }
}

// Does not apply changes to display by itself!
function resetCalcValues() {
    memoryStr = null;
    currentOperator = null;
    currentNumStr = "0";
}

function resetCalc() {
    resetCalcValues();
    updateCurDisplay(currentNumStr);
}

function updateCurDisplay(content) {
    curDisplayDiv.textContent = content;
}

const fractionDigitsValue = 6;
const curDisplayDiv = document.getElementById("calc-display-current");

let memoryStr;
let currentOperator;
let currentNumStr;

initPageElems();
