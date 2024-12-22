import { Box, Button, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Header, StatBox, LineChart, ProgressCircle, BarChart, GeographyChart } from "../../components";
import { DownloadOutlined, Email, PersonAdd, PointOfSale, Traffic } from "@mui/icons-material";
import PieChartIcon from '@mui/icons-material/PieChart';
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DadosProjetogeral from "../../components/DadosProjetogeral";

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");

  return (
    <>
      {/* Header */}
      <Box
        sx={{
          marginLeft: "40px",
          paddingTop: "50px",
          
        }}
      >
        <Header
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <PieChartIcon sx={{ color: "#5f53e5", fontSize: 40 }} />
              <Typography>DASHBOARD 360 | GRUPO FOKUS</Typography>
            </Box>
          }
        />
      </Box>

      <Box
        
      >
        {/* Botão Novo Projeto */}
        {!isXsDevices && (
          <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
              href="/cadastroprojetos"
              variant="contained"
              color="primary"
              onClick={""}
              sx={{
                marginRight: "70px",
                fontSize: "10px",
                fontWeight: "bold",
                borderRadius: "5px",
                padding: "10px 20px",
                backgroundColor: colors.blueAccent[1000],
                boxShadow: "none",
                "&:hover": { backgroundColor: "#3f2cb2" },
              }}
            >
              Novo projeto
            </Button>
          </Box>
        )}



        {/* GRID & CHARTS */}
        <DadosProjetogeral />

         
        
        </Box>
      
    </>
  );
}

export default Dashboard;
