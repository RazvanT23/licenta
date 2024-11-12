function updateCartCount() {
    let cart = localStorage.getItem('cart');
    let count = 0;
    if (cart) {
        cart = JSON.parse(cart);
        count = cart.reduce((total, item) => total + item.quantity, 0);
    }
    const cartCountElement = document.querySelector('#cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;

    let cart = localStorage.getItem('cart');
    cart = cart ? JSON.parse(cart) : [];

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td><input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input"></td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${itemTotal.toFixed(2)}</td>
            <td><button class="remove-btn" data-id="${item.id}">Remove</button></td>
        `;
        cartItemsContainer.appendChild(row);
    });

    document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
}

function updateQuantity(productId, newQuantity) {
    let cart = localStorage.getItem('cart');
    if (cart) {
        cart = JSON.parse(cart);
        const product = cart.find(item => item.id === productId);
        if (product) {
            product.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCartItems();
            updateCartCount(); 
        }
    }
}

function removeItem(productId) {
    let cart = localStorage.getItem('cart');
    if (cart) {
        cart = JSON.parse(cart);
        const index = cart.findIndex(item => item.id === productId);
        if (index !== -1) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCartItems();
            updateCartCount(); 
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateCartCount(); 
});
