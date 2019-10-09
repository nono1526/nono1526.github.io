export function formatDateToChinese (date) {
  date = new Date(date)
  const dayMapping = ['日', '一', '二', '三', '四', '五', '六']
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 星期${dayMapping[date.getDay()]}`
}