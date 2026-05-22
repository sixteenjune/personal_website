const phrases = [
	"manages ai agents",
	"runs web servers",
	"ships clean pipelines",
	"builds linux tooling",
	"tunes local llms",
];

const typingText = document.getElementById("typing-text");
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

const typeSpeed = 70;
const deleteSpeed = 40;
const pauseTime = 1400;

const tick = () => {
	const current = phrases[phraseIndex];

	if (!deleting) {
		charIndex += 1;
		typingText.textContent = `[${current.slice(0, charIndex)}]`;
		if (charIndex === current.length) {
			deleting = true;
			setTimeout(tick, pauseTime);
			return;
		}
	} else {
		charIndex -= 1;
		typingText.textContent = `[${current.slice(0, charIndex)}]`;
		if (charIndex === 0) {
			deleting = false;
			phraseIndex = (phraseIndex + 1) % phrases.length;
		}
	}

	setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
};

tick();
