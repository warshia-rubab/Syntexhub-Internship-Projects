export const getTemperature = (tempInKelvin, unit) => {
  if (unit === 'metric') {
    return Math.round(tempInKelvin);
  }
  return Math.round((tempInKelvin - 273.15) * 9 / 5 + 32);
};

export const getWindSpeed = (speedInMetersPerSec, unit) => {
  if (unit === 'metric') {
    return `${Math.round(speedInMetersPerSec * 3.6)} km/h`;
  }
  return `${Math.round(speedInMetersPerSec * 2.23694)} mph`;
};