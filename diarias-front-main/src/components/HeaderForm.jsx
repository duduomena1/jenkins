import Image from 'next/image'
import logo_fesf from '../../public/Marca-FESFSUS.png'
import { myLoader } from '@/utils/utils'

export default function HeaderForm() {
  return (
    <div className="bg-[#EFEEEE] w-screen h-full py-8 px-4">
      <div className="w-full h-full flex flex-col items-center justify-center gap-6">
        <Image
          loader={myLoader}
          src={logo_fesf}
          alt="Logotipo Fesfsus"
          className="w-96 h-auto"
        />
        <h1 className="text-header-form max-sm:text-center text-2xl  sm:text-4xl">
          SISTEMA DE DIÁRIAS E PASSAGENS
        </h1>
      </div>
    </div>
  )
}
