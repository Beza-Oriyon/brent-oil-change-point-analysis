import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

function App() {
  const [prices, setPrices] = useState([]);
  const [events, setEvents] = useState([]);
  const [startDate, setStartDate] = useState(new Date('2012-01-01'));
  const [endDate, setEndDate] = useState(new Date('2022-12-31'));
  const [category, setCategory] = useState('All');

  useEffect(() => {
    // Fetch data from Flask backend
    axios.get('http://127.0.0.1:5000/prices')
      .then(res => setPrices(res.data))
      .catch(err => console.error('Error fetching prices:', err));

    axios.get('http://127.0.0.1:5000/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error('Error fetching events:', err));
  }, []);

  // Filter prices by selected date range
  const filteredPrices = prices.filter(p => {
    const date = new Date(p.Date);
    return date >= startDate && date <= endDate;
  });

  // Filter events by category
  const filteredEvents = category === 'All' ? events : events.filter(e => e.Category === category);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Brent Oil Prices Dashboard</h1>

      {/* Date Range */}
      <div style={{ marginBottom: '20px' }}>
        <label>Start Date: </label>
        <DatePicker selected={startDate} onChange={setStartDate} />
        <label style={{ marginLeft: '20px' }}>End Date: </label>
        <DatePicker selected={endDate} onChange={setEndDate} />
      </div>

      {/* Category Filter */}
      <div style={{ marginBottom: '20px' }}>
        <label>Event Category: </label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="All">All</option>
          <option value="Geopolitical">Geopolitical</option>
          <option value="OPEC">OPEC</option>
          <option value="Economic">Economic</option>
        </select>
      </div>

      {/* Price Chart */}
      <LineChart width={900} height={500} data={filteredPrices}>
        <XAxis dataKey="Date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Price" stroke="#8884d8" activeDot={{ r: 8 }} />
        {filteredEvents.map((event, index) => (
          <ReferenceLine
            key={index}
            x={event.Date}
            stroke="red"
            strokeDasharray="3 3"
            label={{
              value: event.Description,
              position: 'top',
              fill: 'red',
              angle: -90,
              offset: 10,
              fontSize: 12
            }}
          />
        ))}
      </LineChart>

      {/* Events List */}
      <h2>Events ({filteredEvents.length})</h2>
      <ul>
        {filteredEvents.map((event, index) => (
          <li key={index}>
            <strong>{event.Date}</strong>: {event.Description} <em>({event.Category})</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;