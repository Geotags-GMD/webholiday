"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const currentYear = new Date().getFullYear();
const url = `https://publicholidays.ph/${currentYear}-dates/`;
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(`Fetching data from: ${url}`); // Log the URL for debugging
            // Fetch the HTML of the page with custom headers
            const { data } = yield axios_1.default.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept-Encoding': 'gzip, deflate, br'
                }
            });
            console.log('Data fetched successfully'); // Log success
            // Load the HTML into cheerio
            const $ = cheerio_1.default.load(data);
            // Extract table rows
            const rows = $('table tbody tr');
            const holidays = [];
            rows.each((index, row) => {
                const columns = $(row).find('td');
                if (columns.length === 3) {
                    const date = $(columns[0]).text().trim();
                    const day = $(columns[1]).text().trim();
                    const name = $(columns[2]).text().trim();
                    holidays.push({ date, day, name });
                }
            });
            // Output the holidays in JSON format
            res.status(200).json(holidays);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error fetching the data:', error.message);
                res.status(500).json({ error: 'Failed to fetch holidays', details: error.message });
            }
            else {
                console.error('Unexpected error:', error);
                res.status(500).json({ error: 'Failed to fetch holidays', details: 'Unknown error occurred' });
            }
        }
    });
}
