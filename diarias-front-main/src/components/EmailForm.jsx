import React, { useState } from 'react'
import Modal from 'react-modal'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import ReCAPTCHA from 'react-google-recaptcha'

const EmailForm = () => {
  const [email, setEmail] = useState('')
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [recaptchaValue, setRecaptchaValue] = useState(null)

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    // eslint-disable-next-line no-undef
    const api = process.env.NEXT_PUBLIC_API_URL

    if (!recaptchaValue) {
      setModalMessage('Por favor, complete o reCAPTCHA.')
      setIsSuccess(false)
      setModalIsOpen(true)
      return
    }

    setIsLoading(true) // Ativar o indicador de loading

    try {
      const response = await fetch(
        `${api}/api/v1/funcionario/enviar-link-acesso`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, recaptcha: recaptchaValue })
        }
      )

      if (response.ok) {
        setModalMessage(
          'Email enviado com sucesso! Verifique sua caixa de entrada.'
        )
        setIsSuccess(true)
      } else {
        const errorData = await response.json()
        setModalMessage(
          `${errorData.detail || 'Erro ao enviar o email. Tente novamente.'}`
        )
        setIsSuccess(false)
      }
    } catch (error) {
      console.error('Erro de requisição:', error)
      setModalMessage('Erro ao enviar o email. Tente novamente.')
      setIsSuccess(false)
    } finally {
      setIsLoading(false) // Desativar o indicador de loading
      setModalIsOpen(true)
      setEmail('')
      setRecaptchaValue(null)
    }
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  return (
    <>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4 w-full flex justify-center scale-90">
          <ReCAPTCHA
            // eslint-disable-next-line no-undef
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={handleRecaptchaChange}
          />
        </div>
        <div className="w-full flex justify-center">
          <button
            type="submit"
            className={`px-12 py-2 bg-black text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              (isLoading ? 'opacity-50 cursor-not-allowed' : '',
              !recaptchaValue ? 'bg-slate-700' : 'bg-black')
            }`}
            disabled={isLoading || !recaptchaValue}
          >
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal de Resposta"
        className="bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <div className="flex flex-col items-center">
          {isSuccess ? (
            <FaCheckCircle className="text-green-500 text-7xl mb-4" />
          ) : (
            <FaExclamationCircle className="text-red-500 text-7xl mb-4" />
          )}
          <h2 className="text-lg font-medium text-gray-900 text-center">
            {modalMessage}
          </h2>
          <button
            onClick={closeModal}
            className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Fechar
          </button>
        </div>
      </Modal>
    </>
  )
}

export default EmailForm
