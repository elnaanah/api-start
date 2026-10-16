const API_URL = "https://souk-albab.vercel.app/api";

async function getProducts() {
  return [];
}

async function createOrder(data) {
  return {
    success: false,
    message: "لم يتم برمجة createOrder بعد!",
  };
}

async function getOrders(phone = "") {
  return [];
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