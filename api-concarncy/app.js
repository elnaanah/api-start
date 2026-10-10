// 1. الحصول على عناصر واجهة المستخدم
const amountInput = document.getElementById("amount");
const fromSelect = document.getElementById("from");
const toSelect = document.getElementById("to");
const convertBtn = document.getElementById("convert-btn");
const resultDiv = document.getElementById("result");

// 2. جلب سعر الصرف وحساب المبلغ المحوّل
async function convertCurrency() {
  const amount = amountInput.value;
  const from = fromSelect.value;
  const to = toSelect.value;

  // لا حاجة إلى طلب سعر صرف إذا كانت العملتان متطابقتين
  if (from === to) {
    resultDiv.textContent = `${amount} ${to}`;// سيتم عرض القيمة التي ادخلها المستخدم ورمز العملة to
    return;
  }

  // إبلاغ المستخدم بأن العملية قيد التنفيذ
  resultDiv.textContent = "جارٍ التحويل...";

  try {
    // إرسال طلب إلى Frankfurter API
    const response = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`
    );

    const data = await response.json();

    // قراءة سعر الصرف وحساب النتيجة
    const rate = data.rates[to];
    const finalResult = (amount * rate).toFixed(2);

    // عرض النتيجة
    resultDiv.textContent = `${finalResult} ${to}`;
  } catch (error) {
    // عرض رسالة إذا تعذّر إكمال الطلب
    resultDiv.textContent = "تعذّر جلب بيانات سعر الصرف. حاول مرة أخرى.";
  }
}

// 3. تنفيذ التحويل عند النقر على الزر وعند تحميل الصفحة
convertBtn.addEventListener("click", convertCurrency);
window.addEventListener("load", convertCurrency);
