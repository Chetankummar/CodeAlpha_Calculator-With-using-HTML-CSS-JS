const currentDisplay = document.getElementById("currentDisplay");
const previousDisplay = document.getElementById("previousDisplay");

let currentValue = "0";
let previousValue = "";
let operator = null;
let shouldResetDisplay = false;

/* --------------------------------
   Display
-------------------------------- */

function updateDisplay() {
    currentDisplay.textContent = currentValue;
    previousDisplay.textContent =
        previousValue && operator
            ? `${previousValue} ${operator}`
            : "";
}

/* --------------------------------
   Number input
-------------------------------- */

function appendNumber(number) {

    if (currentValue === "Error") {
        currentValue = "0";
    }

    if (shouldResetDisplay) {
        currentValue = "0";
        shouldResetDisplay = false;
    }

    if (number === "." && currentValue.includes(".")) {
        return;
    }

    if (currentValue === "0" && number !== ".") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}

/* --------------------------------
   Operators
-------------------------------- */

function chooseOperation(selectedOperator) {

    if (currentValue === "Error") {
        return;
    }

    if (operator !== null && !shouldResetDisplay) {
        calculate();
    }

    previousValue = currentValue;
    operator = selectedOperator;
    shouldResetDisplay = true;

    updateDisplay();
}

/* --------------------------------
   Calculation
-------------------------------- */

function calculate() {

    if (
        operator === null ||
        previousValue === "" ||
        currentValue === ""
    ) {
        return;
    }

    const firstNumber = parseFloat(previousValue);
    const secondNumber = parseFloat(currentValue);

    let result;

    switch (operator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "−":
            result = firstNumber - secondNumber;
            break;

        case "×":
            result = firstNumber * secondNumber;
            break;

        case "÷":

            if (secondNumber === 0) {
                currentValue = "Error";
                previousValue = "";
                operator = null;

                updateDisplay();
                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    // Avoid extremely long floating-point results
    result = Number(result.toFixed(10));

    currentValue = result.toString();

    previousValue = "";
    operator = null;
    shouldResetDisplay = true;

    updateDisplay();
}

/* --------------------------------
   Clear
-------------------------------- */

function clearCalculator() {

    currentValue = "0";
    previousValue = "";
    operator = null;
    shouldResetDisplay = false;

    updateDisplay();
}

/* --------------------------------
   Delete
-------------------------------- */

function deleteNumber() {

    if (currentValue === "Error") {
        clearCalculator();
        return;
    }

    if (
        currentValue.length === 1 ||
        currentValue === "-0"
    ) {
        currentValue = "0";
    } else {
        currentValue = currentValue.slice(0, -1);
    }

    updateDisplay();
}

/* --------------------------------
   Percentage
-------------------------------- */

function percentage() {

    if (currentValue === "Error") {
        return;
    }

    const number = parseFloat(currentValue);

    currentValue = (number / 100).toString();

    updateDisplay();
}

/* --------------------------------
   Button events
-------------------------------- */

document.querySelectorAll("[data-number]")
    .forEach(button => {

        button.addEventListener("click", () => {

            appendNumber(
                button.dataset.number
            );

        });

    });

document.querySelectorAll("[data-operation]")
    .forEach(button => {

        button.addEventListener("click", () => {

            chooseOperation(
                button.dataset.operation
            );

        });

    });

document.querySelector('[data-action="equals"]')
    .addEventListener("click", calculate);

document.querySelector('[data-action="clear"]')
    .addEventListener("click", clearCalculator);

document.querySelector('[data-action="delete"]')
    .addEventListener("click", deleteNumber);

document.querySelector('[data-action="percent"]')
    .addEventListener("click", percentage);


/* --------------------------------
   Keyboard support
-------------------------------- */

document.addEventListener("keydown", event => {

    const key = event.key;

    // Numbers
    if (
        /^[0-9]$/.test(key)
    ) {
        appendNumber(key);
        return;
    }

    // Decimal
    if (key === ".") {
        appendNumber(".");
        return;
    }

    // Operators
    switch (key) {

        case "+":
            chooseOperation("+");
            break;

        case "-":
            chooseOperation("−");
            break;

        case "*":
        case "x":
        case "X":
            chooseOperation("×");
            break;

        case "/":
            event.preventDefault();
            chooseOperation("÷");
            break;

        case "%":
            percentage();
            break;

        case "Enter":
        case "=":
            calculate();
            break;

        case "Backspace":
            deleteNumber();
            break;

        case "Escape":
        case "Delete":
            clearCalculator();
            break;
    }

    updateDisplay();
});


/* --------------------------------
   Initial display
-------------------------------- */

updateDisplay();