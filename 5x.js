/* ---------- starfield background ---------- */
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = document.body.scrollHeight;
  buildStars();
}

function buildStars(){
  const count = Math.floor((canvas.width * canvas.height) / 9000);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.3 + 0.2,
    baseAlpha: Math.random() * 0.6 + 0.2,
    speed: Math.random() * 0.015 + 0.005,
    phase: Math.random() * Math.PI * 2,
  }));
}

function draw(t){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#F4F3F8";
  for (const s of stars){
    const twinkle = Math.sin(t * s.speed + s.phase) * 0.35;
    ctx.globalAlpha = Math.max(0, s.baseAlpha + twinkle);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
}

window.addEventListener("resize", resize);
resize();
requestAnimationFrame(draw);

/* ---------- scroll reveal ---------- */
const revealTargets = document.querySelectorAll(".profile-inner, .closing, .portrait");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting){
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.25 });

revealTargets.forEach((el) => observer.observe(el));

/* ---------- parallax portrait movement (AAA-style depth) ---------- */
const parallaxEls = Array.from(document.querySelectorAll(".portrait"));

function updateParallax(){
  const viewportCenter = window.innerHeight / 2;
  parallaxEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const elCenter = rect.top + rect.height / 2;
    const distance = elCenter - viewportCenter;
    const speed = parseFloat(el.dataset.speed || "0.15");
    const offset = distance * speed * -1;
    el.style.setProperty("--parallax", `${offset}px`);
    el.style.transform = el.classList.contains("visible")
      ? `translateY(${offset}px)`
      : `scale(0.88) translateY(60px)`;
  });
}

let ticking = true;
function loop(){
  updateParallax();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);