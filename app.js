import express from 'express';
import cors from 'cors';
import usersRouter from './routers/users.router.js';
import countriesRouter from './routers/countries.router.js';
import couplesRouter from './routers/couples.router.js';
import visitsRouter from './routers/visits.router.js';
import randomCountryRouter from "./routers/randomCountry.router.js";
import * as OpenApiValidator from 'express-openapi-validator';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

// const openApiDocument = yaml.load(__dirname + '/openapi-main.yaml');

const app = express();

const API_VERSION = 'v1.3';

app.use(cors());
app.use(express.json());

// app.use(`/api-docs/${API_VERSION}`, swaggerUi.serve, swaggerUi.setup(openApiDocument));

// app.use(
//     OpenApiValidator.middleware({
//         apiSpec: __dirname + '/openapi-main.yaml',
//         ignoreUndocumented: true,
//     })
// );

app.use(`/${API_VERSION}/users`, usersRouter);
app.use(`/${API_VERSION}/countries`, countriesRouter);
app.use(`/${API_VERSION}/visits`, visitsRouter);
app.use(`/${API_VERSION}/couples`, couplesRouter);
app.use(`/${API_VERSION}/random-country`, randomCountryRouter);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});

export default app;
