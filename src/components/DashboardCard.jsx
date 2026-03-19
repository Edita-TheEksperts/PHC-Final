export default function DashboardCard({ title, icon, children, className = "" }) {
  return (
<div
  className={`rounded-2xl bg-white 
    p-3 sm:p-4 md:p-5 lg:p-6 
    shadow-sm border border-gray-100 
    transition hover:shadow-md 
    w-full max-w-full ${className}`}
>
  {title && (
    <div
      className="flex items-center gap-2 
                 text-gray-800 font-semibold 
                 text-sm sm:text-base md:text-lg 
                 mb-3 sm:mb-4"
    >
      {icon && <span className="text-base sm:text-lg">{icon}</span>}
      {title}
    </div>
  )}
  {children}
</div>

  );
}
