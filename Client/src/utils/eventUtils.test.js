import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateTotal, eventUrl } from './eventUtils.js'
import { events } from '../data/mockEvents.js'

test('Explore card destination points to its event id', () => {
  assert.equal(eventUrl(events[0].id), `/events/${events[0].id}`)
})

test('unknown event ids do not resolve in the shared event data', () => {
  assert.equal(events.find((event) => event.id === 'missing-event'), undefined)
})

test('ticket total sums each tier price times its quantity', () => {
  const tiers = [{ name: 'Early', price: 500 }, { name: 'General', price: 900 }]
  assert.equal(calculateTotal(tiers, { Early: 2, General: 1 }), 1900)
})
