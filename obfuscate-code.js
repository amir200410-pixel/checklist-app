// Code Obfuscation Script
// This script will make the code harder to read and copy

const obfuscateCode = () => {
    // Replace readable variable names with random strings
    const variableMap = {
        'items': '_0x1a2b3c',
        'addItem': '_0x4d5e6f',
        'toggleItem': '_0x7g8h9i',
        'deleteItem': '_0x0j1k2l',
        'clearAll': '_0x3m4n5o',
        'render': '_0x6p7q8r',
        'updateStats': '_0x9s0t1u',
        'showShareModal': '_0x2v3w4x',
        'hideShareModal': '_0x5y6z7a',
        'copyShareLink': '_0x8b9c0d',
        'shareViaWhatsApp': '_0x1e2f3g',
        'shareViaEmail': '_0x4h5i6j',
        'loadFromLocalStorage': '_0x7k8l9m',
        'saveToLocalStorage': '_0x0n1o2p',
        'loadFromURL': '_0x3q4r5s',
        'showToast': '_0x6t7u8v',
        'escapeHtml': '_0x9w0x1y',
        'checkAuth': '_0x2z3a4b',
        'init': '_0x5c6d7e',
        'setupEventListeners': '_0x8f9g0h',
        'setupMobileFeatures': '_0x1i2j3k',
        'addHapticFeedback': '_0x4l5m6n',
        'handleInstallPrompt': '_0x7o8p9q',
        'showInstallPrompt': '_0x0r1s2t',
        'logout': '_0x3u4v5w',
        'showPasswordModal': '_0x6x7y8z',
        'hidePasswordModal': '_0x9a0b1c',
        'changePassword': '_0x2d3e4f',
        'openFamilyDashboard': '_0x5g6h7i'
    };

    // Add copyright protection
    const copyrightHeader = `
    /*
     * Copyright (c) 2024 אמיר אברהם (Amir Abraham)
     * Commercial License - All rights reserved
     * Unauthorized copying, modification, or distribution is prohibited
     * Contact: amir200410@gmail.com for licensing
     * 
     * This code is protected by commercial license
     * Any commercial use requires payment and written permission
     */
    `;

    // Add anti-debugging protection
    const antiDebugCode = `
    (function(){
        // Anti-debugging protection
        const start = new Date();
        debugger;
        const end = new Date();
        if(end - start > 100) {
            // Debugger detected - redirect to error page
            window.location.href = 'error.html';
        }
        
        // Disable right-click
        document.addEventListener('contextmenu', e => e.preventDefault());
        
        // Disable F12, Ctrl+Shift+I, Ctrl+U
        document.addEventListener('keydown', e => {
            if(e.key === 'F12' || 
               (e.ctrlKey && e.shiftKey && e.key === 'I') ||
               (e.ctrlKey && e.key === 'u')) {
                e.preventDefault();
                return false;
            }
        });
        
        // Disable view source
        document.addEventListener('keydown', e => {
            if(e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                return false;
            }
        });
    })();
    `;

    return {
        copyrightHeader,
        antiDebugCode,
        variableMap
    };
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = obfuscateCode;
} 