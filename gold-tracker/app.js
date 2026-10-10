// 1. جلب العناصر من صفحة HTML
const ounceEl = document.getElementById("ounce");
const g24El = document.getElementById("g24");
const g21El = document.getElementById("g21");

const gramsInput = document.getElementById("grams");
const karatSelect = document.getElementById("karat");
const calcBtn = document.getElementById("calc-btn");
const resultEl = document.getElementById("result");

// متغيرات لتخزين الأسعار
let price24 = 0;
let price21 = 0;

// 2. دالة جلب أسعار الذهب من الـ API
async function getGoldPrices() {
  try {
    const response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT");
    const data = await response.json();

    const ounce = parseFloat(data.price);

    // حساب سعر غرام 24 وغرام 21 (الأونصة تعادل 31.1 غرام تقريباً)
    price24 = ounce / 31.1;
    price21 = price24 * (21 / 24);

    // عرض الأسعار في الصفحة
    ounceEl.textContent = `$${ounce.toFixed(2)}`;
    g24El.textContent = `$${price24.toFixed(2)}`;
    g21El.textContent = `$${price21.toFixed(2)}`;

    calculate();
  } catch (error) {
    resultEl.textContent = "خطأ في جلب البيانات";
  }
}

// 3. دالة حساب قيمة الغرامات بالدولار
function calculate() {
  const grams = gramsInput.value;
  const is24 = karatSelect.value === "24";
  const price = is24 ? price24 : price21;

  const total = (grams * price).toFixed(2);
  resultEl.textContent = `$${total} دولار`;
}

// 4. تشغيل الدوال عند النقر وعند فتح الصفحة
calcBtn.addEventListener("click", calculate);
window.addEventListener("load", getGoldPrices);
