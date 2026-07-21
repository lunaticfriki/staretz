import { describe, expect, it } from 'vitest'
import {
  InvalidNotificationMessageError,
  NotificationMessage,
} from '../../value-objects/NotificationMessage.valueObject'
import { NotificationMother } from './Notification.mother'

describe('Notification', () => {
  it('builds a valid notification through the create factory', () => {
    const notification = NotificationMother.ofKind('error')

    expect(notification.kind).toBe('error')
    expect(notification.message.toString()).toBe('Sample notification')
  })

  it('rejects an empty message', () => {
    expect(() => NotificationMessage.create('   ')).toThrow(InvalidNotificationMessageError)
  })

  it('empty() returns a neutral placeholder notification', () => {
    const notification = NotificationMother.empty()

    expect(notification.id.toString()).toBe('')
    expect(notification.message.toString()).toBe('')
  })

  it('each notification gets a distinct generated id', () => {
    const first = NotificationMother.random()
    const second = NotificationMother.random()

    expect(first.id.equals(second.id)).toBe(false)
  })
})
