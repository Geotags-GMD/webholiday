import axios from 'axios';
import cheerio from 'cheerio';

// Get the current year
const currentYear = new Date().getFullYear();
const url = `https://publicholidays.ph/${currentYear}-dates/`;

interface Holiday {
  date: string;
  day: string;
  name: string;
}

async function fetchHolidays() {
  try {
    // Fetch the HTML of the page
    const { data } = await axios.get(url);
    
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
    console.log(JSON.stringify(holidays, null, 2));
  } catch (error) {
    console.error('Error fetching the data:', error);
  }
}

fetchHolidays();
