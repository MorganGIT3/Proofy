// État du script
let selectionMode = false;
let hoveredElement = null;
let selectedElement = null;

// Restaurer les modifications au chargement
chrome.storage.local.get(['modifications'], (result) => {
  if (result.modifications && result.modifications.length > 0) {
    setTimeout(() => {
      applyAllModifications(result.modifications);
    }, 500); // Attendre que la page soit chargée
  }
});

// Écouter les messages du popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch(request.action) {
    case 'enableSelectionMode':
      enableSelectionMode();
      sendResponse({ success: true });
      break;
      
    case 'disableSelectionMode':
      disableSelectionMode();
      sendResponse({ success: true });
      break;
      
    case 'applyModification':
      applyModification(request.selector, request.value, request.type);
      saveModification(request.selector, request.value, request.type);
      sendResponse({ success: true });
      break;
      
    case 'getElementValue':
      const element = document.querySelector(request.selector);
      sendResponse({ 
        value: element ? getElementValue(element) : null 
      });
      break;
      
    case 'detectElementType':
      const el = document.querySelector(request.selector);
      sendResponse({ 
        type: el ? detectElementType(el) : 'text' 
      });
      break;
  }
  
  return true; // Pour permettre la réponse asynchrone
});

// Activer le mode sélection
function enableSelectionMode() {
  selectionMode = true;
  document.body.style.cursor = 'crosshair';
  
  // Ajouter les styles de sélection
  if (!document.getElementById('proofy-selection-styles')) {
    const style = document.createElement('style');
    style.id = 'proofy-selection-styles';
    style.textContent = `
      .proofy-hover-highlight {
        outline: 2px solid #4a9eff !important;
        outline-offset: 2px !important;
        background: rgba(74, 158, 255, 0.1) !important;
        cursor: crosshair !important;
      }
      .proofy-selected-highlight {
        outline: 2px solid #5ae87f !important;
        outline-offset: 2px !important;
        background: rgba(90, 232, 127, 0.15) !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Ajouter les event listeners
  document.addEventListener('mouseover', handleMouseOver, true);
  document.addEventListener('mouseout', handleMouseOut, true);
  document.addEventListener('click', handleElementClick, true);
}

// Désactiver le mode sélection
function disableSelectionMode() {
  selectionMode = false;
  document.body.style.cursor = '';
  
  // Retirer les highlights
  document.querySelectorAll('.proofy-hover-highlight, .proofy-selected-highlight').forEach(el => {
    el.classList.remove('proofy-hover-highlight', 'proofy-selected-highlight');
  });
  
  // Retirer les event listeners
  document.removeEventListener('mouseover', handleMouseOver, true);
  document.removeEventListener('mouseout', handleMouseOut, true);
  document.removeEventListener('click', handleElementClick, true);
}

// Gérer le survol
function handleMouseOver(e) {
  if (!selectionMode) return;
  e.stopPropagation();
  
  hoveredElement = e.target;
  hoveredElement.classList.add('proofy-hover-highlight');
}

// Gérer la sortie du survol
function handleMouseOut(e) {
  if (!selectionMode) return;
  e.stopPropagation();
  
  if (hoveredElement) {
    hoveredElement.classList.remove('proofy-hover-highlight');
    hoveredElement = null;
  }
}

// Gérer le clic sur un élément
function handleElementClick(e) {
  if (!selectionMode) return;
  e.preventDefault();
  e.stopPropagation();
  
  const element = e.target;
  const selector = generateSelector(element);
  const value = getElementValue(element);
  
  // Retirer tous les highlights précédents
  document.querySelectorAll('.proofy-selected-highlight').forEach(el => {
    el.classList.remove('proofy-selected-highlight');
  });
  
  // Ajouter le highlight à l'élément sélectionné
  element.classList.add('proofy-selected-highlight');
  selectedElement = element;
  
  // Envoyer au popup
  chrome.runtime.sendMessage({
    action: 'elementSelected',
    selector: selector,
    value: value
  });
  
  // Désactiver le mode sélection après sélection
  disableSelectionMode();
}

// Générer un sélecteur CSS unique
function generateSelector(element) {
  if (element.id) {
    return `#${element.id}`;
  }
  
  // Essayer avec des attributs uniques
  if (element.getAttribute('data-testid')) {
    return `[data-testid="${element.getAttribute('data-testid')}"]`;
  }
  
  if (element.className && typeof element.className === 'string') {
    const classes = element.className.split(' ').filter(c => c).slice(0, 2);
    if (classes.length > 0) {
      const classSelector = '.' + classes.join('.');
      if (document.querySelectorAll(classSelector).length === 1) {
        return classSelector;
      }
    }
  }
  
  // Générer un chemin
  const path = [];
  let current = element;
  
  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();
    
    if (current.id) {
      selector += `#${current.id}`;
      path.unshift(selector);
      break;
    }
    
    if (current.className && typeof current.className === 'string') {
      const classes = current.className.split(' ').filter(c => c);
      if (classes.length > 0) {
        selector += '.' + classes[0];
      }
    }
    
    const siblings = Array.from(current.parentElement?.children || []);
    const index = siblings.indexOf(current);
    if (siblings.length > 1) {
      selector += `:nth-child(${index + 1})`;
    }
    
    path.unshift(selector);
    current = current.parentElement;
  }
  
  return path.join(' > ');
}

// Obtenir la valeur d'un élément
function getElementValue(element) {
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
    return element.value;
  }
  return element.textContent?.trim() || element.innerText?.trim() || '';
}

// Détecter le type d'élément
function detectElementType(element) {
  if (element.tagName === 'INPUT') {
    const type = element.type;
    if (type === 'number' || type === 'range') {
      return 'number';
    }
    return 'value';
  }
  
  if (element.tagName === 'TEXTAREA') {
    return 'value';
  }
  
  if (element.hasAttribute('style') || element.style.cssText) {
    return 'style';
  }
  
  if (element.innerHTML !== element.textContent) {
    return 'html';
  }
  
  return 'text';
}

// Appliquer une modification
function applyModification(selector, value, type) {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Élément non trouvé: ${selector}`);
    return false;
  }
  
  try {
    switch(type) {
      case 'text':
        element.textContent = value;
        break;
        
      case 'html':
        element.innerHTML = value;
        break;
        
      case 'value':
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.value = value;
          // Déclencher les events
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
        }
        break;
        
      case 'number':
        if (element.tagName === 'INPUT' && element.type === 'number') {
          element.value = parseFloat(value) || 0;
          element.dispatchEvent(new Event('input', { bubbles: true }));
          element.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
          element.textContent = value;
        }
        break;
        
      case 'style':
        const [prop, val] = value.split(':').map(s => s.trim());
        if (prop && val) {
          element.style[prop] = val;
        }
        break;
    }
    
    // Ajouter un indicateur visuel temporaire
    element.style.transition = 'all 0.3s';
    const originalBg = element.style.backgroundColor;
    element.style.backgroundColor = 'rgba(90, 232, 127, 0.3)';
    setTimeout(() => {
      element.style.backgroundColor = originalBg;
    }, 500);
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'application:', error);
    return false;
  }
}

// Appliquer toutes les modifications
function applyAllModifications(modifications) {
  modifications.forEach(mod => {
    applyModification(mod.selector, mod.value, mod.type);
  });
}

// Sauvegarder une modification
function saveModification(selector, value, type) {
  chrome.storage.local.get(['modifications'], (result) => {
    const modifications = result.modifications || [];
    const existingIndex = modifications.findIndex(m => m.selector === selector);
    
    const modification = {
      selector,
      value,
      type,
      timestamp: Date.now()
    };
    
    if (existingIndex >= 0) {
      modifications[existingIndex] = modification;
    } else {
      modifications.push(modification);
    }
    
    chrome.storage.local.set({ modifications });
  });
}

// Observer les changements de DOM pour réappliquer les modifications
const observer = new MutationObserver((mutations) => {
  chrome.storage.local.get(['modifications'], (result) => {
    if (result.modifications && result.modifications.length > 0) {
      // Vérifier si des éléments modifiés ont été recréés
      result.modifications.forEach(mod => {
        const element = document.querySelector(mod.selector);
        if (element) {
          // Vérifier si la valeur a été réinitialisée
          const currentValue = getElementValue(element);
          if (currentValue !== mod.value) {
            // Réappliquer la modification
            applyModification(mod.selector, mod.value, mod.type);
          }
        }
      });
    }
  });
});

// Démarrer l'observer
observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true
});







