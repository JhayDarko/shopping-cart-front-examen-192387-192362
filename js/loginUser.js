document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('formLogin').addEventListener('submit', (e) => {
    e.preventDefault();
    const userName = document.getElementById('userName').value;
    const password = document.getElementById('password').value;
    login(userName, password);
  });
});



function login(userName, password) {
  const credentials = { username: userName, password: password };
  fetch('https://fakestoreapi.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
    .then(response => {
      if (response.status === 200) {
        response.json().then(data => {
          localStorage.setItem('token', data.token);
          setTimeout(() => { location.href = 'admin/dashboard.html'; }, 500);
        });
      } else {
        showLoginMessage('danger', 'Datos erróneos');
      }
    })
    .catch(() => showLoginMessage('danger', 'Error inesperado'));
}

function showLoginMessage(type, text) {
  const alertDiv = document.getElementById('alert');
  alertDiv.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
    ${text}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
}

function logout() {
  localStorage.removeItem('token');
  location.href = '../index.html';
}

function tokenValidate() {
  const TOKEN = localStorage.getItem('token');
  if (TOKEN == null && !location.href.includes('index.html')) {
    location.href = '../index.html';
  }
  console.log('Token: ', TOKEN);
}

document.addEventListener('DOMContentLoaded', () => {
  tokenValidate();
  document.getElementById('logoutButton').addEventListener('click', logout);
});