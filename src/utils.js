function makeIterator(array) {
	let nextIndex = -1;
	return {
		next: () => {
			nextIndex += 1;
			return {
				value: array[nextIndex],
				done: nextIndex >= array.length
			};
		},
		peek: () => {
			const next = nextIndex + 1;
			return {
				value: array[next],
				done: next >= array.length
			};
		}
	};
}

function scanNext(iter, pattern) {
	const re = new RegExp(pattern);
	const nextCh = iter.next().value;
	let str = nextCh;
	while (!iter.peek().done) {
		const peekCh = iter.peek().value;
		if (!re.test(peekCh)) {
			return str;
		}
		const ch = iter.next().value;
		str += ch;
	}
	return str;
}

function scanGroup(iter, ch) {
	const chars = new RegExp("[a-zA-Z]");
	const numbers = new RegExp("[0-9]");
	if (ch === "~") {
		return scanNext(iter, "[|&^]");
	}
	if (ch === "-") {
		return scanNext(iter, ">");
	}
	if (chars.test(ch)) {
		return scanNext(iter, "[a-zA-Z0-9]")
	}
	if (numbers.test(ch)) {
		return scanNext(iter, "[0-9]");
	}

	iter.next();
	return ch;
}

function getGroupType(str) {
	const chars = new RegExp("[a-zA-Z]");
	const numbers = new RegExp("[0-9]");
	const nones = [" ", "\t", "\n"];
	const signs = ["(", ")", "{", "}", ",", ";", "=", "->"];
	const operations = ["~", "~|", "~&", "~^", "|", "&", "^", "@"];
	const values = ["true", "false"];
	const keywords = ["let", "func", "test"];
	if (nones.includes(str)) {
		return "none";
	}
	if (signs.includes(str)) {
		return "sign";
	}
	if (operations.includes(str)) {
		return "operation";
	}
	if (values.includes(str)) {
		return "value";
	}
	if (keywords.includes(str)) {
		return "keyword";
	}
	if (chars.test(str)) {
		return "symbol";
	}
	if (numbers.test(str)) {
		return "value";
	}

	return "none";
}

function getTypeColor(type, previusToken, nextToken) {
	const sign = "#929ba3";
	const keyword = "#e22bdf";
	const value = "#d97512";
	const operation = "#0d98ba";
	const fnDef = "#007fff";

	if (type === "sign") {
		return sign;
	}

	if (type === "keyword") {
		return keyword;
	}

	if (type === "value") {
		return value;
	}

	if (type === "operation") {
		return operation;
	}

	if (previusToken === "=" && type === "symbol" && nextToken == "(") {
		return operation;
	}

	if ((previusToken === "func" || previusToken === "test") && type === "symbol") {
		return fnDef;
	}

	return "black";
}

function renderEmergence(text) {
	const result = [];
	const iter = makeIterator(text);

	let prevToken = "";
	while (!iter.peek().done) {
		const ch = iter.peek().value;
		const group = scanGroup(iter, ch);
		const type = getGroupType(group);
		const color = getTypeColor(type, prevToken, iter.peek().value);
		if (type !== "none") {
			prevToken = group;
		}
		result.push(`<span style="color: ${color};">${group}</span>`);
	}

	return result.join("");
}

function renderErrors(text, errors = []) {
	const arrToProcess = errors;
	let sorted = arrToProcess.sort((a, b) => b.pos[0] - a.pos[0]);
	let newText = text;
	sorted.forEach(item => {
		const before = newText.substring(0, item.pos[0]);
		const str = newText.substring(item.pos[0], item.pos[0] + item.pos[1]);
		const after = newText.substring(item.pos[0] + item.pos[1], newText.length);
		newText = before + `<span class="granit-error" style="color: #ff2052; text-decoration: underline;">${str}</span>` + after;
	});
	return newText;
}

function autoClose(record, open, close) {
	const beforeSelection = record.value.substring(0, record.selectionStart);
	const afterSelection = record.value.substring(record.selectionEnd, record.value.length);
	const selection = record.value.substring(record.selectionStart, record.selectionEnd);
	record.value = beforeSelection + open + selection + close + afterSelection;
	record.selectionStart = beforeSelection.length + 1;
	record.selectionEnd = record.selectionStart + selection.length;
	return record;
}

const keyMap = {
	// double quotes
	"mac+shift+222": (record) => autoClose(record, "\"", "\""),
	"win+shift+222": (record) => autoClose(record, "\"", "\""),
	"other+shift+222": (record) => autoClose(record, "\"", "\""),
	// curly braces
	"mac+shift+219": (record) => autoClose(record, "{", "}"),
	"win+shift+219": (record) => autoClose(record, "{", "}"),
	"other+shift+219": (record) => autoClose(record, "{", "}"),
};

const lifeCycleMap = {
	// undo
	"mac+cmd+90": "undo",
	"win+ctrl+90": "undo",
	"other+ctrl+90": "undo",
	// redo
	"mac+cmd+shift+90": "redo",
	"win+ctrl+shift+90": "redo",
	"other+ctrl+shift+90": "redo",
	// save
	"mac+cmd+83": "save",
	"win+ctrl+83": "save",
	"other+ctrl+83": "save"
}

export {
	keyMap,
	lifeCycleMap,
	renderEmergence,
	renderErrors
};