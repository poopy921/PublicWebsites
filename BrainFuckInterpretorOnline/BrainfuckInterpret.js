var inputArea = document.getElementById("input");
var outputArea = document.getElementById("output");
var inputCount = document.getElementById("inputCharCount");
var outputCount = (document.getElementById("outputCharCount"));
var state = true;
var descs = {
    "+": "The plus command adds 1 to the current cell the pointer is pointing to. If it overflows above 255, the value is reset to 0.",
    "-": "The minus command subtracts 1 to the current cell the pointer is pointing to. If it underflows below 0, the value is set to 255.",
    "<": "The left arrow command moves the pointer 1 to the left.",
    ">": "The right arrow command moves the pointer 1 to the right.",
    ".": "The period command takes the current cell's value and adds its related ascii character to the output.",
    ",": "The comma command takes input from the user and puts its related ascii value into the current cell.",
    "[": "The opening bracket command marks as the start of a loop. If the code reaches the related closing bracket while the current cell's value is greater than 0, it loops back to here.",
    "]": "The closing bracket command marks as the end of a loop. If the code reaches it while the current cell's value is greater than 0, it loops back to the related opening bracket."
};
var acceptSpecial = {
    " ": 91,
    "'": 92,
    ".": 93,
    ",": 94,
    "!": 95,
    "?": 96
};
var acceptSpecialCheck = [" ", "'", ".", ",", "!", "?"];
function toByte(input) {
    if (input < 0)
        return 255 - Math.abs(input);
    if (input > 255)
        return input - 255;
    return input;
}
function interpret() {
    /*
    alert("BAM");
    var test = new Byte(50);
    alert(test.value);
    test.add(250);
    alert(test.value);
    test.value = 10;
    test.sub(20);
    alert(test.value);
    outputArea.value = `You put in ${inputArea.value}`;
    */
    var inp = inputArea.value;
    var out = "";
    var index = 500;
    var byteArray = [];
    var loopRemember = [];
    for (var i = 0; i < 1000; i++) {
        byteArray.push(0);
    }
    for (var i = 0; i < inp.length; i++) {
        if (inp[i] == "+") {
            byteArray[index] = toByte(byteArray[index] + 1);
        }
        else if (inp[i] == "-") {
            byteArray[index] = toByte(byteArray[index] - 1);
        }
        else if (inp[i] == ".") {
            out += String.fromCharCode(byteArray[index]);
        }
        else if (inp[i] == ",") {
            byteArray[index] = prompt("Enter a character").charCodeAt(0);
        }
        else if (inp[i] == "[") {
            loopRemember.push(i);
        }
        else if (inp[i] == "]") {
            if (byteArray[index] == 0 && loopRemember.length > 0) {
                loopRemember.pop();
            }
            else {
                i = loopRemember.pop() - 1;
            }
        }
        else if (inp[i] == ">") {
            index += 1;
        }
        else if (inp[i] == "<") {
            index -= 1;
        }
    }
    alert(out);
    outputArea.value = out;
    return;
}
function showPopup(typ) {
    var doc = document.getElementById("info-overlay");
    var desc = document.getElementById("info-desc");
    var title = document.getElementById("info-title");
    desc.innerHTML = descs[typ];
    title.innerHTML = "Information for " + typ;
    doc.style.setProperty("display", "block");
}
function hidePopup() {
    var doc = document.getElementById("info-overlay");
    doc.style.setProperty("display", "none");
}
function messageToBrainfuck() {
    var inp = inputArea.value;
    inp = inp.toLowerCase();
    var out = "++++++++++[->++++>+++++>+++++>+++>++++++>++++++++++>++++++++++>++++++++++>++++++++++>++++++++++>++++++++++>++++++++++>++++++++++>++++++++++>++++++++++>++++++++++>++++++++++>++++++++++>+++++++++++>+++++++++++>+++++++++++>+++++++++++>+++++++++++>+++++++++++>+++++++++++>+++++++++++>+++++++++++>+++++++++++>++++++++++++>++++++++++++>++++++++++++<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<]<++++[->++++++++<]>>->---->------>+++>+++>--->-->->>+>++>+++>++++>+++++>++++++>+++++++>++++++++>+++++++++>>+>++>+++>++++>+++++>++++++>+++++++>++++++++>+++++++++>>+>++";
    var point = 122;
    for (var i = 0; i < inp.length; i++) {
        var charVal = inp[i].charCodeAt(0);
        if (charVal >= "a".charCodeAt(0) && charVal <= "z".charCodeAt(0)) {
            while (point < charVal) {
                point++;
                out += ">";
            }
            while (point > charVal) {
                point--;
                out += "<";
            }
            out += ".";
        }
        else if (acceptSpecialCheck.indexOf(inp[i]) !== -1) {
            var specialVal = acceptSpecial[inp[i]];
            while (point < specialVal) {
                point++;
                out += ">";
            }
            while (point > specialVal) {
                point--;
                out += "<";
            }
            out += ".";
        }
    }
    outputArea.value = out;
}
function getClosestIndex(list, search) {
    var output = 0;
    if (list.length == 0) {
        return -1;
    }
    var diff = Math.abs(list[0] - search);
    for (var i = 0; i < list.length; i++) {
        if (diff > Math.abs(list[i] - search)) {
            diff = Math.abs(list[i] - search);
            output = i;
        }
    }
    return output;
}
function newMsgToBf() {
    var inp = inputArea.value;
    //inp = inp.toLowerCase();
    var out = "++++++++++[->+++>+++++>++++++++++>++++++++++++>-->+++++++>+++++++++<<<<<<<]";
    var cells = [0, 30, 50, 100, 120, 236, 70, 90];
    var index = 0;
    for (var i = 0; i < inp.length; i++) {
        var closeIndex = getClosestIndex(cells, inp.charCodeAt(i));
        while (index < closeIndex) {
            index++;
            out += ">";
        }
        while (index > closeIndex) {
            index--;
            out += "<";
        }
        while (cells[index] < inp.charCodeAt(i)) {
            cells[index]++;
            out += "+";
        }
        while (cells[index] > inp.charCodeAt(i)) {
            cells[index]--;
            out += "-";
        }
        out += ".";
    }
    outputArea.value = out;
}
function updateInCharCount() {
    inputCount.innerHTML = inputArea.value.length.toString();
}
function updateOutCharCount() {
    outputCount.innerHTML = outputArea.value.length.toString();
}
