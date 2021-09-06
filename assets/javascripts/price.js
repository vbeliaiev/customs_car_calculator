document.addEventListener("DOMContentLoaded", function(event) {
    // Terms:
    // excise tax - Акциз
    // duty - Пошлина
    // base rate - Базовая ставка

    // Inputs
    const ageInput = document.querySelector('.age input');
    const priceInput = document.querySelector('.price input');
    const engineSizeInput = document.querySelector('.engine-size input');

    // Outputs
    const totalChargesElement = document.querySelector('#total_charges');
    const totalPriceEurElement = document.querySelector('#total_price_eur');
    const totalPriceUsdElement = document.querySelector('#total_price_usd');

    const dutyElement = document.querySelector('#duty');
    const exciseTaxElement = document.querySelector('#excise_tax');
    const tvaElement = document.querySelector('#tva');

    // Usd to eur rate
    const usdRate =  parseFloat(document.querySelector('#usd_rate').textContent);

    // Getters

    // The values of engine-type
    // 0 - Benzine (Gasoline)
    // 1 - Diesel
    function getEngineType() {
        return document.querySelector("input[name='engine-type']:checked").value
    }

    function getAge() {
        return parseFloat(ageInput.value)
    }

    function getEngineSize() {
        return parseFloat(engineSizeInput.value)
    }

    function getPrice() {
        return parseFloat(priceInput.value)
    }


    // Business logic
    function calculateBaseRate() {
        var result;
        if (getEngineType() == "0") {
            // Gasoline
            if (getEngineSize() < 3) {
                result = 50
            } else {
                result = 100
            }
        } else {
            // Diesel
            if (getEngineSize() < 3) {
                result = 75
            } else {
                result = 150
            }
        }
        return result;
    }
    function calculateExciseTax() {
        return calculateBaseRate() * getAge() * getEngineSize()
    }

    function calculateDuty() {
        return 0.055 * getPrice();
    }

    function calculateTva() {
        return 0.2 * (getPrice() + calculateExciseTax() + calculateDuty());
    }

    function calculateCharges() {
        var exciseTax = calculateExciseTax();
        var duty = calculateDuty();
        var tva = calculateTva();

        return duty + exciseTax + tva;
    }

    // Refresh
    function refreshResult() {
        totalChargesElement.textContent = `€${Math.round(calculateCharges())}`;

        var totalPriceEur = Math.round(calculateCharges() + parseFloat(priceInput.value));
        var totalPriceUsd = Math.round(totalPriceEur * usdRate);
        totalPriceEurElement.textContent = `€${totalPriceEur}`
        totalPriceUsdElement.textContent = ` ($${totalPriceUsd})`

        dutyElement.textContent = `€ ${ Math.round(calculateDuty()) }`;
        exciseTaxElement.textContent = `€ ${Math.round(calculateExciseTax()) }`;
        tvaElement.textContent = `€ ${Math.round(calculateTva())}`;
        return null;
    }

    document.querySelector("input#btnradio_gasoline").addEventListener('click', (event) => {
        refreshResult();
    });

    document.querySelector("input#btnradio_diesel").addEventListener('click', (event) => {
        refreshResult();
    });

    ageInput.addEventListener('change', (event) => {
        refreshResult();
    });

    priceInput.addEventListener('change', (event) => {
        refreshResult();
    });

    engineSizeInput.addEventListener('change', (event) => {
        refreshResult();
    });
});