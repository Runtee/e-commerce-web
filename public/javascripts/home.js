/* Set the width of the side navigation to
250px */

function openNav() {
    var styles = {  }
    document.getElementById("sidebar")
    .setAttribute('style',' display: block')
}
function closeSide() {
    document.getElementById("sidebar")
    .setAttribute('style','width: 0%;')
   
}
function register() {
    document.getElementById("register")
    .setAttribute('style',' display: block')
    document.getElementById("signin")
    .setAttribute('style',' display: none')
    document.getElementById("r-link")
    .setAttribute('style','text-decoration: underline')
    document.getElementById("s-link")
    .setAttribute('style','text-decoration: none')
}
function signin() {
    document.getElementById("register")
    .setAttribute('style',' display: none')
    document.getElementById("signin")
    .setAttribute('style','display: block')
    document.getElementById("r-link")
    .setAttribute('style','text-decoration: none')
    document.getElementById("s-link")
    .setAttribute('style','text-decoration: underline')
}