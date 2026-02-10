from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import os  # For paths

app = Flask(__name__)
CORS(app)

# Robust paths: Get the directory of this file (src/), then go up to root/data
base_dir = os.path.dirname(os.path.abspath(__file__))  # src/
data_dir = os.path.join(base_dir, '..', 'data')  # Up to root/data

# Load with full paths
df_path = os.path.join(data_dir, 'BrentOilPrices.csv')
print(f'Trying DF path: {df_path}')
df = pd.read_csv(df_path)
df['Date'] = pd.to_datetime(df['Date'], format='mixed', dayfirst=True)  # Fix: 'mixed' auto-handles '20-May-87' and others; dayfirst for dd-mm

events_path = os.path.join(data_dir, 'oil_events.csv')
print(f'Trying Events path: {events_path}')
events = pd.read_csv(events_path)
events['Date'] = pd.to_datetime(events['Date'], format='%Y-%m-%d')

# Example changepoints from model (update with real values, e.g., your tau date)
changepoints = [{'date': '2020-03-06', 'impact': '-45%'}]

@app.route('/prices')
def prices():
    return jsonify(df[['Date', 'Price']].to_dict(orient='records'))

@app.route('/events')
def get_events():
    return jsonify(events.to_dict(orient='records'))

@app.route('/changepoints')
def get_changepoints():
    return jsonify(changepoints)

if __name__ == '__main__':
    app.run(debug=True)