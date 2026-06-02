class GraphicCalculator {
    constructor() {
        this.display = document.getElementById('inputDisplay');
        this.history = document.getElementById('history');
        this.canvas = document.getElementById('graphCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.angleMode = 'deg'; // 'deg' or 'rad'
        
        this.functions = {
            Y1: null,
            Y2: null,
            Y3: null,
            Y4: null
        };
        this.currentFunction = null;
        
        this.setupEventListeners();
        this.drawGrid();
    }

    setupEventListeners() {
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(btn => {
            btn.addEventListener('click', () => this.inputNumber(btn.dataset.number));
        });

        // Operation buttons
        document.querySelectorAll('[data-action]').forEach(btn => {
            const action = btn.dataset.action;
            btn.addEventListener('click', () => this.handleAction(action));
        });

        // Function buttons
        document.querySelectorAll('[data-func]').forEach(btn => {
            btn.addEventListener('click', () => this.handleFunction(btn.dataset.func, btn));
        });

        // Angle mode
        document.querySelectorAll('input[name="angle-mode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.angleMode = e.target.value;
            });
        });

        // Modal
        this.setupModal();
    }

    setupModal() {
        const modal = document.getElementById('graphModal');
        const funcInput = document.getElementById('funcInput');
        const funcOk = document.getElementById('funcOk');
        const funcCancel = document.getElementById('funcCancel');
        const close = document.querySelector('.close');

        close.addEventListener('click', () => modal.style.display = 'none');
        
        funcCancel.addEventListener('click', () => {
            modal.style.display = 'none';
            this.currentFunction = null;
        });

        funcOk.addEventListener('click', () => {
            const expr = funcInput.value.trim();
            if (expr) {
                this.functions[this.currentFunction] = expr;
                this.display.textContent = `${this.currentFunction} = ${expr}`;
                modal.style.display = 'none';
            }
        });

        funcInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') funcOk.click();
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    inputNumber(num) {
        if (this.currentInput === '0') {
            this.currentInput = num;
        } else {
            this.currentInput += num;
        }
        this.updateDisplay();
    }

    handleAction(action) {
        const actions = {
            'add': () => this.setOperation('+'),
            'subtract': () => this.setOperation('−'),
            'multiply': () => this.setOperation('×'),
            'divide': () => this.setOperation('÷'),
            'equals': () => this.calculate(),
            'decimal': () => this.addDecimal(),
            'clear': () => this.clear(),
            'delete': () => this.delete(),
            'power': () => this.appendToInput('^'),
            'sqrt': () => this.appendToInput('√('),
            'sin': () => this.appendFunction('sin('),
            'cos': () => this.appendFunction('cos('),
            'tan': () => this.appendFunction('tan('),
            'log': () => this.appendFunction('log('),
            'ln': () => this.appendFunction('ln('),
            'factorial': () => this.appendToInput('!'),
            'pi': () => this.appendToInput('π'),
            'ee': () => this.appendToInput('e'),
            'leftparen': () => this.appendToInput('('),
            'rightparen': () => this.appendToInput(')'),
            'negate': () => this.negate(),
            'mode': () => {} // Already handled by radio buttons
        };

        if (actions[action]) {
            actions[action]();
        }
    }

    handleFunction(func, btn) {
        const modal = document.getElementById('graphModal');
        const funcLabel = document.getElementById('funcLabel');
        const funcInput = document.getElementById('funcInput');
        
        if (func === 'GRAPH') {
            this.graph();
            return;
        }
        
        this.currentFunction = func;
        funcLabel.textContent = `${func} =`;
        funcInput.value = this.functions[func] || '';
        
        // Toggle button active state
        document.querySelectorAll('[data-func]').forEach(b => b.classList.remove('active'));
        if (this.functions[func]) {
            btn.classList.add('active');
        }
        
        modal.style.display = 'block';
        funcInput.focus();
    }

    setOperation(op) {
        if (this.currentInput !== '') {
            if (this.previousInput !== '' && this.operation) {
                this.calculate();
            }
            this.previousInput = this.currentInput;
            this.operation = op;
            this.currentInput = '';
        }
    }

    calculate() {
        if (!this.operation || this.previousInput === '' || this.currentInput === '') {
            return;
        }

        let result;
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '−':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                result = current !== 0 ? prev / current : NaN;
                break;
            default:
                return;
        }

        this.history.textContent = `${prev} ${this.operation} ${current} =`;
        this.currentInput = result.toString();
        this.operation = null;
        this.previousInput = '';
        this.updateDisplay();
    }

    evaluateExpression(expr) {
        try {
            // Replace custom operators
            let exp = expr
                .replace(/π/g, Math.PI)
                .replace(/e(?![a-zA-Z])/g, Math.E)
                .replace(/√\(/g, 'Math.sqrt(')
                .replace(/sin\(/g, this.angleMode === 'deg' ? '(Math.sin(Math.PI/180*' : '(Math.sin(')
                .replace(/cos\(/g, this.angleMode === 'deg' ? '(Math.cos(Math.PI/180*' : '(Math.cos(')
                .replace(/tan\(/g, this.angleMode === 'deg' ? '(Math.tan(Math.PI/180*' : '(Math.tan(')
                .replace(/log\(/g, 'Math.log10(')
                .replace(/ln\(/g, 'Math.log(')
                .replace(/\^/g, '**')
                .replace(/([0-9)!])\!/g, (match, p1) => {
                    const num = parseInt(p1);
                    return this.factorial(num);
                })
                .replace(/×/g, '*')
                .replace(/÷/g, '/');
            
            // Evaluate
            const result = Function('"use strict"; return (' + exp + ')')();
            return isFinite(result) ? result : null;
        } catch (e) {
            return null;
        }
    }

    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    addDecimal() {
        if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
            this.updateDisplay();
        }
    }

    appendToInput(value) {
        if (this.currentInput === '0' && value !== '.') {
            this.currentInput = value;
        } else {
            this.currentInput += value;
        }
        this.updateDisplay();
    }

    appendFunction(func) {
        if (this.currentInput === '0') {
            this.currentInput = func;
        } else {
            this.currentInput += func;
        }
        this.updateDisplay();
    }

    negate() {
        if (this.currentInput !== '0') {
            this.currentInput = this.currentInput.startsWith('-') 
                ? this.currentInput.substring(1) 
                : '-' + this.currentInput;
            this.updateDisplay();
        }
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.history.textContent = '';
        this.updateDisplay();
    }

    delete() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }

    updateDisplay() {
        this.display.textContent = this.currentInput;
    }

    drawGrid() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const scale = 20; // pixels per unit

        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, width, height);

        // Draw grid
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 0.5;

        for (let x = 0; x < width; x += scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }

        for (let y = 0; y < height; y += scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }

        // Draw axes
        this.ctx.strokeStyle = '#0f0';
        this.ctx.lineWidth = 2;

        // X-axis
        this.ctx.beginPath();
        this.ctx.moveTo(0, centerY);
        this.ctx.lineTo(width, centerY);
        this.ctx.stroke();

        // Y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, 0);
        this.ctx.lineTo(centerX, height);
        this.ctx.stroke();

        // Draw axis labels
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';

        for (let i = -5; i <= 5; i++) {
            if (i !== 0) {
                // X-axis labels
                this.ctx.fillText(i, centerX + i * scale, centerY + 5);
                // Y-axis labels
                this.ctx.textAlign = 'right';
                this.ctx.fillText(i, centerX - 5, centerY - i * scale + 3);
                this.ctx.textAlign = 'center';
            }
        }

        // Origin label
        this.ctx.fillText('O', centerX - 8, centerY + 10);
    }

    plotFunction(funcExpr, color) {
        if (!funcExpr) return;

        const width = this.canvas.width;
        const height = this.canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const scale = 20;

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();

        let firstPoint = true;

        for (let px = 0; px < width; px++) {
            const x = (px - centerX) / scale;
            const expr = funcExpr.replace(/x/g, `(${x})`);
            const y = this.evaluateExpression(expr);

            if (y !== null && isFinite(y)) {
                const py = centerY - y * scale;

                if (py >= 0 && py <= height) {
                    if (firstPoint) {
                        this.ctx.moveTo(px, py);
                        firstPoint = false;
                    } else {
                        this.ctx.lineTo(px, py);
                    }
                }
            }
        }

        this.ctx.stroke();
    }

    graph() {
        this.drawGrid();

        const colors = ['#00ff00', '#ffff00', '#ff00ff', '#00ffff'];
        const functions = ['Y1', 'Y2', 'Y3', 'Y4'];

        functions.forEach((func, index) => {
            if (this.functions[func]) {
                this.plotFunction(this.functions[func], colors[index]);
            }
        });
    }
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
    new GraphicCalculator();
});
