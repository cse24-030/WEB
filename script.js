// Initialize cart in localStorage if it doesn't exist
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}

// Update cart count in navigation
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    let totalCount = 0;
    
    cart.forEach(item => {
        totalCount += item.quantity;
    });
    
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalCount;
    });
}

// Add to cart functionality
function setupAddToCartButtons() {
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    if (addToCartBtns.length > 0) {
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const name = this.getAttribute('data-name');
                const price = parseFloat(this.getAttribute('data-price'));
                const image = this.getAttribute('data-image');
                
                let cart = JSON.parse(localStorage.getItem('cart'));
                
                // Check if item already exists in cart
                const existingItem = cart.find(item => item.name === name);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        name,
                        price,
                        image,
                        quantity: 1
                    });
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                
                // Show confirmation
                alert(`${name} has been added to your cart!`);
            });
        });
    }
}

// Render cart items on cart page
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cartItemsContainer && cartTotalElement) {
        const cart = JSON.parse(localStorage.getItem('cart'));
        cartItemsContainer.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is currently empty.</p>';
            cartTotalElement.textContent = 'bwp0.00';
            return;
        }
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">bwp${item.price.toFixed(2)} x ${item.quantity}</div>
                    <button class="remove-item" data-name="${item.name}">Remove</button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        cartTotalElement.textContent = `bwp${total.toFixed(2)}`;
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemName = this.getAttribute('data-name');
                let cart = JSON.parse(localStorage.getItem('cart'));
                
                cart = cart.filter(item => item.name !== itemName);
                localStorage.setItem('cart', JSON.stringify(cart));
                
                renderCart();
                updateCartCount();
            });
        });
    }
}

// Setup checkout button
function setupCheckoutButton() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            const cart = JSON.parse(localStorage.getItem('cart'));
            if (cart.length === 0) {
                e.preventDefault();
                alert('Your cart is empty. Please add items before checking out.');
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    setupAddToCartButtons();
    renderCart();
    setupCheckoutButton();
});