
let name = document.getElementById('name')
let weight = document.getElementById("kg");
let height = document.getElementById("cm");
let result = document.getElementById("result");
let toggleBtn = document.getElementById('themeToggle')

const clearHistoryBtn = document.getElementById('clearHistory')
const calcPage = document.querySelector('.calculator-page')
const historyPage = document.querySelector('.history-page')
const chartPage = document.querySelector('.chart-page')
const analyticPage = document.querySelector('.analytics-page')

const calcTab = document.getElementById('calcTab')
const historyTab = document.getElementById('historyTab')
const chartTab = document.getElementById('chartTab')
const analyticTab = document.getElementById('analyticTab')

const modal = document.getElementById('confirmModal')
const confirmBtn = document.getElementById('confirmBtn')
const cancelBtn = document.getElementById('cancelBtn')

const searchInput = document.getElementById('searchInput')


let bmiChart = null
let deleteId = null

weight.addEventListener('input', () => validateField(weight));
height.addEventListener('input', () => validateField(height));


calcTab.addEventListener('click', ()=> {
    calcPage.classList.remove('hidden')
    historyPage.classList.add('hidden')
    chartPage.classList.add('hidden')
    analyticPage.classList.add('hidden')

    calcTab.classList.add('active-tab')
    historyTab.classList.remove('active-tab')
    chartTab.classList.remove('active-tab')
    analyticTab.classList.remove('active-tab')
})

historyTab.addEventListener('click', ()=> {
    historyPage.classList.remove('hidden')
    calcPage.classList.add('hidden')
    chartPage.classList.add('hidden')
    analyticPage.classList.add('hidden')

    historyTab.classList.add('active-tab')
    calcTab.classList.remove('active-tab')
    chartTab.classList.remove('active-tab')
    analyticTab.classList.remove('active-tab')
})

chartTab.addEventListener('click', ()=> {
    chartPage.classList.remove('hidden')
    calcPage.classList.add('hidden')
    historyPage.classList.add('hidden')
    analyticPage.classList.add('hidden')

    chartTab.classList.add('active-tab')
    calcTab.classList.remove('active-tab')
    historyTab.classList.remove('active-tab')
    analyticTab.classList.remove('active-tab')
})

analyticTab.addEventListener('click', ()=> {
    updateAnalytics()
    renderChart()
    analyticPage.classList.remove('hidden')
    historyPage.classList.add('hidden')
    calcPage.classList.add('hidden')
    chartPage.classList.add('hidden')
    
    analyticTab.classList.add('active-tab')
    historyTab.classList.remove('active-tab')
    calcTab.classList.remove('active-tab')
    chartTab.classList.remove('active-tab')

    // renderChart() // load fresh data
})

clearHistoryBtn.addEventListener('click', ()=> {
    localStorage.removeItem('bmiHistory')
    displayHistory()
    updateAnalytics()
    renderChart()
})

cancelBtn.addEventListener('click', ()=> {
    deleteId = null
    modal.classList.add('hidden')
})

confirmBtn.addEventListener('click', ()=> {
    let history = JSON.parse(localStorage.getItem('bmiHistory')) || []

    history = history.filter(item => item.id !== deleteId)

    localStorage.setItem('bmiHistory', JSON.stringify(history))
    
    modal.classList.add('hidden')

    deleteId = null
    displayHistory()
    updateAnalytics()
    renderChart()
})

modal.addEventListener('click', (e)=> {
    if (e.target === modal) {
        modal.classList.add('hidden')
        deleteId = null
    }
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

function validateInputs(name, weight, height) {
    const errors = []

    const n = name.value
    const w = weight.value
    const h = height.value
    
    // name validation check
    if (name.value === '') {
        errors.push('pls enter your name')
        return {valid: false, errors}
    }

    // Empty check
    if (!weight.value || !height.value) {
        errors.push("Please fill in both weight and height.");
        return { valid: false, errors };
    }
    
    // Numeric check
    if (isNaN(w) || isNaN(h)) {
        errors.push("Values must be numbers.");
    }

    // Range checks (realistic human limits)
    if (w <= 0 || w > 400) {
        errors.push("Weight must be between 1 and 400 kg.");
    }

    if (h <= 0 || h > 250) {
        errors.push("Height must be between 1 and 250 cm.");
    }
    
    return {
        valid: errors.length === 0,
        errors,
        n,
        w,
        h
    };
}

function calculateBMI() {
    const validation = validateInputs(name, weight, height)

    if (!validation.valid) {
        showMessage(validation.errors[0]);

        name.classList.add('invalid')
        weight.classList.add('invalid');
        height.classList.add('invalid');

        return;
    }
    
    name.classList.remove('invalid')
    weight.classList.remove('invalid');
    height.classList.remove('invalid');
    
    let w = validation.w
    let h = validation.h / 100
    let bmi = w / (h * h)
    
    let category = ''
    
    if (bmi < 18.5) {
        result.style.color = "#3498db";
        category = "Underweight";
    } 
    else if (bmi < 25) {
        result.style.color = "#2ecc71"
        category = "Normal weight";
    } 
    else if (bmi < 30) {
        result.style.color = "#f39c12";
        category = "Overweight";
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
    
    const recommendation = getRecommendation(bmi)
    const recBox = document.getElementById('recommendation')
    
    result.style.color = recommendation.color
    result.innerText = `Your BMI is ${bmi.toFixed(1)} (${recommendation.title})`
    
    recBox.innerHTML = `
        <div class='rec-box'>
            <h3>Health Recommendation</h3>
    
            <ul>
            ${recommendation.tips.map(tip => `<li>${tip}</li>`).join('')}</ul>
        </div>
    `
    // result.innerText = `Your BMI is ${bmi.toFixed(1)} ${category}`
    
    saveBMI(name.value, w, h * 100, bmi.toFixed(1), category)
    
    displayHistory()
}

function saveBMI(name, w, h, bmi, category) {
    const history = JSON.parse(localStorage.getItem('bmiHistory')) || []
    
    history.push({
            id: Date.now(),
            name,   
            w,
            h,
            bmi,
            category,
            date: new Date().toLocaleDateString()
        })

    localStorage.setItem('bmiHistory', JSON.stringify(history))
}

updateAnalytics()
renderChart()

function displayHistory() {
    const historyList = document.getElementById('history-list')

    const history = JSON.parse(localStorage.getItem('bmiHistory')) || []
        
    if (history.length === 0) {
        clearHistoryBtn.style.display = 'none';
    } else {
        clearHistoryBtn.style.display = 'block';
    }

    if (history.length === 0) {
        historyList.innerHTML = `📊No BMI history yet.<br>
         Calculate your first BMI to get started.`
         return
    }

    historyList.innerHTML = ''
    
    history.forEach(item => {
        historyList.innerHTML += `
        <div class="history-item">
        <div class="history-main">
        <strong class='item-name'>${item.name}</strong>
        <span>BMI: ${item.bmi} (${item.category})</span>
        
        <button class="delete-btn"
        onclick="deleteHistory(${item.id})">
        🗑️
        </button>
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

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const items = document.querySelectorAll('.history-item')

    items.forEach(card => {
        const name = card.querySelector('.item-name').textContent.toLowerCase();
    
        if (name.includes(query)) {
            card.style.display = '';  // show
        } else {
            card.style.display = 'none'; // hide
        }
    });
});


function deleteHistory(id) {
    deleteId = id
    modal.classList.remove('hidden')
}

function showMessage(message) {
    const existing = document.querySelector('.messageBox')
    if (existing) existing.remove()

    const div = document.createElement('div')
    div.classList.add('messageBox')
    div.textContent = message

    document.querySelector('.content').appendChild(div)

    setTimeout(()=> {
        div.remove()
    }, 2000)
}

function validateField(input) {
    const value = Number(input.value);

    if (!input.value) {
        input.classList.remove('valid', 'invalid');
        return;
    }

    if (isNaN(value) || value <= 0) {
        input.classList.add('invalid');
        input.classList.remove('valid');
    } else {
        input.classList.add('valid');
        input.classList.remove('invalid');
    }
}

function getRecommendation(bmi) {
    if (bmi < 18.5) {
        return {
            title: "Underweight",
            color: "#3498db",
            tips: [
                "Increase calorie intake with nutrient-dense foods",
                "Add protein-rich meals (eggs, chicken, legumes)",
                "Include strength training 3–4 times per week",
                "Avoid skipping meals"
            ]
        };
    }

    if (bmi < 25) {
        return {
            title: "Normal weight",
            color: "#2ecc71",
            tips: [
                "Maintain balanced diet",
                "Continue regular exercise",
                "Stay hydrated",
                "Keep consistent sleep schedule"
            ]
        };
    }

    if (bmi < 30) {
        return {
            title: "Overweight",
            color: "#f39c12",
            tips: [
                "Reduce processed food intake",
                "Add daily walking (30–45 min)",
                "Control portion sizes",
                "Increase fiber intake"
            ]
        };
    }

    if (bmi < 35) {
        return {
            title: "Obesity Class I",
            color: "#e67e22",
            tips: [
                "Start structured workout plan",
                "Reduce sugar and refined carbs",
                "Track daily calorie intake",
                "Consult a nutritionist if possible"
            ]
        };
    }

    if (bmi < 40) {
        return {
            title: "Obesity Class II",
            color: "#d35400",
            tips: [
                "Medical guidance recommended",
                "Low-impact cardio (walking, cycling)",
                "Strict diet control",
                "Avoid sedentary lifestyle"
            ]
        };
    }

    return {
        title: "Obesity Class III",
        color: "#c0392b",
        tips: [
            "Seek medical supervision",
            "Gradual weight loss plan required",
            "Focus on low-impact movement",
            "Regular health monitoring is important"
        ]
    };
}


function renderChart() {
    const history = JSON.parse(localStorage.getItem('bmiHistory')) || [];

    const labels = history.map(item => item.date)
    const bmiData = history.map(item => Number(item.bmi))

    const ctx = document.getElementById('bmiChart')
    console.log(ctx)

    if (bmiChart) {
        bmiChart.destroy()
    } 

    bmiChart = new Chart(ctx, {
        type: 'line',
        
        data: {
            labels: labels,

            datasets: [{
                label: 'BMI',
                data: bmiData,
                tension: 0.3,
            }]
        },

        options: {
            plugins: {
                tooltip: {
                    callbacks: {

                        title: function(context) {
                            const index = context[0].dataIndex
                            const item = history[index]

                            return item ? item.name : ''
                        },

                        label: function(context) {
                            const index = context.dataIndex
                            const item = history[index]

                            if (!item) return ''

                            return [
                                `BMI: ${item.bmi}`,
                                `Weight: ${item.w} kg`,
                                `Height: ${item.h} cm`,
                                `Category: ${item.category}`
                            ]
                        }
                    }
                }
            }
        }
    })
}


function updateAnalytics() {
    const history = JSON.parse(localStorage.getItem('bmiHistory')) || []

    if (history.length === 0) {

        document.getElementById('currentBMI').textContent = '--';
        document.getElementById('highestBMI').textContent = '--';
        document.getElementById('lowestBMI').textContent = '--';
        document.getElementById('averageBMI').textContent = '--';
        document.getElementById('totalRecords').textContent = '0';

        return;
    }

    const bmiValues = history.map(item => Number(item.bmi))
    const current = bmiValues[bmiValues.length - 1]
    const highest = Math.max(...bmiValues)
    const lowest = Math.min(...bmiValues)

    const average = bmiValues.reduce((sum, value) => sum + value, 0) / bmiValues.length

    document.getElementById('currentBMI').textContent = current.toFixed(1);

    document.getElementById('highestBMI').textContent = highest.toFixed(1);

    document.getElementById('lowestBMI').textContent = lowest.toFixed(1);

    document.getElementById('averageBMI').textContent = average.toFixed(1);

    document.getElementById('totalRecords').textContent = history.length;
}

renderChart()