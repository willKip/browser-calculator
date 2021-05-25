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

    resetCalc()
}

function putPoint() {
    currentNumber = memory; // load number in memory in to modify
    if (Number.isInteger(Number(currentNumber))){
        currentNumber += ".";
        curDisplayContent = currentNumber;
        updateDisplays();
    }
}

function deleteOne() {
    currentNumber = currentNumber.toString().slice(0, -1);
    if (currentNumber.length === 0) currentNumber = 0;
    curDisplayContent = currentNumber;
    updateDisplays();
}

function changeSign() {
    currentNumber *= -1;
    curDisplayContent = currentNumber;
    updateDisplays();
}

function putDigit() {
    let digit = this.textContent;
    if (Number(currentNumber) === 0)
        currentNumber = digit;
    else
        currentNumber += digit;
    curDisplayContent = currentNumber;

    updateDisplays();
}

function putOperator() {
    let op = this.textContent;
    if (currentOperator === null) {
        memory = currentNumber;
        currentNumber = 0;
    }
    // Division by zero is handled by operator changes with 0 being ignored
    if (Number(currentNumber) !== 0) {
        memory = operate(Number(memory), Number(currentNumber), currentOperator);
        currentNumber = 0;
    }
    currentOperator = op;
    prevDisplayContent = `${memory} ${currentOperator}`;
    curDisplayContent = currentNumber;

    updateDisplays();
}

function equals() {
    // If no operations can be done, result equals number itself
    if (currentOperator == null) {
        prevDisplayContent = `${currentNumber} =`;
    } else {
        prevDisplayContent = `${memory} ${currentOperator} ${currentNumber} =`;

        if (currentOperator === "/" && Number(currentNumber) === 0) {
            curDisplayContent = "division by 0";
            currentNumber = 0;
        } else {
            memory = operate(Number(memory), Number(currentNumber), currentOperator);
            currentNumber = memory;
            curDisplayContent = memory;
        }
    }

    updateDisplays();
}

function resetCalc() {
    prevDisplayContent = "";
    curDisplayContent = 0;
    currentNumber = 0;
    currentOperator = null;
    memory = 0;

    updateDisplays()
}

function updateDisplays() {
    prevDisplayDiv.textContent = prevDisplayContent;
    curDisplayDiv.textContent = curDisplayContent;
}

const fractionDigitsValue = 6;
const prevDisplayDiv = document.getElementById("calc-display-previous");
const curDisplayDiv = document.getElementById("calc-display-current");

let prevDisplayContent;
let curDisplayContent;
let currentNumber;
let currentOperator;
let memory;

initPageElems();
