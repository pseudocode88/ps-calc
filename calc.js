var el = {}, data = {};

function cacheSelectors() {
    el.sl = document.getElementById('sl');
    el.ps = document.getElementById('ps');
    el.lev = document.getElementById('lev');
    el.minRisk = document.getElementById('min-risk');
    el.maxRisk = document.getElementById('max-risk');
    el.capital = document.getElementById('capital');
    el.margin = document.getElementById('margin');
    el.risk = document.getElementById('risk');
}

function eventBindings() {
    el.sl.addEventListener('keyup', calc);
    el.ps.addEventListener('keyup', calc);
    el.lev.addEventListener('keyup', calc);
    el.minRisk.addEventListener('keyup', calc);
    el.maxRisk.addEventListener('keyup', calc);
    el.capital.addEventListener('keyup', calc);
}

function updateData() {
    data.sl = el.sl.value;
    data.ps = el.ps.value;
    data.lev = el.lev.value || 1;
    data.minRisk = el.minRisk.value;
    data.maxRisk = el.maxRisk.value;
    data.capital = el.capital.value;
}

function calc() {
    updateData();

    data.margin = data.ps / data.lev;
    data.risk = ((data.sl / 100) * data.lev) * data.margin

    el.margin.innerHTML = data.margin;
    el.risk.innerHTML = data.risk;

    if (data.risk < data.minRisk) {
        el.risk.style.color = "green";
    } else if (data.risk > data.minRisk && data.risk < data.maxRisk) {
        el.risk.style.color = "orange";
    } else {
        el.risk.style.color = "red";
    }
}

function init() {
    console.log('init')
    cacheSelectors();
    eventBindings();
    calc();
}

window.onload = init;