let weight = document.getElementById("kg");
let height = document.getElementById("cm");
let result = document.getElementById("result");
let toggleBtn = document.getElementById('themeToggle')

const clearHistoryBtn = document.getElementById('clearHistory')
const calcPage = document.querySelector('.calculator-page')
const historyPage = document.querySelector('.history-page')
const chartPage = document.querySelector('.chart-page')

const calcTab = document.getElementById('calcTab')
const historyTab = document.getElementById('historyTab')
const chartTab = document.getElementById('chartTab')

let category = ''

calcTab.addEventListener('click', ()=> {
    calcPage.classList.remove('hidden')
    historyPage.classList.add('hidden')
    chartPage.classList.add('hidden')

    calcTab.classList.add('active-tab')
    historyTab.classList.remove('active-tab')
    chartTab.classList.remove('active-tab')
})

historyTab.addEventListener('click', ()=> {
    historyPage.classList.remove('hidden')
    calcPage.classList.add('hidden')
    chartPage.classList.add('hidden')
    
    historyTab.classList.add('active-tab')
    calcTab.classList.remove('active-tab')
    chartTab.classList.remove('active-tab')
})

chartTab.addEventListener('click', ()=> {
    chartPage.classList.remove('hidden')
    calcPage.classList.add('hidden')
    historyPage.classList.add('hidden')

    chartTab.classList.add('active-tab')
    calcTab.classList.remove('active-tab')
    historyTab.classList.remove('active-tab')
})

clearHistoryBtn.addEventListener('click', ()=> {
    localStorage.removeItem('bmiHistory')
    displayHistory()
})

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
    
    if (!weight.value || !height.value) {
        showMessage('Please fill up the details!')
        return
    }

    if (bmi < 18.5) {
        result.style.color = "#3498db";
        category = " Underweight";
    } 
    else if (bmi < 25) {
        result.style.color = "#2ecc71"
        category = " Normal weight";
    } 
    else if (bmi < 30) {
        result.style.color = "#f39c12";
        category = " Overweight";
    } 
    else if (bmi < 35) {
        result.style.color = '#e67e22'
        category = 'Obesity Class I';
    }
    else if (bmi < 40) {
        result.style.color = '#d35400'
        category = 'Obesity Class II';
    }
    else {
        result.style.color = '#c0392b'
        category = 'Obesity Class III';
    }
    
    result.innerText = `Your BMI is ${bmi.toFixed(1)} ${category}`

    saveBMI(w, height.value, bmi.toFixed(1), category)

    displayHistory()
}

function saveBMI(w, h, bmi, category) {
    const history = JSON.parse(localStorage.getItem('bmiHistory')) || []

        history.push({
        w,
        h,
        bmi,
        category,
        date: new Date().toLocaleDateString()
    })

    localStorage.setItem('bmiHistory', JSON.stringify(history))
}

function displayHistory() {
    const historyList = document.getElementById('history-list')

    const history = JSON.parse(localStorage.getItem('bmiHistory')) || []
        
    if (history.length === 0) {
        clearHistoryBtn.style.display = 'none';
    } else {
        clearHistoryBtn.style.display = 'block';
    }

    if (history.length === 0) {
        historyList.innerHTML = 'No records yet'
        return
    }

    historyList.innerHTML = ''

    history.forEach(item => {
        historyList.innerHTML += `
            <div class="history-item">
                <div class="history-main">
                    <strong>BMI- ${item.bmi}</strong>
                    <span>${item.category}</span>
                </div>

                <div class="history-info">
                    ${item.w}kg • ${item.h}cm
                </div>

                <small>${item.date}</small>
            </div>
            `
    })
}

displayHistory()

function showMessage(message) {
    const div = document.createElement('div')
    div.classList.add('messageBox')

    div.textContent = message

    document.querySelector('.content').appendChild(div)

    setTimeout(()=> {
        div.remove()
    }, 2000)
}
