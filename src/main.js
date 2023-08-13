"use strict";

import dotenv from "dotenv";
import { prompt } from "./utils/prompt.js";
import { tempConverter } from "./helpers/conversions.js";
import { capitalizeFirstLetter } from "./helpers/capitalizeFirstLetter.js";
import {
  fetchGeocodingData,
  fetchWeatherDataByName,
  fetchWeatherDataByCoordinates,
} from "./sources.js";

dotenv.config();

async function weatherBot() {
  try {
    const input = await prompt("Enter a city (don't add the word 'city'): ");

    const geocodingData = await fetchGeocodingData(input);

    if (geocodingData.length > 1) {
      console.log(
        `There are ${
          geocodingData.length
        } identical names for ${capitalizeFirstLetter(
          input
        )}. Please choose one of the following:`
      );
      console.log(
        `${geocodingData
          .map(
            (loc, index) =>
              `${index + 1}. ${loc.name}, ${loc.state}, ${
                loc.country
              }\t(Latitude: ${loc.lat}, Longitude: ${loc.lon})`
          )
          .join("\n")}`
      );

      const choice = await prompt("Enter your choice: ");
      const selectedLocation = geocodingData[choice - 1];

      const weatherData = await fetchWeatherDataByCoordinates(
        selectedLocation.lat,
        selectedLocation.lon
      );

      const temp = tempConverter(weatherData);

      console.log(
        `The weather in ${selectedLocation.name}, ${selectedLocation.state}, ${selectedLocation.country} is ${temp.celsius}°C or ${temp.fahrenheit}°F having ${weatherData.weather[0].description}.`
      );
      process.exit(1);
    } else if (geocodingData.length === 1) {
      const weatherData = await fetchWeatherDataByName(input);

      if (geocodingData.length === 1 && weatherData.cod === "404") {
        console.log(`There's no available weather data for ${input}.`);
        process.exit(1);
      } else {
        const temp = tempConverter(weatherData);

        console.log(
          `The weather in ${weatherData.name} is ${temp.celsius}°C or ${temp.fahrenheit}°F having ${weatherData.weather[0].description}.`
        );
        process.exit(1);
      }
    } else {
      console.log(`Unknown location: ${capitalizeFirstLetter(input)}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(err);
  }
}
weatherBot().catch((err) => {
  console.error(err);
  process.exit(1);
});
