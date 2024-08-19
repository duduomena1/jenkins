import ContainerForms from '@/components/ContainerForms'
import HeaderForm from '@/components/HeaderForm'
import PersonalForms from '@/components/PersonalForms'
import SolicitationForm from '@/components/SolicitationForm'
import BankDetailsForm from '@/components/BankDetailsForm'
import jwt from 'jsonwebtoken'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import {
  Button,
  Textarea,
  Checkbox,
  FormControl,
  FormLabel,
  FormHelperText
} from '@chakra-ui/react'
import CreateUserModal from '@/components/CreateUserModal'
import DiariesForm from '@/components/DiariesForm'
import PDFGenerator from '@/components/PDFGenerator'

export default function Formulario() {
  const router = useRouter()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [userCreationModalIsOpen, setUserCreationModalIsOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [token, setToken] = useState(null)
  const [selectedOption, setSelectedOption] = useState('')
  const [solicitationNumber, setSolicitationNumber] = useState('')
  const [sdValue, setSdValue] = useState('')
  const [bankDetails, setBankDetails] = useState({})
  const [formData, setFormData] = useState({
    cpf: '',
    nome: '',
    endereco: '',
    estado: '',
    cidade: '',
    dataNascimento: '',
    rg: '',
    telefone: '',
    postoTrabalho: '',
    cargoFuncao: '',
    matricula: '',
    centroCusto: ''
  })

  const [formDataTrechos, setFormDataTrechos] = useState({
    tipo_sd: '',
    trechos: [
      {
        cidade_destino: '',
        cidade_origem: '',
        dt_retorno: '',
        dt_saida: '',
        estado_destino: '',
        estado_origem: '',
        hr_retorno: '',
        hr_saida: '',
        tipo_deslocamento: ''
      }
    ]
  })

  const [calculo, setCalculo] = useState({
    quantidade_diarias_simples: '',
    quantidade_diarias_completas: '',
    valor_diarias_simples: '',
    valor_diarias_completas: '',
    valor_total: '',
    user_id: ''
  })

  const [tokenDecoded, setTokenDecoded] = useState({})
  const [observations, setObservations] = useState('')
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  const [fieldsPdf, setFieldsPdf] = useState(null)
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false)
  const [areObservationsFilled, setAreObservationsFilled] = useState(false)

  // eslint-disable-next-line no-undef
  const emailValidate = process.env.NEXT_PUBLIC_EMAIL_VALIDATION

  useEffect(() => {
    if (router.isReady) {
      const { token } = router.query

      if (token) {
        try {
          // eslint-disable-next-line no-undef
          const secret = process.env.NEXT_PUBLIC_JWT_SECRET
          const decoded = jwt.decode(token, secret)
          setToken(token)
          setTokenDecoded(decoded.sub)
          const tokenExpiration = decoded.exp * 1000
          if (Date.now() > tokenExpiration) {
            handleSessionExpired(
              'Sessão expirada. Por favor, faça login novamente.'
            )
          }
        } catch (error) {
          console.error('Erro ao verificar o token:', error)
          handleSessionExpired(
            'Token inválido. Por favor, faça login novamente.'
          )
        }
      } else {
        router.push('/login')
      }
    }
  }, [router.isReady, router.query])

  const handleSessionExpired = (message) => {
    setModalMessage(message)
    setModalIsOpen(true)
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }

  const closeUserCreationModal = () => {
    setUserCreationModalIsOpen(false)
  }

  const closePdfModal = () => {
    setIsPdfModalOpen(false)
  }

  const shouldShowPersonalForms =
    selectedOption !== '' &&
    (selectedOption === 'solicitação' ||
      (selectedOption !== 'solicitação' && solicitationNumber && sdValue))

  const isFormValid = () => {
    return (
      isCheckboxChecked &&
      arePersonalFormsFilled() &&
      areBankDetailsFilled() &&
      areDiariesFormFilled() &&
      areObservationsFilled
    )
  }

  const arePersonalFormsFilled = () => {
    return Object.values(formData).every((field) => field.trim() !== '')
  }

  const areBankDetailsFilled = () => {
    return Object.values(bankDetails).every((field) => field.trim() !== '')
  }

  const areDiariesFormFilled = () => {
    return (
      formDataTrechos.trechos?.every((trecho) =>
        Object.values(trecho).every((field) =>
          typeof field === 'string' ? field.trim() !== '' : field !== ''
        )
      ) ?? false
    )
  }

  function handleObservationsChange(e) {
    const newObservations = e.target.value
    setObservations(newObservations)
    setAreObservationsFilled(newObservations.length >= 20)
  }

  useEffect(() => {
    setFormData({
      cpf: '',
      nome: '',
      endereco: '',
      estado: '',
      cidade: '',
      dataNascimento: '',
      rg: '',
      telefone: '',
      postoTrabalho: '',
      cargoFuncao: '',
      matricula: '',
      centroCusto: ''
    })
    setBankDetails({})
    setObservations('')
    setIsCheckboxChecked(false)
    setFormDataTrechos({
      tipo_sd: '',
      trechos: [
        {
          cidade_destino: '',
          cidade_origem: '',
          dt_retorno: '',
          dt_saida: '',
          estado_destino: '',
          estado_origem: '',
          hr_retorno: '',
          hr_saida: '',
          tipo_deslocamento: ''
        }
      ]
    })
  }, [selectedOption])

  useEffect(() => {
    if (formData.cpf.length < 11) {
      setFormData({
        cpf: '',
        nome: '',
        endereco: '',
        estado: '',
        cidade: '',
        dataNascimento: '',
        rg: '',
        telefone: '',
        postoTrabalho: '',
        cargoFuncao: '',
        matricula: '',
        centroCusto: ''
      })
      setBankDetails({})
    }
  }, [formData.cpf])

  const sendForm = async (fields) => {
    const fieldsPdf = {
      tipoSD: selectedOption,
      nome: formData.nome,
      cpf: bankDetails.cpf,
      rg: formData.rg,
      dataNascimento: formData.dataNascimento,
      telefone: formData.telefone,
      endereco: formData.endereco,
      estado: formData.estado,
      cargoFuncao: formData.cargoFuncao,
      postoTrabalho: formData.postoTrabalho,
      matricula: formData.matricula,
      cidade: formData.cidade,
      centroCusto: formData.centroCusto,
      banco: bankDetails.nome_banco,
      agencia: bankDetails.agencia,
      conta: bankDetails.conta_corrente,
      trechos: formDataTrechos.trechos,
      quantidadeDiariaSimples: calculo.quantidade_diarias_simples,
      valorDiariaSimples: calculo.valor_diarias_simples,
      quantidadeDiariaCompleta: calculo.quantidade_diarias_completas,
      valorDiariasCompletas: calculo.valor_diarias_completas,
      valorTotal: calculo.valor_total,
      valorSd: sdValue,
      valorDevolucao: calculo.valor_devolucao || null,
      valorComplementacao: calculo.valor_complementacao || null,
      email: tokenDecoded,
      resumo: observations
    }
    try {
      const response = await fetch(
        // eslint-disable-next-line no-undef
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/diaria/gerar_sd`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(fields)
        }
      )

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        fieldsPdf.codigoSd = data.codigo_sd
        fieldsPdf.dataHora = data.data_hora_sd
        fieldsPdf.user_id = data.user_id
        setFieldsPdf(fieldsPdf)
        setIsPdfModalOpen(true)
      } else {
        console.error('Erro ao gerar o PDF:', response)
      }
    } catch (error) {
      console.error('Erro ao gerar o PDF:', error)
    }
    console.log(fieldsPdf)
    return fieldsPdf
  }

  return (
    <div className="mx-auto min-h-screen flex flex-col justify-between">
      {token && (
        <div className="flex flex-col sm:gap-4 md:gap-8 mb-4">
          <HeaderForm />
          {tokenDecoded === emailValidate && (
            <div className="container mx-auto w-full flex justify-end mt-4 p-4">
              <Button
                colorScheme="blue"
                onClick={() => setUserCreationModalIsOpen(true)}
                size={{ base: 'md', lg: 'lg' }}
                variant="solid"
                borderRadius="md"
                shadow="md"
                _hover={{ bg: 'teal.600' }}
              >
                Criar Novo Usuário
              </Button>
            </div>
          )}
          <ContainerForms titulo="TIPO DE SOLICITAÇÃO">
            <SolicitationForm
              setSelectedOption={setSelectedOption}
              setSolicitationNumber={setSolicitationNumber}
              setSdValue={setSdValue}
            />
          </ContainerForms>
          {shouldShowPersonalForms && (
            <>
              <ContainerForms titulo="DADOS PESSOAIS">
                <div className="flex flex-col w-full">
                  <PersonalForms
                    setBankDetails={setBankDetails}
                    setFormData={setFormData}
                    formData={formData}
                  />
                  <hr className="my-14" />
                  <BankDetailsForm
                    bankDetails={bankDetails}
                    setBankDetails={setBankDetails}
                  />
                </div>
              </ContainerForms>
              {arePersonalFormsFilled() && (
                <ContainerForms titulo="DIÁRIAS E PASSAGENS">
                  <div className="flex flex-col w-full">
                    <DiariesForm
                      token={token}
                      selectedOption={selectedOption}
                      sdValue={sdValue}
                      solicitationNumber={solicitationNumber}
                      setCalculos={setCalculo}
                      setFormDataTrechos={setFormDataTrechos}
                    />
                  </div>
                </ContainerForms>
              )}
              <ContainerForms titulo="OBSERVAÇÕES">
                <FormControl isRequired>
                  <FormLabel>Descrição das Atividades:</FormLabel>
                  <div className="flex flex-col w-full">
                    <Textarea
                      placeholder="Digite sua observação aqui..."
                      size="md"
                      value={observations}
                      onChange={handleObservationsChange}
                    />
                  </div>
                  {!areObservationsFilled && (
                    <FormHelperText color="red.500">
                      * Mínimo de 20 caracteres.
                    </FormHelperText>
                  )}
                </FormControl>
              </ContainerForms>
              <div className="container flex w-full justify-start mt-4 mx-auto px-4 mb-4">
                <Checkbox
                  isChecked={isCheckboxChecked}
                  onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                  size={{ base: 'md', lg: 'lg' }}
                >
                  Confirmo que todos os dados estão corretos e que as
                  informações bancárias foram devidamente atualizadas.
                </Checkbox>
              </div>
              <div className="flex justify-center pb-8 px-4">
                <Button
                  colorScheme="blue"
                  paddingX="8rem"
                  onClick={() =>
                    sendForm({
                      tipo_sd: selectedOption,
                      codigo_sd: solicitationNumber
                    })
                  }
                  isDisabled={!isFormValid()}
                  className={`w-full md:w-[10rem]`}
                >
                  Gerar Solicitação
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal de Sessão Expirada"
        className="bg-white p-4 rounded-lg shadow-lg max-w-md mx-auto my-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-lg font-medium text-gray-900">{modalMessage}</h2>
      </Modal>
      {tokenDecoded === emailValidate && (
        <CreateUserModal
          isOpen={userCreationModalIsOpen}
          onClose={closeUserCreationModal}
          token={token}
        />
      )}
      {fieldsPdf && (
        <Modal
          isOpen={isPdfModalOpen}
          onRequestClose={closePdfModal}
          contentLabel="PDF Preview"
          className="bg-white p-4 rounded-lg shadow-lg max-w-5xl mx-auto my-20 h-4/5 overflow-auto"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <PDFGenerator fieldsPdf={fieldsPdf} />
          <div className="w-full flex justify-end">
            <Button
              onClick={() => setIsPdfModalOpen(false)}
              colorScheme="blue"
              paddingX="4rem"
              className={`w-4 mt-4`}
            >
              Fechar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
