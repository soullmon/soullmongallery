
// --- ARTWORK DATA ---
const ARTWORKS = 
[
    {
        id: 0,
        title: "Bonfire Fade Out",
        artist: "Soullmon",
        category: "Painting",
        price: 0,
        year: "2023",
        size: "80x80cm",
        medium: "Oil on Canvas",
        images: [
            "gallery/featured.jpeg",
            "gallery/featured2.jpeg"
        ]
    },
   {
    id: 1,
    title: "To You Live Again",
    artist: "soullmon",
    category: "Painting",
    price: "0",
    year: "2023",
    size: "80x80cm",
    medium: "Oil on Canvas",
    sold: true,
    soldBy:"Mike",
    link: "https://instagram.com/mikecollector",
    images: [
        "gallery/paint1.jpeg"
    ]
},
    {
        id: 2,
        title: "Silent Observer",
        artist: "Soullmon",
        category: "Sculpt",
        price: 0,
        year: "2022",
        size: "100x120cm",
        medium: "Acrylic",
        images: [
            "gallery/sculpt1.jpeg"
        ]
    },
    {
        id: 3,
        title: "Urban Decay",
        artist: "soullmon",
        category: "Prints",
        price: 15,
        year: "2024",
        size: "50x70cm",
        medium: "Digital Print",
        images: [
            "gallery/print1.jpeg"
        ]
    },
    {
        id: 4,
        title: "Dream State",
        artist: "soullmon",
        category: "Fabric",
        price: 0,
        year: "2023",
        size: "150x100cm",
        medium: "Mixed Media",
        images: [
            "gallery/fabric1.jpeg"
        ]
    },
    {
        id: 5,
        title: "Color Field V",
        artist: "soullmon",
        category: "Painting",
        price: 0,
        year: "2021",
        size: "200x200cm",
        medium: "Oil on Linen",
        images: [
           "gallery/paint3.png"
            
        ]
    },
    {
        id: 6,
        title: "Lost in Tokyo",
        artist: "soullmon",
        category: "Prints",
        price: 0,
        year: "2024",
        size: "60x90cm",
        medium: "Analog Photo",
        images: [
            "gallery/print2.jpeg"
        ]
    }
];

// --- CART STATE MANAGEMENT ---
let cart = [];
try {
    cart = JSON.parse(localStorage.getItem('soullmon_cart')) || [];
} catch (e) {
    console.error("Cart load failed", e);
    cart = [];
}

function saveCart() {
    localStorage.setItem('soullmon_cart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(item) {
    if (!item || item.sold) return;
    cart.push(item);
    saveCart();
    
    // Dispatch custom event if other components need it
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Automatically open the drawer when an item is added
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    
    if(drawer && backdrop) {
        drawer.classList.add('open');
        backdrop.style.opacity = '1';
        backdrop.style.pointerEvents = 'auto';
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('cart-backdrop');
    if(!drawer || !backdrop) return;
    
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
        drawer.classList.remove('open');
        backdrop.style.opacity = '0';
        backdrop.style.pointerEvents = 'none';
    } else {
        drawer.classList.add('open');
        backdrop.style.opacity = '1';
        backdrop.style.pointerEvents = 'auto';
    }
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const countHeader = document.getElementById('cart-count-header');
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total');

    // 1. Badge Logic - Strictly hide if 0
    if (badge) {
        badge.textContent = cart.length;
        if (cart.length > 0) {
            badge.style.opacity = '1';
        } else {
            badge.style.opacity = '0';
        }
    }

    // 2. Count Header
    if (countHeader) countHeader.textContent = cart.length;

    // 3. Render Items
    if (container) {
        if (cart.length === 0) {
            container.innerHTML = `<div class="text-center text-gray-400 mt-10 font-mono text-sm uppercase">Your cart is empty</div>`;
        } else {
            container.innerHTML = cart.map((item, idx) => {
                // Safety check for image source (handles legacy data format)
                let imgSrc = "";
                if (item.images && item.images.length > 0) {
                    imgSrc = item.images[0];
                } else if (item.image) {
                    imgSrc = item.image;
                } else {
                    imgSrc = "https://via.placeholder.com/150"; // Fallback
                }

                return `
                <div class="flex gap-4 p-4 border border-gray-100 bg-white shadow-sm">
                    <div class="w-16 h-16 bg-gray-100 shrink-0">
                        <img src="${imgSrc}" class="w-full h-full object-cover">
                    </div>
                    <div class="flex-1 flex flex-col justify-between">
                        <div class="flex justify-between items-start">
                            <span class="font-bold text-sm uppercase leading-tight line-clamp-1">${item.title}</span>
                            <button onclick="removeFromCart(${idx})" class="text-gray-300 hover:text-red-500">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div class="flex justify-between items-end mt-2">
                            <span class="text-[10px] text-gray-500 font-mono uppercase">${item.artist}</span>
                            <span class="font-bold font-mono text-sm">$${item.price.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                `;
            }).join('');
        }
    }

    // 4. Calculate Total
    if (totalEl) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalEl.textContent = '$' + total.toLocaleString();
    }
}

// Initialize Cart UI on load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});
