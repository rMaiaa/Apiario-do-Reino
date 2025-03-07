// Função para adicionar o recurso de checkout via WhatsApp
function addWhatsAppCheckout() {
    // Número de WhatsApp da loja (substitua pelo número real)
    const whatsappNumber = "5524999861706"; // Formato: código do país + DDD + número
    
    // Encontrar o botão de checkout
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (checkoutBtn && window.melPuroCart) {
        // Substituir o evento de clique existente
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Verificar se há itens no carrinho
            if (window.melPuroCart.items.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }
            
            // Construir a mensagem para o WhatsApp
            let message = "Olá! Gostaria de fazer um pedido:\n\n";
            
            // Adicionar itens do carrinho
            window.melPuroCart.items.forEach(item => {
                const subtotal = (item.price * item.quantity).toFixed(2);
                message += `• ${item.quantity}x ${item.name} - R$ ${subtotal}\n`;
            });
            
            // Adicionar valor total
            const total = window.melPuroCart.calculateTotal().toFixed(2);
            message += `\nValor Total: R$ ${total}`;
            
            // Adicionar informações para entrega
            message += "\n\nPor favor, confirme meu pedido e informe os dados para pagamento e entrega.";
            
            // Codificar a mensagem para URL
            const encodedMessage = encodeURIComponent(message);
            
            // Criar o link do WhatsApp
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Abrir o WhatsApp em uma nova janela/aba
            window.open(whatsappUrl, '_blank');
        });
        
        // Atualizar o texto do botão para tornar mais claro a funcionalidade
        checkoutBtn.textContent = "Finalizar Compra via WhatsApp";
    }
}

// Executar a função apenas na página do carrinho
if (window.location.pathname.includes('carrinho.html')) {
    // Garantir que o carrinho já foi inicializado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Esperamos um pouco para garantir que melPuroCart já foi inicializado
            setTimeout(addWhatsAppCheckout, 100);
        });
    } else {
        // Se o DOM já estiver carregado, esperamos um pouco e tentamos inicializar
        setTimeout(addWhatsAppCheckout, 100);
    }
}