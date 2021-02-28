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
    return "2,5,=4*{1}";
    // const filename = process.argv[2];
    // if (!Boolean(filename) && typeof filename !== "string") {
    //     process.exit(1);
    // }
    // try {
    //     return readFileSync(filename);
    // } catch (error) {
    //     console.error(error);
    //     process.exit(1);
    // }
}

async function main() {
    const formula = await getFileContentByArgs();
    while (true) {
        const input = await getInput(`
            choose what to do?
            a) print the formula
            b) change some cells
        `);
        switch (input.charAt(0)) {
            case "a": {
                console.log("a");
                // printForula();
                break;
            }
            case "b": {
                // formula = changeFormula(formula, input);
                console.log("b");
                break;
            }
            default:
                console.log("Invalid input");
        }
    }
}

main();