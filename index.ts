import { readFileSync } from "fs";
import * as rl from "readline";
const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
});

const getInput = (text: string): Promise<string> => {
    return new Promise<string>((resolve) => {
        readline.question(text + "\n", name => {
            resolve(name)
        });
    });
}

async function getFileContentByArgs() {
    const filename = process.argv[2];
    if (!Boolean(filename) && typeof filename !== "string") {
        process.exit(1);
    }
    try {
        return readFileSync(filename).toString();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

function calculateExpression(expression: string, formulaCells: string[], otherValues: number[]): number {
    let finalExpression = "";
    const splittedExpression = expression.split("");
    for (let i = 0; i < splittedExpression.length; i++) {
        const char = splittedExpression[i];
        if (["+", "-", "*", "/", "(", ")"].includes(char)) {
            finalExpression += char;
        } else if (char === "{") {
            const cellNumber = parseInt(splittedExpression[i + 1], 10);
            if (otherValues[cellNumber] !== undefined) {
                finalExpression += otherValues[cellNumber];
            } else {
                finalExpression += calculateCell(formulaCells[cellNumber], formulaCells, otherValues);
            }
            i += 2;
        } else {
            finalExpression += parseFloat(char); 
        }
    }
    return new Function('return ' + finalExpression)();
}

function calculateCell(cellValue: string, formulaCells: string[], otherValues: number[]): number {
    if (cellValue.charAt(0) === "=") {
        const expression = cellValue.slice(1);
        return calculateExpression(expression, formulaCells, otherValues)
    } else {
        return parseFloat(cellValue);
    }
}

function splitFormula(formula: string): string[] {
    return formula.replace(/ /g, "").split(",");
}

function parseFormula(formula: string): string {
    let finalString = "";
    const formulaCells = splitFormula(formula);
    const values: number[] = [];
    formulaCells.forEach((cell, idx) => {
        finalString += `[${idx}: ${calculateCell(cell, formulaCells, values)}], `;
    });
    return finalString.slice(0, finalString.length-2);
}

function changeFormula(formula: string, changeInput: string): string {
    const formulaCells = splitFormula(formula);
    const args = changeInput.split(" ").slice(1);
    const cellNumber = parseFloat(args[0]);
    const newValue = args[1];
    formulaCells[cellNumber] = newValue;
    console.log(`Cell #${cellNumber} changed to ${newValue}`);
    return formulaCells.join(",");
}

async function main() {
    let formula = await getFileContentByArgs();
    let parsedFormulaText = parseFormula(formula);
    while (true) {
        const input = await getInput(`choose what to do?\na) print the formula\nb) change some cells`);
        switch (input.charAt(0)) {
            case "a": {
                console.log(parsedFormulaText);
                break;
            }
            case "b": {
                formula = changeFormula(formula, input);
                parsedFormulaText = parseFormula(formula);
                break;
            }
            default:
                console.log("Invalid input");
        }
    }
}

main();