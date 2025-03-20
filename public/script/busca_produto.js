// Arquivo: public/script/busca_produto.js

document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const sortSelect = document.querySelector('.sort-select');
    const filterButtons = document.querySelectorAll('.filter-button');
    const priceMinInput = document.querySelectorAll('.price-input')[0];
    const priceMaxInput = document.querySelectorAll('.price-input')[1];
    const priceSlider = document.querySelector('.price-slider');
    const applyPriceButton = document.querySelector('.apply-button');
    const categoryItems = document.querySelectorAll('.category-item');
    const resultsGrid = document.querySelector('.results-grid');
    const resultsCount = document.querySelector('.filter-section').nextElementSibling.firstElementChild;
    
    // Armazena todos os produtos originais para filtragem
    let allProducts = [];
    
    // Inicializa coleta de produtos
    function initializeProducts() {
        const productElements = document.querySelectorAll('.product-card');
        
        productElements.forEach(product => {
            const title = product.querySelector('.product-title').textContent;
            const category = product.querySelector('.product-category').textContent;
            const priceText = product.querySelector('.current-price').textContent;
            const price = parseFloat(priceText.replace('R$ ', '').replace(',', '.'));
            
            const ratingStars = product.querySelector('.stars').textContent;
            const rating = (ratingStars.match(/★/g) || []).length;
            
            const ratingCountText = product.querySelector('.rating-count').textContent;
            const ratingCount = parseInt(ratingCountText.replace(/[()]/g, ''));
            
            // Verifica se há desconto
            const hasDiscount = product.querySelector('.discount-badge') !== null;
            const isNew = product.querySelector('.new-badge') !== null;
            
            // Armazenar tamanho do produto (500g, 1kg, etc.)
            const size = product.querySelector('.product-details div:nth-child(3)').textContent;
            
            allProducts.push({
                element: product,
                title: title,
                category: category,
                price: price,
                rating: rating,
                ratingCount: ratingCount,
                hasDiscount: hasDiscount,
                isNew: isNew,
                size: size
            });
        });
    }
    
    // Pesquisa por texto
    function searchProducts(query) {
        query = query.toLowerCase().trim();
        
        if (!query) {
            return allProducts;
        }
        
        return allProducts.filter(product => {
            return product.title.toLowerCase().includes(query) || 
                   product.category.toLowerCase().includes(query) ||
                   product.size.toLowerCase().includes(query);
        });
    }
    
    // Filtragem por categoria
    function filterByCategory(products, category) {
        if (category === 'Todos') {
            return products;
        }
        
        category = category.toUpperCase();
        return products.filter(product => {
            if (category === 'PROMOÇÕES') {
                return product.hasDiscount;
            } else {
                return product.category === category;
            }
        });
    }
    
    // Filtragem por preço
    function filterByPrice(products, minPrice, maxPrice) {
        if (minPrice === '' && maxPrice === '') {
            return products;
        }
        
        minPrice = minPrice === '' ? 0 : parseFloat(minPrice);
        maxPrice = maxPrice === '' ? Number.MAX_VALUE : parseFloat(maxPrice);
        
        return products.filter(product => {
            return product.price >= minPrice && product.price <= maxPrice;
        });
    }
    
    // Filtragem por tipo de mel
    function filterByHoneyType(products, honeyType) {
        if (!honeyType) {
            return products;
        }
        
        honeyType = honeyType.toLowerCase();
        return products.filter(product => {
            return product.title.toLowerCase().includes(honeyType) || 
                   product.size.toLowerCase().includes(honeyType);
        });
    }
    
    // Ordenação de produtos
    function sortProducts(products, sortType) {
        const sortedProducts = [...products];
        
        switch (sortType) {
            case 'price-asc': // Menor Preço
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc': // Maior Preço
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc': // Nome (A-Z)
                sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc': // Nome (Z-A)
                sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'rating': // Avaliações
                sortedProducts.sort((a, b) => {
                    if (b.rating === a.rating) {
                        return b.ratingCount - a.ratingCount;
                    }
                    return b.rating - a.rating;
                });
                break;
            default:
                // mantém a ordem original
                break;
        }
        
        return sortedProducts;
    }
    
    // Atualiza a exibição dos produtos
    function updateProductDisplay(products) {
        // Atualiza contador de resultados
        resultsCount.textContent = `Exibindo ${products.length} produtos`;
        
        // Remove todos os produtos da visualização
        resultsGrid.innerHTML = '';
        
        // Adiciona produtos filtrados de volta à visualização
        products.forEach(product => {
            resultsGrid.appendChild(product.element.cloneNode(true));
        });
        
        // Reconecta os event listeners para botões adicionar ao carrinho
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productTitle = productCard.querySelector('.product-title').textContent;
                const productSize = productCard.querySelector('.product-details div:nth-child(3)').textContent;
                const productPrice = parseFloat(productCard.querySelector('.current-price').textContent.replace('R$ ', '').replace(',', '.'));
                
                addToCart(productTitle, productSize, productPrice);
            });
        });
    }
    
    // Adicionar ao carrinho (função simples para completar a funcionalidade)
    function addToCart(title, size, price) {
        // Recuperar carrinho atual
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Verificar se o produto já está no carrinho
        const existingProductIndex = cart.findIndex(item => 
            item.title === title && item.size === size
        );
        
        if (existingProductIndex >= 0) {
            // Incrementar quantidade se o produto já existir
            cart[existingProductIndex].quantity += 1;
        } else {
            // Adicionar novo produto ao carrinho
            cart.push({
                title: title,
                size: size,
                price: price,
                quantity: 1
            });
        }
        
        // Salvar carrinho atualizado
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Atualizar contador do carrinho
        updateCartCount();
        
        // Notificar usuário
        alert(`${title} ${size} adicionado ao carrinho!`);
    }
    
    // Atualizar contador de itens no carrinho
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        document.querySelector('.cart-count').textContent = totalItems;
    }
    
    // Função principal para atualizar os produtos com base em todos os filtros
    function updateProducts() {
        const searchQuery = searchInput.value;
        const selectedSort = sortSelect.value;
        
        // Obter categoria selecionada dos botões de filtro
        let selectedCategory = 'Todos';
        filterButtons.forEach(button => {
            if (button.classList.contains('active')) {
                selectedCategory = button.textContent;
            }
        });
        
        // Obter faixa de preço
        const minPrice = priceMinInput.value;
        const maxPrice = priceMaxInput.value;
        
        // Aplicar filtros em sequência
        let filteredProducts = searchProducts(searchQuery);
        filteredProducts = filterByCategory(filteredProducts, selectedCategory);
        filteredProducts = filterByPrice(filteredProducts, minPrice, maxPrice);
        
        // Ordenar resultados filtrados
        filteredProducts = sortProducts(filteredProducts, selectedSort);
        
        // Atualizar visualização
        updateProductDisplay(filteredProducts);
    }
    
    // Event Listeners
    // Pesquisa
    searchButton.addEventListener('click', updateProducts);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            updateProducts();
        }
    });
    
    // Ordenação
    sortSelect.addEventListener('change', updateProducts);
    
    // Botões de filtro por categoria
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Desativar botão ativo anterior
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Ativar o botão clicado
            this.classList.add('active');
            // Atualizar produtos
            updateProducts();
        });
    });
    
    // Filtro de preço
    applyPriceButton.addEventListener('click', updateProducts);
    
    // Filtro por categorias na sidebar
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.querySelector('span').textContent;
            searchInput.value = category;
            updateProducts();
        });
    });
    
    // Inicialização
    initializeProducts();
    updateCartCount();
    
    // Atualizar o slider de preço com base nos inputs
    priceMinInput.addEventListener('input', function() {
        const value = parseInt(this.value) || 0;
        const max = parseInt(priceMaxInput.value) || 100;
        priceSlider.value = (value + max) / 2;
    });
    
    priceMaxInput.addEventListener('input', function() {
        const value = parseInt(this.value) || 100;
        const min = parseInt(priceMinInput.value) || 0;
        priceSlider.value = (min + value) / 2;
    });
    
    // Atualizar inputs com base no slider
    priceSlider.addEventListener('input', function() {
        const value = parseInt(this.value);
        const currentMin = parseInt(priceMinInput.value) || 0;
        const currentMax = parseInt(priceMaxInput.value) || 100;
        
        // Ajustar os valores dos inputs com base no movimento do slider
        if (value < (currentMin + currentMax) / 2) {
            priceMinInput.value = Math.max(0, 2 * value - currentMax);
        } else {
            priceMaxInput.value = Math.min(100, 2 * value - currentMin);
        }
    });
});