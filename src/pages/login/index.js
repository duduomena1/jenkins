import { myLoader } from '@/utils/utils'
import Image from 'next/image'
import EmailForm from '@/components/EmailForm'

function Login() {
  return (
    <div className="w-screen h-screen bg-white flex justify-center items-center p-4">
      <div className="sm:bg-[#DEDEDE] drop-shadow-md rounded-md sm:w-[50rem] h-[35rem] flex flex-col justify-center items-center gap-10">
        <Image
          loader={myLoader}
          alt="Logotipo Fesfsus"
          className="w-52 sm:w-96"
        />
        <div className="bg-white sm:w-[35rem] h-72 rounded-md drop-shadow-md flex flex-col justify-center items-center px-4 py-6">
          <div className="flex flex-col w-full">
            <p className="text-[14px] text-position-testimony text-[#8C8A97]">
              Bem vindo ao
            </p>
            <p className="text-title-banner">TESTE</p>
          </div>
          <EmailForm />
        </div>
      </div>
    </div>
  )
}

Login.disableLayout = true

export default Login
