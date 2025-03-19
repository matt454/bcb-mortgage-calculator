# BCB Mortgage Calculator

This is a responsive mortgage calculator that includes three different calculators:

1. **Switch and Save Calculator**: Calculate how much you can save by switching your mortgage to BCB.
2. **Mortgage Payment Calculator**: Calculate your monthly mortgage payments based on loan amount, rate, and term.
3. **Borrowing Power Calculator**: Estimate how much you can borrow based on your income and expenses.

## Features

- Responsive design that works on desktop and mobile devices
- Easy-to-use tabbed interface
- Real-time calculations
- No server-side processing required (pure HTML/CSS/JavaScript)
- Easy to embed in WordPress or any other website

## Calculations Explained

### Calculator 1: Switch and Save

This calculator helps users determine how much they could save by switching their mortgage to BCB. It uses these calculations:

1. **Current Interest Payable**: The calculator first estimates the approximate principal amount based on the current monthly payment and interest rate using the formula:
   ```
   Principal = Monthly Payment × ((1+r)^n - 1) / (r × (1+r)^n)
   ```
   Where:
   - r = monthly interest rate (annual rate divided by 12 and then by 100)
   - n = total number of payments (years × 12)

   Then, it calculates the total interest payable over the remaining term:
   ```
   Current Interest Payable = (Monthly Payment × Number of Payments) - Principal
   ```

2. **New Monthly Payment**: Calculates what the monthly payment would be with BCB's rate using the standard mortgage formula:
   ```
   Monthly Payment = Principal × (r(1+r)^n) / ((1+r)^n - 1)
   ```

3. **New Interest Payable**: Calculates the total interest payable with the new rate:
   ```
   New Interest Payable = (New Monthly Payment × Number of Payments) - Principal
   ```

4. **Potential Savings**: The difference between the current and new interest payable:
   ```
   Potential Savings = Current Interest Payable - New Interest Payable
   ```

### Calculator 2: Mortgage Payment

This calculator determines the monthly payment for a new mortgage and the total interest payable:

1. **Monthly Payment**: Uses the standard mortgage formula:
   ```
   Monthly Payment = Principal × (r(1+r)^n) / ((1+r)^n - 1)
   ```
   Where:
   - Principal = mortgage amount
   - r = monthly interest rate
   - n = total number of payments

2. **Total Interest Payable**: Calculates the total interest paid over the entire loan term:
   ```
   Total Interest = (Monthly Payment × Number of Payments) - Principal
   ```

3. **Total Amount Payable**: The sum of the principal and total interest:
   ```
   Total Amount Payable = Principal + Total Interest
   ```

### Calculator 3: Borrowing Power

This calculator estimates how much a user can borrow based on their income and expenses:

1. **Available for Mortgage**: Calculates the amount available for monthly mortgage payments:
   ```
   Available for Mortgage = (Monthly Income - Monthly Expenses) × 0.8
   ```
   The 0.8 multiplier is a conservative estimate that assumes 80% of disposable income can go toward a mortgage payment.

2. **Borrowing Capacity**: Reverse-calculates the principal that can be borrowed based on the available monthly payment:
   ```
   Borrowing Capacity = Available Payment × ((1+r)^n - 1) / (r × (1+r)^n)
   ```
   Where:
   - r = monthly interest rate
   - n = total number of payments

3. **Estimated Monthly Payment**: Calculates the monthly payment for the estimated borrowing capacity.

4. **Total Interest Payable**: Calculates the total interest over the loan term.

## Files Included

- `index.html` - The HTML structure of the calculator
- `styles.css` - CSS styling for the calculator
- `script.js` - JavaScript for calculations and interactivity

## How to Embed in WordPress

There are several ways to embed this calculator into a WordPress site:

### Method 1: Using HTML Block (Gutenberg Editor)

1. Copy all the HTML from the `index.html` file
2. In WordPress, create a new page or edit an existing one
3. Add an HTML block (Custom HTML block in Gutenberg editor)
4. Paste the HTML code into the block
5. Add the CSS in one of these ways:
   - Add it to your theme's custom CSS section in the Customizer
   - Use a plugin like "Simple Custom CSS"
   - Add it using a Code block with the `<style>` tag
6. Add the JavaScript in one of these ways:
   - Add it to your theme's custom JS section
   - Use a plugin like "Header and Footer Scripts"
   - Add it using a Code block with the `<script>` tag

### Method 2: Using a Custom HTML Plugin

1. Install and activate a plugin like "Custom HTML Widget" or "Insert Headers and Footers"
2. Create a new HTML widget and paste the HTML code
3. Add the CSS and JavaScript as described in Method 1

### Method 3: Creating a Custom Shortcode (Advanced)

You can create a custom shortcode in your theme's functions.php file:

```php
function bcb_mortgage_calculator_shortcode() {
    $html = file_get_contents(get_stylesheet_directory() . '/mortgage-calculator/index.html');
    wp_enqueue_style('bcb-calculator-css', get_stylesheet_directory_uri() . '/mortgage-calculator/styles.css');
    wp_enqueue_script('bcb-calculator-js', get_stylesheet_directory_uri() . '/mortgage-calculator/script.js', array(), '1.0.0', true);
    return $html;
}
add_shortcode('bcb_mortgage_calculator', 'bcb_mortgage_calculator_shortcode');
```

Then place the files in a "mortgage-calculator" folder in your theme directory, and use the shortcode `[bcb_mortgage_calculator]` on any page.

## Customization

### Changing Colors

To change the colors of the calculator, edit the CSS file and modify these variables:

- Primary color (blue): `#3498db`
- Secondary color (darker blue): `#2980b9`
- Background color: `#f5f5f5`
- Text color: `#333` and `#2c3e50`

### Changing Labels and Default Values

To change the labels and default values, edit the HTML file and modify the corresponding text and value attributes.

## Browser Compatibility

This calculator works on all modern browsers including:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)
- Mobile browsers

## License

This calculator is provided under the MIT License. You are free to use, modify, and distribute it as needed. 