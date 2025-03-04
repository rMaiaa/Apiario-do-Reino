
    // Adicione aqui seu código JavaScript para funcionalidades interativas
    // Por exemplo: filtragem de produtos, ordenação, adição ao carrinho, etc.

    // Adicione este evento em cada botão "Adicionar ao Carrinho" na página de produtos
// Adicionar evento de clique para os botões "Adicionar ao Carrinho"
document.addEventListener('DOMContentLoaded', function() {
    // Atualiza o contador do carrinho ao carregar a página
    updateCartCount();

    // Seleciona todos os botões "Adicionar ao Carrinho"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Obtém o card do produto mais próximo
            const productCard = this.closest('.product-card');

            // Extrai os dados do produto (ajuste conforme a sua estrutura)
            const title = productCard.querySelector('.product-title').innerText;
            // Extraímos apenas o primeiro texto (para ignorar eventuais spans internos)
            const priceElement = productCard.querySelector('.price');
            let price = priceElement ? priceElement.firstChild.textContent.trim() : '';
            const img = productCard.querySelector('.product-img img').src;

            // Cria um objeto com os dados do produto
            const product = {
                title: title,
                price: price,
                img: img,
                quantity: 1 // pode ser incrementado se o produto já estiver no carrinho
            };

            // Recupera o carrinho armazenado no localStorage ou cria um novo array
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Verifica se o produto já existe no carrinho (pode ser feito pela propriedade title ou por um id)
            const existingProduct = cart.find(item => item.title === product.title);
            if (existingProduct) {
                // Incrementa a quantidade
                existingProduct.quantity += 1;
            } else {
                cart.push(product);
            }

            // Armazena o carrinho atualizado no localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Atualiza o contador na interface
            updateCartCount();
        });
    });
});

// Função para atualizar o contador do carrinho
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Soma as quantidades de cada item para exibir o total de produtos
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}
    document.addEventListener('DOMContentLoaded', function () {
        // Exemplo de adição ao carrinho
        const addButtons = document.querySelectorAll('.add-to-cart');
        const cartCount = document.querySelector('.cart-count');
        let count = 0;

        addButtons.forEach(button => {
            button.addEventListener('click', function () {
                count++;
                cartCount.textContent = count;

                // Adicionar animação ou feedback
                button.textContent = 'Adicionado!';
                setTimeout(() => {
                    button.textContent = 'Adicionar ao Carrinho';
                }, 1000);
            });
        });

        // Exemplo de filtro rápido
        const filterButtons = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');
        const emptyState = document.querySelector('.empty-state');

        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                // Remover classe ativa de todos os botões
                filterButtons.forEach(btn => btn.classList.remove('active'));

                // Adicionar classe ativa ao botão clicado
                this.classList.add('active');

                const filter = this.textContent.toLowerCase();
                let visibleCount = 0;

                productCards.forEach(card => {
                    const category = card.querySelector('.product-category').textContent.toLowerCase();
                    const hasOrganic = card.querySelector('.organic-badge') !== null;
                    const hasSale = card.querySelector('.sale-badge') !== null;

                    if (filter === 'todos') {
                        card.style.display = 'flex';
                        visibleCount++;
                    } else if (filter === 'orgânico' && hasOrganic) {
                        card.style.display = 'flex';
                        visibleCount++;
                    } else if (filter === 'promoções' && hasSale) {
                        card.style.display = 'flex';
                        visibleCount++;
                    } else if (category.includes(filter)) {
                        card.style.display = 'flex';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Mostrar estado vazio se nenhum produto for encontrado
                if (visibleCount === 0) {
                    emptyState.style.display = 'block';
                } else {
                    emptyState.style.display = 'none';
                }
            });
        });

        // Controle deslizante de preço
        const priceSlider = document.querySelector('.price-slider');
        const maxPriceInput = document.querySelectorAll('.price-input')[1];

        priceSlider.addEventListener('input', function () {
            maxPriceInput.value = this.value;
        });

        // Exemplo de ordenação
        const sortSelect = document.querySelector('.sort-select');

        sortSelect.addEventListener('change', function () {
            const selectedOption = this.value;

            // Aqui você implementaria a lógica de ordenação real
            // para fins de demonstração, apenas mostramos um alerta

            // Simulação de ordenação (você substituiria isso por uma implementação real)
            alert('Produtos ordenados por: ' + selectedOption);
        });
    });


// Adicione aqui seu código JavaScript para funcionalidades interativas
// Por exemplo: filtragem de produtos, ordenação, adição ao carrinho, etc.

document.addEventListener('DOMContentLoaded', function () {
// Exemplo de adição ao carrinho
const addButtons = document.querySelectorAll('.add-to-cart');
const cartCount = document.querySelector('.cart-count');
let count = 0;

addButtons.forEach(button => {
    button.addEventListener('click', function () {
        count++;
        cartCount.textContent = count;
        
        // Adicionar animação ou feedback
        button.textContent = 'Adicionado!';
        setTimeout(() => {
            button.textContent = 'Adicionar ao Carrinho';
        }, 1000);
    });
});

// Exemplo de filtro rápido
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const emptyState = document.querySelector('.empty-state');

filterButtons.forEach(button => {
    button.addEventListener('click', function () {
        // Remover classe ativa de todos os botões
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Adicionar classe ativa ao botão clicado
        this.classList.add('active');
        
        const filter = this.textContent.trim().toLowerCase();
        let visibleCount = 0;
        
        productCards.forEach(card => {
            const category = card.querySelector('.product-category').textContent.trim().toLowerCase();
            const hasOrganic = card.querySelector('.organic-badge') !== null;
            const hasSale = card.querySelector('.sale-badge') !== null;
            const hasNew = card.querySelector('.new-badge') !== null;
            
            // Verificar correspondência exata da categoria
            if (filter === 'todos') {
                card.style.display = 'flex';
                visibleCount++;
            } else if (filter === 'orgânico' && hasOrganic) {
                card.style.display = 'flex';
                visibleCount++;
            } else if (filter === 'promoções' && hasSale) {
                card.style.display = 'flex';
                visibleCount++;
            } else if (filter === 'novidades' && hasNew) {
                // Adicionado o case para novidades
                card.style.display = 'flex';
                visibleCount++;
            } else if (filter === category ||
                (filter === 'mel' && category === 'mel') ||
                (filter === 'própolis' && category === 'própolis') ||
                (filter === 'cosméticos' && category === 'cosméticos') ||
                (filter === 'pólen' && category === 'pólen') ||
                (filter === 'kits' && category === 'kits')) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Mostrar estado vazio se nenhum produto for encontrado
        if (visibleCount === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    });
});
});