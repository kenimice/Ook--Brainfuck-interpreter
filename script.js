// Ook!のコマンドをBrainfuckに対応付ける辞書
const ookToBrainfuck = {
    "Ook. Ook.": "+",
    "Ook! Ook!": "-",
    "Ook. Ook?": ">",
    "Ook? Ook.": "<",
    "Ook! Ook.": ".",
    "Ook. Ook!": ",",
    "Ook! Ook?": "[",
    "Ook? Ook!": "]"
};

// BrainfuckからOok!への変換用辞書を生成
const brainfuckToOok = Object.fromEntries(Object.entries(ookToBrainfuck).map(([k, v]) => [v, k]));

// 入力されたコードを実行
function runCode() {
    const ookCode = document.getElementById("ookInput").value;
    const bfCode = document.getElementById("bfInput").value;

    let codeToRun = "";

    if (ookCode.trim()) {
        // Ook!コードをBrainfuckに変換
        codeToRun = ookToBrainfuckConverter(ookCode);
        document.getElementById("bfInput").value = codeToRun; // Brainfuckエリアに表示
    } else if (bfCode.trim()) {
        // Brainfuckコードを使用
        codeToRun = bfCode;
        document.getElementById("ookInput").value = brainfuckToOokConverter(bfCode); // Ook!エリアに表示
    } else {
        document.getElementById("output").innerText = "> No code provided.";
        return;
    }

    const output = brainfuckInterpreter(codeToRun);
    document.getElementById("output").innerText = "> " + output;
}

// Ook!コードをBrainfuckコードに変換する関数
function ookToBrainfuckConverter(ookCode) {
    const tokens = ookCode.match(/Ook[.!?] Ook[.!?]/g);
    if (!tokens) return "";
    return tokens.map(token => ookToBrainfuck[token] || "").join("");
}

// BrainfuckコードをOok!コードに変換する関数
function brainfuckToOokConverter(bfCode) {
    return bfCode.split("").map(char => brainfuckToOok[char] || "").join(" ");
}

// Brainfuckインタープリター
function brainfuckInterpreter(code) {
    const tape = Array(30000).fill(0); // メモリテープ
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

// Ook!コード入力の変更をBrainfuckコードに同期
function syncOokToBrainfuck() {
    const ookCode = document.getElementById("ookInput").value;
    document.getElementById("bfInput").value = ookToBrainfuckConverter(ookCode);
}

// Brainfuckコード入力の変更をOok!コードに同期
function syncBrainfuckToOok() {
    const bfCode = document.getElementById("bfInput").value;
    document.getElementById("ookInput").value = brainfuckToOokConverter(bfCode);
}

// デバッグモードは未実装のため、アラートで通知
function debugCode() {
    alert("Debugging mode is not implemented.");
}
