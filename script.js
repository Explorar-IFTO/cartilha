// Sistema de navegação da cartilha digital
class CartilhaNavigator {
    constructor() {
        this.currentPage = 0;
        this.pages = document.querySelectorAll('.page');
        this.topicCards = document.querySelectorAll('.topic-card');
        this.backButtons = document.querySelectorAll('.back-btn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.pageIndicators = document.querySelectorAll('.indicator');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.showPage(0); // Mostra a capa inicialmente
    }
    
    setupEventListeners() {
        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                this.nextPage();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousPage();
            } else if (e.key === 'Escape') {
                this.goToNavigation();
            }
        });
        
        // Botões de navegação
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.previousPage();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextPage();
            });
        }
        
        // Indicadores de página
        this.pageIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.showPage(index);
            });
        });
        
        // Cliques nos cards de tópicos
        this.topicCards.forEach(card => {
            card.addEventListener('click', () => {
                const topic = card.dataset.topic;
                this.showTopic(topic);
            });
            
            // Efeito de hover com som
            card.addEventListener('mouseenter', () => {
                this.playHoverSound();
            });
        });
        
        // Botões de voltar
        this.backButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.goToNavigation();
            });
        });
        
        // Efeito de clique nos cards
        this.topicCards.forEach(card => {
            card.addEventListener('click', () => {
                this.animateCardClick(card);
            });
        });
    }
    
    showPage(pageIndex) {
        this.pages.forEach((page, index) => {
            if (index === pageIndex) {
                page.style.display = 'flex';
                page.classList.add('active');
                this.animatePageEnter(page);
            } else {
                page.style.display = 'none';
                page.classList.remove('active');
            }
        });
        
        // Atualiza indicadores
        this.updatePageIndicators(pageIndex);
        
        // Atualiza botões de navegação
        this.updateNavigationButtons(pageIndex);
        
        // Limpa elementos flutuantes de outras páginas
        this.cleanupFloatingElements();
        
        this.currentPage = pageIndex;
    }
    
    cleanupFloatingElements() {
        // Remove elementos flutuantes de páginas que não são a capa
        this.pages.forEach((page, index) => {
            if (index !== 0) { // Não é a capa
                const floatingElements = page.querySelectorAll('.floating-element');
                floatingElements.forEach(element => element.remove());
            }
        });
    }
    
    updatePageIndicators(pageIndex) {
        this.pageIndicators.forEach((indicator, index) => {
            if (index === pageIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
    
    updateNavigationButtons(pageIndex) {
        if (this.prevBtn) {
            this.prevBtn.disabled = pageIndex === 0;
        }
        
        if (this.nextBtn) {
            // Desabilita o botão próximo apenas se estiver na última página principal
            const mainPages = 3; // Capa, Introdução, Navegação
            this.nextBtn.disabled = pageIndex >= mainPages - 1;
        }
    }
    
    nextPage() {
        if (this.currentPage < this.pages.length - 1) {
            this.showPage(this.currentPage + 1);
        }
    }
    
    previousPage() {
        if (this.currentPage > 0) {
            this.showPage(this.currentPage - 1);
        }
    }
    
    showTopic(topicName) {
        const topicPage = document.getElementById(`${topicName}-page`);
        if (topicPage) {
            this.pages.forEach(page => {
                page.style.display = 'none';
                page.classList.remove('active');
            });
            topicPage.style.display = 'flex';
            topicPage.classList.add('active');
            this.animatePageEnter(topicPage);
        }
    }
    
    goToNavigation() {
        // Vai para a página de navegação (índice 2)
        this.showPage(2);
    }
    
    animatePageEnter(page) {
        page.style.opacity = '0';
        page.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            page.style.transition = 'all 0.5s ease';
            page.style.opacity = '1';
            page.style.transform = 'translateX(0)';
        }, 50);
    }
    
    animateCardClick(card) {
        card.style.transform = 'scale(0.95)';
        card.style.boxShadow = '0 4px 15px rgba(78, 205, 196, 0.4)';
        
        setTimeout(() => {
            card.style.transform = 'scale(1)';
            card.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
        }, 150);
    }
    
    playHoverSound() {
        // Cria um som sutil para o hover (opcional)
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Efeitos visuais adicionais
class VisualEffects {
    constructor() {
        this.setupFloatingElements();
        this.setupParticleSystem();
    }
    
    setupFloatingElements() {
        // Adiciona elementos flutuantes apenas na capa
        const coverPage = document.querySelector('.cover-page');
        if (coverPage) {
            for (let i = 0; i < 3; i++) {
                const element = document.createElement('div');
                element.className = 'floating-element';
                element.innerHTML = ['💭', '✨', '💡'][i];
                element.style.position = 'absolute';
                element.style.fontSize = '1.2rem';
                element.style.opacity = '0.7';
                element.style.pointerEvents = 'none';
                element.style.zIndex = '1';
                
                // Posiciona de forma mais controlada
                const positions = [
                    { left: '15%', top: '20%' },
                    { left: '80%', top: '30%' },
                    { left: '20%', top: '70%' }
                ];
                
                element.style.left = positions[i].left;
                element.style.top = positions[i].top;
                element.style.animation = `float ${4 + i}s ease-in-out infinite`;
                element.style.animationDelay = i * 0.5 + 's';
                
                coverPage.appendChild(element);
            }
        }
    }
    
    setupParticleSystem() {
        // Sistema de partículas apenas para a capa
        const coverPage = document.querySelector('.cover-page');
        if (coverPage) {
            // Cria partículas apenas quando a capa está visível
            this.particleInterval = setInterval(() => {
                if (coverPage.style.display !== 'none') {
                    this.createParticle(coverPage);
                }
            }, 3000);
        }
    }
    
    destroyParticleSystem() {
        if (this.particleInterval) {
            clearInterval(this.particleInterval);
        }
    }
    
    createParticle(container) {
        const particle = document.createElement('div');
        particle.innerHTML = '✨';
        particle.style.position = 'absolute';
        particle.style.fontSize = '0.8rem';
        particle.style.left = Math.random() * 80 + 10 + '%'; // Evita as bordas
        particle.style.top = '100%';
        particle.style.opacity = '0.6';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1';
        particle.style.animation = 'particleFloat 4s ease-out forwards';
        
        container.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 4000);
    }
}

// Adiciona estilos para as animações dinâmicas
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .floating-element {
        animation: float 4s ease-in-out infinite;
    }
    
    @keyframes particleFloat {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.8;
        }
        100% {
            transform: translateY(-200px) rotate(360deg);
            opacity: 0;
        }
    }
    
    .page {
        transition: all 0.5s ease;
    }
    
    .topic-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .topic-card:active {
        transform: scale(0.98);
    }
`;
document.head.appendChild(dynamicStyles);

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new CartilhaNavigator();
    new VisualEffects();
    
    // Adiciona instruções de navegação
    console.log('📚 Cartilha Digital - Navegação:');
    console.log('→ Seta direita ou Espaço: Próxima página');
    console.log('← Seta esquerda: Página anterior');
    console.log('Esc: Voltar ao menu principal');
    console.log('🖱️ Use as setinhas ou clique nos indicadores para navegar!');
    console.log('Clique nos cards para explorar os tópicos!');
});

// Adiciona efeito de loading na página
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
