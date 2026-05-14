import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Button,
  Divider,
  useTheme,
  Tooltip,
  Typography,
} from "@mui/material";

import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";
import {
  MenuOutlined,
  Assessment as AssessmentIcon,
  PieChart as PieChartIcon,
  Source as SourceIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  PowerSettingsNew as LogoutIcon,
} from "@mui/icons-material";

import HeatPumpIcon from "@mui/icons-material/HeatPump";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { useNavigate, Link } from "react-router-dom";
import { useTheme as useMuiTheme } from "@mui/material/styles";

import logo from "../../../assets/images/icone_logo.png";
import icon_logo from "../../../assets/images/icon_logo.png";

import { tokens } from "../../../theme";
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

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

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

  const menuButtonStyle = {
    color: "#334155",
    backgroundColor: "transparent",
    borderRadius: "14px",
    margin: "4px 10px",
    height: "46px",
    fontSize: "14px",
    fontWeight: 800,
    transition: "all 0.25s ease",
    "&:hover": {
      color: "#312783",
      backgroundColor: "rgba(49,39,131,0.08)",
      transform: "translateX(3px)",
    },
    [`&.ps-active`]: {
      color: "#fff",
      background: "linear-gradient(135deg, #312783, #6d5dfc)",
      boxShadow: "0 12px 28px rgba(49,39,131,0.28)",
    },
  };

  return (
    <Sidebar
      backgroundColor="transparent"
      rootStyles={{
        border: 0,
        height: "100vh",
        width: collapsed ? "78px" : "280px",
        minWidth: collapsed ? "78px" : "280px",
        transition: "all 0.3s ease",
        boxShadow: "18px 0 45px rgba(15,23,42,0.10)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96))",
        borderRight: "1px solid rgba(226,232,240,0.95)",
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(109,93,252,0.10)",
            top: -70,
            right: -90,
            pointerEvents: "none",
          }}
        />

        <Box
          sx={{
            px: collapsed ? 1 : 2,
            pt: 2,
            pb: 1,
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent={collapsed ? "center" : "space-between"}
          >
            {!collapsed && (
              <Box>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: "#94a3b8",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}
                >
                  Sistema
                </Typography>

                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 950,
                    color: "#0f172a",
                    lineHeight: 1.1,
                  }}
                >
                  FOKUS 360
                </Typography>
              </Box>
            )}

            <IconButton
              onClick={() => setCollapsed(!collapsed)}
              sx={{
                width: 42,
                height: 42,
                borderRadius: "14px",
                color: "#312783",
                backgroundColor: "rgba(49,39,131,0.08)",
                border: "1px solid rgba(49,39,131,0.12)",
                "&:hover": {
                  backgroundColor: "rgba(49,39,131,0.14)",
                  transform: "scale(1.03)",
                },
                transition: "all 0.25s ease",
              }}
            >
              {collapsed ? <MenuOutlined /> : <KeyboardDoubleArrowLeftIcon />}
            </IconButton>
          </Box>

          {!collapsed && (
            <Box
              display="flex"
              justifyContent="center"
              sx={{
                mt: 3,
                mb: 2,
                transition: "all 0.4s ease",
              }}
            >
              <Box
                sx={{
                  width: "180px",
                  minHeight: 92,
                  borderRadius: "24px",
                  background:
                    "linear-gradient(135deg, rgba(49,39,131,0.06), rgba(109,93,252,0.10))",
                  border: "1px solid rgba(226,232,240,0.85)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
              >
                <img
                  src={logo}
                  alt="Logo"
                  style={{
                    width: "135px",
                    height: "auto",
                  }}
                />
              </Box>
            </Box>
          )}

          <Divider
            sx={{
              borderColor: "rgba(148,163,184,0.20)",
              my: 2,
            }}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            px: collapsed ? 0.5 : 1,
            overflowY: "auto",
            overflowX: "hidden",
            position: "relative",
            zIndex: 1,
            "&::-webkit-scrollbar": {
              width: "5px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(148,163,184,0.35)",
              borderRadius: "10px",
            },
          }}
        >
          <Menu
            menuItemStyles={{
              button: menuButtonStyle,
              icon: {
                color: "inherit",
                minWidth: collapsed ? "100%" : "35px",
                display: "flex",
                justifyContent: "center",
              },
              label: {
                fontWeight: 800,
              },
              subMenuContent: {
                backgroundColor: "transparent",
              },
            }}
          >
            <Tooltip title={collapsed ? "Power BI" : ""} placement="right" arrow>
              <MenuItem
                component={<Link to="/home" />}
                icon={<AssessmentIcon sx={{ fontSize: 24 }} />}
              >
                Power BI
              </MenuItem>
            </Tooltip>

            <Box
              onMouseEnter={() => setOpenProjetos(true)}
              onMouseLeave={() => setOpenProjetos(false)}
            >
              {!collapsed ? (
                <SubMenu
                  open={openProjetos}
                  label="Projetos"
                  icon={<PieChartIcon sx={{ fontSize: 24 }} />}
                  menuItemStyles={{
                    button: {
                      ...menuButtonStyle,
                    },
                    SubMenuExpandIcon: {
                      color: "#64748b",
                    },
                  }}
                >
                  <MenuItem
                    component={<Link to="/projetos2" />}
                    style={{
                      margin: "4px 16px 4px 45px",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      fontSize: "13px",
                      fontWeight: 800,
                      color: "#475569",
                    }}
                  >
                    Projetos
                  </MenuItem>

                  <MenuItem
                    component={<Link to="/projetos" />}
                    style={{
                      margin: "4px 16px 4px 45px",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      fontSize: "13px",
                      fontWeight: 800,
                      color: "#475569",
                    }}
                  >
                    Planejamento Estratégico
                  </MenuItem>
                </SubMenu>
              ) : (
                <Tooltip
                  title={
                    <Box display="flex" flexDirection="column" gap={0.5}>
                      <Link
                        to="/projetos2"
                        style={{
                          color: "#fff",
                          textDecoration: "none",
                          padding: "6px 8px",
                          fontWeight: 700,
                        }}
                      >
                        Projetos
                      </Link>

                      <Link
                        to="/projetos"
                        style={{
                          color: "#fff",
                          textDecoration: "none",
                          padding: "6px 8px",
                          fontWeight: 700,
                        }}
                      >
                        Planejamento Estratégico
                      </Link>
                    </Box>
                  }
                  placement="right"
                  arrow
                >
                  <MenuItem icon={<PieChartIcon sx={{ fontSize: 24 }} />} />
                </Tooltip>
              )}
            </Box>

            <Tooltip title={collapsed ? "Arquivos" : ""} placement="right" arrow>
              <MenuItem
                component={<Link to="/capaarquivos" />}
                icon={<SourceIcon sx={{ fontSize: 24 }} />}
              >
                Arquivos
              </MenuItem>
            </Tooltip>

            <Tooltip title={collapsed ? "Tarefas" : ""} placement="right" arrow>
              <MenuItem
                component={<Link to="/capatarefas" />}
                icon={<AssignmentTurnedInIcon sx={{ fontSize: 24 }} />}
              >
                <span className="notranslate" translate="no">
                  Tarefas
                </span>
              </MenuItem>
            </Tooltip>

            <Tooltip title={collapsed ? "CSC" : ""} placement="right" arrow>
              <MenuItem
                component={<Link to="/csc" />}
                icon={<HeatPumpIcon sx={{ fontSize: 24 }} />}
              >
                CSC
              </MenuItem>
            </Tooltip>
          </Menu>
        </Box>

        <Box
          sx={{
            p: collapsed ? 1 : 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          

          <Tooltip title={collapsed ? "Sair" : ""} placement="right" arrow>
            <Button
              fullWidth
              onClick={handleLogout}
              sx={{
                height: 44,
                borderRadius: "15px",
                color: "#dc2626",
                backgroundColor: "rgba(220,38,38,0.08)",
                border: "1px solid rgba(220,38,38,0.14)",
                textTransform: "none",
                fontWeight: 900,
                display: "flex",
                justifyContent: collapsed ? "center" : "center",
                gap: 1,
                minWidth: collapsed ? 0 : "auto",
                px: collapsed ? 0 : 2,
                "&:hover": {
                  backgroundColor: "rgba(220,38,38,0.14)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 12px 26px rgba(220,38,38,0.16)",
                },
                transition: "all 0.25s ease",
              }}
            >
              <LogoutIcon sx={{ fontSize: 24 }} />
              {!collapsed && "Sair"}
            </Button>
          </Tooltip>

          <Divider
            sx={{
              borderColor: "rgba(148,163,184,0.20)",
              my: 1.5,
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              pb: 0.5,
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "14px",
                backgroundColor: "#fff",
                border: "1px solid rgba(226,232,240,0.95)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
              }}
            >
              <img
                src={icon_logo}
                alt="Logo"
                style={{
                  maxWidth: "24px",
                  height: "auto",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Sidebar>
  );
};

export default SideBar;