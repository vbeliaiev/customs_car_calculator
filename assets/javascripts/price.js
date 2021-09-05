document.addEventListener("DOMContentLoaded", function(event) {
    // Inputs
    const ageInput = document.querySelector('.age input');
    const priceInput = document.querySelector('.price input');
    const engineSizeInput = document.querySelector('.engine-size input');

    // Outputs
    const totalChargesElement = document.querySelector('#total_charges');
    const totalPriceEurElement = document.querySelector('#total_price_eur');
    const totalPriceUsdElement = document.querySelector('#total_price_usd');

    const poshlinaElement = document.querySelector('#poshlina');
    const akcizElement = document.querySelector('#akciz');
    const tvaElement = document.querySelector('#tva');

    // Baz stavka is always 50 for engines < 3 litres
    const bazStavka = 50;

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
    function calculateAkciz() {
        return calculateBaseRate() * getAge() * getEngineSize()
    }

    function calculatePoshlina() {
        return 0.055 * getPrice();
    }

    function calculateTva() {
        return 0.2 * (getPrice() + calculateAkciz() + calculatePoshlina());
    }

    function calculateCharges() {
        var akciz = calculateAkciz();
        var poshlina = calculatePoshlina();
        var tva = calculateTva();

        return poshlina + akciz + tva;
    }

    // Refresh
    function refreshResult() {
        totalChargesElement.textContent = `€${Math.round(calculateCharges())}`;

        var totalPriceEur = Math.round(calculateCharges() + parseFloat(priceInput.value));
        var totalPriceUsd = Math.round(totalPriceEur * usdRate);
        totalPriceEurElement.textContent = `€${totalPriceEur}`
        totalPriceUsdElement.textContent = ` ($${totalPriceUsd})`

        poshlinaElement.textContent = `€ ${ Math.round(calculatePoshlina()) }`;
        akcizElement.textContent = `€ ${Math.round(calculateAkciz()) }`;
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