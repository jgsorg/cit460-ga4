// contact form
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	formStatus.textContent = 'Sending...';

	const data = new FormData(form);

	try {
		const res = await fetch(form.action, {
			method: form.method || 'POST',
			body: data,
			headers: {Accept: 'application/json'},
		});

		if (res.ok) {
			formStatus.textContent = 'Sent! Thanks — I’ll reply soon.';
			launchConfetti();
			form.reset();
		} else {
			const out = await res.json().catch(() => null);
			formStatus.textContent =
				out?.errors?.[0]?.message ||
				'Oops...something went wrong. Please try again or email me directly.';
		}
	} catch {
		formStatus.textContent = 'Network error—please try again in a moment.';
	}
});

// confetti!!!!!!!!!!
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
	canvas.width = window.innerWidth * devicePixelRatio;
	canvas.height = window.innerHeight * devicePixelRatio;
	ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function launchConfetti() {
	const colors = ['#ff4fa3', '#2bb673', '#fff7ee', '#ff87c2', '#72e0b1'];
	const pieces = Array.from({length: 120}, () => ({
		x: Math.random() * window.innerWidth,
		y: -20 - Math.random() * 200,
		r: 3 + Math.random() * 5,
		c: colors[Math.floor(Math.random() * colors.length)],
		vx: -2 + Math.random() * 4,
		vy: 2 + Math.random() * 5,
		rot: Math.random() * Math.PI,
		vr: -0.2 + Math.random() * 0.4,
	}));

	let t = 0;
	function frame() {
		t++;
		ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

		pieces.forEach((p) => {
			p.x += p.vx;
			p.y += p.vy;
			p.rot += p.vr;
			p.vy += 0.03; // gravity

			ctx.save();
			ctx.translate(p.x, p.y);
			ctx.rotate(p.rot);
			ctx.fillStyle = p.c;
			ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
			ctx.restore();
		});

		if (t < 140) requestAnimationFrame(frame);
		else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	}
	frame();
}
