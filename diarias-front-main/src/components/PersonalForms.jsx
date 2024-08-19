import { useState, useEffect, useCallback } from 'react'
import {
  Input,
  FormControl,
  FormLabel,
  SimpleGrid,
  GridItem
} from '@chakra-ui/react'
import InputMask from 'react-input-mask'
import { useRouter } from 'next/router'

// Função para validar o CPF
const isValidCpf = (cpf) => {
  const cleanedCpf = cpf.replace(/\D/g, '')
  return cleanedCpf.length === 11
}

// Função para buscar dados do usuário com base no CPF
const fetchUserData = async (cpf, token) => {
  // eslint-disable-next-line no-undef
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  try {
    const response = await fetch(`${apiUrl}/api/v1/funcionario/buscar/${cpf}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error.message)
    return {}
  }
}

export default function PersonalForms({
  setBankDetails,
  setFormData,
  formData
}) {
  const router = useRouter()

  const getTokenFromQuery = () => {
    if (router.isReady) {
      return router.query.token || null
    }
    return null
  }

  const [cpf, setCpf] = useState('')
  const [cpfError, setCpfError] = useState('')
  const [userData, setUserData] = useState({})
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false)

  const handleCpfChange = (e) => {
    const value = e.target.value
    setCpf(value)
    if (isValidCpf(value)) {
      setCpfError('')
    } else {
      setCpfError('CPF inválido')
    }
  }

  const handleUserDataFetch = useCallback(
    async (cpf) => {
      const token = getTokenFromQuery()
      const cleanedCpf = cpf.replace(/\D/g, '')
      if (isValidCpf(cleanedCpf) && token) {
        setIsLoading(true)
        try {
          const data = await fetchUserData(cleanedCpf, token)
          setUserData(data)
          setBankDetails({
            nome_banco: data.nome_banco || '',
            agencia: data.agencia || '',
            conta_corrente: data.conta_corrente || '',
            cod_banco: data.cod_banco || '',
            cpf: cleanedCpf || ''
          })
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error.message)
        } finally {
          setIsLoading(false)
        }
      }
    },
    [cpf] // Adicionar router.query.token aqui
  )

  useEffect(() => {
    if (isValidCpf(cpf)) {
      handleUserDataFetch(cpf)
    }
  }, [cpf, handleUserDataFetch])

  useEffect(() => {
    if (Object.keys(userData).length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        cpf: userData.cpf || '',
        nome: userData.nome || '',
        endereco: userData.endereco || '',
        estado: userData.estado || '',
        cidade: userData.cidade || '',
        dataNascimento: userData.data_nasc || '',
        rg: userData.rg || '',
        telefone: userData.telefone || '',
        postoTrabalho: userData.posto_trabalho || '',
        cargoFuncao: userData.cargo || '',
        matricula: userData.matricula || '',
        centroCusto: userData.centro_custo || ''
      }))
    }
  }, [userData, setFormData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  return (
    <SimpleGrid columns={2} spacing={4}>
      <GridItem colSpan={[2, 1]}>
        <FormControl id="cpf" isRequired>
          <FormLabel>CPF</FormLabel>
          <Input
            as={InputMask}
            mask="999.999.999-99"
            value={cpf}
            onChange={handleCpfChange}
          />
          {cpfError && <p className="text-red-500">{cpfError}</p>}
        </FormControl>
      </GridItem>

      <GridItem colSpan={[2, 1]}>
        <FormControl id="nome" isRequired>
          <FormLabel>Nome</FormLabel>
          <Input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            isDisabled={true}
          />
        </FormControl>
      </GridItem>

      <GridItem colSpan={[2, 1]}>
        <FormControl id="endereco" isRequired>
          <FormLabel>Endereço</FormLabel>
          <Input
            type="text"
            name="endereco"
            value={formData.endereco}
            onChange={handleInputChange}
            isDisabled={true}
          />
        </FormControl>
      </GridItem>

      <GridItem colSpan={[2, 1]}>
        <FormControl id="estado" isRequired>
          <FormLabel>Estado</FormLabel>
          <Input
            type="text"
            name="estado"
            value={formData.estado}
            onChange={handleInputChange}
            isDisabled={true}
          />
        </FormControl>
      </GridItem>

      <GridItem colSpan={[2, 1]}>
        <FormControl id="cidade" isRequired>
          <FormLabel>Cidade</FormLabel>
          <Input
            type="text"
            name="cidade"
            value={formData.cidade}
            onChange={handleInputChange}
            isDisabled={true}
          />
        </FormControl>
      </GridItem>

      <GridItem colSpan={[2, 1]}>
        <FormControl id="dataNascimento" isRequired>
          <FormLabel>Data de Nascimento</FormLabel>
          <Input
            name="dataNascimento"
            value={formData.dataNascimento}
            onChange={handleInputChange}
            isDisabled={true}
          />
        </FormControl>
      </GridItem>

      <GridItem colSpan={[2, 1]}>
        <FormControl id="rg" isRequired>
          <FormLabel>RG</FormLabel>
          <Input
            type="text"
            name="rg"
            value={formData.rg}
            onChange={handleInputChange}
            isDisabled={true}
          />
        </FormControl>
      </GridItem>

      <GridItem colSpan={[2, 1]}>
        <FormControl id="telefone" isRequired>
          <FormLabel>Telefone</FormLabel>
          <Input
            as={InputMask}
            mask="(99) 99999-9999"
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleInputChange}
            isDisabled={true}
          />
        </FormControl>
      </GridItem>

      <GridItem colSpan={[2, 1]}>
        <FormControl id="postoTrabalho" isRequired>
          <FormLabel>Posto de Trabalho</FormLabel>
          <Input
            type="text"
            name="postoTrabalho"
            value={formData.postoTrabalho}
            onChange={handleInputChange}
            isDisabled={true}
          />
        </FormControl>
      </GridItem>

      <GridItem colSpan={[2, 1]}>
        <FormControl id="cargoFuncao" isRequired>
          <FormLabel>Cargo/Função</FormLabel>
          <Input
            type="text"
            name="cargoFuncao"
            value={formData.cargoFuncao}
            onChange={handleInputChange}
            isDisabled={true}
          />
        </FormControl>
      </GridItem>

      <GridItem colSpan={[2, 1]}>
        <FormControl id="matricula" isRequired>
          <FormLabel>Matrícula</FormLabel>
          <Input
            type="text"
            name="matricula"
            value={formData.matricula}
            onChange={handleInputChange}
            isDisabled={true}
          />
        </FormControl>
      </GridItem>

      <GridItem colSpan={[2, 1]}>
        <FormControl id="centroCusto" isRequired>
          <FormLabel>Centro de Custo</FormLabel>
          <Input
            type="text"
            name="centroCusto"
            value={formData.centroCusto}
            onChange={handleInputChange}
            isDisabled={true}
          />
        </FormControl>
      </GridItem>
    </SimpleGrid>
  )
}
