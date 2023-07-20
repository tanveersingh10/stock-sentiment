import requests
from bs4 import BeautifulSoup
from transformers import PegasusTokenizer, PegasusForConditionalGeneration, pipeline
from flask import Flask
from flask_cors import CORS
import json
import os

application = Flask(__name__)
CORS(application)


model_name = "human-centered-summarization/financial-summarization-pegasus"
tokenizer = PegasusTokenizer.from_pretrained(model_name) #what encodes and decodes the text
model = PegasusForConditionalGeneration.from_pretrained(model_name)


def search_ticker(ticker):
    url = "https://www.google.com/search?q=yahoo+finance+{}&tbm=nws".format(ticker)
    get_request = requests.get(url)
    soup = BeautifulSoup(get_request.text, 'lxml')
    links = soup.find_all('a')
    array = []
    for link in links:
        array.append(link.get('href'))
    return array #returns array of yahoo finance urls
    
def filter_links(arr):
    exclude_list = ['maps', 'policies', 'preferences', 'accounts', 'support']
    result = []
    for link in arr:
        if ("https" in link) and not any(exclude_word in link for exclude_word in exclude_list):
            start_index = link.find("https://")
            if start_index != -1:
                link = link[start_index:].split('&')[0]
            result.append(link)
    return result #removes unwanted urls
            


def scrape_articles(url_array):
    articles = []
    for url in url_array:
        if ("https://www.google.com") not in url:
            get_request = requests.get(url)
            if get_request.status_code == 200:
                soup = BeautifulSoup(get_request.text, 'lxml')
                paragraphs = soup.find_all('p')
                text = [paragraph.text for paragraph in paragraphs]
                words = ' '.join(text).split(' ')[:350]
                article = ' '.join(words)
                articles.append(article)
                print(article, "\n")
    return articles


def summarise(articles):
    result = []
    for article in articles:
        input_ids = tokenizer.encode(article, return_tensors='pt')
        output = model.generate(input_ids, max_length=60, num_beams=5, early_stopping=True)
        summary = tokenizer.decode(output[0], skip_special_tokens=True)
        result.append(summary)
    return result
        
analyzer = pipeline("sentiment-analysis")


def make_output(ticker, summarised_articles, analysis, filtered_links):
    output = []
    for i in range(len(summarised_articles)):
        output.append({
            'Ticker': ticker,
            'Summary': summarised_articles[i],
            'Sentiment': analysis[i]['label'],
            'Confidence': analysis[i]['score'],
            'URL': filtered_links[i]
        })
        
    return json.dumps(output)

@application.route('/')
def home():
    return 'Server is running.'

@application.route('/analyze/<ticker>', methods=["GET"])
def analyze_tickers(ticker):
    try:
        raw_urls = search_ticker(ticker)
        filtered_links = filter_links(raw_urls)
        articles = scrape_articles(filtered_links)
        summarised_articles = summarise(articles)
        analysis = analyzer(summarised_articles)
        output = make_output(ticker, summarised_articles, analysis, filtered_links)
        return json.dumps(output)
    except Exception as e:
        return {'error': str(e)}, 500

        
if __name__ == "__main__":
    application.run()
    