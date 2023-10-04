const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/detect-theme', async (req, res) => {
  try {
    const { url } = req.body;

    // Fetch the website content
    const response = await fetch(url);
    const html = await response.text();

    // Parse the HTML with Cheerio
    const $ = cheerio.load(html);

    // Check for WordPress theme information
    const themeLink = $('link[rel="stylesheet"][href*="wp-content/themes/"]');
    if (themeLink.length > 0) {
      const themeHref = themeLink.attr('href');
      const themeName = themeHref.match(/wp-content\/themes\/([^/]+)/)[1];
      res.json({ themeName });
    } else {
      res.json({ themeName: 'Not a WordPress website' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while detecting the theme.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
