const getLoc = async () => {
  const url =
    "http://ip-api.com/json/?fields=status,country,city,lat,lon,timezone";
  const response = await fetch(url);
  const data = await response.json();

  return data;
};

const getWeather = async (lat, lon) => {
  const api = "f0894defae7c5584798f8812232a40c2";
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}`;

  const response = await fetch(url);
  const data = await response.json();

  return data;
};

function getIcon(weMain) {
  let icon;
  switch (weMain) {
    case "Thunderstorm":
    case "Drizzle":
    case "Rain":
    case "Snow":
    case "Clouds":
      icon = `${weMain}.svg`;
      break;
    case "Clear":
      const DayOrNight = getDayOrNight();
      icon = `${weMain}-${DayOrNight}.svg`;
      break;
    case "Atmosphere":
      icon = `${weMain}.png`;
      break;
    default:
      icon = "default.svg";
  }
  return icon;
}

function getDayOrNight() {
  const d = new Date();
  return d.getHours() >= 6 && d.getHours() <= 19 ? "Day" : "Night";
}

function getTemp(weTemp) {
  const k = weTemp;
  const f = ((k - 273.15) * 9) / 5 + 32;
  const c = k - 273.15;
  return {
    kel: Math.floor(k),
    far: Math.floor(f),
    can: Math.floor(c),
  };
}

const loti = document.querySelector(".timezone");
const icon = document.querySelector(".icon");
const dese = document.querySelector(".degree-section");
const deg = document.querySelector(".degree-section h2");
const unit = document.querySelector(".degree-section span");
const tede = document.querySelector(".temperature-description");

window.addEventListener("load", function () {
  getLoc().then((locData) => {
    const timeZone = locData.timezone;
    loti.textContent = timeZone;
    getWeather(locData.lat, locData.lon).then((weData) => {
      const weTemp = weData.main.temp;
      const weMain = weData.weather[0].main;
      const weDes = weData.weather[0].description;

      const iconName = getIcon(weMain);
      icon.innerHTML = `<img src='icons/${iconName}'></img>`;

      deg.textContent = Math.floor(weTemp);
      unit.textContent = "K";
      dese.addEventListener("click", function () {
        if (unit.textContent === "K") {
          deg.textContent = getTemp(weTemp).far;
          unit.textContent = "F";
        } else if (unit.textContent === "F") {
          deg.textContent = getTemp(weTemp).can;
          unit.textContent = "C";
        } else {
          deg.textContent = getTemp(weTemp).kel;
          unit.textContent = "K";
        }
      });
      tede.textContent = weDes;
      console.log(weTemp, weMain, weDes);
    });
  });
});
