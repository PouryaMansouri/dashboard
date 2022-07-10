import mock from '@/@fake-db/mock'

const date = new Date()
const nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
// prettier-ignore
const nextMonth = date.getMonth() === 11 ? new Date(date.getFullYear() + 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() + 1, 1)
// prettier-ignore
const prevMonth = date.getMonth() === 11 ? new Date(date.getFullYear() - 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() - 1, 1)

const data = {
  events: [
    {
      id: 1,
      url: '',
      title: 'عماد میرزایی',
      start: "2022-03-21 20:00",
      end: "2022-03-21 21:00",
      allDay: false,
      extendedProps: {
        calendar: 'Free',
      },
    },
    {
      id: 2,
      url: '',
      title: 'عماد میرزایی',
      start: "2022-03-21 21:00",
      end: "2022-03-21 22:00",
      allDay: false,
      extendedProps: {
        calendar: 'Reserved',
      },
    },
    {
      id: 3,
      url: '',
      title: 'عماد میرزایی',
      start: "2022-03-21 22:00",
      end: "2022-03-21 23:00",
      allDay: false,
      extendedProps: {
        calendar: 'InProcess',
      },
    },
  ],
}

// {
//   id: 2,
//   url: '',
//   title: 'Meeting With Client',
//   start: new Date(date.getFullYear(), date.getMonth() + 1, -11),
//   end: new Date(date.getFullYear(), date.getMonth() + 1, -10),
//   allDay: true,
//   extendedProps: {
//     calendar: 'Business',
//   },
// },

// ------------------------------------------------
// GET: Return calendar events
// ------------------------------------------------
mock.onGet('/apps/calendar/events').reply(config => {

  // Get requested calendars as Array
  const calendars = config.params.calendars.split(',')

  return [200, data.events]
})

// ------------------------------------------------
// POST: Add new event
// ------------------------------------------------
mock.onPost('/apps/calendar/events').reply(config => {
  // Get event from post data
  const { event } = JSON.parse(config.data)

  const { length } = data.events
  let lastIndex = 0
  if (length) {
    lastIndex = data.events[length - 1].id
  }
  event.id = lastIndex + 1


  data.events.push(event)

  return [201, { event }]
})

// ------------------------------------------------
// POST: Update Event
// ------------------------------------------------
mock.onPost(/\/apps\/calendar\/events\/\d+/).reply(config => {
  const { event: eventData } = JSON.parse(config.data)

  // Convert Id to number
  eventData.id = Number(eventData.id)

  const event = data.events.find(e => e.id === Number(eventData.id))
  Object.assign(event, eventData)


  return [200, { event }]
})

// ------------------------------------------------
// DELETE: Remove Event
// ------------------------------------------------
mock.onDelete(/\/apps\/calendar\/events\/\d+/).reply(config => {
  // Get event id from URL
  let eventId = config.url.substring(config.url.lastIndexOf('/') + 1)

  // Convert Id to number
  eventId = Number(eventId)

  const eventIndex = data.events.findIndex(e => e.id === eventId)
  data.events.splice(eventIndex, 1)
  return [200]
})
