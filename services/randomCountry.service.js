import db from '../db.js';

/**
 * Get a random country based on user preferences
 * @param userId
 * @returns {Promise<*>}
 */
export async function getRandomCountry(userId) {
    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { favorite_continent: true, preferred_temperature: true },
        });

        if (!user) {
            throw new Error('User not found');
        }

        const visitedCountries = await db.visit.findMany({
            where: { user_id: userId },
            select: { country_id: true },
        });

        const visitedCountryIds = visitedCountries.map((visit) => visit.country_id); // Correction ici

        const couple = await db.couple.findFirst({
            where: { OR: [{ user1_id: userId }, { user2_id: userId }] }, // Correction ici
        });

        let coupleVisitedCountries = [];
        let partnerPreferences = null;
        if (couple) {
            const partnerId = couple.user1_id === userId ? couple.user2_id : couple.user1_id;
            const partnerVisitedCountries = await db.visit.findMany({
                where: { user_id: partnerId },
                select: { country_id: true },
            });
            coupleVisitedCountries = partnerVisitedCountries.map((visit) => visit.country_id);

            const partner = await db.user.findUnique({
                where: { id: partnerId },
                select: { favorite_continent: true, preferred_temperature: true },
            });
            partnerPreferences = partner;
        }

        const allVisitedCountries = [...new Set([...visitedCountryIds, ...coupleVisitedCountries])];

        const preferences = {
            continents: partnerPreferences
                ? [user.favorite_continent, partnerPreferences.favorite_continent]
                : [user.favorite_continent],
            temperatures: partnerPreferences
                ? [user.preferred_temperature, partnerPreferences.preferred_temperature]
                : [user.preferred_temperature],
        };

        const eligibleCountries = await db.country.findMany({
            where: {
                id: { notIn: allVisitedCountries },
                continent: { in: preferences.continents },
                temperature: { in: preferences.temperatures },
            },
        });

        if (eligibleCountries.length === 0) {
            throw new Error('No eligible countries found');
        }

        const randomIndex = Math.floor(Math.random() * eligibleCountries.length);
        return eligibleCountries[randomIndex];
    } catch (error) {
        throw new Error(error.message || 'An error occurred while fetching a random country');
    }
}