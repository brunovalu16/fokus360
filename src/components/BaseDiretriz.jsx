import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DiretrizData from './DiretrizData';

const BaseDiretriz = ({ onUpdate }) => {
  const [novaDiretriz, setNovaDiretriz] = useState('');
  const [descricaoDiretriz, setDescricaoDiretriz] = useState('');
  const [diretrizes, setDiretrizes] = useState([]);

  // Adicionar nova diretriz
  const handleAddDiretriz = () => {
    if (novaDiretriz.trim() === '' || descricaoDiretriz.trim() === '') {
      alert('Preencha os campos de título e descrição da diretriz!');
      return;
    }
  
    const nova = {
      id: Date.now(),
      titulo: novaDiretriz,
      descricao: descricaoDiretriz,
      tarefas: [],
    };
  
    setDiretrizes((prev) => [...prev, nova]);
  
    // Atualiza o estado global corretamente
    onUpdate((prev) => ({
      ...prev,
      diretrizes: Array.isArray(prev.diretrizes)
        ? [...prev.diretrizes, nova]
        : [nova],
    }));
  
    setNovaDiretriz('');
    setDescricaoDiretriz('');
  };
  
  
  

  // Remover Diretriz
  const handleRemoveDiretriz = (id) => {
    const updated = diretrizes.filter((diretriz) => diretriz.id !== id);
    setDiretrizes(updated);
  
    onUpdate((prev) => ({
      ...prev,
      diretrizes: updated,
    }));
  };
  

  return (
    <Box>
      {/* 📌 Campo Fixo para Adicionar Diretriz */}
      <Box display="flex" flexDirection="column" gap={2} marginBottom="20px">
        {/* Título da Diretriz */}
        <TextField
          label="Nome da diretriz..."
          value={novaDiretriz}
          onChange={(e) => setNovaDiretriz(e.target.value)}
          fullWidth
        />

        {/* Descrição da Diretriz */}
        <TextField
          label="Descrição da diretriz..."
          value={descricaoDiretriz}
          onChange={(e) => setDescricaoDiretriz(e.target.value)}
          fullWidth
          multiline
          rows={2}
        />

        {/* Botão Adicionar */}
        <Button
          onClick={handleAddDiretriz}
          disableRipple
          sx={{
            alignSelf: 'flex-start',
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
            '&:focus': {
              outline: 'none',
            },
          }}
        >
          <AddCircleOutlineIcon sx={{ fontSize: 25, color: '#5f53e5' }} />
        </Button>
      </Box>

      {/* 📋 Lista de Diretrizes */}
      <Box>
        {diretrizes.map((item) => (
          <Accordion
            key={item.id}
            disableGutters
            sx={{
              backgroundColor: 'transparent',
              borderRadius: '8px',
              boxShadow: 'none',
              marginBottom: '10px',
            }}
          >
            {/* Cabeçalho do Accordion */}
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: '#b7b7b7' }} />}
              sx={{
                borderRadius: '8px',
                backgroundColor: '#5f53e5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Box sx={{ flex: 1, textAlign: 'left' }}>
                <Typography fontWeight="bold" sx={{ color: '#fff' }}>
                  {item.titulo}
                </Typography>
                <Typography sx={{ color: '#b7b7b7', fontSize: '0.9em' }}>
                  {item.descricao}
                </Typography>
              </Box>

              {/* Botão de Remoção */}
              <Button
                disableRipple
                onClick={(e) => {
                  e.stopPropagation(); // Evita abrir o accordion ao clicar no botão
                  handleRemoveDiretriz(item.id);
                }}
                sx={{
                  minWidth: '40px',
                  padding: '5px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  '&:hover': { backgroundColor: 'transparent' },
                }}
              >
                <DeleteForeverIcon sx={{ fontSize: 24, color: '#b7b7b7' }} />
              </Button>
            </AccordionSummary>

            {/* Detalhes do Accordion */}
            <AccordionDetails>
              <DiretrizData
                diretrizID={item.id}
                onUpdate={(updatedTarefas) => {
                  setDiretrizes((prev) =>
                    prev.map((diretriz) =>
                      diretriz.id === item.id ? { ...diretriz, tarefas: updatedTarefas } : diretriz
                    )
                  );

                  onUpdate((prev) => ({
                    ...prev,
                    diretrizes: prev.diretrizes.map((diretriz) =>
                      diretriz.id === item.id ? { ...diretriz, tarefas: updatedTarefas } : diretriz
                    ),
                  }));
                }}
              />
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default BaseDiretriz;
