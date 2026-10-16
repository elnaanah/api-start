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
  return {
    success: false,
    message: "لم يتم برمجة updateOrder بعد!",
  };
}

async function deleteOrder(id) {
  return {
    success: false,
    message: "لم يتم برمجة deleteOrder بعد!",
  };
}

async function getProductById(id) {
  return null;
}

async function createProduct(data) {
  return {
    success: false,
    message: "لم يتم برمجة createProduct بعد!",
  };
}

async function updateProduct(id, data) {
  return {
    success: false,
    message: "لم يتم برمجة updateProduct بعد!",
  };
}

async function deleteProduct(id) {
  return {
    success: false,
    message: "لم يتم برمجة deleteProduct بعد!",
  };
}

async function updateOrderStatus(id, status) {
  return updateOrder(id, { status });
}