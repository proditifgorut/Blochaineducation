// Initialize Lucide icons after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// DOM elements - Safe access with error handling
const safeGetElement = (id) => {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with id '${id}' not found`);
    }
    return element;
};

// Navigation elements
const loginBtn = safeGetElement('loginBtn');
const dashboardBtn = safeGetElement('dashboardBtn');
const homeBtn = safeGetElement('homeBtn');
const connectWalletBtn = safeGetElement('connectWalletBtn');
const mobileMenuBtn = safeGetElement('mobileMenuBtn');
const mobileMenu = safeGetElement('mobileMenu');

// Modal elements
const loginModal = safeGetElement('loginModal');
const closeLoginModal = safeGetElement('closeLoginModal');

// Status elements
const walletStatus = safeGetElement('walletStatus');
const walletStatusAddress = safeGetElement('walletStatusAddress');
const loadingOverlay = safeGetElement('loadingOverlay');

// Pages
const landingPage = safeGetElement('landingPage');
const studentDashboard = safeGetElement('studentDashboard');
const teacherDashboard = safeGetElement('teacherDashboard');
const verificationPage = safeGetElement('verificationPage');
const paymentPage = safeGetElement('paymentPage');

// Login buttons
const studentLoginBtn = safeGetElement('studentLoginBtn');
const teacherLoginBtn = safeGetElement('teacherLoginBtn');
const verifyLoginBtn = safeGetElement('verifyLoginBtn');

// Action buttons
const getStartedBtn = safeGetElement('getStartedBtn');
const watchDemoBtn = safeGetElement('watchDemoBtn');
const startFreeTrialBtn = safeGetElement('startFreeTrialBtn');
const requestDemoBtn = safeGetElement('requestDemoBtn');
const getStartedBasicBtn = safeGetElement('getStartedBasicBtn');
const getStartedProBtn = safeGetElement('getStartedProBtn');
const contactSalesBtn = safeGetElement('contactSalesBtn');

// Verification elements
const verificationForm = safeGetElement('verificationForm');
const verifyCertificateBtn = safeGetElement('verifyCertificateBtn');
const certificateHashInput = safeGetElement('certificateHash');
const scanQRBtn = safeGetElement('scanQRBtn');
const verificationResultContainer = safeGetElement('verificationResultContainer');
const verificationResultValid = safeGetElement('verificationResultValid');
const verificationResultInvalid = safeGetElement('verificationResultInvalid');
const verificationName = safeGetElement('verificationName');
const verificationInstitution = safeGetElement('verificationInstitution');
const verificationDate = safeGetElement('verificationDate');
const verificationHash = safeGetElement('verificationHash');
const verifyAnotherBtn = safeGetElement('verifyAnotherBtn');

// Payment elements
const payWithCryptoBtn = safeGetElement('payWithCryptoBtn');
const cryptoSelect = safeGetElement('cryptoSelect');
const walletAddressInput = safeGetElement('walletAddress');
const paymentAmount = safeGetElement('paymentAmount');

// State management
let currentUser = null;
let walletConnected = false;
let userWalletAddress = null;

// Utility functions
function showLoading() {
    if (loadingOverlay) loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    if (loadingOverlay) loadingOverlay.classList.add('hidden');
}

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    });
});

// Mobile menu toggle
if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

// Modal management
function openModal(modal) {
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Page navigation
function showPage(page) {
    if (!page) {
        console.error('Page element not found');
        return;
    }
    [landingPage, studentDashboard, teacherDashboard, verificationPage, paymentPage].forEach(p => {
        if (p) p.classList.add('hidden');
    });
    page.classList.remove('hidden');
    if (page === landingPage) {
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (dashboardBtn) dashboardBtn.classList.add('hidden');
        if (homeBtn) homeBtn.classList.add('hidden');
    } else {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (dashboardBtn) dashboardBtn.classList.remove('hidden');
        if (homeBtn) homeBtn.classList.remove('hidden');
    }
    window.scrollTo(0, 0);
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Event listeners with safe binding
function safeAddEventListener(element, event, handler) {
    if (element) element.addEventListener(event, handler);
}

// Navigation and Modal event listeners
safeAddEventListener(loginBtn, 'click', () => openModal(loginModal));
safeAddEventListener(closeLoginModal, 'click', () => closeModal(loginModal));
safeAddEventListener(dashboardBtn, 'click', () => {
    if (currentUser === 'student' && studentDashboard) showPage(studentDashboard);
    else if (currentUser === 'teacher' && teacherDashboard) showPage(teacherDashboard);
});
safeAddEventListener(homeBtn, 'click', () => {
    if (landingPage) showPage(landingPage);
});

// Login functionality
safeAddEventListener(studentLoginBtn, 'click', () => {
    currentUser = 'student';
    closeModal(loginModal);
    if (studentDashboard) showPage(studentDashboard);
    showNotification('Logged in as Student', 'success');
});
safeAddEventListener(teacherLoginBtn, 'click', () => {
    currentUser = 'teacher';
    closeModal(loginModal);
    if (teacherDashboard) showPage(teacherDashboard);
    showNotification('Logged in as Instructor', 'success');
});
safeAddEventListener(verifyLoginBtn, 'click', () => {
    closeModal(loginModal);
    if (verificationPage) showPage(verificationPage);
});

// Wallet connection
function updateWalletStatus(accounts) {
    if (accounts.length > 0) {
        walletConnected = true;
        userWalletAddress = accounts[0];
        const shortAddress = `${userWalletAddress.slice(0, 6)}...${userWalletAddress.slice(-4)}`;
        
        if (connectWalletBtn) {
            connectWalletBtn.innerHTML = `<i data-lucide="wallet" class="w-4 h-4 mr-1"></i> ${shortAddress}`;
            connectWalletBtn.classList.replace('btn-secondary', 'btn-primary');
        }
        if (walletStatus) walletStatus.classList.remove('hidden');
        if (walletStatusAddress) walletStatusAddress.textContent = shortAddress;
        if (walletAddressInput) walletAddressInput.value = userWalletAddress;
        
        showNotification('Wallet connected successfully!', 'success');
    } else {
        walletConnected = false;
        userWalletAddress = null;
        if (connectWalletBtn) {
            connectWalletBtn.innerHTML = `<i data-lucide="wallet" class="w-4 h-4 mr-1"></i> Connect Wallet`;
            connectWalletBtn.classList.replace('btn-primary', 'btn-secondary');
        }
        if (walletStatus) walletStatus.classList.add('hidden');
        if (walletAddressInput) walletAddressInput.value = '';
        showNotification('Wallet disconnected.', 'info');
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

safeAddEventListener(connectWalletBtn, 'click', async () => {
    if (typeof window.ethereum === 'undefined') {
        return showNotification('Please install MetaMask or another Web3 wallet.', 'error');
    }
    try {
        showLoading();
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        updateWalletStatus(accounts);
    } catch (error) {
        console.error('Error connecting wallet:', error);
        showNotification('Failed to connect wallet. Please try again.', 'error');
    } finally {
        hideLoading();
    }
});

// Certificate verification
safeAddEventListener(verifyCertificateBtn, 'click', async () => {
    if (!certificateHashInput || !verificationResultContainer) return;
    const hash = certificateHashInput.value.trim();
    if (!hash) return showNotification('Please enter a certificate hash.', 'error');

    showLoading();
    showNotification('Verifying certificate...', 'info');
    
    try {
        const certificate = await blockchainAPI.verifyCertificate(hash);
        if(verificationForm) verificationForm.classList.add('hidden');
        verificationResultContainer.classList.remove('hidden');

        if (certificate) {
            if(verificationName) verificationName.textContent = certificate.recipient;
            if(verificationInstitution) verificationInstitution.textContent = certificate.institution;
            if(verificationDate) verificationDate.textContent = certificate.date;
            if(verificationHash) verificationHash.textContent = certificate.hash;
            if(verificationResultInvalid) verificationResultInvalid.classList.add('hidden');
            if(verificationResultValid) verificationResultValid.classList.remove('hidden');
            showNotification('Certificate verified successfully!', 'success');
        } else {
            if(verificationResultValid) verificationResultValid.classList.add('hidden');
            if(verificationResultInvalid) verificationResultInvalid.classList.remove('hidden');
            showNotification('Verification failed: Certificate not found.', 'error');
        }
    } catch (error) {
        if(verificationResultValid) verificationResultValid.classList.add('hidden');
        if(verificationResultInvalid) verificationResultInvalid.classList.remove('hidden');
        showNotification('An error occurred during verification.', 'error');
    } finally {
        hideLoading();
        if (verifyAnotherBtn) verifyAnotherBtn.classList.remove('hidden');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
});

safeAddEventListener(verifyAnotherBtn, 'click', () => {
    if(verificationForm) verificationForm.classList.remove('hidden');
    if(verificationResultContainer) verificationResultContainer.classList.add('hidden');
    if(certificateHashInput) certificateHashInput.value = '';
    if(verifyAnotherBtn) verifyAnotherBtn.classList.add('hidden');
    showNotification('Verification form has been reset.', 'info');
});

// QR Code scanning simulation
safeAddEventListener(scanQRBtn, 'click', () => {
    showNotification('QR Scanner opened (demo)', 'info');
    setTimeout(() => {
        if (certificateHashInput) {
            certificateHashInput.value = '0x1234567890abcdef1234567890abcdef12345678';
        }
        showNotification('QR code scanned! Click verify.', 'success');
    }, 1500);
});

// Payment functionality
safeAddEventListener(payWithCryptoBtn, 'click', async () => {
    if (!walletConnected) return showNotification('Please connect your wallet first.', 'error');
    
    showLoading();
    showNotification('Processing payment...', 'info');
    
    try {
        const amount = parseFloat(paymentAmount.textContent);
        const currency = cryptoSelect.value;
        const result = await blockchainAPI.processPayment(amount, currency, userWalletAddress);
        if (result.success) {
            showNotification(`Payment successful! Redirecting to dashboard...`, 'success');
            setTimeout(() => {
                showPage(studentDashboard);
            }, 2000);
        } else {
            showNotification('Payment failed.', 'error');
        }
    } catch (error) {
        showNotification('An error occurred during payment.', 'error');
    } finally {
        hideLoading();
    }
});

// Landing page CTAs
safeAddEventListener(getStartedBtn, 'click', () => openModal(loginModal));
safeAddEventListener(startFreeTrialBtn, 'click', () => openModal(loginModal));
safeAddEventListener(getStartedBasicBtn, 'click', () => {
    showNotification('Selected Basic Plan. Please log in or sign up.', 'info');
    openModal(loginModal);
});
safeAddEventListener(getStartedProBtn, 'click', () => {
    showNotification('Selected Professional Plan. Please log in or sign up.', 'info');
    openModal(loginModal);
});

safeAddEventListener(watchDemoBtn, 'click', () => showNotification('Demo video would play here.', 'info'));
safeAddEventListener(requestDemoBtn, 'click', () => showNotification('Demo request form would open here.', 'info'));
safeAddEventListener(contactSalesBtn, 'click', () => showNotification('Thank you! Our sales team will contact you shortly. (Demo)', 'info'));

// Dashboard actions
safeAddEventListener(safeGetElement('viewAllCertificatesBtn'), 'click', () => showNotification('Certificate gallery opened (demo)', 'info'));
[
    { id: 'createCourseBtn', message: 'Course creation wizard opened (demo)' },
    { id: 'issueCertificateBtn', message: 'Certificate issuance form opened (demo)' },
    { id: 'uploadContentBtn', message: 'Content upload interface opened (demo)' },
    { id: 'verifySubmissionBtn', message: 'Submission verification opened (demo)' },
    { id: 'managePaymentsBtn', message: 'Payment management opened (demo)' }
].forEach(action => safeAddEventListener(safeGetElement(action.id), 'click', () => showNotification(action.message, 'info')));

// Notification system
function showNotification(message, type = 'info') {
    const container = safeGetElement('notificationContainer');
    if (!container) return;

    const typeClasses = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    const iconNames = {
        success: 'check-circle',
        error: 'x-circle',
        warning: 'alert-triangle',
        info: 'info'
    };

    const notification = document.createElement('div');
    notification.className = `p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full max-w-sm ${typeClasses[type]}`;

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'flex items-center space-x-3';

    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', iconNames[type]);
    icon.className = 'w-5 h-5 flex-shrink-0';

    const text = document.createElement('span');
    text.className = 'text-sm';
    text.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'ml-auto flex-shrink-0 hover:opacity-70 p-1 -mr-1 -mt-1 rounded-full focus:outline-none focus:ring-2 focus:ring-white';
    const closeIcon = document.createElement('i');
    closeIcon.setAttribute('data-lucide', 'x');
    closeIcon.className = 'w-4 h-4';
    closeBtn.appendChild(closeIcon);

    contentWrapper.appendChild(icon);
    contentWrapper.appendChild(text);
    contentWrapper.appendChild(closeBtn);
    notification.appendChild(contentWrapper);
    
    container.appendChild(notification);
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ nodes: [icon, closeIcon] });
    }

    const removeNotification = () => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 300);
    };

    const autoRemoveTimeout = setTimeout(removeNotification, 5000);
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoRemoveTimeout);
        removeNotification();
    });

    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
}

// Mock blockchain API
const mockCertificates = [
    { id: '1', title: 'Bachelor of Computer Science', institution: 'MIT', date: '2023-05-15', hash: '0x1234567890abcdef1234567890abcdef12345678', recipient: 'John Smith' },
    { id: '2', title: 'Blockchain Development Certificate', institution: 'Stanford Online', date: '2023-06-20', hash: '0xfedcba0987654321fedcba0987654321fedcba09', recipient: 'Jane Doe' }
];
const blockchainAPI = {
    async verifyCertificate(hash) {
        return new Promise(resolve => setTimeout(() => resolve(mockCertificates.find(cert => cert.hash === hash) || null), 1000));
    },
    async processPayment(amount, currency, walletAddress) {
        console.log(`Processing payment of ${amount} ${currency} from ${walletAddress}`);
        return new Promise(resolve => setTimeout(() => resolve({ success: true, transactionHash: '0x' + Math.random().toString(16).slice(2, 66) }), 2000));
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    if (typeof window.ethereum !== 'undefined' && window.ethereum.selectedAddress) {
        updateWalletStatus([window.ethereum.selectedAddress]);
    }
    
    if (landingPage) showPage(landingPage);
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.card, h1, h2, p').forEach(el => observer.observe(el));
    
    console.log('EduChain Blockchain Education Platform initialized! 🚀');
});

// Global event listeners
window.addEventListener('click', (e) => {
    if (e.target === loginModal) closeModal(loginModal);
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal(loginModal);
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden');
    }
});

// Handle wallet events
if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', (accounts) => updateWalletStatus(accounts));
}

// Export for debugging
window.EduChain = { showPage, showNotification, blockchainAPI, currentUser: () => currentUser, walletConnected: () => walletConnected };
