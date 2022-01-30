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

	let list = await getwords(30);
	for (let i = 0; i < list.length; i++) {
		words.innerHTML += `<span class="word">${list[i]}</span>`;
	}

	words.children[0].classList.toggle("next");
}; generate()

function validateNext() {
	let next = document.querySelector(".word.next");

	if (input.value.replace(/.* /g, "") == next.innerHTML) {
		return true;
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
			}
			return
		}
	}
}

input.addEventListener("keydown", (e) => {
	switch(e.code) {
		case "Space":
			next();
			input.value = "";
			break;
		case "Escape":
			generate();
			break;
	}
})
