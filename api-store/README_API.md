# توثيق واجهة البرمجة (REST API)
## متجر سوق الباب

يوثّق هذا الملف واجهة API التي تعتمد عليها واجهة متجر سوق الباب في عرض المنتجات، وإنشاء الطلبات، ومتابعتها، وإدارة المنتجات والطلبات.

> **نطاق التوثيق:** بُنيت المسارات والحقول وأمثلة الاستخدام على استدعاءات الواجهة في `app.js`، ودوال الربط في `api.js`، والتوثيق السابق للمشروع. أمثلة الاستجابات توضيحية للشكل المتوقع من الواجهة، وليست سجلات حرفية ملتقطة من الخادم.

---

## 1. معلومات أساسية

| الخاصية | القيمة |
|---|---|
| نوع الواجهة | REST API |
| صيغة البيانات | JSON |
| عنوان API الأساسي | `https://souk-albab.vercel.app/api` |
| مسار المنتجات | `/products` |
| مسار الطلبات | `/orders` |
| ترويسة طلبات JSON | `Content-Type: application/json` |

تُرسل طلبات الإضافة والتعديل بصيغة JSON. لا تحتاج طلبات القراءة والحذف إلى جسم طلب في الاستخدام الحالي للواجهة.

## 2. نموذج الاستجابة

تعتمد الواجهة على شكلين أساسيين من القيم المعادة من دوال الربط:

### 2.1 استجابات القراءة

تستخرج دوال القراءة محتوى `data` من استجابة الخادم:

- `getProducts()` يعيد مصفوفة المنتجات، أو مصفوفة فارغة عند عدم توفر بيانات.
- `getOrders(phone)` يعيد مصفوفة الطلبات، أو مصفوفة فارغة عند عدم توفر بيانات.
- `getProductById(id)` يعيد كائن المنتج، أو `null` عند عدم توفره.

الشكل المتوقع لاستجابة الخادم عند جلب قائمة:

```json
{
  "success": true,
  "data": []
}
```

### 2.2 استجابات الإضافة والتعديل والحذف

تُبقي دوال الكتابة كائن استجابة الخادم كاملًا؛ إذ تفحص الواجهة الحقل `success`، وتعرض `message` عند الفشل.

```json
{
  "success": true,
  "message": "تم تنفيذ العملية بنجاح",
  "data": {}
}
```

وعند الفشل، تتوقع الواجهة كائنًا يحتوي على `success: false` ورسالة توضيحية في `message` متى أعادها الخادم:

```json
{
  "success": false,
  "message": "تعذر تنفيذ العملية"
}
```

يجب على العميل عدم الاعتماد على نص رسالة بعينه؛ فقد تختلف الرسائل بحسب العملية والخطأ.

---

## 3. المنتجات (Products API)

### 3.1 جلب جميع المنتجات

يجلب المنتجات التي تعرضها صفحة المتجر، وتستخدم لوحة إدارة المنتجات الدالة نفسها لعرض القائمة.

- **Method:** `GET`
- **Endpoint:** `/products`
- **الدالة في `api.js`:** `getProducts()`
- **Request body:** لا يوجد
- **المعاملات:** لا توجد معاملات مطلوبة

مثال الطلب:

```http
GET https://souk-albab.vercel.app/api/products
```

الحقول التي تعتمد عليها الواجهة عند عرض المنتج:

| الحقل | النوع المتوقع | الاستخدام |
|---|---|---|
| `id` | String | معرّف المنتج، ويُستخدم في السلة والتعديل والحذف |
| `title` | String | اسم المنتج |
| `price` | Number | سعر المنتج |
| `stock` | Number | الكمية المتوفرة |
| `description` | String | وصف المنتج |
| `image` | String (URL) | رابط صورة المنتج |

قد تستخدم الواجهة `description` أو `image` كقيمة اختيارية، لكن يجب توفير `id` و`title` و`price` و`stock` كي تعمل وظائف العرض والسلة على النحو المتوقع.

مثال استجابة متوقعة:

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "سماعات لاسلكية",
      "price": 49.99,
      "stock": 25,
      "description": "سماعات بلوتوث لاسلكية",
      "image": "https://example.com/images/headphones.jpg"
    }
  ]
}
```

### 3.2 جلب منتج بواسطة المعرّف

يُستخدم لجلب بيانات منتج واحد، مثل تعبئة نموذج تعديل المنتج.

- **Method:** `GET`
- **Endpoint:** `/products/:id`
- **الدالة في `api.js`:** `getProductById(id)`
- **Path parameter:** `id` — معرّف المنتج

مثال الطلب:

```http
GET https://souk-albab.vercel.app/api/products/550e8400-e29b-41d4-a716-446655440000
```

مثال استجابة متوقعة:

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "سماعات لاسلكية",
    "price": 49.99,
    "stock": 25,
    "description": "سماعات بلوتوث لاسلكية",
    "image": "https://example.com/images/headphones.jpg"
  }
}
```

### 3.3 إضافة منتج

تُستخدم لإضافة منتج من لوحة الإدارة.

- **Method:** `POST`
- **Endpoint:** `/products`
- **الدالة في `api.js`:** `createProduct(data)`
- **Headers:** `Content-Type: application/json`

حقول جسم الطلب:

| الحقل | النوع المتوقع | الاستخدام |
|---|---|---|
| `title` | String | اسم المنتج |
| `price` | Number | سعر المنتج |
| `stock` | Number | كمية المخزون |
| `description` | String | وصف المنتج |
| `image` | String (URL) | رابط صورة المنتج |

مثال الطلب:

```http
POST https://souk-albab.vercel.app/api/products
Content-Type: application/json
```

```json
{
  "title": "سماعات لاسلكية",
  "price": 49.99,
  "stock": 25,
  "description": "سماعات بلوتوث لاسلكية",
  "image": "https://example.com/images/headphones.jpg"
}
```

مثال استجابة متوقعة:

```json
{
  "success": true,
  "message": "تم إنشاء المنتج بنجاح",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "سماعات لاسلكية",
    "price": 49.99,
    "stock": 25,
    "description": "سماعات بلوتوث لاسلكية",
    "image": "https://example.com/images/headphones.jpg"
  }
}
```

### 3.4 تعديل منتج

يُستخدم لتحديث بيانات منتج موجود.

- **Method:** `PUT`
- **Endpoint:** `/products/:id`
- **الدالة في `api.js`:** `updateProduct(id, data)`
- **Path parameter:** `id` — معرّف المنتج
- **Headers:** `Content-Type: application/json`

يمكن للواجهة إرسال الحقول المراد تعديلها ضمن كائن `data`. يجب أن تتوافق الحقول والقيم المقبولة مع قواعد الخادم.

مثال الطلب:

```http
PUT https://souk-albab.vercel.app/api/products/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
```

```json
{
  "price": 39.99,
  "stock": 15
}
```

مثال استجابة متوقعة:

```json
{
  "success": true,
  "message": "تم تحديث المنتج بنجاح",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "price": 39.99,
    "stock": 15
  }
}
```

### 3.5 حذف منتج

- **Method:** `DELETE`
- **Endpoint:** `/products/:id`
- **الدالة في `api.js`:** `deleteProduct(id)`
- **Path parameter:** `id` — معرّف المنتج
- **Request body:** لا يوجد

مثال الطلب:

```http
DELETE https://souk-albab.vercel.app/api/products/550e8400-e29b-41d4-a716-446655440000
```

مثال استجابة متوقعة:

```json
{
  "success": true,
  "message": "تم حذف المنتج بنجاح"
}
```

---

## 4. الطلبات (Orders API)

### 4.1 إنشاء طلب شراء

تستدعي الواجهة هذه العملية عند تأكيد محتويات سلة المشتريات. ترسل معلومات العميل ومصفوفة العناصر، ويجب أن يتضمن كل عنصر معرّف المنتج والكمية المطلوبة.

- **Method:** `POST`
- **Endpoint:** `/orders`
- **الدالة في `api.js`:** `createOrder(data)`
- **Headers:** `Content-Type: application/json`

حقول جسم الطلب التي ترسلها الواجهة:

| الحقل | النوع المتوقع | الاستخدام |
|---|---|---|
| `customerName` | String | اسم العميل؛ مطلوب في نموذج الواجهة |
| `customerPhone` | String | رقم الهاتف؛ مطلوب في نموذج الواجهة ويُستخدم في البحث عن الطلبات |
| `address` | String | عنوان التوصيل؛ ترسل الواجهة `"غير محدد"` إذا تُرك فارغًا |
| `items` | Array of objects | عناصر سلة المشتريات |
| `items[].productId` | String | معرّف المنتج |
| `items[].quantity` | Number | الكمية المطلوبة |

مثال الطلب:

```http
POST https://souk-albab.vercel.app/api/orders
Content-Type: application/json
```

```json
{
  "customerName": "أحمد محمد",
  "customerPhone": "0999123456",
  "address": "حلب، الباب",
  "items": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440000",
      "quantity": 2
    }
  ]
}
```

تتحقق الواجهة من وجود الاسم ورقم الهاتف ومن أن السلة غير فارغة قبل إرسال الطلب. عند النجاح، تتوقع أن تكون الاستجابة على النحو التالي:

- `success` تساوي `true`.
- `data` يحتوي على بيانات الطلب المنشأ.
- تحتوي بيانات الطلب على `orderId` أو `id` لعرض رقم الطلب.

مثال استجابة متوقعة:

```json
{
  "success": true,
  "message": "تم تأكيد طلبك بنجاح",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "orderId": 1001,
    "customerName": "أحمد محمد",
    "customerPhone": "0999123456",
    "address": "حلب، الباب",
    "status": "قيد التجهيز",
    "totalAmount": 99.98,
    "createdAt": "2026-10-16T10:00:00.000Z",
    "items": [
      {
        "productId": "550e8400-e29b-41d4-a716-446655440000",
        "title": "سماعات لاسلكية",
        "price": 49.99,
        "quantity": 2
      }
    ]
  }
}
```

### 4.2 البحث عن الطلبات برقم الهاتف

تستخدم صفحة متابعة الطلبات القيمة التي يدخلها العميل في حقل البحث لاستدعاء `getOrders(query)`. يمرّر ملف الربط القيمة ضمن معامل الاستعلام `phone`.

- **Method:** `GET`
- **Endpoint:** `/orders`
- **الدالة في `api.js`:** `getOrders(phone)`
- **Query parameter:** `phone` — رقم الهاتف الذي تبحث الواجهة عن طلباته

مثال الطلب:

```http
GET https://souk-albab.vercel.app/api/orders?phone=0999123456
```

مثال استجابة متوقعة:

```json
{
  "success": true,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "orderId": 1001,
      "customerName": "أحمد محمد",
      "customerPhone": "0999123456",
      "address": "حلب، الباب",
      "status": "قيد التجهيز",
      "totalAmount": 99.98,
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

تتعامل الواجهة مع `data` على أنها مصفوفة. وقد تكون المصفوفة فارغة إذا لم توجد طلبات مطابقة.

### 4.3 تعديل بيانات الطلب

تستخدم الواجهة هذه العملية حاليًا لتعديل عنوان التوصيل. كما توفر دالة مساعدة لتحديث حالة الطلب في لوحة الإدارة.

- **Method:** `PUT`
- **Endpoint:** `/orders/:id`
- **الدالة في `api.js`:** `updateOrder(id, data)`
- **الدالة المساعدة:** `updateOrderStatus(id, status)`
- **Path parameter:** `id` — المعرّف البرمجي للطلب
- **Headers:** `Content-Type: application/json`

مثال تعديل العنوان:

```http
PUT https://souk-albab.vercel.app/api/orders/a1b2c3d4-e5f6-7890-abcd-ef1234567890
Content-Type: application/json
```

```json
{
  "address": "حلب، الباب، شارع السوق"
}
```

مثال تحديث الحالة باستخدام الدالة المساعدة:

```javascript
await updateOrderStatus("a1b2c3d4-e5f6-7890-abcd-ef1234567890", "تم الشحن");
```

الدالة المساعدة لا تستخدم مسارًا مستقلًا؛ بل تستدعي `updateOrder(id, { status })`. يجب أن تكون قيم الحالة متوافقة مع القيم التي يقبلها الخادم. ومن أمثلة الحالات المذكورة في توثيق المشروع: `قيد التجهيز`، `تم الشحن`، `تم التسليم`، `ملغي`.

مثال استجابة متوقعة:

```json
{
  "success": true,
  "message": "تم تحديث الطلب بنجاح",
  "data": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "address": "حلب، الباب، شارع السوق",
    "status": "قيد التجهيز"
  }
}
```

### 4.4 حذف الطلب أو إلغاؤه

تستخدم صفحة متابعة الطلبات هذه العملية بعد تأكيد المستخدم الإلغاء. وفق سلوك الواجهة الحالي، يؤدي نجاح الطلب إلى إزالة بطاقة الطلب من الصفحة.

- **Method:** `DELETE`
- **Endpoint:** `/orders/:id`
- **الدالة في `api.js`:** `deleteOrder(id)`
- **Path parameter:** `id` — المعرّف البرمجي للطلب
- **Request body:** لا يوجد

مثال الطلب:

```http
DELETE https://souk-albab.vercel.app/api/orders/a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

مثال استجابة متوقعة:

```json
{
  "success": true,
  "message": "تم إلغاء وحذف الطلب بنجاح"
}
```

---

## 5. ملخص المسارات

| Method | Endpoint | الغرض | الدالة المرتبطة |
|---|---|---|---|
| `GET` | `/products` | جلب المنتجات | `getProducts()` |
| `GET` | `/products/:id` | جلب منتج واحد | `getProductById(id)` |
| `POST` | `/products` | إضافة منتج | `createProduct(data)` |
| `PUT` | `/products/:id` | تعديل منتج | `updateProduct(id, data)` |
| `DELETE` | `/products/:id` | حذف منتج | `deleteProduct(id)` |
| `POST` | `/orders` | إنشاء طلب | `createOrder(data)` |
| `GET` | `/orders?phone=...` | البحث عن طلبات برقم الهاتف | `getOrders(phone)` |
| `PUT` | `/orders/:id` | تعديل بيانات الطلب أو حالته | `updateOrder(id, data)` |
| `DELETE` | `/orders/:id` | حذف الطلب أو إلغاؤه | `deleteOrder(id)` |

---

## 6. استخدام الدوال من الواجهة

تعرّف `api.js` دوالًا غير مرتبطة مباشرة بعناصر الصفحة؛ وتستخدمها وظائف `app.js` لتنفيذ عمليات الواجهة.

```javascript
// جلب المنتجات
const products = await getProducts();

// إنشاء طلب
const result = await createOrder({
  customerName: "أحمد محمد",
  customerPhone: "0999123456",
  address: "حلب، الباب",
  items: [
    {
      productId: "550e8400-e29b-41d4-a716-446655440000",
      quantity: 2
    }
  ]
});

// البحث عن الطلبات
const orders = await getOrders("0999123456");

// تعديل عنوان الطلب
const updateResult = await updateOrder("ORDER_UUID", {
  address: "حلب، الباب، شارع السوق"
});

// حذف الطلب
const deleteResult = await deleteOrder("ORDER_UUID");
```

تُعيد دوال القراءة البيانات التي تحتاجها الواجهة مباشرة، بينما تُعيد دوال الكتابة كائن استجابة الخادم كاملًا حتى تتمكن الواجهة من فحص `success` وعرض `message`.

## 7. التعامل مع الأخطاء

تعرض الواجهة رسائل للمستخدم عند فشل عمليات التحميل أو الكتابة، وتتعامل مع أخطاء الاتصال باستخدام `try/catch`. ينبغي للعميل:

1. معالجة فشل الاتصال أو تعذر قراءة JSON.
2. فحص `result.success` بعد عمليات الإضافة والتعديل والحذف.
3. عرض `result.message` عند توفرها، وإظهار رسالة عامة عند غيابها.
4. التعامل مع مصفوفة فارغة عند عدم وجود منتجات أو طلبات.
5. عدم افتراض أن نجاح طلب HTTP وحده يعني نجاح العملية التجارية؛ بل يجب فحص كائن الاستجابة أيضًا.

رموز HTTP الدقيقة ورسائل الأخطاء الفعلية يجب تأكيدها من استجابات الخادم المنشورة؛ فالأمثلة في هذا الملف توضح عقد البيانات الذي تحتاجه الواجهة.

---

## 8. ملاحظات مهمة

- المعرّف `id` هو المعرّف البرمجي المستخدم في مسارات التعديل والحذف.
- الحقل `orderId` يُستخدم لعرض رقم الطلب للعميل إذا وفره الخادم؛ وتعود الواجهة إلى `id` إذا لم يتوفر.
- ترسل الواجهة عناصر السلة في صورة `productId` و`quantity`، ولا ترسل السعر بوصفه مصدرًا موثوقًا لحساب قيمة الطلب.
- يجب إرسال رابط الصورة في الحقل `image` كرابط URL نصي مباشر، وليس كرابط Markdown.
- يصف هذا الملف ما تحتاجه الواجهة والحقول المتوقعة وفق الملفات المتاحة. أما قواعد التحقق الداخلية، وصلاحيات الخادم، ورموز HTTP الدقيقة، والحقول الإضافية، فلا ينبغي اعتبارها مؤكدة ما لم يثبتها تنفيذ الخادم أو اختبار مباشر له.

---

**اسم الملف المقترح:** `README.md`  
**المشروع:** متجر سوق الباب  
**نوع التوثيق:** توثيق REST API موجّه لمطوري الواجهة الأمامية.
