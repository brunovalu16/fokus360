  import React, { useState, useEffect, useMemo  } from "react";
  import {
    Box,
    TextField,
    Button,
    Typography,
    Accordion,
    IconButton,
    List,
    Select,
    Avatar,
    MenuItem,
    Checkbox,
    ListItemText,
    ListItemAvatar,
    AccordionSummary,
    AccordionDetails,
  } from "@mui/material";
  import VisibilityIcon from "@mui/icons-material/Visibility";
  import AttachFileIcon from "@mui/icons-material/AttachFile";
import DownloadIcon from "@mui/icons-material/Download";
  import { FormControlLabel } from "@mui/material"
  import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
  import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
  import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
  import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
  import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
  import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
  import { doc, updateDoc, getFirestore, collection, getDocs, setDoc, onSnapshot   } from "firebase/firestore";
  import { dbFokus360 as db, authFokus360 } from "../data/firebase-config"; // ✅ Correto para Fokus360

  import SelectAreaStatus from "./SelectAreaStatus";

  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { storageFokus360 } from "../data/firebase-config";


  import { calcularStatusVisualPorStatus } from "../utils/calcularStatusVisualPorStatus";
  import { calcularMediaProgressoGeral } from "../utils/progressoUtils";

  


  //API para buscar data universal
  import { calcularStatusVisual } from "../utils/statusVisual";

  //Importando o contador de data
  import { getDataHojeFormatada } from "../utils/formatDate";

  import StatusProgresso from "./StatusProgresso";

  //Importação para o campo "time" no firestore
  import { atualizarCampoTimeDiretrizes } from "../utils/atualizarTimeDiretrizes";

  import { normalizarData } from "../utils/normalizarData";

  //Componente da logica de calculos
  import StatusProgressoEstrategica from "./StatusProgressoEstrategica";
  import {
    calcularProgressoEstrategica,
    calcularProgressoTatica,
    calcularProgressoOperacional,
    calcularProgressoArea
  } from "../utils/progressoUtils";









    const BaseDiretriz4 = ({ projetoData, onUpdate, dataInicio, prazoPrevisto, estrategicaId, }) => {
    // Estados para os três conjuntos de diretrizes
    const [users, setUsers] = useState([]);

    const [estrategicas, setEstrategicas] = useState([]);

    const [operacionais, setOperacionais] = useState([]);

     const [selectedArea, setSelectedArea] = useState("");

     const [areaFiltroEstrategica, setAreaFiltroEstrategica] = useState("");


    const [areasResponsaveistaticas, setAreasResponsaveistaticas] = useState([]);

    
    const [areasResponsaveisoperacional , setAreasResponsaveisoperacional ] = useState([]);


    //Estados para upload
    const [uploadingTarefaId, setUploadingTarefaId] = useState(null);
    const TAMANHO_MAXIMO_MB = 40;
    const TAMANHO_MAXIMO_BYTES = TAMANHO_MAXIMO_MB * 1024 * 1024;



  // ESTRATEGICAS
    const [areasPorId, setAreasPorId] = useState({});
    const [unidadesPorId, setUnidadesPorId] = useState({});
    const [emailsPorId, setEmailsPorId] = useState({});

  // TÁTICAS
  const [areasTaticasPorId, setAreasTaticasPorId] = useState({});
  const [unidadesTaticasPorId, setUnidadesTaticasPorId] = useState({});
  const [emailsTaticasPorId, setEmailsTaticasPorId] = useState({});

  // OPERACIONAIS
  const [areasOperacionaisPorId, setAreasOperacionaisPorId] = useState({});
  const [unidadesOperacionaisPorId, setUnidadesOperacionaisPorId] = useState({});
  const [emailsOperacionaisPorId, setEmailsOperacionaisPorId] = useState({});

    
  const [areasOriginaisPorId, setAreasOriginaisPorId] = useState({});
  const [emailsOriginaisPorIdEstrategica, setEmailsOriginaisPorIdEstrategica] = useState({});
  const [areasOriginaisTaticasPorId, setAreasOriginaisTaticasPorId] = useState({});
  const [emailsOriginaisPorIdTatica, setEmailsOriginaisPorIdTatica] = useState({});
  const [areasOriginaisOperacionaisPorId, setAreasOriginaisOperacionaisPorId] = useState({});
  const [emailsOriginaisPorIdOperacional, setEmailsOriginaisPorIdOperacional] = useState({});


  const [subareas, setSubareas] = useState([]);
  const [subareasPorIdEstrategica, setSubareasPorIdEstrategica] = useState({});
  const [subareasPorIdTatica, setSubareasPorIdTatica] = useState({});
  const [subareasPorIdOperacional, setSubareasPorIdOperacional] = useState({});

    

    const [emailsTaticasInput, setEmailsTaticasInput] = useState({});
    const [emailsOperacionaisInput, setEmailsOperacionaisInput] = useState({});
    const [novaTarefa, setNovaTarefa] = useState("");

    const projectId = projetoData?.id;



  const [areasPorIdEstrategica, setAreasPorIdEstrategica] = useState({});
  const [unidadesPorIdEstrategica, setUnidadesPorIdEstrategica] = useState({});
  const [emailsPorIdEstrategica, setEmailsPorIdEstrategica] = useState({});

  const [areasPorIdTatica, setAreasPorIdTatica] = useState({});
  const [unidadesPorIdTatica, setUnidadesPorIdTatica] = useState({});
  const [emailsPorIdTatica, setEmailsPorIdTatica] = useState({});

  const [areasPorIdOperacional, setAreasPorIdOperacional] = useState({});
  const [unidadesPorIdOperacional, setUnidadesPorIdOperacional] = useState({});
  const [emailsPorIdOperacional, setEmailsPorIdOperacional] = useState({});


    const [areasSelecionadasOperacionalPorTatica, setAreasSelecionadasOperacionalPorTatica] = useState({});
    




    const [descEstrategica, setDescEstrategica] = useState("");
    const [novaEstrategica, setNovaEstrategica] = useState("");
    const [emailsDigitados, setEmailsDigitados] = useState("");

    const [areas, setAreas] = useState([]);
    const [unidades, setUnidades] = useState([]);



    //listar taticas em relação a area selecionada
    const [taticasFiltradasPorArea, setTaticasFiltradasPorArea] = useState([]);
    const [selectedAreaId, setSelectedAreaId] = useState("");
    const [selectedAreaNome, setSelectedAreaNome] = useState("");
  

     //listar operacionais em relação a area selecionada
    const [operacionaisFiltradas, setOperacionaisFiltradas] = useState([]);

    const [selectedTaticaId, setSelectedTaticaId] = useState("");

    const [areasSelecionadasPorEstrategica, setAreasSelecionadasPorEstrategica] = useState({});



    // Estados para seleção de áreas, unidades, etc.
    const [areasSelecionadas, setAreasSelecionadas] = useState(projetoData?.areasResponsaveis || []);
    const [unidadeSelecionadas, setUnidadeSelecionadas] = useState(projetoData?.unidadesRelacionadas || []);

    const [formValues, setFormValues] = useState({
      tituloTarefa: "",
      planoDeAcao: {
        oQue: "",
        porQue: "",
        quem: [],
        quando: "",
        quemEmail: [],
        onde: "",
        como: "",
        valor: "",
      },
    });


const formatarDataISO = (data) => {
  if (!data) return "";
  const d = new Date(data);
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};




    //Função que atualiza "time" toda vez que a pagina por atualizada e tambem de 60 em 60 segundos
    useEffect(() => {
      if (!projetoData?.id) return;
    
      const projetoRef = doc(db, "projetos", projetoData.id);
    
      const unsubscribe = onSnapshot(projetoRef, (snapshot) => {
        const data = snapshot.data();
        if (data) {
          console.log("📡 Mudança detectada no projeto! Atualizando campo time...");
          atualizarCampoTimeDiretrizes({ ...projetoData, ...data });
        }
      });
    
      return () => unsubscribe(); // Cleanup ao desmontar
    }, [projetoData?.id]);
    
    
    



//useEffect que reage a mudanças no selectedArea:
    useEffect(() => {
  if (!selectedArea) return;

  // Suponha que você tenha uma função que busca táticas do backend
  const fetchTaticasPorArea = async () => {
    try {
      const response = await fetch(`/api/taticas?areaId=${selectedArea}`);
      const data = await response.json();

      // Atualiza as táticas da área dentro da estrutura estratégica
      setEstrategicas((prev) =>
        prev.map((est) =>
          est.id === estrategicaId
            ? { ...est, taticas: data }
            : est
        )
      );
    } catch (error) {
      console.error("Erro ao buscar táticas por área:", error);
    }
  };

  fetchTaticasPorArea();
}, [selectedArea]);



//useEffect que filtra as táticas por selectedArea
useEffect(() => {
  if (!estrategicaId) {
    setTaticasFiltradasPorArea([]);
    return;
  }

  const areaSelecionada = areasSelecionadasPorEstrategica[estrategicaId];

  if (!areaSelecionada?.nome) {
    setTaticasFiltradasPorArea([]);
    return;
  }

  const estrategicaAtual = estrategicas.find((e) => e.id === estrategicaId);
  if (!estrategicaAtual) {
    setTaticasFiltradasPorArea([]);
    return;
  }

  const filtradas = (estrategicaAtual.taticas || []).filter(
    (tatica) => tatica.areaNome === areaSelecionada.nome
  );

  setTaticasFiltradasPorArea(filtradas);
}, [estrategicaId, areasSelecionadasPorEstrategica, estrategicas]);








//aparece a Operacionais que foi selecionada
// operacionais filtradas por tática + área
useEffect(() => {
  if (!estrategicaId) {
    setTaticasFiltradasPorArea([]);
    return;
  }

  const areaSelecionada = areasSelecionadasPorEstrategica[estrategicaId];
  if (!areaSelecionada?.nome) {
    setTaticasFiltradasPorArea([]);
    return;
  }

  const estrategicaAtual = estrategicas.find((e) => e.id === estrategicaId);
  if (!estrategicaAtual) {
    setTaticasFiltradasPorArea([]);
    return;
  }

  const filtradas = (estrategicaAtual.taticas || []).filter(
    (tatica) => tatica.areaNome === areaSelecionada.nome
  );

  setTaticasFiltradasPorArea(filtradas);
}, [estrategicaId, areasSelecionadasPorEstrategica, estrategicas]);








// busca areas do banco
useEffect(() => {
  const fetchAreas = async () => {
    try {
      const snapshot = await getDocs(collection(db, "areas"));
      const listaAreas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAreas(listaAreas);
    } catch (error) {
      console.error("Erro ao buscar áreas:", error);
    }
  };

  fetchAreas();
}, []);


//função para eniar notificação 
const enviarNotificacaoInternaPorEmails = async (emails = [], mensagem) => {
  const emailsValidos = [...new Set(emails.filter(Boolean))];

  const usuariosNotificacao = users.filter((user) =>
    emailsValidos.includes(user.email)
  );

  const userIds = usuariosNotificacao.map((user) => user.id);

  if (userIds.length === 0) return;

  await fetch("https://fokus360-backend.vercel.app/send-project-notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userIds,
      mensagem,
    }),
  });
};



    
  //preencher os campos normalmente vindo do banco
    // Exemplo: atualizar os estados quando o projetoData mudar
    useEffect(() => {
      if (!projetoData) return;
    
      console.log("📦 Dados do projeto recebidos:", projetoData);
      console.log("📦 Estratégicas recebidas:", projetoData.estrategicas);
    
      (async () => {
        const hoje = new Date();
        const dataAtual = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    
        const estrategicasCorrigidas = (projetoData.estrategicas || []).map((est) => {
          const prazoE = normalizarData(est.finalizacao);
          const timeE =
            est.status === "concluida" || !est.finalizacao
              ? est.time
              : dataAtual.getTime() <= prazoE.getTime()
              ? "no prazo"
              : "atrasada";
    
          const taticasCorrigidas = (est.taticas || []).map((tat) => {
            const prazoT = normalizarData(tat.finalizacao);
            const timeT =
              tat.status === "concluida" || !tat.finalizacao
                ? tat.time
                : dataAtual.getTime() <= prazoT.getTime()
                ? "no prazo"
                : "atrasada";
    
            const operacionaisCorrigidas = (tat.operacionais || []).map((op) => {
              const prazoO = normalizarData(op.finalizacao);
              const timeO =
                op.status === "concluida" || !op.finalizacao
                  ? op.time
                  : dataAtual.getTime() <= prazoO.getTime()
                  ? "no prazo"
                  : "atrasada";

    
              return {
                ...op,
                emails: op.emails || [],
                areasResponsaveis: op.areasResponsaveis || [],
                unidades: op.unidades || [],
                tarefas: op.tarefas || [],
                time: timeO,
              };
            });
    
            return {
              ...tat,
              emails: tat.emails || [],
              areasResponsaveis: tat.areasResponsaveis || [],
              unidades: tat.unidades || [],
              operacionais: operacionaisCorrigidas,
              time: timeT,
            };
          });
    
          return {
            ...est,
            emails: est.emails || [],
            areasResponsaveis: est.areasResponsaveis || [],
            unidades: est.unidades || [],
            taticas: taticasCorrigidas,
            time: timeE,
          };
        });
    
        setEstrategicas(estrategicasCorrigidas);
    
        // Atualizar selects por ID
        const novaAreasPorId = {};
        const novasUnidadesPorId = {};
        const novosEmailsPorId = {};
    
        const novaAreasTaticasPorId = {};
        const novasUnidadesTaticasPorId = {};
        const novosEmailsTaticasPorId = {};
    
        const novaAreasOperacionaisPorId = {};
        const novasUnidadesOperacionaisPorId = {};
        const novosEmailsOperacionaisPorId = {};
    
        const novosEmailsPorIdEstrategica = {};
        const novosEmailsPorIdTatica = {};
        const novosEmailsPorIdOperacional = {};

        const novasSubareasPorIdEstrategica = {};
        const novasSubareasPorIdTatica = {};
        const novasSubareasPorIdOperacional = {};
    
        estrategicasCorrigidas.forEach((est) => {
          novasSubareasPorIdEstrategica[est.id] = est.subareas || [];
          novaAreasPorId[est.id] = est.areasResponsaveis;
          novasUnidadesPorId[est.id] = est.unidades;
          novosEmailsPorId[est.id] = est.emails;
          novosEmailsPorIdEstrategica[est.id] = est.emails;
    
          est.taticas?.forEach((tat) => {
            novasSubareasPorIdTatica[tat.id] = tat.subareas || [];
            novaAreasTaticasPorId[tat.id] = tat.areasResponsaveis;
            novasUnidadesTaticasPorId[tat.id] = tat.unidades;
            novosEmailsTaticasPorId[tat.id] = tat.emails;
            novosEmailsPorIdTatica[tat.id] = tat.emails;
    
            tat.operacionais?.forEach((op) => {
              novasSubareasPorIdOperacional[op.id] = op.subareas || [];
              novaAreasOperacionaisPorId[op.id] = op.areasResponsaveis;
              novasUnidadesOperacionaisPorId[op.id] = op.unidades;
              novosEmailsOperacionaisPorId[op.id] = op.emails;
              novosEmailsPorIdOperacional[op.id] = op.emails;
            });
          });
        });
    
        setAreasPorId(novaAreasPorId);
        setUnidadesPorId(novasUnidadesPorId);
        setEmailsPorId(novosEmailsPorId);

        setSubareasPorIdEstrategica(novasSubareasPorIdEstrategica);
        setSubareasPorIdTatica(novasSubareasPorIdTatica);
        setSubareasPorIdOperacional(novasSubareasPorIdOperacional);
    
        setAreasTaticasPorId(novaAreasTaticasPorId);
        setUnidadesTaticasPorId(novasUnidadesTaticasPorId);
        setEmailsTaticasPorId(novosEmailsTaticasPorId);
    
        setAreasPorIdOperacional(novaAreasOperacionaisPorId);
        setUnidadesPorIdOperacional(novasUnidadesOperacionaisPorId);
        setEmailsPorIdOperacional(novosEmailsOperacionaisPorId);
    
        setEmailsPorIdEstrategica(novosEmailsPorIdEstrategica);
        setEmailsPorIdTatica(novosEmailsPorIdTatica);
        setEmailsPorIdOperacional(novosEmailsPorIdOperacional);
    
        // Estados ORIGINAIS
        setAreasOriginaisPorId(novaAreasPorId);
        setEmailsOriginaisPorIdEstrategica(novosEmailsPorIdEstrategica);
        setAreasOriginaisTaticasPorId(novaAreasTaticasPorId);
        setEmailsOriginaisPorIdTatica(novosEmailsPorIdTatica);
        setAreasOriginaisOperacionaisPorId(novaAreasOperacionaisPorId);
        setEmailsOriginaisPorIdOperacional(novosEmailsPorIdOperacional);
      })();
    }, [projetoData]);
    

    
    
    
    

    
  //função auxiliar de comparação de itens que vem do banco com novos para enviar email
    const detectarNovos = (atual = [], original = []) => {
      const atualSet = new Set(atual);
      const originalSet = new Set(original);
      return [...atualSet].filter((item) => !originalSet.has(item));
    };
    


    
    




  //estado separado para controlar os campos de formulário E-mails Estratégicas e Táticas 
      const [inputEstrategica, setInputEstrategica] = useState({
        titulo: "",
        descricao: "",
        emails: "",
      });
      





    
    
      // 🔹 Carregar usuários do Firebase
      useEffect(() => {
        const fetchUsers = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, "user")); // ✅ Usa `db` diretamente
            const usersList = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              username: doc.data().username,
              email: doc.data().email,
              photoURL: doc.data().photoURL || "",
            }));
            setUsers(usersList);
          } catch (error) {
            console.error("Erro ao buscar usuários:", error);
          }
        };
      
        fetchUsers();
      }, []);
      







  //Buscar dados do Firestore
useEffect(() => {
  const fetchData = async () => {
    try {
      // ÁREAS + SUBÁREAS
      const queryAreas = await getDocs(collection(db, "areas"));

      const areasList = queryAreas.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome || "",
        subareas: doc.data().subareas || [],
      }));

      setAreas(areasList);

      const todasSubareas = areasList.flatMap((area) =>
        (area.subareas || []).map((subarea, index) => ({
          id: `${area.id}-${index}`,
          nome: subarea,
          areaId: area.id,
          areaNome: area.nome,
        }))
      );

      setSubareas(todasSubareas);

      console.log("🔥 Áreas carregadas:", areasList);
      console.log("🔥 Subáreas carregadas:", todasSubareas);

      // UNIDADES
      const queryUnidades = await getDocs(collection(db, "unidade"));

      const unidadesList = queryUnidades.docs.map((doc) => ({
        id: doc.id,
        nome: doc.data().nome || "",
      }));

      setUnidades(unidadesList);

      console.log("🔥 Unidades carregadas:", unidadesList);
    } catch (error) {
      console.error("Erro ao buscar áreas, subáreas e unidades:", error);
    }
  };

  fetchData();
}, []);






  const handleEditTarefa = (tarefaId, campo, valor) => {
    setEstrategicas((prev) =>
      prev.map((estrategica) => ({
        ...estrategica,
        taticas: estrategica.taticas.map((tatica) => ({
          ...tatica,
          operacionais: tatica.operacionais.map((operacional) => ({
            ...operacional,
            tarefas: operacional.tarefas.map((t) =>
              t.id === tarefaId
                ? {
                    ...t,
                    [campo]: valor,
                    planoDeAcao: {
                      ...t.planoDeAcao,
                      ...(campo in t.planoDeAcao ? { [campo]: valor } : {}),
                    },
                  }
                : t
            ),
          })),
        })),
      }))
    );
  };




  // função para apagar tarefas criadas
  const handleRemoveTarefa = async (idEstrategica, idTatica, idOperacional, idTarefa) => {
    const atualizado = estrategicas.map((estrategica) => {
      if (estrategica.id !== idEstrategica) return estrategica;

      return {
        ...estrategica,
        taticas: estrategica.taticas.map((tatica) => {
          if (tatica.id !== idTatica) return tatica;

          return {
            ...tatica,
            operacionais: tatica.operacionais.map((operacional) => {
              if (operacional.id !== idOperacional) return operacional;

              return {
                ...operacional,
                tarefas: operacional.tarefas.filter((tarefa) => tarefa.id !== idTarefa),
              };
            }),
          };
        }),
      };
    });

    setEstrategicas(atualizado);
    onUpdate && onUpdate({ estrategicas: atualizado });

    if (!projectId) {
      console.warn("❌ ID do projeto não encontrado ao remover tarefa.");
      return;
    }

    try {
      const projetoRef = doc(db, "projetos", projectId);
      await updateDoc(projetoRef, {
        estrategicas: atualizado,
        updatedAt: new Date(),
      });
      console.log("✅ Tarefa removida do Firestore!");
    } catch (error) {
      console.error("❌ Erro ao remover tarefa do Firestore:", error);
    }
  };






  //função para salvar nova tarefa/planodeacao
const handleAddTarefa = async (idEstrategica, idTatica, idOperacional, novaTarefa) => {
    if (!novaTarefa || typeof novaTarefa !== "string" || !novaTarefa.trim()) {
      alert("Nome da tarefa é obrigatório.");
      return;
    }

    const novaTarefaObj = {
      id: Date.now().toString(),
      tituloTarefa: novaTarefa,
      criacao: "",
      finalizacao: "",
      time: "", // ✅ será definido após preenchimento
      status: "nao_iniciada",
      statusVisual: "nao_iniciada",
      planoDeAcao: {
        oQue: "",
        porQue: "",
        quem: [],
        quemEmail: [],
        quando: "",
        onde: "",
        como: "",
        valor: "",
        anexos: [],
      },
    };

    const atualizado = estrategicas.map((est) => {
      if (est.id !== idEstrategica) return est;

      return {
        ...est,
        taticas: est.taticas.map((tat) => {
          if (tat.id !== idTatica) return tat;

          return {
            ...tat,
            operacionais: tat.operacionais.map((op) => {
              if (op.id !== idOperacional) return op;

              return {
                ...op,
                tarefas: [...(op.tarefas || []), novaTarefaObj],
              };
            }),
          };
        }),
      };
    });

    setEstrategicas(atualizado);
    onUpdate && onUpdate({ estrategicas: atualizado });

    try {
      const projetoRef = doc(db, "projetos", projectId);
      await updateDoc(projetoRef, {
        estrategicas: atualizado,
        updatedAt: new Date(),
      });
      console.log("✅ Tarefa salva no Firestore.");
    } catch (error) {
      console.error("❌ Erro ao salvar tarefa:", error);
    }
  };







    // -------------------------------------
    // Criar nova Diretriz Estratégica
    // -------------------------------------
    //|| !descEstrategica.trim()

  const handleAddEstrategica = () => {
  if (!novaEstrategica.trim()) {
    alert("Preencha o nome da Diretriz Estratégica!");
    return;
  }

  if (!selectedArea || selectedArea.length === 0) {
    alert("Selecione uma ou mais áreas responsáveis para a Estratégica!");
    return;
  }

  const emails = emailsDigitados
    .split(",")
    .map((email) => email.trim())
    .filter((email) => email !== "");

  const areasSelecionadasObjs = areas.filter((area) =>
    selectedArea.includes(area.id)
  );

  const areaNomes = areasSelecionadasObjs.map((area) => area.nome);

  const item = {
    id: Date.now().toString(),
    titulo: novaEstrategica,
    descricao: descEstrategica,
    emails,
    taticas: [],
    status: "",
    statusVisual: "",
    time: "",
    criacao: "",
    finalizacao: "",
    createdAt: new Date().toISOString(),

    areaId: selectedArea,
    areaNome: areaNomes.join(", "),
    areaNomes,
    areasResponsaveis: selectedArea,

    unidades: [],
    subareas: [],
  };

  const atualizado = [...estrategicas, item];

  setEstrategicas(atualizado);
  onUpdate && onUpdate({ estrategicas: atualizado });

  setNovaEstrategica("");
  setDescEstrategica("");
  setSelectedArea([]);
};

    
    
    
    
    

    // -------------------------------------
    // Remover Diretriz Estratégica
    // -------------------------------------
    const handleRemoveEstrategica = async (id) => {
      const atualizado = estrategicas.filter((d) => d.id !== id);
      setEstrategicas(atualizado);
      onUpdate && onUpdate({ estrategicas: atualizado });
    
      if (!projectId) {
        console.warn("❌ ID do projeto não encontrado para salvar exclusão");
        return;
      }
    
      try {
        const projetoRef = doc(db, "projetos", projectId);
        await updateDoc(projetoRef, {
          estrategicas: atualizado,
          updatedAt: new Date(),
        });
        console.log("✅ Estratégica deletada e Firestore atualizado!");
      } catch (error) {
        console.error("❌ Erro ao remover estratégica no Firestore:", error);
      }
    };
    

    // -------------------------------------
    // Criar nova Diretriz Tática
    // -------------------------------------
    //|| !descricao.trim()

const handleAddTatica = async (estrategicaId, titulo, descricao, areaId, areaNome) => {
  if (!titulo || !titulo.trim()) {
    alert("Nome da tática é obrigatório.");
    return;
  }

  if (!areaId || !areaNome) {
    alert("Selecione uma área antes de adicionar uma Tática.");
    return;
  }

  const novaTatica = {
    id: Date.now().toString(),
    titulo,
    descricao,
    operacionais: [],
    emails: [],
    areaId,
    areaNome,
    areasResponsaveis: [areaId],
    status: "",
    statusVisual: "",
    time: "",
    criacao: "",
    finalizacao: "",
    createdAt: new Date().toISOString(),
    unidades: [],
  };

  const atualizado = estrategicas.map((est) =>
    est.id !== estrategicaId
      ? est
      : {
          ...est,
          taticas: [...(est.taticas || []), novaTatica],
        }
  );

  setEstrategicas(atualizado);
  onUpdate && onUpdate({ estrategicas: atualizado });
};



    
    
    
    
    
    
    
    
    

    // -------------------------------------
    // Remover Diretriz Tática
    // -------------------------------------
    const handleRemoveTatica = async (idEstrategica, idTatica) => {
      const atualizadas = estrategicas.map((est) => {
        if (est.id === idEstrategica) {
          return {
            ...est,
            taticas: est.taticas.filter((t) => t.id !== idTatica),
          };
        }
        return est;
      });
    
      setEstrategicas(atualizadas);
      onUpdate && onUpdate({ estrategicas: atualizadas });
    
      if (!projectId) {
        console.warn("❌ ID do projeto não encontrado para salvar exclusão de tática");
        return;
      }
    
      try {
        const projetoRef = doc(db, "projetos", projectId);
        await updateDoc(projetoRef, {
          estrategicas: atualizadas,
          updatedAt: new Date(),
        });
        console.log("✅ Tática removida e Firestore atualizado!");
      } catch (error) {
        console.error("❌ Erro ao remover tática no Firestore:", error);
      }
    };
    

    // -------------------------------------
    // Criar nova Diretriz Operacional
    // -------------------------------------
    //|| !descricao.trim()) 

const handleAddOperacional = (
  idEstrategica,
  idTatica,
  titulo,
  descricao,
  areaId,
  areaNome
) => {
  if (!titulo.trim()) {
    alert("Preencha o nome da Diretriz Operacional!");
    return;
  }

  if (!areaId || !areaNome) {
    alert("Selecione uma área para a Diretriz Operacional!");
    return;
  }

  const novaOperacional = {
    id: Date.now().toString(),
    titulo,
    descricao,
    tarefas: [],
    emails: [],
    areaId,
    areaNome,
    areasResponsaveis: [areaId],
    unidades: [],
    status: "",
    statusVisual: "",
    time: "",
    criacao: "",
    finalizacao: "",
    createdAt: new Date().toISOString(),
  };

  const atualizado = estrategicas.map((est) =>
    est.id !== idEstrategica
      ? est
      : {
          ...est,
          taticas: est.taticas.map((tat) =>
            tat.id !== idTatica
              ? tat
              : {
                  ...tat,
                  operacionais: [...(tat.operacionais || []), novaOperacional],
                }
          ),
        }
  );

  setEstrategicas(atualizado);
  onUpdate && onUpdate({ estrategicas: atualizado });
};

    

    
    
    

    // -------------------------------------
    // Remover Diretriz Operacional
    // -------------------------------------
    const handleRemoveOperacional = async (idEstrategica, idTatica, idOp) => {
      const atualizadas = estrategicas.map((est) => {
        if (est.id === idEstrategica) {
          const novasTaticas = est.taticas.map((t) => {
            if (t.id === idTatica) {
              return {
                ...t,
                operacionais: t.operacionais.filter((op) => op.id !== idOp),
              };
            }
            return t;
          });
          return { ...est, taticas: novasTaticas };
        }
        return est;
      });
    
      setEstrategicas(atualizadas);
      onUpdate && onUpdate({ estrategicas: atualizadas });
    
      if (!projectId) {
        console.warn("❌ ID do projeto não encontrado para salvar exclusão de operacional");
        return;
      }
    
      try {
        const projetoRef = doc(db, "projetos", projectId);
        await updateDoc(projetoRef, {
          estrategicas: atualizadas,
          updatedAt: new Date(),
        });
        console.log("✅ Operacional removido e Firestore atualizado!");
      } catch (error) {
        console.error("❌ Erro ao remover operacional no Firestore:", error);
      }
    };
    

    // -------------------------------------
    // Atualiza a Diretriz Operacional quando `DiretrizData` muda (tarefas, 5W2H)
    // -------------------------------------
    const handleUpdateOperacional = (idEstrategica, idTatica, operAtualizada) => {
      console.log("📌 BaseDiretriz recebeu atualização de tarefas:", JSON.stringify(operAtualizada, null, 2));

      setEstrategicas((prevEstrategicas) => {
        const atualizado = prevEstrategicas.map((est) => {
          if (est.id !== idEstrategica) return est;
          return {
            ...est,
            taticas: est.taticas.map((t) => {
              if (t.id !== idTatica) return t;
              return {
                ...t,
                operacionais: t.operacionais.map((op) =>
                  op.id === operAtualizada.id
                    ? { ...op, tarefas: operAtualizada.tarefas || [] }
                    : op
                ),
              };
            }),
          };
        });
        onUpdate && onUpdate({ estrategicas: atualizado });
        return atualizado;
      }); 
  };




  
    
    
    
  // 🔹 Função para salvar diretrizes no Firestore
  const saveEstrategicas = async (projectId, novoArray) => {
    if (!projectId) {
      console.error("❌ projectId está indefinido ao tentar salvar estratégicas!");
      return;
    }

    try {
      const docRef = doc(dbFokus360, "projetos", projectId);
      await updateDoc(docRef, { estrategicas: novoArray });
      console.log("✅ Estratégicas atualizadas no Firestore!");
    } catch (err) {
      console.error("❌ Erro ao atualizar estratégicas:", err);
    }
  };








    //======================================================== ESTRATÉGICAS + MAPEAMENTO GERAL ==============================================================




  // Mapeamento de Áreas e seus perfis (roles) para o campo de select de areas da empresa
  //conecta as areas aos usuarios cadastrados de cada area
  const areaRolesMap = {
    "25FT05zvwGNditGma9Z4": ["19", "20", "21"], // FINANCEIRO
    "47W05V7tgDVVyMCve9e1": ["28", "29", "30"], // MARKETING
    "L2V5XLKvP0Ut9gyQVJiH": ["12", "13", "14"], // CONTABILIDADE
    "i73QGK2jRgmoN4vNyPAf": ["15", "16", "17", "18"], // CONTROLADORIA
    "qx8XjIjcstoXnHenJGEa": ["22", "23", "24"], // JURIDICO
    "u61drZ23ZQWIkCZk1x20": ["25", "26", "27"], // LOGISTICA
    "wpJB6txSxD2DzzFBESfW": ["09", "10", "11"], // TRADE
    "wzMNANRkdaELthrNUt5f": ["31", "32", "33"], // RECURSOSHUMANOS
  };






    const buscarUsuariosPorRole = async (roles) => {
      const querySnapshot = await getDocs(collection(db, "user"));
      return querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => roles.includes(user.role));
    };


  // -------------------------------------
    // Salvar todas as Diretrizes
    // -------------------------------------
    
  const handleSalvarEstrategicas = async () => {
  try {
    if (!projectId) {
      alert("ID do projeto não encontrado. Salve primeiro as informações do projeto.");
      return;
    }

    const getNovosItens = (atuais = [], originais = []) => {
      const atualSet = new Set(atuais || []);
      const originalSet = new Set(originais || []);
      return [...atualSet].filter((item) => !originalSet.has(item));
    };

    const calcularStatusCorreto = (status, finalizacao, timeAtual = "") => {
      if (!status || !finalizacao) {
        return {
          statusVisual: "",
          time: timeAtual || "",
        };
      }

      const hoje = normalizarData(new Date());
      const prazo = normalizarData(finalizacao);
      const estaNoPrazo = hoje <= prazo;

      return {
        statusVisual: estaNoPrazo ? "no_prazo" : "atrasada",
        time: estaNoPrazo ? "no prazo" : "atrasada",
      };
    };

    const enviarEmailTarefa = async ({
      email,
      tituloTarefa,
      assuntoTarefa,
      prazoTarefa = "Sem prazo",
    }) => {
      return fetch("https://fokus360-backend.vercel.app/send-task-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          tituloTarefa,
          assuntoTarefa,
          prazoTarefa,
        }),
      });
    };

    const enviarNotificacaoInternaPorUsuarios = async (usuarios = [], mensagem) => {
      const userIds = [...new Set(usuarios.map((user) => user.id).filter(Boolean))];

      if (userIds.length === 0) return;

      return fetch("https://fokus360-backend.vercel.app/send-project-notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userIds,
          mensagem,
        }),
      });
    };

    const estrategicasAtualizadas = estrategicas.map((est) => {
      const taticasAtualizadas = (est.taticas || []).map((tatica) => {
        const operacionaisAtualizadas = (tatica.operacionais || []).map((op) => {
          const manualEmails = Array.isArray(emailsPorIdOperacional?.[op.id])
            ? emailsPorIdOperacional[op.id]
            : String(emailsPorIdOperacional?.[op.id] || "")
                .split(",")
                .map((e) => e.trim())
                .filter(Boolean);

          const responsaveisEmails = Array.isArray(op.quemOperacionais)
            ? op.quemOperacionais
            : [];

          const tarefasAtualizadas = (op.tarefas || []).map((tarefa) => {
            const final = tarefa.finalizacao || "";
            const status = tarefa.status ?? "";
            const statusCalculado = calcularStatusCorreto(status, final, tarefa.time);

            return {
              ...tarefa,
              criacao: tarefa.criacao || "",
              finalizacao: final,
              tituloTarefa: tarefa.tituloTarefa || "",
              status,
              ...statusCalculado,
              planoDeAcao: {
                ...tarefa.planoDeAcao,
                oQue: tarefa.planoDeAcao?.oQue || "",
                porQue: tarefa.planoDeAcao?.porQue || "",
                quem: tarefa.planoDeAcao?.quem || [],
                quemEmail: Array.isArray(tarefa.planoDeAcao?.quemEmail)
                  ? tarefa.planoDeAcao.quemEmail
                  : String(tarefa.planoDeAcao?.quemEmail || "")
                      .split(",")
                      .map((e) => e.trim())
                      .filter(Boolean),
                quando: tarefa.planoDeAcao?.quando || "",
                onde: tarefa.planoDeAcao?.onde || "",
                como: tarefa.planoDeAcao?.como || "",
                valor: tarefa.planoDeAcao?.valor || "",
                anexos: Array.isArray(tarefa.planoDeAcao?.anexos)
                  ? tarefa.planoDeAcao.anexos
                  : [],
              },
            };
          });

          const statusOp = calcularStatusCorreto(
            op.status ?? "",
            op.finalizacao || "",
            op.time
          );

          return {
            ...op,
            finalizacao: op.finalizacao || "",
            criacao: op.criacao || "",
            status: op.status ?? "",
            ...statusOp,
            areasResponsaveis: areasPorIdOperacional[op.id] || op.areasResponsaveis || [],
            unidades: unidadesPorIdOperacional?.[op.id] || op.unidades || [],
            subareas: subareasPorIdOperacional[op.id] || op.subareas || [],
            emails: [...manualEmails, ...responsaveisEmails].filter((e) => e.trim() !== ""),
            tarefas: tarefasAtualizadas,
          };
        });

        const statusTatica = calcularStatusCorreto(
          tatica.status ?? "",
          tatica.finalizacao || "",
          tatica.time
        );

        return {
          ...tatica,
          finalizacao: tatica.finalizacao || "",
          criacao: tatica.criacao || "",
          status: tatica.status ?? "",
          ...statusTatica,
          areasResponsaveis: areasTaticasPorId[tatica.id] || tatica.areasResponsaveis || [],
          unidades: unidadesTaticasPorId[tatica.id] || tatica.unidades || [],
          subareas: subareasPorIdTatica[tatica.id] || tatica.subareas || [],
          emails: Array.isArray(emailsPorIdTatica[tatica.id])
            ? emailsPorIdTatica[tatica.id].filter((e) => e.trim() !== "")
            : String(emailsPorIdTatica[tatica.id] || "")
                .split(",")
                .map((e) => e.trim())
                .filter(Boolean),
          operacionais: operacionaisAtualizadas,
        };
      });

      const statusEstrategica = calcularStatusCorreto(
        est.status ?? "",
        est.finalizacao || "",
        est.time
      );

      return {
        ...est,
        criacao: est.criacao || "",
        finalizacao: est.finalizacao || "",
        status: est.status ?? "",
        ...statusEstrategica,
        areasResponsaveis: areasPorId[est.id] || est.areasResponsaveis || [],
        unidades: unidadesPorId[est.id] || est.unidades || [],
        subareas: subareasPorIdEstrategica[est.id] || est.subareas || [],
        emails: Array.isArray(emailsPorIdEstrategica[est.id])
          ? emailsPorIdEstrategica[est.id].filter((e) => e.trim() !== "")
          : String(emailsPorIdEstrategica[est.id] || "")
              .split(",")
              .map((e) => e.trim())
              .filter(Boolean),
        taticas: taticasAtualizadas,
      };
    });

    const projetoRef = doc(db, "projetos", projectId);

    await updateDoc(projetoRef, {
      estrategicas: estrategicasAtualizadas,
      updatedAt: new Date(),
    });

    for (const est of estrategicasAtualizadas) {
      const novasAreas = getNovosItens(
        est.areasResponsaveis,
        areasOriginaisPorId?.[est.id] || []
      );

      const novosEmails = getNovosItens(
        est.emails,
        emailsOriginaisPorIdEstrategica?.[est.id] || []
      );

      if (novasAreas.length > 0) {
        const novosUsuarios = await buscarUsuariosPorRole(
          novasAreas.flatMap((a) => areaRolesMap[a] || [])
        );

        await Promise.all(
          novosUsuarios.map((user) =>
            enviarEmailTarefa({
              email: user.email,
              tituloTarefa: "Nova Diretriz Estratégica",
              assuntoTarefa: "Foi criada uma nova diretriz estratégica vinculada à sua área.",
            })
          )
        );

        await enviarNotificacaoInternaPorUsuarios(
          novosUsuarios,
          "Foi criada uma nova Diretriz Estratégica vinculada à sua área."
        );
      }

      if (novosEmails.length > 0) {
        await Promise.all(
          novosEmails.map((email) =>
            enviarEmailTarefa({
              email,
              tituloTarefa: "Nova Diretriz Estratégica",
              assuntoTarefa: "Você foi designado como responsável por uma diretriz Estratégica.",
            })
          )
        );

        await enviarNotificacaoInternaPorEmails(
          novosEmails,
          "Você foi designado como responsável por uma Diretriz Estratégica."
        );
      }

      for (const tat of est.taticas || []) {
        const novasAreasTat = getNovosItens(
          tat.areasResponsaveis,
          areasOriginaisTaticasPorId?.[tat.id] || []
        );

        const novosEmailsTat = getNovosItens(
          tat.emails,
          emailsOriginaisPorIdTatica?.[tat.id] || []
        );

        if (novasAreasTat.length > 0) {
          const usuariosTaticos = await buscarUsuariosPorRole(
            novasAreasTat.flatMap((a) => areaRolesMap[a] || [])
          );

          await Promise.all(
            usuariosTaticos.map((user) =>
              enviarEmailTarefa({
                email: user.email,
                tituloTarefa: "Nova Diretriz Tática",
                assuntoTarefa: "Foi criada uma nova diretriz tática vinculada à sua área.",
              })
            )
          );

          await enviarNotificacaoInternaPorUsuarios(
            usuariosTaticos,
            "Foi criada uma nova Diretriz Tática vinculada à sua área."
          );
        }

        if (novosEmailsTat.length > 0) {
          await Promise.all(
            novosEmailsTat.map((email) =>
              enviarEmailTarefa({
                email,
                tituloTarefa: "Nova Diretriz Tática",
                assuntoTarefa: "Você foi designado como responsável por uma diretriz Tática.",
              })
            )
          );

          await enviarNotificacaoInternaPorEmails(
            novosEmailsTat,
            "Você foi designado como responsável por uma Diretriz Tática."
          );
        }

        for (const op of tat.operacionais || []) {
          const novasAreasOp = getNovosItens(
            op.areasResponsaveis,
            areasOriginaisOperacionaisPorId?.[op.id] || []
          );

          const novosEmailsOp = getNovosItens(
            op.emails,
            emailsOriginaisPorIdOperacional?.[op.id] || []
          );

          if (novasAreasOp.length > 0) {
            const usuariosOp = await buscarUsuariosPorRole(
              novasAreasOp.flatMap((a) => areaRolesMap[a] || [])
            );

            await Promise.all(
              usuariosOp.map((user) =>
                enviarEmailTarefa({
                  email: user.email,
                  tituloTarefa: "Nova Diretriz Operacional",
                  assuntoTarefa: "Foi criada uma nova diretriz operacional vinculada à sua área.",
                })
              )
            );

            await enviarNotificacaoInternaPorUsuarios(
              usuariosOp,
              "Foi criada uma nova Diretriz Operacional vinculada à sua área."
            );
          }

          if (novosEmailsOp.length > 0) {
            await Promise.all(
              novosEmailsOp.map((email) =>
                enviarEmailTarefa({
                  email,
                  tituloTarefa: "Nova Diretriz Operacional",
                  assuntoTarefa: "Você foi designado como responsável por uma diretriz Operacional.",
                })
              )
            );

            await enviarNotificacaoInternaPorEmails(
              novosEmailsOp,
              "Você foi designado como responsável por uma Diretriz Operacional."
            );
          }
        }
      }
    }

    const emailsTarefas = estrategicasAtualizadas.flatMap((est) =>
      (est.taticas || []).flatMap((tat) =>
        (tat.operacionais || []).flatMap((op) =>
          (op.tarefas || []).flatMap((tarefa) =>
            (tarefa.planoDeAcao?.quemEmail || []).map((email) => ({
              email,
              tituloTarefa: tarefa.tituloTarefa || "Nova Tarefa",
              assuntoTarefa: "Você foi designado como responsável por uma tarefa operacional.",
              prazoTarefa: tarefa.planoDeAcao?.quando || "Sem prazo",
            }))
          )
        )
      )
    );

    if (emailsTarefas.length > 0) {
      await Promise.all(emailsTarefas.map((item) => enviarEmailTarefa(item)));

      await enviarNotificacaoInternaPorEmails(
        emailsTarefas.map((item) => item.email),
        "Você foi designado como responsável por uma Tarefa Operacional."
      );
    }

    setEstrategicas(estrategicasAtualizadas);

    setAreasOriginaisPorId(
      Object.fromEntries(
        estrategicasAtualizadas.map((est) => [est.id, est.areasResponsaveis || []])
      )
    );

    setEmailsOriginaisPorIdEstrategica(
      Object.fromEntries(
        estrategicasAtualizadas.map((est) => [est.id, est.emails || []])
      )
    );

    const novasAreasOriginaisTaticas = {};
    const novosEmailsOriginaisTaticas = {};
    const novasAreasOriginaisOperacionais = {};
    const novosEmailsOriginaisOperacionais = {};

    estrategicasAtualizadas.forEach((est) => {
      (est.taticas || []).forEach((tat) => {
        novasAreasOriginaisTaticas[tat.id] = tat.areasResponsaveis || [];
        novosEmailsOriginaisTaticas[tat.id] = tat.emails || [];

        (tat.operacionais || []).forEach((op) => {
          novasAreasOriginaisOperacionais[op.id] = op.areasResponsaveis || [];
          novosEmailsOriginaisOperacionais[op.id] = op.emails || [];
        });
      });
    });

    setAreasOriginaisTaticasPorId(novasAreasOriginaisTaticas);
    setEmailsOriginaisPorIdTatica(novosEmailsOriginaisTaticas);
    setAreasOriginaisOperacionaisPorId(novasAreasOriginaisOperacionais);
    setEmailsOriginaisPorIdOperacional(novosEmailsOriginaisOperacionais);

    alert("✅ Diretrizes salvas com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao salvar diretrizes:", error);
    alert("Erro ao salvar diretrizes. Tente novamente.");
  }
};
    
    
    
    




    
    
    
    //=============================================================================================================



    //========================================= LOGICA DE CALCULOS DE PROGRESSO ====================================================

    

    
    

    
    

  //=========================================================================================================================================== 



  //========================================= Salvar Operacional ====================================================



  //exibir a data atual do navegador
  useEffect(() => {
    const hoje = new Date();
    const dia = hoje.getDate().toString().padStart(2, '0');
    const mes = (hoje.getMonth() + 1).toString().padStart(2, '0');
    const ano = hoje.getFullYear();

    const dataAtual = `${ano}-${mes}-${dia}`;
    const elemento = document.getElementById('dataAtual');

    if (elemento) {
      elemento.textContent = `${dia}/${mes}/${ano}`;
    }

    console.log("📅 Data do navegador:", dataAtual);
  }, []);




  // -------------------------------------
    // função de upload para tarefa
    // -------------------------------------

    const uploadFileTarefaToFirebase = async (file, tarefaId) => {
  const timestamp = Date.now();

  const storageRef = ref(
    storageFokus360,
    `projetos/${projectId}/tarefas/${tarefaId}/${timestamp}-${file.name}`
  );

  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);

  return {
     nomeArquivo: file.name,
    arquivoUrl: url,
    storagePath: storageRef.fullPath,
    tipoArquivo: file.type || "",
    tamanhoArquivo: file.size || 0,
    enviadoEm: new Date().toISOString(),
  };
};

//+++++++++++++++++++++++

const handleUploadAnexosTarefa = async (event, tarefaId) => {
  const files = Array.from(event.target.files || []);

  if (!files.length) return;

  const arquivosGrandes = files.filter(
    (file) => file.size > TAMANHO_MAXIMO_BYTES
  );

  if (arquivosGrandes.length > 0) {
    alert("❌ Limite máximo permitido: 40MB por arquivo.");
  }

  const arquivosValidos = files.filter(
    (file) => file.size <= TAMANHO_MAXIMO_BYTES
  );

  if (arquivosValidos.length === 0) return;

  setUploadingTarefaId(tarefaId);

  try {
    const uploads = await Promise.all(
      arquivosValidos.map((file) => uploadFileTarefaToFirebase(file, tarefaId))
    );

    setEstrategicas((prev) =>
      prev.map((estrategica) => ({
        ...estrategica,
        taticas: estrategica.taticas.map((tatica) => ({
          ...tatica,
          operacionais: tatica.operacionais.map((operacional) => ({
            ...operacional,
            tarefas: operacional.tarefas.map((tarefa) => {
              if (tarefa.id !== tarefaId) return tarefa;

              return {
                ...tarefa,
                planoDeAcao: {
                  ...tarefa.planoDeAcao,
                  anexos: [
                    ...(tarefa.planoDeAcao?.anexos || []),
                    ...uploads,
                  ],
                },
              };
            }),
          })),
        })),
      }))
    );

    alert("✅ Arquivo anexado à tarefa com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao enviar arquivo da tarefa:", error);
    alert("❌ Erro ao enviar arquivo.");
  } finally {
    setUploadingTarefaId(null);
    event.target.value = "";
  }
};


//+++++++++++++++++++++++++++

const handleRemoveAnexoTarefa = (tarefaId, indexAnexo) => {
  setEstrategicas((prev) =>
    prev.map((estrategica) => ({
      ...estrategica,
      taticas: estrategica.taticas.map((tatica) => ({
        ...tatica,
        operacionais: tatica.operacionais.map((operacional) => ({
          ...operacional,
          tarefas: operacional.tarefas.map((tarefa) => {
            if (tarefa.id !== tarefaId) return tarefa;

            return {
              ...tarefa,
              planoDeAcao: {
                ...tarefa.planoDeAcao,
                anexos: (tarefa.planoDeAcao?.anexos || []).filter(
                  (_, index) => index !== indexAnexo
                ),
              },
            };
          }),
        })),
      })),
    }))
  );
};

//++++++++++++++++++

const getPreviewUrlArquivo = (arquivo) => {
  const url = arquivo?.arquivoUrl || "";
  const nome = (arquivo?.nomeArquivo || "").toLowerCase();
  const tipo = (arquivo?.tipoArquivo || "").toLowerCase();

  const isPdf = tipo.includes("pdf") || nome.endsWith(".pdf");

  const isImage =
    tipo.includes("image") ||
    nome.endsWith(".jpg") ||
    nome.endsWith(".jpeg") ||
    nome.endsWith(".png") ||
    nome.endsWith(".webp");

  const isOffice =
    nome.endsWith(".doc") ||
    nome.endsWith(".docx") ||
    nome.endsWith(".xls") ||
    nome.endsWith(".xlsx") ||
    nome.endsWith(".xlsm") ||
    nome.endsWith(".ppt") ||
    nome.endsWith(".pptx") ||
    nome.endsWith(".ppsx");

  if (isPdf || isImage) {
    return url;
  }

  if (isOffice) {
    return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
      url
    )}`;
  }

  return url;
};

const handleVisualizarArquivo = (arquivo) => {
  const previewUrl = getPreviewUrlArquivo(arquivo);

  if (!previewUrl) {
    alert("Arquivo sem URL para visualização.");
    return;
  }

  window.open(previewUrl, "_blank", "noopener,noreferrer");
};

//++++++++++++++++++++

//Função para downlaod

const BACKEND_URL = "https://fokus360-backend.vercel.app";

const handleDownloadArquivoBackend = async (arquivo) => {
  try {
    if (!arquivo?.storagePath) {
      alert("Este arquivo não possui storagePath. Reenvie o arquivo para habilitar o download seguro.");
      return;
    }

    const usuarioAtual = authFokus360.currentUser;

    if (!usuarioAtual) {
      alert("Usuário não autenticado.");
      return;
    }

    const token = await usuarioAtual.getIdToken();

    const response = await fetch(`${BACKEND_URL}/download-file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        storagePath: arquivo.storagePath,
        arquivoUrl: arquivo.arquivoUrl,
        nomeArquivo: arquivo.nomeArquivo || "arquivo",
      }),
    });

    if (!response.ok) {
      const erro = await response.json().catch(() => null);
      throw new Error(erro?.message || "Erro ao baixar arquivo.");
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = arquivo.nomeArquivo || "arquivo";

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("❌ Erro ao baixar arquivo:", error);
    alert(error.message || "Não foi possível baixar o arquivo.");
  }
};




    

    // -------------------------------------
    // Render
    // -------------------------------------
    return (
      <Box>
<Box display="flex" alignItems="center" marginBottom="20px">
  <SubdirectoryArrowRightIcon
    sx={{ fontSize: 30, color: "#312783", mr: 1 }}
  />

  <Typography
    variant="h6"
    fontWeight="bold"
    sx={{ color: "#312783", marginTop: 1 }}
  >
    Filtrar Estratégicas por Área
  </Typography>

  <Box sx={{ flex: 1, minWidth: "250px", maxWidth: "300px", marginLeft: "20px" }}>
    <Select
      fullWidth
      displayEmpty
      value={areaFiltroEstrategica}
      onChange={(event) => setAreaFiltroEstrategica(event.target.value)}
      renderValue={(selected) => {
        if (!selected) {
          return <em>Selecione Estratégicas por área</em>;
        }

        const nome = areas.find((area) => area.id === selected)?.nome;
        return nome || "Desconhecida";
      }}
      sx={{
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "transparent",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "transparent",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "transparent",
        },
        backgroundColor: "#312783",
        borderRadius: "4px",
        color: "#fff",
      }}
    >
     

      {areas.map((area) => (
        <MenuItem key={area.id} value={area.id}>
          <ListItemText primary={area.nome} />
        </MenuItem>
      ))}
    </Select>
  </Box>
</Box>
      
        {/* ***************************** */}
        {/* Form para criar EstratÉgica */}
        {/* ***************************** */}
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ color: "#312783", mb: 1 }}
        >
          Criar Diretriz Estratégica
        </Typography>

        <Box display="flex" flexDirection="column" gap={2} mb={4}>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {/* Campo de texto maior */}
            <Box sx={{ flex: 2, minWidth: "250px" }}>
              <TextField
                label="Nome da Diretriz Estratégica..."
                value={novaEstrategica}
                onChange={(e) => setNovaEstrategica(e.target.value)}
                fullWidth
              />
            </Box>

            {/* Select menor ao lado */}
            <Box sx={{ flex: 1, minWidth: "200px" }}>
              <Select
                multiple
                value={Array.isArray(selectedArea) ? selectedArea : []}
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedArea(typeof value === "string" ? value.split(",") : value);
                }}
                displayEmpty
                fullWidth
                sx={{ backgroundColor: "transparent" }}
                renderValue={(selected) => {
                  if (!selected || selected.length === 0) {
                    return "Selecione uma ou mais áreas para Estratégica";
                  }

                  return selected
                    .map((id) => areas.find((area) => area.id === id)?.nome || "Desconhecida")
                    .join(", ");
                }}
              >
                {areas.map((area) => (
                  <MenuItem key={area.id} value={area.id}>
                    <Checkbox checked={(selectedArea || []).includes(area.id)} />
                    <ListItemText primary={area.nome} />
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          <Box sx={{ flex: 1, minWidth: "200px", maxWidth: "300px" }}>
          
          
        </Box>

          {/* Botões "+" e "Salvar Estratégicas" alinhados à esquerda em coluna */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2,
              marginTop: 2,
              width: "300px", // igual aos campos select e inputs
            }}
          >
            {/* Botão "+" */}
            <Button
              onClick={handleAddEstrategica}
              disableRipple
              sx={{
                backgroundColor: "transparent",
                paddingLeft: 0,
                "&:hover": {
                  backgroundColor: "transparent",
                  boxShadow: "none",
                },
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#312783" }} />
            </Button>
          </Box>

          

          {/* Título da seção Estratégica */}
        </Box>



        {/*=================================== LEGENADAS =============================================== */}

        {/* LEGENDA STATUS */}
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 3,
    flexWrap: "wrap",
    mb: 2,
    p: 1.2,
    borderRadius: "8px",
    backgroundColor: "rgba(49,39,131,0.05)",
    border: "1px solid rgba(49,39,131,0.12)",
  }}
>
  <Typography
    sx={{
      fontSize: "0.85rem",
      fontWeight: "bold",
      color: "#312783",
      mr: 1,
    }}
  >
    Legenda:
  </Typography>

  {/* Verde */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor: "#00ff08",
      }}
    />
    <Typography sx={{ fontSize: "0.82rem", color: "#555" }}>
      No prazo
    </Typography>
  </Box>

  {/* Vermelho */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor: "#ff0000",
      }}
    />
    <Typography sx={{ fontSize: "0.82rem", color: "#555" }}>
      Em atraso
    </Typography>
  </Box>

  {/* Cinza */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor: "#9ca3af",
      }}
    />
    <Typography sx={{ fontSize: "0.82rem", color: "#555" }}>
      Não iniciada
    </Typography>
  </Box>
  <Typography
    sx={{
      fontSize: "0.85rem",
      fontWeight: "bold",
      color: "#312783",
      mr: 1,
    }}
  >
    I
  </Typography>

  <Typography
    sx={{
      fontSize: "0.85rem",
      fontWeight: "bold",
      color: "#312783",
      mr: 1,
    }}
  >
   A Lógica de cores é calculada entra a "data de criação" X "data atual" 
  </Typography>
</Box>


{/*================================================================================== */}

        <Box display="flex" alignItems="center" marginBottom="20px">
          <ArrowDropDownCircleIcon
            sx={{ fontSize: 25, color: "#312783", mr: 1 }}
          />
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: "#483ebd", marginTop: 0.5 }}
          >
            Diretriz Estratégica
          </Typography>
        </Box>















































  {/* =========================  ESTRATÉGICAS  ================================ */}






















































        {/* ************************************ */}
        {/* Accordion p/ cada Diretriz Estratégica */}
        {/* ************************************ */}
        {estrategicas
  .filter((estrategica) => {
    if (!areaFiltroEstrategica) return false;

    const areaSelecionada = areas.find(
      (area) => area.id === areaFiltroEstrategica
    )?.nome;

    return (
  estrategica.areasResponsaveis?.includes(areaFiltroEstrategica) ||
  estrategica.areaId?.includes?.(areaFiltroEstrategica) ||
  estrategica.areaNomes?.includes(areaSelecionada) ||
  estrategica.areaNome?.split(",").map((a) => a.trim()).includes(areaSelecionada)
);
  })
  .map((estrategica) => {
          const areaSelecionada = areasSelecionadasPorEstrategica[estrategica.id]?.nome;

          const taticasFiltradas = (estrategica.taticas || []).filter(
            (tatica) => tatica.areaNome === areaSelecionada
          );

          return (
          <Accordion
            key={estrategica.id}
            disableGutters
            sx={{
              backgroundColor: "transparent",
              borderRadius: "8px",
              boxShadow: "none",
              marginBottom: "10px",
            }}
          >

            
            {/* Cabeçalho da Estratégica */}
            <AccordionSummary
              onClick={() => setEstrategicaId(estrategica.id)}
              expandIcon={<ExpandMoreIcon sx={{ color: "#b7b7b7" }} />}
              sx={{
                borderRadius: "8px",
                backgroundColor: "#312783",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >




    {/* Bolinha de status visual da Estratégica */}
    {estrategica.finalizacao && (
    <Box
      sx={{
        width: 14,
        height: 14,
        marginTop: "10px",
        borderRadius: "50%",
        marginRight: "5px",
        backgroundColor:
          estrategica.status === "concluida"
            ? (estrategica.statusVisual === "no_prazo" ? "#00ff08" : "#ff0000")
            : estrategica.time === "no prazo"
            ? "#00ff08"
            : estrategica.time === "atrasada"
            ? "#ff0000"
            : "#9ca3af",
      }}
    />
  )}



<StatusProgresso
  progresso={calcularProgressoEstrategica(estrategica)}
  cor="#0069f7"
/>








 



              <Box sx={{ flex: 1, textAlign: "left" }}>
                <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                  {estrategica.titulo}
                </Typography>
                <Typography sx={{ color: "#b7b7b7", fontSize: "0.9em" }}>
                  {estrategica.descricao?.length > 63
                    ? `${estrategica.descricao.slice(0, 63)}`
                    : estrategica.descricao}
                </Typography>

              </Box>

              

            










  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5, mr: 0.5 }}>
    {/* Checkbox: Concluída */}
    <Box sx={{ display: "flex", alignItems: "center", minWidth: 120 }}>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={estrategica.status === "concluida"}
            onChange={() => {
              const atualizado = estrategicas.map((e) => {
                if (e.id !== estrategica.id) return e;
            
                const novoStatus = e.status === "concluida" ? "" : "concluida";
            
                const hoje = new Date();
                const dataAtual = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()); // 🔵 Só dia/mês/ano

                const [ano, mes, dia] = estrategica?.finalizacao?.split("-") || [];
                const prazo = new Date(Number(ano), Number(mes) - 1, Number(dia)); // 🔥 monta manualmente: ano, mês (zero-based), dia

                const statusVisual =
                  novoStatus === "concluida" || novoStatus === "andamento"
                    ? dataAtual.getTime() <= prazo.getTime()
                      ? "no_prazo"
                      : "atrasada"
                    : "";


            
                return {
                  ...e,
                  status: novoStatus,
                  statusVisual,
                };
              });
            
              setEstrategicas(atualizado);
              onUpdate && onUpdate({ estrategicas: atualizado });
            }}
                    
                  
            sx={{
              width: 20,
              height: 20,
              marginLeft: 5,
              color: "#fff",
              "&.Mui-checked": {
                color: "#fff",
              },
              padding: 0,
            }}
          />
        }
        label={
          <Typography sx={{ color: "#fff", fontSize: "0.8rem", marginTop: "5px" }}>
            Concluída
          </Typography>
        }
        onClick={(e) => e.stopPropagation()}
        sx={{ margin: 0, cursor: "pointer" }}
      />
    </Box>

    {/* Checkbox: Em Andamento */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 130 }}>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={estrategica.status === "andamento"}
            onChange={() => {
              const atualizado = estrategicas.map((e) => {
                if (e.id !== estrategica.id) return e;
            
                const novoStatus = e.status === "andamento" ? "" : "andamento";
            
                const hoje = new Date();
                const dataAtual = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()); // 🔵 Data atual só com dia/mês/ano

                const [ano, mes, dia] = estrategica?.finalizacao?.split("-") || [];
                const prazo = new Date(Number(ano), Number(mes) - 1, Number(dia)); // 🔥 monta a data manualmente

                const statusVisual =
                  novoStatus === "andamento" || novoStatus === "concluida"
                    ? dataAtual.getTime() <= prazo.getTime()
                      ? "no_prazo"
                      : "atrasada"
                    : "";

            
                return {
                  ...e,
                  status: novoStatus,
                  statusVisual,
                };
              });
            
              setEstrategicas(atualizado);
              onUpdate && onUpdate({ estrategicas: atualizado });
            }}
            
                  
            
            sx={{
              width: 20,
              height: 20,
              color: "#fff",
              "&.Mui-checked": {
                color: "#fff",
              },
              padding: 0,
            }}
          />
        }
        label={
          <Typography sx={{ color: "#fff", fontSize: "0.8rem", marginTop: "5px" }}>
            Em Andamento
          </Typography>
        }
        onClick={(e) => e.stopPropagation()}
        sx={{ margin: 0, cursor: "pointer" }}
      />
    </Box>

    {/* Bolinha de status + texto fixo */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        minWidth: 120,
        justifyContent: "flex-start",
      }}
    >
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor:
          estrategica.statusVisual === "no_prazo"
            ? "#00ff08"
            : estrategica.statusVisual === "atrasada"
            ? "#ff0000"
            : "#9ca3af",

        }}
      />
    <Typography
    sx={{
      color: "#fff",
      fontSize: "0.8rem",
      whiteSpace: "nowrap",
      marginTop: "4px",
    }}
  >
  {estrategica.statusVisual === "no_prazo"
      ? "No prazo"
      : estrategica.statusVisual === "atrasada"
      ? "Em atraso"
      : "Não iniciada"}
  </Typography>



    </Box>
  </Box>



























              <Button
                disableRipple
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); // Isso é importante para evitar que o Accordion abra/feche
                  handleRemoveEstrategica(estrategica.id); // Correto: estrategica.id
                }}
                sx={{
                  minWidth: "40px",
                  padding: "5px",
                  border: "none",
                  backgroundColor: "transparent",
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                <DeleteForeverIcon sx={{ fontSize: 24, color: "#dddddd" }} />
              </Button>
              
            </AccordionSummary>

            {/* Detalhes: Diretriz estrategicas */}
  <AccordionDetails>




<Box sx={{ backgroundColor: "#8a8a8a", maxWidth: "210px", borderRadius: "10px", padding: "5px"}}>
 <SelectAreaStatus estrategica={estrategica} areas={areas} />
</Box>



  {/* descrição diretriz estrategicas */}
  <Box sx={{ display: "flex" }}>
  <TextField
    label="Descrição"
    value={estrategica.descricao || ""}
    onChange={(e) => {
      const value = e.target.value;

      setEstrategicas((prev) =>
        prev.map((est) =>
          est.id === estrategica.id
            ? { ...est, descricao: value }
            : est
        )
      );
    }}
    sx={{
      flex: 1,
      backgroundColor: "transparent",
      marginTop: "10px",
      paddingRight: "10px"
    }}
  />

  <TextField
    label="Data de criação"
    type="date"
    size="small"
    value={estrategica.criacao ? estrategica.criacao : ""}
    InputLabelProps={{ shrink: true }}
    onChange={(e) => {
      const value = e.target.value; // formato: "2025-04-29"
      setEstrategicas((prev) =>
        prev.map((est) =>
          est.id === estrategica.id
            ? { ...est, criacao: value }
            : est
        )
      );
    }}
    sx={{
      paddingRight: "10px",
      width: "180px", // substitui min/maxWidth para manter coerência
      marginTop: "10px",
      '& .MuiInputBase-root': {
        height: "53px",
        alignItems: "center",
      },
    }}
  />

  <TextField
    label="Prazo previsto"
    type="date"
    size="small"
    value={estrategica.finalizacao ? estrategica.finalizacao : ""}
    InputLabelProps={{ shrink: true }}
    onChange={(e) => {
      const value = e.target.value;
      const prazo = normalizarData(value);
      const dataAtual = normalizarData(new Date());
    
      const time = dataAtual <= prazo ? "no prazo" : "atrasada";
    
      setEstrategicas((prev) =>
        prev.map((est) =>
          est.id === estrategica.id
            ? {
                ...est,
                finalizacao: value,
                time: est.status !== "concluida" ? time : est.time,
              }
            : est
        )
      );
    }}  
    sx={{
      width: "180px", // mantido padrão com o outro campo
      marginTop: "10px",
      '& .MuiInputBase-root': {
        height: "53px",
        alignItems: "center",
      },
    }}
  />







  </Box>



  {/*=================================subarea estratégica===================================== */}

{/* subarea estratégica */}
<Box sx={{ flex: 1, minWidth: "300px", marginTop: "15px" }}>
  <Select
    multiple
    displayEmpty
    value={subareasPorIdEstrategica[estrategica.id] || []}
    onChange={(event) =>
      setSubareasPorIdEstrategica((prev) => ({
        ...prev,
        [estrategica.id]: event.target.value,
      }))
    }
    renderValue={(selected) =>
      selected.length === 0
        ? "Selecione as subáreas"
        : selected
            .map(
              (id) =>
                subareas.find((sub) => sub.id === id)?.nome || "Desconhecida"
            )
            .join(", ")
    }
    MenuProps={{
      PaperProps: {
        sx: {
          maxHeight: 260,
          overflowY: "auto",
          borderRadius: 2,
          mt: 0.5,
        },
      },
    }}
    fullWidth
    sx={{
      
      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d6d6d6" },
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d6d6d6" },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#d6d6d6",
        borderWidth: "1px",
      },
      "& .MuiSelect-select": {
        py: 1,
        minHeight: "36px !important",
        display: "flex",
        alignItems: "center",
      },
    }}
  >
    {subareas.map((sub) => (
      <MenuItem
        key={sub.id}
        value={sub.id}
        sx={{
          py: 1,
          px: 1.5,
          borderBottom: "1px solid #f1f1f1",
          gap: 1,
          minHeight: "58px",
          "&:hover": { backgroundColor: "#f8f9fb" },
        }}
      >
        <Checkbox
          checked={(subareasPorIdEstrategica[estrategica.id] || []).includes(
            sub.id
          )}
          sx={{
            color: "#312783",
            p: 0.5,
            "&.Mui-checked": { color: "#312783" },
          }}
        />

        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            backgroundColor: "#eef2ff",
            color: "#312783",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "12px",
            border: "1px solid #dfe3ff",
            flexShrink: 0,
          }}
        >
          {sub.nome?.charAt(0)}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#1f1b5c",
              fontSize: "12px",
              lineHeight: 1.1,
            }}
          >
            {sub.nome}
          </Typography>

          <Typography sx={{ fontSize: "10px", color: "#6b7280", mt: 0.3 }}>
            {sub.areaNome}
          </Typography>
        </Box>
      </MenuItem>
    ))}
  </Select>
</Box>

{/*============================================================================================ */}


            <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              width: "100%",
              marginBottom:"20px"
            }}
          >
  
{/* Áreas */}
  <Box
  sx={{
    marginTop: "17px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "18px 8px",
    px: 2,
    borderRadius: "8px", 
    height: "48px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
  }}
>
  <Typography sx={{ color: estrategica.areaNome ? "#312783" : "#999", fontWeight: 600 }}>
    {estrategica.areaNome || "Área responsável não definida"}
  </Typography>
</Box>



  {/* Unidades */}
  <Box sx={{ flex: 1, minWidth: "300px", marginTop: "10px" }}>
    <fieldset style={{ 
      borderRadius: "8px", 
      borderColor: "#c4c4c4", 
      borderWidth: "1px",
      padding: "18px 8px",
      position: "relative",
      display: "flex",
      alignItems: "center",
      height: "48px"
    }}>
      <legend style={{ 
        color: "#757575", 
        fontSize: "0.75rem", 
        padding: "0 4px",
      }}>
        Unidades
      </legend>

      <Select
        multiple
        displayEmpty
        value={unidadesPorId[estrategica.id] || []}
        onChange={(event) => {
          const value = event.target.value;
          setUnidadesPorId((prev) => ({
            ...prev,
            [estrategica.id]: value,
          }));
        }}
        renderValue={(selected) =>
          selected.length === 0
            ? "Selecione a Unidade"
            : selected
                .map((id) => unidades.find((uni) => uni.id === id)?.nome || "Desconhecida")
                .join(", ")
        }
        fullWidth
        sx={{ 
          backgroundColor: "transparent", 
          border: "none",
          height: "100%",
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '& .MuiSelect-select': {
            padding: "4px",
            display: "flex",
            alignItems: "center",
          }
        }}
      >
        {unidades.map((uni) => (
          <MenuItem key={uni.id} value={uni.id}>
            <Checkbox checked={(unidadesPorId[estrategica.id] || []).includes(uni.id)} />
            <ListItemText primary={uni.nome} />
          </MenuItem>
        ))}
      </Select>
    </fieldset>
  </Box>



  {/* select de resposaveis por estrategicas */}
  <Box sx={{ flex: 1, minWidth: "300px", marginTop: "10px" }}>
    <fieldset style={{ 
      borderRadius: "8px", 
      borderColor: "#c4c4c4", 
      borderWidth: "1px",
      position: "relative",
      maxHeight: "56px"
    }}>
      <legend style={{ 
        color: "#757575", 
        fontSize: "0.70rem", 
        paddingRight: "5px",
        paddingLeft: "5px"
      }}>
        Responsáveis
      </legend>

      <Select
        multiple
        displayEmpty
        value={emailsPorIdEstrategica[estrategica.id] || []}
        onChange={(event) => {
          const selectedEmails = event.target.value;
          setEmailsPorIdEstrategica((prev) => ({
            ...prev,
            [estrategica.id]: selectedEmails,
          }));

          setEstrategicas((prev) =>
            prev.map((est) =>
              est.id === estrategica.id ? { ...est, emails: selectedEmails } : est
            )
          );
        }}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            {selected.map((email) => {
              const user = users.find((u) => u.email === email);
              return (
                <Avatar
                  key={email}
                  src={user?.photoURL}
                  alt={user?.username}
                  sx={{ width: 30, height: 30, border: "2px solid #312783", marginTop:"-16px" }}
                  imgProps={{ referrerPolicy: "no-referrer" }}
                >
                  {!user?.photoURL && user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              );
            })}
          </Box>
        )}
        fullWidth
        sx={{ 
          backgroundColor: "transparent", 
          border: "none",
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          }
        }}
      >
        {users?.map((user) => (
          <MenuItem key={user.id} value={user.email}>
            <Checkbox checked={(emailsPorIdEstrategica[estrategica.id] || []).includes(user.email)} />
            <ListItemAvatar>
              <Avatar
                src={user.photoURL}
                alt={user.username}
                sx={{ width: 32, height: 32, border: "2px solid #312783" }}
                imgProps={{ referrerPolicy: "no-referrer" }}
              >
                {!user.photoURL && user.username.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`${user.username} (${user.email})`} />
          </MenuItem>
        ))}
      </Select>
    </fieldset>
    
  </Box>
                  



          </Box>

          <Box display="flex" alignItems="center" marginBottom="20px">
                <SubdirectoryArrowRightIcon
                  sx={{ fontSize: 30, color: "#00c48c", mr: 1 }}
                />
                <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: "#00c48c", marginTop: 1 }}
                    >
                      Diretriz Tática
                    </Typography>
                  
                  <Box sx={{ flex: 1, minWidth: "250px", maxWidth: "300px", marginLeft: "20px" }}>
                    <Select
                      fullWidth
                      displayEmpty
                      value={areasSelecionadasPorEstrategica[estrategica.id]?.id || ""}
                      onChange={(event) => {
                        const id = event.target.value;
                        const nome = areas.find((area) => area.id === id)?.nome || "";
                        setAreasSelecionadasPorEstrategica((prev) => ({
                          ...prev,
                          [estrategica.id]: { id, nome },
                        }));
                      }}
                      renderValue={(selected) => {
                        if (!selected) {
                          return <em>Selecione Táticas por áreas</em>;
                        }
                        const nome = areas.find((area) => area.id === selected)?.nome;
                        return nome || "Desconhecida";
                      }}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'transparent',
                        },
                        backgroundColor: '#00c48c',
                        borderRadius: '4px',
                        color: "#fff"
                      }}
                    >
                      <MenuItem disabled value="">
                        <em>Selecione Táticas por áreas</em>
                      </MenuItem>
                      {areas.map((area) => (
                        <MenuItem key={area.id} value={area.id}>
                          <ListItemText primary={area.nome} />
                        </MenuItem>
                      ))}
                    </Select>

                  </Box>

              </Box>
              
            

              {/* Form para adicionar Tática dentro da Estratégica */}
              <NovaTaticaForm
                areas={areas} // <-- esta linha é essencial
                onAdd={(titulo, desc, areaId, areaNome) =>
                  handleAddTatica(estrategica.id, titulo, desc, areaId, areaNome)
                }
              />


              

              <Box
                display="flex"
                alignItems="center"
                marginBottom="20px"
                marginTop="30px"
              >
                <ArrowDropDownCircleIcon
                  sx={{ fontSize: 20, color: "#00c48c", mr: 1, marginTop: 1 }}
                />
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "#00c48c", marginTop: 1 }}
                >
                  Diretriz Tática
                </Typography>
              </Box>











  {/* =========================  FIM ESTRATÉGICAS  ================================ */}




























































  {/* =========================  TÁTICAS  ================================ */}

























              {/* Accordion das Táticas */}
              {taticasFiltradas.map((tatica) => (
                <Accordion
                  key={tatica.id}
                  disableGutters
                  sx={{
                    backgroundColor: "transparent",
                    borderRadius: "8px",
                    boxShadow: "none",
                    marginBottom: "10px",
                  }}
                >
                  <AccordionSummary
                    onClick={() => setSelectedTaticaId(tatica.id)} // <-- importante
                    expandIcon={<ExpandMoreIcon sx={{ color: "#b7b7b7" }} />}
                    sx={{
                      borderRadius: "8px",
                      backgroundColor: "#00c48c",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                    }}
                  >




                  
  {/* Bolinha de status visual da Tática */}
    {tatica.finalizacao && (
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 2 }}>
        <Box
          sx={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor:
              tatica.status === "concluida"
                ? (tatica.statusVisual === "no_prazo" ? "#73ff00" : "#ff0000")
                : tatica.time === "no prazo"
                ? "#00ff08"
                : tatica.time === "atrasada"
                ? "#ff0000"
                : "#9ca3af",
          }}
        />
      </Box>
    )}




  <StatusProgresso progresso={calcularProgressoTatica(tatica)} />


                    {/* Cabeçalho da Tática */}
                    <Box sx={{ flex: 1, textAlign: "left" }}>
                      <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                        {tatica.titulo}
                      </Typography>
                      <Typography sx={{ color: "#dddddd", fontSize: "0.9em" }}>
                        {tatica.descricao}
                      </Typography>
                    </Box>

















    {/* Checkbox: Concluída da TÁTICA */}
  {/* Checkbox: Concluída da TÁTICA */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 120 }}>
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={tatica.status === "concluida"}
          onChange={() => {
            const atualizado = estrategicas.map((est) => ({
              ...est,
              taticas: est.taticas.map((t) => {
                if (t.id !== tatica.id) return t;

                const novoStatus = t.status === "concluida" ? "" : "concluida";

                const hoje = new Date();
                const dataAtual = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
                const [ano, mes, dia] = t.finalizacao?.split("-") || [];
                const prazo = new Date(Number(ano), Number(mes) - 1, Number(dia));

                const statusVisual =
                  novoStatus === "concluida" || novoStatus === "andamento"
                    ? dataAtual.getTime() <= prazo.getTime()
                      ? "no_prazo"
                      : "atrasada"
                    : "";

                return {
                  ...t,
                  status: novoStatus,
                  statusVisual,
                };
              }),
            }));

            setEstrategicas(atualizado);
            onUpdate && onUpdate({ estrategicas: atualizado });
          }}
          sx={{
            width: 20,
            height: 20,
            marginLeft: 5,
            color: "#fff",
            "&.Mui-checked": {
              color: "#fff",
            },
            padding: 0,
          }}
        />
      }
      label={
        <Typography sx={{ color: "#fff", fontSize: "0.8rem", marginTop: "5px" }}>
          Concluída
        </Typography>
      }
      onClick={(e) => e.stopPropagation()}
      sx={{ margin: 0, cursor: "pointer" }}
    />
  </Box>

  {/* Checkbox: Em Andamento da TÁTICA */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 130 }}>
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={tatica.status === "andamento"}
          onChange={() => {
            const atualizado = estrategicas.map((est) => ({
              ...est,
              taticas: est.taticas.map((t) => {
                if (t.id !== tatica.id) return t;

                const novoStatus = t.status === "andamento" ? "" : "andamento";

                const hoje = new Date();
                const dataAtual = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
                const [ano, mes, dia] = t.finalizacao?.split("-") || [];
                const prazo = new Date(Number(ano), Number(mes) - 1, Number(dia));

                const statusVisual =
                  novoStatus === "andamento"
                    ? dataAtual.getTime() <= prazo.getTime()
                      ? "no_prazo"
                      : "atrasada"
                    : "";

                return {
                  ...t,
                  status: novoStatus,
                  statusVisual,
                };
              }),
            }));

            setEstrategicas(atualizado);
            onUpdate && onUpdate({ estrategicas: atualizado });
          }}
          sx={{
            width: 20,
            height: 20,
            color: "#fff",
            "&.Mui-checked": {
              color: "#fff",
            },
            padding: 0,
          }}
        />
      }
      label={
        <Typography sx={{ color: "#fff", fontSize: "0.8rem", marginTop: "5px" }}>
          Em Andamento
        </Typography>
      }
      onClick={(e) => e.stopPropagation()}
      sx={{ margin: 0, cursor: "pointer" }}
    />
  </Box>

  {/* Bolinha de status da TÁTICA */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 0.5,
      minWidth: 120,
      justifyContent: "flex-start",
    }}
  >
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor:
          tatica.statusVisual === "no_prazo"
            ? "#00ff08"
            : tatica.statusVisual === "atrasada"
            ? "#ff0000"
            : "#9ca3af",
      }}
    />
    <Typography
      sx={{
        color: "#fff",
        fontSize: "0.8rem",
        whiteSpace: "nowrap",
        marginTop: "4px",
      }}
    >
      {tatica.statusVisual === "no_prazo"
        ? "No prazo"
        : tatica.statusVisual === "atrasada"
        ? "Em atraso"
        : "Não iniciada"}
    </Typography>
  </Box>





    






                    <Button
                      disableRipple
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTatica(estrategica.id, tatica.id); // estrategica.id e tatica.id estão corretos
                      }}
                      sx={{
                        minWidth: "40px",
                        padding: "5px",
                        border: "none",
                        backgroundColor: "transparent",
                        "&:hover": { backgroundColor: "transparent" },
                      }}
                    >
                      <DeleteForeverIcon
                        sx={{ fontSize: 24, color: "#dddddd" }}
                      />
                    </Button>
                  </AccordionSummary>

                  {/* Detalhes: Diretriz Operacional */}
                  <AccordionDetails>



  {/* descrição diretriz taticas */}
  <Box sx={{ display: "flex" }}>
  <TextField
  label="Descrição"
  value={tatica.descricao || ""}
  onChange={(e) => {
    const value = e.target.value;

    setEstrategicas((prev) =>
      prev.map((est) =>
        est.id === estrategica.id
          ? {
              ...est,
              taticas: est.taticas.map((tat) =>
                tat.id === tatica.id
                  ? { ...tat, descricao: value }
                  : tat
              ),
            }
          : est
      )
    );
  }}
  sx={{
    flex: 1,
    backgroundColor: "transparent",
    marginTop: "10px",
    paddingRight: "10px"
  }}
/>


<TextField
  label="Data de criação"
  type="date"
  size="small"
  defaultValue={tatica.criacao || ""}
  InputLabelProps={{ shrink: true }}
  onBlur={(e) => {
    const value = e.target.value;
    const isValid = /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (!isValid) return;

    setEstrategicas((prev) =>
      prev.map((est) =>
        est.id === estrategica.id
          ? {
              ...est,
              taticas: est.taticas.map((tat) =>
                tat.id === tatica.id ? { ...tat, criacao: value } : tat
              ),
            }
          : est
      )
    );
  }}
  sx={{
    width: "180px",
    marginTop: "10px",
    '& .MuiInputBase-root': {
      height: "53px",
      alignItems: "center",
      marginRight: "10px"
    },
  }}
/>







<TextField
  label="Prazo previsto"
  type="date"
  size="small"
  defaultValue={tatica.finalizacao || ""}
  InputLabelProps={{ shrink: true }}
  onBlur={(e) => {
    const value = e.target.value;

    const isValid = /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (!isValid) return;

    const prazo = normalizarData(value);
    const dataAtual = normalizarData(new Date());
    const novoTime = dataAtual <= prazo ? "no prazo" : "atrasada";

    const statusVisualCalculado = tatica.status === "concluida"
      ? tatica.statusVisual
      : calcularStatusVisualPorStatus(tatica.status, value);

    setEstrategicas((prev) =>
      prev.map((est) =>
        est.id === estrategica.id
          ? {
              ...est,
              taticas: est.taticas.map((t) =>
                t.id === tatica.id
                  ? {
                      ...t,
                      finalizacao: value,
                      time: t.status !== "concluida" ? novoTime : t.time,
                      statusVisual: statusVisualCalculado
                    }
                  : t
              ),
            }
          : est
      )
    );
  }}
  sx={{
    width: "180px",
    marginTop: "10px",
    '& .MuiInputBase-root': {
      height: "53px",
      alignItems: "center",
    },
  }}
/>       
  </Box>
        
{/*=================================subarea táticas===================================== */}

{/* subarea tática */}
<Box sx={{ flex: 1, minWidth: "300px", marginTop: "15px" }}>
  <Select
    multiple
    displayEmpty
    value={subareasPorIdTatica[tatica.id] || []}
    onChange={(event) =>
      setSubareasPorIdTatica((prev) => ({
        ...prev,
        [tatica.id]: event.target.value,
      }))
    }
    renderValue={(selected) =>
      selected.length === 0
        ? "Selecione as subáreas"
        : selected
            .map(
              (id) =>
                subareas.find((sub) => sub.id === id)?.nome || "Desconhecida"
            )
            .join(", ")
    }
    MenuProps={{
      PaperProps: {
        sx: {
          maxHeight: 260,
          overflowY: "auto",
          borderRadius: 2,
          mt: 0.5,
        },
      },
    }}
    fullWidth
    sx={{
      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d6d6d6" },
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d6d6d6" },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#d6d6d6",
        borderWidth: "1px",
      },
      "& .MuiSelect-select": {
        py: 1,
        minHeight: "36px !important",
        display: "flex",
        alignItems: "center",
      },
    }}
  >
    {subareas.map((sub) => (
      <MenuItem
        key={sub.id}
        value={sub.id}
        sx={{
          py: 1,
          px: 1.5,
          borderBottom: "1px solid #f1f1f1",
          gap: 1,
          minHeight: "58px",
          "&:hover": { backgroundColor: "#f8f9fb" },
        }}
      >
        <Checkbox
          checked={(subareasPorIdTatica[tatica.id] || []).includes(sub.id)}
          sx={{
            color: "#00c48c",
            p: 0.5,
            "&.Mui-checked": { color: "#00c48c" },
          }}
        />

        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            backgroundColor: "#e6fff6",
            color: "#00c48c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "12px",
            border: "1px solid #c9f7e8",
            flexShrink: 0,
          }}
        >
          {sub.nome?.charAt(0)}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#075f49",
              fontSize: "12px",
              lineHeight: 1.1,
            }}
          >
            {sub.nome}
          </Typography>

          <Typography sx={{ fontSize: "10px", color: "#6b7280", mt: 0.3 }}>
            {sub.areaNome}
          </Typography>
        </Box>
      </MenuItem>
    ))}
  </Select>
</Box>

{/*============================================================================================ */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  marginBottom: "10px",
                  flexWrap: "wrap", // Mantém quebrando no mobile
                }}
              >
  {/* Áreas */}
  <Box sx={{ display: 'flex', gap: 2, width: '100%', marginTop: "10px" }}>
    {/* Áreas */}
    <Box sx={{ flex: 1, minWidth: "300px" }}>

       {/* Áreas */}
  <Box sx={{ flex: 1, minWidth: "300px" }}>
  <Box
  sx={{
    marginTop: "8px",
    width: "100%",
    minHeight: "47px",
    display: "flex",
    alignItems: "center",
    px: 2,
    borderRadius: "8px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
  }}
>
  <Typography
    sx={{
      color: tatica.areaNome ? "#00c48c" : "#999",
      fontWeight: 600,
    }}
  >
    {tatica.areaNome || "Área responsável não definida"}
  </Typography>
</Box>
</Box>
    
  </Box>


    {/* Unidades */}
    <Box sx={{ flex: 1, minWidth: "300px" }}>
    <fieldset style={{ 
      borderRadius: "8px", 
      borderColor: "#c4c4c4", 
      borderWidth: "1px",
      padding: "18px 8px",
      position: "relative",
      display: "flex",
      alignItems: "center",
      height: "48px"
    }}>
      <legend style={{ 
        color: "#757575", 
        fontSize: "0.75rem", 
        padding: "0 4px",
      }}>
        Unidades
      </legend>

      <Select
        multiple
        value={unidadesTaticasPorId[tatica.id] || []}
        onChange={(event) => {
          const value = event.target.value;
          setUnidadesTaticasPorId((prev) => ({
            ...prev,
            [tatica.id]: value,
          }));
        }}
        displayEmpty
        fullWidth
        sx={{ 
          backgroundColor: "transparent", 
          border: "none",
          height: "100%",
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '& .MuiSelect-select': {
            padding: "4px",
            display: "flex",
            alignItems: "center",
          }
        }}
        renderValue={(selected) =>
          selected.length === 0
            ? <span style={{ color: "#757575", fontSize: "0.85rem" }}>Selecione a Unidade</span>
            : selected
                .map((id) => unidades.find((uni) => uni.id === id)?.nome || 'Desconhecida')
                .join(', ')
        }
      >
        {unidades.map((uni) => (
          <MenuItem key={uni.id} value={uni.id}>
            <Checkbox checked={(unidadesTaticasPorId[tatica.id] || []).includes(uni.id)} />
            <ListItemText primary={uni.nome} />
          </MenuItem>
        ))}
      </Select>
    </fieldset>
  </Box>


    {/* responsaveis por diretrizes taticas */}
    <Box sx={{ flex: 1, minWidth: "200px" }}>
    <fieldset style={{ 
      borderRadius: "8px", 
      borderColor: "#c4c4c4", 
      borderWidth: "1px",
      padding: "18px 8px",
      position: "relative",
      display: "flex",
      alignItems: "center",
      height: "48px"
    }}>
      <legend style={{ 
        color: "#757575", 
        fontSize: "0.75rem", 
        padding: "0 4px"
      }}>
        Responsáveis
      </legend>

      <Select
        multiple
        displayEmpty
        value={emailsPorIdTatica[tatica.id] || []}
        onChange={(event) => {
          const selectedEmails = event.target.value;

          setEmailsPorIdTatica((prev) => ({
            ...prev,
            [tatica.id]: selectedEmails,
          }));

          setEstrategicas((prev) =>
            prev.map((est) => ({
              ...est,
              taticas: est.taticas.map((t) =>
                t.id === tatica.id
                  ? { ...t, emails: selectedEmails }
                  : t
              ),
            }))
          );
        }}
        fullWidth
        sx={{
          backgroundColor: "transparent",
          border: "none",
          height: "100%",
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none'
          },
          '& .MuiSelect-select': {
            padding: "4px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexWrap: "wrap",
          }
        }}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            {selected.length === 0 ? (
              <span style={{ color: "#757575", fontSize: "0.85rem" }}>
                Selecione os responsáveis
              </span>
            ) : (
              selected.map((email) => {
                const user = users.find((u) => u.email === email);
                return (
                  <Avatar
                    key={email}
                    src={user?.photoURL}
                    alt={user?.username}
                    sx={{ width: 30, height: 30, border: "2px solid #312783" }}
                    imgProps={{ referrerPolicy: "no-referrer" }}
                  >
                    {!user?.photoURL && user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                );
              })
            )}
          </Box>
        )}
      >
        {users?.map((user) => (
          <MenuItem key={user.id} value={user.email}>
            <Checkbox
              checked={(emailsPorIdTatica[tatica.id] || []).includes(user.email)}
            />
            <ListItemAvatar>
              <Avatar
                src={user.photoURL}
                alt={user.username}
                sx={{ width: 32, height: 32, border: "2px solid #312783" }}
                imgProps={{ referrerPolicy: "no-referrer" }}
              >
                {!user.photoURL && user.username.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`${user.username} (${user.email})`} />
          </MenuItem>
        ))}
      </Select>
    </fieldset>
  </Box>

  </Box>

              </Box>
              
                    <Box display="flex" alignItems="center" marginBottom="20px">
                      <SubdirectoryArrowRightIcon
                        sx={{ fontSize: 30, color: "#f44336", mr: 1 }}
                      />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "#ef6b62", marginTop: 1 }}
                      >
                        Diretriz Operacional
                      </Typography>


                      {/* ============================ FILTRO OPERACIONAL ============================ */}

                    <Box sx={{ flex: 1, minWidth: "250px", maxWidth: "300px", marginLeft: "20px" }}>
                      <Select
                        fullWidth
                        displayEmpty
                        value={areasSelecionadasOperacionalPorTatica[tatica.id]?.id || ""}
                        onChange={(event) => {
                          const id = event.target.value;
                          const nome = areas.find((area) => area.id === id)?.nome || "";

                          setAreasSelecionadasOperacionalPorTatica((prev) => ({
                            ...prev,
                            [tatica.id]: { id, nome },
                          }));
                        }}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <em>Selecione Operacionais por áreas</em>;
                          }

                          const nome = areas.find((area) => area.id === selected)?.nome;
                          return nome || "Desconhecida";
                        }}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "transparent",
                          },
                          backgroundColor: "#f44336",
                          borderRadius: "4px",
                          color: "#fff",
                        }}
                      >
                        <MenuItem disabled value="">
                          <em>Selecione Operacionais por áreas</em>
                        </MenuItem>

                        {areas.map((area) => (
                          <MenuItem key={area.id} value={area.id}>
                            <ListItemText primary={area.nome} />
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                   {/* ========================================================================= */}
                    </Box>

                    

                    {/* Form para adicionar Operacional */}
                    <NovaOperacionalForm
                      areas={areas}
                      onAdd={(titulo, desc, areaId, areaNome) =>
                        handleAddOperacional(
                          estrategica.id,
                          tatica.id,
                          titulo,
                          desc,
                          areaId,
                          areaNome
                        )
                      }
                    />

                  

                    <Box
                      display="flex"
                      alignItems="center"
                      marginBottom="20px"
                      marginTop="30px"
                    >
                      <ArrowDropDownCircleIcon
                        sx={{
                          fontSize: 20,
                          color: "#f44336",
                          mr: 1,
                          marginTop: 1,
                        }}
                      />
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "#ef6b62", marginTop: 1 }}
                      >
                        Diretriz Operacional
                      </Typography>
                    </Box>










  {/* =========================  FIM TÁTICAS  ================================ */}





























































                  {/* =========================  OPERACIONAIS  ================================ */}







                    

                    {/* Lista de Operacionais */}
                    {(tatica.operacionais || [])
                      .filter((operacional) => {
                        const areaSelecionada =
                          areasSelecionadasOperacionalPorTatica[tatica.id]?.nome;

                        if (!areaSelecionada) return false;

                        return operacional.areaNome === areaSelecionada;
                      })
                      .map((operacional) => (
                      <Accordion
                        key={operacional.id}
                        disableGutters
                        sx={{
                          backgroundColor: "transparent",
                          borderRadius: "8px",
                          boxShadow: "none",
                          marginBottom: "10px",
                        }}
                      >
                        <AccordionSummary
                          expandIcon={
                            <ExpandMoreIcon sx={{ color: "#b7b7b7" }} />
                          }
                          sx={{
                            borderRadius: "8px",
                            backgroundColor: "#f44336",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                          }}
                        >




  {/* Bolinha de status visual da Operacional */}
  {operacional.finalizacao && (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 2 }}>
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          backgroundColor:
            operacional.status === "concluida"
              ? operacional.statusVisual === "no_prazo"
                ? "#00ff08"
                : "#ff0000"
              : operacional.time === "no prazo"
              ? "#00ff08"
              : operacional.time === "atrasada"
              ? "#ff0000"
              : "#9ca3af",
        }}
      />
    </Box>
  )}





                          <StatusProgresso
                            progresso={calcularProgressoOperacional(
                              estrategicas
                                .flatMap((est) => est.taticas)
                                .flatMap((tat) => tat.operacionais)
                                .find((op) => op.id === operacional.id) || operacional
                            )}
                          />



                          {/* Cabeçalho da Operacional */}
                          <Box sx={{ flex: 1, textAlign: "left" }}>
                            <Typography fontWeight="bold" sx={{ color: "#fff" }}>
                              {operacional.titulo}
                            </Typography>
                            <Typography
                              sx={{ color: "#dddddd", fontSize: "0.9em" }}
                            >
                              {operacional.descricao}
                            </Typography>
                          </Box>







                          




  {/* Checkbox: Concluída da OPERACIONAL */}
  {/* Checkbox: Concluída da OPERACIONAL */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 1 }}>
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={operacional.status === "concluida"}
          onChange={() => {
            const atualizado = estrategicas.map((estrategica) => ({
              ...estrategica,
              taticas: estrategica.taticas.map((tatica) => ({
                ...tatica,
                operacionais: tatica.operacionais.map((op) => {
                  if (op.id !== operacional.id) return op;

                  const novoStatus = op.status === "concluida" ? "" : "concluida";

                  const hoje = new Date();
                  const dataAtual = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
                  const [ano, mes, dia] = op?.finalizacao?.split("-") || [];
                  const prazo = new Date(Number(ano), Number(mes) - 1, Number(dia));

                  const statusVisual =
                    novoStatus === "concluida" || novoStatus === "andamento"
                      ? dataAtual.getTime() <= prazo.getTime()
                        ? "no_prazo"
                        : "atrasada"
                      : "";

                  return {
                    ...op,
                    status: novoStatus,
                    statusVisual,
                  };
                }),
              })),
            }));

            setEstrategicas(atualizado);
            onUpdate && onUpdate({ estrategicas: atualizado });
          }}
          sx={{
            width: 20,
            height: 20,
            marginLeft: 1,
            color: "#ffffff",
            "&.Mui-checked": {
              color: "#ffffff",
            },
            padding: 0,
          }}
        />
      }
      label={
        <Typography sx={{ color: "#ffffff", fontSize: "0.8rem", marginTop: "5px" }}>
          Concluída
        </Typography>
      }
      onClick={(e) => e.stopPropagation()}
      sx={{ margin: 0, cursor: "pointer" }}
    />
  </Box>

  {/* Checkbox: Em Andamento da OPERACIONAL */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 130 }}>
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={operacional.status === "andamento"}
          onChange={() => {
            const atualizado = estrategicas.map((estrategica) => ({
              ...estrategica,
              taticas: estrategica.taticas.map((tatica) => ({
                ...tatica,
                operacionais: tatica.operacionais.map((op) => {
                  if (op.id !== operacional.id) return op;

                  const novoStatus = op.status === "andamento" ? "" : "andamento";

                  const hoje = new Date();
                  const dataAtual = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
                  const [ano, mes, dia] = op?.finalizacao?.split("-") || [];
                  const prazo = new Date(Number(ano), Number(mes) - 1, Number(dia));

                  const statusVisual =
                    novoStatus === "concluida" || novoStatus === "andamento"
                      ? dataAtual.getTime() <= prazo.getTime()
                        ? "no_prazo"
                        : "atrasada"
                      : "";

                  return {
                    ...op,
                    status: novoStatus,
                    statusVisual,
                  };
                }),
              })),
            }));

            setEstrategicas(atualizado);
            onUpdate && onUpdate({ estrategicas: atualizado });
          }}
          sx={{
            width: 20,
            height: 20,
            color: "#ffffff",
            "&.Mui-checked": {
              color: "#ffffff",
            },
            padding: 0,
          }}
        />
      }
      label={
        <Typography sx={{ color: "#ffffff", fontSize: "0.8rem", marginTop: "5px" }}>
          Em Andamento
        </Typography>
      }
      onClick={(e) => e.stopPropagation()}
      sx={{ margin: 0, cursor: "pointer" }}
    />
  </Box>

  {/* Bolinha de status da OPERACIONAL */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 0.5,
      minWidth: 120,
      justifyContent: "flex-start",
    }}
  >
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor:
          operacional.statusVisual === "no_prazo"
            ? "#00ff08"
            : operacional.statusVisual === "atrasada"
            ? "#ff1000"
            : "#9ca3af",
      }}
    />
    <Typography
      sx={{
        color: "#ffffff",
        fontSize: "0.8rem",
        whiteSpace: "nowrap",
        marginTop: "4px",
      }}
    >
      {operacional.statusVisual === "no_prazo"
        ? "No prazo"
        : operacional.statusVisual === "atrasada"
        ? "Em atraso"
        : "Não iniciada"}
    </Typography>
  </Box>




























                        <Button
                          disableRipple
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveOperacional(
                              estrategica.id,
                              tatica.id,
                              operacional.id
                            );
                          }}
                          sx={{
                            minWidth: "40px",
                            padding: "5px",
                            border: "none",
                            backgroundColor: "transparent",
                            "&:hover": { backgroundColor: "transparent" },
                          }}
                        >
                          <DeleteForeverIcon
                            sx={{ fontSize: 24, color: "#dddddd" }}
                          />
                        </Button>
                      </AccordionSummary>

                      

                      {/* Detalhes (tarefas, 5W2H) */}
                      <AccordionDetails>

<Box sx={{ display: "flex" }}>
<TextField
  label="Descrição da Operacional"
  value={operacional.descricao || ""}
  onChange={(e) => {
    const value = e.target.value;

    setEstrategicas((prev) =>
      prev.map((est) =>
        est.id === estrategica.id
          ? {
              ...est,
              taticas: est.taticas.map((tat) =>
                tat.id === tatica.id
                  ? {
                      ...tat,
                      operacionais: tat.operacionais.map((op) =>
                        op.id === operacional.id
                          ? { ...op, descricao: value }
                          : op
                      ),
                    }
                  : tat
              ),
            }
          : est
      )
    );
  }}
  sx={{
    flex: 1,
    backgroundColor: "transparent",
    marginTop: "10px",
    marginRight: "10px"
  }}
/>


<TextField
  label="Data de criação"
  type="date"
  size="small"
  defaultValue={operacional.criacao || ""}
  InputLabelProps={{ shrink: true }}
  onBlur={(e) => {
    const value = e.target.value;
    const isValid = /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (!isValid) return;

    const atualizado = estrategicas.map((est) => ({
      ...est,
      taticas: est.taticas.map((tat) => ({
        ...tat,
        operacionais: tat.operacionais.map((op) =>
          op.id === operacional.id ? { ...op, criacao: value } : op
        ),
      })),
    }));

    setEstrategicas(atualizado);
    onUpdate && onUpdate({ estrategicas: atualizado });
  }}
  sx={{
    width: "180px",
    marginTop: "10px",
    '& .MuiInputBase-root': {
      height: "53px",
      alignItems: "center",
      marginRight: "10px"
    },
  }}
/>





<TextField
  label="Prazo previsto"
  type="date"
  size="small"
  defaultValue={operacional.finalizacao || ""}
  InputLabelProps={{ shrink: true }}
  onBlur={(e) => {
    const value = e.target.value;
    const isValid = /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (!isValid) return;

    const prazo = normalizarData(value);
    const dataAtual = normalizarData(new Date());
    const novoTime = dataAtual <= prazo ? "no prazo" : "atrasada";

    const statusVisualCalculado = operacional.status === "concluida"
      ? operacional.statusVisual
      : calcularStatusVisualPorStatus(operacional.status, value);

    const atualizado = estrategicas.map((est) => ({
      ...est,
      taticas: est.taticas.map((tat) => ({
        ...tat,
        operacionais: tat.operacionais.map((op) =>
          op.id === operacional.id
            ? {
                ...op,
                finalizacao: value,
                time: op.status !== "concluida" ? novoTime : op.time,
                statusVisual: statusVisualCalculado,
              }
            : op
        ),
      })),
    }));

    setEstrategicas(atualizado);
    onUpdate && onUpdate({ estrategicas: atualizado });
  }}
  sx={{
    width: "180px",
    marginTop: "10px",
    '& .MuiInputBase-root': {
      height: "53px",
      alignItems: "center",
    },
  }}
/>

</Box>


{/*=================================subarea operacionais===================================== */}

{/* subarea operacional */}
<Box sx={{ flex: 1, minWidth: "300px", marginTop: "15px" }}>
  <Select
    multiple
    displayEmpty
    value={subareasPorIdOperacional[operacional.id] || []}
    onChange={(event) =>
      setSubareasPorIdOperacional((prev) => ({
        ...prev,
        [operacional.id]: event.target.value,
      }))
    }
    renderValue={(selected) =>
      selected.length === 0
        ? "Selecione as subáreas"
        : selected
            .map(
              (id) =>
                subareas.find((sub) => sub.id === id)?.nome || "Desconhecida"
            )
            .join(", ")
    }
    MenuProps={{
      PaperProps: {
        sx: {
          maxHeight: 260,
          overflowY: "auto",
          borderRadius: 2,
          mt: 0.5,
        },
      },
    }}
    fullWidth
    sx={{
      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d6d6d6" },
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d6d6d6" },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#d6d6d6",
        borderWidth: "1px",
      },
      "& .MuiSelect-select": {
        py: 1,
        minHeight: "36px !important",
        display: "flex",
        alignItems: "center",
      },
    }}
  >
    {subareas.map((sub) => (
      <MenuItem
        key={sub.id}
        value={sub.id}
        sx={{
          py: 1,
          px: 1.5,
          borderBottom: "1px solid #f1f1f1",
          gap: 1,
          minHeight: "58px",
          "&:hover": { backgroundColor: "#f8f9fb" },
        }}
      >
        <Checkbox
          checked={(subareasPorIdOperacional[operacional.id] || []).includes(
            sub.id
          )}
          sx={{
            color: "#f44336",
            p: 0.5,
            "&.Mui-checked": { color: "#f44336" },
          }}
        />

        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            backgroundColor: "#fff1f0",
            color: "#f44336",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: "12px",
            border: "1px solid #ffd6d2",
            flexShrink: 0,
          }}
        >
          {sub.nome?.charAt(0)}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Typography
            sx={{
              fontWeight: 700,
              color: "#7f1d1d",
              fontSize: "12px",
              lineHeight: 1.1,
            }}
          >
            {sub.nome}
          </Typography>

          <Typography sx={{ fontSize: "10px", color: "#6b7280", mt: 0.3 }}>
            {sub.areaNome}
          </Typography>
        </Box>
      </MenuItem>
    ))}
  </Select>
</Box>

{/*============================================================================================ */}


                        

<Box
  sx={{
    display: "flex",
    width: "100%",
    marginTop: "10px",
    gap: 2,
    marginBottom: "10px",
  }}
>
       {/* Áreas */}
  <Box sx={{ flex: 1, minWidth: "300px" }}>
  <Box
  sx={{
    marginTop: "8px",
    width: "100%",
    minHeight: "47px",
    display: "flex",
    alignItems: "center",
    px: 2,
    borderRadius: "8px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
  }}
>
  <Typography
    sx={{
      color: operacional.areaNome ? "#f44336" : "#999",
      fontWeight: 600,
    }}
  >
    {operacional.areaNome || "Área responsável não definida"}
  </Typography>
</Box>
</Box>

  {/* Unidades */}
  <Box sx={{ flex: 1, minWidth: "200px" }}>
    <fieldset style={{
      borderRadius: "8px",
      borderColor: "#c4c4c4",
      borderWidth: "1px",
      padding: "18px 8px",
      position: "relative",
      display: "flex",
      alignItems: "center",
      height: "48px",
      width: "100%",
    }}>
      <legend style={{
        color: "#757575",
        fontSize: "0.75rem",
        padding: "0 4px"
      }}>
        Unidades
      </legend>

      <Select
        multiple
        fullWidth
        displayEmpty
        value={unidadesPorIdOperacional[operacional.id] || []}
        onChange={(event) => {
          const value = event.target.value;
          setUnidadesPorIdOperacional((prev) => ({
            ...prev,
            [operacional.id]: value,
          }));
        }}
        sx={{
          backgroundColor: "transparent",
          border: "none",
          height: "100%",
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          '& .MuiSelect-select': {
            padding: "4px",
            display: "flex",
            alignItems: "center",
          }
        }}
        renderValue={(selected) =>
          selected.length === 0
            ? <span style={{ color: "#757575", fontSize: "0.85rem" }}>Selecione a Unidade</span>
            : selected.map((id) => unidades.find((uni) => uni.id === id)?.nome || 'Desconhecida').join(', ')
        }
      >
        {unidades.map((uni) => (
          <MenuItem key={uni.id} value={uni.id}>
            <Checkbox checked={(unidadesPorIdOperacional[operacional.id] || []).includes(uni.id)} />
            <ListItemText primary={uni.nome} />
          </MenuItem>
        ))}
      </Select>
    </fieldset>
  </Box>

  {/* Responsáveis */}
  <Box sx={{ flex: 1, minWidth: "200px" }}>
    <fieldset style={{
      borderRadius: "8px",
      borderColor: "#c4c4c4",
      borderWidth: "1px",
      padding: "18px 8px",
      position: "relative",
      display: "flex",
      alignItems: "center",
      height: "48px",
      width: "100%",
    }}>
      <legend style={{
        color: "#757575",
        fontSize: "0.75rem",
        padding: "0 4px"
      }}>
        Responsáveis
      </legend>

      <Select
        multiple
        fullWidth
        displayEmpty
        value={
          Array.isArray(emailsPorIdOperacional[operacional.id])
            ? emailsPorIdOperacional[operacional.id]
            : typeof emailsPorIdOperacional[operacional.id] === "string"
            ? emailsPorIdOperacional[operacional.id].split(",").map(e => e.trim()).filter(Boolean)
            : []
        }
        onChange={(event) => {
          const selectedEmails = event.target.value;
          setEmailsPorIdOperacional((prev) => ({
            ...prev,
            [operacional.id]: selectedEmails,
          }));
        }}
        sx={{
          backgroundColor: "transparent",
          border: "none",
          height: "100%",
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          '& .MuiSelect-select': {
            padding: "4px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            flexWrap: "wrap",
          }
        }}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            {selected.length === 0 ? (
              <span style={{ color: "#757575", fontSize: "0.85rem" }}>
                Selecione os responsáveis
              </span>
            ) : (
              selected.map((email) => {
                const user = users.find((u) => u.email === email);
                return (
                  <Avatar
                    key={email}
                    src={user?.photoURL}
                    alt={user?.username}
                    sx={{ width: 30, height: 30, border: "2px solid #312783" }}
                    imgProps={{ referrerPolicy: "no-referrer" }}
                  >
                    {!user?.photoURL && user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                );
              })
            )}
          </Box>
        )}
      >
        {users?.map((user) => (
          <MenuItem key={user.id} value={user.email}>
            <Checkbox checked={(emailsPorIdOperacional[operacional.id] || []).includes(user.email)} />
            <ListItemAvatar>
              <Avatar
                src={user.photoURL}
                alt={user.username}
                sx={{ width: 32, height: 32, border: "2px solid #312783" }}
                imgProps={{ referrerPolicy: "no-referrer" }}
              >
                {!user.photoURL && user.username.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`${user.username} (${user.email})`} />
          </MenuItem>
        ))}
      </Select>
    </fieldset>
  </Box>
</Box>


                        <Box>
                          {/* 🔹 Campo para adicionar nova tarefa */}
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              marginBottom: "20px",
                              marginTop: "20px",
                            }}
                          >
                            <TextField
                              label="Nome do Plano de ação..."
                              value={novaTarefa}
                              onChange={(e) => setNovaTarefa(e.target.value)}
                              fullWidth
                            />
                            <Button
                              onClick={() =>
                                handleAddTarefa(
                                  estrategica.id,
                                  tatica.id,
                                  operacional.id,
                                  novaTarefa
                                )
                              }
                              sx={{ minWidth: "40px" }}
                            >
                              <AddCircleOutlineIcon
                                sx={{ fontSize: 25, color: "#f44336" }}
                              />
                            </Button>
                          </Box>

                          {/* 🔹 Exibir as tarefas já adicionadas */}

                          {operacional.tarefas.length > 0 && (
                            <List>
                              {operacional.tarefas.map((tarefa) => (
                                <Accordion
                                  key={tarefa.id}
                                  sx={{
                                    backgroundColor: "#fff",
                                    marginBottom: "8px",
                                    borderRadius: "8px",
                                  }}
                                >
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{ backgroundColor: "#f9f9f9" }}
                                  >


{/* Bolinha de status visual da Tarefa */}
{tarefa.finalizacao && (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mr: 2 }}>
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor:
          tarefa.status === "concluida"
            ? tarefa.statusVisual === "no_prazo"
              ? "#00ff08"
              : "#ff0000"
            : tarefa.time === "no prazo"
            ? "#00ff08"
            : tarefa.time === "atrasada"
            ? "#ff0000"
            : "#9ca3af",
      }}
    />
  </Box>
)}

                                    <TextField
                                      variant="standard"
                                      value={tarefa.tituloTarefa}
                                      onChange={(e) => handleEditTarefa(tarefa.id, "tituloTarefa", e.target.value)}
                                      InputProps={{
                                        disableUnderline: true,
                                        sx: {
                                          fontWeight: "bold",
                                          color: "#f44336",
                                          flex: 1,
                                          fontSize: "1rem",
                                        },
                                      }}
                                      fullWidth
                                    />


                                    {/* 🔹 Botão de deletar */}
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation(); // Impede que o Accordion abra/feche
                                        handleRemoveTarefa(
                                          estrategica.id,
                                          tatica.id,
                                          operacional.id,
                                          tarefa.id
                                        );
                                      }}
                                      sx={{
                                        color: "#dc2626",
                                        minWidth: "40px",
                                        padding: "5px",
                                        backgroundColor: "transparent",
                                        "&:hover": {
                                          backgroundColor: "transparent",
                                        },
                                      }}
                                    >
                                      <DeleteForeverIcon
                                        sx={{ fontSize: 24 }}
                                      />
                                    </Button>
                                  </AccordionSummary>

                                  {/* 🔹 Detalhes do Accordion (Plano de Ação - 5W2H) */}

                                  <AccordionDetails>
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      mb={1}
                                      sx={{
                                        marginBottom: "20px",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <PlayCircleFilledWhiteIcon
                                        sx={{
                                          color: "#f44336",
                                          fontSize: 25,
                                          marginRight: 1,
                                        }}
                                      />
                                      <Typography variant="h6">
                                        Plano de Ação (5W2H)
                                      </Typography>
                                    </Box>



 <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 5, justifyContent: "flex-end" }}>
 
 
 
 
 {/**logicas dos checkbox  */}
 
 <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5, mr: 0.5 }}>
  {/* Checkbox: Concluída */}
  <Box sx={{ display: "flex", alignItems: "center", minWidth: 120 }}>
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={tarefa.status === "concluida"}
          onChange={() => {
            const novoStatus = tarefa.status === "concluida" ? "" : "concluida";
          
            // Comparar data atual com tarefa.finalizacao
            const hoje = new Date();
            const dataAtual = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
          
            const [ano, mes, dia] = tarefa?.finalizacao?.split("-") || [];
            const prazo = new Date(Number(ano), Number(mes) - 1, Number(dia));
          
            const statusVisual = novoStatus === "concluida"
              ? dataAtual <= prazo ? "no_prazo" : "atrasada"
              : "";
          
            handleEditTarefa(tarefa.id, "status", novoStatus);
            handleEditTarefa(tarefa.id, "statusVisual", statusVisual);
          }}                   
          sx={{
            width: 20,
            height: 20,
            color: "#888888",
            "&.Mui-checked": { color: "#888888" },
            padding: 0,
          }}
        />
      }
      label={
        <Typography sx={{ color: "#888888", fontSize: "0.8rem", marginTop: "5px" }}>
          Concluída
        </Typography>
      }
      onClick={(e) => e.stopPropagation()}
      sx={{ margin: 0, cursor: "pointer" }}
    />
  </Box>

  {/* Checkbox: Em Andamento */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 130 }}>
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={tarefa.status === "andamento"}
          onChange={() => {
            const novoStatus = tarefa.status === "andamento" ? "" : "andamento";
          
            const hoje = new Date();
            const dataAtual = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
            const [ano, mes, dia] = tarefa?.finalizacao?.split("-") || [];
            const prazo = new Date(Number(ano), Number(mes) - 1, Number(dia));
          
            const statusVisual =
              novoStatus === "andamento"
                ? dataAtual <= prazo
                  ? "no_prazo"
                  : "atrasada"
                : "";
          
            handleEditTarefa(tarefa.id, "status", novoStatus);
            handleEditTarefa(tarefa.id, "statusVisual", statusVisual);
          }}          
          sx={{
            width: 20,
            height: 20,
            color: "#888888",
            "&.Mui-checked": { color: "#888888" },
            padding: 0,
          }}
        />
      }
      label={
        <Typography sx={{ color: "#888888", fontSize: "0.8rem", marginTop: "5px" }}>
          Em Andamento
        </Typography>
      }
      onClick={(e) => e.stopPropagation()}
      sx={{ margin: 0, cursor: "pointer" }}
    />
  </Box>

  {/* Bolinha de statusVisual */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 0.5,
      minWidth: 120,
      justifyContent: "flex-start",
    }}
  >
    <Box
      sx={{
        width: 14,
        height: 14,
        borderRadius: "50%",
        backgroundColor:
          tarefa.statusVisual === "no_prazo"
            ? "#00ff08"
            : tarefa.statusVisual === "atrasada"
            ? "#ff0000"
            : "#9ca3af",
      }}
    />
    <Typography
      sx={{
        color: "#888888",
        fontSize: "0.8rem",
        whiteSpace: "nowrap",
        marginTop: "4px",
      }}
    >
      {tarefa.statusVisual === "no_prazo"
        ? "No prazo"
        : tarefa.statusVisual === "atrasada"
        ? "Em atraso"
        : "Não iniciada"}
    </Typography>
  </Box>
</Box>
















<TextField
  label="Data de criação"
  type="date"
  size="small"
  defaultValue={tarefa.criacao || ""}
  InputLabelProps={{ shrink: true }}
  onBlur={(e) => {
    const value = e.target.value;
    const isValid = /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (!isValid) return;

    handleEditTarefa(tarefa.id, "criacao", value);
    onUpdate && onUpdate({ estrategicas });
  }}
  sx={{
    width: "180px",
    marginTop: "10px",
    '& .MuiInputBase-root': {
      height: "53px",
      alignItems: "center",
    },
  }}
/>





<TextField
  label="Prazo previsto"
  type="date"
  size="small"
  defaultValue={tarefa.finalizacao || ""}
  InputLabelProps={{ shrink: true }}
  onBlur={(e) => {
    const value = e.target.value;
    const isValid = /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (!isValid) return;

    const prazo = normalizarData(value);
    const dataAtual = normalizarData(new Date());
    const novoTime = dataAtual <= prazo ? "no prazo" : "atrasada";

    const statusVisualCalculado = tarefa.status === "concluida"
      ? tarefa.statusVisual
      : calcularStatusVisualPorStatus(tarefa.status, value);

    const atualizado = estrategicas.map((est) => ({
      ...est,
      taticas: est.taticas.map((tat) => ({
        ...tat,
        operacionais: tat.operacionais.map((op) => ({
          ...op,
          tarefas: op.tarefas.map((t) =>
            t.id === tarefa.id
              ? {
                  ...t,
                  finalizacao: value,
                  time: t.status !== "concluida" ? novoTime : t.time,
                  statusVisual: statusVisualCalculado,
                }
              : t
          ),
        })),
      })),
    }));

    setEstrategicas(atualizado);
    onUpdate && onUpdate({ estrategicas: atualizado });
  }}
  sx={{
    width: "180px",
    marginTop: "10px",
    '& .MuiInputBase-root': {
      height: "53px",
      alignItems: "center",
    },
  }}
/>










</Box>



                                    {/* 🔹 Campos do 5W2H */}

                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                      }}
                                    >
                                      <TextField
                                        label="O que?"
                                        value={tarefa.planoDeAcao?.oQue ?? ""}
                                        onChange={(e) =>
                                          handleEditTarefa(
                                            tarefa.id,
                                            "oQue",
                                            e.target.value
                                          )
                                        }
                                      />

                                      <TextField
                                        label="Por que?"
                                        value={tarefa.planoDeAcao.porQue ?? ""}
                                        onChange={(e) =>
                                          handleEditTarefa(
                                            tarefa.id,
                                            "porQue",
                                            e.target.value
                                          )
                                        }
                                      />

                                      {/* 🔹 Campo "Quem" com múltipla seleção */}
                                      <Select
                                        multiple
                                        value={tarefa.planoDeAcao.quem ?? []}
                                        onChange={(event) =>
                                          handleEditTarefa(
                                            tarefa.id,
                                            "quem",
                                            event.target.value
                                          )
                                        }
                                        displayEmpty
                                        sx={{
                                          minWidth: "200px",
                                          backgroundColor: "#fff",
                                        }}
                                        renderValue={(selected) =>
                                          selected.length === 0
                                            ? "Quem..."
                                            : selected
                                                .map(
                                                  (id) =>
                                                    users?.find(
                                                      (user) => user.id === id
                                                    )?.username ||
                                                    "Desconhecido"
                                                )
                                                .join(", ")
                                        }
                                      >
                                        {users?.map((user) => (
                                          <MenuItem
                                            key={user.id}
                                            value={user.id}
                                          >
                                            <Checkbox
                                              checked={
                                                tarefa.planoDeAcao.quem?.includes(
                                                  user.id
                                                ) || false
                                              }
                                            />
                                            <ListItemText
                                              primary={user.username}
                                            />
                                          </MenuItem>
                                        ))}
                                      </Select>
                                      <TextField
                                        label="E-mail dos responsáveis"
                                        name="quemEmail" // Nome associado ao estado para o e-mail do solicitante
                                        value={
                                          tarefa.planoDeAcao.quemEmail ?? []
                                        }
                                        onChange={(e) =>
                                          handleEditTarefa(
                                            tarefa.id,
                                            "quemEmail",
                                            e.target.value
                                          )
                                        }
                                      />

                                      <TextField
                                        label="Quando?"
                                        value={tarefa.planoDeAcao.quando ?? ""}
                                        onChange={(e) =>
                                          handleEditTarefa(
                                            tarefa.id,
                                            "quando",
                                            e.target.value
                                          )
                                        }
                                      />
                                      <TextField
                                        label="Onde?"
                                        value={tarefa.planoDeAcao.onde ?? ""}
                                        onChange={(e) =>
                                          handleEditTarefa(
                                            tarefa.id,
                                            "onde",
                                            e.target.value
                                          )
                                        }
                                      />
                                      <TextField
                                        label="Como?"
                                        value={tarefa.planoDeAcao.como ?? ""}
                                        onChange={(e) =>
                                          handleEditTarefa(
                                            tarefa.id,
                                            "como",
                                            e.target.value
                                          )
                                        }
                                      />

                                      {/* 🔹 Campo Valor Formatado */}
                                      <TextField
                                        label="Valor"
                                        value={tarefa.planoDeAcao.valor ?? ""}
                                        onChange={(e) => {
                                          const rawValue =
                                            e.target.value.replace(/\D/g, "");
                                          const formattedValue =
                                            new Intl.NumberFormat("pt-BR", {
                                              style: "currency",
                                              currency: "BRL",
                                            }).format(Number(rawValue) / 100);
                                          handleEditTarefa(
                                            tarefa.id,
                                            "valor",
                                            formattedValue
                                          );
                                        }}
                                      />

                                      {/* 🔹 Upload de arquivos da tarefa */}
<Box
  sx={{
    mt: 2,
    display: "grid",
    gridTemplateColumns: { xs: "1fr", md: "360px minmax(0, 1fr)" },
    gap: 2,
    alignItems: "flex-start",
  }}
>
  {/* Card de Upload */}
  <Box
    sx={{
      p: 2,
      borderRadius: "18px",
      backgroundColor: "#fff",
      border: "1px solid rgba(226,232,240,0.95)",
      boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
    }}
  >
    <Typography
      sx={{
        fontWeight: 900,
        color: "#0f172a",
        mb: 0.5,
      }}
    >
      Upload de arquivos
    </Typography>

    <Typography
      sx={{
        color: "#64748b",
        fontSize: "13px",
        mb: 2,
      }}
    >
      Limite máximo permitido: 40MB por arquivo.
    </Typography>

    <Button
      variant="contained"
      component="label"
      size="small"
      disabled={uploadingTarefaId === tarefa.id}
      startIcon={<AttachFileIcon />}
      sx={{
        height: 42,
        px: 2.4,
        borderRadius: "14px",
        textTransform: "none",
        fontWeight: 900,
        color: "#fff",
        background: "linear-gradient(135deg, #312783, #6d5dfc)",
        boxShadow: "0 12px 26px rgba(49,39,131,0.24)",
        "&:hover": {
          background: "linear-gradient(135deg, #241d66, #5c4df2)",
        },
      }}
    >
      {uploadingTarefaId === tarefa.id ? "Enviando..." : "Enviar Arquivos"}

      <input
        type="file"
        multiple
        hidden
        accept=".jpg,.jpeg,.png,.webp,.xlsx,.xlsm,.xlsb,.xls,.pptx,.pptm,.ppt,.ppsx,.doc,.docx,.docm,.dotx,.pdf"
        onChange={(event) => handleUploadAnexosTarefa(event, tarefa.id)}
      />
    </Button>

    {uploadingTarefaId === tarefa.id && (
      <Typography sx={{ color: "#d32f2f", mt: 1, fontSize: 13 }}>
        ⏳ Enviando arquivos, por favor aguarde...
      </Typography>
    )}
  </Box>

  {/* Card de Anexos */}
  {(tarefa.planoDeAcao?.anexos || []).length > 0 ? (
    <Box
      sx={{
        p: 2,
        borderRadius: "18px",
        backgroundColor: "#fff",
        border: "1px solid rgba(226,232,240,0.95)",
        boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
        overflowX: "auto",
      }}
    >
      <Typography
        sx={{
          mb: 2,
          color: "#0f172a",
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <AttachFileIcon sx={{ fontSize: 20, color: "#f44336" }} />
        Anexos da tarefa
      </Typography>

     <Box
  component="table"
  sx={{
    width: "100%",
    minWidth: 520,
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "14px",
    overflow: "hidden",
  }}
>
  <thead>
    <tr
      style={{
        background: "linear-gradient(135deg, #f44336, #ff6b6b)",
      }}
    >
      <th
        style={{
          padding: "14px",
          textAlign: "left",
          fontWeight: 900,
          color: "#fff",
          fontSize: 13,
        }}
      >
        Nome do Arquivo
      </th>

      <th
        style={{
          padding: "14px",
          width: "110px",
          textAlign: "center",
          fontWeight: 900,
          color: "#fff",
          fontSize: 13,
        }}
      >
        Visualizar
      </th>

      <th
        style={{
          padding: "14px",
          width: "110px",
          textAlign: "center",
          fontWeight: 900,
          color: "#fff",
          fontSize: 13,
        }}
      >
        Download
      </th>

      <th
        style={{
          padding: "14px",
          width: "110px",
          textAlign: "center",
          fontWeight: 900,
          color: "#fff",
          fontSize: 13,
        }}
      >
        Excluir
      </th>
    </tr>
  </thead>

  <tbody>
    {(tarefa.planoDeAcao?.anexos || []).map((arquivo, index) => (
      <tr
        key={`${tarefa.id}-${arquivo.arquivoUrl || arquivo.nomeArquivo}-${index}`}
        style={{ borderTop: "1px solid #e2e8f0" }}
      >
        {/* Nome do arquivo */}
        <td
          style={{
            padding: "14px",
            fontSize: "0.875rem",
            maxWidth: 420,
            wordBreak: "break-word",
            color: "#0f172a",
            fontWeight: 500,
          }}
        >
          {arquivo.nomeArquivo}
        </td>

        {/* Visualizar */}
        <td
          style={{
            padding: "12px",
            textAlign: "center",
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleVisualizarArquivo(arquivo);
            }}
            title="Visualizar arquivo"
          >
            <VisibilityIcon
              fontSize="small"
              sx={{ color: "#f44336" }}
            />
          </IconButton>
        </td>

        {/* Download */}
        <td
          style={{
            padding: "12px",
            textAlign: "center",
          }}
        >
         <IconButton
          size="small"
          title="Baixar arquivo"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleDownloadArquivoBackend(arquivo);
          }}
        >
          <DownloadIcon
            fontSize="small"
            sx={{ color: "#f44336" }}
          />
        </IconButton>
        </td>

        {/* Excluir */}
        <td
          style={{
            padding: "12px",
            textAlign: "center",
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveAnexoTarefa(tarefa.id, index);
            }}
            title="Excluir arquivo"
          >
            <DeleteForeverIcon
              fontSize="small"
              sx={{ color: "#f44336" }}
            />
          </IconButton>
        </td>
      </tr>
    ))}
  </tbody>
</Box>
    </Box>
  ) : (
    <Box
      sx={{
        p: 2,
        borderRadius: "18px",
        backgroundColor: "#fff",
        border: "1px dashed rgba(148,163,184,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "110px",
      }}
    >
      <Typography
        sx={{
          color: "#64748b",
          fontSize: "13px",
          fontWeight: 700,  
        }}
      >
        Nenhum anexo enviado para esta tarefa.
      </Typography>
    </Box>
  )}
</Box>
                                    </Box>
                                    
                                  </AccordionDetails>
                                </Accordion>
                              ))}
                            </List>
                          )}
                          
                        </Box>
                        
                      </AccordionDetails>
                    </Accordion>
                  ))}









     {/* =========================  FIM OPERACIONAIS  ================================ */}




































































                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
        );
      })}
      {/* Botão SALVAR */}
      <Box sx={{ display: "flex", justifyContent: "flex-end",  }}>
      <Button
        variant="contained"
        onClick={handleSalvarEstrategicas}
        sx={{
          backgroundColor: "#312783",
          color: "#fff",

          "&:hover": {
            backgroundColor: "#312783",
          },
        }}
      >
        SALVAR
      </Button>
      </Box>
    </Box>
  );
};

export default BaseDiretriz4;











// CRIAR DIRETRIZ TÁTICA













function NovaTaticaForm({ areas, onAdd }) {
  const [titulo, setTitulo] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedArea, setSelectedArea] = useState([]);

  return (
    <Box display="flex" flexDirection="column" gap={2} mb={2}>
      <Box display="flex" flexDirection="row" gap={2} flexWrap="wrap">
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <TextField
            label="Criar uma Diretriz Tática..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            fullWidth
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: "200px", maxWidth: "300px" }}>
          <Select
            value={selectedArea}
            onChange={(event) => setSelectedArea(event.target.value)}
            displayEmpty
            fullWidth
            sx={{ backgroundColor: "transparent" }}
            renderValue={(selected) =>
              !selected
                ? "Selecione uma área para Tática"
                : areas.find((area) => area.id === selected)?.nome || "Desconhecida"
            }
          >
            <MenuItem disabled value="">
              <em>Selecione uma área responsável</em>
            </MenuItem>
            {areas.map((area) => (
              <MenuItem key={area.id} value={area.id}>
                <ListItemText primary={area.nome} />
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      <Button
        onClick={() => {
          if (!titulo.trim()) {
            alert("Preencha o nome da Diretriz Tática!");
            return;
          }

          if (!selectedArea) {
            alert("Selecione uma área responsável!");
            return;
          }

          const selectedAreaObj = areas.find((a) => a.id === selectedArea);

          onAdd(titulo, desc, selectedArea, selectedAreaObj?.nome || "");
          setTitulo("");
          setDesc("");
          setSelectedArea("");
        }}
        disableRipple
        sx={{
          alignSelf: "flex-start",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
          "&:focus": {
            outline: "none",
          },
        }}
      >
        <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#00c48c" }} />
      </Button>
    </Box>
  );
}











// CRIAR DIRETRIZ OPERACIONAL











function NovaOperacionalForm({ areas, onAdd }) {
  const [titulo, setTitulo] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedArea, setSelectedArea] = useState([]);

  return (
    <Box display="flex" flexDirection="column" gap={2} mb={2}>
      <Box display="flex" flexDirection="row" gap={2} flexWrap="wrap">
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <TextField
            label="Nome da Diretriz Operacional..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            fullWidth
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: "200px", maxWidth: "300px" }}>
          <Select
            value={selectedArea}
            onChange={(event) => setSelectedArea(event.target.value)}
            displayEmpty
            fullWidth
            sx={{ backgroundColor: "transparent" }}
            renderValue={(selected) =>
              !selected
                ? "Selecione uma área para Operacional"
                : areas.find((area) => area.id === selected)?.nome || "Desconhecida"
            }
          >
            <MenuItem disabled value="">
              <em>Selecione uma área responsável</em>
            </MenuItem>

            {areas.map((area) => (
              <MenuItem key={area.id} value={area.id}>
                <ListItemText primary={area.nome} />
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      <Button
        onClick={() => {
          if (!titulo.trim()) {
            alert("Preencha o nome da Diretriz Operacional!");
            return;
          }

          if (!selectedArea) {
            alert("Selecione uma área responsável!");
            return;
          }

          const selectedAreaObj = areas.find((a) => a.id === selectedArea);

          onAdd(titulo, desc, selectedArea, selectedAreaObj?.nome || "");

          setTitulo("");
          setDesc("");
          setSelectedArea("");
        }}
        disableRipple
        sx={{
          alignSelf: "flex-start",
          backgroundColor: "transparent",
          "&:hover": {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
          "&:focus": {
            outline: "none",
          },
        }}
      >
        <AddCircleOutlineIcon sx={{ fontSize: 25, color: "#f44336" }} />
      </Button>
    </Box>
  );
}
    
