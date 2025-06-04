function getCarts() {
  clearAlert();
  document.getElementById('cardHeader').innerHTML = '<h4>Carts List</h4>';
  fetch('https://fakestoreapi.com/carts', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(data => {
      if (data.status === 200) {
        let listCarts = `
          <table class="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>User ID</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>`;
        data.body.forEach((cart, index) => {
          listCarts += `
            <tr>
              <td>${index + 1}</td>
              <td>${cart.userId}</td>
              <td>${new Date(cart.date).toLocaleDateString()}</td>
              <td>
                <button class="btn btn-sm btn-info" onclick="getCart('${cart.id}')">View</button>
              </td>
            </tr>`;
        });
        listCarts += `</tbody></table>`;
        document.getElementById('info').innerHTML = listCarts;
      } else {
        showMessage('danger', 'Cart not found');
      }
    })
    .catch(() => showMessage('danger', 'Error fetching carts'));
}

function getCart(id) {
  clearAlert();
  document.getElementById('cardHeader').innerHTML = '<h4>Cart Details</h4>';
  fetch(`https://fakestoreapi.com/carts/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(data => {
      if (data.status === 200) {
        showCartInfo(data.body);
      } else {
        showMessage('danger', 'Cart not found');
      }
    })
    .catch(() => showMessage('danger', 'Error fetching cart'));
}

function showCartInfo(cart) {
  const modalCart = `
    <div class="modal fade" id="modalCart" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Cart Info</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ul class="list-group">
              <li class="list-group-item"><strong>User ID:</strong> ${cart.userId}</li>
              <li class="list-group-item"><strong>Date:</strong> ${new Date(cart.date).toLocaleDateString()}</li>
            </ul>
            <h6 class="mt-3">Products:</h6>
            <ul class="list-group">
              ${cart.products.map(product => `
                <li class="list-group-item">
                  <strong>Product ID:</strong> ${product.productId} | <strong>Quantity:</strong> ${product.quantity}
                </li>
              `).join('')}
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>`;
  document.getElementById('showModal').innerHTML = modalCart;
  const modal = new bootstrap.Modal(document.getElementById('modalCart'));
  modal.show();
}

function showCreateCartForm() {
  clearAlert();
  document.getElementById('cardHeader').innerHTML = '<h4>Create New Cart</h4>';
  const formHTML = `
    <form id="createCartForm">
      <div class="mb-3">
        <label for="userId" class="form-label">User ID</label>
        <input type="number" class="form-control" id="userId" required>
      </div>
      <div class="mb-3">
        <label for="date" class="form-label">Date</label>
        <input type="date" class="form-control" id="date" required>
      </div>
      <div id="productsContainer">
        <div class="mb-3 row">
          <div class="col">
            <label for="productId0" class="form-label">Product ID</label>
            <input type="number" class="form-control" id="productId0" required>
          </div>
          <div class="col">
            <label for="quantity0" class="form-label">Quantity</label>
            <input type="number" class="form-control" id="quantity0" required>
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-sm btn-secondary mb-3" onclick="addProductField()">Add Another Product</button>
      <button type="submit" class="btn btn-success">Create Cart</button>
    </form>`;
  document.getElementById('info').innerHTML = formHTML;
  document.getElementById('createCartForm').addEventListener('submit', e => {
    e.preventDefault();
    createCart();
  });
}

let productFieldCount = 1;
function addProductField() {
  const container = document.getElementById('productsContainer');
  const fieldHTML = `
    <div class="mb-3 row">
      <div class="col">
        <label for="productId${productFieldCount}" class="form-label">Product ID</label>
        <input type="number" class="form-control" id="productId${productFieldCount}" required>
      </div>
      <div class="col">
        <label for="quantity${productFieldCount}" class="form-label">Quantity</label>
        <input type="number" class="form-control" id="quantity${productFieldCount}" required>
      </div>
    </div>`;
  container.insertAdjacentHTML('beforeend', fieldHTML);
  productFieldCount++;
}

function createCart() {
  const userId = parseInt(document.getElementById('userId').value);
  const date = document.getElementById('date').value;
  const products = [];
  for (let i = 0; i < productFieldCount; i++) {
    const prodInput = document.getElementById(`productId${i}`);
    const qtyInput = document.getElementById(`quantity${i}`);
    if (prodInput && qtyInput) {
      products.push({ productId: parseInt(prodInput.value), quantity: parseInt(qtyInput.value) });
    }
  }
  const cart = { userId, date, products };
  fetch('https://fakestoreapi.com/carts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cart)
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(data => {
      if (data.status === 200 || data.status === 201) {
        showMessage('success', 'Cart created successfully.');
        getCarts();
      } else {
        showMessage('danger', 'Error creating cart');
      }
    })
    .catch(() => showMessage('danger', 'Error creating cart'));
}

function deleteCart(id) {
  fetch(`https://fakestoreapi.com/carts/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(data => {
      if (data.status === 200) {
        showMessage('success', 'Cart deleted successfully.');
        getCarts();
      } else {
        showMessage('danger', 'Error deleting cart');
      }
    })
    .catch(() => showMessage('danger', 'Error deleting cart'));
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