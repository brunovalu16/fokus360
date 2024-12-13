import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import  Header  from "./Header";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";

export const LinkPowerbi=({ url, title, descripton}) => {
    return(
        <>
      {/* Cabeçalho */}
      <Box sx={{ marginLeft: "40px", paddingTop: "50px" }}>
        <Header
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <AssessmentIcon sx={{ color: "#5f53e5", fontSize: 40 }} />
              <Typography>GERENCIADOR DE RELATÓRIOS</Typography>
            </Box>
          }
        />
      </Box>

      {/* Conteúdo Principal */}
      <Box
        sx={{
          marginLeft: "40px",
          marginTop: "-15px",
          width: "calc(100% - 80px)", // Para ajustar à tela considerando o margin de 40px
          minHeight: "50vh",
          padding: "15px",
          paddingLeft: "30px",
          borderRadius: "20px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          bgcolor: "#f2f0f0",
          overflowX: "hidden",
          }}
      >

        <Box display="flex" alignItems="center" gap={1}>
          <PlayCircleFilledIcon sx={{ color: "#5f53e5", fontSize: 25 }} />
          <Typography color="#858585">RELATÓRIOS | {descripton} </Typography>
        </Box>

        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "90%",
            marginBottom: "10px",
            marginTop: "15px",
          }}
        >
          <Divider
            sx={{
              position: "absolute",
              width: "100%",
              height: "1px",
              backgroundColor: "#ccc",
            }}
          />
          <LocalGroceryStoreIcon
            sx={{
              color: "#5f53e5",
              fontSize: 25,
              zIndex: 1,
              backgroundColor: "#f2f0f0",
              padding: "0 4px",
              marginLeft: "103%",
            }}
          />
        </Box>
        <div>
            <iframe
                src={url}
                width="100%"
                height="700px"
                frameBorder="0"
                scrolling="no"
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                borderRadius: "20px",
                }}
            ></iframe>
        </div>
      </Box>
    </>  
    );
}