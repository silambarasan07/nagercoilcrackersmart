// Configuration - Update these with your actual contact details
const CONFIG = {
    whatsappNumber: '919876543210', // Your WhatsApp business number (with country code, no + or spaces)
    businessEmail: 'info@nagercoilcrackers.com', // Your business email
    businessName: 'Nagercoil Crackers Mart'
};

// Product Data
const products = [
    // Sparklers
    { id: 1, name: "Golden Sparklers", category: "sparklers", price: 150, image: "🎆", description: "Premium golden sparklers pack of 10" },
    { id: 2, name: "Color Sparklers", category: "sparklers", price: 200, image: "🌈", description: "Multi-color sparklers pack of 12" },
    { id: 3, name: "Electric Sparklers", category: "sparklers", price: 180, image: "⚡", description: "Long-lasting electric sparklers" },
    { id: 4, name: "Heart Sparklers", category: "sparklers", price: 250, image: "❤️", description: "Heart-shaped sparklers for special occasions" },
    { id: 5, name: "Star Sparklers", category: "sparklers", price: 160, image: "⭐", description: "Star pattern sparklers pack of 10" },
    
    // Flower Pots
    { id: 6, name: "Red Flower Pot", category: "flowerpots", price: 350, image: "🌺", description: "Classic red flower pot" },
    { id: 7, name: "Multi-Color Pot", category: "flowerpots", price: 450, image: "🌸", description: "Multi-color flower pot display" },
    { id: 8, name: "Giant Flower Pot", category: "flowerpots", price: 600, image: "🌻", description: "Large size flower pot for grand display" },
    { id: 9, name: "Silver Flower Pot", category: "flowerpots", price: 400, image: "🤍", description: "Elegant silver flower pot" },
    { id: 10, name: "Rainbow Pot", category: "flowerpots", price: 500, image: "🌈", description: "Rainbow color flower pot" },
    
    // Ground Chakkar
    { id: 11, name: "Spinning Chakkar", category: "groundchakkar", price: 280, image: "🎡", description: "Fast spinning ground chakkar" },
    { id: 12, name: "Color Chakkar", category: "groundchakkar", price: 320, image: "🎨", description: "Multi-color spinning wheel" },
    { id: 13, name: "Big Wheel", category: "groundchakkar", price: 450, image: "🎠", description: "Large ground chakkar wheel" },
    { id: 14, name: "Double Chakkar", category: "groundchakkar", price: 380, image: "🎯", description: "Double spinning chakkar" },
    { id: 15, name: "LED Chakkar", category: "groundchakkar", price: 550, image: "💡", description: "LED illuminated ground chakkar" },
    
    // Children's Special
    { id: 16, name: "Pencil Sparklers", category: "childrens", price: 100, image: "✏️", description: "Safe pencil sparklers for kids" },
    { id: 17, name: "Small Poppers", category: "childrens", price: 80, image: "🎉", description: "Small poppers pack of 20" },
    { id: 18, name: "Smoke Balls", category: "childrens", price: 120, image: "💨", description: "Colorful smoke balls" },
    { id: 19, name: "Toy Guns", category: "childrens", price: 250, image: "🔫", description: "Safe toy gun crackers" },
    { id: 20, name: "Magic Whistles", category: "childrens", price: 90, image: "🎵", description: "Musical whistle crackers" },
    { id: 21, name: "Fairy Lights", category: "childrens", price: 180, image: "✨", description: "Safe fairy light strings" },
    { id: 22, name: "Mini Rockets", category: "childrens", price: 200, image: "🚀", description: "Small safe rockets for kids" },
    { id: 23, name: "Confetti Poppers", category: "childrens", price: 150, image: "🎊", description: "Confetti celebration poppers" },
    
    // Rockets
    { id: 24, name: "Sky Rocket", category: "rockets", price: 400, image: "🚀", description: "High-flying sky rocket" },
    { id: 25, name: "Multi-Shot Rocket", category: "rockets", price: 600, image: "🎆", description: "Multi-shot rocket display" },
    { id: 26, name: "Whistling Rocket", category: "rockets", price: 450, image: "📯", description: "Whistling effect rocket" },
    { id: 27, name: "Parachute Rocket", category: "rockets", price: 550, image: "🪂", description: "Rocket with parachute effect" },
    { id: 28, name: "Color Burst Rocket", category: "rockets", price: 700, image: "💥", description: "Color burst sky rocket" },
    
    // Atom Bombs
    { id: 29, name: "Classic Atom Bomb", category: "bombs", price: 300, image: "💣", description: "Classic loud atom bomb" },
    { id: 30, name: "Thunder Bomb", category: "bombs", price: 350, image: "⛈️", description: "Thunder sound bomb" },
    { id: 31, name: "Multi-Burst Bomb", category: "bombs", price: 450, image: "💥", description: "Multi-burst effect bomb" },
    { id: 32, name: "Giant Bomb", category: "bombs", price: 500, image: "🔥", description: "Large size atom bomb" },
    
    // Fountains
    { id: 33, name: "Silver Fountain", category: "fountains", price: 350, image: "⛲", description: "Elegant silver fountain" },
    { id: 34, name: "Gold Fountain", category: "fountains", price: 400, image: "🏆", description: "Golden shower fountain" },
    { id: 35, name: "Color Fountain", category: "fountains", price: 450, image: "🌈", description: "Multi-color fountain display" },
    { id: 36, name: "Giant Fountain", category: "fountains", price: 600, image: "🗼", description: "Large fountain for grand display" },
    { id: 37, name: "Musical Fountain", category: "fountains", price: 550, image: "🎶", description: "Fountain with musical effects" },
];

// Cart State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateCartCount();
});

// Render Products
function renderProducts(productsToRender) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card bg-white rounded-xl shadow-lg overflow-hidden';
        card.innerHTML = `
            <div class="h-48 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <span class="text-7xl product-image">${product.image}</span>
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-gray-800 mb-2">${product.name}</h3>
                <p class="text-sm text-gray-500 mb-3">${product.description}</p>
                <div class="flex items-center justify-between">
                    <span class="text-xl font-bold text-purple-500">₹${product.price}</span>
                    <button onclick="addToCart(${product.id})" class="btn-primary text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filter Products
function filterProducts(category) {
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
    
    // Scroll to products section
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCart();
        }
    }
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Render Cart
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-shopping-cart text-4xl mb-4"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        document.getElementById('cart-total').textContent = '₹0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="flex items-center gap-4 py-4 border-b">
            <div class="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                <span class="text-3xl">${item.image}</span>
            </div>
            <div class="flex-1">
                <h4 class="font-semibold text-gray-800">${item.name}</h4>
                <p class="text-purple-500 font-medium">₹${item.price}</p>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="updateQuantity(${item.id}, -1)" class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-purple-200">
                    <i class="fas fa-minus text-sm"></i>
                </button>
                <span class="w-8 text-center font-medium">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" class="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-purple-200">
                    <i class="fas fa-plus text-sm"></i>
                </button>
            </div>
            <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = `₹${total}`;
}

// Open Cart
function openCart() {
    renderCart();
    document.getElementById('cart-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close Cart
function closeCart() {
    document.getElementById('cart-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    closeCart();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('order-total').textContent = `₹${total}`;
    document.getElementById('order-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close Order Modal
function closeOrderModal() {
    document.getElementById('order-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Submit Order
function submitOrder(event) {
    event.preventDefault();
    
    // Get form data
    const form = event.target;
    const formData = new FormData(form);
    const customerName = form.querySelector('input[type="text"]').value;
    const customerPhone = form.querySelector('input[type="tel"]').value;
    const customerAddress = form.querySelector('textarea').value;
    const customerCity = form.querySelectorAll('input[type="text"]')[1].value;
    
    // Calculate order total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Generate order ID
    const orderId = 'NCM' + Date.now().toString().slice(-8);
    
    // Format order details for message
    let orderDetails = `🎆 *NEW ORDER - ${CONFIG.businessName}* 🎆\n\n`;
    orderDetails += `📋 *Order ID:* ${orderId}\n`;
    orderDetails += `👤 *Customer Name:* ${customerName}\n`;
    orderDetails += `📞 *Phone:* ${customerPhone}\n`;
    orderDetails += `📍 *Address:* ${customerAddress}\n`;
    orderDetails += `🏙️ *City:* ${customerCity}\n\n`;
    orderDetails += `📦 *Order Items:*\n`;
    orderDetails += `─────────────────\n`;
    
    cart.forEach((item, index) => {
        orderDetails += `${index + 1}. ${item.name}\n`;
        orderDetails += `   Qty: ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}\n`;
    });
    
    orderDetails += `─────────────────\n`;
    orderDetails += `💰 *Total Amount: ₹${total}*\n\n`;
    orderDetails += `Thank you for your order! 🎉`;
    
    // Store order details for messaging
    window.currentOrder = {
        orderId,
        customerName,
        customerPhone,
        customerAddress,
        customerCity,
        total,
        orderDetails
    };
    
    // Show messaging options modal
    showMessagingOptions();
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    
    // Close order modal
    closeOrderModal();
    
    // Reset form
    form.reset();
}

// Show Messaging Options
function showMessagingOptions() {
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'messaging-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-8 max-w-md w-full">
            <div class="text-center mb-6">
                <div class="text-5xl mb-4">🎉</div>
                <h3 class="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h3>
                <p class="text-gray-600">Choose how you'd like to receive your order confirmation:</p>
            </div>
            
            <div class="space-y-4">
                <button onclick="sendViaWhatsApp()" class="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-colors">
                    <i class="fab fa-whatsapp text-2xl"></i>
                    <span>Send via WhatsApp</span>
                </button>
                
                <button onclick="sendViaEmail()" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-colors">
                    <i class="fas fa-envelope text-2xl"></i>
                    <span>Send via Email</span>
                </button>
                
                <button onclick="sendBoth()" class="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-colors">
                    <i class="fas fa-share-alt text-2xl"></i>
                    <span>Send via Both</span>
                </button>
                
                <button onclick="closeMessagingModal()" class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors">
                    Skip for Now
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Close Messaging Modal
function closeMessagingModal() {
    const modal = document.getElementById('messaging-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Send via WhatsApp
function sendViaWhatsApp() {
    if (!window.currentOrder) return;
    
    const phoneNumber = CONFIG.whatsappNumber;
    const message = encodeURIComponent(window.currentOrder.orderDetails);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    showNotification('Opening WhatsApp...', 'success');
    closeMessagingModal();
}

// Send via Email
function sendViaEmail() {
    if (!window.currentOrder) return;
    
    const email = CONFIG.businessEmail;
    const subject = encodeURIComponent(`New Order - ${window.currentOrder.orderId}`);
    const body = encodeURIComponent(window.currentOrder.orderDetails);
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoUrl;
    showNotification('Opening email client...', 'success');
    closeMessagingModal();
}

// Send via Both
function sendBoth() {
    sendViaWhatsApp();
    setTimeout(() => {
        sendViaEmail();
    }, 1000);
}

// Submit Contact Form
function submitContact(event) {
    event.preventDefault();
    showNotification('Message sent successfully! We will get back to you soon.', 'success');
    document.getElementById('contact-form').reset();
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('active');
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white font-medium`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Close modals on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCart();
        closeOrderModal();
    }
});

// Close cart when clicking outside
document.getElementById('cart-modal').addEventListener('click', (e) => {
    if (e.target.id === 'cart-modal') {
        closeCart();
    }
});

// Close order modal when clicking outside
document.getElementById('order-modal').addEventListener('click', (e) => {
    if (e.target.id === 'order-modal') {
        closeOrderModal();
    }
});
