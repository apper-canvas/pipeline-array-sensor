import { format, formatDistanceToNow, isValid } from "date-fns"

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return "$0"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (date) => {
  if (!date) return ""
  const dateObj = typeof date === "string" ? new Date(date) : date
  if (!isValid(dateObj)) return ""
  return format(dateObj, "MMM dd, yyyy")
}

export const formatDateTime = (date) => {
  if (!date) return ""
  const dateObj = typeof date === "string" ? new Date(date) : date
  if (!isValid(dateObj)) return ""
  return format(dateObj, "MMM dd, yyyy 'at' h:mm a")
}

export const formatRelativeTime = (date) => {
  if (!date) return ""
  const dateObj = typeof date === "string" ? new Date(date) : date
  if (!isValid(dateObj)) return ""
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

export const formatPhone = (phone) => {
  if (!phone) return ""
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

export const initials = (name) => {
  if (!name) return "?"
  return name
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("")
}

export const formatCompactNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}