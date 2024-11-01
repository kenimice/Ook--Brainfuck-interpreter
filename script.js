const brainfuckToOok = Object.fromEntries(Object.entries(ookToBrainfuck).map(([k, v]) => [v, k]));

function runCode() {
    const ookCode = document.getElementById("ookInput").value;
    const bfCode = document.getElementById("bfInput").value;

    let codeToRun = "";

    if (ookCode.trim()) {
        // Ook!コードが入力されている場合、Brainfuckに変換
        codeToRun = ookToBrainfuckConverter(ookCode);
        document.getElementById("bfInput").value = codeToRun; // Brainfuckエリアに表示
    } else if (bfCode.trim()) {
        // Brainfuckコードが入力されている場合、Ook!に変換
        codeToRun = bfCode;
        document.getElementById("ookInput").value = brainfuckToOokConverter(bfCode); // Ook!エリアに表示
    } else {
        document.getElementById("output").innerText = "> No code provided.";
        return;
    }

    const output = brainfuckInterpreter(codeToRun);
    document.getElementById("output").innerText = "> " + output;
}

function ookToBrainfuckConverter(ookCode) {
    const tokens = ookCode.match(/Ook[.!?] Ook[.!?]/g);
    if (!tokens) return "";
    return tokens.map(token => ookToBrainfuck[token] || "").join("");
}

function brainfuckToOokConverter(bfCode) {
    return bfCode.split("").map(char => brainfuckToOok[char] || "").join(" ");
}

function brainfuckInterpreter(code) {
    const tape = Array(30000).fill(0);
    let pointer = 0;
    let output = "";
    let loopStack = [];

    for (let i = 0; i < code.length; i++) {
        const command = code[i];

        switch (command) {
            case '>':
                pointer++;
                break;
            case '<':
                pointer--;
                break;
            case '+':
                tape[pointer]++;
                break;
            case '-':
                tape[pointer]--;
                break;
            case '.':
                output += String.fromCharCode(tape[pointer]);
                break;
            case ',':
                // 入力は省略
                break;
            case '[':
                if (tape[pointer] === 0) {
                    let openBrackets = 1;
                    while (openBrackets > 0) {
                        i++;
                        if (code[i] === '[') openBrackets++;
                        if (code[i] === ']') openBrackets--;
                    }
                } else {
                    loopStack.push(i);
                }
                break;
            case ']':
                if (tape[pointer] !== 0) {
                    i = loopStack[loopStack.length - 1];
                } else {
                    loopStack.pop();
                }
                break;
        }
    }
    return output;
}

function syncOokToBrainfuck() {
    const ookCode = document.getElementById("ookInput").value;
    document.getElementById("bfInput").value = ookToBrainfuckConverter(ookCode);
}

function syncBrainfuckToOok() {
    const bfCode = document.getElementById("bfInput").value;
    document.getElementById("ookInput").value = brainfuckToOokConverter(bfCode);
}

function debugCode() {
    alert("Debugging mode is not implemented.");
}