import glob from 'glob'
import { EmitterKing } from '../src/EmitterKing'

// Install unhandled rejection handler.
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})

async function test() {
  const g = new glob.Glob('./**/*.js', { follow: true })
  const e = new EmitterKing(g)
  e.emit('match')
  e.error('error')
  e.error('abort')
  e.end('end')

  let f

  while ((f = await e.get())) {
    console.log(f)
  }
}

test()
