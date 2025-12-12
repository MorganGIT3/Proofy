// État de l'extension
let currentMode = 'select'; // 'select' ou 'edit'
let selectedElement = null;
let currentSelector = '';

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
  initializeEventListeners();
  loadModifications();
  checkCurrentTab();
});

// Vérifier si on est sur une page valide
async function checkCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
    showStatus('Cette extension ne fonctionne que sur les pages web', 'error');
    disableAll();
  }
}

// Initialiser les event listeners
function initializeEventListeners() {
  // Mode toggle
  document.getElementById('selectMode').addEventListener('click', () => switchMode('select'));
  document.getElementById('editMode').addEventListener('click', () => switchMode('edit'));

  // Selector input
  document.getElementById('selector').addEventListener('input', handleSelectorChange);
  document.getElementById('clearSelector').addEventListener('click', clearSelector);

  // Modification type
  document.getElementById('modificationType').addEventListener('change', handleTypeChange);

  // New value
  document.getElementById('newValue').addEventListener('input', handleValueChange);

  // Buttons
  document.getElementById('applyBtn').addEventListener('click', applyModification);
  document.getElementById('previewBtn').addEventListener('click', previewValue);
  document.getElementById('clearAllBtn').addEventListener('click', clearAllModifications);

  // Écouter les messages du content script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'elementSelected') {
      handleElementSelected(message.selector, message.value);
    }
  });
}

// Changer de mode
async function switchMode(mode) {
  currentMode = mode;
  
  document.getElementById('selectMode').classList.toggle('active', mode === 'select');
  document.getElementById('editMode').classList.toggle('active', mode === 'edit');

  if (mode === 'select') {
    await enableSelectionMode();
  } else {
    await enableEditMode();
  }
}

// Activer le mode sélection
async function enableSelectionMode() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, {
    action: 'enableSelectionMode'
  });

  showStatus('Cliquez sur un élément de la page pour le sélectionner', 'info');
}

// Activer le mode édition
async function enableEditMode() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, {
    action: 'disableSelectionMode'
  });
}

// Gérer le changement de sélecteur
function handleSelectorChange(e) {
  currentSelector = e.target.value;
  const hasSelector = currentSelector.trim().length > 0;
  
  document.getElementById('previewBtn').disabled = !hasSelector;
  document.getElementById('applyBtn').disabled = !hasSelector || !document.getElementById('newValue').value.trim();
}

// Effacer le sélecteur
function clearSelector() {
  document.getElementById('selector').value = '';
  currentSelector = '';
  selectedElement = null;
  document.getElementById('currentValueSection').style.display = 'none';
  document.getElementById('editSection').style.display = 'none';
  document.getElementById('newValueSection').style.display = 'none';
  document.getElementById('previewBtn').disabled = true;
  document.getElementById('applyBtn').disabled = true;
}

// Gérer la sélection d'un élément
function handleElementSelected(selector, value) {
  currentSelector = selector;
  selectedElement = { selector, value };
  
  document.getElementById('selector').value = selector;
  document.getElementById('currentValue').textContent = value || '(vide)';
  document.getElementById('currentValueSection').style.display = 'block';
  document.getElementById('editSection').style.display = 'block';
  document.getElementById('newValueSection').style.display = 'block';
  document.getElementById('previewBtn').disabled = false;
  
  // Déterminer le type automatiquement
  detectModificationType();
}

// Détecter le type de modification
async function detectModificationType() {
  if (!currentSelector) return;
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, {
    action: 'detectElementType',
    selector: currentSelector
  }, (response) => {
    if (response && response.type) {
      document.getElementById('modificationType').value = response.type;
      handleTypeChange();
    }
  });
}

// Gérer le changement de type
function handleTypeChange() {
  const type = document.getElementById('modificationType').value;
  const hint = document.getElementById('valueHint');
  
  switch(type) {
    case 'text':
      hint.textContent = 'Modifie le texte visible de l\'élément';
      break;
    case 'html':
      hint.textContent = 'Modifie le contenu HTML de l\'élément';
      break;
    case 'value':
      hint.textContent = 'Modifie la valeur d\'un input/textarea';
      break;
    case 'number':
      hint.textContent = 'Modifie une valeur numérique';
      break;
    case 'style':
      hint.textContent = 'Format: propriété:valeur (ex: color:red, fontSize:20px)';
      break;
  }
}

// Gérer le changement de valeur
function handleValueChange(e) {
  const hasValue = e.target.value.trim().length > 0;
  document.getElementById('applyBtn').disabled = !hasValue || !currentSelector;
}

// Aperçu de la valeur actuelle
async function previewValue() {
  if (!currentSelector) return;
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, {
    action: 'getElementValue',
    selector: currentSelector
  }, (response) => {
    if (response && response.value !== null) {
      document.getElementById('newValue').value = response.value;
      document.getElementById('currentValue').textContent = response.value || '(vide)';
      showStatus('Valeur actuelle chargée', 'success');
    } else {
      showStatus('Élément non trouvé sur la page', 'error');
    }
  });
}

// Appliquer la modification
async function applyModification() {
  const selector = currentSelector;
  const type = document.getElementById('modificationType').value;
  const value = document.getElementById('newValue').value.trim();
  
  if (!selector || !value) {
    showStatus('Veuillez remplir tous les champs', 'error');
    return;
  }
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, {
    action: 'applyModification',
    selector: selector,
    value: value,
    type: type
  }, (response) => {
    if (response && response.success) {
      showStatus('Modification appliquée !', 'success');
      saveModification(selector, value, type);
      loadModifications();
      
      // Réinitialiser les champs
      document.getElementById('newValue').value = '';
      document.getElementById('applyBtn').disabled = true;
    } else {
      showStatus('Erreur lors de l\'application', 'error');
    }
  });
}

// Sauvegarder la modification
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

// Charger les modifications
function loadModifications() {
  chrome.storage.local.get(['modifications'], (result) => {
    const modifications = result.modifications || [];
    const list = document.getElementById('modificationsList');
    
    if (modifications.length === 0) {
      list.innerHTML = '<div class="empty-state">Aucune modification</div>';
      return;
    }
    
    list.innerHTML = modifications.map((mod, index) => `
      <div class="modification-item">
        <div class="modification-info">
          <div class="modification-selector" title="${mod.selector}">${mod.selector}</div>
          <div class="modification-value" title="${mod.value}">${mod.value}</div>
        </div>
        <div class="modification-actions">
          <button class="modification-btn" onclick="loadModification(${index})" title="Charger">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          <button class="modification-btn delete" onclick="removeModification(${index})" title="Supprimer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    `).join('');
  });
}

// Charger une modification
window.loadModification = function(index) {
  chrome.storage.local.get(['modifications'], (result) => {
    const mod = result.modifications[index];
    if (mod) {
      document.getElementById('selector').value = mod.selector;
      document.getElementById('modificationType').value = mod.type;
      document.getElementById('newValue').value = mod.value;
      currentSelector = mod.selector;
      handleSelectorChange({ target: { value: mod.selector } });
      handleValueChange({ target: { value: mod.value } });
      showStatus('Modification chargée', 'success');
    }
  });
};

// Supprimer une modification
window.removeModification = function(index) {
  chrome.storage.local.get(['modifications'], (result) => {
    const modifications = result.modifications || [];
    modifications.splice(index, 1);
    chrome.storage.local.set({ modifications }, () => {
      loadModifications();
      showStatus('Modification supprimée', 'success');
    });
  });
};

// Effacer toutes les modifications
function clearAllModifications() {
  if (confirm('Voulez-vous vraiment supprimer toutes les modifications ?')) {
    chrome.storage.local.set({ modifications: [] }, () => {
      loadModifications();
      showStatus('Toutes les modifications ont été supprimées', 'success');
    });
  }
}

// Désactiver tout
function disableAll() {
  document.getElementById('applyBtn').disabled = true;
  document.getElementById('previewBtn').disabled = true;
}

// Afficher un message de statut
function showStatus(message, type = 'info') {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = `status ${type} show`;
  
  setTimeout(() => {
    status.classList.remove('show');
  }, 3000);
}

