function getUsers() {
  clearAlert();
  document.getElementById('cardHeader').innerHTML = '<h4>Users List</h4>';
  fetch('https://fakestoreapi.com/users', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(data => {
      if (data.status === 200) {
        let listUsers = `
          <table class="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>`;
        data.body.forEach((user, index) => {
          listUsers += `
            <tr>
              <td>${index + 1}</td>
              <td>${user.name.firstname}</td>
              <td>${user.name.lastname}</td>
              <td>
                <button class="btn btn-sm btn-info" onclick="getUser('${user.id}')">View</button>
              </td>
            </tr>`;
        });
        listUsers += `</tbody></table>`;
        document.getElementById('info').innerHTML = listUsers;
      } else {
        showMessage('danger', 'Users not found');
      }
    })
    .catch(() => showMessage('danger', 'Error fetching users'));
}

function getUser(id) {
  clearAlert();
  document.getElementById('cardHeader').innerHTML = '<h4>User Details</h4>';
  fetch(`https://fakestoreapi.com/users/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(data => {
      if (data.status === 200) {
        showUserInfo(data.body);
      } else {
        showMessage('danger', 'User not found');
      }
    })
    .catch(() => showMessage('danger', 'Error fetching user'));
}

function showUserInfo(user) {
  const modalUser = `
    <div class="modal fade" id="modalUser" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">User Info</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ul class="list-group">
              <li class="list-group-item"><strong>ID:</strong> ${user.id}</li>
              <li class="list-group-item"><strong>Name:</strong> ${user.name.firstname} ${user.name.lastname}</li>
              <li class="list-group-item"><strong>Username:</strong> ${user.username}</li>
              <li class="list-group-item"><strong>Email:</strong> ${user.email}</li>
              <li class="list-group-item"><strong>Phone:</strong> ${user.phone}</li>
              <li class="list-group-item"><strong>Address:</strong> ${user.address.city}, ${user.address.street} ${user.address.number}</li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>`;
  document.getElementById('showModal').innerHTML = modalUser;
  const modal = new bootstrap.Modal(document.getElementById('modalUser'));
  modal.show();
}

function showCreateUserForm() {
  clearAlert();
  document.getElementById('cardHeader').innerHTML = '<h4>Create New User</h4>';
  const formHTML = `
    <form id="createUserForm">
      <div class="mb-3">
        <label for="firstName" class="form-label">First Name</label>
        <input type="text" class="form-control" id="firstName" required>
      </div>
      <div class="mb-3">
        <label for="lastName" class="form-label">Last Name</label>
        <input type="text" class="form-control" id="lastName" required>
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input type="email" class="form-control" id="email" required>
      </div>
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input type="text" class="form-control" id="username" required>
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" required>
      </div>
      <button type="submit" class="btn btn-success">Create User</button>
    </form>`;
  document.getElementById('info').innerHTML = formHTML;
  document.getElementById('createUserForm').addEventListener('submit', e => {
    e.preventDefault();
    createUser();
  });
}

function createUser() {
  const user = {
    email: document.getElementById('email').value,
    username: document.getElementById('username').value,
    password: document.getElementById('password').value,
    name: {
      firstname: document.getElementById('firstName').value,
      lastname: document.getElementById('lastName').value
    },
    address: { city: 'Unknown', street: 'Unknown', number: 0, zipcode: '00000' },
    phone: '000-000-0000'
  };
  fetch('https://fakestoreapi.com/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(data => {
      if (data.status === 200 || data.status === 201) {
        showMessage('success', 'User created successfully.');
        getUsers();
      } else {
        showMessage('danger', 'Error creating user');
      }
    })
    .catch(() => showMessage('danger', 'Error creating user'));
}

function deleteUser(id) {
  fetch(`https://fakestoreapi.com/users/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(data => {
      if (data.status === 200) {
        showMessage('success', 'User deleted successfully.');
        getUsers();
      } else {
        showMessage('danger', 'Error deleting user');
      }
    })
    .catch(() => showMessage('danger', 'Error deleting user'));
}

function showMessage(type, text) {
  const alertDiv = document.getElementById('alert');
  alertDiv.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
    ${text}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`;
}

function clearAlert() {
  document.getElementById('alert').innerHTML = '';
}