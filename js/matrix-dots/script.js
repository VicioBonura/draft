/* constants */

const screen = document.querySelector('.screen');
const inspector = document.getElementById('inspector');
const config = {
    char: true,
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?~',
    idLength: 10,
    iterations: 0,
    rgbRange: {
        rMin: 0,
        rMax: 0,
        gMin: 0,
        gMax: 255,
        bMin: 0,
        bMax: 0
    },
    init(size, interval, limit = 0) {
        this.iteractionLimit = limit;
        this.dotSize = size;
        this.interval = interval;
        this.startTime = Date.now();
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
 * draw the matrix of dots in the screen element
 */
function createDots() {
    const fragment = document.createDocumentFragment();

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

    for (let i = 0; i < matrix.cols; i++) {
        for (let j = 0; j < matrix.rows; j++) {
            const dot = createDot(i, j, config.char);
            fragment.appendChild(dot);
        }
    }
    screen.appendChild(fragment);
}

/**
 * Drop the dots from the top to the bottom of the screen
 */
function drop() {
    const delay = 0.5 / 10;
    const col = getNextCoord('col', true, true);
    for(let i = 0; i < config.rows; i++) {
        let dot = document.getElementById(`dot-${col}-${i}`);
        dot.classList.add('drop');
        dot.style.setProperty('--delay', i * delay);
    }
    countIterations();
    updateInspector(true, false, true, false, false);
    
    matrix.activeCols.length !== config.cols 
        ? setTimeout(() => drop(), config.interval) 
        : console.log('done');
}

/**
 * Switch the dot on or off, with random color value
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
 */
function randomSwitch() {
    const col = getNextCoord('col', true, false);
    const row = getNextCoord('row', true, false);
    const dot = document.getElementById(`dot-${col}-${row}`);
    switchDot(dot);
    countIterations();
    updateInspector(true, false, false, true, true);
    config.iteractionLimit > 0 && config.iterations === config.iteractionLimit ? console.log('done') : setTimeout(() => randomSwitch(), config.interval);
}

/**
 * Turn on the dots in the screen, simulating a wave effect
 * XXX: This function must be optimized, it's too slow
 */
function wave() {
    const centerX = Math.floor(matrix.cols / 2);
    const centerY = Math.floor(matrix.rows / 2);
    const maxRadius = Math.max(matrix.cols, matrix.rows);
    let currentRadius = 0;

    function expandWave() {
        for (let x = Math.max(centerX - currentRadius, 0); x < Math.min(centerX + currentRadius + 1, matrix.cols); x++) {
            for (let y = Math.max(centerY - currentRadius, 0); y < Math.min(centerY + currentRadius + 1, matrix.rows); y++) {
                const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
                if (Math.abs(distance - currentRadius) < 1) {
                    const dot = document.getElementById(`dot-${x}-${y}`);
                    if(!dot.classList.contains('on')) switchDot(dot);
                }
            }
        }

        currentRadius++;
        countIterations();
        updateInspector(true, false, false, false, true);

        currentRadius <= maxRadius ? setTimeout(expandWave, config.interval) : console.log('done');
    }

    expandWave();
}

/* utils functions */

/**
 * Get the next coordinate to work with
 * @param {String} axis the axis to work with: 'col' or 'row'
 * @param {Boolean} random if true, return a random coordinate, otherwise return the next coordinate in the sequence
 * @param {Boolean} unique if true, return a coordinate that has not been used yet. It works only for random selection.
 * @returns the index of the coordinate to work with
 */
function getNextCoord(axis, random = true, unique = true) {
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
 * @param {Boolean} showMatrix if true, show the matrix size
 * @param {Boolean} showRows if true, show the number of active rows
 * @param {Boolean} showCols if true, show the number of active columns
 * @param {Boolean} showDots if true, show the number of dots
 * @param {Boolean} showActive if true, show the number of active dots
 */
function updateInspector(showMatrix = true, showRows = false, showCols = false, showDots = false, showActive = false) {
    let text = [];
    if (showMatrix) text.push(`Matrix: ${config.cols}x${config.rows}`);
    if (showRows) text.push(`Rows: ${matrix.activeRows.length}/${config.rows}`);
    if (showCols) text.push(`Cols: ${matrix.activeCols.length}/${config.cols}`);
    if (showDots) text.push(`Dots: ${document.querySelectorAll('.dot').length}`);
    if (showActive) {
        const percentage = (matrix.dotOn / (matrix.dotOn + matrix.dotOff) * 100).toFixed(2);
        text.push(`ON: ${matrix.dotOn} - OFF: ${matrix.dotOff} - ${percentage}%`);
    }
    text.push(`STEPS: ${config.iterations} - STEPS/SEC: ESTIMATED ${1000 / config.interval} - REAL ${(config.iterations / (Date.now() - config.startTime) * 1000).toFixed(2)}`);
    inspector.textContent = text.join(' | ');
}

/* initialize */
config.init(15, 100);

/* run */
createDots();
wave(); // Replace randomSwitch() with wave()