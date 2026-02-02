// Login Popup Dropdowns
const loginTypeToggle = document.getElementById('loginTypeToggle');
const loginTypeMenu = document.getElementById('loginTypeMenu');
const loginTypeSelected = document.querySelector('.login-type-selected');
const forgotPasswordToggle = document.getElementById('forgotPasswordToggle');
const forgotPasswordMenu = document.getElementById('forgotPasswordMenu');

function closeAll() {
    [loginTypeMenu, forgotPasswordMenu].forEach(menu => {
        if (menu?.classList.contains('show')) {
            menu.classList.remove('show');
            const icon = (menu === loginTypeMenu ? loginTypeToggle : forgotPasswordToggle)?.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        }
    });
}

// Login Type Dropdown
loginTypeToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = loginTypeMenu.classList.contains('show');
    closeAll();
    if (!isOpen) {
        loginTypeMenu.classList.add('show');
        loginTypeToggle.queySrelector('i')?.classList.replace('fa-chevron-down', 'fa-chevron-up');
    }
});

loginTypeMenu?.querySelectorAll('a').forEach(option => {
    option.addEventListener('click', (e) => {
        e.preventDefault();
        if (loginTypeSelected) loginTypeSelected.textContent = option.textContent;
        closeAll();
    });
});

// Forgot Password Dropdown
forgotPasswordToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = forgotPasswordMenu.classList.contains('show');
    closeAll();
    if (!isOpen) {
        forgotPasswordMenu.classList.add('show');
        forgotPasswordToggle.querySelector('i')?.classList.replace('fa-chevron-down', 'fa-chevron-up');
    }
});

// Close on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.login-type-dropdown') && !e.target.closest('.forgot-password-dropdown')) {
        closeAll();
    }
});
