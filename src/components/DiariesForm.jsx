import { useState, useEffect } from 'react'
import {
  Input,
  FormControl,
  FormLabel,
  Button,
  Select,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useBreakpointValue,
  useToast,
  FormHelperText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import InputMask from 'react-input-mask'
import { useDisclosure } from '@chakra-ui/react'

const fetchStates = async () => {
  const response = await fetch(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
  )
  const data = await response.json()
  const sortedData = data.sort((a, b) => a.nome.localeCompare(b.nome))
  return sortedData
}

const fetchCities = async (stateId) => {
  const response = await fetch(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${stateId}/municipios`
  )
  const data = await response.json()
  const sortedData = data.sort((a, b) => a.nome.localeCompare(b.nome))
  return sortedData
}

// eslint-disable-next-line no-undef
const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function DiariesForm({
  token,
  selectedOption,
  solicitationNumber,
  sdValue,
  setFormDataTrechos,
  setCalculos
}) {
  const [states, setStates] = useState([])
  const [originCities, setOriginCities] = useState([])
  const [destinationCities, setDestinationCities] = useState([])
  const [originCitiesEdit, setOriginCitiesEdit] = useState([])
  const [destinationCitiesEdit, setDestinationCitiesEdit] = useState([])
  const [tiposDeslocamento] = useState([
    'Veículo Oficial',
    'Rodoviário Semileito',
    'Rodoviário Leito',
    'Rodoviário (voucher)',
    'Aéreo',
    'Marítimo',
    'Deslocamento de trecho intermediário'
  ])
  const [formData, setFormData] = useState({
    estadoOrigem: 'BA',
    cidadeOrigem: '',
    dataSaida: '',
    horaSaida: '',
    estadoDestino: 'BA',
    cidadeDestino: '',
    dataRetorno: '',
    horaChegada: '',
    tiposDeslocamento: '',
    ultimoTrecho: 'nao'
  })
  const [formDataEdit, setFormDataEdit] = useState({
    estadoOrigem: 'BA',
    cidadeOrigem: '',
    dataSaida: '',
    horaSaida: '',
    estadoDestino: 'BA',
    cidadeDestino: '',
    dataRetorno: '',
    horaChegada: '',
    tiposDeslocamento: '',
    ultimoTrecho: 'nao'
  })
  const [trechos, setTrechos] = useState([])
  const [calculo, setCalculo] = useState(null)
  const [errorDetails, setErrorDetails] = useState('')
  const [dateError, setDateError] = useState('')
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editIndex, setEditIndex] = useState(null)

  useEffect(() => {
    const loadStates = async () => {
      const statesData = await fetchStates()
      setStates(statesData)
      // Carregar cidades de origem e destino para o estado padrão "BA"
      const bahiaState = statesData.find((state) => state.sigla === 'BA')
      if (bahiaState) {
        const originCities = await fetchCities(bahiaState.id)
        setOriginCities(originCities)
        const destinationCities = await fetchCities(bahiaState.id)
        setDestinationCities(destinationCities)
      }
    }
    loadStates()
  }, [])

  useEffect(() => {
    const loadCitiesForSelectedState = async () => {
      const selectedState = states.find(
        (state) => state.sigla === formData.estadoOrigem
      )
      if (selectedState) {
        const cities = await fetchCities(selectedState.id)
        setOriginCities(cities)
      }
    }

    loadCitiesForSelectedState()
  }, [formData.estadoOrigem, states])

  useEffect(() => {
    const loadCitiesForSelectedState = async () => {
      const selectedState = states.find(
        (state) => state.sigla === formData.estadoDestino
      )
      if (selectedState) {
        const cities = await fetchCities(selectedState.id)
        setDestinationCities(cities)
      }
    }

    loadCitiesForSelectedState()
  }, [formData.estadoDestino, states])

  useEffect(() => {
    const loadCitiesForSelectedStateEdit = async () => {
      const selectedState = states.find(
        (state) => state.sigla === formDataEdit.estadoOrigem
      )
      if (selectedState) {
        const cities = await fetchCities(selectedState.id)
        setOriginCitiesEdit(cities)
      }
    }

    loadCitiesForSelectedStateEdit()
  }, [formDataEdit.estadoOrigem, states])

  useEffect(() => {
    const loadCitiesForSelectedStateEdit = async () => {
      const selectedState = states.find(
        (state) => state.sigla === formDataEdit.estadoDestino
      )
      if (selectedState) {
        const cities = await fetchCities(selectedState.id)
        setDestinationCitiesEdit(cities)
      }
    }

    loadCitiesForSelectedStateEdit()
  }, [formDataEdit.estadoDestino, states])

  const handleStateChange = async (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))

    if (name === 'estadoOrigem') {
      const selectedState = states.find((state) => state.sigla === value)
      if (selectedState) {
        const cities = await fetchCities(selectedState.id)
        setOriginCities(cities)
        setFormData((prevData) => ({ ...prevData, cidadeOrigem: '' }))
      }
    }

    if (name === 'estadoDestino') {
      const selectedState = states.find((state) => state.sigla === value)
      if (selectedState) {
        const cities = await fetchCities(selectedState.id)
        setDestinationCities(cities)
        setFormData((prevData) => ({ ...prevData, cidadeDestino: '' }))
      }
    }
  }

  const handleStateChangeEdit = async (event) => {
    const { name, value } = event.target
    setFormDataEdit((prevData) => ({ ...prevData, [name]: value }))

    if (name === 'estadoOrigem') {
      const selectedState = states.find((state) => state.sigla === value)
      if (selectedState) {
        const cities = await fetchCities(selectedState.id)
        setOriginCitiesEdit(cities)
        setFormDataEdit((prevData) => ({ ...prevData, cidadeOrigem: '' }))
      }
    }

    if (name === 'estadoDestino') {
      const selectedState = states.find((state) => state.sigla === value)
      if (selectedState) {
        const cities = await fetchCities(selectedState.id)
        setDestinationCitiesEdit(cities)
        setFormDataEdit((prevData) => ({ ...prevData, cidadeDestino: '' }))
      }
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleChangeEdit = (event) => {
    const { name, value } = event.target
    setFormDataEdit((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleAddTrecho = () => {
    const { dataSaida, horaSaida, dataRetorno, horaChegada } = formData

    const dataHoraSaida = new Date(
      `${dataSaida.split('/').reverse().join('-')}T${horaSaida}:00`
    )
    const dataHoraRetorno = new Date(
      `${dataRetorno.split('/').reverse().join('-')}T${horaChegada}:00`
    )

    if (dataHoraRetorno <= dataHoraSaida) {
      setDateError(
        'A data e hora de retorno deve ser posterior à data e hora de saída.'
      )
      return
    }

    setDateError('')

    const selectedStateOrigem = states.find(
      (state) => state.sigla === formData.estadoOrigem
    )
    const selectedStateDestino = states.find(
      (state) => state.sigla === formData.estadoDestino
    )

    const trecho = {
      dt_saida: formData.dataSaida,
      hr_saida: formData.horaSaida,
      dt_retorno: formData.dataRetorno,
      hr_retorno: formData.horaChegada,
      cidade_origem: formData.cidadeOrigem,
      estado_origem: selectedStateOrigem.id,
      cidade_destino: formData.cidadeDestino,
      estado_destino: selectedStateDestino.id,
      tipo_deslocamento: formData.tiposDeslocamento,
      ultimo_trecho: formData.ultimoTrecho
    }

    setTrechos((prevTrechos) => {
      const newTrechos = [...prevTrechos, trecho]
      return newTrechos
    })
  }

  const handleDeleteTrecho = async (index) => {
    setTrechos((prevTrechos) => prevTrechos.filter((_, i) => i !== index))
    setFormDataTrechos(trechos)
    // Limpa o cálculo do filho e do pai, não tente entender, apenas aceite
    setCalculo(null)
    setCalculos(null)
  }

  useEffect(() => {
    const refreshFormData = async () => {
      if (trechos.length > 0) {
        const ultimoTrecho = trechos[trechos.length - 1]

        setFormData({
          estadoOrigem: states.find(
            (state) => state.id === ultimoTrecho.estado_destino
          ).sigla,
          cidadeOrigem: ultimoTrecho.cidade_destino,
          dataSaida: ultimoTrecho.dt_retorno,
          horaSaida: ultimoTrecho.hr_retorno,
          estadoDestino: 'BA',
          cidadeDestino: '',
          dataRetorno: '',
          horaChegada: '',
          tiposDeslocamento: '',
          ultimoTrecho: 'nao'
        })
      } else {
        setFormData({
          estadoOrigem: 'BA',
          cidadeOrigem: '',
          dataSaida: '',
          horaSaida: '',
          estadoDestino: 'BA',
          cidadeDestino: '',
          dataRetorno: '',
          horaChegada: '',
          tiposDeslocamento: '',
          ultimoTrecho: 'nao'
        })
      }
    }

    refreshFormData()
  }, [trechos, states])

  const handleCalculateTrechos = async () => {
    try {
      const body = {
        trechos,
        tipo_sd: selectedOption
      }

      // Adiciona valor_sd e codigo_sd apenas se selectedOption for "solicitação"
      if (selectedOption !== 'solicitação') {
        body.valor_sd = sdValue
        body.codigo_sd = solicitationNumber
      }
      setFormDataTrechos(body)
      const response = await fetch(`${API_URL}/api/v1/diaria/calcular`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
      if (!response.ok) {
        const erroDetails = await response.json()
        setErrorDetails(erroDetails.detail)
        throw new Error('Erro ao calcular trechos')
      }

      const result = await response.json()
      setCalculos(result)
      setCalculo(result)
      toast({
        title: 'Sucesso!',
        description: `Cálculo realizado com sucesso.`,
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: 'Erro!',
        description: `${errorDetails}`,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  // Função para verificar se o formulário está preenchido
  const isFormValid = () => {
    const {
      estadoOrigem,
      cidadeOrigem,
      dataSaida,
      horaSaida,
      estadoDestino,
      cidadeDestino,
      dataRetorno,
      horaChegada,
      tiposDeslocamento,
      ultimoTrecho
    } = formData
    return (
      estadoOrigem &&
      cidadeOrigem &&
      dataSaida &&
      horaSaida &&
      estadoDestino &&
      cidadeDestino &&
      dataRetorno &&
      horaChegada &&
      tiposDeslocamento &&
      ultimoTrecho
    )
  }

  const handleEditTrecho = (index) => {
    const trecho = trechos[index]
    const selectedStateOrigem = states.find(
      (state) => state.id === trecho.estado_origem
    )
    const selectedStateDestino = states.find(
      (state) => state.id === trecho.estado_destino
    )

    setFormDataEdit({
      estadoOrigem: selectedStateOrigem.sigla,
      cidadeOrigem: trecho.cidade_origem,
      dataSaida: trecho.dt_saida,
      horaSaida: trecho.hr_saida,
      estadoDestino: selectedStateDestino.sigla,
      cidadeDestino: trecho.cidade_destino,
      dataRetorno: trecho.dt_retorno,
      horaChegada: trecho.hr_retorno,
      tiposDeslocamento: trecho.tipo_deslocamento,
      ultimoTrecho: trecho.ultimo_trecho
    })
    setEditIndex(index)
    onOpen()
  }

  const handleSaveEditTrecho = () => {
    if (editIndex !== null) {
      setTrechos((prevTrechos) => {
        const newTrechos = [...prevTrechos]
        const selectedStateOrigem = states.find(
          (state) => state.sigla === formDataEdit.estadoOrigem
        )
        const selectedStateDestino = states.find(
          (state) => state.sigla === formDataEdit.estadoDestino
        )
        newTrechos[editIndex] = {
          dt_saida: formDataEdit.dataSaida,
          hr_saida: formDataEdit.horaSaida,
          dt_retorno: formDataEdit.dataRetorno,
          hr_retorno: formDataEdit.horaChegada,
          cidade_origem: formDataEdit.cidadeOrigem,
          estado_origem: selectedStateOrigem.id,
          cidade_destino: formDataEdit.cidadeDestino,
          estado_destino: selectedStateDestino.id,
          tipo_deslocamento: formDataEdit.tiposDeslocamento,
          ultimo_trecho: formDataEdit.ultimoTrecho
        }
        return newTrechos
      })
      setEditIndex(null)
      onClose()
    }
  }

  const handleCancelEdit = () => {
    setEditIndex(null)
    onClose()
  }

  // Função para verificar se a tabela tem pelo menos um trecho
  const hasTrechos = trechos.length > 0

  const isSmallScreen = useBreakpointValue({ base: true, md: false })

  const isUltimoTrecho = formData.ultimoTrecho === 'sim'

  // Desabilitar a opção "Último Trecho" se a lista de trechos tiver menos de 2 registros
  const isLastTrechoDisabled = trechos.length < 1

  // Desabilitar a opção "Último Trecho" se já existir um trecho com "último trecho" = sim
  const hasLastTrecho = trechos.some((trecho) => trecho.ultimo_trecho === 'sim')
  const isLastTrechoAlreadySet = hasLastTrecho
  const hasTrechosAndIsLastTrechoAlreadySet =
    hasTrechos && isLastTrechoAlreadySet

  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormControl isRequired>
          <FormLabel>Estado de Origem</FormLabel>
          <Select
            name="estadoOrigem"
            value={formData.estadoOrigem}
            onChange={handleStateChange}
          >
            <option value="">Selecione um estado</option>
            {states.map((state) => (
              <option key={state.id} value={state.sigla}>
                {state.nome}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Cidade de Origem</FormLabel>
          <Select
            name="cidadeOrigem"
            value={formData.cidadeOrigem}
            onChange={handleChange}
          >
            <option value="">Selecione uma cidade</option>
            {originCities.map((city) => (
              <option key={city.id} value={city.nome}>
                {city.nome}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Data Saída da Origem</FormLabel>
          <Input
            as={InputMask}
            placeholder="DD/MM/AAAA"
            mask="99/99/9999"
            name="dataSaida"
            value={formData.dataSaida}
            onChange={handleChange}
          ></Input>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Hora Saída da Origem</FormLabel>
          <Input
            as={InputMask}
            placeholder="HH:MM"
            mask="99:99"
            name="horaSaida"
            value={formData.horaSaida}
            onChange={handleChange}
          ></Input>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Estado de Destino</FormLabel>
          <Select
            name="estadoDestino"
            value={formData.estadoDestino}
            onChange={handleStateChange}
          >
            <option value="">Selecione um estado</option>
            {states.map((state) => (
              <option key={state.id} value={state.sigla}>
                {state.nome}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Cidade de Destino</FormLabel>
          <Select
            name="cidadeDestino"
            value={formData.cidadeDestino}
            onChange={handleChange}
          >
            <option value="">Selecione uma cidade</option>
            {destinationCities.map((city) => (
              <option key={city.id} value={city.nome}>
                {city.nome}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="dataRetorno">
            {isUltimoTrecho ? 'Data Retorno Origem' : 'Data Saída do Destino'}
          </FormLabel>
          <Input
            id="dataRetorno"
            as={InputMask}
            placeholder="DD/MM/AAAA"
            mask="99/99/9999"
            name="dataRetorno"
            value={formData.dataRetorno}
            onChange={handleChange}
          ></Input>
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="horaChegada">
            {isUltimoTrecho ? 'Hora Retorno Origem' : 'Hora Saída do Destino'}
          </FormLabel>
          <Input
            id="horaChegada"
            as={InputMask}
            mask="99:99"
            placeholder="HH:MM"
            name="horaChegada"
            value={formData.horaChegada}
            onChange={handleChange}
          ></Input>
        </FormControl>
        <FormControl isRequired className="lg:col-span-1">
          <FormLabel>Tipos de Deslocamento</FormLabel>
          <Select
            name="tiposDeslocamento"
            value={formData.tiposDeslocamento}
            onChange={handleChange}
          >
            <option value="">Selecione um tipo de Deslocamento</option>
            {tiposDeslocamento.map((tipo, index) => (
              <option key={`${tipo}${index}`} value={tipo}>
                {tipo}
              </option>
            ))}
          </Select>
          {dateError && (
            <FormHelperText color="red.500">{dateError}</FormHelperText>
          )}
        </FormControl>
        <FormControl isRequired className="lg:col-span-1">
          <FormLabel>Último Trecho</FormLabel>
          <Select
            name="ultimoTrecho"
            value={formData.ultimoTrecho}
            onChange={handleChange}
            isDisabled={isLastTrechoDisabled || isLastTrechoAlreadySet}
          >
            <option value="nao">Não</option>
            <option value="sim">Sim</option>
          </Select>
        </FormControl>
        <div className="flex items-end justify-end lg:col-span-2">
          <Button
            colorScheme="blue"
            onClick={handleAddTrecho}
            className={`w-full md:w-[10rem]`}
            isDisabled={!isFormValid() || isLastTrechoAlreadySet} // Desabilita o botão se o formulário não estiver válido
          >
            Adicionar Trecho
          </Button>
        </div>
      </div>
      {trechos.length > 0 && (
        <>
          <Box mt={10} overflowX="auto">
            <Table variant="simple" size={isSmallScreen ? 'sm' : 'md'}>
              <Thead>
                <Tr>
                  <Th>Cidade de Origem</Th>
                  <Th>Data Saída da Origem</Th>
                  <Th>Hora Saída da Origem</Th>
                  <Th>Cidade de Destino</Th>
                  <Th>Data Saída do Destino</Th>
                  <Th>Hora Saída do Destino</Th>
                  <Th>Tipo de Deslocamento</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {trechos
                  .filter((trecho) => trecho.ultimo_trecho === 'nao')
                  .map((trecho, index) => (
                    <Tr key={index}>
                      <Td>
                        {trecho.cidade_origem} -{' '}
                        {
                          states.find(
                            (state) => state.id === trecho.estado_origem
                          )?.sigla
                        }
                      </Td>
                      <Td>{trecho.dt_saida}</Td>
                      <Td>{trecho.hr_saida}</Td>
                      <Td>
                        {trecho.cidade_destino} -{' '}
                        {
                          states.find(
                            (state) => state.id === trecho.estado_destino
                          )?.sigla
                        }
                      </Td>
                      <Td>{trecho.dt_retorno}</Td>
                      <Td>{trecho.hr_retorno}</Td>
                      <Td>{trecho.tipo_deslocamento}</Td>
                      <Td>
                        <div className="flex gap-1">
                          <IconButton
                            aria-label="Editar trecho"
                            icon={<EditIcon />}
                            size="sm"
                            colorScheme="yellow"
                            onClick={() => handleEditTrecho(index)}
                          />
                          <IconButton
                            aria-label="Excluir trecho"
                            icon={<DeleteIcon />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleDeleteTrecho(index)}
                          />
                        </div>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Box>

          {trechos.some((trecho) => trecho.ultimo_trecho === 'sim') && (
            <Box mt={10} overflowX="auto">
              <Table variant="simple" size={isSmallScreen ? 'sm' : 'md'}>
                <Thead>
                  <Tr>
                    <Th>Cidade de Origem</Th>
                    <Th>Data Saída da Origem</Th>
                    <Th>Hora Saída da Origem</Th>
                    <Th>Cidade de Destino</Th>
                    <Th>Data Retorno Origem</Th>
                    <Th>Hora Retorno Origem</Th>
                    <Th>Tipo de Deslocamento</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {trechos.map(
                    (trecho, index) =>
                      trecho.ultimo_trecho === 'sim' && (
                        <Tr key={index}>
                          <Td>
                            {trecho.cidade_origem} -{' '}
                            {
                              states.find(
                                (state) => state.id === trecho.estado_origem
                              )?.sigla
                            }
                          </Td>
                          <Td>{trecho.dt_saida}</Td>
                          <Td>{trecho.hr_saida}</Td>
                          <Td>
                            {trecho.cidade_destino} -{' '}
                            {
                              states.find(
                                (state) => state.id === trecho.estado_destino
                              )?.sigla
                            }
                          </Td>
                          <Td>{trecho.dt_retorno}</Td>
                          <Td>{trecho.hr_retorno}</Td>
                          <Td>{trecho.tipo_deslocamento}</Td>
                          <Td>
                            <div className="flex gap-1">
                              <IconButton
                                aria-label="Editar trecho"
                                icon={<EditIcon />}
                                size="sm"
                                colorScheme="yellow"
                                onClick={() => handleEditTrecho(index)}
                              />
                              <IconButton
                                aria-label="Excluir trecho"
                                icon={<DeleteIcon />}
                                size="sm"
                                colorScheme="red"
                                onClick={() => handleDeleteTrecho(index)}
                              />
                            </div>
                          </Td>
                        </Tr>
                      )
                  )}
                </Tbody>
              </Table>
            </Box>
          )}

          <div className="flex justify-center mt-8">
            <Button
              colorScheme="blue"
              onClick={handleCalculateTrechos}
              paddingX="8rem"
              className={`w-full md:w-[10rem]`}
              isDisabled={!hasTrechosAndIsLastTrechoAlreadySet} // Desabilita o botão se não houver trechos
            >
              Calcular Trecho
            </Button>
          </div>
        </>
      )}
      {calculo && (
        <Box mt={10} overflowX="auto">
          <Table variant="simple" size={isSmallScreen ? 'sm' : 'md'}>
            <Thead>
              <Tr>
                <Th>Resumo</Th>
                <Th textAlign="center">Tipo Diária</Th>
                <Th textAlign="center">Quantidade de diárias</Th>
                <Th textAlign="center">Valor Total</Th>
                <Th textAlign="center">Valor da SD</Th>
                <Th textAlign="center">Valor da Complementação/Devolução</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td></Td>
                <Td textAlign="center">Diárias Completas</Td>
                <Td textAlign="center">
                  {calculo.quantidade_diarias_completas}
                </Td>
                <Td textAlign="center">R$ {calculo.valor_diarias_completas}</Td>
                <Td></Td>
                <Td></Td>
              </Tr>
              <Tr>
                <Td></Td>
                <Td textAlign="center">Diárias Simples</Td>
                <Td textAlign="center">{calculo.quantidade_diarias_simples}</Td>
                <Td textAlign="center">R$ {calculo.valor_diarias_simples}</Td>
                <Td></Td>
                <Td></Td>
              </Tr>
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td textAlign="center" className="font-bold">
                  R$ {calculo.valor_total}
                </Td>
                <Td textAlign="center" className="font-bold">
                  {selectedOption !== 'solicitação'
                    ? `R$ ${calculo.valor_sd}`
                    : ' '}
                </Td>
                <Td textAlign="center" className="font-bold">
                  {selectedOption === 'devolução' &&
                    `R$ ${calculo.valor_devolucao}`}
                  {selectedOption === 'complementação' &&
                    `R$ ${calculo.valor_complementacao}`}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={handleCancelEdit}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Trecho</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              <div>
                <FormControl isRequired>
                  <FormLabel>Estado de Origem</FormLabel>
                  <Select
                    name="estadoOrigem"
                    value={formDataEdit.estadoOrigem}
                    onChange={handleStateChangeEdit}
                  >
                    <option value="">Selecione um estado</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.sigla}>
                        {state.nome}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired className="mt-2">
                  <FormLabel>Cidade de Origem</FormLabel>
                  <Select
                    name="cidadeOrigem"
                    value={formDataEdit.cidadeOrigem}
                    onChange={handleChangeEdit}
                  >
                    <option value="">Selecione uma cidade</option>
                    {originCitiesEdit.map((city) => (
                      <option key={city.id} value={city.nome}>
                        {city.nome}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired className="mt-2">
                  <FormLabel>Data Saída da Origem</FormLabel>
                  <Input
                    as={InputMask}
                    placeholder="DD/MM/AAAA"
                    mask="99/99/9999"
                    name="dataSaida"
                    value={formDataEdit.dataSaida}
                    onChange={handleChangeEdit}
                  />
                </FormControl>
                <FormControl isRequired className="mt-2">
                  <FormLabel>Hora Saída da Origem</FormLabel>
                  <Input
                    as={InputMask}
                    placeholder="HH:MM"
                    mask="99:99"
                    name="horaSaida"
                    value={formDataEdit.horaSaida}
                    onChange={handleChangeEdit}
                  />
                </FormControl>
              </div>
              <hr className="my-6" />
              <div>
                <FormControl isRequired>
                  <FormLabel>Estado de Destino</FormLabel>
                  <Select
                    name="estadoDestino"
                    value={formDataEdit.estadoDestino}
                    onChange={handleStateChangeEdit}
                  >
                    <option value="">Selecione um estado</option>
                    {states.map((state) => (
                      <option key={state.id} value={state.sigla}>
                        {state.nome}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired className="mt-2">
                  <FormLabel>Cidade de Destino</FormLabel>
                  <Select
                    name="cidadeDestino"
                    value={formDataEdit.cidadeDestino}
                    onChange={handleChangeEdit}
                  >
                    <option value="">Selecione uma cidade</option>
                    {destinationCitiesEdit.map((city) => (
                      <option key={city.id} value={city.nome}>
                        {city.nome}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired className="mt-2">
                  <FormLabel>Data Saída do Destino</FormLabel>
                  <Input
                    as={InputMask}
                    placeholder="DD/MM/AAAA"
                    mask="99/99/9999"
                    name="dataRetorno"
                    value={formDataEdit.dataRetorno}
                    onChange={handleChangeEdit}
                  />
                </FormControl>
                <FormControl isRequired className="mt-2">
                  <FormLabel>Hora Saída do Destino</FormLabel>
                  <Input
                    as={InputMask}
                    placeholder="HH:MM"
                    mask="99:99"
                    name="horaChegada"
                    value={formDataEdit.horaChegada}
                    onChange={handleChangeEdit}
                  />
                </FormControl>
              </div>
              <hr className="my-6" />
              <div>
                <FormControl isRequired>
                  <FormLabel>Tipos de Deslocamento</FormLabel>
                  <Select
                    name="tiposDeslocamento"
                    value={formDataEdit.tiposDeslocamento}
                    onChange={handleChangeEdit}
                  >
                    <option value="">Selecione um tipo de Deslocamento</option>
                    {tiposDeslocamento.map((tipo, index) => (
                      <option key={`${tipo}${index}`} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </Select>
                  {dateError && (
                    <FormHelperText color="red.500">{dateError}</FormHelperText>
                  )}
                </FormControl>
                <FormControl isRequired className="mt-2">
                  <FormLabel>Último Trecho</FormLabel>
                  <Select
                    name="ultimoTrecho"
                    value={formDataEdit.ultimoTrecho}
                    onChange={handleChangeEdit}
                  >
                    <option value="nao">Não</option>
                    <option value="sim">Sim</option>
                  </Select>
                </FormControl>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSaveEditTrecho}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
