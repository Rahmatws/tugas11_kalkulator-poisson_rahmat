from flask import Flask, render_template, jsonify, request
import math

app = Flask(__name__)

# Fungsi untuk menghitung probabilitas Poisson
def poisson_probability(lamda, k):
    return (lamda ** k) * math.exp(-lamda) / math.factorial(k)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    lamda_weekend = data['lamda_weekend']
    lamda_weekday = data['lamda_weekday']
    k_values = data['k_values']

    steps = []
    weekend_results = []
    weekday_results = []

    for k in k_values:
        weekend_prob = poisson_probability(lamda_weekend, k)
        weekday_prob = poisson_probability(lamda_weekday, k)

        weekend_results.append(weekend_prob)
        weekday_results.append(weekday_prob)

        steps.append(f'Untuk k = {k}, P(Akhir Pekan) = {weekend_prob:.6f}, P(Hari Biasa) = {weekday_prob:.6f}')

    return jsonify({
        'steps': steps,
        'k_values': k_values,
        'weekend_results': weekend_results,
        'weekday_results': weekday_results
    })

if __name__ == '__main__':
    app.run(debug=True)
