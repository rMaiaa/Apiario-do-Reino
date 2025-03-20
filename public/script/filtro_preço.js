// Arquivo: public/script/filtro_preco.js

document.addEventListener('DOMContentLoaded', function() {
    // Selecionar elementos do DOM
    const priceMinInput = document.querySelector('.price-inputs input:first-child');
    const priceMaxInput = document.querySelector('.price-inputs input:last-child');
    const priceSlider = document.querySelector('.price-slider');
    const applyPriceButton = document.querySelector('.apply-button');
    
    // Valores padrão e configurações
    const defaultMinPrice = 0;
    const defaultMaxPrice = 100;
    let currentMinPrice = defaultMinPrice;
    let currentMaxPrice = defaultMaxPrice;
    
    // Inicializar valores
    priceMinInput.value = currentMinPrice;
    priceMaxInput.value = currentMaxPrice;
    priceSlider.value = 50; // Ponto médio do slider
    
    // Função para atualizar o slider com base nos inputs
    function updateSliderFromInputs() {
        const minValue = parseInt(priceMinInput.value) || defaultMinPrice;
        const maxValue = parseInt(priceMaxInput.value) || defaultMaxPrice;
        
        // Verificar valores válidos
        if (minValue < 0) priceMinInput.value = 0;
        if (maxValue < minValue) priceMaxInput.value = minValue;
        
        // Calcular posição do slider (representando o ponto médio do intervalo)
        const sliderPosition = ((minValue + maxValue) / 2) / defaultMaxPrice * 100;
        priceSlider.value = sliderPosition;
        
        // Atualizar variáveis de controle
        currentMinPrice = minValue;
        currentMaxPrice = maxValue;
    }
    
    // Função para atualizar os inputs com base no slider
    function updateInputsFromSlider() {
        const sliderValue = parseInt(priceSlider.value);
        const range = currentMaxPrice - currentMinPrice;
        
        // Calcular novos valores com base no movimento do slider
        // O slider move ambos os valores mantendo a proporcionalidade do intervalo
        const midPoint = (sliderValue / 100) * defaultMaxPrice * 2;
        
        // Ajustar os valores mínimo e máximo proporcionalmente
        let newMinPrice, newMaxPrice;
        
        if (range === 0) {
            // Se min e max são iguais, mover ambos juntos
            newMinPrice = Math.max(0, midPoint - 10);
            newMaxPrice = midPoint + 10;
        } else {
            // Mover mantendo a proporção do intervalo
            newMinPrice = Math.max(0, midPoint - range/2);
            newMaxPrice = midPoint + range/2;
        }
        
        // Atualizar inputs
        priceMinInput.value = Math.round(newMinPrice);
        priceMaxInput.value = Math.round(newMaxPrice);
        
        // Atualizar variáveis de controle
        currentMinPrice = newMinPrice;
        currentMaxPrice = newMaxPrice;
    }
    
    // Função para aplicar o filtro de preço
    function applyPriceFilter() {
        const minPrice = parseInt(priceMinInput.value) || defaultMinPrice;
        const maxPrice = parseInt(priceMaxInput.value) || defaultMaxPrice;
        
        // Filtrar produtos com base na faixa de preço
        const filteredProducts = filterProductsByPrice(minPrice, maxPrice);
        
        // Atualizar a exibição dos produtos
        updateProductDisplay(filteredProducts);
        
        // Atualizar contador de resultados
        updateResultsCount(filteredProducts.length);
    }
    
    // Função para filtrar produtos por preço
    function filterProductsByPrice(minPrice, maxPrice) {
        // Obter todos os produtos da página
        const productCards = document.querySelectorAll('.product-card');
        const filteredProducts = [];
        
        productCards.forEach(product => {
            // Obter o preço do produto
            const priceText = product.querySelector('.current-price').textContent;
            const price = parseFloat(priceText.replace('R$ ', '').replace(',', '.'));
            
            // Verificar se o preço está dentro do intervalo
            if (price >= minPrice && price <= maxPrice) {
                filteredProducts.push(product);
            }
        });
        
        return filteredProducts;
    }
    
    // Função para atualizar a exibição dos produtos
    function updateProductDisplay(products) {
        const resultsGrid = document.querySelector('.results-grid');
        const allProducts = document.querySelectorAll('.product-card');
        
        // Ocultar todos os produtos
        allProducts.forEach(product => {
            product.style.display = 'none';
        });
        
        // Mostrar apenas os produtos filtrados
        products.forEach(product => {
            product.style.display = 'block';
        });
    }
    
    // Função para atualizar o contador de resultados
    function updateResultsCount(count) {
        const resultsCount = document.querySelector('.filter-section').nextElementSibling.firstElementChild;
        resultsCount.textContent = `Exibindo ${count} produtos`;
    }
    
    // Event Listeners
    
    // Atualizar slider quando os inputs mudam
    priceMinInput.addEventListener('input', updateSliderFromInputs);
    priceMaxInput.addEventListener('input', updateSliderFromInputs);
    
    // Atualizar inputs quando o slider muda
    priceSlider.addEventListener('input', updateInputsFromSlider);
    
    // Aplicar filtro quando o botão é clicado
    applyPriceButton.addEventListener('click', applyPriceFilter);
    
    // Permitir pressionar Enter para aplicar o filtro
    priceMinInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyPriceFilter();
        }
    });
    
    priceMaxInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyPriceFilter();
        }
    });
    
    // Integração com o sistema de busca existente
    // Esta função será chamada pelo sistema de busca principal, se existir
    window.filterByPriceRange = function(minPrice, maxPrice) {
        priceMinInput.value = minPrice;
        priceMaxInput.value = maxPrice;
        updateSliderFromInputs();
        applyPriceFilter();
    };
    
    // Inicializar o estado do slider
    updateSliderFromInputs();
});