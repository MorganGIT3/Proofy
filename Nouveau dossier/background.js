// Service Worker pour l'extension Proofy

// Installation de l'extension
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension Proofy installée');
    
    // Initialiser le storage
    chrome.storage.local.set({
      modifications: []
    });
  } else if (details.reason === 'update') {
    console.log('Extension Proofy mise à jour');
  }
});

// Écouter les messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'elementSelected') {
    // Transmettre au popup si ouvert
    chrome.runtime.sendMessage(message).catch(() => {
      // Popup pas ouvert, ignorer l'erreur
    });
  }
  
  return true;
});

// Rafraîchir les modifications périodiquement
chrome.alarms.create('refreshModifications', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'refreshModifications') {
    // Vérifier et réappliquer les modifications si nécessaire
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        if (tab.url && !tab.url.startsWith('chrome://')) {
          chrome.tabs.sendMessage(tab.id, {
            action: 'refreshModifications'
          }).catch(() => {
            // Tab ne supporte pas les content scripts, ignorer
          });
        }
      });
    });
  }
});







