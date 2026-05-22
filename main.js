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

const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");
const terminalBar = document.querySelector(".terminal-bar");
const keyPattern = /^[a-z0-9]$/i;

let idleTimerId;
const idleDelayMs = 1670;
let scrollPending = false;

const openOutput = () => {
	terminalOutput.classList.add("is-open");
};

const closeOutput = () => {
	terminalOutput.classList.remove("is-open");
};

const scrollOutput = () => {
	if (scrollPending) {
		return;
	}
	scrollPending = true;
	requestAnimationFrame(() => {
		scrollPending = false;
		terminalOutput.scrollTop = terminalOutput.scrollHeight;
	});
};

const appendLineText = (text) => {
	const line = document.createElement("div");
	line.className = "terminal-line";
	line.textContent = text;
	terminalOutput.appendChild(line);
};

const appendPromptLine = (text) => {
	const line = document.createElement("div");
	line.className = "terminal-line";

	const prompt = document.createElement("span");
	prompt.className = "terminal-prompt";
	prompt.textContent = "june@16june:~#";

	const command = document.createElement("span");
	command.textContent = ` ${text}`;

	line.appendChild(prompt);
	line.appendChild(command);
	terminalOutput.appendChild(line);
};

const finalizeOutput = () => {
	openOutput();
	scrollOutput();
};

const appendBlock = (node) => {
	terminalOutput.appendChild(node);
	finalizeOutput();
};

const appendLines = (lines) => {
	const fragment = document.createDocumentFragment();
	lines.forEach((lineText) => {
		const line = document.createElement("div");
		line.className = "terminal-line";
		line.textContent = lineText;
		fragment.appendChild(line);
	});
	terminalOutput.appendChild(fragment);
	finalizeOutput();
};

const setIdleState = (isIdle) => {
	terminalOutput.classList.toggle("is-idle", isIdle);
	if (terminalBar) {
		terminalBar.classList.toggle("is-idle", isIdle);
	}
};

const stopIdleTimer = () => {
	setIdleState(false);
	window.clearTimeout(idleTimerId);
};

const startIdleTimer = () => {
	window.clearTimeout(idleTimerId);
	idleTimerId = window.setTimeout(() => {
		setIdleState(true);
	}, idleDelayMs);
};

const formatUptime = () => {
	const start = new Date("2010-06-16T00:00:00Z");
	const now = new Date();
	const diffMs = Math.max(0, now - start);
	const totalMinutes = Math.floor(diffMs / 60000);
	const days = Math.floor(totalMinutes / 1440);
	const hours = Math.floor((totalMinutes % 1440) / 60);
	const minutes = totalMinutes % 60;
	return `${days}d ${hours}h ${minutes}m`;
};

const renderJunefetch = () => {
	const block = document.createElement("div");
	block.className = "terminal-block";

	const art = document.createElement("pre");
	art.textContent = [
		"   _                  ",
		"  (_)                 ",
		"   _ _   _ _ __   ___ ",
		"  | | | | | '_ \\ / _ \\",
		"  | | |_| | | | |  __/",
		"  | |\\__,_|_| |_|\\___|",
		" _/ |                 ",
		"|__/                  ",
	].join("\n");

	const stats = document.createElement("div");
	stats.className = "terminal-stats";
	stats.innerHTML = [
		"<br />",
		"<br />",
		`<div><span class="terminal-prompt">OS</span>: Gentoo Linux x86_64</div>`,
		`<div><span class="terminal-prompt">Shell</span>: bash 5.2</div>`,
		`<div><span class="terminal-prompt">Editor</span>: Neovim</div>`,
		`<div><span class="terminal-prompt">Window Manager</span>: Hyprland 0.54.3 (Wayland)</div>`,
		`<div><span class="terminal-prompt">Uptime</span>: ${formatUptime()}</div>`,
		"<br />",
	].join("");

	block.appendChild(art);
	block.appendChild(stats);
	appendBlock(block);
};

const renderGit = () => {
	const lines = [
		"f3a2c1d - chore: deployed grafana agent for monitoring container metrics (docker)",
		"8b91e0a - feat: deployed ai-assisted personal assistant to communicate to wayland desktops via mako (python)",
		"6ce4d33 - feat: experimented with linear algebra and matrix libraries in rust (rust)",
		"2a8bd0f - fix: updated server kernels to protect against latest copy-fail vulnerabilities (linux)",
	];
	appendLines(lines);
};

const renderPing = () => {
	const start = performance.now();
	const jitter = 8 + Math.random() * 24;
	window.setTimeout(() => {
		const latency = Math.round(performance.now() - start);
		appendLineText(`pong ${latency}ms`);
		finalizeOutput();
	}, jitter);
};

const renderHelp = () => {
	appendLineText("available: junefetch, git, ping, clear, help");
	finalizeOutput();
};

const handleCommand = (raw) => {
	const input = raw.trim();
	if (!input) {
		return;
	}

	appendPromptLine(input);
	finalizeOutput();

	switch (input) {
		case "junefetch":
			renderJunefetch();
			break;
		case "git":
			renderGit();
			break;
		case "ping":
				renderPing();
			break;
		case "clear":
			terminalOutput.innerHTML = "";
			closeOutput();
			break;
		case "help":
			renderHelp();
			break;
		default:
			appendLineText(`bash: command not found: ${input}`);
			finalizeOutput();
	}
};

if (terminalInput) {
	window.addEventListener("load", () => {
		terminalInput.focus();
		stopIdleTimer();
		startIdleTimer();
	});

	window.addEventListener("keydown", (event) => {
		if (event.metaKey || event.ctrlKey || event.altKey) {
			return;
		}

		if (document.activeElement === terminalInput) {
			return;
		}

		if (keyPattern.test(event.key)) {
			terminalInput.focus();
			stopIdleTimer();
		}
	});

	terminalInput.addEventListener("focus", () => {
		stopIdleTimer();
	});

	terminalInput.addEventListener("input", () => {
		stopIdleTimer();
	});

	terminalInput.addEventListener("blur", () => {
		startIdleTimer();
	});

	terminalInput.addEventListener("keydown", (event) => {
		if (event.key === "Enter") {
			const value = terminalInput.value;
			terminalInput.value = "";
			handleCommand(value);
		}
	});
}

if (terminalBar) {
	terminalBar.addEventListener("mouseenter", () => {
		stopIdleTimer();
	});

	terminalBar.addEventListener("mouseleave", () => {
		startIdleTimer();
	});
}

if (terminalOutput) {
	terminalOutput.addEventListener("mouseenter", () => {
		stopIdleTimer();
	});

	terminalOutput.addEventListener("mouseleave", () => {
		startIdleTimer();
	});
}
