import app from './app.js'
import prisma from './db.js'
import { seedCountriesFromAPI } from './seed.js';

/**
 * Connect to the database and start the server
 */
prisma.$connect().then(async () => {
    console.log('Connected to the database')

    await seedCountriesFromAPI();

    app.listen('3000', () => {
        console.log('Server running on port 3000')
    })
}).catch((error) => {
    console.error(error)
})

