export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const weekDay = weekDays[date.getDay()]
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  const footprintsDay = getFootprintsDay(timestamp)
  // const period = hours < 12 ? '上午' : '下午'
  // const formattedHours = hours % 12 || 12

  return `👣 ${footprintsDay} | ${year}年${month}月${day}日 周${weekDay} ${hours}:${minutes}:${seconds}`
  // return `${year}-${month}-${day} 周${weekDay} ${period} ${formattedHours}:${minutes}:${seconds}`
}

export const getFootprintsDay = (timestamp: number = Date.now()): number =>
  Math.floor(
    (timestamp - new Date(1999, 5, 29).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1

export const scrollToTop = (): void =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
