// Simples JavaScript para demonstração
document.addEventListener('DOMContentLoaded', function () {
    // Adicionar eventos aos botões de "Adicionar ao Carrinho"
    const addButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    let count = 0;

    addButtons.forEach(button => {
        button.addEventListener('click', function () {
            count++;
            cartCount.textContent = count;

            // Feedback visual - alterar texto do botão temporariamente
            const originalText = this.textContent;
            this.textContent = 'Adicionado ✓';
            this.style.backgroundColor = '#28a745';
            this.style.color = 'white';

            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
                this.style.color = '';
            }, 1500);
        });
    });
});