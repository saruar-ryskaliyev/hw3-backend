import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
// import { checkForNewCars } from "./utils/scrapper";
import { scrapeSiteWithPuppeteer } from "./utils/scrapper"
import { sendNotification } from "./utils/notify";
import cron from 'node-cron';
import  connectDB  from './models/index';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});



app.get("/cars", async (req: Request, res: Response) => {
    try {
        const newCars = await scrapeSiteWithPuppeteer();
        res.json(newCars);
    } catch (error) {
        res.status(500).json({ error: "Failed to scrape site" });
    }
    }
);


// app.get("/cars", async (req: Request, res: Response) => {
//   try {
//     const newCars = await checkForNewCars();
//     res.json(newCars);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to scrape site" });
//   }
// });

// cron.schedule('*/30 * * * *', async () => {
//   console.log('Running scheduled task to check for new cars...');
//   const newCars = await checkForNewCars();
//   if (newCars.length > 0) {
//     const notifiedCars = await sendNotification(newCars);
//     console.log('New cars:', notifiedCars);
//   }
// });

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  await connectDB();
});
