let timer = 0;
let inprogress = false;
let interval;

async function getwords(count) {
	let words = await (await fetch("words/en.json")).json();
	let list = [];
	
	for (let i = 0; i < count; i++) {
		list.push(words[Math.floor(Math.random()*words.length)])
	}

	return list;
}

async function generate() {
	input.focus();
	words.innerHTML = "";
	let html = "";

	let list = await getwords(document.querySelector("input[name='words']:checked").value);
	for (let i = 0; i < list.length; i++) {
		html = html + `<span class="word">${list[i]}</span>`;
	}

	words.innerHTML = html;
	words.children[0].classList.toggle("next");
}; generate()

function validateNext() {
	if (! inprogress) {
		timer = 0;
		interval = setInterval(() => {
			timer = timer + 1;
		}, 1000)

		inprogress = true;
	}

	let next = document.querySelector(".word.next");

	if (input.value.replace(/.* /g, "") == next.innerHTML) {
		return true;
	}
}

function getstats() {
	let divs = words.querySelectorAll(".word");
	let correct = words.querySelectorAll(".word.correct");
	let chars = 0;
	let speed = (speed) => {
		return Math.floor(speed / timer * 60);
	}

	for (let i = 0; i < correct.length; i++) {
		chars = chars + correct[i].innerHTML.length;
	}

	return {
		cpm: speed(chars),
		wpm: speed(correct.length),
		acc: Math.floor(correct.length * 100 / divs.length),
	}
}

function next() {
	let divs = words.querySelectorAll(".word");

	for (let i = 0; i < divs.length; i++) {
		if (divs[i].classList.contains("next")) {
			if (validateNext()) {
				divs[i].classList.add("correct");
			} else {
				divs[i].classList.add("wrong");
			}

			divs[i].classList.remove("next");
			if (divs[i + 1]) {
				divs[i + 1].classList.add("next");
			} else {
				inprogress = false;
				clearTimeout(interval);
			}
			return
		}
	}
}

input.addEventListener("keydown", (e) => {
	switch(e.code) {
		case "Space":
		case "Enter":
			e.preventDefault();
			next();
			input.value = "";

			if (! words.querySelector(".next")) {
				if (e.code == "Enter") {
					generate();
				}
			}
			break;
		case "Escape":
			generate();
			break;
	}

	if (! inprogress) {
		let current = getstats();
		if (current.cpm.toString() == "NaN") {return}
		if (current.cpm == 0) {return}
		stats.innerHTML = `${current.cpm} CPM / ${current.wpm} WPM / ${current.acc}% ACC`
	}
})
