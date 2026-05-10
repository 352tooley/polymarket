import { useEffect, useState } from 'react'

export default function App() {
  const [markets, setMarkets] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    fetch('http://localhost:3847/markets')
      .then((res) => res.json())
      .then(setMarkets)

    const socket = new WebSocket('ws://localhost:3847')

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setEvents((prev) => [data].concat(prev).slice(0, 10))
    }

    return () => socket.close()
  }, [])

  return (
    <div className='app'>
      <header className='header'>
        <h1>Polymarket Operator</h1>
        <div className='status'>LOCAL MODE</div>
      </header>

      <div className='grid'>
        <section className='panel'>
          <h2>Markets</h2>

          {markets.map((market) => (
            <div className='market-card' key={market.id}>
              <h3>{market.title}</h3>
              <p>Probability: {market.probability}%</p>
              <p>Volume: ${market.volume}</p>
            </div>
          ))}
        </section>

        <section className='panel'>
          <h2>Agent Feed</h2>

          {events.map((event, index) => (
            <div className='event-card' key={index}>
              <p>{event.payload.market}</p>
              <p>Probability: {event.payload.probability}%</p>
            </div>
          ))}
        </section>

        <section className='panel'>
          <h2>Portfolio</h2>

          <div className='portfolio-card'>
            <p>Total Exposure</p>
            <h3>$12450</h3>
          </div>

          <div className='portfolio-card'>
            <p>Daily PnL</p>
            <h3>+$482</h3>
          </div>
        </section>

        <section className='panel'>
          <h2>AI Consensus</h2>

          <div className='consensus-card bullish'>
            <h3>BTC 150K</h3>
            <p>Consensus: Bullish</p>
            <p>Confidence: 74%</p>
          </div>
        </section>
      </div>
    </div>
  )
}
