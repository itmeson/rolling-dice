document.addEventListener('DOMContentLoaded', () => {
    const diceContainer = document.getElementById('dice-container');
    const rollButton = document.getElementById('roll-button');
    const sumDisplay = document.getElementById('sum');
    const rollsDisplay = document.getElementById('rolls');

    // New elements
    const diceCountInput = document.getElementById('dice-count');
    const updateDiceCountButton = document.getElementById('update-dice-count');
    const setValueInput = document.getElementById('set-value');
    const setDiceValueButton = document.getElementById('set-dice-value');

    let dice = [];
    let sum = 0;
    let rolls = 0;
    let lastRolledIndex = null;

    // Data arrays for the chart
    const sumData = [];
    const rollsData = [];

    // Initialize the chart
    const ctx = document.getElementById('diceChart').getContext('2d');
    const diceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: rollsData,
            datasets: [{
                label: 'Sum of Dice',
                data: sumData,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
                tension: 0.1,
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Number of Rolls'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Sum of Dice'
                    },
                    beginAtZero: true
                }
            }
        }
    });

    // Initialize dice display function
    function initializeDice() {
        // Reset last rolled index
        lastRolledIndex = null; // **Added this line**

        // Clear existing dice
        diceContainer.innerHTML = '';
        dice = [];
        sum = 0;

        const diceCount = parseInt(diceCountInput.value);

        // Create dice
        for (let i = 0; i < diceCount; i++) {
            const value = 1; // Default value
            dice.push(value);
            sum += value;

            const die = document.createElement('div');
            die.className = 'die';
            die.textContent = value;
            diceContainer.appendChild(die);
        }

        // Reset sum and rolls display
        sumDisplay.textContent = sum;
        rollsDisplay.textContent = rolls;

        // Reset chart data
        sumData.length = 0;
        rollsData.length = 0;
        diceChart.update();
    }

    // Initial dice setup
    initializeDice();

    // Event listener for rolling a die
    rollButton.addEventListener('click', () => {
        const diceCount = dice.length;
        const randomIndex = Math.floor(Math.random() * diceCount);
        const newValue = Math.floor(Math.random() * 6) + 1;

        // Update dice array
        sum = sum - dice[randomIndex] + newValue;
        dice[randomIndex] = newValue;

        // Update display
        if (lastRolledIndex !== null && diceContainer.children[lastRolledIndex]) {
            diceContainer.children[lastRolledIndex].classList.remove('rolled');
        }
        if (diceContainer.children[randomIndex]) {
            diceContainer.children[randomIndex].classList.add('rolled');
            diceContainer.children[randomIndex].textContent = newValue;
        }
        sumDisplay.textContent = sum;
        rollsDisplay.textContent = ++rolls;

        lastRolledIndex = randomIndex;

        // Update the data arrays
        sumData.push(sum);
        rollsData.push(rolls);

        // Update the chart
        diceChart.update();
    });

    // Event listener for updating dice count
    updateDiceCountButton.addEventListener('click', () => {
        rolls = 0; // Reset rolls
        initializeDice();
    });

    // Event listener for setting all dice to a specific value
    setDiceValueButton.addEventListener('click', () => {
        const setValue = parseInt(setValueInput.value);
        if (setValue < 1 || setValue > 6) {
            alert('Please enter a value between 1 and 6.');
            return;
        }

        sum = 0;

        // Update all dice
        dice.forEach((_, index) => {
            dice[index] = setValue;
            sum += setValue;

            diceContainer.children[index].textContent = setValue;
            diceContainer.children[index].classList.remove('rolled');
        });

        // Update display
        sumDisplay.textContent = sum;

        // Reset last rolled index
        if (lastRolledIndex !== null && diceContainer.children[lastRolledIndex]) {
            diceContainer.children[lastRolledIndex].classList.remove('rolled');
            lastRolledIndex = null;
        }

        // Reset chart data
        sumData.length = 0;
        rollsData.length = 0;
        rolls = 0;
        rollsDisplay.textContent = rolls;
        diceChart.update();
    });
});
