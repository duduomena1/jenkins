import Image from 'next/image'
import logoFesf from '../../public/Marca-FESFSUS-footer.png'
import Copyright from './Copyright'
import { myLoader } from '@/utils/utils'

export default function Footer() {
  return (
    <div className="mt-auto bg-[#003C1A] text-white">
      <div className="bg-[#005927]">
        <div className="container mx-auto flex justify-center py-4">
          <div className="flex flex-col items-center justify-center">
            <Image
              loader={myLoader}
              src={logoFesf}
              alt="Logotipo Fesfsus"
              className="w-[264px]"
            />
            <p className="text-link-footer text-center mb-0 mt-1">
              Edf. Cidade do Salvador - Av. Estados Unidos, 397 - Comercio,
              Salvador - BA, 40010-020, Telefone: (71) 3417-3500
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[#003C1A]">
        <div className="container mx-auto flex justify-center py-2">
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Copyright texto="©2023 FESF-SUS. Todos os direitos reservados." />
          </div>
        </div>
      </div>
    </div>
  )
}
