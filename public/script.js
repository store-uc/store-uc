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
    event.preventDefault(); // منع إعادة تحميل الصفحة

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

    // إعداد البيانات التي سيتم إرسالها إلى الخادم
    const paymentData = {
        phoneNumber,
        playerID,
        location: userLocation, // إرسال الموقع الجغرافي
    };

    // إرسال البيانات إلى الخادم الخلفي (Node.js)
    fetch('/sendPaymentData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData), // تحويل البيانات إلى JSON
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Payment data has been successfully submitted!');
            closePaymentModal(); // يمكنك هنا إغلاق نافذة الدفع بعد نجاح الطلب
        } else {
            alert('An error occurred while processing the payment.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred.');
    });
});
