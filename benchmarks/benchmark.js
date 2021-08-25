const bench = require('nanobench')
const axios = require('axios')

bench('IpCheck 2000 times', async function (b) {
  b.start()

  for (let i = 0; i < 2000; i++) {
    await axios.post('http://localhost:3000/checkip', { ip: '0.0.0.22' })
    await axios.post('http://localhost:3000/checkip', { ip: '23.229.213.5' })
  }

  b.end()
})
