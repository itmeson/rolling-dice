document.addEventListener('DOMContentLoaded', () => {
    const diceContainer = document.getElementById('dice-container');
    const rollButton = document.getElementById('roll-button');
    const removeValueInput = document.getElementById('remove-value');
    const removedCountDisplay = document.getElementById('removed-count');

    let dice = Array(100).fill(1).map(() => Math.floor(Math.random() * 10) + 1);
    let removedCount = 0;
    let trials = 0;

    // Initialize dice display
    dice.forEach((value, index) => {
        const die = document.createElement('div');
        die.className = 'die';
        die.textContent = value;
        diceContainer.appendChild(die);
    });

    // Initialize the chart
    const ctx = document.getElementById('diceChart').getContext('2d');
    const diceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [0],
            datasets: [{
                label: 'Number of Dice Remaining',
                data: [100],
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
                        text: 'Number of Dice rolls'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Dice Remaining'
                    },
                    beginAtZero: true
                }
            }
        }
    });

    rollButton.addEventListener('click', () => {
        const removeValue = parseInt(removeValueInput.value);
        if (isNaN(removeValue) || removeValue < 1 || removeValue > 10) {
            alert('Please enter a valid number between 1 and 6');
            return;
        }

        const diceToRemove = [];
        dice.forEach((value, index) => {
            // Roll the dice
            const newValue = Math.floor(Math.random() * 10) + 1;
            dice[index] = newValue;
            diceContainer.children[index].textContent = newValue;

            // Highlight dice to be removed
            if (newValue === removeValue) {
                diceContainer.children[index].classList.add('to-remove');
                diceToRemove.push(index);
            }
        });

        setTimeout(() => {
            for (let i = diceToRemove.length - 1; i >= 0; i--) {
                const index = diceToRemove[i];
                diceContainer.children[index].remove();
                dice.splice(index, 1);
                removedCount++;
            }

            removedCountDisplay.textContent = removedCount;

            // Update the chart
            trials++;
            diceChart.data.labels.push(trials);
            diceChart.data.datasets[0].data.push(dice.length);
            diceChart.update();
        }, 2000);
    });
});