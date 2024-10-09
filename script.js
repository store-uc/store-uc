// دالة لفتح نافذة الدفع
function openPaymentModal() {
    document.getElementById('paymentModal').style.display = 'flex';
}

// دالة لإغلاق نافذة الدفع
function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

// دالة للحصول على الموقع الجغرافي
let userLocation = '';

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            userLocation = `${position.coords.latitude}, ${position.coords.longitude}`;
        }, error => {
            console.error('خطأ في الحصول على الموقع:', error);
            userLocation = 'تم رفض الوصول إلى الموقع';
        });
    } else {
        userLocation = 'تقنية الموقع غير مدعومة';
    }
}

// استدعاء الدالة للحصول على الموقع عند تحميل الصفحة
getUserLocation();

// إضافة متغير لتتبع حالة الطلب
let isPaymentProcessing = false;

// تعديل استجابة حدث تقديم النموذج
document.getElementById('paymentForm').addEventListener('submit', function(event) {
    event.preventDefault();

    if (isPaymentProcessing) {
        alert('Your previous payment is still being processed. Please wait.');
        return;
    }

    const phoneNumber = document.getElementById('phoneNumber').value;
    const playerID = document.getElementById('playerID').value;
    const screenshotInput = document.getElementById('screenshotUpload');
    
    // التحقق من صحة المدخلات
    if (!phoneNumber || !playerID || !screenshotInput.files.length) {
        alert('Please fill all fields and upload a screenshot.');
        return;
    }

    const file = screenshotInput.files[0];

    // استخدام التوكن في بيئة آمنة (تجنب تضمين البيانات الحساسة في الشيفرة)
    const telegramBotToken = '7752058903:AAERrAdCFjFxnmi1dFnjoDAZcipfS4u3k84'; // يجب نقل هذا إلى بيئة آمنة
    const chatId = '6597085386'; // نقل هذا إلى بيئة آمنة

    const message = `Payment confirmed!\nPhone Number: ${phoneNumber}\nPlayer ID: ${playerID}\nLocation: ${userLocation}`;

    // إرسال الرسالة إلى تيليجرام
    fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Message sent to Telegram:', data);

        // إرسال لقطة الشاشة إلى تيليجرام
        const formData = new FormData();
        formData.append('chat_id', chatId);
        formData.append('photo', file);

        return fetch(`https://api.telegram.org/bot${telegramBotToken}/sendPhoto`, {
            method: 'POST',
            body: formData
        });
    })
    .then(response => response.json())
    .then(data => {
        console.log('Screenshot sent to Telegram:', data);
        alert('Payment data has been successfully submitted!');
        isPaymentProcessing = false; // إعادة تعيين حالة الطلب
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while processing the payment.');
        isPaymentProcessing = false; // إعادة تعيين حالة الطلب
    });
});
