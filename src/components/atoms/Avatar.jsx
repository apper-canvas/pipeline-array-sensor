import { cn } from "@/utils/cn"
import { initials } from "@/utils/formatters"

const Avatar = ({ 
  name, 
  src, 
  size = "default", 
  className,
  ...props 
}) => {
  const sizes = {
    sm: "h-6 w-6 text-xs",
    default: "h-8 w-8 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg"
  }

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          "rounded-full object-cover",
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-white font-semibold flex items-center justify-center",
        sizes[size],
        className
      )}
      {...props}
    >
      {initials(name)}
    </div>
  )
}

export default Avatar