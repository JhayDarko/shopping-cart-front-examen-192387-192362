function getProducts() {
  clearAlert();
  document.getElementById('cardHeader').innerHTML = '<h4>Products List</h4>';
  fetch('https://fakestoreapi.com/products', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(data => {
      if (data.status === 200) {
        let listProducts = `
          <table class="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Avatar</th>
                <th>Title</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>`;
        data.body.forEach((product, index) => {
          listProducts += `
            <tr>
              <td>${index + 1}</td>
              <td><img src="${product.image}" class="img-thumbnail" style="max-width:50px;" alt="Product Image"></td>
              <td>${product.title}</td>
              <td>$${product.price}</td>
              <td>
                <button class="btn btn-sm btn-info" onclick="getProduct('${product.id}')">View</button>
              </td>
            </tr>`;
        });
        listProducts += `</tbody></table>`;
        document.getElementById('info').innerHTML = listProducts;
      } else {
        showMessage('danger', 'Products not found');
      }
    })
    .catch(() => showMessage('danger', 'Error fetching products'));
}

function getProduct(id) {
  clearAlert();
  document.getElementById('cardHeader').innerHTML = '<h4>Product Details</h4>';
  fetch(`https://fakestoreapi.com/products/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(data => {
      if (data.status === 200) {
        showProductInfo(data.body);
      } else {
        showMessage('danger', 'Product not found');
      }
    })
    .catch(() => showMessage('danger', 'Error fetching product'));
}

function showProductInfo(product) {
  const modalProduct = `
    <div class="modal fade" id="modalProduct" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Product Info</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <img src="${product.image}" class="img-fluid mb-3" alt="Product Image">
            <ul class="list-group text-start">
              <li class="list-group-item"><strong>ID:</strong> ${product.id}</li>
              <li class="list-group-item"><strong>Title:</strong> ${product.title}</li>
              <li class="list-group-item"><strong>Description:</strong> ${product.description}</li>
              <li class="list-group-item"><strong>Category:</strong> ${product.category}</li>
              <li class="list-group-item"><strong>Price:</strong> $${product.price}</li>
              <li class="list-group-item"><strong>Rating:</strong> ${product.rating.rate} (${product.rating.count} reviews)</li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>`;
  document.getElementById('showModal').innerHTML = modalProduct;
  const modal = new bootstrap.Modal(document.getElementById('modalProduct'));
  modal.show();
}

function showCreateProductForm() {
  clearAlert();
  document.getElementById('cardHeader').innerHTML = '<h4>Create New Product</h4>';
  const formHTML = `
    <form id="createProductForm">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input type="text" class="form-control" id="title" required>
      </div>
      <div class="mb-3">
        <label for="price" class="form-label">Price</label>
        <input type="number" step="0.01" class="form-control" id="price" required>
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea class="form-control" id="description" rows="3" required></textarea>
      </div>
      <div class="mb-3">
        <label for="category" class="form-label">Category</label>
        <input type="text" class="form-control" id="category" required>
      </div>
      <div class="mb-3">
        <label for="image" class="form-label">Image URL</label>
        <input type="url" class="form-control" id="image" required>
      </div>
      <button type="submit" class="btn btn-success mt-2">Create Product</button>
    </form>`;
  document.getElementById('info').innerHTML = formHTML;
  document.getElementById('createProductForm').addEventListener('submit', e => {
    e.preventDefault();
    createProduct();
  });
}

function createProduct() {
  const product = {
    title: document.getElementById('title').value,
    price: parseFloat(document.getElementById('price').value),
    description: document.getElementById('description').value,
    image: document.getElementById('image').value,
    category: document.getElementById('category').value
  };
  fetch('https://fakestoreapi.com/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(data => {
      if (data.status === 200 || data.status === 201) {
        showMessage('success', 'Product created successfully.');
        getProducts();
      } else {
        showMessage('danger', 'Error creating product');
      }
    })
    .catch(() => showMessage('danger', 'Error creating product'));
}

function deleteProduct(id) {
  fetch(`https://fakestoreapi.com/products/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(data => {
      if (data.status === 200) {
        showMessage('success', 'Product deleted successfully.');
        getProducts();
      } else {
        showMessage('danger', 'Error deleting product');
      }
    })
    .catch(() => showMessage('danger', 'Error deleting product'));
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