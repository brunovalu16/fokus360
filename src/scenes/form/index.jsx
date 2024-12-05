import { Box, Button, TextField, useMediaQuery, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { Header } from "../../components";
import { Formik } from "formik";
import * as yup from "yup";


const initialValues = { firstName: "", lastName: "", email: "", contact: "", address1: "", address2: "", role: "",
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  address1: yup.string().required("required"),
  address2: yup.string().required("required"),
  role: yup.string().required("required"),
});

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const handleFormSubmit = (values, actions) => {
    console.log(values);
    actions.resetForm({
      values: initialValues,
    });
  };

  return (
    <Box m="60px">
      <Header title="CADASTRO DE USUÁRIOS" subtitle="Crie um novo usuário" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": {
                  gridColumn: isNonMobile ? undefined : "span 4",
                },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nome"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={touched.firstName && errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Último nome"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={touched.lastName && errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={touched.email && errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 3" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Telefone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={touched.contact && errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 3" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Telefone"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={touched.contact && errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 3" }}
              />
              <FormControl
                variant="filled"
                fullWidth
                sx={{ gridColumn: "span 3" }}
                error={touched.role && errors.role}
              >
                <InputLabel id="role-select-label">Unidade do Grupo Fokus</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  value={values.role}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="role"
                >
                  <MenuItem value="">
                    <em>Nenhuma</em>
                  </MenuItem>
                  <MenuItem value="go">Goiás</MenuItem>
                  <MenuItem value="df">Brasília</MenuItem>
                  <MenuItem value="to">Tocantins</MenuItem>
                  <MenuItem value="mt">Mato Grosso</MenuItem>
                  <MenuItem value="ms">Mato Grosso do Sul</MenuItem>
                  <MenuItem value="pa">Pará</MenuItem>
                </Select>
                {touched.role && errors.role && (
                  <Typography variant="body2" color="error">
                    {errors.role}
                  </Typography>
                )}
              </FormControl>

              {/* Botão alinhado */}
              <Box
                sx={{
                  gridColumn: "span 3", // Alinhado com os campos do formulário
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#5f53e5", // Cor de fundo personalizada
                    color: "#ffffff", // Cor do texto
                    "&:hover": {
                      backgroundColor: "#6870fa", // Cor de fundo ao passar o mouse
                    },
                  }}
                >
                  CRIAR USUÁRIO
                </Button>

              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;
