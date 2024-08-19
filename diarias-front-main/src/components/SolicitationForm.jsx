import { useState } from 'react'
import { Select, Input, FormControl, FormLabel } from '@chakra-ui/react'
import InputMask from 'react-input-mask'

export default function SolicitationForm({
  setSelectedOption,
  setSolicitationNumber,
  setSdValue
}) {
  const [selectedOption, setOption] = useState('')
  const [solicitationNumber, setNumber] = useState('')
  const [sdValue, setValue] = useState('')

  const handleChange = (event) => {
    const value = event.target.value
    setOption(value)
    setSelectedOption(value)
    // Limpar os campos quando a opção mudar
    setNumber('')
    setValue('')
    setSolicitationNumber('')
    setSdValue('')
  }

  const handleNumberChange = (event) => {
    const value = event.target.value
    setNumber(value)
    setSolicitationNumber(value)
  }

  const handleValueChange = (event) => {
    const value = event.target.value
    setValue(value)
    setSdValue(value)
  }

  return (
    <div className="flex max-md:flex-col w-full gap-4">
      <div className="md:w-1/3">
        <FormLabel>Tipo da Solicitação</FormLabel>
        <Select onChange={handleChange} value={selectedOption}>
          <option value="">Selecione uma opção</option>
          <option value="solicitação">Solicitação</option>
          <option value="complementação">Complementação</option>
          <option value="devolução">Devolução</option>
        </Select>
      </div>
      {(selectedOption === 'complementação' ||
        selectedOption === 'devolução') && (
        <div className="w-full flex max-md:flex-col md:w-2/3 gap-4">
          <FormControl isRequired>
            <FormLabel>Nº da solicitação</FormLabel>
            <Input
              as={InputMask}
              mask="99999/9999"
              placeholder="Nº da solicitação"
              value={solicitationNumber}
              onChange={handleNumberChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Valor da SD</FormLabel>
            <Input
              placeholder="Valor da SD"
              type="number"
              value={sdValue}
              onChange={handleValueChange}
            />
          </FormControl>
        </div>
      )}
    </div>
  )
}
