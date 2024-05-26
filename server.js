const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');


// Переменные для хранения 
let amount = ""
let nameshop = ""
let payId = ""

const PORT = 8001


// Установка статической папки
app.use(express.static(path.join(__dirname, 'public')));


// Маршрут для главной страницы
app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'shop.html'));
});


app.get('/pay', async (req, res) => {
  const url = "http://renpay.nikcorp.ru:8080/pay"; // Замените на ваш реальный URL

  try {

    const jsonData = {
      "amount": 539
    };

    const response = await axios.post(url, jsonData); // Отправка POST запроса
    console.log('Response:', response.data);
    res.send(response.data); // Отправка ответа клиенту, чтобы не было бесконечного запроса
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).send('Internal Server Error'); // Отправка ошибки клиенту
  }
});



app.get('/client_pay', async (req, res) => {
  const url = 'http://renpay.nikcorp.ru/client_pay';
  const token = req.query.token;
  console.log("Token from /client_pay " + token);

  const jsonData = JSON.stringify({
    token: token
  });

  // Отправка GET-запроса с параметрами
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type': 'application/json'
    },
    data: jsonData
  };

  try {
    const response = await axios.request(config);
    const amount = response.data.amount;
    const nameshop = response.data.nameshop;
    const payId = response.data.payId;
    console.log(`Data Receiving: ${amount} ${nameshop} ${payId}`);
    
    // Теперь, когда мы уверены, что все данные получены, мы можем безопасно перенаправить пользователя
    res.send(response.data)
  } catch (error) {
    console.log(error);
    // Обработка ошибки, например, отправка ответа с кодом ошибки
    res.status(500).send('Internal Server Error');
  }
});

 

app.get('/pay_status', (req, res) => {
  const url = 'http://renpay.nikcorp.ru/pay_status'
  const jsonData = JSON.stringify({
    payId : payId
  })

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: {
      'Content-Type':'application/json'
    },
    data: jsonData
  };
  axios.request(config)
  .then((response) => {
    console.log("Opetion finish successfully");
    res.send(response.data) // Отправляем ответ, чтобы не было бесконечного запроса
  })
  .catch((error) => {
    console.log(error);
  });

});


app.get('/ren', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ren.html'))
});

app.get('/ren_accept', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ren_accept.html'))
});

app.listen(PORT, () => { 
  console.log(`Server is running on http://localhost:${PORT}`);
});
