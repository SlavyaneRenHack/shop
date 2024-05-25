const express = require('express');
const path = require('path');
const app = express();
const axios = require('axios');

// Переменные для хранения 
let token = ""
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
    token = response.data
    res.send(response.data); // Отправка ответа клиенту, чтобы не было бесконечного запроса
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).send('Internal Server Error'); // Отправка ошибки клиенту
  }
});



app.get('/client_pay', (req, res) => {
  const url = 'http://renpay.nikcorp.ru/client_pay'
  const jsonData = JSON.stringify({
    token : token
  })
  // Отправка GET-запроса с параметрами
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url,
    headers: { 
      'Content-Type': 'application/json'
    },
    data : jsonData
  };

  axios.request(config)
  .then((response) => {
    amount = response.data.amount
    nameshop = response.data.nameshop
    payId = response.data.payId
    console.log(`Data Recieving: ${response.data.amount} ${response.data.nameshop} ${response.data.payId}`)
    res.send(response.data) // Отправляем ответ, чтобы не было бесконечного запроса
  })
  .catch((error) => {
    console.log(error);
  });
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
