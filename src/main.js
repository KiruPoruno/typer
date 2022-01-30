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
}
