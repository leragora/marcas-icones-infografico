// Objeto para armazenar as instâncias das animações Lottie
const lottieAnimations = {};

// Função para carregar e retornar uma instância de animação Lottie
function createLottieAnimation(containerId, animationPath) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Contêiner com ID '${containerId}' não encontrado.`);
    return null;
  }

  // Se a animação já foi carregada para este contêiner, retorna a instância existente
  if (lottieAnimations[containerId]) {
    return lottieAnimations[containerId];
  }

  const animation = lottie.loadAnimation({
    container: container,
    renderer: 'svg', // 'svg', 'canvas' ou 'html'
    loop: false, // Queremos controlar o loop manualmente se necessário
    autoplay: false, // NÃO queremos que a animação toque automaticamente ao carregar
    path: animationPath
  });

  animation.addEventListener('DOMLoaded', function() {
    console.log(`Animação Lottie para '${containerId}' carregada com sucesso!`);
  });

  animation.addEventListener('error', function(error) {
    console.error(`Erro ao carregar a animação para '${containerId}':`, error);
  });

  lottieAnimations[containerId] = animation; // Armazena a instância
  return animation;
}

// Configuração das animações
// Adapte os 'containerId' para os IDs reais dos elementos dentro de cada estado
// e os 'path' para os caminhos reais dos seus arquivos JSON.
// Removida a entrada para 'empty', já que não há animação nesse estado.
const animationConfigs = {
  'graf-01': { // ALTERADO: de 'anima01' para 'graf-01' para corresponder ao name do HTML
    containerId: 'item5837',
    path: './assets/graf-01.json'
  },
  'graf-faixa': { // ALTERADO: de 'anima02' para 'graf-faixa'
    containerId: 'item5838',
    path: './assets/graf-faixa.json'
  },
  'graf-trabalho': { // ALTERADO: de 'anima03' para 'graf-trabalho'
    containerId: 'item5839',
    path: './assets/graf-trabalho.json'
  },
  'graf-escola': { // ALTERADO: de 'anima04' para 'graf-escola'
    containerId: 'item5842',
    path: './assets/graf-escola.json'
  },
  'graf-religiao': { // ALTERADO: de 'anima05' para 'graf-religiao'
    containerId: 'item5844',
    path: './assets/graf-religiao.json'
  },
  'graf-moradia': { // ALTERADO: de 'anima06' para 'graf-moradia'
    containerId: 'item5847',
    path: './assets/graf-moradia.json'
  },
  'graf-classe': { // ALTERADO: de 'anima07' para 'graf-classe'
    containerId: 'item5849',
    path: './assets/graf-classe.json'
  }
};

// Função para ativar/desativar animações com base no estado ativo
function handleMultiStateChange() {
  const multiStateElement = document.getElementById('item5851');
  if (!multiStateElement) return;

  const states = multiStateElement.querySelectorAll('.pageItem.state');

  states.forEach(state => {
    const isActive = state.classList.contains('active') && state.getAttribute('aria-hidden') === 'false';
    const stateName = state.getAttribute('name');
    const config = animationConfigs[stateName]; // Tenta encontrar a configuração para o nome do estado

    if (config) { // Só procede se houver uma configuração de animação para este estado
      const animation = createLottieAnimation(config.containerId, config.path);

      if (animation) {
        if (isActive) {
          animation.play(); // Inicia a animação
        } else {
          animation.stop(); // Para e reseta a animação quando o estado não está ativo
        }
      }
    }
    // Se não houver 'config' para o stateName (como para 'empty'), ele simplesmente ignora.
  });
}

// Observador de mutação para detectar mudanças no atributo 'aria-hidden' ou na classe 'active'
document.addEventListener('DOMContentLoaded', function() {
  const slideshow = document.getElementById('item5851');
  if (slideshow) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && (mutation.attributeName === 'aria-hidden' || mutation.attributeName === 'class')) {
          const targetElement = mutation.target;
          if (targetElement.classList.contains('state')) {
            handleMultiStateChange();
          }
        }
      });
    });

    observer.observe(slideshow, {
      attributes: true, // Observar mudanças nos atributos
      subtree: true,    // Observar também os filhos dos filhos
      attributeFilter: ['aria-hidden', 'class'] // Filtrar apenas os atributos que nos interessam
    });

    // Chamar a função inicialmente para o estado ativo padrão
    handleMultiStateChange();
  }
});