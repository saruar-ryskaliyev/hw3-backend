import puppeteer from 'puppeteer';
import { Car } from '../types';

const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
];

function getRandomUserAgent() {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

export async function scrapeSiteWithPuppeteer(): Promise<Car[]> {
    const cars: Car[] = [];
    const browser = await puppeteer.launch({
        headless: true, // Set to false if you want to see the browser window
    });
    const page = await browser.newPage();

    page.setUserAgent(getRandomUserAgent());

    await page.goto('https://kolesa.kz/cars/', {
        waitUntil: 'networkidle2',
    });

    const carCards = await page.$$eval('.a-card.js__a-card', (cards) => {
        return cards.map((card) => {
            const carName = card.querySelector('.a-card__title a')?.textContent?.trim() || '';
            const carPrice = card.querySelector('.a-card__price')?.textContent?.trim() || '';
            const carLink = "https://kolesa.kz" + (card.querySelector('.a-card__link') as HTMLAnchorElement)?.href || '';
            const carDescription = card.querySelector('.a-card__description')?.textContent?.trim() || '';
            const carRegion = card.querySelector('.a-card__param[data-test="region"]')?.textContent?.trim() || '';
            const carDate = card.querySelector('.a-card__param--date')?.textContent?.trim() || '';

            const photoUrls: string[] = [];
            card.querySelectorAll('.thumb-gallery__pic img').forEach((img) => {
                const photoUrl = (img as HTMLImageElement).src;
                if (photoUrl) {
                    photoUrls.push(photoUrl);
                }
            });

            return {
                name: carName,
                price: carPrice,
                link: carLink,
                description: carDescription,
                region: carRegion,
                date: carDate,
                photos: photoUrls,
            };
        });
    });

    cars.push(...carCards);
    await browser.close();

    return cars;
}
