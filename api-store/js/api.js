const API_URL = "https://souk-albab.vercel.app/api";

async function getProducts() {
  const resposive = await fetch(`${API_URL}/products`);
  const resulet = await resposive.json();

  return resulet.data || [];
}

async function createOrder(data) {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify(data)
  });

  const resulet = await response.json();

  return resulet;
}

async function getOrders(phone = "") {

  const response = await fetch(`${API_URL}/orders?phone=${encodeURIComponent(phone)}`);
  const resulet = await response.json();
  return resulet.data || [];
}

async function updateOrder(id, data) {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: "PUT",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify(data)
  });

  const resulet = await response.json();

  return resulet;
}

async function deleteOrder(id) {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: "DELETE",
  });

  const resulet = await response.json();

  return resulet;
}


async function getProductById(id) {
  const response = await fetch(`${API_URL}/products/${id}`);
  const resulet = await response.json();
 
  return resulet.data || null; return null;
}

async function createProduct(data) {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify(data)
  });

  const resulet = await response.json();

  return resulet;
}

async function updateProduct(id, data) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify(data)
  });

  const resulet = await response.json();

  return resulet;

}

async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });

  const resulet = await response.json();

  return resulet;
}

async function updateOrderStatus(id, status) {
  return updateOrder(id, { status });
}