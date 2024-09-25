const screen = document.querySelector('.screen');
const inspector = document.getElementById('inspector');
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?~';

function getRandomId(numChars) {
    let id = '';
    for (let i = 0; i < numChars; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}

function createChar(x, y, id, delay) {
    const char = document.createElement('div');
    char.classList.add('char');
    char.textContent = chars[Math.floor(Math.random() * chars.length)];
    char.style.setProperty('--x', x);
    char.style.setProperty('--y', y);
    char.style.setProperty('--delay', delay);
    char.id = id;
    screen.appendChild(char);
}

function deleteChar(char) {
    let remChar = document.getElementById(char);
    remChar.remove();
}

function drawChar(timeoutDraw, timeoutDelete) {
    let tempId = getRandomId(5);
    let delay = Math.random() * 10;
    createChar(Math.floor(Math.random() * screen.clientWidth), 0, tempId, delay);
    inspector.textContent = document.querySelectorAll('.char').length;
    setTimeout(() => {
        drawChar(Math.floor(Math.random() * 10), timeoutDelete);
    }, timeoutDraw);
    setTimeout(() => {
        deleteChar(tempId);
    }, timeoutDelete);

}

/* start */
drawChar(100, 3000);
