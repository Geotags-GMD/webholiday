import axios from 'axios';
import cheerio from 'cheerio';

const currentYear = new Date().getFullYear();
const url = `https://publicholidays.ph/${currentYear}-dates/`;

interface Holiday {
  date: string;
  day: string;
  name: string;
}

export default async function handler(req: any, res: any) {
  try {
    console.log(`Fetching data from: ${url}`); // Log the URL for debugging

    // Fetch the HTML of the page with custom headers
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    });
    console.log('Data fetched successfully'); // Log success

    // Load the HTML into cheerio
    const $ = cheerio.load(data);
    
    // Extract table rows
    const rows = $('table tbody tr');
    const holidays: Holiday[] = [];

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
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching the data:', error.message);
      res.status(500).json({ error: 'Failed to fetch holidays', details: error.message });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({ error: 'Failed to fetch holidays', details: 'Unknown error occurred' });
    }
  }
}
