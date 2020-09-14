const https = require("https");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const OPEN_WEATHER_SECRET_NAME = "projects/953187498755/secrets/open-weather-api-key";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

admin.initializeApp();
const secretsManager = new SecretManagerServiceClient();

const getWeather = async (apiKey, city, state) =>
  new Promise((resolve, reject) => {
    const url = `${BASE_URL}?units=imperial&appid=${apiKey}` +
      `&q=${city},${state},us`;
    https.get(url, (res) => res.on("data", (data) =>
      resolve(JSON.parse(data.toString())))
    ).on("error", (err) => reject(err));
  });

exports.updateLocationWeather = functions.pubsub
  .topic("scheduled-events")
  .onPublish(async (message) => {
    const fn = message.data ?
      Buffer.from(message.data, "base64").toString() :
      null;

    if (fn !== "updateLocationWeather") {
      console.log(message);
      return;
    }

    const [accessResponse] = await secretsManager.accessSecretVersion({
      name: `${OPEN_WEATHER_SECRET_NAME}/versions/latest`
    });

    const openWeatherApiKey = accessResponse.payload.data.toString('utf8');

    const snapshot = await admin.firestore().collection("locations").get();
    return await Promise.all(snapshot.docs.map(async (it) => {
      const res = await getWeather(
        openWeatherApiKey,
        it.data().city,
        it.data().state
      );
      const icon = res.weather[0].icon;
      const weather = {
        feelsLike: res.main.feels_like,
        humidity: res.main.humidity,
        pressure: res.main.pressure,
        temp: res.main.temp,
        tempMax: res.main.temp_max,
        tempMin : res.main.temp_min,
        status: res.weather[0].main,
        description: res.weather[0].description,
        updatedAt: new Date(parseInt(res.dt, 10) * 1000).toISOString(),
        iconUrl: `http://openweathermap.org/img/wn/${icon}@2x.png`
      };
      return it.ref.set({ weather }, { merge: true });
    }));
  });
