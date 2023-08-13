export function tempConverter(temp) {
  const celsius = Math.round(temp.main.temp - 273.15);
  const fahrenheit = Math.round(((temp.main.temp - 273.15) * 9) / 5 + 32);

  return { celsius, fahrenheit };
}
