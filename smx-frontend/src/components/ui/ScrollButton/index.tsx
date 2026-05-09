import { BiChevronDown } from 'react-icons/bi'

export const ScrollButton = ({
  showScrollButton,
  scrollToBottom,
}: {
  showScrollButton: boolean
  scrollToBottom: () => void
}) => {
  if (!showScrollButton) return null

  return (
    <button
      onClick={() => scrollToBottom()}
      className="absolute bottom-28 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 shadow-md p-2 rounded-full hover:bg-gray-100"
    >
      <BiChevronDown className="h-6 w-6 text-gray-600" />
    </button>
  )
}
