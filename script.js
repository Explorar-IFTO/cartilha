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
        
        // Verifica se estamos na página principal ou em uma página específica
        this.isMainPage = document.querySelector('.main-page') !== null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        if (!this.isMainPage) {
            this.showPage(0); // Mostra a capa inicialmente apenas se não for página principal
        }
    }
    
    setupEventListeners() {
        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            // Só intercepta teclas de navegação se não estiver em um campo de entrada
            const isInputField = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true';
            
            if (e.key === 'ArrowRight' || e.key === ' ') {
                if (!isInputField) {
                    e.preventDefault();
                    this.nextPage();
                }
            } else if (e.key === 'ArrowLeft') {
                if (!isInputField) {
                    e.preventDefault();
                    this.previousPage();
                }
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
            // Remove qualquer listener anterior para evitar duplicação
            card.removeEventListener('click', this.handleTopicCardClick);
            card.removeEventListener('touchstart', this.handleTopicCardTouch);
            
            // Adiciona listeners com bind para poder remover depois
            this.handleTopicCardClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const topic = card.dataset.topic;
                
                // Redireciona para páginas específicas
                if (topic === 'autoconhecimento') {
                    window.location.href = 'autoconhecimento.html';
                } else if (topic === 'profissoes') {
                    window.location.href = 'profissoes.html';
                } else if (topic === 'implicacoes') {
                    window.location.href = 'implicacoes.html';
                } else {
                    this.showTopic(topic);
                }
                
                this.animateCardClick(card);
            };
            
            this.handleTopicCardTouch = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const topic = card.dataset.topic;
                
                // Redireciona para páginas específicas
                if (topic === 'autoconhecimento') {
                    window.location.href = 'autoconhecimento.html';
                } else if (topic === 'profissoes') {
                    window.location.href = 'profissoes.html';
                } else if (topic === 'implicacoes') {
                    window.location.href = 'implicacoes.html';
                } else {
                    this.showTopic(topic);
                }
                
                this.animateCardClick(card);
            };
            
            // Adiciona listeners
            card.addEventListener('click', this.handleTopicCardClick, { passive: false });
            card.addEventListener('touchstart', this.handleTopicCardTouch, { passive: false });
            
            // Efeito de hover com som (apenas em desktop)
            if (window.matchMedia('(hover: hover)').matches) {
                card.addEventListener('mouseenter', () => {
                    this.playHoverSound();
                });
            }
        });
        
        // Botões de voltar
        this.backButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.goToNavigation();
            });
        });
        
        // Suporte para gestos touch
        this.setupTouchGestures();
        
        // Detecção de orientação
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
        
        // Detecção de redimensionamento
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    setupTouchGestures() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        
        // Detecta início do toque
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        }, { passive: true });
        
        // Detecta fim do toque e determina direção
        document.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0];
            endX = touch.clientX;
            endY = touch.clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Só processa se o movimento foi horizontal e significativo
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Swipe para direita - página anterior
                    this.previousPage();
                } else {
                    // Swipe para esquerda - próxima página
                    this.nextPage();
                }
            }
        }, { passive: true });
    }
    
    handleOrientationChange() {
        // Ajusta o layout quando a orientação muda
        const book = document.querySelector('.book');
        if (book) {
            // Força um redimensionamento suave
            book.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                book.style.transition = '';
            }, 300);
        }
    }
    
    handleResize() {
        // Debounce para evitar muitas chamadas
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            // Ajusta elementos que podem precisar de recálculo
            this.adjustForScreenSize();
        }, 250);
    }
    
    adjustForScreenSize() {
        const screenWidth = window.innerWidth;
        const book = document.querySelector('.book');
        
        if (screenWidth <= 480) {
            // Mobile
            document.body.classList.add('mobile-layout');
            document.body.classList.remove('tablet-layout', 'desktop-layout');
        } else if (screenWidth <= 768) {
            // Tablet
            document.body.classList.add('tablet-layout');
            document.body.classList.remove('mobile-layout', 'desktop-layout');
        } else {
            // Desktop
            document.body.classList.add('desktop-layout');
            document.body.classList.remove('mobile-layout', 'tablet-layout');
        }
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
        
        // Garante que elementos decorativos não interfiram com cliques
        const decorativeElements = document.querySelectorAll('.decorative-elements, .floating-element');
        decorativeElements.forEach(element => {
            element.style.pointerEvents = 'none';
            element.style.zIndex = '1';
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
        // Remove rotação temporariamente para melhor feedback visual
        const originalTransform = card.style.transform;
        card.style.transform = 'scale(0.95) rotate(0deg)';
        card.style.boxShadow = '0 4px 15px rgba(78, 205, 196, 0.4)';
        card.style.transition = 'all 0.2s ease';
        
        setTimeout(() => {
            card.style.transform = originalTransform;
            card.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
        }, 200);
        
        // Adiciona feedback háptico em dispositivos móveis
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
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
        
        // Garante que elementos flutuantes não interfiram com cliques
        this.ensureFloatingElementsDontInterfere();
    }
    
    ensureFloatingElementsDontInterfere() {
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach(element => {
            element.style.pointerEvents = 'none';
            element.style.zIndex = '1';
        });
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
        particle.className = 'floating-element';
        
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

// Sistema de interações da seção de Autoconhecimento
class AutoconhecimentoInteractions {
    constructor() {
        this.storageKey = 'cartilha_autoconhecimento_responses';
        this.init();
    }
    
    init() {
        this.setupEmojiSelection();
        this.setupReflectionInputs();
        this.loadSavedResponses();
    }
    
    setupEmojiSelection() {
        const emojiOptions = document.querySelectorAll('.emoji-option');
        const selectedDisplay = document.getElementById('selectedEmojiDisplay');
        const selectedText = document.getElementById('selectedEmojiText');
        
        // Só configura se existirem elementos de emoji
        if (emojiOptions.length === 0) {
            return;
        }
        
        emojiOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove seleção anterior
                emojiOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Adiciona seleção atual
                option.classList.add('selected');
                
                // Mostra confirmação
                const emoji = option.dataset.emoji;
                const feeling = option.dataset.feeling;
                const label = option.querySelector('.label').textContent;
                
                if (selectedText) {
                    selectedText.textContent = `${emoji} ${label}`;
                }
                if (selectedDisplay) {
                    selectedDisplay.style.display = 'block';
                }
                
                // Salva no localStorage
                this.saveResponse('selectedEmoji', {
                    emoji: emoji,
                    feeling: feeling,
                    label: label
                });
                
                // Efeito visual
                this.animateSelection(option);
            });
        });
    }
    
    setupReflectionInputs() {
        const wordInput = document.getElementById('wordInput');
        const feelingInput = document.getElementById('feelingInput');
        const doubtInput = document.getElementById('doubtInput');
        const summary = document.getElementById('reflectionSummary');
        
        const inputs = [wordInput, feelingInput, doubtInput].filter(input => input !== null);
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveResponse(input.id, input.value);
                this.checkAndShowSummary();
            });
            
            input.addEventListener('blur', () => {
                this.saveResponse(input.id, input.value);
                this.checkAndShowSummary();
            });
        });
    }
    
    checkAndShowSummary() {
        const wordInput = document.getElementById('wordInput');
        const feelingInput = document.getElementById('feelingInput');
        const doubtInput = document.getElementById('doubtInput');
        const summary = document.getElementById('reflectionSummary');
        
        // Se não existirem os inputs, não faz nada
        if (!wordInput || !feelingInput || !doubtInput || !summary) {
            return;
        }
        
        const word = wordInput.value.trim();
        const feeling = feelingInput.value.trim();
        const doubt = doubtInput.value.trim();
        
        if (word && feeling && doubt) {
            const summaryWord = document.getElementById('summaryWord');
            const summaryFeeling = document.getElementById('summaryFeeling');
            const summaryDoubt = document.getElementById('summaryDoubt');
            
            if (summaryWord) summaryWord.textContent = word;
            if (summaryFeeling) summaryFeeling.textContent = feeling;
            if (summaryDoubt) summaryDoubt.textContent = doubt;
            summary.style.display = 'block';
            
            // Salva o resumo completo
            this.saveResponse('reflectionSummary', {
                word: word,
                feeling: feeling,
                doubt: doubt
            });
        } else {
            summary.style.display = 'none';
        }
    }
    
    saveResponse(key, value) {
        try {
            const responses = this.getStoredResponses();
            responses[key] = value;
            localStorage.setItem(this.storageKey, JSON.stringify(responses));
        } catch (error) {
            console.warn('Erro ao salvar resposta:', error);
        }
    }
    
    getStoredResponses() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.warn('Erro ao carregar respostas:', error);
            return {};
        }
    }
    
    loadSavedResponses() {
        const responses = this.getStoredResponses();
        
        // Carrega emoji selecionado
        if (responses.selectedEmoji) {
            const emojiData = responses.selectedEmoji;
            const emojiOption = document.querySelector(`[data-feeling="${emojiData.feeling}"]`);
            if (emojiOption) {
                emojiOption.classList.add('selected');
                const selectedEmojiText = document.getElementById('selectedEmojiText');
                const selectedEmojiDisplay = document.getElementById('selectedEmojiDisplay');
                if (selectedEmojiText) {
                    selectedEmojiText.textContent = `${emojiData.emoji} ${emojiData.label}`;
                }
                if (selectedEmojiDisplay) {
                    selectedEmojiDisplay.style.display = 'block';
                }
            }
        }
        
        // Carrega inputs de reflexão
        if (responses.wordInput) {
            const wordInput = document.getElementById('wordInput');
            if (wordInput) {
                wordInput.value = responses.wordInput;
            }
        }
        if (responses.feelingInput) {
            const feelingInput = document.getElementById('feelingInput');
            if (feelingInput) {
                feelingInput.value = responses.feelingInput;
            }
        }
        if (responses.doubtInput) {
            const doubtInput = document.getElementById('doubtInput');
            if (doubtInput) {
                doubtInput.value = responses.doubtInput;
            }
        }
        
        // Verifica se deve mostrar o resumo
        this.checkAndShowSummary();
    }
    
    animateSelection(element) {
        element.style.transform = 'scale(1.2) rotate(0deg)';
        element.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1.1) rotate(0deg)';
        }, 200);
    }
    
    // Método para obter todas as respostas (útil para outras seções)
    getAllResponses() {
        return this.getStoredResponses();
    }
    
    // Método para limpar todas as respostas
    clearAllResponses() {
        localStorage.removeItem(this.storageKey);
        location.reload(); // Recarrega para limpar a interface
    }
}

// Sistema de interações do Mapa da Energia Diária
class EnergyMapInteractions {
    constructor() {
        this.storageKey = 'cartilha_energy_map_responses';
        this.init();
    }
    
    init() {
        this.setupMapInputs();
        this.setupZoomButtons();
        this.loadSavedMapResponses();
    }
    
    setupMapInputs() {
        const textareas = document.querySelectorAll('.territory-input textarea');
        
        textareas.forEach(textarea => {
            textarea.addEventListener('input', () => {
                this.saveMapResponse(textarea.id, textarea.value);
            });
            
            textarea.addEventListener('blur', () => {
                this.saveMapResponse(textarea.id, textarea.value);
            });
        });
    }
    
    setupZoomButtons() {
        const territoryZoomBtns = document.querySelectorAll('.territory-zoom-btn');
        const closeZoomBtn = document.getElementById('closeZoom');
        const zoomModal = document.getElementById('zoomModal');
        
        // Configura botões de zoom para todos os territórios
        territoryZoomBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const territoryType = btn.dataset.territory;
                this.showZoomModal(territoryType);
            });
        });
        
        if (closeZoomBtn) {
            closeZoomBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.hideZoomModal();
            });
        }
        
        if (zoomModal) {
            zoomModal.addEventListener('click', (e) => {
                if (e.target === zoomModal) {
                    this.hideZoomModal();
                }
            });
        }
    }
    
    showZoomModal(territoryType) {
        const zoomModal = document.getElementById('zoomModal');
        const zoomTerritory = document.getElementById('zoomTerritory');
        
        if (!zoomModal || !zoomTerritory) return;
        
        const territoryData = this.getTerritoryData(territoryType);
        zoomTerritory.innerHTML = this.createZoomContent(territoryData);
        
        zoomModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Previne scroll do body em mobile
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // Foca no modal para acessibilidade
        setTimeout(() => {
            const closeBtn = document.getElementById('closeZoom');
            if (closeBtn) {
                closeBtn.focus();
            }
        }, 100);
        
        // Adiciona listener para ESC
        this.escapeListener = (e) => {
            if (e.key === 'Escape') {
                this.hideZoomModal();
            }
        };
        document.addEventListener('keydown', this.escapeListener);
        
        // Adiciona suporte para touch em modais
        this.setupModalTouchSupport(zoomModal);
    }
    
    hideZoomModal() {
        const zoomModal = document.getElementById('zoomModal');
        if (zoomModal) {
            zoomModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Restaura scroll do body em mobile
            document.body.style.position = '';
            document.body.style.width = '';
            
            // Remove listener do ESC
            if (this.escapeListener) {
                document.removeEventListener('keydown', this.escapeListener);
                this.escapeListener = null;
            }
        }
    }
    
    setupModalTouchSupport(modal) {
        // Previne scroll do modal em mobile
        modal.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        // Adiciona suporte para swipe para fechar modal
        let startY = 0;
        let startX = 0;
        
        modal.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startY = touch.clientY;
            startX = touch.clientX;
        }, { passive: true });
        
        modal.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0];
            const endY = touch.clientY;
            const endX = touch.clientX;
            
            const deltaY = endY - startY;
            const deltaX = endX - startX;
            
            // Swipe para baixo para fechar modal
            if (deltaY > 100 && Math.abs(deltaX) < 50) {
                this.hideZoomModal();
            }
        }, { passive: true });
    }
    
    getTerritoryData(territoryType) {
        const territories = {
            passion: {
                icon: '🌻',
                title: 'O CAMPO DA PAIXÃO',
                subtitle: '(Gosto e Faço)',
                description: 'Esse é seu território preferido, onde você recarrega suas energias. Aqui você usa suas habilidades com facilidade e prazer.',
                questions: [
                    'O que mais te energiza nessas atividades?',
                    'Como você pode usar essas paixões na sua vida profissional?',
                    'Que habilidades você desenvolve fazendo isso?',
                    'Como você pode compartilhar essas paixões com outras pessoas?'
                ],
                inputId: 'passionInput'
            },
            secret: {
                icon: '🌺',
                title: 'O JARDIM SECRETO',
                subtitle: '(Gosto e Não Faço)',
                description: 'Esse é um território que você gostaria muito de visitar e acredita que tem potencial para isso.',
                questions: [
                    'Por que você ainda não faz aquilo que te atrai?',
                    'O que te impede de começar?',
                    'Que pequenos passos você poderia dar?',
                    'Como você se sentiria se conseguisse fazer isso?'
                ],
                inputId: 'secretInput'
            },
            mountain: {
                icon: '⛰️',
                title: 'A MONTANHA ÍNGREME',
                subtitle: '(Não Gosto e Faço)',
                description: 'Esse é um território de desafios, onde a subida exige muito esforço.',
                questions: [
                    'Por que você ainda faz aquilo que já sabe que não gosta?',
                    'O que você aprende fazendo essas atividades?',
                    'Como você poderia tornar isso mais suportável?',
                    'Existe uma forma de evitar ou reduzir isso?'
                ],
                inputId: 'mountainInput'
            },
            swamp: {
                icon: '🐸',
                title: 'O PÂNTANO',
                subtitle: '(Não Gosto e Não Faço)',
                description: 'Esse é o território do qual você quer manter distância. É o que você não gosta de fazer e consegue evitar.',
                questions: [
                    'Por que você evita essas atividades?',
                    'O que você aprende sobre si mesmo evitando isso?',
                    'Existe alguma situação onde você teria que enfrentar isso?',
                    'Como você pode se preparar caso precise lidar com isso?'
                ],
                inputId: 'swampInput'
            }
        };
        
        return territories[territoryType] || null;
    }
    
    createZoomContent(territoryData) {
        const responses = this.getStoredMapResponses();
        const userInput = responses[territoryData.inputId] || '';
        
        return `
            <div class="territory-icon">${territoryData.icon}</div>
            <h3>${territoryData.title}</h3>
            <p class="territory-subtitle">${territoryData.subtitle}</p>
            <p class="territory-description">${territoryData.description}</p>
            
            <div class="zoom-map-container">
                <h4 style="text-align: center; margin-bottom: 15px; color: #333;">🗺️ Seu Mapa da Energia</h4>
                <div class="zoom-map-grid">
                    ${this.createZoomMapGrid(territoryData.inputId)}
                </div>
            </div>
            
            ${userInput ? `
                <div class="user-response">
                    <h4>📝 Sua resposta:</h4>
                    <p>"${userInput}"</p>
                </div>
            ` : ''}
            
            <div class="reflection-questions">
                <h4>🤔 Questões para reflexão:</h4>
                ${territoryData.questions.map(question => `
                    <p><strong>•</strong> ${question}</p>
                `).join('')}
            </div>
            
            <div class="zoom-actions">
                <p><em>💡 Reserve um tempo para refletir sobre essas questões. Não há pressa para ter todas as respostas!</em></p>
            </div>
        `;
    }
    
    createZoomMapGrid(selectedTerritoryId) {
        const territories = [
            {
                id: 'passionInput',
                icon: '🌻',
                title: 'CAMPO DA PAIXÃO',
                subtitle: '(Gosto e Faço)',
                class: 'passion-field'
            },
            {
                id: 'secretInput',
                icon: '🌺',
                title: 'JARDIM SECRETO',
                subtitle: '(Gosto e Não Faço)',
                class: 'secret-garden'
            },
            {
                id: 'mountainInput',
                icon: '⛰️',
                title: 'MONTANHA ÍNGREME',
                subtitle: '(Não Gosto e Faço)',
                class: 'steep-mountain'
            },
            {
                id: 'swampInput',
                icon: '🐸',
                title: 'PÂNTANO',
                subtitle: '(Não Gosto e Não Faço)',
                class: 'swamp'
            }
        ];
        
        return territories.map(territory => {
            const isSelected = territory.id === selectedTerritoryId;
            const responses = this.getStoredMapResponses();
            const userInput = responses[territory.id] || '';
            
            return `
                <div class="zoom-territory-card ${territory.class} ${isSelected ? 'selected' : ''}">
                    <div class="zoom-territory-header">
                        <div class="zoom-territory-icon">${territory.icon}</div>
                        <h4>${territory.title}</h4>
                        <p class="zoom-territory-subtitle">${territory.subtitle}</p>
                    </div>
                    ${userInput ? `
                        <div class="zoom-territory-content">
                            <p class="zoom-user-input">"${userInput}"</p>
                        </div>
                    ` : `
                        <div class="zoom-territory-content">
                            <p class="zoom-empty">Ainda não preenchido</p>
                        </div>
                    `}
                </div>
            `;
        }).join('');
    }
    
    saveMapResponse(key, value) {
        try {
            const responses = this.getStoredMapResponses();
            responses[key] = value;
            localStorage.setItem(this.storageKey, JSON.stringify(responses));
        } catch (error) {
            console.warn('Erro ao salvar resposta do mapa:', error);
        }
    }
    
    getStoredMapResponses() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.warn('Erro ao carregar respostas do mapa:', error);
            return {};
        }
    }
    
    loadSavedMapResponses() {
        const responses = this.getStoredMapResponses();
        
        // Carrega todas as respostas dos territórios
        Object.keys(responses).forEach(key => {
            const textarea = document.getElementById(key);
            if (textarea) {
                textarea.value = responses[key];
            }
        });
    }
    
    // Método para obter todas as respostas do mapa
    getAllMapResponses() {
        return this.getStoredMapResponses();
    }
}

// Sistema de interações da Bússola de Interesses
class CompassInteractions {
    constructor() {
        this.storageKey = 'cartilha_compass_responses';
        this.currentSelectedCircle = null;
        this.init();
    }
    
    init() {
        this.setupCompassInteractions();
        this.loadSavedCompassResponses();
    }
    
    setupCompassInteractions() {
        const circles = document.querySelectorAll('.compass-circle');
        const needle = document.getElementById('compassNeedle');
        const modal = document.getElementById('compassModal');
        const closeModal = document.getElementById('closeCompassModal');
        
        circles.forEach(circle => {
            // Hover effect
            circle.addEventListener('mouseenter', () => {
                const direction = parseInt(circle.dataset.direction);
                this.rotateNeedle(needle, direction);
            });
            
            // Click effect
            circle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Previne qualquer scroll
                e.stopImmediatePropagation();
                
                // Remove seleção anterior
                circles.forEach(c => c.classList.remove('selected'));
                
                // Adiciona seleção ao círculo clicado
                circle.classList.add('selected');
                
                // Salva o círculo selecionado
                this.currentSelectedCircle = circle;
                
                // Rotaciona a agulha para apontar para o círculo
                const direction = parseInt(circle.dataset.direction);
                this.rotateNeedle(needle, direction);
                
                // Abre o modal com o conteúdo do círculo
                this.openCompassModal(circle);
            });
        });
        
        // Fechar modal
        if (closeModal) {
            closeModal.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeCompassModal();
            });
        }
        
        // Fechar modal clicando fora
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeCompassModal();
                }
            });
        }
        
        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
                this.closeCompassModal();
            }
        });
        
        // Previne scroll durante o modal
        document.addEventListener('wheel', (e) => {
            if (modal && modal.classList.contains('active')) {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (modal && modal.classList.contains('active')) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    rotateNeedle(needle, degrees) {
        if (needle) {
            needle.style.transform = `translate(-50%, -50%) rotate(${degrees}deg)`;
        }
    }
    
    openCompassModal(circle) {
        const modal = document.getElementById('compassModal');
        const modalIcon = document.getElementById('compassModalIcon');
        const modalTitle = document.getElementById('compassModalTitle');
        const modalBody = document.getElementById('compassModalBody');
        
        if (!modal) return;
        
        const circleType = circle.dataset.circle;
        const circleData = this.getCompassCircleData(circleType);
        
        // Salva a posição atual do scroll
        this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        // Atualiza o cabeçalho do modal
        modalIcon.textContent = circleData.icon;
        modalTitle.textContent = circleData.title;
        
        // Cria o conteúdo do modal
        modalBody.innerHTML = this.createCompassModalContent(circleData);
        
        // CORREÇÃO: Adiciona classe para travar o body
        document.body.classList.add('modal-open');
        document.body.style.top = `-${this.scrollPosition}px`;
        
        // CORREÇÃO: Move o modal para o final do body (garante que seja o último elemento)
        if (modal.parentElement !== document.body) {
            document.body.appendChild(modal);
        }
        
        // CORREÇÃO: Garante que o modal tenha o z-index mais alto e position fixed
        modal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 999999 !important;
            display: flex !important;
        `;
        
        // Mostra o modal
        modal.classList.add('active');
        
        // CORREÇÃO: Garante que o conteúdo do modal também tenha z-index alto
        const modalContent = modal.querySelector('.compass-modal-content');
        if (modalContent) {
            modalContent.style.cssText = `
                position: relative !important;
                z-index: 1000000 !important;
            `;
        }
        
        // CORREÇÃO: Previne scroll em todos os elementos
        document.documentElement.style.overflow = 'hidden';
        
        // Foca no primeiro input
        setTimeout(() => {
            const firstInput = modalBody.querySelector('textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
        
        // Adiciona listeners para os inputs
        this.setupCompassModalInputs();
        
        // Adiciona suporte para touch em modais
        this.setupModalTouchSupport(modal);
    }
    
    closeCompassModal() {
        console.log('closeCompassModal chamado!'); // Debug
        
        const modal = document.getElementById('compassModal');
        console.log('Modal encontrado:', modal); // Debug
        
        if (modal) {
            // CORREÇÃO: Remove a classe active
            modal.classList.remove('active');
            
            // CORREÇÃO: Força o display none removendo o estilo inline
            modal.style.cssText = 'display: none !important;';
            
            console.log('Modal fechado!'); // Debug
            
            // CORREÇÃO: Remove a classe modal-open e restaura estilos
            document.body.classList.remove('modal-open');
            document.body.style.top = '';
            
            // CORREÇÃO: Restaura overflow do documentElement
            document.documentElement.style.overflow = '';
            
            // CORREÇÃO: Restaura a posição do scroll SEM animação
            if (this.scrollPosition !== undefined) {
                // Usa scrollTo sem animação para evitar movimento visível
                window.scrollTo({
                    top: this.scrollPosition,
                    left: 0,
                    behavior: 'instant'
                });
                this.scrollPosition = undefined;
            }
            
            // Mantém a seleção e posição da agulha
            if (this.currentSelectedCircle) {
                const needle = document.getElementById('compassNeedle');
                const direction = parseInt(this.currentSelectedCircle.dataset.direction);
                this.rotateNeedle(needle, direction);
            }
        } else {
            console.error('Modal não encontrado!'); // Debug
        }
    }
    
    getCompassCircleData(circleType) {
        const circleData = {
            school: {
                icon: '🏫',
                title: 'Na escola',
                inputs: [
                    {
                        id: 'schoolSubject',
                        label: 'Minha disciplina favorita é...',
                        placeholder: 'Ex: matemática, história, artes...',
                        maxlength: 50
                    },
                    {
                        id: 'schoolActivity',
                        label: 'O que eu mais gosto de fazer nela é...',
                        placeholder: 'Ex: resolver problemas, debater, criar...',
                        maxlength: 100
                    }
                ]
            },
            leisure: {
                icon: '🎨',
                title: 'No meu tempo livre',
                inputs: [
                    {
                        id: 'leisureHobby',
                        label: 'Meu hobby ou o que eu mais gosto de fazer é...',
                        placeholder: 'Ex: desenhar, jogar, ler...',
                        maxlength: 50
                    },
                    {
                        id: 'leisureActivity',
                        label: 'O que eu faço quando estou praticando esse hobby?',
                        placeholder: 'Ex: crio, organizo, jogo...',
                        maxlength: 100
                    }
                ]
            },
            social: {
                icon: '👥',
                title: 'No meu convívio social',
                inputs: [
                    {
                        id: 'socialUseful',
                        label: 'Eu me sinto útil quando...',
                        placeholder: 'Ex: ajudo alguém, organizo eventos...',
                        maxlength: 100
                    },
                    {
                        id: 'socialHelp',
                        label: 'Eu gosto de ajudar fazendo...',
                        placeholder: 'Ex: explicar algo, ouvir, resolver...',
                        maxlength: 100
                    }
                ]
            },
            responsibility: {
                icon: '⚡',
                title: 'Em minhas responsabilidades',
                inputs: [
                    {
                        id: 'responsibilityFeel',
                        label: 'Eu me sinto bem quando...',
                        placeholder: 'Ex: termino algo, organizo...',
                        maxlength: 100
                    },
                    {
                        id: 'responsibilityHelp',
                        label: 'O que eu faço para ajudar é...',
                        placeholder: 'Ex: organizar, limpar, planejar...',
                        maxlength: 100
                    }
                ]
            }
        };
        
        return circleData[circleType] || null;
    }
    
    createCompassModalContent(circleData) {
        const responses = this.getStoredCompassResponses();
        
        const inputsHTML = circleData.inputs.map(input => {
            const currentValue = responses[input.id] || '';
            return `
                <div class="compass-modal-input">
                    <label for="${input.id}">${input.label}</label>
                    <textarea 
                        id="${input.id}" 
                        placeholder="${input.placeholder}" 
                        maxlength="${input.maxlength}"
                    >${currentValue}</textarea>
                </div>
            `;
        }).join('');
        
        return `
            ${inputsHTML}
            <div class="compass-modal-actions">
                <button class="compass-save-btn" type="button">
                    💾 Salvar e Fechar
                </button>
            </div>
        `;
    }
    
    setupCompassModalInputs() {
        const inputs = document.querySelectorAll('.compass-modal-input textarea');
        
        inputs.forEach(input => {
            // Salva automaticamente enquanto digita
            input.addEventListener('input', () => {
                this.saveCompassResponse(input.id, input.value);
                this.checkAndShowSummary();
            });
            
            // Salva quando sai do campo
            input.addEventListener('blur', () => {
                this.saveCompassResponse(input.id, input.value);
                this.checkAndShowSummary();
            });
            
            // Salva quando pressiona Enter
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.saveCompassResponse(input.id, input.value);
                    this.checkAndShowSummary();
                    // Foca no próximo campo ou fecha o modal
                    const nextInput = input.parentElement.nextElementSibling?.querySelector('textarea');
                    if (nextInput) {
                        nextInput.focus();
                    } else {
                        this.closeCompassModal();
                    }
                }
            });
        });
        
        // CORREÇÃO: Busca o botão dentro do modal que acabou de ser criado
        // Usa setTimeout para garantir que o DOM foi atualizado
        setTimeout(() => {
            const modalBody = document.getElementById('compassModalBody');
            const saveBtn = modalBody?.querySelector('.compass-save-btn');
            
            console.log('Botão encontrado:', saveBtn); // Debug
            
            // Botão Salvar e Fechar
            if (saveBtn) {
                // Remove listeners anteriores (se existirem)
                const newSaveBtn = saveBtn.cloneNode(true);
                saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
                
                newSaveBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log('Botão clicado!'); // Debug
                    
                    // Salva todos os campos antes de fechar
                    const allInputs = document.querySelectorAll('.compass-modal-input textarea');
                    allInputs.forEach(input => {
                        this.saveCompassResponse(input.id, input.value);
                    });
                    this.checkAndShowSummary();
                    this.closeCompassModal();
                });
            } else {
                console.error('Botão não encontrado!'); // Debug
            }
        }, 50);
    }
    
    checkAndShowSummary() {
        const responses = this.getStoredCompassResponses();
        const summary = document.getElementById('compassSummary');
        const summaryContent = document.getElementById('compassSummaryContent');
        
        // Se não existir o summary, não faz nada
        if (!summary || !summaryContent) {
            return;
        }
        
        // Verifica se pelo menos 4 campos estão preenchidos
        const filledFields = Object.values(responses).filter(value => value.trim() !== '').length;
        
        if (filledFields >= 4) {
            this.generateSummary(responses, summaryContent);
            summary.style.display = 'block';
        } else {
            summary.style.display = 'none';
        }
    }
    
    generateSummary(responses, container) {
        const summaryData = [
            {
                icon: '🏫',
                title: 'Na escola',
                content: responses.schoolSubject ? `Minha disciplina favorita é ${responses.schoolSubject}` : '',
                activity: responses.schoolActivity ? `O que mais gosto de fazer é ${responses.schoolActivity}` : ''
            },
            {
                icon: '🎨',
                title: 'No meu tempo livre',
                content: responses.leisureHobby ? `Meu hobby é ${responses.leisureHobby}` : '',
                activity: responses.leisureActivity ? `Quando pratico, eu ${responses.leisureActivity}` : ''
            },
            {
                icon: '👥',
                title: 'No convívio social',
                content: responses.socialUseful ? `Me sinto útil quando ${responses.socialUseful}` : '',
                activity: responses.socialHelp ? `Gosto de ajudar fazendo ${responses.socialHelp}` : ''
            },
            {
                icon: '⚡',
                title: 'Nas responsabilidades',
                content: responses.responsibilityFeel ? `Me sinto bem quando ${responses.responsibilityFeel}` : '',
                activity: responses.responsibilityHelp ? `Para ajudar, eu ${responses.responsibilityHelp}` : ''
            }
        ];
        
        container.innerHTML = summaryData.map(item => {
            if (item.content || item.activity) {
                return `
                    <div style="margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.5); border-radius: 10px; border: 2px solid #000;">
                        <p><strong>${item.icon} ${item.title}:</strong></p>
                        ${item.content ? `<p>• ${item.content}</p>` : ''}
                        ${item.activity ? `<p>• ${item.activity}</p>` : ''}
                    </div>
                `;
            }
            return '';
        }).filter(item => item !== '').join('');
    }
    
    saveCompassResponse(key, value) {
        try {
            const responses = this.getStoredCompassResponses();
            responses[key] = value;
            localStorage.setItem(this.storageKey, JSON.stringify(responses));
        } catch (error) {
            console.warn('Erro ao salvar resposta da bússola:', error);
        }
    }
    
    getStoredCompassResponses() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.warn('Erro ao carregar respostas da bússola:', error);
            return {};
        }
    }
    
    loadSavedCompassResponses() {
        const responses = this.getStoredCompassResponses();
        
        // Carrega todas as respostas da bússola
        Object.keys(responses).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = responses[key];
            }
        });
        
        // Verifica se deve mostrar o resumo
        this.checkAndShowSummary();
    }
    
    // Método para obter todas as respostas da bússola
    getAllCompassResponses() {
        return this.getStoredCompassResponses();
    }
}

// Sistema de interações dos Valores Inegociáveis
class ValuesInteractions {
    constructor() {
        this.storageKey = 'cartilha_values_responses';
        this.init();
    }
    
    init() {
        this.setupClickInteractions();
        this.setupReflectionInputs();
        this.loadSavedValues();
    }
    
    setupClickInteractions() {
        const valueItems = document.querySelectorAll('.value-item');
        const podiumBases = document.querySelectorAll('.podium-base');
        
        // Configura clique para os itens de valor
        valueItems.forEach(item => {
            item.addEventListener('click', () => {
                if (!item.classList.contains('used')) {
                    this.showValueSelectionModal(item);
                }
            });
        });
        
        // Configura clique para os lugares do pódio
        podiumBases.forEach(podium => {
            podium.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!podium.dataset.valueId) {
                    this.showPodiumSelectionModal(podium);
                } else {
                    // Permite remover valor clicando novamente
                    this.removeValueFromPodium(podium);
                }
            });
        });
    }
    
    placeValueOnPodium(podium, valueItem) {
        const valueText = valueItem.querySelector('span').textContent;
        const valueId = valueItem.dataset.value;
        
        // Atualiza o conteúdo do pódio
        const podiumContent = podium.querySelector('.podium-content');
        if (podiumContent) {
            podiumContent.innerHTML = `<span>${valueText}</span>`;
        }
        
        podium.dataset.valueId = valueId;
        podium.classList.add('occupied');
        
        // Marca o item como usado
        valueItem.classList.add('used');
        
        // Salva no localStorage
        this.saveValuesToStorage();
        
        // Verifica se deve mostrar o resumo
        this.checkAndShowSummary();
    }
    
    removeValueFromPodium(podium) {
        const valueId = podium.dataset.valueId;
        
        // Restaura o placeholder
        const podiumContent = podium.querySelector('.podium-content');
        if (podiumContent) {
            podiumContent.innerHTML = '<span class="placeholder">Clique aqui</span>';
        }
        
        podium.dataset.valueId = '';
        podium.classList.remove('occupied');
        
        // Libera o item original
        const originalItem = document.querySelector(`.value-item[data-value="${valueId}"]`);
        if (originalItem) {
            originalItem.classList.remove('used');
        }
        
        // Salva no localStorage
        this.saveValuesToStorage();
        
        // Verifica se deve mostrar o resumo
        this.checkAndShowSummary();
    }
    
    showValueSelectionModal(clickedItem) {
        const availablePodiums = document.querySelectorAll('.podium-base:not([data-value-id])');
        
        if (availablePodiums.length === 0) {
            this.showNotification('Todos os lugares do pódio já estão ocupados!', 'warning');
            return;
        }
        
        const valueText = clickedItem.querySelector('span').textContent;
        
        // Cria modal simples para seleção
        const modal = document.createElement('div');
        modal.className = 'value-selection-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>🏆 Escolha a posição no pódio para:</h3>
                <p style="margin-bottom: 20px; font-style: italic; color: #666;">"${valueText}"</p>
                <div class="podium-options">
                    ${Array.from(availablePodiums).map(podium => {
                        const place = podium.closest('.podium-place').dataset.place;
                        const medal = place === '1' ? '🥇' : place === '2' ? '🥈' : '🥉';
                        const positionText = place === '1' ? '1º lugar (Ouro)' : place === '2' ? '2º lugar (Prata)' : '3º lugar (Bronze)';
                        return `<button class="podium-option" data-place="${place}">
                            ${medal} ${positionText}
                        </button>`;
                    }).join('')}
                </div>
                <button class="close-modal">Ok</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Adiciona eventos
        modal.querySelectorAll('.podium-option').forEach(option => {
            option.addEventListener('click', () => {
                const place = option.dataset.place;
                const targetPodium = document.querySelector(`.podium-place[data-place="${place}"] .podium-base`);
                this.placeValueOnPodium(targetPodium, clickedItem);
                document.body.removeChild(modal);
                this.showNotification(`Valor colocado no ${place}º lugar!`, 'success');
            });
        });
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Adiciona suporte para ESC
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    showPodiumSelectionModal(podium) {
        const availableValues = document.querySelectorAll('.value-item:not(.used)');
        
        if (availableValues.length === 0) {
            this.showNotification('Todos os valores já foram selecionados!', 'warning');
            return;
        }
        
        const place = podium.closest('.podium-place').dataset.place;
        const medal = place === '1' ? '🥇' : place === '2' ? '🥈' : '🥉';
        const positionText = place === '1' ? '1º lugar (Ouro)' : place === '2' ? '2º lugar (Prata)' : '3º lugar (Bronze)';
        
        // Cria modal simples para seleção
        const modal = document.createElement('div');
        modal.className = 'value-selection-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${medal} Escolha um valor para o ${positionText}:</h3>
                <div class="value-options">
                    ${Array.from(availableValues).map(item => {
                        const valueText = item.querySelector('span').textContent;
                        return `<button class="value-option" data-value="${item.dataset.value}">
                            ${valueText}
                        </button>`;
                    }).join('')}
                </div>
                <button class="close-modal">Ok</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Adiciona eventos
        modal.querySelectorAll('.value-option').forEach(option => {
            option.addEventListener('click', () => {
                const valueId = option.dataset.value;
                const targetItem = document.querySelector(`.value-item[data-value="${valueId}"]`);
                this.placeValueOnPodium(podium, targetItem);
                document.body.removeChild(modal);
                this.showNotification(`Valor colocado no ${place}º lugar!`, 'success');
            });
        });
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Adiciona suporte para ESC
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    setupReflectionInputs() {
        const inputs = document.querySelectorAll('.reflection-input textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveReflectionResponse(input.id, input.value);
            });
            
            input.addEventListener('blur', () => {
                this.saveReflectionResponse(input.id, input.value);
            });
        });
    }
    
    checkAndShowSummary() {
        const podiumBases = document.querySelectorAll('.podium-base[data-value-id]');
        const summary = document.getElementById('valuesSummary');
        const summaryContent = document.getElementById('valuesSummaryContent');
        
        if (podiumBases.length >= 3) {
            this.generateSummary(summaryContent);
            summary.style.display = 'block';
        } else {
            summary.style.display = 'none';
        }
    }
    
    generateSummary(container) {
        const podiumBases = document.querySelectorAll('.podium-base[data-value-id]');
        const summaryData = [];
        
        podiumBases.forEach((podium, index) => {
            const place = podium.closest('.podium-place').dataset.place;
            const valueText = podium.querySelector('.podium-content span').textContent;
            const medal = place === '1' ? '🥇' : place === '2' ? '🥈' : '🥉';
            
            summaryData.push({
                place: place,
                medal: medal,
                value: valueText
            });
        });
        
        // Ordena por posição
        summaryData.sort((a, b) => parseInt(a.place) - parseInt(b.place));
        
        container.innerHTML = summaryData.map(item => `
            <div class="value-summary-item">
                <strong>${item.medal} ${item.place}º lugar:</strong> ${item.value}
            </div>
        `).join('');
    }
    
    saveValuesToStorage() {
        const podiumBases = document.querySelectorAll('.podium-base[data-value-id]');
        const values = {};
        
        podiumBases.forEach(podium => {
            const place = podium.closest('.podium-place').dataset.place;
            const valueId = podium.dataset.valueId;
            const valueText = podium.querySelector('.podium-content span').textContent;
            
            values[place] = {
                id: valueId,
                text: valueText
            };
        });
        
        try {
            const stored = this.getStoredValues();
            stored.podium = values;
            localStorage.setItem(this.storageKey, JSON.stringify(stored));
        } catch (error) {
            console.warn('Erro ao salvar valores:', error);
        }
    }
    
    saveReflectionResponse(key, value) {
        try {
            const stored = this.getStoredValues();
            stored.reflection = stored.reflection || {};
            stored.reflection[key] = value;
            localStorage.setItem(this.storageKey, JSON.stringify(stored));
        } catch (error) {
            console.warn('Erro ao salvar reflexão:', error);
        }
    }
    
    getStoredValues() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.warn('Erro ao carregar valores:', error);
            return {};
        }
    }
    
    loadSavedValues() {
        const stored = this.getStoredValues();
        
        // Carrega valores do pódio
        if (stored.podium) {
            Object.keys(stored.podium).forEach(place => {
                const podium = document.querySelector(`.podium-place[data-place="${place}"] .podium-base`);
                const valueData = stored.podium[place];
                
                if (podium && valueData) {
                    const podiumContent = podium.querySelector('.podium-content');
                    if (podiumContent) {
                        podiumContent.innerHTML = `<span>${valueData.text}</span>`;
                    }
                    podium.dataset.valueId = valueData.id;
                    podium.classList.add('occupied');
                    
                    // Marca o item original como usado
                    const originalItem = document.querySelector(`.value-item[data-value="${valueData.id}"]`);
                    if (originalItem) {
                        originalItem.classList.add('used');
                    }
                }
            });
        }
        
        // Carrega reflexões
        if (stored.reflection) {
            Object.keys(stored.reflection).forEach(key => {
                const input = document.getElementById(key);
                if (input) {
                    input.value = stored.reflection[key];
                }
            });
        }
        
        // Verifica se deve mostrar o resumo
        this.checkAndShowSummary();
    }
    
    // Método para obter todas as respostas dos valores
    getAllValuesResponses() {
        return this.getStoredValues();
    }
    
    // Sistema de notificações
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos inline para a notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'warning' ? '#ff9800' : '#2196f3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            border: 2px solid #000;
            box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.3);
            font-family: var(--font-comic);
            font-weight: 600;
            font-size: 0.9rem;
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        // Anima a entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove após 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa as classes principais
    const navigator = new CartilhaNavigator();
    new VisualEffects();
    new AutoconhecimentoInteractions();
    new EnergyMapInteractions();
    new CompassInteractions();
    new ValuesInteractions();
    
    // Ajusta layout inicial baseado no tamanho da tela
    navigator.adjustForScreenSize();
    
    // Adiciona instruções de navegação
    console.log('📚 Cartilha Digital - Navegação:');
    console.log('→ Seta direita ou Espaço: Próxima página');
    console.log('← Seta esquerda: Página anterior');
    console.log('Esc: Voltar ao menu principal');
    console.log('🖱️ Use as setinhas ou clique nos indicadores para navegar!');
    console.log('📱 Em dispositivos móveis: deslize para navegar!');
    console.log('Clique nos cards para explorar os tópicos!');
    console.log('💾 Suas respostas são salvas automaticamente no navegador!');
    
    // Detecta se é dispositivo touch
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
        console.log('📱 Modo touch detectado - gestos habilitados!');
    } else {
        document.body.classList.add('no-touch');
        console.log('🖱️ Modo desktop detectado - hover effects habilitados!');
    }
});

// Adiciona efeito de loading na página
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Sistema de Carrossel de Mitos e Verdades - VERSÃO ULTRA SIMPLES
class MitosVerdadesCarousel {
    constructor() {
        this.currentCard = 1;
        this.totalCards = 4;
        this.responses = {};
        
        // Aguarda o DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        this.loadStoredResponses();
        this.setupEventListeners();
        this.updateCarousel();
    }
    
    setupEventListeners() {
        // Botão anterior
        const prevBtn = document.getElementById('prevCardBtn');
        if (prevBtn) {
            prevBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Prev clicked, current:', this.currentCard);
                if (this.currentCard > 1) {
                    this.currentCard--;
                    this.updateCarousel();
                }
            };
        }
        
        // Botão próximo
        const nextBtn = document.getElementById('nextCardBtn');
        if (nextBtn) {
            nextBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Next clicked, current:', this.currentCard);
                if (this.currentCard < this.totalCards) {
                    this.currentCard++;
                    this.updateCarousel();
                }
            };
        }
        
        // Botões de escolha
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('choice-btn')) {
                console.log('Choice clicked');
                this.handleChoice(e.target);
            }
        });
    }
    
    handleChoice(button) {
        const cardNumber = parseInt(button.getAttribute('data-card'));
        const choice = button.getAttribute('data-choice');
        const explanation = document.getElementById(`explanation-${cardNumber}`);
        const card = button.closest('.mito-card');
        
        console.log('Handling choice:', cardNumber, choice);
        
        // Armazena a resposta
        this.responses[cardNumber] = choice;
        this.saveResponses();
        
        // Remove seleção anterior se houver
        const previousButtons = card.querySelectorAll('.choice-btn');
        previousButtons.forEach(btn => {
            btn.classList.remove('selected');
            btn.style.opacity = '0.6';
            btn.style.transform = 'scale(1)';
        });
        
        // Marca o botão selecionado
        button.classList.add('selected');
        button.style.opacity = '1';
        
        // Adiciona efeito visual ao botão selecionado
        if (choice === 'mito') {
            button.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
            button.style.transform = 'scale(1.05)';
        } else {
            button.style.background = 'linear-gradient(135deg, #4ecdc4, #44a08d)';
            button.style.transform = 'scale(1.05)';
        }
        
        // Mostra a explicação
        if (explanation) {
            explanation.style.display = 'block';
        }
        
        // Efeito de confete se acertou
        if (choice === 'mito') {
            this.showConfetti(card);
        }
        
        // Auto-avança após 3 segundos (só se não for o último)
        if (this.currentCard < this.totalCards) {
            setTimeout(() => {
                console.log('Auto-advancing from card', this.currentCard);
                if (this.currentCard < this.totalCards) {
                    this.currentCard++;
                    this.updateCarousel();
                }
            }, 3000);
        }
    }
    
    updateCarousel() {
        console.log('Updating carousel to card:', this.currentCard);
        
        const carouselTrack = document.getElementById('carouselTrack');
        const cards = document.querySelectorAll('.mito-card');
        const prevBtn = document.getElementById('prevCardBtn');
        const nextBtn = document.getElementById('nextCardBtn');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (!carouselTrack || !cards.length) {
            console.log('Elements not found');
            return;
        }
        
        // Atualiza posição do carrossel - centraliza o card ativo
        const translateX = -(this.currentCard - 1) * 25; // 25% por card (100% / 4)
        carouselTrack.style.transform = `translateX(${translateX}%)`;
        console.log('Transform applied:', translateX, 'for card:', this.currentCard);
        
        // Atualiza cards ativos - remove active de todos primeiro
        cards.forEach((card) => {
            card.classList.remove('active');
        });
        
        // Adiciona active apenas ao card atual
        const currentCardElement = cards[this.currentCard - 1];
        if (currentCardElement) {
            currentCardElement.classList.add('active');
        }
        
        // Atualiza controles
        if (prevBtn) {
            prevBtn.disabled = this.currentCard === 1;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentCard === this.totalCards;
        }
        
        // Atualiza progresso
        if (progressFill && progressText) {
            const progressPercentage = (this.currentCard / this.totalCards) * 100;
            progressFill.style.width = `${progressPercentage}%`;
            progressText.textContent = `${this.currentCard} de ${this.totalCards}`;
        }
        
        // Restaura respostas salvas
        this.restoreCardState();
    }
    
    restoreCardState() {
        const cards = document.querySelectorAll('.mito-card');
        const currentCardElement = cards[this.currentCard - 1];
        const cardNumber = this.currentCard;
        
        if (!currentCardElement || !this.responses[cardNumber]) return;
        
        const choice = this.responses[cardNumber];
        const explanation = document.getElementById(`explanation-${cardNumber}`);
        const selectedButton = currentCardElement.querySelector(`[data-choice="${choice}"]`);
        
        // Restaura visual do botão selecionado
        const allButtons = currentCardElement.querySelectorAll('.choice-btn');
        allButtons.forEach(btn => {
            btn.classList.remove('selected');
            btn.style.opacity = '0.6';
            btn.style.transform = 'scale(1)';
        });
        
        if (selectedButton) {
            selectedButton.classList.add('selected');
            selectedButton.style.opacity = '1';
            
            if (choice === 'mito') {
                selectedButton.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a52)';
                selectedButton.style.transform = 'scale(1.05)';
            } else {
                selectedButton.style.background = 'linear-gradient(135deg, #4ecdc4, #44a08d)';
                selectedButton.style.transform = 'scale(1.05)';
            }
        }
        
        // Mostra explicação
        if (explanation) {
            explanation.style.display = 'block';
        }
    }
    
    saveResponses() {
        localStorage.setItem('mitosVerdadesResponses', JSON.stringify(this.responses));
    }
    
    loadStoredResponses() {
        const stored = localStorage.getItem('mitosVerdadesResponses');
        if (stored) {
            this.responses = JSON.parse(stored);
        }
    }
    
    showConfetti(card) {
        for (let i = 0; i < 10; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'][Math.floor(Math.random() * 4)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            
            const cardRect = card.getBoundingClientRect();
            confetti.style.left = (cardRect.left + Math.random() * cardRect.width) + 'px';
            confetti.style.top = (cardRect.top + Math.random() * cardRect.height) + 'px';
            
            document.body.appendChild(confetti);
            
            confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(-100px) rotate(360deg)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            }).onfinish = () => {
                confetti.remove();
            };
        }
    }
}

// Função para alternar exemplos de soft skills
function toggleExample(skillName) {
    const exampleElement = document.getElementById(`exemplo-${skillName}`);
    const button = event.target.closest('.example-btn');
    const buttonText = button.querySelector('.btn-text');
    const buttonIcon = button.querySelector('.btn-icon');
    
    if (exampleElement.style.display === 'none' || exampleElement.style.display === '') {
        // Mostrar exemplo
        exampleElement.style.display = 'block';
        buttonText.textContent = 'Ocultar exemplo';
        buttonIcon.textContent = '👆';
        
        // Efeito visual
        button.style.background = 'linear-gradient(135deg, #45b7d1, #96ceb4)';
        
        // Scroll suave para o exemplo
        exampleElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
        
        // Confete para celebrar
        showSoftSkillConfetti(button);
        
    } else {
        // Ocultar exemplo
        exampleElement.style.display = 'none';
        buttonText.textContent = 'Clique para ver o exemplo';
        buttonIcon.textContent = '👆';
        
        // Restaurar cor original
        button.style.background = 'linear-gradient(135deg, #4ecdc4, #44a08d)';
    }
}

// Função para mostrar confete nas soft skills
function showSoftSkillConfetti(element) {
    for (let i = 0; i < 5; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '6px';
        confetti.style.height = '6px';
        confetti.style.backgroundColor = ['#4ecdc4', '#45b7d1', '#96ceb4', '#ff6b6b'][Math.floor(Math.random() * 4)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        
        const rect = element.getBoundingClientRect();
        confetti.style.left = (rect.left + Math.random() * rect.width) + 'px';
        confetti.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        document.body.appendChild(confetti);
        
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(-40px) rotate(180deg)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => {
            confetti.remove();
        };
    }
}

// Sistema de Gerenciamento da Análise de Profissões
class AnaliseProfissoesManager {
    constructor() {
        this.container = document.getElementById('analiseProfissoesContainer');
        this.opcoesData = {
            desafios: {
                'muitas-horas': 'Muitas horas de estudo',
                'poucas-vagas': 'Poucas vagas de emprego',
                'exige-contatos': 'Exige bons contatos'
            },
            acesso: {
                'quase-todos': 'Quase todo mundo',
                'mais-recursos': 'Só quem tem mais recursos',
                'depende-regiao': 'Depende da região onde vive'
            },
            futuro: {
                'crescer-muito': 'Crescer muito',
                'mudar-tecnologia': 'Mudar bastante por causa da tecnologia',
                'risco-desaparecer': 'Correr risco de desaparecer'
            }
        };
        
        this.init();
    }
    
    init() {
        this.loadTopProfissoes();
        this.setupEventListeners();
    }
    
    loadTopProfissoes() {
        const stored = localStorage.getItem('topProfissoesData');
        if (stored) {
            const data = JSON.parse(stored);
            this.createAnaliseCards(data);
        } else {
            this.showEmptyState();
        }
    }
    
    createAnaliseCards(data) {
        this.container.innerHTML = '';
        
        for (let i = 1; i <= 3; i++) {
            const profissao = data[`profissao${i}`];
            const motivo = data[`motivo${i}`];
            
            if (profissao && motivo) {
                const card = this.createProfissaoCard(i, profissao, motivo);
                this.container.appendChild(card);
            }
        }
        
        if (this.container.children.length === 0) {
            this.showEmptyState();
        }
        
        // Adiciona event listeners aos cards criados
        this.setupCardEventListeners();
    }
    
    createProfissaoCard(number, profissao, motivo) {
        const card = document.createElement('div');
        card.className = 'profissao-analise-card';
        card.setAttribute('data-profissao', number);
        
        // Carrega as escolhas salvas para esta profissão
        const savedChoices = this.loadSavedChoices(number);
        
        card.innerHTML = `
            <div class="profissao-analise-header">
                <div class="profissao-analise-number">${number}</div>
                <h3 class="profissao-analise-title">${profissao}</h3>
            </div>
            
            <div class="analise-campos">
                <div class="analise-campo">
                    <h6>Desafios:</h6>
                    <div class="analise-campo-opcoes">
                        <div class="analise-campo-opcao ${savedChoices.desafios === 'muitas-horas' ? 'selected' : ''}" data-categoria="desafios" data-valor="muitas-horas">Muitas horas de estudo</div>
                        <div class="analise-campo-opcao ${savedChoices.desafios === 'poucas-vagas' ? 'selected' : ''}" data-categoria="desafios" data-valor="poucas-vagas">Poucas vagas de emprego</div>
                        <div class="analise-campo-opcao ${savedChoices.desafios === 'exige-contatos' ? 'selected' : ''}" data-categoria="desafios" data-valor="exige-contatos">Exige bons contatos</div>
                    </div>
                </div>
                
                <div class="analise-campo">
                    <h6>Acesso:</h6>
                    <div class="analise-campo-opcoes">
                        <div class="analise-campo-opcao ${savedChoices.acesso === 'quase-todos' ? 'selected' : ''}" data-categoria="acesso" data-valor="quase-todos">Quase todo mundo</div>
                        <div class="analise-campo-opcao ${savedChoices.acesso === 'mais-recursos' ? 'selected' : ''}" data-categoria="acesso" data-valor="mais-recursos">Só quem tem mais recursos</div>
                        <div class="analise-campo-opcao ${savedChoices.acesso === 'depende-regiao' ? 'selected' : ''}" data-categoria="acesso" data-valor="depende-regiao">Depende da região onde vive</div>
                    </div>
                </div>
                
                <div class="analise-campo">
                    <h6>Futuro:</h6>
                    <div class="analise-campo-opcoes">
                        <div class="analise-campo-opcao ${savedChoices.futuro === 'crescer-muito' ? 'selected' : ''}" data-categoria="futuro" data-valor="crescer-muito">Crescer muito</div>
                        <div class="analise-campo-opcao ${savedChoices.futuro === 'mudar-tecnologia' ? 'selected' : ''}" data-categoria="futuro" data-valor="mudar-tecnologia">Mudar bastante por causa da tecnologia</div>
                        <div class="analise-campo-opcao ${savedChoices.futuro === 'risco-desaparecer' ? 'selected' : ''}" data-categoria="futuro" data-valor="risco-desaparecer">Correr risco de desaparecer</div>
                    </div>
                </div>
            </div>
        `;
        
        return card;
    }
    
    showEmptyState() {
        this.container.innerHTML = `
            <div class="comic-info-box empty-state">
                <p>📝 <strong>Preencha primeiro o Top 3 Profissões</strong> para ver a análise aqui!</p>
            </div>
        `;
    }
    
    loadSavedChoices(profissaoNumber) {
        const key = `analiseProfissao${profissaoNumber}`;
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {};
    }
    
    setupCardEventListeners() {
        // Event listeners já estão configurados via event delegation no setupEventListeners
        // Este método existe para compatibilidade com o código existente
    }
    
    setupEventListeners() {
        // Event delegation para opções de análise - usando document para capturar elementos criados dinamicamente
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('analise-campo-opcao')) {
                this.handleOpcaoClick(e.target);
            }
        });
    }
    
    handleOpcaoClick(element) {
        const card = element.closest('.profissao-analise-card');
        const profissaoNumber = card.getAttribute('data-profissao');
        const categoria = element.getAttribute('data-categoria');
        const valor = element.getAttribute('data-valor');
        
        // Remove seleção anterior da mesma categoria
        const campo = element.closest('.analise-campo');
        const opcoesAnteriores = campo.querySelectorAll('.analise-campo-opcao');
        opcoesAnteriores.forEach(opcao => {
            opcao.classList.remove('selected');
        });
        
        // Adiciona seleção atual
        element.classList.add('selected');
        
        // Salva a escolha
        this.saveAnaliseChoice(profissaoNumber, categoria, valor);
        
        // Feedback visual
        this.showSelectionFeedback(element);
    }
    
    saveAnaliseChoice(profissaoNumber, categoria, valor) {
        const key = `analiseProfissao${profissaoNumber}`;
        let data = JSON.parse(localStorage.getItem(key) || '{}');
        
        data[categoria] = valor;
        localStorage.setItem(key, JSON.stringify(data));
    }
    
    showSelectionFeedback(element) {
        // Efeito de confete pequeno
        for (let i = 0; i < 3; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '4px';
            confetti.style.height = '4px';
            confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1'][Math.floor(Math.random() * 3)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            
            const rect = element.getBoundingClientRect();
            confetti.style.left = (rect.left + Math.random() * rect.width) + 'px';
            confetti.style.top = (rect.top + Math.random() * rect.height) + 'px';
            
            document.body.appendChild(confetti);
            
            confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(-30px) rotate(180deg)`, opacity: 0 }
            ], {
                duration: 800,
                easing: 'ease-out'
            }).onfinish = () => {
                confetti.remove();
            };
        }
    }
}

// Função para alternar exemplos de soft skills
function toggleExample(skillName) {
    const exampleElement = document.getElementById(`exemplo-${skillName}`);
    const button = event.target.closest('.example-btn');
    const buttonText = button.querySelector('.btn-text');
    const buttonIcon = button.querySelector('.btn-icon');
    
    if (exampleElement.style.display === 'none' || exampleElement.style.display === '') {
        // Mostrar exemplo
        exampleElement.style.display = 'block';
        buttonText.textContent = 'Ocultar exemplo';
        buttonIcon.textContent = '👆';
        
        // Efeito visual
        button.style.background = 'linear-gradient(135deg, #45b7d1, #96ceb4)';
        
        // Scroll suave para o exemplo
        exampleElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
        
        // Confete para celebrar
        showSoftSkillConfetti(button);
        
    } else {
        // Ocultar exemplo
        exampleElement.style.display = 'none';
        buttonText.textContent = 'Clique para ver o exemplo';
        buttonIcon.textContent = '👆';
        
        // Restaurar cor original
        button.style.background = 'linear-gradient(135deg, #4ecdc4, #44a08d)';
    }
}

// Função para mostrar confete nas soft skills
function showSoftSkillConfetti(element) {
    for (let i = 0; i < 5; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '6px';
        confetti.style.height = '6px';
        confetti.style.backgroundColor = ['#4ecdc4', '#45b7d1', '#96ceb4', '#ff6b6b'][Math.floor(Math.random() * 4)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        
        const rect = element.getBoundingClientRect();
        confetti.style.left = (rect.left + Math.random() * rect.width) + 'px';
        confetti.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        document.body.appendChild(confetti);
        
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(-40px) rotate(180deg)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => {
            confetti.remove();
        };
    }
}

// Inicializa o sistema quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se estamos na página de profissões
    if (document.querySelector('.mitos-carousel-container')) {
        console.log('Initializing carousel');
        new MitosVerdadesCarousel();
    }
    
    // Inicializa o sistema Top 3 Profissões
    if (document.querySelector('.top-profissoes-section')) {
        console.log('Initializing Top 3 Profissões');
        new TopProfissoesManager();
    }
    
    // Inicializa o sistema de Análise de Profissões
    if (document.querySelector('.analise-profissoes-section')) {
        console.log('Initializing Análise de Profissões');
        window.analiseProfissoesManager = new AnaliseProfissoesManager();
    }
});

// Sistema de Gerenciamento do Top 3 Profissões
class TopProfissoesManager {
    constructor() {
        this.form = document.getElementById('topProfissoesForm');
        this.saveBtn = document.getElementById('saveTopProfissoes');
        
        this.init();
    }
    
    init() {
        this.loadStoredData();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Botão de salvar
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => {
                this.saveData();
            });
        }
        
        // Auto-save nos campos
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveData();
            });
        });
    }
    
    saveData() {
        const data = {
            profissao1: document.getElementById('profissao1').value,
            motivo1: document.getElementById('motivo1').value,
            profissao2: document.getElementById('profissao2').value,
            motivo2: document.getElementById('motivo2').value,
            profissao3: document.getElementById('profissao3').value,
            motivo3: document.getElementById('motivo3').value
        };
        
        // Salva no localStorage
        localStorage.setItem('topProfissoesData', JSON.stringify(data));
        
        // Atualiza automaticamente a seção de análise
        this.updateAnaliseSection(data);
        
        // Feedback visual
        this.showSaveFeedback();
    }
    
    loadStoredData() {
        const stored = localStorage.getItem('topProfissoesData');
        if (stored) {
            const data = JSON.parse(stored);
            
            document.getElementById('profissao1').value = data.profissao1 || '';
            document.getElementById('motivo1').value = data.motivo1 || '';
            document.getElementById('profissao2').value = data.profissao2 || '';
            document.getElementById('motivo2').value = data.motivo2 || '';
            document.getElementById('profissao3').value = data.profissao3 || '';
            document.getElementById('motivo3').value = data.motivo3 || '';
            
            // Atualiza a seção de análise com os dados carregados
            this.updateAnaliseSection(data);
        }
    }
    
    updateAnaliseSection(data) {
        // Verifica se existe uma instância do AnaliseProfissoesManager
        if (window.analiseProfissoesManager) {
            window.analiseProfissoesManager.createAnaliseCards(data);
        } else {
            // Se não existe, cria uma nova instância temporária para atualizar
            const tempManager = new AnaliseProfissoesManager();
            tempManager.createAnaliseCards(data);
        }
    }
    
    hasData(data) {
        return data.profissao1 || data.profissao2 || data.profissao3;
    }
    
    // Método updateResumo removido conforme solicitado
    
    showSaveFeedback() {
        // Efeito visual de salvamento
        this.saveBtn.style.transform = 'scale(0.95)';
        this.saveBtn.style.background = 'linear-gradient(135deg, #45b7d1, #96ceb4)';
        
        setTimeout(() => {
            this.saveBtn.style.transform = 'scale(1)';
            this.saveBtn.style.background = 'linear-gradient(135deg, #4ecdc4, #44a08d)';
        }, 200);
        
        // Confete para celebrar
        this.showConfetti();
    }
    
    showConfetti() {
        for (let i = 0; i < 8; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '6px';
            confetti.style.height = '6px';
            confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'][Math.floor(Math.random() * 4)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            
            document.body.appendChild(confetti);
            
            confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 100}px) rotate(360deg)`, opacity: 0 }
            ], {
                duration: 2000,
                easing: 'ease-out'
            }).onfinish = () => {
                confetti.remove();
            };
        }
    }
}

// Função para alternar exemplos de soft skills
function toggleExample(skillName) {
    const exampleElement = document.getElementById(`exemplo-${skillName}`);
    const button = event.target.closest('.example-btn');
    const buttonText = button.querySelector('.btn-text');
    const buttonIcon = button.querySelector('.btn-icon');
    
    if (exampleElement.style.display === 'none' || exampleElement.style.display === '') {
        // Mostrar exemplo
        exampleElement.style.display = 'block';
        buttonText.textContent = 'Ocultar exemplo';
        buttonIcon.textContent = '👆';
        
        // Efeito visual
        button.style.background = 'linear-gradient(135deg, #45b7d1, #96ceb4)';
        
        // Scroll suave para o exemplo
        exampleElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
        
        // Confete para celebrar
        showSoftSkillConfetti(button);
        
    } else {
        // Ocultar exemplo
        exampleElement.style.display = 'none';
        buttonText.textContent = 'Clique para ver o exemplo';
        buttonIcon.textContent = '👆';
        
        // Restaurar cor original
        button.style.background = 'linear-gradient(135deg, #4ecdc4, #44a08d)';
    }
}

// Função para mostrar confete nas soft skills
function showSoftSkillConfetti(element) {
    for (let i = 0; i < 5; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '6px';
        confetti.style.height = '6px';
        confetti.style.backgroundColor = ['#4ecdc4', '#45b7d1', '#96ceb4', '#ff6b6b'][Math.floor(Math.random() * 4)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        
        const rect = element.getBoundingClientRect();
        confetti.style.left = (rect.left + Math.random() * rect.width) + 'px';
        confetti.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        document.body.appendChild(confetti);
        
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(-40px) rotate(180deg)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => {
            confetti.remove();
        };
    }
}

// ===== FUNCIONALIDADES DA SEÇÃO MOCHILA =====

// Função para lidar com a seleção de opções na mochila
function handleMochilaSelection() {
    const radioButtons = document.querySelectorAll('input[name="influencia"]');
    const reflexaoElement = document.getElementById('reflexaoMochila');
    
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                // Mostrar reflexão genérica
                reflexaoElement.style.display = 'block';
                
                // Scroll suave para a reflexão
                setTimeout(() => {
                    reflexaoElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'nearest' 
                    });
                }, 300);
                
                // Salvar escolha no localStorage
                localStorage.setItem('mochilaEscolha', this.value);
                localStorage.setItem('mochilaEscolhaData', new Date().toISOString());
            }
        });
    });
}


// Função para restaurar escolha salva da mochila
function restoreMochilaChoice() {
    const savedChoice = localStorage.getItem('mochilaEscolha');
    const savedDate = localStorage.getItem('mochilaEscolhaData');
    
    if (savedChoice && savedDate) {
        // Verificar se a escolha não é muito antiga (opcional)
        const choiceDate = new Date(savedDate);
        const now = new Date();
        const daysDiff = (now - choiceDate) / (1000 * 60 * 60 * 24);
        
        // Se a escolha foi feita há menos de 30 dias, restaurar
        if (daysDiff < 30) {
            const radioButton = document.getElementById(savedChoice);
            if (radioButton) {
                radioButton.checked = true;
                
                // Mostrar reflexão sem fazer scroll automático
                const reflexaoElement = document.getElementById('reflexaoMochila');
                if (reflexaoElement) {
                    reflexaoElement.style.display = 'block';
                }
            }
        }
    }
}

// ===== FUNCIONALIDADES DA SEÇÃO PRESSÃO DE QUEM =====

// Função para lidar com a seção "Pressão de Quem?"
function handlePressaoQuem() {
    const salvarBtn = document.getElementById('salvarPressao');
    const textareas = document.querySelectorAll('.balao-input textarea');
    const radioButtons = document.querySelectorAll('input[name="pressaoFinal"]');
    
    // Salvar respostas quando o botão for clicado
    if (salvarBtn) {
        salvarBtn.addEventListener('click', function() {
            const respostas = {
                familia: document.getElementById('pressaoFamilia').value,
                amigos: document.getElementById('pressaoAmigos').value,
                sociedade: document.getElementById('pressaoSociedade').value,
                autopressao: document.getElementById('pressaoAutopressao').value,
                pressaoFinal: document.querySelector('input[name="pressaoFinal"]:checked')?.value || ''
            };
            
            // Salvar no localStorage
            localStorage.setItem('pressaoQuemRespostas', JSON.stringify(respostas));
            localStorage.setItem('pressaoQuemData', new Date().toISOString());
            
            // Feedback visual
            showPressaoQuemConfetti(this);
            
            // Mudar texto do botão temporariamente
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">Salvo!</span>';
            this.style.background = 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)';
            }, 2000);
        });
    }
    
    // Auto-salvar quando o usuário digita nos textareas
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            const respostas = {
                familia: document.getElementById('pressaoFamilia').value,
                amigos: document.getElementById('pressaoAmigos').value,
                sociedade: document.getElementById('pressaoSociedade').value,
                autopressao: document.getElementById('pressaoAutopressao').value,
                pressaoFinal: document.querySelector('input[name="pressaoFinal"]:checked')?.value || ''
            };
            
            localStorage.setItem('pressaoQuemRespostas', JSON.stringify(respostas));
        });
    });
    
    // Auto-salvar quando uma opção final é selecionada
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            const respostas = {
                familia: document.getElementById('pressaoFamilia').value,
                amigos: document.getElementById('pressaoAmigos').value,
                sociedade: document.getElementById('pressaoSociedade').value,
                autopressao: document.getElementById('pressaoAutopressao').value,
                pressaoFinal: this.value
            };
            
            localStorage.setItem('pressaoQuemRespostas', JSON.stringify(respostas));
            
            // Efeito visual
            showPressaoQuemConfetti(this);
        });
    });
}

// Função para mostrar confete na seção pressão de quem
function showPressaoQuemConfetti(element) {
    for (let i = 0; i < 6; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '6px';
        confetti.style.height = '6px';
        confetti.style.backgroundColor = ['#667eea', '#764ba2', '#4ecdc4', '#ff6b6b', '#ffd93d'][Math.floor(Math.random() * 5)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        
        const rect = element.getBoundingClientRect();
        confetti.style.left = (rect.left + Math.random() * rect.width) + 'px';
        confetti.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        document.body.appendChild(confetti);
        
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(-50px) rotate(360deg)`, opacity: 0 }
        ], {
            duration: 1200,
            easing: 'ease-out'
        }).onfinish = () => {
            confetti.remove();
        };
    }
}

// Função para restaurar respostas salvas da seção pressão de quem
function restorePressaoQuem() {
    const savedData = localStorage.getItem('pressaoQuemRespostas');
    const savedDate = localStorage.getItem('pressaoQuemData');
    
    if (savedData && savedDate) {
        // Verificar se as respostas não são muito antigas (opcional)
        const dataDate = new Date(savedDate);
        const now = new Date();
        const daysDiff = (now - dataDate) / (1000 * 60 * 60 * 24);
        
        // Se as respostas foram salvas há menos de 30 dias, restaurar
        if (daysDiff < 30) {
            try {
                const respostas = JSON.parse(savedData);
                
                // Restaurar textareas
                if (respostas.familia) document.getElementById('pressaoFamilia').value = respostas.familia;
                if (respostas.amigos) document.getElementById('pressaoAmigos').value = respostas.amigos;
                if (respostas.sociedade) document.getElementById('pressaoSociedade').value = respostas.sociedade;
                if (respostas.autopressao) document.getElementById('pressaoAutopressao').value = respostas.autopressao;
                
                // Restaurar seleção final
                if (respostas.pressaoFinal) {
                    const radioButton = document.getElementById(respostas.pressaoFinal + 'Final');
                    if (radioButton) {
                        radioButton.checked = true;
                    }
                }
            } catch (e) {
                console.log('Erro ao restaurar dados da seção pressão de quem:', e);
            }
        }
    }
}

// ===== FUNCIONALIDADES DA SEÇÃO O CAMINHO É SEU =====

// Função para lidar com a seção "O Caminho é Seu"
function handleCaminhoSeu() {
    const salvarBtn = document.getElementById('salvarCaminho');
    const textareas = document.querySelectorAll('.ponto-conteudo textarea');
    const pontosInteresse = document.querySelectorAll('.ponto-interesse');
    
    // Salvar respostas quando o botão for clicado
    if (salvarBtn) {
        salvarBtn.addEventListener('click', function() {
            const respostas = {
                primeiroPasso: document.getElementById('primeiroPasso').value,
                obstaculos: document.getElementById('obstaculos').value,
                ferramentas: document.getElementById('ferramentas').value,
                objetivo: document.getElementById('objetivo').value
            };
            
            // Salvar no localStorage
            localStorage.setItem('caminhoSeuRespostas', JSON.stringify(respostas));
            localStorage.setItem('caminhoSeuData', new Date().toISOString());
            
            // Feedback visual
            showCaminhoSeuConfetti(this);
            
            // Mudar texto do botão temporariamente
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">Caminho Salvo!</span>';
            this.style.background = 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)';
            
            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }, 2000);
        });
    }
    
    // Auto-salvar quando o usuário digita nos textareas
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            const respostas = {
                primeiroPasso: document.getElementById('primeiroPasso').value,
                obstaculos: document.getElementById('obstaculos').value,
                ferramentas: document.getElementById('ferramentas').value,
                objetivo: document.getElementById('objetivo').value
            };
            
            localStorage.setItem('caminhoSeuRespostas', JSON.stringify(respostas));
        });
    });
    
    // Interação com pontos da estrada SVG
    pontosInteresse.forEach(ponto => {
        ponto.addEventListener('click', function() {
            const pontoData = this.getAttribute('data-ponto');
            const pontoInteracao = document.querySelector(`[data-ponto="${pontoData}"]`);
            
            if (pontoInteracao) {
                // Scroll suave para o ponto de interação
                pontoInteracao.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
                
                // Destacar o ponto de interação
                pontoInteracao.style.transform = 'scale(1.05)';
                pontoInteracao.style.boxShadow = 'var(--shadow-lg)';
                
                setTimeout(() => {
                    pontoInteracao.style.transform = 'scale(1)';
                    pontoInteracao.style.boxShadow = 'var(--shadow-md)';
                }, 1000);
            }
        });
    });
}

// Função para mostrar confete na seção caminho é seu
function showCaminhoSeuConfetti(element) {
    for (let i = 0; i < 10; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.backgroundColor = ['#667eea', '#764ba2', '#4ecdc4', '#ff6b6b', '#ffd93d', '#96ceb4'][Math.floor(Math.random() * 6)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        
        const rect = element.getBoundingClientRect();
        confetti.style.left = (rect.left + Math.random() * rect.width) + 'px';
        confetti.style.top = (rect.top + Math.random() * rect.height) + 'px';
        
        document.body.appendChild(confetti);
        
        confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(-80px) rotate(720deg)`, opacity: 0 }
        ], {
            duration: 2000,
            easing: 'ease-out'
        }).onfinish = () => {
            confetti.remove();
        };
    }
}

// Função para restaurar respostas salvas da seção caminho é seu
function restoreCaminhoSeu() {
    const savedData = localStorage.getItem('caminhoSeuRespostas');
    const savedDate = localStorage.getItem('caminhoSeuData');
    
    if (savedData && savedDate) {
        // Verificar se as respostas não são muito antigas (opcional)
        const dataDate = new Date(savedDate);
        const now = new Date();
        const daysDiff = (now - dataDate) / (1000 * 60 * 60 * 24);
        
        // Se as respostas foram salvas há menos de 30 dias, restaurar
        if (daysDiff < 30) {
            try {
                const respostas = JSON.parse(savedData);
                
                // Restaurar textareas
                if (respostas.primeiroPasso) document.getElementById('primeiroPasso').value = respostas.primeiroPasso;
                if (respostas.obstaculos) document.getElementById('obstaculos').value = respostas.obstaculos;
                if (respostas.ferramentas) document.getElementById('ferramentas').value = respostas.ferramentas;
                if (respostas.objetivo) document.getElementById('objetivo').value = respostas.objetivo;
            } catch (e) {
                console.log('Erro ao restaurar dados da seção caminho é seu:', e);
            }
        }
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidades da mochila
    handleMochilaSelection();
    restoreMochilaChoice();
    
    // Inicializar funcionalidades da seção pressão de quem
    handlePressaoQuem();
    restorePressaoQuem();
    
    // Inicializar funcionalidades da seção caminho é seu
    handleCaminhoSeu();
    restoreCaminhoSeu();
    
    // Inicializar funcionalidade de expandir/colapsar referências
    initReferencesToggle();
});

// Função para inicializar o toggle das referências
function initReferencesToggle() {
    const toggleBtn = document.querySelector('.references-toggle-btn');
    const referencesContent = document.querySelector('.references-content');
    
    if (toggleBtn && referencesContent) {
        toggleBtn.addEventListener('click', function() {
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            const icon = toggleBtn.querySelector('.toggle-icon');
            
            if (isExpanded) {
                // Colapsar
                referencesContent.classList.remove('expanded');
                referencesContent.style.maxHeight = referencesContent.scrollHeight + 'px';
                // Força um reflow
                referencesContent.offsetHeight;
                referencesContent.style.maxHeight = '0';
                referencesContent.style.opacity = '0';
                referencesContent.style.gap = '0';
                toggleBtn.setAttribute('aria-expanded', 'false');
                icon.textContent = '▼';
            } else {
                // Expandir
                // Primeiro, remover max-height para poder calcular a altura real
                referencesContent.style.maxHeight = 'none';
                referencesContent.style.opacity = '1';
                referencesContent.style.gap = '25px';
                const height = referencesContent.scrollHeight;
                // Resetar para 0 para começar a animação
                referencesContent.style.maxHeight = '0';
                referencesContent.style.opacity = '0';
                referencesContent.style.gap = '0';
                // Força um reflow
                referencesContent.offsetHeight;
                // Agora animar para uma altura maior que a real para garantir que não corte
                setTimeout(function() {
                    referencesContent.style.maxHeight = (height + 100) + 'px';
                    referencesContent.style.opacity = '1';
                    referencesContent.style.gap = '25px';
                }, 10);
                // Após a animação, remover o max-height para permitir crescimento natural
                setTimeout(function() {
                    if (toggleBtn.getAttribute('aria-expanded') === 'true') {
                        referencesContent.classList.add('expanded');
                        referencesContent.style.maxHeight = 'none';
                    }
                }, 600);
                toggleBtn.setAttribute('aria-expanded', 'true');
                icon.textContent = '▲';
            }
        });
    }
}
