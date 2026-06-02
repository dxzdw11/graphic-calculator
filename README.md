# TI-84 Graphic Calculator

A web-based graphic calculator inspired by the TI-84 Plus calculator. This calculator provides both standard arithmetic calculations and graphing capabilities for mathematical functions.

## Features

### Calculator Functions
- **Basic Operations**: Addition, subtraction, multiplication, division
- **Scientific Functions**: sin, cos, tan, log, ln, square root
- **Advanced Features**: 
  - Power operations (^)
  - Factorial (!)
  - Constants (π, e)
  - Parentheses for complex expressions
  - Number negation (±)

### Graphing Capabilities
- **Multiple Functions**: Plot up to 4 functions simultaneously (Y₁, Y₂, Y₃, Y₄)
- **Interactive Grid**: Cartesian coordinate system with labeled axes
- **Function Input**: Easy-to-use modal for entering function expressions
- **Color-Coded Graphs**: Each function is displayed in a different color
  - Y₁: Green
  - Y₂: Yellow
  - Y₃: Magenta
  - Y₄: Cyan

### Angle Modes
- **Degrees (DEG)**: Default mode for trigonometric functions
- **Radians (RAD)**: Alternative angle measurement mode

## How to Use

### Basic Calculations
1. Click number buttons to enter values
2. Click operation buttons (+, −, ×, ÷)
3. Enter the next number
4. Click = to calculate the result
5. Use DEL to delete the last digit or CLEAR to reset

### Scientific Functions
- Click `sin`, `cos`, `tan`, `log`, `ln` buttons
- Enter the value inside the parentheses
- Press = to calculate

### Graphing Functions
1. Click one of the function buttons (Y₁, Y₂, Y₃, Y₄)
2. Enter your function using `x` as the variable
   - Example: `x^2` for y = x²
   - Example: `sin(x)` for y = sin(x)
   - Example: `x^3 - 2*x + 1` for y = x³ - 2x + 1
3. Click OK to confirm
4. Click GRAPH to display all entered functions
5. The graph will be plotted on the canvas above

### Function Expression Syntax
- Use `x` for the variable
- Use `*` for multiplication: `2*x`
- Use `/` for division: `x/2`
- Use `^` for power: `x^2`
- Use `√()` or `sqrt()` for square root: `√(x)`
- Use trigonometric functions: `sin(x)`, `cos(x)`, `tan(x)`
- Use logarithms: `log(x)` for base-10, `ln(x)` for natural log
- Use constants: `π` for pi, `e` for Euler's number
- Example: `sin(x) + 2*x^2 - 1`

## Files

- `index.html` - Main HTML structure and layout
- `style.css` - Styling and responsive design
- `calculator.js` - Calculator logic and graphing engine
- `README.md` - Documentation

## Getting Started

1. Open `index.html` in a modern web browser
2. Start calculating or graphing!

## Browser Compatibility

Works on all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript
- CSS Grid and Flexbox

## Tips

- Use parentheses to control the order of operations: `(2+3)*4`
- Negative numbers: Click ± button to negate
- The graph displays a range of approximately -5 to 5 on both axes
- Each colored line represents a different function
- Switch between DEG and RAD modes for trigonometric calculations

Enjoy your calculations! 🧮
