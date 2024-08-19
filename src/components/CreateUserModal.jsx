import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select,
  Grid,
  GridItem,
  Stack,
  useDisclosure,
  Text,
  Box,
  FormHelperText
} from '@chakra-ui/react'
import InputMask from 'react-input-mask'
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai'
import { useRouter } from 'next/router'

// eslint-disable-next-line no-undef
const apiUrl = process.env.NEXT_PUBLIC_API_URL
const CreateUserModal = ({ isOpen, onClose, token }) => {
  const [formData, setFormData] = useState({
    cpf: '',
    nome: '',
    endereco: '',
    estado: '',
    data_nasc: '',
    rg: '',
    telefone: '',
    cod_banco: '',
    nome_banco: '',
    agencia: '',
    conta_corrente: '',
    matricula: '',
    posto_trabalho: '',
    cargo: '',
    cidade: '',
    centro_custo: ''
  })
  const router = useRouter()
  const [bankList, setBankList] = useState([])
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [isErrorOpen, setIsErrorOpen] = useState(false)

  const { onClose: onSuccessClose } = useDisclosure({
    isOpen: isSuccessOpen,
    onClose: () => {
      setIsSuccessOpen(false)
      onClose()
    }
  })

  const { onClose: onErrorClose } = useDisclosure({
    isOpen: isErrorOpen,
    onClose: () => setIsErrorOpen(false)
  })

  useEffect(() => {
    if (router.isReady) {
      const fetchBankList = async () => {
        try {
          const response = await fetch(`${apiUrl}/api/v1/banco/listar`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${router.query.token}`
            }
          })
          if (response.ok) {
            const data = await response.json()
            setBankList(data)
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
        } catch (error) {
          console.error('Erro ao buscar lista de bancos:', error.message)
        }
      }

      fetchBankList()
    }
  }, [router.isReady, router.query])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleBankChange = (event) => {
    const selectedBankName = event.target.value
    const selectedBank = bankList.find(
      (bank) => bank.nome_banco === selectedBankName
    )
    if (selectedBank) {
      setFormData((prevData) => ({
        ...prevData,
        nome_banco: selectedBank.nome_banco,
        cod_banco: selectedBank.cod_banco
      }))
    } else {
      // Clear bank data if no match found
      setFormData((prevData) => ({
        ...prevData,
        nome_banco: '',
        cod_banco: ''
      }))
    }
  }

  const handleSubmit = async () => {
    // Clean CPF, RG, and Telefone to only contain numbers
    const cleanCpf = formData.cpf.replace(/\D/g, '')
    const cleanRg = formData.rg.replace(/\D/g, '')
    const cleanTelefone = formData.telefone.replace(/\D/g, '')

    // Update formData with cleaned fields
    const cleanedFormData = {
      ...formData,
      cpf: cleanCpf,
      rg: cleanRg,
      telefone: cleanTelefone
    }

    try {
      const response = await fetch(`${apiUrl}/api/v1/funcionario/criar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(cleanedFormData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Handle success (e.g., show a success message, etc.)
      setIsSuccessOpen(true)
      setFormData({
        cpf: '',
        nome: '',
        endereco: '',
        estado: '',
        data_nasc: '',
        rg: '',
        telefone: '',
        cod_banco: '',
        nome_banco: '',
        agencia: '',
        conta_corrente: '',
        matricula: '',
        posto_trabalho: '',
        cargo: '',
        cidade: '',
        centro_custo: ''
      })
    } catch (error) {
      console.error('Erro ao criar usuário:', error.message)
      setIsErrorOpen(true)
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Criar Novo Usuário</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Grid
                templateColumns={{
                  base: '1fr',
                  md: '1fr 1fr',
                  lg: '1fr 1fr 1fr'
                }}
                gap={6}
              >
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>CPF</FormLabel>
                    <InputMask
                      mask="999.999.999-99"
                      value={formData.cpf}
                      onChange={handleChange}
                    >
                      {(inputProps) => (
                        <Input {...inputProps} placeholder="CPF" name="cpf" />
                      )}
                    </InputMask>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Nome</FormLabel>
                    <Input
                      placeholder="Nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Estado</FormLabel>
                    <Input
                      placeholder="Estado"
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Cidade</FormLabel>
                    <Input
                      placeholder="Cidade"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Data de Nascimento</FormLabel>
                    <InputMask
                      mask="99/99/9999"
                      value={formData.data_nasc}
                      onChange={handleChange}
                    >
                      {(inputProps) => (
                        <Input
                          {...inputProps}
                          placeholder="Data de Nascimento"
                          name="data_nasc"
                        />
                      )}
                    </InputMask>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Endereço</FormLabel>
                    <Input
                      placeholder="Endereço"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>RG</FormLabel>
                    <InputMask
                      mask="99.999.999-99"
                      value={formData.rg}
                      onChange={handleChange}
                    >
                      {(inputProps) => (
                        <Input {...inputProps} placeholder="RG" name="rg" />
                      )}
                    </InputMask>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Telefone</FormLabel>
                    <InputMask
                      mask="(99) 99999-9999"
                      value={formData.telefone}
                      onChange={handleChange}
                    >
                      {(inputProps) => (
                        <Input
                          {...inputProps}
                          placeholder="Telefone"
                          name="telefone"
                        />
                      )}
                    </InputMask>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Banco</FormLabel>
                    <Select
                      placeholder="Selecione um banco"
                      name="nome_banco"
                      value={formData.nome_banco}
                      onChange={handleBankChange}
                    >
                      {bankList.map((bank) => (
                        <option key={bank.cod_banco} value={bank.nome_banco}>
                          {bank.nome_banco}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Agência</FormLabel>
                    <Input
                      placeholder="Agência"
                      name="agencia"
                      value={formData.agencia}
                      onChange={handleChange}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Conta Corrente</FormLabel>
                    <Input
                      placeholder="Conta Corrente"
                      name="conta_corrente"
                      value={formData.conta_corrente}
                      onChange={handleChange}
                    />
                    <FormHelperText color="red.500">
                      * Não é possível colocar conta salário.
                    </FormHelperText>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Matrícula</FormLabel>
                    <Input
                      placeholder="Matrícula"
                      name="matricula"
                      value={formData.matricula}
                      onChange={handleChange}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Posto de Trabalho</FormLabel>
                    <Input
                      placeholder="Posto de Trabalho"
                      name="posto_trabalho"
                      value={formData.posto_trabalho}
                      onChange={handleChange}
                    />
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Cargo</FormLabel>
                    <Input
                      placeholder="Cargo"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                    />
                  </FormControl>
                </GridItem>

                <GridItem>
                  <FormControl isRequired>
                    <FormLabel>Centro de Custo</FormLabel>
                    <Input
                      placeholder="Centro de Custo"
                      name="centro_custo"
                      value={formData.centro_custo}
                      onChange={handleChange}
                    />
                  </FormControl>
                </GridItem>
              </Grid>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Criar Usuário
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={isSuccessOpen} onClose={onSuccessClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Box display="flex" alignItems="center">
              <AiOutlineCheckCircle color="green.500" size={24} />
              <Text ml={2}>Sucesso</Text>
            </Box>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Usuário criado com sucesso!</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={onSuccessClose}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Error Modal */}
      <Modal isOpen={isErrorOpen} onClose={onErrorClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Box display="flex" alignItems="center">
              <AiOutlineCloseCircle color="red.500" size={24} />
              <Text ml={2}>Erro</Text>
            </Box>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Houve um erro ao criar o usuário. Tente novamente.</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={onErrorClose}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateUserModal
