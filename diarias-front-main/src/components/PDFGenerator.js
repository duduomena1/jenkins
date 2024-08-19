import React, { useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import logo_fesf from '../../public/Marca-FESFSUS.png'
import Image from 'next/image'
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td
} from '@chakra-ui/react'

// Mapeamento dos códigos dos estados para as siglas
const estadoMap = {
  11: 'RO',
  12: 'AC',
  13: 'AM',
  14: 'RR',
  15: 'PA',
  16: 'AP',
  17: 'TO',
  21: 'MA',
  22: 'PI',
  23: 'CE',
  24: 'RN',
  25: 'PB',
  26: 'PE',
  27: 'AL',
  28: 'SE',
  29: 'BA',
  31: 'MG',
  32: 'ES',
  33: 'RJ',
  35: 'SP',
  41: 'PR',
  42: 'SC',
  43: 'RS',
  50: 'MS',
  51: 'MT',
  52: 'GO',
  53: 'DF'
}

const PDFGenerator = ({ fieldsPdf }) => {
  const printRef = useRef()

  const generatePDF = async () => {
    const element = printRef.current
    // Reduzir o tamanho do conteúdo para caber melhor no PDF
    element.style.transform = 'scale(1.2)'
    const canvas = await html2canvas(element, {
      scale: 2, // Aumenta a resolução da imagem capturada
      windowWidth: 1440,
      windowHeight: 900
    })
    const imageData = canvas.toDataURL('image/jpeg')

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgProperties = pdf.getImageProperties(imageData)
    const imgWidth = pdfWidth - 40 // Considera a margem de 20mm (2cm) em cada lado
    const imgHeight = (imgProperties.height * imgWidth) / imgProperties.width

    let heightLeft = imgHeight
    let position = 10 // Considera a margem superior de 30mm (3cm)

    pdf.addImage(imageData, 'jpeg', 20, position, imgWidth, imgHeight) // 20mm de margem esquerda
    heightLeft -= pdfHeight - 50 // Considera a margem inferior de 20mm (2cm) e superior de 30mm (3cm)

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imageData, 'jpeg', 20, position + 30, imgWidth, imgHeight) // 20mm de margem esquerda e 30mm de margem superior
      heightLeft -= pdfHeight
    }

    pdf.save(`${fieldsPdf.codigoSd}_${fieldsPdf.tipoSD}.pdf`)
    element.style.transform = 'scale(1)'
  }

  return (
    <div>
      <Box ref={printRef} p={8} bg="white" maxW="full">
        <Flex justify="center" mb={8}>
          <Box width="100%" maxWidth="350px" maxHeight="200px">
            <Image
              src={logo_fesf.src}
              alt="Logotipo Fesfsus"
              layout="responsive"
              width={350}
              height={200}
              style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
            />
          </Box>
        </Flex>
        <Heading as="h1" size="xl" mb={4} className="text-center">
          Diretoria de Gestão Interna/DGI
        </Heading>
        <Heading as="h2" size="lg" mb={14} className="text-center">
          Solicitação de Diária
        </Heading>

        <Box
          id="tipo_solicitacao"
          mb={6}
          flexWrap="wrap"
          className="flex justify-between"
        >
          <div>
            <Heading as="h2" size="md" mb={2}>
              Tipo SD
            </Heading>
            <p>
              {fieldsPdf.tipoSD.charAt(0).toUpperCase() +
                fieldsPdf.tipoSD.slice(1)}
            </p>
          </div>
          <div>
            <Heading as="h2" size="md" mb={2}>
              Código SD
            </Heading>
            <p>{fieldsPdf.codigoSd}</p>
          </div>
          <div>
            <Heading as="h2" size="md" mb={2}>
              Solicitante
            </Heading>
            <p>{fieldsPdf.email}</p>
          </div>
          {fieldsPdf.tipoSD == 'solicitação' && (
            <div>
              <Heading as="h2" size="md" mb={2}>
                Data/Hora
              </Heading>
              <p>{fieldsPdf.dataHora}</p>
            </div>
          )}
        </Box>

        <Box id="dados_pessoais" mb={6}>
          <Heading as="h2" size="md" mb={2}>
            Dados Pessoais
          </Heading>
          <Table variant="simple" size="sm">
            <Tbody>
              <Tr>
                <Td fontWeight="bold">Nome:</Td>
                <Td>{fieldsPdf.nome}</Td>
                <Td fontWeight="bold">CPF:</Td>
                <Td>{fieldsPdf.cpf}</Td>
                <Td fontWeight="bold">RG:</Td>
                <Td>{fieldsPdf.rg}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Data de Nascimento:</Td>
                <Td>{fieldsPdf.dataNascimento}</Td>
                <Td fontWeight="bold">Telefone:</Td>
                <Td>{fieldsPdf.telefone}</Td>
                <Td fontWeight="bold">Endereço:</Td>
                <Td>{fieldsPdf.endereco}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Estado:</Td>
                <Td>{fieldsPdf.estado}</Td>
                <Td fontWeight="bold">Cargo/Função:</Td>
                <Td>{fieldsPdf.cargoFuncao}</Td>
                <Td fontWeight="bold">Posto de Trabalho:</Td>
                <Td>{fieldsPdf.postoTrabalho}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="bold">Matrícula:</Td>
                <Td>{fieldsPdf.matricula}</Td>
                <Td fontWeight="bold">Centro de Custo:</Td>
                <Td>{fieldsPdf.centroCusto}</Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>

        <Box id="dados_bancarios" mb={6}>
          <Heading as="h2" size="md" mb={2}>
            Dados Bancários
          </Heading>
          <Table variant="simple" size="sm">
            <Tbody>
              <Tr>
                <Td fontWeight="bold">Banco:</Td>
                <Td>{fieldsPdf.banco}</Td>
                <Td fontWeight="bold">Agência:</Td>
                <Td>{fieldsPdf.agencia}</Td>
                <Td fontWeight="bold">Conta:</Td>
                <Td>{fieldsPdf.conta}</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>

        <Box id="trechos" mb={6}>
          <Heading as="h2" size="md" mb={2}>
            Trechos
          </Heading>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Origem</Th>
                <Th>Destino</Th>
                <Th>Data Saída da Origem</Th>
                <Th>Data Saída do Destino</Th>
                <Th>Deslocamento</Th>
              </Tr>
            </Thead>
            <Tbody>
              {fieldsPdf.trechos
                .filter((trecho) => trecho.ultimo_trecho === 'nao')
                .map((trecho, index) => (
                  <Tr key={index}>
                    <Td>
                      {trecho.cidade_origem}, {estadoMap[trecho.estado_origem]}
                    </Td>
                    <Td>
                      {trecho.cidade_destino},{' '}
                      {estadoMap[trecho.estado_destino]}
                    </Td>
                    <Td>
                      {trecho.dt_saida} {trecho.hr_saida}
                    </Td>
                    <Td>
                      {trecho.dt_retorno} {trecho.hr_retorno}
                    </Td>
                    <Td>{trecho.tipo_deslocamento}</Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>

          {fieldsPdf.trechos.some(
            (trecho) => trecho.ultimo_trecho === 'sim'
          ) && (
            <Table variant="simple" size="sm" className="mt-6">
              <Thead>
                <Tr>
                  <Th>Origem</Th>
                  <Th>Destino</Th>
                  <Th>Data Saída da Origem</Th>
                  <Th>Data Retorno Origem</Th>
                  <Th>Deslocamento</Th>
                </Tr>
              </Thead>
              <Tbody>
                {fieldsPdf.trechos.map(
                  (trecho, index) =>
                    trecho.ultimo_trecho === 'sim' && (
                      <Tr key={index}>
                        <Td>
                          {trecho.cidade_origem},{' '}
                          {estadoMap[trecho.estado_origem]}
                        </Td>
                        <Td>
                          {trecho.cidade_destino},{' '}
                          {estadoMap[trecho.estado_destino]}
                        </Td>
                        <Td>
                          {trecho.dt_saida} {trecho.hr_saida}
                        </Td>
                        <Td>
                          {trecho.dt_retorno} {trecho.hr_retorno}
                        </Td>
                        <Td>{trecho.tipo_deslocamento}</Td>
                      </Tr>
                    )
                )}
              </Tbody>
            </Table>
          )}
        </Box>

        <Box id="resumo_calculo" mb={6}>
          <Heading as="h2" size="md" mb={2}>
            Resumo do Cálculo
          </Heading>
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Qtde Diárias Simples</Th>
                <Th>Valor Diárias Simples</Th>
                <Th>Qtde Diárias Completas</Th>
                <Th>Valor Diárias Completas</Th>
                <Th>Valor Total</Th>
                {fieldsPdf.tipoSD !== 'solicitação' && (
                  <>
                    <Th>Valor da SD</Th>
                    {fieldsPdf.tipoSD == 'devolução' && (
                      <Th>Valor Devolução</Th>
                    )}
                    {fieldsPdf.tipoSD == 'complementação' && (
                      <Th>Valor Complementação</Th>
                    )}
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>{fieldsPdf.quantidadeDiariaSimples}</Td>
                <Td>R$ {fieldsPdf.valorDiariaSimples}</Td>
                <Td>{fieldsPdf.quantidadeDiariaCompleta}</Td>
                <Td>R$ {fieldsPdf.valorDiariasCompletas}</Td>
                <Td>R$ {fieldsPdf.valorTotal}</Td>
                {fieldsPdf.tipoSD !== 'solicitação' && (
                  <>
                    <Td>R$ {fieldsPdf.valorSd}</Td>

                    {fieldsPdf.tipoSD == 'devolução' && (
                      <Td>- R$ {fieldsPdf.valorDevolucao}</Td>
                    )}
                    {fieldsPdf.tipoSD == 'complementação' && (
                      <Td>R$ {fieldsPdf.valorComplementacao}</Td>
                    )}
                  </>
                )}
              </Tr>
            </Tbody>
          </Table>
        </Box>

        <Box id="observacoes" mb={6}>
          <Heading as="h2" size="md" mb={2}>
            Observações
          </Heading>
          <p>{fieldsPdf.resumo}</p>
        </Box>
      </Box>
      <div className="flex justify-center mt-4">
        <Button
          onClick={generatePDF}
          colorScheme="green"
          paddingX="4rem"
          className={`w-4`}
        >
          Gerar PDF
        </Button>
      </div>
    </div>
  )
}

export default PDFGenerator
