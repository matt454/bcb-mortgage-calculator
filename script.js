document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    const switchSaveChart = new Chart(document.getElementById('switch-save-chart'), {
        type: 'doughnut',
        data: {
            labels: ['Principal', 'Interest'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#1a5f7a', '#e8f4f8']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Payment Breakdown'
                }
            }
        }
    });

    // Update the line chart configuration
    const lineChartConfig = {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Principal Balance',
                    data: [],
                    borderColor: '#1a5f7a',
                    backgroundColor: 'rgba(26, 95, 122, 0.8)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Interest Paid',
                    data: [],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.8)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Total Mortgage Amount Over Time'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        stacked: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            }
                        }
                    },
                    x: {
                        stacked: true
                    }
                }
            }
        }
    };

    // Initialize charts with the new config
    const switchSaveLineChart = new Chart(document.getElementById('switch-save-line-chart'), lineChartConfig);
    const mortgagePaymentLineChart = new Chart(document.getElementById('mortgage-payment-line-chart'), lineChartConfig);
    const borrowingPowerLineChart = new Chart(document.getElementById('borrowing-power-line-chart'), lineChartConfig);

    const mortgagePaymentChart = new Chart(document.getElementById('mortgage-payment-chart'), {
        type: 'doughnut',
        data: {
            labels: ['Principal', 'Interest'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#1a5f7a', '#e8f4f8']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Payment Breakdown'
                }
            }
        }
    });

    const borrowingPowerChart = new Chart(document.getElementById('borrowing-power-chart'), {
        type: 'doughnut',
        data: {
            labels: ['Principal', 'Interest'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#1a5f7a', '#e8f4f8']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Payment Breakdown'
                }
            }
        }
    });

    // Store chart instances globally
    window.charts = {
        switchSave: switchSaveChart,
        switchSaveLine: switchSaveLineChart,
        mortgagePayment: mortgagePaymentChart,
        mortgagePaymentLine: mortgagePaymentLineChart,
        borrowingPower: borrowingPowerChart,
        borrowingPowerLine: borrowingPowerLineChart
    };

    // Tab Switching Logic
    const tabButtons = document.querySelectorAll('.tab-button');
    const calculators = document.querySelectorAll('.calculator');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and calculators
            tabButtons.forEach(btn => btn.classList.remove('active'));
            calculators.forEach(calc => calc.classList.remove('active'));
            
            // Add active class to clicked button and corresponding calculator
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Initialize all sliders with event listeners
    initializeSliders();
    
    // Initialize calculators with default values
    calculateSwitchAndSave();
    calculateMortgagePayment();
    calculateBorrowingPower();
});

// Helper Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
    }).format(amount);
}

function formatPercentage(value) {
    return value.toFixed(1) + '%';
}

function formatYears(value) {
    return value + ' years';
}

function calculateMonthlyPayment(principal, annualRate, termYears) {
    const monthlyRate = annualRate / (12 * 100); // Convert annual rate to monthly decimal
    const numPayments = termYears * 12;
    
    // If rate is zero, simple division
    if (monthlyRate === 0) {
        return principal / numPayments;
    }
    
    // Standard mortgage formula: P * (r(1+r)^n) / ((1+r)^n - 1)
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
}

function calculateTotalInterest(monthlyPayment, principal, termYears) {
    return (monthlyPayment * termYears * 12) - principal;
}

// Initialize all sliders with event listeners
function initializeSliders() {
    // Switch and Save Calculator sliders
    const switchSaveSliders = [
        { id: 'current-rate', valueId: 'current-rate-value', format: formatPercentage },
        { id: 'bcb-rate-1', valueId: 'bcb-rate-1-value', format: formatPercentage },
        { id: 'monthly-repayment', valueId: 'monthly-repayment-value', format: formatCurrency },
        { id: 'refinance-amount', valueId: 'refinance-amount-value', format: formatCurrency },
        { id: 'current-maturity', valueId: 'current-maturity-value', format: formatYears }
    ];
    
    // Mortgage Payment Calculator sliders
    const mortgagePaymentSliders = [
        { id: 'bcb-rate-2', valueId: 'bcb-rate-2-value', format: formatPercentage },
        { id: 'mortgage-amount', valueId: 'mortgage-amount-value', format: formatCurrency },
        { id: 'mortgage-term', valueId: 'mortgage-term-value', format: formatYears }
    ];
    
    // Borrowing Power Calculator sliders
    const borrowingPowerSliders = [
        { id: 'monthly-income', valueId: 'monthly-income-value', format: formatCurrency },
        { id: 'monthly-expenses', valueId: 'monthly-expenses-value', format: formatCurrency },
        { id: 'bcb-rate-3', valueId: 'bcb-rate-3-value', format: formatPercentage },
        { id: 'borrowing-term', valueId: 'borrowing-term-value', format: formatYears }
    ];
    
    // Add event listeners to all sliders
    [...switchSaveSliders, ...mortgagePaymentSliders, ...borrowingPowerSliders].forEach(slider => {
        const input = document.getElementById(slider.id);
        const valueDisplay = document.getElementById(slider.valueId);
        
        // Update display on input
        input.addEventListener('input', () => {
            valueDisplay.textContent = slider.format(parseFloat(input.value));
            
            // Trigger appropriate calculator based on slider group
            if (switchSaveSliders.includes(slider)) {
                calculateSwitchAndSave();
            } else if (mortgagePaymentSliders.includes(slider)) {
                calculateMortgagePayment();
            } else if (borrowingPowerSliders.includes(slider)) {
                calculateBorrowingPower();
            }
        });
    });
}

// Update the generatePaydownData function to calculate total amount
function generatePaydownData(principal, annualRate, termYears) {
    const monthlyRate = annualRate / (12 * 100);
    const numPayments = termYears * 12;
    const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termYears);
    
    const labels = [];
    const principalData = [];
    const interestData = [];
    let balance = principal;
    let totalInterestPaid = 0;
    
    for (let i = 0; i <= numPayments; i++) {
        labels.push(i === 0 ? 'Start' : `Year ${Math.ceil(i / 12)}`);
        principalData.push(balance);
        interestData.push(totalInterestPaid);
        
        if (i < numPayments) {
            const interestPayment = balance * monthlyRate;
            const principalPayment = monthlyPayment - interestPayment;
            balance -= principalPayment;
            totalInterestPaid += interestPayment;
        }
    }
    
    return { labels, principalData, interestData };
}

// Add validation helper function
function validateInputs(monthlyIncome, monthlyExpenses) {
    if (monthlyExpenses >= monthlyIncome) {
        return {
            isValid: false,
            message: 'Monthly expenses cannot exceed monthly income'
        };
    }
    return { isValid: true };
}

// Calculator 1: Switch and Save Logic
function calculateSwitchAndSave() {
    const currentRate = parseFloat(document.getElementById('current-rate').value);
    const bcbRate = parseFloat(document.getElementById('bcb-rate-1').value);
    const monthlyRepayment = parseFloat(document.getElementById('monthly-repayment').value);
    const refinanceAmount = parseFloat(document.getElementById('refinance-amount').value);
    const currentMaturity = parseFloat(document.getElementById('current-maturity').value);
    
    // Validate rates
    if (currentRate <= 0 || bcbRate <= 0) {
        document.getElementById('current-interest-payable').textContent = 'Invalid Rate';
        document.getElementById('new-interest-payable').textContent = 'Invalid Rate';
        document.getElementById('potential-savings').textContent = 'Invalid Rate';
        document.getElementById('new-monthly-payment').textContent = 'Invalid Rate';
        return;
    }
    
    // Calculate current interest payable
    const monthlyRateCurrent = currentRate / (12 * 100);
    const numPaymentsCurrent = currentMaturity * 12;
    let currentInterestPayable = 0;
    
    // Calculate the principal using the fixed monthly payment and current rate
    // This is an approximation using the mortgage formula solved for P
    // P = M * ((1+r)^n - 1) / (r * (1+r)^n)
    let approximatePrincipal = 0;
    
    if (monthlyRateCurrent === 0) {
        approximatePrincipal = monthlyRepayment * numPaymentsCurrent;
    } else {
        approximatePrincipal = monthlyRepayment * ((Math.pow(1 + monthlyRateCurrent, numPaymentsCurrent) - 1) / 
            (monthlyRateCurrent * Math.pow(1 + monthlyRateCurrent, numPaymentsCurrent)));
    }
    
    currentInterestPayable = (monthlyRepayment * numPaymentsCurrent) - approximatePrincipal;
    
    // Calculate new monthly payment with BCB rate
    const newMonthlyPayment = calculateMonthlyPayment(refinanceAmount, bcbRate, currentMaturity);
    
    // Calculate new interest payable
    const newInterestPayable = calculateTotalInterest(newMonthlyPayment, refinanceAmount, currentMaturity);
    
    // Calculate potential savings
    const potentialSavings = currentInterestPayable - newInterestPayable;
    
    // Update the DOM with results
    document.getElementById('current-interest-payable').textContent = formatCurrency(currentInterestPayable);
    document.getElementById('new-interest-payable').textContent = formatCurrency(newInterestPayable);
    document.getElementById('potential-savings').textContent = formatCurrency(potentialSavings);
    document.getElementById('new-monthly-payment').textContent = formatCurrency(newMonthlyPayment);

    // Update charts
    window.charts.switchSave.data.datasets[0].data = [refinanceAmount, newInterestPayable];
    window.charts.switchSave.update();

    const paydownData = generatePaydownData(refinanceAmount, bcbRate, currentMaturity);
    window.charts.switchSaveLine.data.labels = paydownData.labels;
    window.charts.switchSaveLine.data.datasets[0].data = paydownData.principalData;
    window.charts.switchSaveLine.data.datasets[1].data = paydownData.interestData;
    window.charts.switchSaveLine.update();
}

// Calculator 2: Mortgage Payment Logic
function calculateMortgagePayment() {
    const bcbRate = parseFloat(document.getElementById('bcb-rate-2').value);
    const mortgageAmount = parseFloat(document.getElementById('mortgage-amount').value);
    const mortgageTerm = parseInt(document.getElementById('mortgage-term').value);
    
    // Validate inputs
    if (bcbRate <= 0 || mortgageAmount <= 0 || mortgageTerm <= 0) {
        document.getElementById('monthly-payment').textContent = 'Invalid Input';
        document.getElementById('total-interest-payable').textContent = 'Invalid Input';
        document.getElementById('total-amount-payable').textContent = 'Invalid Input';
        return;
    }
    
    // Calculate monthly payment
    const monthlyPayment = calculateMonthlyPayment(mortgageAmount, bcbRate, mortgageTerm);
    
    // Calculate total interest payable
    const totalInterestPayable = calculateTotalInterest(monthlyPayment, mortgageAmount, mortgageTerm);
    
    // Calculate total amount payable
    const totalAmountPayable = mortgageAmount + totalInterestPayable;
    
    // Update the DOM with results
    document.getElementById('monthly-payment').textContent = formatCurrency(monthlyPayment);
    document.getElementById('total-interest-payable').textContent = formatCurrency(totalInterestPayable);
    document.getElementById('total-amount-payable').textContent = formatCurrency(totalAmountPayable);

    // Update charts
    window.charts.mortgagePayment.data.datasets[0].data = [mortgageAmount, totalInterestPayable];
    window.charts.mortgagePayment.update();

    const paydownData = generatePaydownData(mortgageAmount, bcbRate, mortgageTerm);
    window.charts.mortgagePaymentLine.data.labels = paydownData.labels;
    window.charts.mortgagePaymentLine.data.datasets[0].data = paydownData.principalData;
    window.charts.mortgagePaymentLine.data.datasets[1].data = paydownData.interestData;
    window.charts.mortgagePaymentLine.update();
}

// Calculator 3: Borrowing Power Logic
function calculateBorrowingPower() {
    const monthlyIncome = parseFloat(document.getElementById('monthly-income').value);
    const monthlyExpenses = parseFloat(document.getElementById('monthly-expenses').value);
    const bcbRate = parseFloat(document.getElementById('bcb-rate-3').value);
    const borrowingTerm = parseInt(document.getElementById('borrowing-term').value);
    
    // Validate inputs
    const validation = validateInputs(monthlyIncome, monthlyExpenses);
    if (!validation.isValid) {
        // Show error message
        document.getElementById('borrowing-capacity').textContent = 'Invalid Input';
        document.getElementById('estimated-monthly-payment').textContent = 'Invalid Input';
        document.getElementById('borrowing-interest-payable').textContent = 'Invalid Input';
        
        // Clear charts
        window.charts.borrowingPower.data.datasets[0].data = [0, 0];
        window.charts.borrowingPower.update();
        
        window.charts.borrowingPowerLine.data.labels = [];
        window.charts.borrowingPowerLine.data.datasets[0].data = [];
        window.charts.borrowingPowerLine.data.datasets[1].data = [];
        window.charts.borrowingPowerLine.update();
        
        return;
    }
    
    // Calculate disposable income (available for mortgage payment)
    // Using 40% of gross income as a conservative estimate
    const availableForMortgage = (monthlyIncome - monthlyExpenses) * 0.4;
    
    // Reverse-calculate how much can be borrowed based on available monthly payment
    const monthlyRate = bcbRate / (12 * 100);
    const numPayments = borrowingTerm * 12;
    
    let borrowingCapacity = 0;
    if (monthlyRate === 0) {
        borrowingCapacity = availableForMortgage * numPayments;
    } else {
        borrowingCapacity = availableForMortgage * ((Math.pow(1 + monthlyRate, numPayments) - 1) / 
            (monthlyRate * Math.pow(1 + monthlyRate, numPayments)));
    }
    
    // Calculate monthly payment for the borrowing capacity
    const estimatedMonthlyPayment = calculateMonthlyPayment(borrowingCapacity, bcbRate, borrowingTerm);
    
    // Calculate total interest payable
    const borrowingInterestPayable = calculateTotalInterest(estimatedMonthlyPayment, borrowingCapacity, borrowingTerm);
    
    // Update the DOM with results
    document.getElementById('borrowing-capacity').textContent = formatCurrency(borrowingCapacity);
    document.getElementById('estimated-monthly-payment').textContent = formatCurrency(estimatedMonthlyPayment);
    document.getElementById('borrowing-interest-payable').textContent = formatCurrency(borrowingInterestPayable);

    // Update charts
    window.charts.borrowingPower.data.datasets[0].data = [borrowingCapacity, borrowingInterestPayable];
    window.charts.borrowingPower.update();

    const paydownData = generatePaydownData(borrowingCapacity, bcbRate, borrowingTerm);
    window.charts.borrowingPowerLine.data.labels = paydownData.labels;
    window.charts.borrowingPowerLine.data.datasets[0].data = paydownData.principalData;
    window.charts.borrowingPowerLine.data.datasets[1].data = paydownData.interestData;
    window.charts.borrowingPowerLine.update();
} 