let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartUI() {
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
    }
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    alert(`تمت إضافة "${productName}" إلى سلة التسوق بنجاح!`);
}

function decreaseQuantity(productName) {
    const item = cart.find(i => i.name === productName);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart = cart.filter(i => i.name !== productName);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        renderCartModal();
    }
}

function increaseQuantity(productName) {
    const item = cart.find(i => i.name === productName);
    if (item) {
        item.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
        renderCartModal();
    }
}

function clearCart() {
    cart = [];
    localStorage.removeItem('cart');
    updateCartUI();
    renderCartModal();
}

function renderCartModal() {
    const modalBody = document.getElementById('cart-modal-body');
    const modalTotal = document.getElementById('cart-total');
    
    if (!modalBody) return;
    
    if (cart.length === 0) {
        modalBody.innerHTML = '<p class="text-center text-muted m-0">السلة فارغة حالياً.</p>';
        if (modalTotal) modalTotal.textContent = '0';
        return;
    }
    
    let html = '<ul class="list-group list-group-flush">';
    cart.forEach(item => {
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0 fw-bold">${item.name}</h6>
                    <small class="text-muted">${item.price} ريال</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-danger px-2" onclick="decreaseQuantity('${item.name}')">-</button>
                    <span class="fw-bold">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-success px-2" onclick="increaseQuantity('${item.name}')">+</button>
                </div>
            </li>
        `;
    });
    html += '</ul>';
    
    modalBody.innerHTML = html;
    if (modalTotal) {
        modalTotal.textContent = calculateTotal();
    }
}

function showOfferToast() {
    toastr.options = {
        "positionClass": "toast-bottom-right",
        "timeOut": "3000"
    };
    toastr.success('كود الخصم: ELEGANCE2026', 'تم تفعيل الخصم!');
}

function loadPerfumeDetails() {
    $.ajax({
        url: 'ajax-perfume.html',
        type: 'GET',
        success: function(data) {
            $('#modal-container').html(data);
            $('#perfumeModal').modal('show');
        },
        error: function() {
            alert('تعذر تحميل بيانات العطر.');
        }
    });
}

function loadPolicyDetails() {
    $.ajax({
        url: 'ajax-policy.html',
        type: 'GET',
        success: function(data) {
            $('#modal-container').html(data);
            $('#policyModal').modal('show');
        },
        error: function() {
            alert('تعذر تحميل سياسة الاسترجاع.');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    
    updateCartUI();
    
    const heartIcons = document.querySelectorAll('.fa-heart');
    heartIcons.forEach(icon => {
        icon.style.cursor = 'pointer';
        icon.addEventListener('click', function() {
            this.classList.toggle('active');
            this.classList.toggle('fa-solid');
            this.classList.toggle('fa-regular');
        });
    });
    
    const searchInput = document.querySelector('input[type="text"]');
    const productCols = document.querySelectorAll('.row-cols-2 > .col');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            productCols.forEach(col => {
                const title = col.querySelector('.card-title')?.textContent.toLowerCase() || '';
                const category = col.querySelector('.badge')?.textContent.toLowerCase() || '';
                
                if (title.includes(query) || category.includes(query)) {
                    col.style.display = '';
                } else {
                    col.style.display = 'none';
                }
            });
        });
    }
    
    const filterButtons = document.querySelectorAll('.text-center.my-3 .btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => {
                b.classList.remove('btn-warning', 'active');
                b.classList.add('btn-outline-dark');
            });
            this.classList.remove('btn-outline-dark');
            this.classList.add('btn-warning', 'active');
            
            const filterText = this.textContent.trim();
            
            productCols.forEach(col => {
                const badge = col.querySelector('.badge')?.textContent.trim() || '';
                
                if (filterText === 'الكل') {
                    col.style.display = '';
                } else if (filterText === 'عطور رجالية' && badge === 'رجالي') {
                    col.style.display = '';
                } else if (filterText === 'عطور نسائية' && badge === 'نسائي') {
                    col.style.display = '';
                } else if (filterText === 'بخور وعود' && badge === 'بخور وعود') {
                    col.style.display = '';
                } else {
                    col.style.display = 'none';
                }
            });
        });
    });
    
    const addToCartButtons = document.querySelectorAll('.card .btn-dark');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            const productName = card.querySelector('.card-title')?.textContent || 'منتج';
            
            const priceText = card.querySelector('.text-danger')?.textContent || '0';
            const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
            
            addToCart(productName, price);
        });
    });
});
