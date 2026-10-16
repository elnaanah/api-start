# 📘 التوثيق المرجعي لواجهة البرمجة (REST API Documentation) — متجر نهضة تقنية

مرحباً بك في التوثيق الرسمي لواجهة برمجة التطبيقات (API) الخاصة بمتجر **نهضة تقنية**. يوضح هذا المستند جميع المسارات (Endpoints)، المعاملات (Parameters)، صيغ الطلبات (Request Bodies)، وهياكل البيانات المرجعة (Responses) المطلوبة لربط الواجهة الأمامية بالسيرفر عبر ملف `api.student.js`.

---

## 🏗️ هيكلية ملفات المشروع (Project Structure)

يعتمد المشروع على فصل كامل بين منطق واجهة المستخدم (UI/DOM) وبين منطق الاتصال بالـ API:

* **صفحات الواجهة (HTML):**
  * `index.html`: المتجر وسلة المشتريات وتأكيد الطلب.
  * `orders.html`: استعلام العميل عن طلباته برقم الهاتف وتعديل العنوان أو الإلغاء.
  * `products.html`: لوحة إدارة المنتجات (عرض في جدول، إضافة منتج جديد، تعديل، وحذف).
  * `orders-admin.html`: شاشة حية لاستقبال الطلبات وتحديث حالتها.
* **ملفات الجافاسكربت (JavaScript):**
  * `js/app.js`: **محرك الواجهة الموحد** — يتولى كل تعاملات الـ DOM، السلة، الـ Drawers الجانبية، رسائل الـ Toast، وتشغيل الصفحات تلقائياً دون الحاجة لكتابة أي كود واجهة من قبل الطالب.
  * `js/api.student.js`: **ملف عمل الطالب** — يحتوي على قوالب وتلميحات المهام البرمجية المطلوب إكمالها (دوال `fetch`).
  * `js/api.js`: **ملف الحل النموذجي** — يحتوي على الحل الكامل والمرجعي لجميع الدوال.

> 💡 **كيف تبدأ العمل كطالب؟**
> 1. افتح ملف `js/api.student.js`.
> 2. في صفحات الـ HTML التي تعمل عليها (`index.html`، `orders.html`، `products.html`)، تأكد من استدعاء:
>    ```html
>    <script src="js/api.student.js"></script>
>    <script src="js/app.js"></script>
>    ```
> 3. نفّذ الدوال خطوة بخطوة بالاستعانة بهذا التوثيق. عندما تنجز دالة، ستعمل صفحة الواجهة المقابلة لها تلقائياً بفضل `app.js`.

---

## ⚙️ 1. معلومات الاتصال الأساسية (Base Configuration)

* **الرابط الأساسي (Base URL):**
  ```text
  https://souk-albab.vercel.app/api
  ```
* **التوثيق والصلاحيات (Authentication):**
  جميع المسارات **عامة (Public)** ولا تتطلب إرسال رمز دخول (Token).
* **الترويسات المطلوبة (Headers):**
  في جميع طلبات الإضافة (`POST`) والتعديل (`PUT`)، يجب إرسال الترويسة التالية لتعريف السيرفر بأن البيانات المرسلة بصيغة JSON:
  ```json
  {
    "Content-Type": "application/json"
  }
  ```

---

## 📐 2. الهيكل الموحد لاستجابة السيرفر (Standard Response Format)

يرد السيرفر دائماً بكائن JSON يتبع هيكلاً موحداً في جميع المسارات:

### أ. في حالة النجاح (`200 OK` / `201 Created`):
```json
{
  "success": true,
  "message": "رسالة توضيحية عند الإضافة أو التعديل أو الحذف",
  "data": "البيانات المطلوبة (تكون مصفوفة [...] أو كائن {...})"
}
```

### ب. في حالة الخطأ (`400 Bad Request` / `404 Not Found` / `500 Server Error`):
```json
{
  "success": false,
  "message": "وصف سبب الخطأ (مثال: معرف المنتج مطلوب أو البيانات غير مكتملة)"
}
```

> ⚠️ **قاعدة ذهبية عند البرمجة في `api.js`:**
> 1. في دوال **القراءة (`GET`)** (`getProducts` و `getOrders` و `getProductById`): استخرج الحقل `json.data` فقط وأرجعه للواجهة (أو `[]` في حال الفشل).
> 2. في دوال **الكتابة (`POST`, `PUT`, `DELETE`)** (`createOrder`, `updateOrder`, `deleteOrder`, `createProduct`, `updateProduct`, `deleteProduct`): أرجع كائن الاستجابة كاملاً `return await res.json()` لأن الواجهة تحتاج قراءة `result.success` و `result.message`.

---

## 📦 3. مسارات المنتجات (Products API)

### 3.1 جلب جميع المنتجات
يجلب قائمة بجميع المنتجات المتوفرة في قاعدة البيانات لعرضها في المتجر أو لوحة الإدارة.

* **Method:** `GET`
* **Endpoint:** `/api/products`
* **الدالة المقابلة في `api.js`:** `getProducts()`
* **المعاملات (Parameters):** لا يوجد.

**مثال الاستجابة الناجحة (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "سماعات لاسلكية عازلة للضوضاء",
      "price": 49.99,
      "stock": 25,
      "description": "سماعات بلوتوث احترافية مع بطارية تدوم طويلاً",
      "image": "[https://images.unsplash.com/photo-1505740420928-5e560c06d30e](https://images.unsplash.com/photo-1505740420928-5e560c06d30e)"
    }
  ]
}
```

---

### 3.2 جلب تفاصيل منتج واحد بالمعرّف
يجلب بيانات منتج واحد محدد عبر المعرّف الفريد الخاص به (`id`).

* **Method:** `GET`
* **Endpoint:** `/api/products/:id`
* **الدالة المقابلة في `api.js`:** `getProductById(id)`

**معاملات المسار (Path Parameters):**
| المعامل | النوع | الحالة | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `String (UUID)` | **إجباري** | المعرف الفريد للمنتج في قاعدة البيانات |

**مثال الاستجابة الناجحة (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "سماعات لاسلكية عازلة للضوضاء",
    "price": 49.99,
    "stock": 25,
    "description": "سماعات بلوتوث احترافية مع بطارية تدوم طويلاً",
    "image": "[https://images.unsplash.com/photo-1505740420928-5e560c06d30e](https://images.unsplash.com/photo-1505740420928-5e560c06d30e)"
  }
}
```

---

### 3.3 إضافة منتج جديد
ينشئ منتجاً جديداً في قاعدة البيانات (يقوم السيرفر بتوليد `slug` و `scanCode` تلقائياً).

* **Method:** `POST`
* **Endpoint:** `/api/products`
* **الدالة المقابلة في `api.js`:** `createProduct(data)`
* **Headers:** `Content-Type: application/json`

**حقول الجسم المرسل (Request Body):**
| الحقل | النوع | الحالة | الوصف |
| :--- | :--- | :--- | :--- |
| `title` | `String` | **إجباري** | اسم المنتج |
| `price` | `Number` | **إجباري** | سعر المنتج بالدولار (مثال: `299.99`) |
| `stock` | `Number (Integer)` | **إجباري** | الكمية المتوفرة في المخزون (مثال: `50`) |
| `description` | `String` | **إجباري** | وصف ومواصفات المنتج |
| `image` | `String (URL)` | اختياري | رابط صورة المنتج على الإنترنت |

**مثال البيانات المرسلة (Request Payload):**
```json
{
  "title": "سماعات لاسلكية",
  "price": 49.99,
  "stock": 25,
  "description": "سماعات عازلة للضوضاء وبطارية تدوم طويلاً",
  "image": "[https://images.unsplash.com/photo-1505740420928-5e560c06d30e](https://images.unsplash.com/photo-1505740420928-5e560c06d30e)"
}
```

**مثال الاستجابة الناجحة (`201 Created`):**
```json
{
  "success": true,
  "message": "تم إنشاء المنتج بنجاح",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "سماعات لاسلكية",
    "price": 49.99,
    "stock": 25,
    "description": "سماعات عازلة للضوضاء وبطارية تدوم طويلاً",
    "image": "[https://images.unsplash.com/photo-1505740420928-5e560c06d30e](https://images.unsplash.com/photo-1505740420928-5e560c06d30e)"
  }
}
```

---

### 3.4 تعديل بيانات منتج
يُحدّث بيانات منتج موجود مسبقاً. يمكن إرسال الحقول المراد تعديلها فقط، ويتجاهل السيرفر الحقول الفارغة.

* **Method:** `PUT`
* **Endpoint:** `/api/products/:id`
* **الدالة المقابلة في `api.js`:** `updateProduct(id, data)`
* **Headers:** `Content-Type: application/json`

**معاملات المسار (Path Parameters):**
| المعامل | النوع | الحالة | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `String (UUID)` | **إجباري** | المعرف الفريد للمنتج المراد تعديله |

**حقول الجسم المرسل (Request Body):**
| الحقل | النوع | الحالة | الوصف |
| :--- | :--- | :--- | :--- |
| `title` | `String` | اختياري | الاسم الجديد للمنتج |
| `price` | `Number` | اختياري | السعر الجديد للمنتج |
| `stock` | `Number` | اختياري | المخزون الجديد |
| `description` | `String` | اختياري | الوصف الجديد |
| `image` | `String` | اختياري | رابط الصورة الجديد |

**مثال البيانات المرسلة (Request Payload):**
```json
{
  "price": 39.99,
  "stock": 15
}
```

**مثال الاستجابة الناجحة (`200 OK`):**
```json
{
  "success": true,
  "message": "تم تحديث المنتج بنجاح",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "سماعات لاسلكية",
    "price": 39.99,
    "stock": 15
  }
}
```

---

### 3.5 حذف منتج نهائياً
يحذف المنتج المحدد من قاعدة البيانات نهائياً.

* **Method:** `DELETE`
* **Endpoint:** `/api/products/:id`
* **الدالة المقابلة في `api.js`:** `deleteProduct(id)`

**معاملات المسار (Path Parameters):**
| المعامل | النوع | الحالة | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `String (UUID)` | **إجباري** | المعرف الفريد للمنتج المراد حذفه |

**مثال الاستجابة الناجحة (`200 OK`):**
```json
{
  "success": true,
  "message": "تم حذف المنتج بنجاح"
}
```

---

## 🛒 4. مسارات الطلبات (Orders API)

### 4.1 إنشاء طلب شراء مجمع (من السلة)
يستقبل بيانات العميل ومصفوفة المنتجات الموجودة في سلة المشتريات، ويحسب السعر الإجمالي في السيرفر ويحفظ الطلب.

* **Method:** `POST`
* **Endpoint:** `/api/orders`
* **الدالة المقابلة في `api.js`:** `createOrder(data)`
* **Headers:** `Content-Type: application/json`

**حقول الجسم المرسل (Request Body):**
| الحقل | النوع | الحالة | الوصف |
| :--- | :--- | :--- | :--- |
| `customerName` | `String` | **إجباري** | الاسم الكامل للمشتري |
| `customerPhone` | `String` | **إجباري** | رقم هاتف المشتري (يُستخدم لاحقاً لتتبع الطلب) |
| `address` | `String` | اختياري | عنوان التوصيل التفصيلي |
| `items` | `Array<Object>` | **إجباري** | مصفوفة العناصر المطلوبة (يجب أن تحتوي على عنصر واحد على الأقل) |
| `items[].productId` | `String (UUID)` | **إجباري** | المعرف الفريد للمنتج (`id`) |
| `items[].quantity` | `Number (Integer)` | **إجباري** | الكمية المطلوبة من هذا المنتج |

**مثال البيانات المرسلة (Request Payload):**
```json
{
  "customerName": "أحمد محمد",
  "customerPhone": "0999123456",
  "address": "دمشق، المزة",
  "items": [
    { "productId": "550e8400-e29b-41d4-a716-446655440000", "quantity": 2 },
    { "productId": "7c9e6679-7425-40de-944b-e07fc1f90ae7", "quantity": 1 }
  ]
}
```

**مثال الاستجابة الناجحة (`201 Created`):**
```json
{
  "success": true,
  "message": "تم تأكيد طلبك بنجاح!",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "orderId": 1001,
    "customerName": "أحمد محمد",
    "customerPhone": "0999123456",
    "address": "دمشق، المزة",
    "status": "قيد التجهيز",
    "totalAmount": 149.97,
    "createdAt": "2026-10-16T10:00:00.000Z",
    "items": [
      {
        "productId": "550e8400-e29b-41d4-a716-446655440000",
        "title": "سماعات لاسلكية",
        "price": 49.99,
        "quantity": 2
      },
      {
        "productId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        "title": "حقيبة ظهر",
        "price": 49.99,
        "quantity": 1
      }
    ]
  }
}
```

---

### 4.2 جلب جميع الطلبات أو البحث والتصفية
يُستخدم بدون معاملات لجلب كافة الطلبات في لوحة الإدارة، أو مع معاملات البحث (`Query Parameters`) في صفحة `orders.html` لتتبع طلبات عميل معين.

* **Method:** `GET`
* **Endpoint:** `/api/orders`
* **الدالة المقابلة في `api.js`:** `getOrders(query)`

**معاملات الاستعلام في الرابط (Query Parameters - اختيارية):**
| المعامل | مثال في الرابط | الوصف |
| :--- | :--- | :--- |
| `phone` | `/api/orders?phone=0999123456` | يجلب جميع الطلبات المرتبطة برقم الهاتف المدخل |
| `orderId` | `/api/orders?orderId=1001` | يجلب الطلب المطابق لرقم الفاتورة المختصر |

**مثال الاستجابة الناجحة (`200 OK`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "orderId": 1001,
      "customerName": "أحمد محمد",
      "customerPhone": "0999123456",
      "address": "دمشق، المزة",
      "status": "قيد التجهيز",
      "totalAmount": 149.97,
      "createdAt": "2026-10-16T10:00:00.000Z",
      "items": [
        {
          "title": "سماعات لاسلكية",
          "price": 49.99,
          "quantity": 2
        }
      ]
    }
  ]
}
```
> 💡 **ملاحظة مهمة:** الحقل `id` (UUID) هو المعرف البرمجي الذي نمرره في مسارات التعديل والحذف (`PUT /api/orders/:id` و `DELETE /api/orders/:id`)، بينما `orderId` (مثل `1001`) هو رقم الفاتورة المختصر المخصص للعرض والبحث.

---

### 4.3 تعديل بيانات الطلب أو حالته
يُستخدم من قِبل العميل في صفحة `orders.html` لتعديل عنوان التوصيل، أو من قِبل المدرب في `orders-admin.html` لتحديث حالة الطلب.

* **Method:** `PUT`
* **Endpoint:** `/api/orders/:id`
* **الدالة المقابلة في `api.js`:** `updateOrder(id, data)`
* **Headers:** `Content-Type: application/json`

**معاملات المسار (Path Parameters):**
| المعامل | النوع | الحالة | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `String (UUID)` | **إجباري** | المعرف البرمجي الفريد للطلب (`order.id`) |

**حقول الجسم المرسل (Request Body):**
| الحقل | النوع | الحالة | القيم المسموحة / الوصف |
| :--- | :--- | :--- | :--- |
| `address` | `String` | اختياري | عنوان التوصيل الجديد |
| `customerName` | `String` | اختياري | اسم العميل المعدل |
| `customerPhone` | `String` | اختياري | رقم الهاتف المعدل |
| `status` | `String` | اختياري | `"قيد التجهيز"` \| `"تم الشحن"` \| `"تم التسليم"` \| `"ملغي"` |

**مثال البيانات المرسلة لتعديل العنوان (Request Payload):**
```json
{
  "address": "دمشق، مشروع دمر، الجزيرة 10"
}
```

**مثال الاستجابة الناجحة (`200 OK`):**
```json
{
  "success": true,
  "message": "تم تحديث الطلب بنجاح",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "address": "دمشق، مشروع دمر، الجزيرة 10",
    "status": "قيد التجهيز"
  }
}
```

---

### 4.4 إلغاء وحذف الطلب نهائياً
يقوم بإلغاء الطلب وحذفه نهائياً من قاعدة البيانات.

* **Method:** `DELETE`
* **Endpoint:** `/api/orders/:id`
* **الدالة المقابلة في `api.js`:** `deleteOrder(id)`

**معاملات المسار (Path Parameters):**
| المعامل | النوع | الحالة | الوصف |
| :--- | :--- | :--- | :--- |
| `id` | `String (UUID)` | **إجباري** | المعرف البرمجي الفريد للطلب (`order.id`) |

**مثال الاستجابة الناجحة (`200 OK`):**
```json
{
  "success": true,
  "message": "تم إلغاء وحذف الطلب بنجاح"
}
```

---

## 💻 5. ملخص المهام البرمجية المطلوبة من الطالب في ملف `api.student.js`

لربط المتجر بالكامل، افتح ملف `js/api.student.js` وأكمل الدوال التالية بالاعتماد على التوثيق أعلاه:

| رقم المهمة | اسم الدالة | المسار والطريقة | الصفحة المرتبطة | القيمة التي يجب أن ترجعها الدالة (`return`) |
| :--- | :--- | :--- | :--- | :--- |
| **المهمة 1** | `getProducts()` | `GET /api/products` | `index.html` + `products.html` | مصفوفة المنتجات: `json.data \|\| []` |
| **المهمة 2** | `createOrder(data)` | `POST /api/orders` | `index.html` (السلة) | كائن الاستجابة كاملاً: `await res.json()` |
| **المهمة 3** | `getOrders(phone)` | `GET /api/orders?phone=...` | `orders.html` | مصفوفة الطلبات: `json.data \|\| []` |
| **المهمة 4** | `updateOrder(id, data)` | `PUT /api/orders/:id` | `orders.html` | كائن الاستجابة كاملاً: `await res.json()` |
| **المهمة 5** | `deleteOrder(id)` | `DELETE /api/orders/:id` | `orders.html` | كائن الاستجابة كاملاً: `await res.json()` |
| **المهمة 6** | `getProductById(id)` | `GET /api/products/:id` | `products.html` (زر تعديل) | كائن المنتج: `json.data \|\| null` |
| **المهمة 7** | `createProduct(data)` | `POST /api/products` | `products.html` | كائن الاستجابة كاملاً: `await res.json()` |
| **المهمة 8** | `updateProduct(id, data)` | `PUT /api/products/:id` | `products.html` | كائن الاستجابة كاملاً: `await res.json()` |
| **المهمة 9** | `deleteProduct(id)` | `DELETE /api/products/:id` | `products.html` | كائن الاستجابة كاملاً: `await res.json()` |

---

### 💡 نصائح ذهبية للحل:
1. دوال القراءة (`GET`) تُرجع البيانات المستخرجة فقط: `json.data`.
2. دوال الإرسال والتعديل والحذف (`POST` / `PUT` / `DELETE`) تُرجع كائن الاستجابة كاملاً: `await res.json()` ليتمكن `app.js` من قراءة `result.success` و `result.message` وعرض تنبيه Toast للمستخدم.
3. طلبات `POST` و `PUT` تتطلب إرسال الترويسة:
   ```javascript
   headers: { "Content-Type": "application/json" }
   ```
   وتحويل البيانات إلى نص بـ: `body: JSON.stringify(data)`.