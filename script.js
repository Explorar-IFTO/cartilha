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
                
                selectedText.textContent = `${emoji} ${label}`;
                selectedDisplay.style.display = 'block';
                
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
        
        const inputs = [wordInput, feelingInput, doubtInput];
        
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
        
        const word = wordInput.value.trim();
        const feeling = feelingInput.value.trim();
        const doubt = doubtInput.value.trim();
        
        if (word && feeling && doubt) {
            document.getElementById('summaryWord').textContent = word;
            document.getElementById('summaryFeeling').textContent = feeling;
            document.getElementById('summaryDoubt').textContent = doubt;
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
                document.getElementById('selectedEmojiText').textContent = `${emojiData.emoji} ${emojiData.label}`;
                document.getElementById('selectedEmojiDisplay').style.display = 'block';
            }
        }
        
        // Carrega inputs de reflexão
        if (responses.wordInput) {
            document.getElementById('wordInput').value = responses.wordInput;
        }
        if (responses.feelingInput) {
            document.getElementById('feelingInput').value = responses.feelingInput;
        }
        if (responses.doubtInput) {
            document.getElementById('doubtInput').value = responses.doubtInput;
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
    }
    
    hideZoomModal() {
        const zoomModal = document.getElementById('zoomModal');
        if (zoomModal) {
            zoomModal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // Remove listener do ESC
            if (this.escapeListener) {
                document.removeEventListener('keydown', this.escapeListener);
                this.escapeListener = null;
            }
        }
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
        
        // Atualiza o cabeçalho do modal
        modalIcon.textContent = circleData.icon;
        modalTitle.textContent = circleData.title;
        
        // Cria o conteúdo do modal
        modalBody.innerHTML = this.createCompassModalContent(circleData);
        
        // Mostra o modal
        modal.classList.add('active');
        
        // Previne scroll após mostrar o modal
        setTimeout(() => {
            document.body.style.overflow = 'hidden';
        }, 10);
        
        // Foca no primeiro input
        setTimeout(() => {
            const firstInput = modalBody.querySelector('textarea');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
        
        // Adiciona listeners para os inputs
        this.setupCompassModalInputs();
    }
    
    closeCompassModal() {
        const modal = document.getElementById('compassModal');
        if (modal) {
            modal.classList.remove('active');
            
            // Restaura o scroll do body
            document.body.style.overflow = '';
            
            // Mantém a seleção e posição da agulha
            if (this.currentSelectedCircle) {
                const needle = document.getElementById('compassNeedle');
                const direction = parseInt(this.currentSelectedCircle.dataset.direction);
                this.rotateNeedle(needle, direction);
            }
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
        return circleData.inputs.map(input => `
            <div class="compass-modal-input">
                <label for="${input.id}">${input.label}</label>
                <textarea 
                    id="${input.id}" 
                    placeholder="${input.placeholder}" 
                    maxlength="${input.maxlength}"
                ></textarea>
            </div>
        `).join('');
    }
    
    setupCompassModalInputs() {
        const inputs = document.querySelectorAll('.compass-modal-input textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveCompassResponse(input.id, input.value);
                this.checkAndShowSummary();
            });
            
            input.addEventListener('blur', () => {
                this.saveCompassResponse(input.id, input.value);
                this.checkAndShowSummary();
            });
        });
    }
    
    checkAndShowSummary() {
        const responses = this.getStoredCompassResponses();
        const summary = document.getElementById('compassSummary');
        const summaryContent = document.getElementById('compassSummaryContent');
        
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
        this.draggedElement = null;
        this.init();
    }
    
    init() {
        this.setupDragAndDrop();
        this.setupReflectionInputs();
        this.loadSavedValues();
    }
    
    setupDragAndDrop() {
        const valueItems = document.querySelectorAll('.value-item');
        const podiumValues = document.querySelectorAll('.podium-value');
        
        // Configura drag para os itens de valor
        valueItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedElement = item;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', item.outerHTML);
            });
            
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                this.draggedElement = null;
            });
            
            // Adiciona funcionalidade de clique como alternativa
            item.addEventListener('click', () => {
                if (!item.classList.contains('used')) {
                    this.showValueSelectionModal(item);
                }
            });
        });
        
        // Configura drop para os lugares do pódio
        podiumValues.forEach(podium => {
            podium.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                podium.classList.add('drag-over');
            });
            
            podium.addEventListener('dragleave', () => {
                podium.classList.remove('drag-over');
            });
            
            podium.addEventListener('drop', (e) => {
                e.preventDefault();
                podium.classList.remove('drag-over');
                
                if (this.draggedElement && !podium.dataset.valueId) {
                    this.placeValueOnPodium(podium, this.draggedElement);
                }
            });
            
            // Adiciona funcionalidade de clique no pódio
            podium.addEventListener('click', () => {
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
        
        // Remove placeholder
        podium.innerHTML = '';
        
        // Adiciona o valor
        podium.innerHTML = `<span>${valueText}</span>`;
        podium.dataset.valueId = valueId;
        podium.classList.add('occupied');
        
        // Marca o item como usado
        valueItem.classList.add('used');
        valueItem.draggable = false;
        
        // Salva no localStorage
        this.saveValuesToStorage();
        
        // Verifica se deve mostrar o resumo
        this.checkAndShowSummary();
    }
    
    removeValueFromPodium(podium) {
        const valueId = podium.dataset.valueId;
        
        // Remove o valor do pódio
        podium.innerHTML = '<span class="placeholder">Clique ou arraste aqui</span>';
        podium.dataset.valueId = '';
        podium.classList.remove('occupied');
        
        // Libera o item original
        const originalItem = document.querySelector(`.value-item[data-value="${valueId}"]`);
        if (originalItem) {
            originalItem.classList.remove('used');
            originalItem.draggable = true;
        }
        
        // Salva no localStorage
        this.saveValuesToStorage();
        
        // Verifica se deve mostrar o resumo
        this.checkAndShowSummary();
    }
    
    showValueSelectionModal(clickedItem) {
        const availablePodiums = document.querySelectorAll('.podium-value:not([data-value-id])');
        
        if (availablePodiums.length === 0) {
            alert('Todos os lugares do pódio já estão ocupados!');
            return;
        }
        
        // Cria modal simples para seleção
        const modal = document.createElement('div');
        modal.className = 'value-selection-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Escolha a posição no pódio:</h3>
                <div class="podium-options">
                    ${Array.from(availablePodiums).map(podium => {
                        const place = podium.closest('.podium-place').dataset.place;
                        const medal = place === '1' ? '🥇' : place === '2' ? '🥈' : '🥉';
                        return `<button class="podium-option" data-place="${place}">
                            ${medal} ${place}º lugar
                        </button>`;
                    }).join('')}
                </div>
                <button class="close-modal">Cancelar</button>
            </div>
        `;
        
        // Adiciona estilos inline
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const content = modal.querySelector('.modal-content');
        content.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 15px;
            border: 3px solid #000;
            box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(modal);
        
        // Adiciona eventos
        modal.querySelectorAll('.podium-option').forEach(option => {
            option.addEventListener('click', () => {
                const place = option.dataset.place;
                const targetPodium = document.querySelector(`.podium-place[data-place="${place}"] .podium-value`);
                this.placeValueOnPodium(targetPodium, clickedItem);
                document.body.removeChild(modal);
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
    }
    
    showPodiumSelectionModal(podium) {
        const availableValues = document.querySelectorAll('.value-item:not(.used)');
        
        if (availableValues.length === 0) {
            alert('Todos os valores já foram selecionados!');
            return;
        }
        
        // Cria modal simples para seleção
        const modal = document.createElement('div');
        modal.className = 'value-selection-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Escolha um valor:</h3>
                <div class="value-options">
                    ${Array.from(availableValues).map(item => {
                        const valueText = item.querySelector('span').textContent;
                        return `<button class="value-option" data-value="${item.dataset.value}">
                            ${valueText}
                        </button>`;
                    }).join('')}
                </div>
                <button class="close-modal">Cancelar</button>
            </div>
        `;
        
        // Adiciona estilos inline
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;
        
        const content = modal.querySelector('.modal-content');
        content.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 15px;
            border: 3px solid #000;
            box-shadow: 6px 6px 0px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 90%;
            text-align: center;
        `;
        
        document.body.appendChild(modal);
        
        // Adiciona eventos
        modal.querySelectorAll('.value-option').forEach(option => {
            option.addEventListener('click', () => {
                const valueId = option.dataset.value;
                const targetItem = document.querySelector(`.value-item[data-value="${valueId}"]`);
                this.placeValueOnPodium(podium, targetItem);
                document.body.removeChild(modal);
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
        const podiumValues = document.querySelectorAll('.podium-value[data-value-id]');
        const summary = document.getElementById('valuesSummary');
        const summaryContent = document.getElementById('valuesSummaryContent');
        
        if (podiumValues.length >= 3) {
            this.generateSummary(summaryContent);
            summary.style.display = 'block';
        } else {
            summary.style.display = 'none';
        }
    }
    
    generateSummary(container) {
        const podiumValues = document.querySelectorAll('.podium-value[data-value-id]');
        const summaryData = [];
        
        podiumValues.forEach((podium, index) => {
            const place = podium.closest('.podium-place').dataset.place;
            const valueText = podium.querySelector('span').textContent;
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
        const podiumValues = document.querySelectorAll('.podium-value[data-value-id]');
        const values = {};
        
        podiumValues.forEach(podium => {
            const place = podium.closest('.podium-place').dataset.place;
            const valueId = podium.dataset.valueId;
            const valueText = podium.querySelector('span').textContent;
            
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
                const podium = document.querySelector(`.podium-place[data-place="${place}"] .podium-value`);
                const valueData = stored.podium[place];
                
                if (podium && valueData) {
                    podium.innerHTML = `<span>${valueData.text}</span>`;
                    podium.dataset.valueId = valueData.id;
                    podium.classList.add('occupied');
                    
                    // Marca o item original como usado
                    const originalItem = document.querySelector(`.value-item[data-value="${valueData.id}"]`);
                    if (originalItem) {
                        originalItem.classList.add('used');
                        originalItem.draggable = false;
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
}

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new CartilhaNavigator();
    new VisualEffects();
    new AutoconhecimentoInteractions();
    new EnergyMapInteractions();
    new CompassInteractions();
    new ValuesInteractions();
    
    // Adiciona instruções de navegação
    console.log('📚 Cartilha Digital - Navegação:');
    console.log('→ Seta direita ou Espaço: Próxima página');
    console.log('← Seta esquerda: Página anterior');
    console.log('Esc: Voltar ao menu principal');
    console.log('🖱️ Use as setinhas ou clique nos indicadores para navegar!');
    console.log('Clique nos cards para explorar os tópicos!');
    console.log('💾 Suas respostas são salvas automaticamente no navegador!');
});

// Adiciona efeito de loading na página
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});
