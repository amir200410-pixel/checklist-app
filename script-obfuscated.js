/*
 * Copyright (c) 2024 אמיר אברהם (Amir Abraham)
 * Commercial License - All rights reserved
 * Unauthorized copying, modification, or distribution is prohibited
 * Contact: amir200410@gmail.com for licensing
 * 
 * This code is protected by commercial license
 * Any commercial use requires payment and written permission
 */

(function(){
    // Anti-debugging protection
    const _0x1a2b3c = new Date();
    debugger;
    const _0x4d5e6f = new Date();
    if(_0x4d5e6f - _0x1a2b3c > 100) {
        window.location.href = 'error.html';
    }
    
    // Disable right-click and developer tools
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
        if(e.key === 'F12' || 
           (e.ctrlKey && e.shiftKey && e.key === 'I') ||
           (e.ctrlKey && e.key === 'u')) {
            e.preventDefault();
            return false;
        }
    });
})();

// Obfuscated Checklist App
class _0x7g8h9i {
    constructor() {
        this._0x1a2b3c = [];
        this._0x2z3a4b();
        this._0x5c6d7e();
    }

    _0x2z3a4b() {
        const _0x9w0x1y = sessionStorage.getItem('isLoggedIn');
        if (_0x9w0x1y !== 'true') {
            window.location.href = 'login.html';
            return;
        }
        
        const _0x6t7u8v = parseInt(sessionStorage.getItem('loginTime') || '0');
        const _0x3q4r5s = Date.now();
        const _0x7k8l9m = (_0x3q4r5s - _0x6t7u8v) / (1000 * 60 * 60);
        
        if (_0x7k8l9m > 24) {
            sessionStorage.removeItem('isLoggedIn');
            sessionStorage.removeItem('loginTime');
            window.location.href = 'login.html';
            return;
        }
    }

    _0x5c6d7e() {
        this._0x7k8l9m();
        this._0x3q4r5s();
        this._0x8f9g0h();
        this._0x6p7q8r();
        this._0x9s0t1u();
        this._0x1i2j3k();
    }

    _0x8f9g0h() {
        const _0x4d5e6f = document.getElementById('addBtn');
        const _0x0n1o2p = document.getElementById('newItem');

        _0x4d5e6f.addEventListener('click', () => this._0x4d5e6f());
        _0x0n1o2p.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this._0x4d5e6f();
            }
        });

        document.getElementById('clearBtn').addEventListener('click', () => this._0x3m4n5o());
        document.getElementById('logoutBtn').addEventListener('click', () => this._0x3u4v5w());
        document.getElementById('shareBtn').addEventListener('click', () => this._0x2v3w4x());
        document.getElementById('closeModal').addEventListener('click', () => this._0x5y6z7a());
        document.getElementById('copyLink').addEventListener('click', () => this._0x8b9c0d());
        document.getElementById('shareWhatsApp').addEventListener('click', () => this._0x1e2f3g());
        document.getElementById('shareEmail').addEventListener('click', () => this._0x4h5i6j());
        document.getElementById('changePasswordBtn').addEventListener('click', () => this._0x6x7y8z());
        document.getElementById('closePasswordModal').addEventListener('click', () => this._0x9a0b1c());
        document.getElementById('savePasswordBtn').addEventListener('click', () => this._0x2d3e4f());

        document.getElementById('shareModal').addEventListener('click', (e) => {
            if (e.target.id === 'shareModal') {
                this._0x5y6z7a();
            }
        });

        document.getElementById('passwordModal').addEventListener('click', (e) => {
            if (e.target.id === 'passwordModal') {
                this._0x9a0b1c();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this._0x5y6z7a();
            }
        });
    }

    _0x1i2j3k() {
        let _0x4l5m6n = 0;
        document.addEventListener('touchend', (event) => {
            const _0x7o8p9q = (new Date()).getTime();
            if (_0x7o8p9q - _0x4l5m6n <= 300) {
                event.preventDefault();
            }
            _0x4l5m6n = _0x7o8p9q;
        }, false);

        if ('vibrate' in navigator) {
            document.addEventListener('click', () => {
                navigator.vibrate(50);
            });
        }
    }

    _0x3u4v5w() {
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('loginTime');
        window.location.href = 'login.html';
    }

    _0x6x7y8z() {
        document.getElementById('passwordModal').classList.add('show');
    }

    _0x9a0b1c() {
        document.getElementById('passwordModal').classList.remove('show');
    }

    _0x2d3e4f() {
        const _0x0n1o2p = document.getElementById('currentPassword').value;
        const _0x3q4r5s = document.getElementById('newPassword').value;
        const _0x7k8l9m = document.getElementById('confirmPassword').value;

        if (_0x3q4r5s !== _0x7k8l9m) {
            this._0x6t7u8v('הסיסמאות לא תואמות', 'error');
            return;
        }

        if (_0x3q4r5s.length < 6) {
            this._0x6t7u8v('הסיסמה חייבת להיות לפחות 6 תווים', 'error');
            return;
        }

        // Here you would typically update the password in your backend
        this._0x6t7u8v('הסיסמה שונתה בהצלחה');
        this._0x9a0b1c();
        
        // Clear the form
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    }

    _0x5g6h7i() {
        window.location.href = 'family-dashboard.html';
    }

    _0x4d5e6f() {
        const _0x0n1o2p = document.getElementById('newItem');
        const _0x3q4r5s = _0x0n1o2p.value.trim();
        
        if (_0x3q4r5s === '') return;
        
        const _0x7k8l9m = {
            id: Date.now(),
            text: this._0x9w0x1y(_0x3q4r5s),
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this._0x1a2b3c.push(_0x7k8l9m);
        _0x0n1o2p.value = '';
        
        this._0x0n1o2p();
        this._0x6p7q8r();
        this._0x9s0t1u();
        this._0x4l5m6n();
    }

    _0x7g8h9i(_0x2z3a4b) {
        const _0x5c6d7e = this._0x1a2b3c.find(_0x8f9g0h => _0x8f9g0h.id === _0x2z3a4b);
        if (_0x5c6d7e) {
            _0x5c6d7e.completed = !_0x5c6d7e.completed;
            this._0x0n1o2p();
            this._0x9s0t1u();
            this._0x4l5m6n();
        }
    }

    _0x0j1k2l(_0x2z3a4b) {
        this._0x1a2b3c = this._0x1a2b3c.filter(_0x5c6d7e => _0x5c6d7e.id !== _0x2z3a4b);
        this._0x0n1o2p();
        this._0x6p7q8r();
        this._0x9s0t1u();
    }

    _0x3m4n5o() {
        if (this._0x1a2b3c.length === 0) {
            this._0x6t7u8v('אין פריטים למחיקה');
            return;
        }
        
        if (confirm('האם אתה בטוח שברצונך למחוק את כל הפריטים?')) {
            this._0x1a2b3c = [];
            this._0x0n1o2p();
            this._0x6p7q8r();
            this._0x9s0t1u();
            this._0x6t7u8v('כל הפריטים נמחקו');
        }
    }

    _0x6p7q8r() {
        const _0x2z3a4b = document.getElementById('checklist');
        const _0x5c6d7e = document.getElementById('emptyState');
        
        if (this._0x1a2b3c.length === 0) {
            _0x2z3a4b.style.display = 'none';
            _0x5c6d7e.style.display = 'block';
            return;
        }
        
        _0x2z3a4b.style.display = 'block';
        _0x5c6d7e.style.display = 'none';
        
        _0x2z3a4b.innerHTML = this._0x1a2b3c.map(_0x8f9g0h => `
            <div class="checklist-item ${_0x8f9g0h.completed ? 'completed' : ''}" data-id="${_0x8f9g0h.id}">
                <div class="checkbox ${_0x8f9g0h.completed ? 'checked' : ''}" onclick="app._0x7g8h9i(${_0x8f9g0h.id})">
                    ${_0x8f9g0h.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <span class="item-text">${_0x8f9g0h.text}</span>
                <button class="delete-btn" onclick="app._0x0j1k2l(${_0x8f9g0h.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    _0x9s0t1u() {
        const _0x2z3a4b = this._0x1a2b3c.length;
        const _0x5c6d7e = this._0x1a2b3c.filter(_0x8f9g0h => _0x8f9g0h.completed).length;
        const _0x7k8l9m = _0x2z3a4b > 0 ? Math.round((_0x5c6d7e / _0x2z3a4b) * 100) : 0;
        
        document.getElementById('totalItems').textContent = _0x2z3a4b;
        document.getElementById('completedItems').textContent = _0x5c6d7e;
        document.getElementById('progressPercent').textContent = _0x7k8l9m + '%';
    }

    _0x2v3w4x() {
        const _0x2z3a4b = document.getElementById('shareModal');
        _0x2z3a4b.classList.add('show');
        
        const _0x5c6d7e = this._0x8b9c0d();
        document.getElementById('shareLink').value = _0x5c6d7e;
    }

    _0x5y6z7a() {
        document.getElementById('shareModal').classList.remove('show');
    }

    async _0x8b9c0d() {
        const _0x2z3a4b = this._0x1e2f3g();
        try {
            await navigator.clipboard.writeText(_0x2z3a4b);
            this._0x6t7u8v('הקישור הועתק ללוח');
        } catch (_0x5c6d7e) {
            this._0x6t7u8v('שגיאה בהעתקת הקישור', 'error');
        }
    }

    _0x1e2f3g() {
        const _0x2z3a4b = window.location.origin + window.location.pathname;
        const _0x5c6d7e = encodeURIComponent(JSON.stringify(this._0x1a2b3c));
        return `${_0x2z3a4b}?data=${_0x5c6d7e}`;
    }

    _0x4h5i6j() {
        const _0x2z3a4b = this._0x1e2f3g();
        const _0x5c6d7e = 'רשימת משימות משותפת';
        const _0x7k8l9m = `הנה רשימת המשימות שלי: ${_0x2z3a4b}`;
        window.open(`mailto:?subject=${encodeURIComponent(_0x5c6d7e)}&body=${encodeURIComponent(_0x7k8l9m)}`);
    }

    _0x7k8l9m() {
        const _0x2z3a4b = localStorage.getItem('checklistItems');
        if (_0x2z3a4b) {
            try {
                this._0x1a2b3c = JSON.parse(_0x2z3a4b);
            } catch (_0x5c6d7e) {
                console.error('Error loading from localStorage:', _0x5c6d7e);
            }
        }
    }

    _0x0n1o2p() {
        localStorage.setItem('checklistItems', JSON.stringify(this._0x1a2b3c));
    }

    _0x3q4r5s() {
        const _0x2z3a4b = new URLSearchParams(window.location.search);
        const _0x5c6d7e = _0x2z3a4b.get('data');
        
        if (_0x5c6d7e) {
            try {
                const _0x7k8l9m = JSON.parse(decodeURIComponent(_0x5c6d7e));
                if (Array.isArray(_0x7k8l9m)) {
                    this._0x1a2b3c = _0x7k8l9m;
                    this._0x6t7u8v('רשימת משימות נטענה בהצלחה');
                    
                    // Clear the URL parameter
                    const _0x0n1o2p = new URL(window.location);
                    _0x0n1o2p.searchParams.delete('data');
                    window.history.replaceState({}, '', _0x0n1o2p);
                }
            } catch (_0x3q4r5s) {
                this._0x6t7u8v('שגיאה בטעינת רשימת המשימות', 'error');
            }
        }
    }

    _0x6t7u8v(_0x2z3a4b, _0x5c6d7e = 'success') {
        const _0x7k8l9m = document.getElementById('toast');
        _0x7k8l9m.textContent = _0x2z3a4b;
        _0x7k8l9m.className = `toast show ${_0x5c6d7e}`;
        
        setTimeout(() => {
            _0x7k8l9m.classList.remove('show');
        }, 3000);
    }

    _0x9w0x1y(_0x2z3a4b) {
        const _0x5c6d7e = document.createElement('div');
        _0x5c6d7e.textContent = _0x2z3a4b;
        return _0x5c6d7e.innerHTML;
    }

    _0x4l5m6n() {
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
    }
}

// Initialize the app
const app = new _0x7g8h9i(); 