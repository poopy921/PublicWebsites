var inputArea = document.getElementById("input");
var outputArea = document.getElementById("output");
var state = true;
var descs = {
    "+": "The plus command adds 1 to the current array element the pointer is pointing to. If it overflows above 255, the value is reset to 0.",
    "-": "The minus command subtracts 1 to the current array element the pointer is pointing to. If it underflows below 0, the value is set to 255.",
    "<": "The left arrow command moves the pointer 1 to the left.",
    ">": "The right arrow command moves the pointer 1 to the right.",
    ",": "The comma command takes the current array element's value and turns it into its related ascii character.",
    ".": "The period command takes input from the user and turns it into its related ascii value.",
    "[": "The opening bracket command marks as the start of a loop. If the code reaches the related closing bracket while the current array element's value is greater than 0, it loops back to here.",
    "]": "The closing bracket command marks as the end of a loop. If the code reaches it while the current array element's value is greater than 0, it loops back to the related openind bracket."
};
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
