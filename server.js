import express from 'express';
import path, { join } from 'path';
import { createServer } from 'http';
import { fileURLToPath } from 'url';

const app = express();
const server = createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(join(__dirname + '/public')));

server.listen(5000);