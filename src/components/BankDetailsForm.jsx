import { useState, useEffect } from 'react'
import {
  Input,
  FormControl,
  FormLabel,
  Button,
  Select,
  FormHelperText
} from '@chakra-ui/react'
import Modal from 'react-modal'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { useRouter } from 'next/router'

export default function BankDetailsForm({ bankDetails, setBankDetails }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    cod_banco: '',
    nome_banco: '',
    agencia: '',
    conta_corrente: ''
  })
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [banks, setBanks] = useState([])
  const [token, setToken] = useState('')

  useEffect(() => {
    if (router.isReady) {
      const { token } = router.query
      if (token) {
        setToken(token)
        fetchBanks(token)
      }
    }
  }, [router.isReady, router.query])

  useEffect(() => {
    if (bankDetails) {
      setFormData({
        cod_banco: bankDetails.cod_banco || '',
        nome_banco: bankDetails.nome_banco || '',
        agencia: bankDetails.agencia || '',
        conta_corrente: bankDetails.conta_corrente || ''
      })
    }
  }, [bankDetails])

  const fetchBanks = async (token) => {
    try {
      const response = await fetch(
        // eslint-disable-next-line no-undef
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/banco/listar`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        const data = await response.json()

        const banksArray = Array.isArray(data)
          ? data
          : Object.entries(data).map(([cod_banco, nome_banco]) => ({
              cod_banco,
              nome_banco
            }))

        setBanks(banksArray)
      }
    } catch (error) {
      console.error('Erro ao buscar bancos:', error)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name === 'cod_banco') {
      // Encontre o nome do banco correspondente ao código selecionado
      const selectedBank = banks.find((bank) => bank.cod_banco === value)
      setFormData((prevData) => ({
        ...prevData,
        cod_banco: value,
        nome_banco: selectedBank ? selectedBank.nome_banco : ''
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value || ''
      }))
    }
  }

  const handleSave = async () => {
    if (!token) {
      setModalMessage('Token não encontrado. Não é possível salvar os dados.')
      setIsSuccess(false)
      setModalIsOpen(true)
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        // eslint-disable-next-line no-undef
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/funcionario/atualizar/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            cod_banco: formData.cod_banco || '',
            cpf: bankDetails.cpf || '',
            nome_banco: formData.nome_banco || '', // Envia o nome do banco selecionado
            agencia: formData.agencia || '',
            conta_corrente: formData.conta_corrente || ''
          })
        }
      )

      if (response.ok) {
        setModalMessage('Dados bancários atualizados com sucesso!')
        const data = await response.json()
        setBankDetails(data)
        setIsSuccess(true)
      } else {
        const errorData = await response.json()
        setModalMessage(
          `${
            errorData.detail ||
            'Erro ao atualizar dados bancários. Tente novamente.'
          }`
        )
        setIsSuccess(false)
      }
    } catch (error) {
      console.error('Erro ao atualizar dados bancários:', error)
      setModalMessage('Erro ao atualizar dados bancários. Tente novamente.')
      setIsSuccess(false)
    } finally {
      setIsLoading(false)
      setModalIsOpen(true)
    }
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  // Função para verificar se todos os campos obrigatórios estão preenchidos
  const isFormValid = () => {
    const { cod_banco, nome_banco, agencia, conta_corrente } = formData
    const valid =
      cod_banco !== '' &&
      nome_banco !== '' &&
      agencia !== '' &&
      conta_corrente !== ''
    return valid
  }

  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormControl isRequired>
          <FormLabel>Banco</FormLabel>
          <Select
            name="cod_banco"
            value={formData.cod_banco || ''}
            onChange={handleChange}
          >
            <option value="">Selecione um banco</option>
            {banks.map((bank) => (
              <option key={bank.cod_banco} value={bank.cod_banco}>
                {bank.nome_banco}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Agência</FormLabel>
          <Input
            placeholder="Agência"
            name="agencia"
            value={formData.agencia || ''}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Conta Corrente</FormLabel>
          <Input
            placeholder="Conta Corrente"
            name="conta_corrente"
            value={formData.conta_corrente || ''}
            onChange={handleChange}
          />
          <FormHelperText color="red.500">
            * Não é possível colocar conta salário.
          </FormHelperText>
        </FormControl>
      </div>
      <div className="flex justify-end mt-4">
        <Button
          colorScheme="blue"
          onClick={handleSave}
          className={`w-full md:w-[10rem] ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          isDisabled={isLoading || !isFormValid()} // Desabilita o botão se não for válido
        >
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
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
