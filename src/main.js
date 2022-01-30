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
	words.innerHTML = "";

	let list = await getwords(10);
	for (let i = 0; i < list.length; i++) {
		words.innerHTML += `<span class="word">${list[i]}</span>`;
	}

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
		return speed / timer * 60;
	}

	for (let i = 0; i < correct.length; i++) {
		chars = chars + correct[i].innerHTML.length;
	}

	return {
		cpm: speed(chars),
		wpm: speed(correct.length),
		acc: correct.length * 100 / divs.length,
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
			next();
			input.value = "";
			break;
		case "Escape":
			generate();
			break;
	}

	if (! inprogress) {
		let current = getstats();
		if (current.cpm.toString() == "NaN") {return}
		stats.innerHTML = `${current.cpm} CPM / ${current.wpm} / ${current.acc}% ACC`
	}
})
