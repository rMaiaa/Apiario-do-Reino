// Função para adicionar produto ao carrinho
function addToCart(productName, price, imageSrc, size) {
    // Pegar elementos do carrinho principal
    const cartItems = document.querySelector('.cart-items');
    const cartEmptyElement = document.querySelector('.cart-empty');
    const cartContainer = document.querySelector('.cart-container');
    const cartSummary = document.querySelector('.cart-summary');
    
    // Transformar o preço para garantir formato correto
    const priceValue = parseFloat(price.replace('R$ ', '').replace(',', '.'));
    
    // Verificar se o produto já existe no carrinho
    let existingItem = null;
    const cartItemsList = document.querySelectorAll('.cart-item');
    
    for (let i = 0; i < cartItemsList.length; i++) {
        const itemName = cartItemsList[i].querySelector('.cart-product-info h3').textContent;
        const itemSize = cartItemsList[i].querySelector('.cart-product-details').textContent;
        
        // Verificar se o nome e o tamanho do produto correspondem
        if (itemName === productName && itemSize === size) {
            existingItem = cartItemsList[i];
            break;
        }
    }
    
    if (existingItem) {
        // Se o item já existe, apenas incremente a quantidade
        const quantityInput = existingItem.querySelector('.quantity-input');
        let currentQuantity = parseInt(quantityInput.value);
        currentQuantity++;
        quantityInput.value = currentQuantity;
        
        // Atualizar o subtotal deste item
        updateItemSubtotal(existingItem);
        
        // Atualizar também a quantidade no mini-carrinho
        updateMiniCartItemQuantity(productName, currentQuantity);
    } else {
        // Criar novo item de carrinho se não existir
        const newItem = document.createElement('div');
        newItem.className = 'cart-item';
        newItem.innerHTML = `
            <div class="cart-img">
                <img src="${imageSrc}" alt="${productName}">
            </div>
            <div class="cart-product-info">
                <h3>${productName}</h3>
                <div class="cart-product-details">${size}</div>
            </div>
            <div class="cart-price">R$ ${price}</div>
            <div class="cart-quantity">
                <div class="quantity-btn minus">-</div>
                <input type="text" class="quantity-input" value="1">
                <div class="quantity-btn plus">+</div>
            </div>
            <div class="subtotal">R$ ${price}</div>
            <button class="remove-item">✕</button>
        `;
        
        // Adicionar o novo item ao carrinho
        cartItems.appendChild(newItem);
        
        // Configurar botões para o novo item
        setupNewItemButtons(newItem);
        
        // Adicionar ao mini-carrinho também
        addToMiniCart(productName, price, imageSrc);
    }
    
    // Atualizar a interface do carrinho
    if (cartItems.children.length > 0) {
        cartEmptyElement.style.display = 'none';
        cartContainer.style.display = 'block';
        cartSummary.style.display = 'block';
    }
    
    // Atualizar contador de itens e totais
    updateCartCount();
    updateCartTotal();
    
    // Mostrar mensagem de confirmação
    showAddedToCartMessage(productName);
}

// Nova função para atualizar a quantidade de um item no mini-carrinho
function updateMiniCartItemQuantity(productName, quantity) {
    const miniCartItems = document.querySelectorAll('.mini-cart-item');
    
    miniCartItems.forEach(miniItem => {
        if (miniItem.querySelector('.mini-cart-title').textContent === productName) {
            miniItem.querySelector('.mini-cart-quantity').textContent = 'Qtd: ' + quantity;
        }
    });
    
    // Atualizar o total do mini-carrinho
    updateMiniCartTotal();
}

// Adicionar ao mini-carrinho
function addToMiniCart(productName, price, imageSrc) {
    const miniCartItems = document.querySelector('.mini-cart-items');
    const miniCartEmpty = document.querySelector('.mini-cart-empty');
    
    // Criar novo item
    const newMiniItem = document.createElement('div');
    newMiniItem.className = 'mini-cart-item';
    newMiniItem.innerHTML = `
        <div class="mini-cart-img">
            <img src="${imageSrc}" alt="${productName}">
        </div>
        <div class="mini-cart-info">
            <div class="mini-cart-title">${productName}</div>
            <div class="mini-cart-price">R$ ${price}</div>
            <div class="mini-cart-quantity">Qtd: 1</div>
        </div>
        <button class="mini-cart-remove">✕</button>
    `;
    
    // Adicionar evento de remoção
    newMiniItem.querySelector('.mini-cart-remove').addEventListener('click', function() {
        removeMiniCartItem(this);
    });
    
    // Adicionar ao mini-carrinho
    miniCartItems.appendChild(newMiniItem);
    
    // Atualizar a interface do mini-carrinho
    miniCartItems.style.display = 'block';
    document.querySelector('.mini-cart-footer').style.display = 'block';
    miniCartEmpty.style.display = 'none';
    
    // Atualizar total
    updateMiniCartTotal();
}

// Configurar botões para um novo item do carrinho
function setupNewItemButtons(item) {
    // Configurar botões de quantidade
    const plusBtn = item.querySelector('.plus');
    const minusBtn = item.querySelector('.minus');
    const quantityInput = item.querySelector('.quantity-input');
    const removeBtn = item.querySelector('.remove-item');
    
    plusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        value++;
        quantityInput.value = value;
        updateItemSubtotal(item);
    });
    
    minusBtn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            value--;
            quantityInput.value = value;
            updateItemSubtotal(item);
        }
    });
    
    // Atualizar ao digitar manualmente na caixa de quantidade
    quantityInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            this.value = 1;
            value = 1;
        }
        updateItemSubtotal(item);
    });
    
    removeBtn.addEventListener('click', function() {
        // Remover do carrinho principal
        item.remove();
        updateCartTotal();
        
        // Verificar se o carrinho está vazio
        if (document.querySelectorAll('.cart-item').length === 0) {
            document.querySelector('.cart-container').style.display = 'none';
            document.querySelector('.cart-summary').style.display = 'none';
            document.querySelector('.cart-empty').style.display = 'block';
        }
        
        // Remover o mesmo item do mini carrinho
        const productName = item.querySelector('.cart-product-info h3').textContent;
        const miniCartItems = document.querySelectorAll('.mini-cart-item');
        
        miniCartItems.forEach(miniItem => {
            if (miniItem.querySelector('.mini-cart-title').textContent === productName) {
                miniItem.remove();
            }
        });
        
        // Verificar se mini cart está vazio
        if (document.querySelectorAll('.mini-cart-item').length === 0) {
            document.querySelector('.mini-cart-items').style.display = 'none';
            document.querySelector('.mini-cart-footer').style.display = 'none';
            document.querySelector('.mini-cart-empty').style.display = 'block';
        }
        
        updateCartCount();
        updateMiniCartTotal();
    });
}

// Função para remover item do mini carrinho
function removeMiniCartItem(button) {
    const item = button.closest('.mini-cart-item');
    const productName = item.querySelector('.mini-cart-title').textContent;
    
    // Remover do mini carrinho
    item.remove();
    
    // Remover item correspondente do carrinho principal
    const cartItems = document.querySelectorAll('.cart-item');
    cartItems.forEach(cartItem => {
        if (cartItem.querySelector('.cart-product-info h3').textContent === productName) {
            cartItem.remove();
        }
    });
    
    // Verificar se o carrinho está vazio
    if (document.querySelectorAll('.cart-item').length === 0) {
        document.querySelector('.cart-container').style.display = 'none';
        document.querySelector('.cart-summary').style.display = 'none';
        document.querySelector('.cart-empty').style.display = 'block';
    }
    
    // Atualizar mini cart total
    updateMiniCartTotal();
    updateCartTotal();
    
    // Verificar se mini cart está vazio
    if (document.querySelectorAll('.mini-cart-item').length === 0) {
        document.querySelector('.mini-cart-items').style.display = 'none';
        document.querySelector('.mini-cart-footer').style.display = 'none';
        document.querySelector('.mini-cart-empty').style.display = 'block';
    }
    
    updateCartCount();
}

// Corrigido: Função para atualizar o subtotal de um item específico
function updateItemSubtotal(item) {
    const priceText = item.querySelector('.cart-price').textContent.replace('R$ ', '').replace(',', '.');
    const price = parseFloat(priceText);
    const quantity = parseInt(item.querySelector('.quantity-input').value);
    const subtotal = (price * quantity).toFixed(2).replace('.', ',');
    
    item.querySelector('.subtotal').textContent = 'R$ ' + subtotal;
    
    // Atualizar também o mini-carrinho se o nome do produto corresponder
    const productName = item.querySelector('.cart-product-info h3').textContent;
    const miniCartItems = document.querySelectorAll('.mini-cart-item');
    
    miniCartItems.forEach(miniItem => {
        if (miniItem.querySelector('.mini-cart-title').textContent === productName) {
            miniItem.querySelector('.mini-cart-quantity').textContent = 'Qtd: ' + quantity;
        }
    });
    
    // Importante: Atualizar totais gerais
    updateCartTotal();
    updateMiniCartTotal();
}

// Atualizar total do carrinho
function updateCartTotal() {
    let total = 0;
    let itemCount = 0;
    
    document.querySelectorAll('.cart-item').forEach(item => {
        const subtotalText = item.querySelector('.subtotal').textContent.replace('R$ ', '').replace(',', '.');
        const subtotal = parseFloat(subtotalText);
        
        if (!isNaN(subtotal)) {
            total += subtotal;
            itemCount += parseInt(item.querySelector('.quantity-input').value);
        }
    });
    
    // Atualizar o texto do subtotal e total
    document.querySelector('.summary-row:first-child .summary-label').textContent = `Subtotal (${itemCount} ${itemCount === 1 ? 'item' : 'itens'})`;
    document.querySelector('.summary-row:first-child .summary-value').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    document.querySelector('.summary-row.summary-total .summary-value').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    
    // Se houver um desconto, recalcular o total
    const discountRow = document.querySelector('.summary-row.discount');
    if (discountRow) {
        const discountText = discountRow.querySelector('.summary-value').textContent.replace('- R$ ', '').replace(',', '.');
        const discount = parseFloat(discountText);
        
        if (!isNaN(discount)) {
            const finalTotal = total - discount;
            document.querySelector('.summary-row.summary-total .summary-value').textContent = 'R$ ' + finalTotal.toFixed(2).replace('.', ',');
        }
    }
}

// Atualizar o total do mini carrinho
function updateMiniCartTotal() {
    let total = 0;
    
    document.querySelectorAll('.mini-cart-item').forEach(item => {
        const priceText = item.querySelector('.mini-cart-price').textContent.replace('R$ ', '').replace(',', '.');
        const price = parseFloat(priceText);
        const quantityText = item.querySelector('.mini-cart-quantity').textContent.replace('Qtd: ', '');
        const quantity = parseInt(quantityText);
        
        if (!isNaN(price) && !isNaN(quantity)) {
            total += price * quantity;
        }
    });
    
    document.querySelector('.mini-cart-total span:last-child').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
}

// Atualizar contador de itens
function updateCartCount() {
    let cartCount = 0;
    document.querySelectorAll('.cart-item').forEach(item => {
        cartCount += parseInt(item.querySelector('.quantity-input').value);
    });
    
    document.querySelector('.cart-count').textContent = cartCount;
    document.querySelector('.mini-cart-count').textContent = cartCount;
}

// Inicializar eventos para elementos existentes no carregamento da página
document.addEventListener('DOMContentLoaded', function() {
    // Configurar botões para itens existentes no carrinho
    document.querySelectorAll('.cart-item').forEach(item => {
        setupNewItemButtons(item);
    });
    
    // Botão "Atualizar Carrinho"
    const updateCartButton = document.querySelector('.update-cart');
    if (updateCartButton) {
        updateCartButton.addEventListener('click', function() {
            updateCartTotal();
            updateMiniCartTotal();
            alert('Carrinho atualizado com sucesso!');
        });
    }
    
    // Botão "Aplicar Cupom"
    const applyCouponButton = document.querySelector('.apply-coupon');
    if (applyCouponButton) {
        applyCouponButton.addEventListener('click', function() {
            const couponInput = document.querySelector('.coupon-input');
            const couponCode = couponInput.value.trim().toUpperCase();
            
            if (couponCode === 'DESC10') {
                // Exemplo: cupom de 10% de desconto
                applyDiscount(10);
                alert('Cupom aplicado com sucesso! Desconto de 10%.');
            } else if (couponCode === 'FRETE') {
                document.querySelector('.summary-row:nth-child(2) .summary-value').textContent = 'GRÁTIS';
                alert('Cupom de frete grátis aplicado!');
            } else {
                alert('Cupom inválido ou expirado.');
            }
        });
    }
    
    // Adicionar eventos aos botões "Adicionar ao Carrinho" na seção de sugestões
    const addToCartButtons = document.querySelectorAll('.suggestions .add-to-cart');
    
    addToCartButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            const priceText = productCard.querySelector('.price').textContent.replace('R$ ', '');
            const imageSrc = productCard.querySelector('img').src;
            
            // Definir tamanhos padrão baseados no índice
            const sizes = ['500g', '30ml', '100g', '300g'];
            const size = sizes[index % sizes.length];
            
            addToCart(productName, priceText, imageSrc, size);
        });
    });
    
    // Inicializar totais
    updateCartTotal();
    updateMiniCartTotal();
    updateCartCount();
});

// Função para aplicar desconto
function applyDiscount(percentageDiscount) {
    // Verificar se já existe uma linha de desconto
    let discountRow = document.querySelector('.summary-row.discount');
    
    // Calcular o subtotal atual
    const subtotalText = document.querySelector('.summary-row:first-child .summary-value').textContent.replace('R$ ', '').replace(',', '.');
    const subtotal = parseFloat(subtotalText);
    
    if (!isNaN(subtotal)) {
        const discountAmount = (subtotal * (percentageDiscount / 100)).toFixed(2);
        const finalTotal = (subtotal - discountAmount).toFixed(2);
        
        if (!discountRow) {
            // Criar nova linha de desconto
            discountRow = document.createElement('div');
            discountRow.className = 'summary-row discount';
            discountRow.innerHTML = `
                <div class="summary-label">Desconto (${percentageDiscount}%)</div>
                <div class="summary-value">- R$ ${discountAmount.replace('.', ',')}</div>
            `;
            
            // Inserir antes da linha do total
            const totalRow = document.querySelector('.summary-row.summary-total');
            totalRow.parentNode.insertBefore(discountRow, totalRow);
        } else {
            // Atualizar linha existente
            discountRow.querySelector('.summary-label').textContent = `Desconto (${percentageDiscount}%)`;
            discountRow.querySelector('.summary-value').textContent = `- R$ ${discountAmount.replace('.', ',')}`;
        }
        
        // Atualizar o total
        document.querySelector('.summary-row.summary-total .summary-value').textContent = 'R$ ' + finalTotal.replace('.', ',');
    }
}