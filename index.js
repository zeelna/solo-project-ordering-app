import {menuArray} from './data.js'

let shoppingCart = {}

document.addEventListener('click', function(e){
    if (e.target.dataset.add){
        handleAddItemClick(e.target.dataset.add)
    } else if (e.target.dataset.remove) {
        handleRemoveItemClick(e.target.dataset.remove)
    } else if (e.target.dataset.clear) {
        handleClearItemClick(e.target.dataset.clear)

    } else if (e.target.id === 'btn-complete-order'){

    } else if (e.target.id === 'btn-pay'){

    }
})

function handleAddItemClick(itemId){
    const targetItem = menuArray.filter(element => element.id === parseInt(itemId))[0]
    console.log(targetItem)
    /* Defensive dictionary population */
    shoppingCart[targetItem.id] = (shoppingCart[targetItem.id] || 0) + 1
    console.log(shoppingCart)
    render()
}

function handleRemoveItemClick(itemId) {
    const targetItem = menuArray.filter(element => element.id === parseInt(itemId))[0]
    /* Force Defensive programming if malicious user trying to delete item in shopping cart, that should not exist in cart*/
    if (shoppingCart[targetItem.id] < 0) {
        /* Defensive dictionary key removal */
        shoppingCart[targetItem.id] = 0
        delete shoppingCart[targetItem.id]
    /* Happy path*/
    } else if (shoppingCart[targetItem.id] > 0) {
        shoppingCart[targetItem.id] -= 1
    }

    /* Must remain in separate if-block, operates to sanitize shoppingCart object's keys.
    *  render() renders <div id='order-section'> if 1 or more items exist. Other-wise no render of that <div> HTML tag. */
    if (shoppingCart[targetItem.id] === 0) {
        /* Defensive dictionary key removal */
        delete shoppingCart[targetItem.id]
    }
    render()
}

function handleClearItemClick(itemId){
    const targetItem = menuArray.filter(element => element.id === parseInt(itemId))[0]
    shoppingCart[targetItem.id] = 0
    delete shoppingCart[targetItem.id]

    render()
}


function getMenuItems() {
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
            <button class="btn-add-item inter" data-add='${item.id}' >+</button>
        </div>
    `
    })
    return menuHTML
}


function getShoppingCart() {
    let shoppingCartHTML = ""
    let totalPrice = 0

    Object.entries(shoppingCart).forEach(([key, value]) => {
        const item = menuArray.filter(element => element.id === parseInt(key))[0]
        totalPrice += (item.price * value)
        /* Adding HTML*/
        shoppingCartHTML +=
            `
                <div id='order-id-${item.id}' class="order-item flex-space-between" >
                    <div class="container-cart-btns">
                        <h4>${item.name} (x${value})</h4>
                        <button class="btn-remove borderless" data-remove='${item.id}'>remove</button>
                        <button class="btn-clear-all borderless" data-clear='${item.id}'>clear all</button>
                    </div>
                    <h5 class="accent">$${item.price * value}</h5>
                </div>
            `
    })
    return `
            <div class="container">
                <h4 id="title-your-order" class="title-your-order">Your order</h4>
                    <div class="orders flex-space-between">
                        ${shoppingCartHTML}
                    </div>
                    <div class="total flex-space-between">
                        <h4 class="title-total">Total price: </h4>
                        <h5 class="price-total">$${totalPrice}</h5>
                    </div>
                    <button class="btn-complete-order">Complete order</button>
            </div>
        `
}

function render() {
    document.getElementById('menu-section').innerHTML = getMenuItems()

    const isItemsInCart = Object.entries(shoppingCart).some(([key, value]) => {
        console.log(key, value)
        return value >= 1
    })
    console.log(isItemsInCart)
    if (isItemsInCart) {
        document.getElementById('cart-section').innerHTML = getShoppingCart()
    } else {
        document.getElementById('cart-section').innerHTML = ''
    }
    /* debug */
    console.log(shoppingCart)
}

render()