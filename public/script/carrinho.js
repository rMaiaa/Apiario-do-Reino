// Modelo do carrinho de compras
class ShoppingCart {
    constructor() {
        this.items = [];
        this.loadFromLocalStorage();
        this.updateCartDisplay();
    }

    // Carregar do localStorage
    loadFromLocalStorage() {
        const savedCart = localStorage.getItem('melPuroCart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
        }
    }

    // Salvar no localStorage
    saveToLocalStorage() {
        localStorage.setItem('melPuroCart', JSON.stringify(this.items));
    }

    // Adicionar produto ao carrinho com quantidade específica
    addItem(product, quantity = 1) {
        // Garantir que quantity seja um número
        quantity = parseInt(quantity) || 1;
        
        // Verificar se o produto já existe no carrinho
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            // Somar a quantidade ao invés de substituir
            existingItem.quantity = existingItem.quantity + quantity;
            console.log(`Item atualizado: ${product.name}, quantidade: ${existingItem.quantity}`);
        } else {
            // Adicionar novo item
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
             //   image: product.image,
                quantity: quantity
            });
            console.log(`Novo item adicionado: ${product.name}, quantidade: ${quantity}`);
        }
        
        this.saveToLocalStorage();
        this.updateCartDisplay();
        this.showNotification(`${product.name} adicionadas ao carrinho!`);
    }

    // Atualizar quantidade de um item
    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                this.saveToLocalStorage();
                this.updateCartDisplay();
            }
        }
    }

    // Incrementar quantidade
    incrementQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += 1;
            this.saveToLocalStorage();
            this.updateCartDisplay();
        }
    }

    // Decrementar quantidade
    decrementQuantity(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
                this.saveToLocalStorage();
                this.updateCartDisplay();
            } else {
                this.removeItem(productId);
            }
        }
    }

    // Remover item do carrinho
    removeItem(productId) {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            const removedItem = this.items[itemIndex];
            this.items.splice(itemIndex, 1);
            this.saveToLocalStorage();
            this.updateCartDisplay();
            this.showNotification(`${removedItem.name} removido do carrinho`);
        }
    }

    // Calcular total do carrinho
    calculateTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Contagem total de itens
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Atualizar a exibição do carrinho
    updateCartDisplay() {
        // Atualizar contador na barra de navegação
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            const itemCount = this.getItemCount();
            cartCountElement.textContent = itemCount > 0 ? itemCount : '';
        }

        // Atualizar página de carrinho se estivermos nela
        if (window.location.pathname.includes('carrinho.html')) {
            this.renderCartPage();
        }
    }

    // Renderizar a página do carrinho
    renderCartPage() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartEmptyState = document.querySelector('.cart-empty');
        const cartContainer = document.querySelector('.cart-container');
        const summarySubtotal = document.querySelector('.summary-row .summary-label');
        const summaryValue = document.querySelector('.summary-row .summary-value');
        const totalValue = document.querySelector('.summary-total .summary-value');
        
        if (!cartItemsContainer) return;

        // Verificar se o carrinho está vazio
        if (this.items.length === 0) {
            if (cartEmptyState) cartEmptyState.style.display = 'block';
            if (cartContainer) cartContainer.style.display = 'none';
            
            if (summarySubtotal) summarySubtotal.textContent = 'Subtotal (0 itens)';
            if (summaryValue) summaryValue.textContent = 'R$ 0,00';
            if (totalValue) totalValue.textContent = 'R$ 0,00';
            
            return;
        }

        // Exibir o carrinho e esconder o estado vazio
        if (cartEmptyState) cartEmptyState.style.display = 'none';
        if (cartContainer) cartContainer.style.display = 'block';

        // Limpar e recriar os itens
        cartItemsContainer.innerHTML = '';
        
        this.items.forEach(item => {
            const subtotal = item.price * item.quantity;
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            
            cartItemElement.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.image || '/api/placeholder/80/80'}" alt="${item.name}">
                </div>
                <div class="cart-item-desc">
                    <h3>${item.name}</h3>
                </div>
                <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn qty-decrease" data-id="${item.id}">-</button>
                    <input type="number" value="${item.quantity}" min="1" class="qty-input" data-id="${item.id}">
                    <button class="qty-btn qty-increase" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-subtotal">R$ ${subtotal.toFixed(2)}</div>
                <div class="cart-item-remove">
                    <button class="remove-btn" data-id="${item.id}">×</button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
            
            // Adicionar eventos aos botões de quantidade
            const qtyDecrease = cartItemElement.querySelector('.qty-decrease');
            const qtyIncrease = cartItemElement.querySelector('.qty-increase');
            const qtyInput = cartItemElement.querySelector('.qty-input');
            const removeBtn = cartItemElement.querySelector('.remove-btn');
            
            qtyDecrease.addEventListener('click', () => this.decrementQuantity(item.id));
            qtyIncrease.addEventListener('click', () => this.incrementQuantity(item.id));
            removeBtn.addEventListener('click', () => this.removeItem(item.id));
            
            qtyInput.addEventListener('change', (e) => {
                const newQuantity = parseInt(e.target.value);
                if (!isNaN(newQuantity)) {
                    this.updateQuantity(item.id, newQuantity);
                }
            });
        });

        // Atualizar o resumo
        const total = this.calculateTotal();
        const itemCount = this.getItemCount();
        
        if (summarySubtotal) summarySubtotal.textContent = `Subtotal (${itemCount} ${itemCount === 1 ? 'item' : 'itens'})`;
        if (summaryValue) summaryValue.textContent = `R$ ${total.toFixed(2)}`;
        if (totalValue) totalValue.textContent = `R$ ${total.toFixed(2)}`;
    }

    // Notificação simples
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Estilo para notificação
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#4caf50';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.zIndex = '1000';
        notification.style.transition = 'opacity 0.3s';
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Função para inicializar o carrinho em todas as páginas
function initShoppingCart() {
    const cart = new ShoppingCart();
    window.melPuroCart = cart;

    // Adicionar listener para todos os botões "Adicionar ao Carrinho"
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            // Encontrar dados do produto
            const productCard = e.target.closest('.product-card');
            
            if (productCard) {
                // Usar o ID definido no data-id, ou criar um ID fixo baseado no nome do produto
                // Evitar usar Math.random() que cria um novo ID a cada clique
                const productId = productCard.dataset.id || 
                                  productCard.querySelector('.product-title')?.textContent.trim().toLowerCase().replace(/\s+/g, '-');
                
                if (!productId) {
                    console.error('Não foi possível determinar o ID do produto');
                    return;
                }
                
                const productName = productCard.querySelector('.product-title').textContent;
                const productPriceText = productCard.querySelector('.price').textContent;
                const productPrice = parseFloat(productPriceText.replace('R$ ', '').replace(',', '.'));
                const productImage = productCard.querySelector('.product-img img')?.src;
                
                // Verificar se existe um input de quantidade
                const quantityInput = productCard.querySelector('.quantity-input');
                // Garantir que quantity seja um número válido
                let quantity = 1;
                if (quantityInput) {
                    const inputValue = parseInt(quantityInput.value);
                    if (!isNaN(inputValue) && inputValue > 0) {
                        quantity = inputValue;
                    }
                }
                
                console.log('Adicionando produto:', {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: quantity
                });
                
                const product = {
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage
                };
                
                // Explicitamente passar a quantidade como segundo argumento
                cart.addItem(product, quantity);
            }
        }
    });

    // Inicializar a página do carrinho se estivermos nela
    if (window.location.pathname.includes('carrinho.html')) {
        cart.renderCartPage();

        // Adicionar eventos para botões de cupom de desconto
        const applyBtn = document.querySelector('.apply-coupon');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                const couponInput = document.querySelector('.coupon-input');
                if (couponInput && couponInput.value.trim()) {
                    // Aqui você pode implementar a lógica de cupom de desconto
                    alert('Funcionalidade de cupom em desenvolvimento!');
                }
            });
        }

        // Adicionar evento para botão de checkout
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (cart.items.length > 0) {
                    // Redirecionar para página de checkout ou mostrar mensagem
                    alert('Redirecionando para o checkout...');
                    // window.location.href = 'checkout.html';
                } else {
                    alert('Seu carrinho está vazio!');
                }
            });
        }
    }

    // Adicionar CSS para o carrinho
    const cartStyles = document.createElement('style');
    cartStyles.textContent = `
        .cart-count {
            position: absolute;
            top: -8px;
            right: -8px;
            background-color: #e74c3c;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
        }
        
        .cart-notification {
            opacity: 1;
        }
        
        .cart-item {
            display: grid;
            grid-template-columns: 80px 2fr 1fr 1fr 1fr 40px;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #eee;
        }
        
        .qty-btn {
            width: 30px;
            height: 30px;
            border: 1px solid #ddd;
            background: #f8f8f8;
            cursor: pointer;
        }
        
        .qty-input {
            width: 50px;
            height: 30px;
            text-align: center;
            border: 1px solid #ddd;
            margin: 0 5px;
        }
        
        .remove-btn {
            background: none;
            border: none;
            font-size: 20px;
            color: #e74c3c;
            cursor: pointer;
        }
    `;
    document.head.appendChild(cartStyles);
}

// Executar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', initShoppingCart);