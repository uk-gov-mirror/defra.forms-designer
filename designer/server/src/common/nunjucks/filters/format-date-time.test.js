import { formatDateTime } from '~/src/common/nunjucks/filters/format-date-time.js'

describe('#formatDateTime', () => {
  test('formats a date string in UK timezone (BST) correctly', () => {
    // 14:01 UTC is 15:01 BST in June
    expect(
      formatDateTime('2019-06-14T14:01:00.000Z', "d MMM yyyy 'at' h:mmaaa")
    ).toBe('14 Jun 2019 at 3:01pm')
  })

  test('formats a date string in UK timezone (GMT) correctly', () => {
    // In January, UK is on GMT so 14:01 UTC is 14:01 GMT
    expect(
      formatDateTime('2019-01-14T14:01:00.000Z', "d MMM yyyy 'at' h:mmaaa")
    ).toBe('14 Jan 2019 at 2:01pm')
  })

  test('formats a Date object correctly', () => {
    const date = new Date('2019-06-14T14:01:00.000Z')
    expect(formatDateTime(date, "d MMM yyyy 'at' h:mmaaa")).toBe(
      '14 Jun 2019 at 3:01pm'
    )
  })
})
