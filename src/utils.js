function renderEmergence(text) {
	let fnName = /[\s|\n|\t]?(fn|gene)\s(\w+)(?:\s|\()/g;
	let keywords = /[\s|\n|\t]?(let)[\s|\n|\t]/g;
	let signs = /(=|~\||~&|~^|~|&|\||->)/g;
	let fnCall = /(\w+)\(/g;

	text = text.replace(signs, (match, p1) => match
		.replace(p1, `<span class="granit-sign" style="color: #929ba3;">${p1}</span>`)
	).replace(fnName, (match, p1, p2) => match
		.replace(p2, `<span class="granit-definition" style="color: #007fff;">${p2}</span>`)
		.replace(p1, `<span class="granit-keyword" style="color: #e22bdf;">${p1}</span>`)
	).replace(keywords, (match, p1) => match
		.replace(p1, `<span class="granit-keyword" style="color: #e22bdf;">${p1}</span>`)
	).replace(fnCall, (match, p1) => match
		.replace(p1, `<span class="granit-call" style="color: #0d98ba;">${p1}</span>`)
	);

	return text;
}

function renderErrors(text, errors = [], warnings = []) {
	const arrToProcess = errors.length ? errors : warnings;
	const color = errors.length ? "#ff2052" : "#ffbf00";
	let sorted = arrToProcess.sort((a, b) => b.pos[0] - a.pos[0]);
	let newText = text;
	sorted.forEach(item => {
		const before = newText.substring(0, item.pos[0]);
		const str = newText.substring(item.pos[0], item.pos[0] + item.pos[1]);
		const after = newText.substring(item.pos[0] + item.pos[1], newText.length);
		newText = before + `<span class="granit-error" style="color: ${color}; text-decoration: underline;">${str}</span>` + after;
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