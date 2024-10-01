/* constants */

const screen = document.querySelector('.screen');
const inspector = document.getElementById('inspector');

const config = {
    dotSize: 0,
    cols: 0,
    rows: 0,
    interval: 0,
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?~',
    idLength: 10,
    iterations: 0,
    rgbRange: {
        rMin: 0,
        rMax: 255,
        gMin: 0,
        gMax: 255,
        bMin: 0,
        bMax: 255
    },

    init(size, interval) {
        this.dotSize = size;
        this.interval = interval;
        this.cols = Math.floor(screen.clientWidth / size);
        this.rows = Math.floor(screen.clientHeight / size);
        screen.style.setProperty('--w', `${this.cols * this.dotSize}px`);
        screen.style.setProperty('--h', `${this.rows * this.dotSize}px`);
        matrix.cols = this.cols;
        matrix.rows = this.rows;
        matrix.dotOff = this.cols * this.rows;
    }
}

const matrix = {
    cols: 0,
    rows: 0,
    activeCols: [],
    activeRows: [],
    dotOn: 0,
    dotOff: 0 
};

/* drawing functions */

/**
 * Create a dot element
 * @param {Number} i the column index
 * @param {Number} j the row index
 * @returns the dot element
 */
function createDot(i, j, char = false) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.id = `dot-${i}-${j}`;
    Object.entries({
        '--x': i * config.dotSize,
        '--y': j * config.dotSize,
        '--w': config.dotSize,
        '--h': config.dotSize
    }).forEach(([prop, value]) => dot.style.setProperty(prop, value));
    if(char) dot.textContent = config.chars.charAt(getRandomInt(0, config.chars.length - 1));
    return dot;
}

/**
 * draw the matrix of dots in the screen element
 */
function createDots() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < matrix.cols; i++) {
        for (let j = 0; j < matrix.rows; j++) {
            const dot = createDot(i, j);
            fragment.appendChild(dot);
        }
    }
    screen.appendChild(fragment);
}

/**
 * Drop the dots from the top to the bottom of the screen
 * @param {Array} matrix the array containing the matrix data: [cols, rows, activeCols, activeRows, dotOn, dotOff]
 */
function drop(matrix) {
    const delay = 0.5 / 10;
    const col = getNextCoord(matrix, 'col', true, true);
    for(let i = 0; i < config.rows; i++) {
        let dot = document.getElementById(`dot-${col}-${i}`);
        dot.classList.add('drop');
        dot.style.setProperty('--delay', i * delay);
    }
    countIterations();
    updateInspector(matrix, true, false, true, false, false);
    
    matrix.activeCols.length !== config.cols 
        ? setTimeout(() => drop(matrix), config.interval) 
        : console.log('done');
}

/**
 * Switch the dot on or off, with random green value
 * @param {Object} dot the dot to switch
 */
function switchDot(dot) {
    let rgb = `${getRandomInt(config.rgbRange.rMin, config.rgbRange.rMax)}, ${getRandomInt(config.rgbRange.gMin, config.rgbRange.gMax)}, ${getRandomInt(config.rgbRange.bMin, config.rgbRange.bMax)}`;
    dot.style.setProperty('--rgb', rgb);
    dot.classList.toggle('on');
    dot.classList.contains('on') ? (matrix.dotOn++, matrix.dotOff--) : (matrix.dotOn--, matrix.dotOff++);
}

/**
 * Randomly switch the dot on or off
 * @param {Array} matrix the array containing the matrix data: [cols, rows, activeCols, activeRows, dotOn, dotOff]
 */
function randomSwitch(matrix) {
    const col = getNextCoord(matrix, 'col', true, false);
    const row = getNextCoord(matrix, 'row', true, false);
    const dot = document.getElementById(`dot-${col}-${row}`);
    switchDot(dot);
    countIterations();
    updateInspector(matrix, true, false, false, true, true);
    setTimeout(() => randomSwitch(matrix), config.interval);
}

/* utils functions */

/**
 * Get the next coordinate to work with
 * @param {Array} matrix the array containing the matrix data: [cols, rows, activeCols, activeRows]
 * @param {String} axis the axis to work with: 'col' or 'row'
 * @param {Boolean} random if true, return a random coordinate, otherwise return the next coordinate in the sequence
 * @param {Boolean} unique if true, return a coordinate that has not been used yet. It works only for random selection.
 * @returns the index of the coordinate to work with
 */
function getNextCoord(matrix, axis, random = true, unique = true) {
    let index;
    const limit = axis === 'col' ? matrix.cols : matrix.rows;
    const used = axis === 'col' ? matrix.activeCols : matrix.activeRows;

    if (random) {
        do index = getRandomInt(0, limit - 1);
        while (unique && used.includes(index));
    } else index = used.length; 
    if(!used.includes(index)) used.push(index);
    return index;
}

/**
 * Return a random integer between min and max
 * @param {Number} min the minimum value
 * @param {Number} max the maximum value
 * @returns random integer
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Count the iterations
 */
function countIterations() {
    config.iterations++;
}

/* monitoring functions */

/**
 * Update the inspector with the matrix data
 * @param {Array} matrix the array containing the matrix data: [cols, rows, activeCols, activeRows, dotOn, dotOff]
 * @param {Boolean} showMatrix if true, show the matrix size
 * @param {Boolean} showRows if true, show the number of active rows
 * @param {Boolean} showCols if true, show the number of active columns
 * @param {Boolean} showDots if true, show the number of dots
 * @param {Boolean} showActive if true, show the number of active dots
 */
function updateInspector(matrix, showMatrix = true, showRows = false, showCols = false, showDots = false, showActive = false) {
    let text = '';
    if (showMatrix) text += `matrix: ${config.cols}x${config.rows} | `;
    if (showRows) text += `rows: ${matrix.activeRows.length}/${config.rows} | `;
    if (showCols) text += `cols: ${matrix.activeCols.length}/${config.cols} | `;
    if (showDots) text += `dots: ${document.querySelectorAll('.dot').length} | `;
    if (showActive) {
        const percentage = (matrix.dotOn / (matrix.dotOn + matrix.dotOff) * 100).toFixed(2);
        text += `ON: ${matrix.dotOn} | OFF: ${matrix.dotOff} | ${percentage}% | `;
    }
    text += `STEPS: ${config.iterations}`;
    inspector.textContent = text;
}

/* initialize */
config.init(15, 10);

/* run */
createDots();
randomSwitch(matrix);
