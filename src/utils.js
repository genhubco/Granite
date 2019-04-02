const chars = [
    48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68,
    69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82,
    83, 84, 85, 86, 87, 88, 89, 90, 186, 187, 188, 189, 190,
    191, 192, 219, 220, 221, 222, 32
];

const highlightToml = (text) => {
    const rows = text.split("\n");
    const newRows = rows.map(item => {
        const string = /^[A-Za-z0-9_-]+\s=\s".*"$/;
        const stringMatch = item.match(string);
        if(stringMatch) {
            const splitted = stringMatch[0].split(" = ");
            return `<span class="string">${splitted[0]}</span> = <span class="string">${splitted[1]}</span>`;
        }
        return item;
    });
    return newRows.join('\n');
}

const selectAllPressed = (e, record) => {
    const newRecord = {...record};
    newRecord.selectionStart = 0;
    newRecord.selectionEnd = newRecord.value.length;
    return newRecord;
}

const lineUpPressed = (e, record) => {
    const newRecord = {...record};
    const textUntilSelectionStart = newRecord.value.substring(0, newRecord.selectionStart);
    const lines = textUntilSelectionStart.split("\n");
    if (lines.length < 2) {
        return newRecord;
    }
    const positionAtLastLine = lines[lines.length - 1].length;
    const positionAtSecondLastLine = Math.min(lines[lines.length - 2].length, positionAtLastLine);

    lines.pop();
    lines[lines.length - 1] = "";
    const newPosition = lines.join("\n").length + positionAtSecondLastLine;
    newRecord.selectionStart = newPosition;
    newRecord.selectionEnd = newPosition;
    return newRecord;
}

const lineDownPressed = (e, record) => {
    const newRecord = {...record};
    const textUntilSelectionStart = newRecord.value.substring(0, newRecord.selectionStart);
    const lines = textUntilSelectionStart.split("\n");
    const positionAtNextLine = lines[lines.length - 1].length;

    const allLines = newRecord.value.split("\n");
    if (allLines.length <= lines.length) {
        return newRecord;
    }
    const realPositionAtNexLine = Math.min(allLines[lines.length].length, positionAtNextLine);
    const newLines = allLines.splice(0, lines.length);
    newLines.push("");
    const newPosition = newLines.join("\n").length + realPositionAtNexLine;
    newRecord.selectionStart = newPosition;
    newRecord.selectionEnd = newPosition;

    return newRecord;
}

const lineRightPressed = (e, record) => {
    const newRecord = {...record};
    newRecord.selectionStart += 1;
    newRecord.selectionEnd = newRecord.selectionStart;
    return newRecord;
}

const lineLeftPressed = (e, record) => {
    const newRecord = {...record};
    newRecord.selectionStart -= 1;
    newRecord.selectionEnd = newRecord.selectionStart;
    return newRecord;
}

const lineStartPressed = (e, record) => {
    const newRecord = {...record};
    const textUntilSelectionStart = newRecord.value.substring(0, newRecord.selectionStart);
    const linesUntilSelectionStart = textUntilSelectionStart.split("\n");
    linesUntilSelectionStart[linesUntilSelectionStart.length - 1] = "";
    const newPosition = linesUntilSelectionStart.join("\n").length;
    newRecord.selectionStart = newPosition;
    newRecord.selectionEnd = newPosition;
    return newRecord;
}

const lineEndPressed = (e, record) => {
    const newRecord = {...record};
    const textUntilSelectionStart = newRecord.value.substring(0, newRecord.selectionStart);
    const textAfterSelectionStart = newRecord.value.substring(newRecord.selectionStart, newRecord.value.length);

    const afterSelectionStartLines = textAfterSelectionStart.split("\n");
    const newPosition = textUntilSelectionStart.length + afterSelectionStartLines[0].length;
    newRecord.selectionStart = newPosition;
    newRecord.selectionEnd = newPosition;
    return newRecord;
}

const textStartPressed = (e, record) => {
    const newRecord = {...record};
    newRecord.selectionStart = 0;
    newRecord.selectionEnd = 0;
    return newRecord;
}

const textEndPressed = (e, record) => {
    const newRecord = {...record};
    newRecord.selectionStart = newRecord.value.length;
    newRecord.selectionEnd = newRecord.value.length;
    return newRecord;
}

const deleteLinePressed = (e, record) => {
    const newRecord = {...record};
    const textUntilSelectionStart = newRecord.value.substring(0, newRecord.selectionStart);
    const textAfterSelectionStart = newRecord.value.substring(newRecord.selectionStart, newRecord.value.length);
    const lines = textUntilSelectionStart.split("\n");
    lines[lines.length - 1] = "";
    const firstPart = lines.join("\n");
    newRecord.value = firstPart + textAfterSelectionStart;
    newRecord.selectionStart = firstPart.length;
    newRecord.selectionEnd = firstPart.length;
    return newRecord;
}

const deleteLinePressedWithSelection = (e, record) => {
    const newRecord = {...record};
    const textUntilSelectionStart = newRecord.value.substring(0, newRecord.selectionStart);
    const textAfterSelectionEnd = newRecord.value.substring(newRecord.selectionEnd, newRecord.value.length);
    const lines = textUntilSelectionStart.split("\n");
    lines[lines.length - 1] = "";
    const firstPart = lines.join("\n");
    newRecord.value = firstPart + textAfterSelectionEnd;
    newRecord.selectionStart = firstPart.length;
    newRecord.selectionEnd = firstPart.length;
    return newRecord;
}

const backspaceKeyPressed = (e, record) => {
    const newRecord = {...record};
    const stringAtCurrentPosition = newRecord.value.substring(0, newRecord.selectionStart);
    const remaining = newRecord.value.substring(newRecord.selectionStart, newRecord.value.length);
    const newStringAtCurrentPosition = stringAtCurrentPosition.substring(0, stringAtCurrentPosition.length-1);
    newRecord.value = newStringAtCurrentPosition + remaining;
    newRecord.selectionStart = Math.max(0, newRecord.selectionStart - 1);
    newRecord.selectionEnd = Math.max(0, newRecord.selectionEnd - 1);
    return newRecord;
}

const backspaceKeyPressedWithSelection = (e, record) => {
    const newRecord = {...record};
    const stringAtCurrentPosition = newRecord.value.substring(0, newRecord.selectionStart);
    const selectedString = newRecord.value.substring(newRecord.selectionStart, newRecord.selectionEnd);
    const remaining = newRecord.value.substring(newRecord.selectionEnd, newRecord.value.length);
    newRecord.value = stringAtCurrentPosition + remaining;
    newRecord.selectionStart = Math.max(0, newRecord.selectionStart);
    newRecord.selectionEnd = Math.max(0, newRecord.selectionStart);
    return newRecord;
}

const enterKeyPressed = (e, record) => {
    const newRecord = {...record};
    const stringUntilSelectionStart = newRecord.value.substring(0, newRecord.selectionStart);
    const stringAfterSelectionStart = newRecord.value.substring(newRecord.selectionStart, newRecord.value.length);
    newRecord.value = stringUntilSelectionStart + "\n" + stringAfterSelectionStart;
    newRecord.selectionStart += 1;
    newRecord.selectionEnd += 1;
    return newRecord;
}

const enterKeyPressedWithSelection = (e, record) => {
    const newRecord = {...record};
    const stringUntilSelectionStart = newRecord.value.substring(0, newRecord.selectionStart);
    const stringAfterSelectionEnd = newRecord.value.substring(newRecord.selectionEnd, newRecord.value.length);
    newRecord.value = stringUntilSelectionStart + "\n" + stringAfterSelectionEnd;
    newRecord.selectionStart = stringUntilSelectionStart.length + 1;
    newRecord.selectionEnd = stringUntilSelectionStart.length + 1;
    return newRecord;
}

const tabKeyPressed = (e, record) => {
    const newRecord = {...record};
    const stringUntilSelectionStart = newRecord.value.substring(0, newRecord.selectionStart);
    const stringAfterSelectionEnd = newRecord.value.substring(newRecord.selectionEnd, newRecord.value.length);
    newRecord.value = stringUntilSelectionStart + "    " + stringAfterSelectionEnd;
    newRecord.selectionStart = stringUntilSelectionStart.length + 4;
    newRecord.selectionEnd = stringUntilSelectionStart.length + 4;
    return newRecord;
}

const charKeyPressed = (e, record) => {
    const newRecord = { ...record };
    const stringAtCurrentPosition = newRecord.value.substring(0, newRecord.selectionStart);
    const remaining = newRecord.value.substring(newRecord.selectionStart, newRecord.value.length);
    const newStringAtCurrentPosition = stringAtCurrentPosition + e.key;
    newRecord.value = newStringAtCurrentPosition + remaining;
    newRecord.selectionStart += 1;
    newRecord.selectionEnd += 1;
    return newRecord;
}

const charKeyPressedWithSelection = (e, record) => {
    const newRecord = { ...record };
    const firstPart = newRecord.value.substring(0, newRecord.selectionStart);
    const remaining = newRecord.value.substring(newRecord.selectionEnd, newRecord.value.length);
    newRecord.value = firstPart + e.key + remaining;
    newRecord.selectionStart += 1;
    newRecord.selectionEnd = newRecord.selectionStart;
    return newRecord;
}

const doubleQuotesPressed = (e, record) => {
    const newRecord = { ...record };
    const beforeSelection = newRecord.value.substring(0, newRecord.selectionStart);
    const afterSelection = newRecord.value.substring(newRecord.selectionEnd, newRecord.value.length);
    newRecord.value = beforeSelection + "\"\"" + afterSelection;
    newRecord.selectionStart = beforeSelection.length + 1;
    newRecord.selectionEnd = newRecord.selectionStart;
    return newRecord;
}

const doubleQuotesPressedWithSelection = (e, record) => {
    const newRecord = { ...record };
    const beforeSelection = newRecord.value.substring(0, newRecord.selectionStart);
    const afterSelection = newRecord.value.substring(newRecord.selectionEnd, newRecord.value.length);
    const selection = newRecord.value.substring(newRecord.selectionStart, newRecord.selectionEnd);
    newRecord.value = beforeSelection + "\"" + selection + "\"" + afterSelection;
    newRecord.selectionStart = beforeSelection.length + 1 + selection.length;
    newRecord.selectionEnd = newRecord.selectionStart;
    return newRecord;
}

const mapAllChars = () => {
    const mappedChars = chars.reduce((obj, item) => {
        const newObj = {...obj};
        //         [platform, metaKey, ctrlKey, shiftKey, altKey, keyCode, hasSelection]
        newObj[String(["mac", false, false, false, false, item, false])] = charKeyPressed;
        newObj[String(["mac", false, false, false, false, item, true])] = charKeyPressedWithSelection;
        newObj[String(["mac", false, false, true, false, item, false])] = charKeyPressed;
        newObj[String(["mac", false, false, true, false, item, true])] = charKeyPressedWithSelection;

        newObj[String(["win", false, false, false, false, item, false])] = charKeyPressed;
        newObj[String(["win", false, false, false, false, item, true])] = charKeyPressedWithSelection;
        newObj[String(["win", false, false, true, false, item, false])] = charKeyPressed;
        newObj[String(["win", false, false, true, false, item, true])] = charKeyPressedWithSelection;

        newObj[String(["other", false, false, false, false, item, false])] = charKeyPressed;
        newObj[String(["other", false, false, false, false, item, true])] = charKeyPressedWithSelection;
        newObj[String(["other", false, false, true, false, item, false])] = charKeyPressed;
        newObj[String(["other", false, false, true, false, item, true])] = charKeyPressedWithSelection;
        return newObj;
    }, {});
    return mappedChars;
}

const keysMap = {
    ...mapAllChars(),
    // [platform, metaKey, ctrlKey, shiftKey, altKey, keyCode, hasSelection]
    // select all
    [String(["mac", true, false, false, false, 65, false])]: selectAllPressed,
    [String(["mac", true, false, false, false, 65, true])]: selectAllPressed,
    [String(["win", false, true, false, false, 65, false])]: selectAllPressed,
    [String(["win", false, true, false, false, 65, true])]: selectAllPressed,
    [String(["other", false, true, false, false, 65, false])]: selectAllPressed,
    [String(["other", false, true, false, false, 65, true])]: selectAllPressed,
    // backspace
    [String(["mac", false, false, false, false, 8, false])]: backspaceKeyPressed,
    [String(["mac", false, false, false, false, 8, true])]: backspaceKeyPressedWithSelection,
    [String(["win", false, false, false, false, 8, false])]: backspaceKeyPressed,
    [String(["win", false, false, false, false, 8, true])]: backspaceKeyPressedWithSelection,
    [String(["other", false, false, false, false, 8, false])]: backspaceKeyPressed,
    [String(["other", false, false, false, false, 8, true])]: backspaceKeyPressedWithSelection,
    // enter
    [String(["mac", false, false, false, false, 13, false])]: enterKeyPressed,
    [String(["mac", false, false, false, false, 13, true])]: enterKeyPressedWithSelection,
    [String(["win", false, false, false, false, 13, false])]: enterKeyPressed,
    [String(["win", false, false, false, false, 13, true])]: enterKeyPressedWithSelection,
    [String(["other", false, false, false, false, 13, false])]: enterKeyPressed,
    [String(["other", false, false, false, false, 13, true])]: enterKeyPressedWithSelection,
    // tab
    [String(["mac", false, false, false, false, 9, false])]: tabKeyPressed,
    [String(["mac", false, false, false, false, 9, true])]: tabKeyPressed,
    [String(["win", false, false, false, false, 9, false])]: tabKeyPressed,
    [String(["win", false, false, false, false, 9, true])]: tabKeyPressed,
    [String(["other", false, false, false, false, 9, false])]: tabKeyPressed,
    [String(["other", false, false, false, false, 9, true])]: tabKeyPressed,
    // delete line
    [String(["mac", true, false, false, false, 8, false])]: deleteLinePressed,
    [String(["mac", true, false, false, false, 8, true])]: deleteLinePressedWithSelection,
    [String(["win", false, true, false, false, 8, false])]: deleteLinePressed,
    [String(["win", false, true, false, false, 8, true])]: deleteLinePressedWithSelection,
    [String(["other", false, true, false, false, 8, false])]: deleteLinePressed,
    [String(["other", false, true, false, false, 8, true])]: deleteLinePressedWithSelection,
    // line up
    [String(["mac", false, false, false, false, 38, false])]: lineUpPressed,
    [String(["mac", false, false, false, false, 38, true])]: lineUpPressed,
    [String(["win", false, false, false, false, 38, false])]: lineUpPressed,
    [String(["win", false, false, false, false, 38, true])]: lineUpPressed,
    [String(["other", false, false, false, false, 38, false])]: lineUpPressed,
    [String(["other", false, false, false, false, 38, true])]: lineUpPressed,
    // line down
    [String(["mac", false, false, false, false, 40, false])]: lineDownPressed,
    [String(["mac", false, false, false, false, 40, true])]: lineDownPressed,
    [String(["win", false, false, false, false, 40, false])]: lineDownPressed,
    [String(["win", false, false, false, false, 40, true])]: lineDownPressed,
    [String(["other", false, false, false, false, 40, false])]: lineDownPressed,
    [String(["other", false, false, false, false, 40, true])]: lineDownPressed,
    // line right
    [String(["mac", false, false, false, false, 39, false])]: lineRightPressed,
    [String(["mac", false, false, false, false, 39, true])]: lineRightPressed,
    [String(["win", false, false, false, false, 39, false])]: lineRightPressed,
    [String(["win", false, false, false, false, 39, true])]: lineRightPressed,
    [String(["other", false, false, false, false, 39, false])]: lineRightPressed,
    [String(["other", false, false, false, false, 39, true])]: lineRightPressed,
    // line left
    [String(["mac", false, false, false, false, 37, false])]: lineLeftPressed,
    [String(["mac", false, false, false, false, 37, true])]: lineLeftPressed,
    [String(["win", false, false, false, false, 37, false])]: lineLeftPressed,
    [String(["win", false, false, false, false, 37, true])]: lineLeftPressed,
    [String(["other", false, false, false, false, 37, false])]: lineLeftPressed,
    [String(["other", false, false, false, false, 37, true])]: lineLeftPressed,
    // line start
    [String(["mac", true, false, false, false, 37, false])]: lineStartPressed,
    [String(["mac", true, false, false, false, 37, true])]: lineStartPressed,
    [String(["win", false, true, false, false, 37, false])]: lineStartPressed,
    [String(["win", false, true, false, false, 37, true])]: lineStartPressed,
    [String(["other", false, true, false, false, 37, false])]: lineStartPressed,
    [String(["other", false, true, false, false, 37, true])]: lineStartPressed,
    // line end
    [String(["mac", true, false, false, false, 39, false])]: lineEndPressed,
    [String(["mac", true, false, false, false, 39, true])]: lineEndPressed,
    [String(["win", false, true, false, false, 39, false])]: lineEndPressed,
    [String(["win", false, true, false, false, 39, true])]: lineEndPressed,
    [String(["other", false, true, false, false, 39, false])]: lineEndPressed,
    [String(["other", false, true, false, false, 39, true])]: lineEndPressed,
    // text start
    [String(["mac", true, false, false, false, 38, false])]: textStartPressed,
    [String(["mac", true, false, false, false, 38, true])]: textStartPressed,
    [String(["win", false, true, false, false, 38, false])]: textStartPressed,
    [String(["win", false, true, false, false, 38, true])]: textStartPressed,
    [String(["other", false, true, false, false, 38, false])]: textStartPressed,
    [String(["other", false, true, false, false, 38, true])]: textStartPressed,
    // text end
    [String(["mac", true, false, false, false, 40, false])]: textEndPressed,
    [String(["mac", true, false, false, false, 40, true])]: textEndPressed,
    [String(["win", false, true, false, false, 40, false])]: textEndPressed,
    [String(["win", false, true, false, false, 40, true])]: textEndPressed,
    [String(["other", false, true, false, false, 40, false])]: textEndPressed,
    [String(["other", false, true, false, false, 40, true])]: textEndPressed,
    // double quotes
    [String(["mac", false, false, true, false, 222, false])]: doubleQuotesPressed,
    [String(["mac", false, false, true, false, 222, true])]: doubleQuotesPressedWithSelection,
    [String(["win", false, false, true, false, 222, false])]: doubleQuotesPressed,
    [String(["win", false, false, true, false, 222, true])]: doubleQuotesPressedWithSelection,
    [String(["other", false, false, true, false, 222, false])]: doubleQuotesPressed,
    [String(["other", false, false, true, false, 222, true])]: doubleQuotesPressedWithSelection,
};

const lifeCycleMap = {
    // undo
    [String(["mac", true, false, false, false, 90, false])]: "undo",
    [String(["mac", true, false, false, false, 90, true])]: "undo",
    [String(["win", false, true, false, false, 90, false])]: "undo",
    [String(["win", false, true, false, false, 90, true])]: "undo",
    [String(["other", false, true, false, false, 90, false])]: "undo",
    [String(["other", false, true, false, false, 90, true])]: "undo",
    // redo
    [String(["mac", true, false, true, false, 90, false])]: "redo",
    [String(["mac", true, false, true, false, 90, true])]: "redo",
    [String(["win", false, true, true, false, 90, false])]: "redo",
    [String(["win", false, true, true, false, 90, true])]: "redo",
    [String(["other", false, true, true, false, 90, false])]: "redo",
    [String(["other", false, true, true, false, 90, true])]: "redo",
    // save
    [String(["mac", true, false, false, false, 83, false])]: "save",
    [String(["mac", true, false, false, false, 83, true])]: "save",
    [String(["win", false, true, false, false, 83, false])]: "save",
    [String(["win", false, true, false, false, 83, true])]: "save",
    [String(["other", false, true, false, false, 83, false])]: "save",
    [String(["other", false, true, false, false, 83, true])]: "save",
}

export {
    keysMap,
    lifeCycleMap,
    highlightToml
};
