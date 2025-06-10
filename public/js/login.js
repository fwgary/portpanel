function updatePageTitle() {
  fetch('/api/user')
    .then(response => response.json())
    .then(userData => {
      const userName = userData.name?.trim() || 'Login Page';
      document.title = `${userName} - Login`;
    })
    .catch(error => {
      console.error('Error updating title:', error);
      document.title = 'Login Page'; // Fallback title
    });
}

// Call when page loads
document.addEventListener('DOMContentLoaded', updatePageTitle);


document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  const loginAlert = document.getElementById('login-alert');
  const togglePasswordBtn = document.querySelector('.toggle-password');
  const passwordInput = document.getElementById('password');
  
  // Toggle password visibility
  togglePasswordBtn.addEventListener('click', function() {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Change icon
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });
  
  // Handle login form submission
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Clear previous alerts
    loginAlert.className = 'form-alert';
    loginAlert.textContent = '';
    loginAlert.style.display = 'none';
    
    // Add loading state to button
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Show success message
        loginAlert.textContent = 'Login successful! Redirecting to dashboard...';
        loginAlert.classList.add('success', 'show');
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        // Show error message
        loginAlert.textContent = data.message || 'Login failed. Please try again.';
        loginAlert.classList.add('error', 'show');
        
        // Remove loading state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Show error message
      loginAlert.textContent = 'An error occurred. Please try again later.';
      loginAlert.classList.add('error', 'show');
      
      // Remove loading state
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
});