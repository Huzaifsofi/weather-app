const express = require('express');
const axios = require('axios');
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors())

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'd386419400msh90b585146e31549p1b8c14jsnc946198ab7f1',
    'X-RapidAPI-Host': 'open-weather13.p.rapidapi.com'
  }
};

app.post('/getWeather', async (req, res) => {
  try {
    const { cities } = req.body;
    const weatherData = {};

    await Promise.all(
      cities.map(async (city) => {
        try {
          const response = await axios.get(
            `https://open-weather13.p.rapidapi.com/city/${city}`,
            options
          );

          const temperature = response.data.main.temp;
          weatherData[city] = `${temperature}C`;
        } catch (error) {
          console.error(`Error fetching weather for ${city}: ${error.message}`);
          weatherData[city] = 'Not available';
        }
      })
    );

    res.json({ weather: weatherData });
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
