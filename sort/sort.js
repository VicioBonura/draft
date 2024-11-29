const c = {
    minValue: 0,
    maxValue: 100,
    totElements: 200,
    a: [], 

    init: function() {
        for (let i = 0; i < c.totElements; i++) {
            c.a.push(Math.floor(Math.random() * (c.maxValue - c.minValue + 1)) + c.minValue);
        }
    }
}
  
const container = document.getElementById("container");

function draw() {
    const fragment = document.createDocumentFragment();
    c.a.map((el, i) => {
        const div = document.createElement("div");
        div.style.height = `${el}%`;
        div.classList.add("item");
        div.textContent = el;
        div.dataset.index = i;
        fragment.appendChild(div);
    });
    clear();
    container.appendChild(fragment);
}

function clear() {
    container.innerHTML = "";
}

async function bubbleSort(delay = 50) {
    document.getElementsByTagName("h1")[0].textContent = "Bubble Sort";
    let swapped;
    let iteration = 1;
    do {
        swapped = false;
        for (let i = 0; i < c.a.length - iteration; i++) {
            const item1 = document.querySelector(`.item[data-index="${i}"]`);
            const item2 = document.querySelector(`.item[data-index="${i + 1}"]`);
            item1.classList.add("checked");
            item2.classList.add("checked");
            if (c.a[i] > c.a[i + 1]) {
                item1.classList.add("swapped");
                item2.classList.add("swapped");
                [c.a[i], c.a[i + 1]] = [c.a[i + 1], c.a[i]];
                swapped = true;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
            draw();
        }
        iteration++;
    } while (swapped);
    const items = document.querySelectorAll(".item");
    items.forEach(el => el.classList.add("checked"));
}

async function quickSort(delay = 50, low = 0, high = c.a.length - 1) {
    document.getElementsByTagName("h1")[0].textContent = "Quick Sort";
    if (low < high) {
        const pi = await partition(low, high, delay);
        await quickSort(delay, low, pi - 1);
        await quickSort(delay, pi + 1, high);
    }
}

async function partition(low, high, delay) {
    const pivot = c.a[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        const item1 = document.querySelector(`.item[data-index="${j}"]`);
        const item2 = document.querySelector(`.item[data-index="${high}"]`);
        item1.classList.add("checked");
        item2.classList.add("checked");

        if (c.a[j] < pivot) {
            i++;
            const item3 = document.querySelector(`.item[data-index="${i}"]`);
            item3.classList.add("swapped");
            item1.classList.add("swapped");
            [c.a[i], c.a[j]] = [c.a[j], c.a[i]];
            await new Promise(resolve => setTimeout(resolve, delay));
            draw();
        }

        item1.classList.remove("checked", "swapped");
        item2.classList.remove("checked");
    }
    const item4 = document.querySelector(`.item[data-index="${i + 1}"]`);
    const item5 = document.querySelector(`.item[data-index="${high}"]`);
    item4.classList.add("swapped");
    item5.classList.add("swapped");
    [c.a[i + 1], c.a[high]] = [c.a[high], c.a[i + 1]];
    await new Promise(resolve => setTimeout(resolve, delay));
    draw();
    item4.classList.remove("swapped");
    item5.classList.remove("swapped");
    return i + 1;
    const items = document.querySelectorAll(".item");
    items.forEach(el => el.classList.add("checked"));
}

c.init();
draw();
quickSort();

