function operate(a, b, op) {
  let result;
  switch (op) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      result = a / b;
      break;    // Div by zero avoided separately
    default:
      return null;
  }
  return +result.toFixed(fractionDigitsValue);  // '+' converts result back to number
}

function initPageElems() {
  Array.from(document.getElementsByClassName("button")).forEach(function (element) {
    element.addEventListener("click", () => enterInput(element.textContent));
  });

  document.addEventListener("keydown", parseKey);

  resetCalcValues();
  updateDisplays();
}

function buttonActiveEffect(id) {
  let button = document.getElementById(id);
  button.classList.add("active");
  setTimeout(function () { button.classList.remove("active");},
    100);
}

function parseKey(e) {
  enterInput(e.key);

  if (e.key >= 0 && e.key <= 9) {
    buttonActiveEffect(`button-${e.key}`);
  } else if (isOperator(e.key)) {
    buttonActiveEffect(`button-${convertOp(e.key)}`);
  } else if (e.key === "Escape") {
    buttonActiveEffect("clear-button")
  } else if (e.key === "Backspace" || e.key === "Delete") {
    buttonActiveEffect("delete-button");
  } else if (e.key === ".") {
    buttonActiveEffect("point-button");
  } else if (e.key === "=" || e.key === "Enter") {
    buttonActiveEffect("equals-button");
  }
}

function enterInput(input) {
  if (input === "Escape" || input === "AC") {
    resetCalc();
  } else if (input === "Backspace" || input === "Delete" || input === "DEL") {
    deleteDigit();
  } else if (input === ".") {
    if (currentNumStr === null && currentOperator === null) {
      currentNumStr = memoryStr;
      memoryStr = null;
    }
    putPoint();
  } else if (input === "+/-") {
    if (currentNumStr === null && currentOperator === null) {
      currentNumStr = memoryStr;
      memoryStr = null;
    }
    changeSign();
  } else if (memoryStr === null) {
    if (currentNumStr === null) {
      if (input >= 0 && input <= 9) {
        putDigit(input);
      }
    } else if (currentOperator === null) {
      if (isOperator(input)) {
        currentOperator = input;
        memoryStr = currentNumStr;
        currentNumStr = null;
      } else if (input >= 0 && input <= 9) {
        putDigit(input);
      }
    }
  } else {
    if (isOperator(input)) {
      if (currentNumStr !== null)
        equals();
      currentOperator = input;
    } else if (input >= 0 && input <= 9) {
      if (currentOperator === null) {
        currentNumStr = memoryStr;
        memoryStr = null;
      }
      putDigit(input);
    } else if (input === "=" || input === "Enter") {
      equals();
    }
  }
  updateDisplays();
}

function convertOp(op) {
  switch (op) {
    case "×":
      return "*";
    case "÷":
      return "/";
    default:
      return op; // Do not change plus (+) or minus (-)
  }
}

function isOperator(i) {
  i = convertOp(i);
  return (i === "+" || i === "-" || i === "*" || i === "/");
}

function deleteDigit() {
  if (currentNumStr != null) currentNumStr = currentNumStr.slice(0, -1);
}

function changeSign() {
  currentNumStr = (Number(currentNumStr) * -1).toString();
}

function putDigit(digit) {
  if (currentNumStr === null)
    currentNumStr = digit;
  else
    currentNumStr += digit; // String concatenation
}

function putPoint() {
  // Only allow one decimal point to exist in a numStr!
  if (currentNumStr !== null && !currentNumStr.includes(".")) {
    currentNumStr += ".";
  }
}

function equals() {
  memoryStr = operate(Number(memoryStr), Number(currentNumStr), convertOp(currentOperator)).toString();
  currentNumStr = null;
  currentOperator = null;
}

// Does not apply changes to display by itself! Use updateDisplays()!
function resetCalcValues() {
  memoryStr = null;
  currentOperator = null;
  currentNumStr = null;
}

function resetCalc() {
  resetCalcValues();
  updateDisplays();
}

function updateDisplays() {
  let prevText = "";
  if (memoryStr !== null) prevText += memoryStr;
  if (currentOperator !== null) prevText += " " + currentOperator;

  prevDisplayDiv.textContent = prevText;
  curDisplayDiv.textContent = currentNumStr;
}

const fractionDigitsValue = 6;
const prevDisplayDiv = document.getElementById("calc-display-previous");
const curDisplayDiv = document.getElementById("calc-display-current");

let memoryStr;
let currentOperator;
let currentNumStr;

initPageElems();