// app.js

let products = [];
let editingProductId = null;

const CART_KEY = "store_cart";


// ========================================
// 1. إدارة السلة
// ========================================

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);

  if (!product || product.stock <= 0) return;

  const cart = getCart();
  const item = cart.find((i) => i.id === productId);

  if (item) {
    if (item.quantity >= product.stock) {
      showToast("لا توجد كمية إضافية متاحة", true);
      return;
    }

    item.quantity++;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  }

  saveCart(cart);
  showToast(`تمت إضافة "${product.title}" إلى السلة`);
  openCart();
}

function updateCartQty(productId, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);

  if (!item) return;

  item.quantity += delta;

  const product = products.find((p) => p.id === productId);

  if (product && item.quantity > product.stock) {
    item.quantity = product.stock;
    showToast("لا توجد كمية إضافية متاحة", true);
  }

  const updatedCart = cart.filter((i) => i.quantity > 0);
  saveCart(updatedCart);
}

function removeFromCart(productId) {
  const cart = getCart().filter((i) => i.id !== productId);

  saveCart(cart);
  showToast("تم حذف المنتج من السلة");
}

function clearCart() {
  saveCart([]);
}


// ========================================
// 2. فتح السلة وإغلاقها
// ========================================

function openCart() {
  const drawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("cart-backdrop");

  if (!drawer || !backdrop) return;

  backdrop.classList.remove("hidden");
  drawer.classList.remove("-translate-x-full");
  drawer.classList.add("translate-x-0");

  updateCartUI();
}

function closeCart() {
  const drawer = document.getElementById("cart-drawer");
  const backdrop = document.getElementById("cart-backdrop");

  if (!drawer || !backdrop) return;

  backdrop.classList.add("hidden");
  drawer.classList.remove("translate-x-0");
  drawer.classList.add("-translate-x-full");
}


// ========================================
// 3. عرض محتويات السلة
// ========================================

function updateCartUI() {
  const cart = getCart();

  const totalCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const badge = document.getElementById("cart-badge");
  const drawerCount = document.getElementById("drawer-count-tag");
  const totalPriceElement = document.getElementById("cart-total-price");
  const confirmButton = document.getElementById("btn-confirm-order");
  const checkoutSection = document.getElementById("checkout-section");
  const container = document.getElementById("cart-items-container");

  if (badge) badge.textContent = totalCount;

  if (drawerCount) {
    drawerCount.textContent = `${totalCount} عناصر`;
  }

  if (totalPriceElement) {
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
  }

  if (confirmButton) {
    confirmButton.disabled = cart.length === 0;
  }

  if (checkoutSection) {
    checkoutSection.classList.toggle("hidden", cart.length === 0);
  }

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center text-zinc-400">
        <span class="block mb-2 text-4xl">🛒</span>
        <p class="text-sm font-semibold text-zinc-700">
          السلة فارغة حالياً
        </p>
        <p class="mt-1 text-xs">
          تصفح المنتجات واضغط "أضف إلى السلة".
        </p>
      </div>
    `;

    return;
  }

  container.innerHTML = cart.map((item) => `
    <div class="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl">
      <img
        src="${item.image || ""}"
        alt="${item.title}"
        class="w-12 h-12 rounded-lg object-cover bg-white border border-zinc-200 shrink-0"
        onerror="this.onerror=null;this.src='https://placehold.co/100x100?text=?'"
      />

      <div class="flex-1 min-w-0">
        <h4 class="text-xs font-bold text-zinc-900 truncate">
          ${item.title}
        </h4>
        <p class="mt-0.5 text-xs text-zinc-500">
          $${Number(item.price).toFixed(2)}
        </p>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <button
          onclick="updateCartQty('${item.id}', -1)"
          class="w-6 h-6 rounded bg-white border border-zinc-200 text-xs font-bold"
        >-</button>

        <span class="w-5 text-center text-xs font-bold">
          ${item.quantity}
        </span>

        <button
          onclick="updateCartQty('${item.id}', 1)"
          class="w-6 h-6 rounded bg-white border border-zinc-200 text-xs font-bold"
        >+</button>

        <button
          onclick="removeFromCart('${item.id}')"
          class="p-1 ms-1 text-xs text-red-600"
          title="حذف المنتج"
        >🗑️</button>
      </div>
    </div>
  `).join("");
}


// ========================================
// 4. إنشاء طلب جديد
// ========================================

async function submitCartOrder() {
  const cart = getCart();

  if (cart.length === 0) {
    showToast("السلة فارغة، أضف منتجات أولاً", true);
    return;
  }

  const customerName = document
    .getElementById("cust-name")?.value.trim();

  const customerPhone = document
    .getElementById("cust-phone")?.value.trim();

  const address = document
    .getElementById("cust-address")?.value.trim() || "غير محدد";

  if (!customerName || !customerPhone) {
    showToast("يرجى إدخال الاسم ورقم الهاتف", true);
    return;
  }

  const button = document.getElementById("btn-confirm-order");

  if (!button || button.disabled) return;

  button.disabled = true;
  button.textContent = "جاري إرسال الطلب...";

  const orderData = {
    customerName,
    customerPhone,
    address,
    items: cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
  };

  try {
    const result = await createOrder(orderData);

    if (result?.success && result.data) {
      clearCart();
      showOrderSuccess(result.data, customerPhone);
    } else {
      showToast(result?.message || "فشل إرسال الطلب", true);
    }
  } catch {
    showToast("حدث خطأ في الاتصال بالسيرفر", true);
  } finally {
    button.disabled = false;
    button.textContent = "تأكيد الطلب الآن 🚀";
  }
}

function showOrderSuccess(order, customerPhone) {
  document
    .getElementById("checkout-section")
    ?.classList.add("hidden");

  const container = document.getElementById("cart-items-container");

  if (!container) return;

  const orderId = order.orderId || order.id;

  container.innerHTML = `
    <div class="py-12 p-4 text-center">
      <span class="block mb-2 text-4xl">🎉</span>

      <h3 class="mb-1 text-base font-bold text-emerald-700">
        تم تأكيد طلبك بنجاح!
      </h3>

      <p class="mb-6 text-xs text-zinc-500">
        رقم الطلب: #${orderId}
      </p>

      <div class="space-y-2">
        <a
          href="orders.html?query=${encodeURIComponent(customerPhone)}"
          class="block w-full py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-lg"
        >
          متابعة الطلب
        </a>

        <button
          onclick="closeCart(); location.reload();"
          class="block w-full py-2 bg-zinc-100 text-zinc-700 text-xs rounded-lg"
        >
          متابعة التسوق
        </button>
      </div>
    </div>
  `;
}


// ========================================
// 5. عرض منتجات المتجر
// ========================================

async function loadProducts() {
  const grid = document.getElementById("products-grid");
  const loading = document.getElementById("loading-msg");
  const empty = document.getElementById("empty-msg");

  if (!grid) return;

  loading?.classList.remove("hidden");
  empty?.classList.add("hidden");
  grid.innerHTML = "";

  try {
    products = (await getProducts()) || [];

    if (!Array.isArray(products) || products.length === 0) {
      empty?.classList.remove("hidden");
      return;
    }

    grid.innerHTML = products.map((product) => {
      const outOfStock = Number(product.stock) <= 0;

      return `
        <div class="group flex flex-col bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-md transition-all">
          <div class="relative aspect-square bg-zinc-100 overflow-hidden">
            <img
              src="${product.image || ""}"
              alt="${product.title}"
              class="w-full h-full object-cover"
              loading="lazy"
              onerror="this.onerror=null;this.src='https://placehold.co/500x500?text=No+Image'"
            />

            ${outOfStock ? `
              <span class="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                نفد من المخزون
              </span>
            ` : ""}
          </div>

          <div class="flex flex-col flex-1 p-3.5">
            <h3 class="mb-1 text-sm font-bold text-zinc-900 line-clamp-1">
              ${product.title}
            </h3>

            <p class="mb-3 text-xs text-zinc-500 line-clamp-2">
              ${product.description || "لا يوجد وصف للمنتج."}
            </p>

            <div class="mt-auto mb-3 pt-2 flex items-center justify-between border-t border-zinc-100">
              <span class="text-base font-extrabold text-zinc-900">
                $${Number(product.price).toFixed(2)}
              </span>

              <span class="text-xs ${outOfStock ? "text-red-500" : "text-zinc-500"}">
                ${outOfStock ? "غير متوفر" : `المتوفر: ${product.stock}`}
              </span>
            </div>

            <button
              onclick="addToCart('${product.id}')"
              ${outOfStock ? "disabled" : ""}
              class="w-full h-9 px-3 bg-zinc-900 text-white text-xs font-semibold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              + أضف إلى السلة
            </button>
          </div>
        </div>
      `;
    }).join("");
  } catch {
    showToast("تعذر تحميل المنتجات من السيرفر", true);
    empty?.classList.remove("hidden");
  } finally {
    loading?.classList.add("hidden");
  }
}


// ========================================
// 6. البحث عن الطلبات وعرضها
// ========================================

async function searchOrders() {
  const query = document
    .getElementById("query-input")?.value.trim();

  const loading = document.getElementById("loading-msg");
  const empty = document.getElementById("empty-msg");
  const list = document.getElementById("orders-list");

  if (!list) return;

  list.innerHTML = "";
  empty?.classList.add("hidden");

  if (!query) {
    empty?.classList.remove("hidden");
    return;
  }

  loading?.classList.remove("hidden");

  try {
    const orders = (await getOrders(query)) || [];

    if (orders.length === 0) {
      empty?.classList.remove("hidden");
      return;
    }

    list.innerHTML = orders.map((order) => {
      const date = new Date(order.createdAt).toLocaleString("ar-EG");
      const delivered = order.status === "تم التسليم";
      const address = order.address || "غير محدد";

      const itemsHtml = (order.items || []).map((item) => `
        <div class="flex items-center justify-between text-xs">
          <span class="text-zinc-700 font-medium">
            ${item.title}
            <span class="text-zinc-400">×${item.quantity}</span>
          </span>

          <strong class="text-zinc-900">
            $${(item.price * item.quantity).toFixed(2)}
          </strong>
        </div>
      `).join("");

      return `
        <div
          class="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4"
          id="card-${order.id}"
        >
          <div class="flex items-center justify-between gap-2 pb-3 border-b border-zinc-100">
            <div>
              <span class="text-xs font-bold text-zinc-900">
                #${order.orderId || order.id}
              </span>
              <span class="ms-2 text-xs text-zinc-400">${date}</span>
            </div>

            <span class="px-2 py-0.5 rounded-full text-xs font-semibold ${
              delivered
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }">
              ${order.status || "قيد التجهيز"}
            </span>
          </div>

          <div class="text-xs space-y-1 text-zinc-600">
            <p>العميل: ${order.customerName}</p>
            <p>الهاتف: ${order.customerPhone}</p>

            <p>
              العنوان:
              <span id="addr-${order.id}">${address}</span>
            </p>
          </div>

          <div class="bg-zinc-50 rounded-lg p-3 space-y-2 border border-zinc-100">
            ${itemsHtml}
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-100">
            <div class="text-xs text-zinc-500">
              الإجمالي:
              <strong class="text-sm font-bold text-zinc-900">
                $${Number(order.totalAmount).toFixed(2)}
              </strong>
            </div>

            <div class="flex items-center gap-2">
              <button
                onclick="editAddress('${order.id}')"
                class="px-3 py-1.5 bg-zinc-100 text-zinc-800 text-xs font-semibold rounded-lg"
              >
                تعديل العنوان
              </button>

              <button
                onclick="cancelOrder('${order.id}', '${order.orderId || order.id}')"
                class="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg"
              >
                إلغاء الطلب
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  } catch {
    showToast("تعذر جلب الطلبات من السيرفر", true);
  } finally {
    loading?.classList.add("hidden");
  }
}


// ========================================
// 7. تعديل عنوان الطلب وإلغاؤه
// ========================================

async function editAddress(orderId) {
  const addressElement = document.getElementById(`addr-${orderId}`);

  if (!addressElement) return;

  const currentAddress = addressElement.textContent;

  const newAddress = prompt(
    "أدخل عنوان التوصيل الجديد:",
    currentAddress
  )?.trim();

  if (!newAddress || newAddress === currentAddress) return;

  try {
    const result = await updateOrder(orderId, {
      address: newAddress,
    });

    if (result?.success) {
      addressElement.textContent = newAddress;
      showToast("تم تحديث العنوان");
    } else {
      showToast(result?.message || "فشل تحديث العنوان", true);
    }
  } catch {
    showToast("حدث خطأ في الاتصال بالسيرفر", true);
  }
}

async function cancelOrder(orderId, displayId) {
  const confirmed = confirm(
    `هل أنت متأكد من إلغاء الطلب #${displayId}؟`
  );

  if (!confirmed) return;

  try {
    const result = await deleteOrder(orderId);

    if (!result?.success) {
      showToast(result?.message || "فشل إلغاء الطلب", true);
      return;
    }

    document.getElementById(`card-${orderId}`)?.remove();

    const list = document.getElementById("orders-list");

    if (list && list.children.length === 0) {
      document.getElementById("empty-msg")?.classList.remove("hidden");
    }

    showToast("تم إلغاء الطلب");
  } catch {
    showToast("حدث خطأ في الاتصال بالسيرفر", true);
  }
}


// ========================================
// 8. رسائل التنبيه
// ========================================

const TOAST_BASE =
  "fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-xs font-semibold text-white shadow-lg transition-opacity duration-200";

let toastTimer;

function showToast(message, isError = false) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;

  toast.className = `
    ${TOAST_BASE}
    opacity-100
    ${isError ? "bg-red-600" : "bg-zinc-900"}
  `;

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.className =
      `${TOAST_BASE} opacity-0 pointer-events-none bg-zinc-900`;
  }, 2500);
}


// ========================================
// 9. إدارة المنتجات
// ========================================

async function loadAdminProducts() {
  const loading = document.getElementById("loading-msg");
  const empty = document.getElementById("empty-msg");
  const tableWrap = document.getElementById("table-wrap");
  const tbody = document.getElementById("products-tbody");

  if (!tbody) return;

  loading?.classList.remove("hidden");
  empty?.classList.add("hidden");
  tableWrap?.classList.add("hidden");

  try {
    const adminProducts = (await getProducts()) || [];

    if (adminProducts.length === 0) {
      empty?.classList.remove("hidden");
      return;
    }

    tbody.innerHTML = adminProducts.map((product) => `
      <tr id="row-${product.id}" class="hover:bg-zinc-50">
        <td class="py-3 px-4">
          <img
            src="${product.image || ""}"
            alt="${product.title || ""}"
            class="w-10 h-10 object-cover rounded-lg border border-zinc-200"
            onerror="this.onerror=null;this.src='https://placehold.co/80x80?text=?'"
          />
        </td>

        <td class="py-3 px-4 font-semibold text-zinc-900">
          ${product.title || ""}
        </td>

        <td class="py-3 px-4 text-xs text-zinc-400">
          ${product.id}
        </td>

        <td class="py-3 px-4 font-bold text-zinc-900">
          $${Number(product.price).toFixed(2)}
        </td>

        <td class="py-3 px-4">
          <span class="px-2 py-0.5 rounded-full text-xs ${
            product.stock > 0
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }">
            ${product.stock > 0 ? product.stock : "نفد"}
          </span>
        </td>

        <td class="py-3 px-4 text-center">
          <div class="inline-flex items-center gap-1.5">
            <button
              onclick="openProductPanel('edit', '${product.id}')"
              class="px-2.5 py-1 text-xs bg-zinc-100 text-zinc-800 rounded-md"
            >
              تعديل
            </button>

            <button
              onclick="confirmDeleteProduct('${encodeURIComponent(String(product.id)).replace(/'/g, "%27")}', '${encodeURIComponent(String(product.title || "")).replace(/'/g, "%27")}')"
              class="px-2.5 py-1 text-xs bg-red-50 text-red-600 rounded-md"
            >
              حذف
            </button>
          </div>
        </td>
      </tr>
    `).join("");

    tableWrap?.classList.remove("hidden");
  } catch {
    showToast("تعذر تحميل المنتجات", true);
  } finally {
    loading?.classList.add("hidden");
  }
}


// فتح نموذج إضافة منتج أو تعديله
async function openProductPanel(mode, productId = null) {
  editingProductId = mode === "edit" ? productId : null;

  const endpoint = document.getElementById("panel-endpoint");
  const title = document.getElementById("panel-title");
  const note = document.getElementById("panel-note");
  const submitButton = document.getElementById("panel-submit-btn");

  const fields = {
    title: document.getElementById("f-title"),
    price: document.getElementById("f-price"),
    stock: document.getElementById("f-stock"),
    description: document.getElementById("f-desc"),
    image: document.getElementById("f-image"),
  };

  if (mode === "create") {
    endpoint.textContent = "POST /api/products";
    title.textContent = "إضافة منتج جديد";
    note.textContent = "إدخال بيانات المنتج وإرسالها إلى السيرفر.";
    submitButton.textContent = "إنشاء المنتج";

    Object.values(fields).forEach((field) => {
      if (field) field.value = "";
    });
  } else {
    try {
      const product = await getProductById(productId);

      if (!product) {
        showToast("تعذر جلب بيانات المنتج", true);
        return;
      }

      endpoint.textContent = `PUT /api/products/${product.id}`;
      title.textContent = "تعديل المنتج";
      note.textContent = "تعديل البيانات ثم حفظ التغييرات.";
      submitButton.textContent = "حفظ التعديلات";

      fields.title.value = product.title || "";
      fields.price.value = product.price ?? "";
      fields.stock.value = product.stock ?? "";
      fields.description.value = product.description || "";
      fields.image.value = product.image || "";
    } catch {
      showToast("تعذر جلب بيانات المنتج", true);
      return;
    }
  }

  document.getElementById("backdrop")?.classList.remove("hidden");

  const panel = document.getElementById("side-panel");

  if (panel) {
    panel.classList.remove("translate-x-full");
    panel.classList.add("translate-x-0");
  }

  fields.title?.focus();
}

function closeProductPanel() {
  document.getElementById("backdrop")?.classList.add("hidden");

  const panel = document.getElementById("side-panel");

  if (panel) {
    panel.classList.remove("translate-x-0");
    panel.classList.add("translate-x-full");
  }

  editingProductId = null;
}


// حفظ منتج جديد أو تعديل منتج موجود
async function submitProductPanel() {
  const button = document.getElementById("panel-submit-btn");

  const data = {
    title: document.getElementById("f-title")?.value.trim(),
    price: Number(document.getElementById("f-price")?.value),
    stock: Number(document.getElementById("f-stock")?.value),
    description: document.getElementById("f-desc")?.value.trim(),
    image: document.getElementById("f-image")?.value.trim() || undefined,
  };

  if (
    !data.title ||
    !data.description ||
    document.getElementById("f-price")?.value.trim() === "" ||
    document.getElementById("f-stock")?.value.trim() === "" ||
    !Number.isFinite(data.price) ||
    data.price < 0 ||
    !Number.isInteger(data.stock) ||
    data.stock < 0
  ) {
    showToast("يرجى إدخال بيانات صحيحة لجميع الحقول المطلوبة", true);
    return;
  }

  if (!button || button.disabled) return;

  button.disabled = true;
  button.textContent = "جاري الحفظ...";

  try {
    const result = editingProductId
      ? await updateProduct(editingProductId, data)
      : await createProduct(data);

    if (result?.success) {
      showToast(result.message || "تم حفظ المنتج بنجاح");
      closeProductPanel();
      await loadAdminProducts();
    } else {
      showToast(result?.message || "تعذر حفظ المنتج", true);
    }
  } catch {
    showToast("حدث خطأ في الاتصال بالسيرفر", true);
  } finally {
    button.disabled = false;
    button.textContent = editingProductId
      ? "حفظ التعديلات"
      : "إنشاء المنتج";
  }
}


// حذف منتج
async function confirmDeleteProduct(id, title) {
  id = decodeURIComponent(id);
  title = decodeURIComponent(title);

  if (!confirm(`هل تريد حذف المنتج "${title}"؟`)) return;

  try {
    const result = await deleteProduct(id);

    if (!result?.success) {
      showToast(result?.message || "فشل حذف المنتج", true);
      return;
    }

    document.getElementById(`row-${id}`)?.remove();

    const tbody = document.getElementById("products-tbody");

    if (tbody && tbody.children.length === 0) {
      document.getElementById("table-wrap")?.classList.add("hidden");
      document.getElementById("empty-msg")?.classList.remove("hidden");
    }

    showToast(result.message || "تم حذف المنتج");
  } catch {
    showToast("حدث خطأ في الاتصال بالسيرفر", true);
  }
}


// أسماء بديلة للتوافق مع أزرار HTML الحالية
const openPanel = openProductPanel;
const closePanel = closeProductPanel;
const submitPanel = submitProductPanel;
const confirmDelete = confirmDeleteProduct;


// ========================================
// 10. تشغيل الصفحة
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  updateCartUI();

  if (document.getElementById("products-grid")) {
    loadProducts();
  }

  if (document.getElementById("products-tbody")) {
    loadAdminProducts();
  }

  const queryInput = document.getElementById("query-input");

  if (queryInput) {
    const params = new URLSearchParams(location.search);
    const query =
      params.get("query") ||
      params.get("phone") ||
      params.get("orderId");

    if (query) {
      queryInput.value = query;
      searchOrders();
    }
  }
});