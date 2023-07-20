# Stock News Sentiment Analysis Project


<h3> Project Workflow </h3>

- BeautifulSoup library for Web Scraping. Searches the web for the latest Yahoo Finance articles about the ticker you provide!
- Uses model that has been pre-trained to summarise financial data in order to summarize articles. "human-centered-summarization/financial-summarization-pegasus".
- Hugging Face "sentiment-analysis" pipeline used to generate binary sentiment classification and confidence scores.
- Flask used to create custom API and server-side logic.
- React.js and Material UI used for sleek user interface on the front end.


<h3> Usage </h3>

To use this app, you need to have npm and python installed on your computer.


- git clone https://github.com/tanveersingh10/stock-sentiment/tree/main/flask-backend


- cd flask-backend 
- pip install -r requirements.txt
- python3 application.py


- cd ../client
- npm install
- npm run start 
