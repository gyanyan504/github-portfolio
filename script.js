const body = document.body;
const header = document.querySelector("#site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = [...document.querySelectorAll(".reveal")];
const backToTop = document.querySelector(".back-to-top");
const typedRole = document.querySelector("#typed-role");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

const roles = [
    "Information Technology Student",
    "Technical Support Learner",
    "Gamer",
    "Runner"
];

let roleIndex = 0;
let letterIndex = 0;
let deleting = false;

function setMenu(open) {
    body.classList.toggle("menu-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
}

function updateHeaderState() {
    const scrolled = window.scrollY > 16;
    header.classList.toggle("scrolled", scrolled);
    backToTop.classList.toggle("visible", window.scrollY > 520);
}

function updateActiveLink() {
    const currentSection = sections
        .map((section) => ({
            id: section.id,
            top: Math.abs(section.getBoundingClientRect().top - 120)
        }))
        .sort((a, b) => a.top - b.top)[0];

    if (!currentSection) return;

    navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${currentSection.id}`);
    });
}

function typeRole() {
    const currentRole = roles[roleIndex];
    const visibleText = currentRole.slice(0, letterIndex);
    typedRole.textContent = visibleText;

    if (!deleting && letterIndex < currentRole.length) {
        letterIndex += 1;
        window.setTimeout(typeRole, 70);
        return;
    }

    if (!deleting && letterIndex === currentRole.length) {
        deleting = true;
        window.setTimeout(typeRole, 1300);
        return;
    }

    if (deleting && letterIndex > 0) {
        letterIndex -= 1;
        window.setTimeout(typeRole, 38);
        return;
    }

    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    window.setTimeout(typeRole, 260);
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.16 });

revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
    revealObserver.observe(item);
});

menuToggle.addEventListener("click", () => {
    setMenu(!body.classList.contains("menu-open"));
});

navMenu.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    setMenu(false);
});

window.addEventListener("scroll", () => {
    updateHeaderState();
    updateActiveLink();
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
        setMenu(false);
    }
});

backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    contactForm.reset();
    formStatus.textContent = "Thanks. Your message is ready to be connected to a real email service.";
});

updateHeaderState();
updateActiveLink();
typeRole();
