document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('.right-panel form');
    const loginForm = document.querySelector('.container .login-btn')?.parentElement;

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = signupForm.querySelector('input[placeholder="Enter your full name"]').value;
            const email = signupForm.querySelector('input[type="email"]').value;
            const cnic = signupForm.querySelector('input[placeholder="XXXXX-XXXXXXX-X"]').value;
            const phone = signupForm.querySelector('input[type="tel"]').value;
            const role = signupForm.querySelector('select').value;
            const password = signupForm.querySelector('#password').value;
            const confirmPassword = signupForm.querySelector('#confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            try {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, cnic, phone, role, password })
                });
                const data = await res.json();
                if (res.ok) {
                    alert('Registration successful! Please login.');
                    window.location.href = 'login.html';
                } else {
                    alert(data.message);
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred during registration');
            }
        });
    }

    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const container = document.querySelector('.container');
            const email = container.querySelector('input[type="text"]').value;
            const password = container.querySelector('input[type="password"]').value;

            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('user', JSON.stringify(data));
                    if (data.role === 'hospital') window.location.href = 'hospital-dashboard.html';
                    else if (data.role === 'policyholder') window.location.href = 'policy-holder.html';
                    else if (data.role === 'officer') window.location.href = 'officer-dashboard.html';
                } else {
                    alert(data.message);
                }
            } catch (err) {
                console.error(err);
                alert('An error occurred during login');
            }
        });
    }
});
