var inputArea = document.getElementById("input");
var outputArea = document.getElementById("output");
var inputCount = document.getElementById("inputCharCount");
var outputCount = (document.getElementById("outputCharCount"));
var specialChars = "∧∨¬→↔≡∀∃≠";
var getOr = /(?<!\\)(?:\\\\)*\|\||(?<!\\)(?:\\\\)*OR/gm;
var getAnd = /(?<!\\)(?:\\\\)*\&\&|(?<!\\)(?:\\\\)*AND/gm;
var getNot = /(?<!\\)(?:\\\\)*\!|(?<!\\)(?:\\\\)*\~|(?<!\\)(?:\\\\)*NOT/gm;
var getThen = /(?<!\\)(?:\\\\)*\-\>|(?<!\\)(?:\\\\)*THEN/gm;
var getIff = /(?<!\\)(?:\\\\)*\<\-\>|(?<!\\)(?:\\\\)*IFF/gm;
var getEquals = /(?<!\\)(?:\\\\)*\=\=|(?<!\\)(?:\\\\)*EQUALS|(?<!\\)(?:\\\\)*EQUAL/gm;
var getAll = /(?<!\\)(?:\\\\)*qA|(?<!\\)(?:\\\\)*ALL|(?<!\\)(?:\\\\)*FOR ALL|(?<!\\)(?:\\\\)*FOR EVERY/gm;
var getExists = /(?<!\\)(?:\\\\)*qE|(?<!\\)(?:\\\\)*EXISTS|(?<!\\)(?:\\\\)*FOR SOME/gm;
var getNotEqual = /(?<!\\)(?:\\\\)*!=|(?<!\\)(?:\\\\)*~=|(?<!\\)(?:\\\\)*NOT EQUALS|(?<!\\)(?:\\\\)*NOT EQUAL/gm;
var state = true;
var descs = {
    "-and": "The AND statement outputs 1 only if both sides are true, and outputs false otherwise.",
    "-or": "The OR statements outputs 1 if any of the sides are true. This also applies to both statements being true. It only outputs false if both sides are false.",
    "-not": "The NOT statement inverts the value of the variable in front of it. True turns to False, and False turns to True.",
    "-then": "The THEN, or conditional, statement only outputs false when the left side is true and the right side is false, and is true for any other combination",
    "-iff": "The IFF, or biconditional, statement only outputs true when both sides have the same value, and outputs false if they are different.",
    "-equals": "The EQUALS statement says that a logical statement is equivalent to another logical statement. There is also a NOT EQUALS statement that says the opposite: that the two logical statements are false.",
    "-all": "The ALL quantifier says that every value in a domain x outputs True in a function f(x). It is False when at least one value of x in f(x) is False.",
    "-exists": "The EXISTS quantifier says that at least one value in a domain x outputs True in a function f(x). It is only False when none of the values of x in f(x) equate to True.",
    "-symbolshort": "&& for AND<br>|| for OR<br>~ or ! for NOT<br>-> for THEN<br><-> for IFF<br>== for EQUALS (you can also add a NOT for not equals)<br>qA for ALL (think of it as quantifierAll)<br>qE for EXISTS (think of it as quantifierExists)"
};
function toByte(input) {
    if (input < 0)
        return 255 - Math.abs(input);
    if (input > 255)
        return input - 255;
    return input;
}
function wordsToLogic() {
    var input = inputArea.value;
    input = input.replace(getIff, specialChars[4]);
    input = input.replace(getAll, specialChars[6]);
    input = input.replace(getExists, specialChars[7]);
    input = input.replace(getNotEqual, specialChars[8]);
    input = input.replace(getAnd, specialChars[0]);
    input = input.replace(getOr, specialChars[1]);
    input = input.replace(getNot, specialChars[2]);
    input = input.replace(getThen, specialChars[3]);
    input = input.replace(getEquals, specialChars[5]);
    input = input.replace(/[ ]/gm, "");
    outputArea.value = input;
}
function wordsToLogicSa() {
    var input = inputArea.value;
    input = input.replace(/IFF|<->/gm, specialChars[4]);
    input = input.replace(/FOR EVERY|FOR ALL|qA|ALL/gm, specialChars[6]);
    input = input.replace(/FOR SOME|FOR SOME|qE|EXISTS/gm, specialChars[7]);
    input = input.replace(/NOT EQUALS|NOT EQUAL|~=|!=/gm, specialChars[8]);
    input = input.replace(/&&|AND/gm, specialChars[0]);
    input = input.replace(/\|\||OR/gm, specialChars[1]);
    input = input.replace(/~|NOT|!/gm, specialChars[2]);
    input = input.replace(/->|THEN/gm, specialChars[3]);
    input = input.replace(/==|EQUALS|EQUAL/gm, specialChars[5]);
    input = input.replace(/[ ]/gm, "");
    outputArea.value = input;
}
function logicToWords() { }
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
function updateInCharCount() {
    inputCount.innerHTML = inputArea.value.length.toString();
}
function updateOutCharCount() {
    outputCount.innerHTML = outputArea.value.length.toString();
}
