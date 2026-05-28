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
        handleCompleteOrderClick();
    } else if (e.target.id === 'btn-pay'){
        /* Must use .preventDefault() to avoid credential-leak via URI */
        e.preventDefault()
        handlePayOrderClick();
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
                    <button id="btn-complete-order" class="btn-complete-order">Complete order</button>
            </div>
        `
}

const payModal = document.getElementById('modal-checkout')
const payModalInner = document.getElementById('modal-checkout-inner')
function handleCompleteOrderClick(){
    openPayModal()
    render()
}

function openPayModal(){
    payModalInner.innerHTML = `
        <h2>Enter card details</h2>
        <form id="form-payment" class="form-payment">
            <div class="form-group">
                <label class="label-text" for="name-id">Your name</label>
                <input
                    class="input-field"
                    type="text"
                    placeholder="ex. John Smith"
                    name="name"
                    id="name-id"
                    required
                    >
            </div>
            <div class="form-group">
                <label class="label-text" for="card-id">Card number</label>
                <input
                   class="input-field"
                   type="text"
                   placeholder="ex. IBAN12345678"
                   name="card"
                   id="card-id"
                   required
                >
            </div>
            <div class="form-group">
                <label class="label-text" for="cvv-id">CVV</label>
                <input
                   class="input-field"
                   type="password"
                   placeholder="ex. 098"
                   name="cvv"
                   id="cvv-id"
                   required
                >
            </div>
            <input id="btn-pay" class="btn-pay" type="submit" value="Pay">
        </form>
        `
    payModal.style.display = 'flex'
}

function closePayModal(){
    payModal.style.display = 'none'
}

function handlePayOrderClick() {
    closePayModal()

    /* Build HTML to notify user of Order Completed : */
    /* A. Extract name for HTML */
    const paymentForm = document.getElementById('form-payment')
    const paymentFormData = new FormData(paymentForm)
    const fullName = paymentFormData.get('name')
    /* B. Update dom with message */
    const orderCompletedHTML = `
            <div id="container-completed-order" class="container completed-order">
                <h2 id="msg-completed-order" class="msg-completed-order">
                    Thanks, ${fullName}! Your order is on its way!
                </h2>
            </div>
        `
    /* C. Add message below menu-items.*/

    openOrderCompleteModal(orderCompletedHTML)

    /* Clean-up */
    if (isItemsInCart(shoppingCart)) {
        shoppingCart = {}
    }
    render()
}

function openOrderCompleteModal(orderCompletedHTML){
    const completedSection = document.getElementById('completed-section')
    completedSection.style.display = 'flex'
    completedSection.innerHTML = orderCompletedHTML;
}

function closeOrderCompleteModal(){
    /* Find more appropriate logic*/
    const completedSection = document.getElementById('completed-section')
    completedSection.style.display = 'none'
    completedSection.innerHTML = ''
}

function isItemsInCart(shoppingCart){
    return Object.entries(shoppingCart).some(([key, value]) => {
        console.log(key, value)
        return value >= 1
    })
}
function render() {
    document.getElementById('menu-section').innerHTML = getMenuItems()

    if (isItemsInCart(shoppingCart)) {
        closeOrderCompleteModal()
        document.getElementById('cart-section').innerHTML = getShoppingCart()
    } else {
        document.getElementById('cart-section').innerHTML = ''
    }
    /* debug */
    console.log(shoppingCart)
}

render()