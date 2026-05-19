import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Button,
  Divider,
  Tooltip,
  Typography,
} from "@mui/material";

import { Margin, MenuOutlined } from "@mui/icons-material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PieChartIcon from "@mui/icons-material/PieChart";
import SourceIcon from "@mui/icons-material/Source";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import LogoutIcon from "@mui/icons-material/PowerSettingsNew";
import HeatPumpIcon from "@mui/icons-material/HeatPump";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { Sidebar } from "react-pro-sidebar";
import { useNavigate, Link, useLocation } from "react-router-dom";

import logo from "../../../assets/images/icone_logo.png";
import icon_logo from "../../../assets/images/icon_logo.png";

import { authFokus360, dbFokus360 as db } from "../../../data/firebase-config";
import { ToggledContext } from "../../../App";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const SideBar = () => {
  const [userRole, setUserRole] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [isLoadingRole, setIsLoadingRole] = useState(true);
  const [openProjetos, setOpenProjetos] = useState(false);

  const { toggled, setToggled } = useContext(ToggledContext);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authFokus360, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, "user", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const role = String(docSnap.data().role || "").padStart(2, "0");
            setUserRole(role);
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        } finally {
          setIsLoadingRole(false);
        }
      } else {
        setUserRole("");
        setIsLoadingRole(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(authFokus360);

      localStorage.removeItem("token");
      localStorage.removeItem("userRole");

      navigate("/login");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  const isActive = (paths = []) => {
    return paths.some((path) => location.pathname === path);
  };

  const menuItems = [
    {
      label: "Relatórios",
      subtitle: "Indicadores e relatórios executivos",
      icon: <AssessmentIcon />,
      path: "/home",
      color: "#312783",
      bg: "rgba(49,39,131,0.10)",
      paths: ["/home"],
    },
    {
      label: "Arquivos",
      subtitle: "Biblioteca e documentos internos",
      icon: <SourceIcon />,
      path: "/capaarquivos",
      color: "#2563eb",
      bg: "rgba(37,99,235,0.10)",
      paths: ["/capaarquivos", "/arquivosareas", "/arquivos", "/painelindustriastrade"],
    },
    {
      label: "Tarefas",
      subtitle: "Kanban e gestão operacional",
      icon: <AssignmentTurnedInIcon />,
      path: "/capatarefas",
      color: "#059669",
      bg: "rgba(5,150,105,0.10)",
      paths: ["/capatarefas"],
    },
    {
      label: "CSC",
      subtitle: "Centro de Serviços Compartilhados",
      icon: <HeatPumpIcon />,
      path: "/csc",
      color: "#dc2626",
      bg: "rgba(220,38,38,0.10)",
      paths: ["/csc"],
    },
  ];

  const projetosActive = isActive(["/projetos", "/projetos2"]);

  return (
    <Sidebar
      backgroundColor="transparent"
      rootStyles={{
        border: 0,
        height: "100vh",
        width: collapsed ? "78px" : "292px",
        minWidth: collapsed ? "78px" : "292px",
        maxWidth: collapsed ? "78px" : "292px",
        transition: "all 0.28s ease",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.99), rgba(248,250,252,0.98))",
        borderRight: "1px solid rgba(226,232,240,0.95)",
        boxShadow: "18px 0 45px rgba(15,23,42,0.08)",
        overflow: "hidden",
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Box sx={sidebarShellStyle}>
       
       

        <Box sx={topAreaStyle(collapsed)}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "space-between",
            }}
          >
            {!collapsed && (
              <Box>
                
              
              </Box>
            )}

            <Tooltip title={collapsed ? "Abrir menu" : "Fechar menu"} placement="right" arrow>
              <IconButton onClick={() => setCollapsed(!collapsed)} sx={collapseButtonStyle}>
                {collapsed ? <MenuOutlined /> : <KeyboardDoubleArrowLeftIcon />}
              </IconButton>
            </Tooltip>
          </Box>

          {!collapsed && (
            <Box sx={logoCardStyle}>
              <img
                src={logo}
                alt="Logo Fokus"
                style={{
                  width: "178px",
                  height: "auto",
                  display: "block",
                }}
              />
            </Box>
          )}

          <Divider sx={dividerStyle} />
        </Box>

        <Box sx={menuScrollStyle(collapsed)}>
          

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {menuItems.slice(0, 1).map((item) => (
              <PremiumMenuItem
                key={item.label}
                item={item}
                collapsed={collapsed}
                active={isActive(item.paths)}
              />
            ))}

            <Box
              onMouseEnter={() => setOpenProjetos(true)}
              onMouseLeave={() => setOpenProjetos(false)}
              sx={{ position: "relative" }}
            >
              <Tooltip title={collapsed ? "Projetos" : ""} placement="right" arrow>
                <Box
                  onClick={() => {
                    if (collapsed) navigate("/projetos2");
                    else setOpenProjetos((prev) => !prev);
                  }}
                  sx={premiumItemStyle({
                    collapsed,
                    active: projetosActive,
                    color: "#7c3aed",
                    bg: "rgba(124,58,237,0.10)",
                  })}
                >
                  <Box sx={iconBoxStyle({ active: projetosActive, color: "#7c3aed" })}>
                    <PieChartIcon sx={{ fontSize: 22 }} />
                  </Box>

                  {!collapsed && (
                    <>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={menuLabelStyle(projetosActive)}>Projetos</Typography>
                        <Typography sx={menuSubtitleStyle(projetosActive)}>
                          Planejamento e execução estratégica
                        </Typography>
                      </Box>

                      <ArrowForwardIosIcon
                        sx={{
                          fontSize: 14,
                          color: projetosActive ? "#fff" : "#94a3b8",
                          transform: openProjetos ? "rotate(90deg)" : "rotate(0deg)",
                          transition: "all 0.22s ease",
                        }}
                      />
                    </>
                  )}
                </Box>
              </Tooltip>

              {!collapsed && openProjetos && (
                <Box sx={submenuBoxStyle}>
                  <Box
                    component={Link}
                    to="/projetos2"
                    sx={submenuItemStyle(location.pathname === "/projetos2")}
                  >
                    Projetos
                  </Box>

                  <Box
                    component={Link}
                    to="/projetos"
                    sx={submenuItemStyle(location.pathname === "/projetos")}
                  >
                    Planejamento Estratégico
                  </Box>
                </Box>
              )}
            </Box>

            {menuItems.slice(1).map((item) => (
              <PremiumMenuItem
                key={item.label}
                item={item}
                collapsed={collapsed}
                active={isActive(item.paths)}
              />
            ))}
          </Box>
        </Box>

        <Box sx={bottomAreaStyle(collapsed)}>
          

          <Tooltip title={collapsed ? "Sair" : ""} placement="right" arrow>
            <Button fullWidth onClick={handleLogout} sx={logoutButtonStyle(collapsed)}>
              <LogoutIcon sx={{ fontSize: 23 }} />
              {!collapsed && "Sair"}
            </Button>
          </Tooltip>

          <Divider sx={dividerStyle} />

          <Box sx={miniLogoWrapperStyle}>
            <Box sx={miniLogoStyle}>
              <img
                src={icon_logo}
                alt="Logo"
                style={{
                  maxWidth: "24px",
                  height: "auto",
                  display: "block",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Sidebar>
  );
};

const PremiumMenuItem = ({ item, collapsed, active }) => {
  return (
    <Tooltip title={collapsed ? item.label : ""} placement="right" arrow>
      <Box
        component={Link}
        to={item.path}
        sx={premiumItemStyle({
          collapsed,
          active,
          color: item.color,
          bg: item.bg,
        })}
      >
        <Box sx={iconBoxStyle({ active, color: item.color })}>{item.icon}</Box>

        {!collapsed && (
          <>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={menuLabelStyle(active)}>{item.label}</Typography>
              <Typography sx={menuSubtitleStyle(active)}>{item.subtitle}</Typography>
            </Box>

            <ArrowForwardIosIcon
              sx={{
                fontSize: 14,
                color: active ? "#fff" : "#94a3b8",
              }}
            />
          </>
        )}
      </Box>
    </Tooltip>
  );
};

const sidebarShellStyle = {
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",
};




const topAreaStyle = (collapsed) => ({
  px: collapsed ? 1 : 2,
  pt: 2,
  pb: 1,
  position: "relative",
  zIndex: 1,
});



const collapseButtonStyle = {
  width: 42,
  height: 42,
  borderRadius: "14px",
  color: "#312783",
 
  border: "1px solid rgba(49,39,131,0.12)",
  "&:hover": {

    transform: "scale(1.03)",
  },
  transition: "all 0.25s ease",
};

const logoCardStyle = {
  mt: 3,
  mb: 2,
  mx: "auto",
  width: 210,
  minHeight: 96,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const dividerStyle = {
  borderColor: "rgba(148,163,184,0.20)",
  my: 2,
};

const menuScrollStyle = (collapsed) => ({
  flex: 1,
  px: collapsed ? 0.8 : 1.5,
  overflowY: "auto",
  overflowX: "hidden",
  position: "relative",
  zIndex: 1,
  "&::-webkit-scrollbar": {
    width: "5px",
  },
  "&::-webkit-scrollbar-thumb": {
    
    borderRadius: "10px",
  },
});


const premiumItemStyle = ({ collapsed, active, color, bg }) => ({
  minHeight: collapsed ? 48 : 62,
  width: "100%",
  px: collapsed ? 0 : 1.5,
  py: 0.8,
  borderRadius: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: collapsed ? "center" : "space-between",
  gap: 1,
  textDecoration: "none",
  cursor: "pointer",
  color: active ? "#fff" : "#334155",
  background: active ? `linear-gradient(135deg, ${color}, #6d5dfc)` : "#fff",
  border: active ? "1px solid transparent" : "1px solid rgba(226,232,240,0.95)",
  boxShadow: active ? `0 16px 34px ${color}38` : "0 8px 20px rgba(15,23,42,0.04)",
  transition: "all 0.24s ease",
  overflow: "hidden",
  "&:hover": {
    color: "#fff",
    background: `linear-gradient(135deg, ${color}, #6d5dfc)`,
    transform: collapsed ? "translateY(-1px)" : "translateX(3px)",
    boxShadow: `0 18px 38px ${color}38`,
  },
  "&:hover .sidebar-icon-box": {
    backgroundColor: "rgba(255,255,255,0.18)",
    color: "#fff",
  },
});

const iconBoxStyle = ({ active, color }) => ({
  className: "sidebar-icon-box",
  width: 20,
  height: 20,
  minWidth: 40,
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: active ? "#fff" : color,
  transition: "all 0.24s ease",
  "& svg": {
    fontSize: 25,
  },
});

const menuLabelStyle = (active) => ({
  fontSize: 14,
  fontWeight: 950,
  color: active ? "#fff" : "#888888",
  lineHeight: 1.15,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const menuSubtitleStyle = (active) => ({
  mt: 0.3,
  fontSize: 10.5,
  fontWeight: 700,
  color: active ? "rgba(255,255,255,0.78)" : "#94a3b8",
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const submenuBoxStyle = {
  ml: 2,
  mr: 0.4,
  mt: 0.8,
  mb: 0.8,
  p: 0.8,
  borderRadius: "16px",
  backgroundColor: "rgba(248,250,252,0.96)",
  border: "1px solid rgba(226,232,240,0.9)",
};

const submenuItemStyle = (active) => ({
  display: "block",
  px: 1.4,
  py: 1,
  borderRadius: "12px",
  textDecoration: "none",
  color: active ? "#312783" : "#475569",
  backgroundColor: active ? "rgba(49,39,131,0.08)" : "transparent",
  fontSize: 12.5,
  fontWeight: 900,
  transition: "all 0.2s ease",
  "&:hover": {
    color: "#312783",
    backgroundColor: "rgba(49,39,131,0.08)",
  },
});

const bottomAreaStyle = (collapsed) => ({
  p: collapsed ? 1 : 2,
  position: "relative",
  zIndex: 1,
});

const profileCardStyle = {
  mb: 1.5,
  p: 1.6,
  borderRadius: "18px",
  background:
    "linear-gradient(135deg, rgba(49,39,131,0.08), rgba(109,93,252,0.08))",
  border: "1px solid rgba(49,39,131,0.12)",
};

const profileLabelStyle = {
  fontSize: 10,
  fontWeight: 950,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.10em",
};

const profileValueStyle = {
  mt: 0.3,
  fontSize: 14,
  fontWeight: 950,
  color: "#0f172a",
};

const logoutButtonStyle = (collapsed) => ({
  height: 44,
  borderRadius: "15px",
  color: "#dc2626",
  backgroundColor: "rgba(220,38,38,0.08)",
  border: "1px solid rgba(220,38,38,0.14)",
  textTransform: "none",
  fontWeight: 950,
  display: "flex",
  justifyContent: "center",
  gap: 1,
  minWidth: collapsed ? 0 : "auto",
  px: collapsed ? 0 : 2,
  "&:hover": {
    backgroundColor: "rgba(220,38,38,0.14)",
    transform: "translateY(-1px)",
    boxShadow: "0 12px 26px rgba(220,38,38,0.16)",
  },
  transition: "all 0.25s ease",
});

const miniLogoWrapperStyle = {
  display: "flex",
  justifyContent: "center",
  pb: 0.5,
};

const miniLogoStyle = {
  width: 38,
  height: 38,
  borderRadius: "14px",
  backgroundColor: "#fff",
  border: "1px solid rgba(226,232,240,0.95)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
};

export default SideBar;