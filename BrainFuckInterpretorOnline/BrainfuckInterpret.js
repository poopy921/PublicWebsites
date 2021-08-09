var inputArea = document.getElementById("input");
var outputArea = document.getElementById("output");
var state = true;
var Byte = /** @class */ (function () {
    function Byte(init) {
        this.value = init;
        this.goRange();
    }
    Byte.prototype.goRange = function () {
        if (this.value < 0)
            this.value = 255 - Math.abs(this.value);
        if (this.value > 255)
            this.value -= 255;
    };
    Byte.prototype.add = function (val) {
        this.value += val;
        this.goRange();
    };
    Byte.prototype.sub = function (val) {
        this.value -= val;
        this.goRange();
    };
    return Byte;
}());
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
    if (state == true) {
        doc.style.setProperty("display", "none");
    }
    if (state == false) {
        doc.style.setProperty("display", "block");
    }
}
