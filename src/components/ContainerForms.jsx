export default function ContainerForms({ titulo, children }) {
  return (
    <div className="container mx-auto flex flex-col justify-center max-sm:p-4">
      <div className="bg-[#EFEEEE] py-4 w-full rounded-t-lg">
        <h1 className="text-lg md:text-xl font-bold text-center">{titulo}</h1>
      </div>
      <div className="bg-white rounded-b-lg h-auto flex p-4 md:p-8 drop-shadow-lg w-full">
        {children}
      </div>
    </div>
  )
}
