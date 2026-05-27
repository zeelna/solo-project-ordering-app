import { menuArray } from './data.js'

const menuSection = document.getElementById('menu-section')

console.log(menuSection)

let menuHTML = ""
menuArray.forEach(item => {
    menuHTML += `
    <div class="container item-details">
        <h3 class="image-menu-item">${item.emoji}</h3>
        <div class="menu-text">
            <h4>${item.name}</h4>
            <p>${item.ingredients.join(', ')}</p>
            <h5 class="accent">$${item.price}</h5>
        </div>
        <button class="btn-add-item inter">+</button>
    </div>
`
})

menuSection.innerHTML = menuHTML
