document.addEventListener('DOMContentLoaded', function() {
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
    
    // Calculator 1: Switch and Save
    document.getElementById('calculate-switch-save').addEventListener('click', calculateSwitchAndSave);
    
    // Calculator 2: Mortgage Payment
    document.getElementById('calculate-mortgage-payment').addEventListener('click', calculateMortgagePayment);
    
    // Calculator 3: Borrowing Power
    document.getElementById('calculate-borrowing-power').addEventListener('click', calculateBorrowingPower);
    
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

// Calculator 1: Switch and Save Logic
function calculateSwitchAndSave() {
    const currentRate = parseFloat(document.getElementById('current-rate').value);
    const bcbRate = parseFloat(document.getElementById('bcb-rate-1').value);
    const monthlyRepayment = parseFloat(document.getElementById('monthly-repayment').value);
    const refinanceAmount = parseFloat(document.getElementById('refinance-amount').value);
    const currentMaturity = parseFloat(document.getElementById('current-maturity').value);
    
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
}

// Calculator 2: Mortgage Payment Logic
function calculateMortgagePayment() {
    const bcbRate = parseFloat(document.getElementById('bcb-rate-2').value);
    const mortgageAmount = parseFloat(document.getElementById('mortgage-amount').value);
    const mortgageTerm = parseInt(document.getElementById('mortgage-term').value);
    
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
}

// Calculator 3: Borrowing Power Logic
function calculateBorrowingPower() {
    const monthlyIncome = parseFloat(document.getElementById('monthly-income').value);
    const monthlyExpenses = parseFloat(document.getElementById('monthly-expenses').value);
    const bcbRate = parseFloat(document.getElementById('bcb-rate-3').value);
    const borrowingTerm = parseInt(document.getElementById('borrowing-term').value);
    
    // Calculate disposable income (available for mortgage payment)
    // Typically, lenders allow 30-40% of income for mortgage payment
    const availableForMortgage = (monthlyIncome - monthlyExpenses) * 0.8; // Using 80% as a conservative estimate
    
    // Reverse-calculate how much can be borrowed based on available monthly payment
    // P = M * ((1+r)^n - 1) / (r * (1+r)^n)
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
} 