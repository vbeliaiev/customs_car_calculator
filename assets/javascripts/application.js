//= require bootstrap.bundle.min
//= require price

function formatYear(value){
    currentYear = new Date().getFullYear()
    var formattedYear;

    if (value == 15) {
        formattedYear = value + "+ (" + (currentYear - value) + "+)"
    } else {
        formattedYear = value + " (" + (currentYear - value) + ")"
    }
    return formattedYear
}