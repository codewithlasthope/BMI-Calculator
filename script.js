let weight = document.getElementById("kg");
let height = document.getElementById("cm");
let result = document.getElementById("result");
let toggleBtn = document.getElementById('themeToggle')

// Load saved theme
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    toggleBtn.textContent = '☀️ Light Mode';
    toggleBtn.classList.remove('light');
    toggleBtn.classList.add('dark');
}

// Toggle theme
toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    const isDark = document.body.classList.contains('dark-mode');

    if (isDark) {
        toggleBtn.textContent = '☀️ Light Mode';
        toggleBtn.classList.remove('light');
        toggleBtn.classList.add('dark');

        localStorage.setItem('theme', 'dark');
    } else {
        toggleBtn.textContent = '🌙 Dark Mode';
        toggleBtn.classList.remove('dark');
        toggleBtn.classList.add('light');

        localStorage.setItem('theme', 'light');
    }
});

function calculateBMI() {
    let w = weight.value
    let h = height.value / 100
    let bmi = w / (h * h)
    result.innerText = "Your BMI is " + bmi.toFixed(2);
    if (bmi < 18.5) {
        result.style.color = "#3498db";
        result.innerText += " (Underweight)";
    } else if (bmi < 25) {
        result.style.color = "#2ecc71"
        result.innerText += " (Normal weight)";
    } else if (bmi < 30) {
        result.style.color = "#f39c12";
        result.innerText += " (Overweight)";
    } else {
        result.style.color = "#e74c3c";
        result.innerText += " (Obese)";
    }
}