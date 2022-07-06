export const Spinner = ({size = 6}: {size?: number | string}) => {
    return <div className={`w-${size} h-${size} rounded-full border-2 border-t-widget-theme animate-spin`}></div>
}