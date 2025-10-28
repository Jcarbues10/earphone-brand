let nextButton = document.getElementById('next');
let prevButton = document.getElementById('prev');
let carousel = document.querySelector('.carousel');
let listHTML = document.querySelector('.carousel .list');
let seeMoreButtons = document.querySelectorAll('.seeMore');
let backButton = document.getElementById('back');

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme'); // 'dark' | 'light' | null
function applyTheme(theme){
    const isLight = theme === 'light';
    document.body.classList.toggle('light', isLight);
    document.documentElement.classList.toggle('light', isLight);
    document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
    if (themeToggle){
        themeToggle.textContent = isLight ? '🌞' : '🌙';
    }
}
const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');
applyTheme(initialTheme);
if (themeToggle){
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('light') ? 'dark' : 'light';
        localStorage.setItem('theme', nextTheme);
        applyTheme(nextTheme);
    });
}

nextButton.onclick = function(){
    showSlider('next');
}
prevButton.onclick = function(){
    showSlider('prev');
}
let unAcceppClick;
const showSlider = (type) => {
    nextButton.style.pointerEvents = 'none';
    prevButton.style.pointerEvents = 'none';

    carousel.classList.remove('next', 'prev');
    let items = document.querySelectorAll('.carousel .list .item');
    if(type === 'next'){
        listHTML.appendChild(items[0]);
        carousel.classList.add('next');
    }else{
        listHTML.prepend(items[items.length - 1]);
        carousel.classList.add('prev');
    }
    clearTimeout(unAcceppClick);
    unAcceppClick = setTimeout(()=>{
        nextButton.style.pointerEvents = 'auto';
        prevButton.style.pointerEvents = 'auto';
    }, 2000)
}
seeMoreButtons.forEach((button) => {
    button.onclick = function(){
        carousel.classList.remove('next', 'prev');
        carousel.classList.add('showDetail');
    }
});
backButton.onclick = function(){
    carousel.classList.remove('showDetail');
}

// Touch/Swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;

carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, false);

carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, false);

function handleSwipe() {
    const swipeThreshold = 50;
    const xDiff = touchStartX - touchEndX;
    const yDiff = Math.abs(touchStartY - touchEndY);
    
    // Only trigger if horizontal swipe is greater than vertical
    if (Math.abs(xDiff) > swipeThreshold && Math.abs(xDiff) > yDiff) {
        if (!carousel.classList.contains('showDetail')) {
            if (xDiff > 0) {
                // Swipe left - next
                showSlider('next');
            } else {
                // Swipe right - prev
                showSlider('prev');
            }
        }
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!carousel.classList.contains('showDetail')) {
        if (e.key === 'ArrowRight') {
            showSlider('next');
        } else if (e.key === 'ArrowLeft') {
            showSlider('prev');
        }
    } else if (e.key === 'Escape') {
        carousel.classList.remove('showDetail');
    }
});