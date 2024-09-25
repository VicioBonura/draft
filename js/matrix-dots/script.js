const screen = document.querySelector('.screen');
const inspector = document.getElementById('inspector');
const dotSize = 10;
const matrix = [
    Math.floor(screen.clientWidth / dotSize), 
    Math.floor(screen.clientHeight / dotSize),
    []
]; // cols, rows, activeCols
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?~';

function createDots() {
    for (let i = 0; i < matrix[0]; i++) {
        for (let j = 0; j < matrix[1] + 1; j++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.id = `dot-${i}-${j}`;

            dot.style.setProperty('--x', i * dotSize);
            dot.style.setProperty('--y', j * dotSize);
            dot.style.setProperty('--w', dotSize);
            dot.style.setProperty('--h', dotSize);
            screen.appendChild(dot);
        }
    }
}

function drop(matrix) {
    const delay = 3 / 20;
    const col = Math.floor(Math.random() * matrix[0]);
    for(let i = 0; i < matrix[1] + 1; i++) {
        let dot = document.getElementById(`dot-${col}-${i}`);
        dot.style.setProperty('--delay', i * delay);
        dot.classList.add('drop');
    }

    if(!matrix[2].includes(col))
        matrix[2].push(col);
    let repeat = matrix[2].length !== matrix[0] ? true : false;
    updateInspector(matrix);
    if(repeat)
        setTimeout(() => {
            drop(matrix);
        }, 100);
    else {
        matrix[2].sort((a, b) => a - b);
        console.log('done', matrix[2]);
    }
        
}

function updateInspector(matrix) {
    inspector.textContent = `matrix: ${matrix[0]}x${matrix[1]} - dots: ${document.querySelectorAll('.dot').length} - cols: ${matrix[2].length}`; 
}

/* start */
createDots();
drop(matrix);
