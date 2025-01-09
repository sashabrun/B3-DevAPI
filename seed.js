import axios from 'axios';
import prisma from './db.js';
import { Continent, Temperature } from '@prisma/client';

const mapContinent = (region) => {
    switch (region) {
        case 'Africa': return Continent.Africa;
        case 'Antarctica': return Continent.Antarctica;
        case 'Asia': return Continent.Asia;
        case 'Europe': return Continent.Europe;
        case 'North America': return Continent.North_America;
        case 'Oceania': return Continent.Oceania;
        case 'South America': return Continent.South_America;
        default: return null;
    }
};

const mapTemperature = (latitude) => {
    if (latitude > 40) return Temperature.Cold;
    if (latitude < -10 || latitude > 10) return Temperature.Mild;
    return Temperature.Hot;
};

export const seedCountriesFromAPI = async () => {
    try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countries = response.data;

        for (const country of countries) {
            const name = country.name.common;
            const continent = mapContinent(country.region);
            const latitude = country.latlng?.[0] || 0;
            const temperature = mapTemperature(latitude);
            const is_open = true;

            const existingCountry = await prisma.country.findFirst({
                where: { name },
            });

            if (existingCountry) {
                console.log(`Skipped: ${name} (already exists in the database)`);
                continue;
            }

            if (!continent) {
                console.log(`Skipped: ${name} (unknown continent)`);
                continue;
            }

            await prisma.country.create({
                data: {
                    name,
                    continent,
                    temperature,
                    is_open,
                },
            });

            console.log(`Inserted: ${name}`);
        }

        console.log('All countries have been processed successfully!');
    } catch (error) {
        console.error('Error seeding countries from API:', error);
    }
};
