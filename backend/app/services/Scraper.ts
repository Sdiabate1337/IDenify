import puppeteer from 'puppeteer';
import  {Parser} from 'json2csv';

interface ScrapeOptions {
    url: string;
    selector: string;
  }
  
  interface ScrapedData {
    title: string;
    content: string;
    link: string;
  }