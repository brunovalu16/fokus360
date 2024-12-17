import { Box, Button, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Header, StatBox, LineChart, ProgressCircle, BarChart, GeographyChart } from "../../components";
import { DownloadOutlined, Email, PersonAdd, PointOfSale, Traffic } from "@mui/icons-material";
import PieChartIcon from '@mui/icons-material/PieChart';
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";

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
        sx={{
          marginLeft: "40px",
          marginTop: "-15px",
          width: "calc(100% - 80px)",
          minHeight: "50vh",
          padding: "15px",
          paddingLeft: "30px",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          bgcolor: "#f2f0f0",
          overflowX: "hidden",
        }}
      >
        {/* Botão Novo Projeto */}
        {!isXsDevices && (
          <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
              variant="contained"
              color="primary"
              onClick={""}
              sx={{
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
        <Box
          borderRadius="20px"
          paddingTop="20px"
          display="grid"
          gridTemplateColumns={
            isXlDevices
              ? "repeat(12, 1fr)"
              : isMdDevices
              ? "repeat(6, 1fr)"
              : "repeat(6, 1fr)"
          }
          gridAutoRows="140px"
          gap="20px"
        >
          {/* Statistic Items */}
          {[{
            title: "11,361",
            subtitle: "Email Sent",
            progress: "0.75",
            increase: "+14%",
            icon: <Email sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
          }, {
            title: "431,225",
            subtitle: "Sales Obtained",
            progress: "0.50",
            increase: "+21%",
            icon: <PointOfSale sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
          }, {
            title: "32,441",
            subtitle: "New Clients",
            progress: "0.30",
            increase: "+5%",
            icon: <PersonAdd sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
          }, {
            title: "1,325,134",
            subtitle: "Traffic Received",
            progress: "0.80",
            increase: "+43%",
            icon: <Traffic sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />
          }].map((item, index) => (
            <Box
              key={index}
              boxShadow="2"
              borderRadius="20px"
              gridColumn="span 3"
              bgcolor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={item.title}
                subtitle={item.subtitle}
                progress={item.progress}
                increase={item.increase}
                icon={item.icon}
              />
            </Box>
          ))}

          {/* Line Chart */}
          <Box
            boxShadow="2"
            borderRadius="20px"
            gridColumn={isXlDevices ? "span 8" : isMdDevices ? "span 6" : "span 6"}
            gridRow="span 2"
            bgcolor={colors.primary[400]}
          >
            <Box mt="25px" px="30px" display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="h5" fontWeight="600" color={colors.gray[700]}>
                  Revenue Generated
                </Typography>
                <Typography variant="h5" fontWeight="bold" color={colors.blueAccent[700]}>
                  $59,342.32
                </Typography>
              </Box>
              <IconButton>
                <DownloadOutlined sx={{ fontSize: "26px", color: colors.blueAccent[700] }} />
              </IconButton>
            </Box>
            <Box height="250px" mt="-20px">
              <LineChart isDashboard={true} />
            </Box>
          </Box>

          {/* PROJETOS ADICIONADOS */}
          <Box
            boxShadow="2"
            borderRadius="20px"
            gridColumn={isXlDevices ? "span 4" : "span 6"}
            gridRow="span 2"
            bgcolor="#583cff"
            overflow="auto"
          >
            <Box borderBottom={`1px solid ${colors.blueAccent[1100]}`} p="15px">
              <Typography color={colors.gray[900]} variant="h5" fontWeight="600">
                PROJETOS ADICIONADOS
              </Typography>
            </Box>

            {mockTransactions.map((transaction, index) => (
              <Box
                key={`${transaction.txId}-${index}`}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                borderBottom={`1px solid ${colors.blueAccent[1100]}`}
                p="15px"
              >
                <Box>
                  <Typography color={colors.gray[900]} variant="h5" fontWeight="600">
                    {transaction.txId}
                  </Typography>
                  <Typography color={colors.gray[700]}>{transaction.user}</Typography>
                </Box>
                <Typography color={colors.gray[800]}>{transaction.date}</Typography>
                <Box bgcolor={colors.gray[800]} p="5px 10px" borderRadius="4px">
                  ${transaction.cost}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Outros Gráficos */}

          {/**
          <Box
            boxShadow="2"
            borderRadius="20px"
            gridColumn={isXlDevices ? "span 4" : "span 6"}
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
          >
            <Typography variant="h5" fontWeight="600" sx={{ p: "30px 30px 0 30px" }}>
              Sales Quantity
            </Typography>
            <Box height="250px" mt="-20px">
              <BarChart isDashboard={true} />
            </Box>
          </Box>
           */}

          {/** 
          <Box
            boxShadow="2"
            borderRadius="20px"
            gridColumn={isXlDevices ? "span 4" : "span 6"}
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            padding="30px"
          >
            <Typography variant="h5" fontWeight="600" mb="15px">
              Geography Based Traffic
            </Typography>
            <Box height="200px">
              <GeographyChart isDashboard={true} />
            </Box>
          </Box>
          */}

          {/** 
          <Box
          boxShadow="2"
          borderRadius="20px"
          gridColumn={isXlDevices ? "span 4" : "span 3"}
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>

          
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              textAlign="center"
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography textAlign="center">
              Includes extra misc expenditures and costs
            </Typography>
          </Box>
          


        </Box>
        */}  
        </Box>
      </Box>
    </>
  );
}

export default Dashboard;
