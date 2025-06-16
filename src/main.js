const elements = {
  form: document.querySelector(".weather form"),
  cityInput: document.querySelector("#city"),

  weatherCard: document.querySelector(".weather-card"),
  loadingMessage: document.querySelector("[data-loading]"),
  errorMessage: document.querySelector("[data-error]"),
  weatherDetails: document.querySelector(".weather-details"),

  city: document.querySelector("[data-city]"),
  country: document.querySelector("[data-country]"),
  temperature: document.querySelector("[data-temperature]"),
  description: document.querySelector("[data-description]"),
  humidity: document.querySelector("[data-humidity]"),
  pressure: document.querySelector("[data-pressure]"),
  wind: document.querySelector("[data-wind]"),
  visibility: document.querySelector("[data-visibility]"),
  time: document.querySelector("[data-time]"),
};

const apiKey = import.meta.env.VITE_API_KEY;

elements.form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = elements.cityInput.value.trim();
  if (!city) return showError("Please enter a city");

  try {
    const data = await getWeatherData(city);
    displayWeatherInfo(data);
  } catch (err) {
    console.error(err);
    showError(err.message);
  }
});

async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Could not fetch weather data");
  }
  return await response.json();
}

function displayWeatherInfo(data) {
  elements.weatherCard.style.display = "grid";
  elements.loadingMessage.style.display = "none";
  elements.errorMessage.style.display = "none";
  elements.weatherDetails.style.display = "grid";

  const {
    name,
    sys: { country },
    main: { temp, humidity, pressure },
    weather: [{ description }],
    wind: { speed },
    visibility,
    dt,
  } = data;

  elements.city.textContent = name;
  elements.country.textContent = country;
  elements.temperature.textContent = `${temp}°`;
  elements.description.textContent =
    description.charAt(0).toUpperCase() + description.slice(1);
  elements.humidity.textContent = `${humidity}%`;
  elements.pressure.textContent = `${pressure} hPa`;
  elements.wind.textContent = `${speed} m/s`;
  elements.visibility.textContent = `${(visibility / 1000).toFixed(0)} km`;

  const date = new Date(dt * 1000);
  elements.time.textContent = date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function showError(message) {
  elements.weatherCard.style.display = "block";
  elements.loadingMessage.style.display = "none";
  elements.weatherDetails.style.display = "none";
  elements.errorMessage.style.display = "block";
  elements.errorMessage.textContent = message;
}
