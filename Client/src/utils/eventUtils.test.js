// Fast unit tests for pure helpers that do not need a browser or database.
import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateTotal, eventUrl } from './eventUtils.js'

test('event URLs encode an API slug safely', () => {
  assert.equal(eventUrl('my event'), '/events/my%20event')
})

test('ticket total sums each tier price times its quantity', () => {
  const tiers = [{ name: 'Early', price: 500 }, { name: 'General', price: 900 }]
  assert.equal(calculateTotal(tiers, { Early: 2, General: 1 }), 1900)
})
