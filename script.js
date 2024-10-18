document.getElementById('calculator-form').addEventListener('submit', function (e) {
    e.preventDefault();
    
    const loanAmount = parseFloat(document.getElementById('loan-amount').value);
    const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100;
    const loanTerm = parseInt(document.getElementById('loan-term').value);

    // Calculate monthly payment
    const monthlyInterestRate = interestRate / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

    // Display results
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>Results</h2>
        <p>Monthly Payment: $${monthlyPayment.toFixed(2)}</p>
        <p>Total Payment: $${(monthlyPayment * numberOfPayments).toFixed(2)}</p>
        <p>Total Interest: $${((monthlyPayment * numberOfPayments) - loanAmount).toFixed(2)}</p>
    `;

    // Update charts
    updateCharts(loanAmount, interestRate, loanTerm, monthlyPayment);
});

function updateCharts(loanAmount, interestRate, loanTerm, monthlyPayment) {
    const totalPayment = monthlyPayment * loanTerm * 12;
    const totalInterest = totalPayment - loanAmount;

    // Pie Chart
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    const pieChart = new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['Principal', 'Total Interest'],
            datasets: [{
                data: [loanAmount, totalInterest],
                backgroundColor: ['#36a2eb', '#ff6384'],
            }]
        },
    });

    // Bar Chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Loan Amount', 'Total Payment', 'Total Interest'],
            datasets: [{
                label: 'Amounts',
                data: [loanAmount, totalPayment, totalInterest],
                backgroundColor: ['#36a2eb', '#ff6384', '#ffce56'],
            }]
        },
    });

    // Histogram
    const histogramCtx = document.getElementById('histogram').getContext('2d');
    const histogramChart = new Chart(histogramCtx, {
        type: 'bar',
        data: {
            labels: Array.from({ length: loanTerm }, (_, i) => i + 1),
            datasets: [{
                label: 'Yearly Payments',
                data: Array(loanTerm).fill(monthlyPayment * 12),
                backgroundColor: '#ff6384',
            }]
        },
    });
}

function printResults() {
    const resultsDiv = document.getElementById('results');
    const newWin = window.open('');
    newWin.document.write(`<html><head><title>Print Results</title></head><body>${resultsDiv.innerHTML}</body></html>`);
    newWin.print();
}

function downloadResults() {
    const resultsDiv = document.getElementById('results').innerText;
    const blob = new Blob([resultsDiv], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'lending_calculator_results.txt';
    link.click();
}
