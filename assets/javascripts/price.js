document.addEventListener("DOMContentLoaded", function(event) {
    // Inputs
    const ageInput = document.querySelector('.age input');
    const priceInput = document.querySelector('.price input');
    const engineSizeInput = document.querySelector('.engine-size input');

    // Elements to insert
    const totalChargesElement = document.querySelector('#total_charges');
    const totalPriceElement = document.querySelector('#total_price');

    const poshlinaElement = document.querySelector('#poshlina');
    const akcizElement = document.querySelector('#akciz');
    const tvaElement = document.querySelector('#tva');

    // Baz stavka is always 50 for engines < 3 litres
    const bazStavka = 50;

    // Usd to eur rate
    const usdRate =  parseFloat(document.querySelector('#usd_rate').textContent);

    function getAge() {
        return parseFloat(ageInput.value)
    }

    function getEngineSize() {
        return parseFloat(engineSizeInput.value)
    }

    function getPrice() {
        return parseFloat(priceInput.value)
    }


    function calculateAkciz() {
        return bazStavka * getAge() * getEngineSize()
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

    function refreshResult() {
        totalChargesElement.textContent = `€ ${Math.round(calculateCharges())}`;

        var totalPrice = Math.round(calculateCharges() + parseFloat(priceInput.value));
        var totalPriceUsd = Math.round(totalPrice * usdRate);
        totalPriceElement.textContent = `€ ${totalPrice} | $ ${totalPriceUsd}`;

        poshlinaElement.textContent = `€ ${ Math.round(calculatePoshlina()) }`;
        akcizElement.textContent = `€ ${Math.round(calculateAkciz()) }`;
        tvaElement.textContent = `€ ${Math.round(calculateTva())}`;
        return null;
    }

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