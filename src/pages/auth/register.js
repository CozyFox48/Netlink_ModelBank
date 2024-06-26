import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';
import Alert from "./../../components/alert";
import React, { useState } from 'react';

const Page = () => {
  const [alert, setAlert] = useState({ message: '', successful: true, open: false });
  const router = useRouter();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: {
      bankNumber: Date.now(),
      name: '',
      password: '',
      passwordVerify: '',
      submit: null
    },
    validationSchema: Yup.object({
      bankNumber: Yup
        .string()
        .max(255)
        .required('bankNumber is required'),
      name: Yup
        .string()
        .max(255)
        .required('Name is required'),
      password: Yup
        .string()
        .max(255)
        .required('Password is required'),
      passwordVerify: Yup
        .string()
        .max(255)
        .required('Password Verify is required')
    }),
    onSubmit: async (values, helpers) => {
      if (values.password !== values.passwordVerify) {
        setAlert({ message: "Passwords are not match.", successful: false, open: true });
      } else {
        auth.signUp(values.bankNumber, values.name, values.password).then(
          response => {
            setAlert({ message: response.data.message, successful: true, open: true });
            setTimeout(() => {
              router.push('/auth/login');
            }, 3000);

          },
          error => {
            setAlert({
              message: (error.response &&
                error.response.data &&
                error.response.data.message) ||
                error.message ||
                error.toString(), successful: false, open: true
            });

          }
        );
      }

    }
  });

  return (
    <>
      <Head>
        <title>
          Register | Devias Kit
        </title>
      </Head>
      <Alert message={alert.message} successful={alert.successful} open={alert.open} handleClose={() => { setAlert({ ...alert, open: false }); }} />
      <Box
        sx={{
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3 }}
            >
              <Typography variant="h4">
                Register
              </Typography>
              <Typography
                color="text.secondary"
                variant="body2"
              >
                Already have an account?
                &nbsp;
                <Link
                  component={NextLink}
                  href="/auth/login"
                  underline="hover"
                  variant="subtitle2"
                >
                  Log in
                </Link>
              </Typography>
            </Stack>
            <form
              noValidate
              onSubmit={formik.handleSubmit}
            >
              <Stack spacing={3}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Full Name"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                <TextField
                  error={!!(formik.touched.bankNumber && formik.errors.bankNumber)}
                  fullWidth
                  helperText={formik.touched.bankNumber && formik.errors.bankNumber}
                  label="Bank Account"
                  aria-readonly
                  name="bankNumber"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.bankNumber}
                />
                <TextField
                  error={!!(formik.touched.password && formik.errors.password)}
                  fullWidth
                  helperText={formik.touched.password && formik.errors.password}
                  label="Password"
                  name="password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.password}
                />
                <TextField
                  error={!!(formik.touched.passwordVerify && formik.errors.passwordVerify)}
                  fullWidth
                  helperText={formik.touched.passwordVerify && formik.errors.passwordVerify}
                  label="Password Verify"
                  name="passwordVerify"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="password"
                  value={formik.values.passwordVerify}
                />
              </Stack>
              {formik.errors.submit && (
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {formik.errors.submit}
                </Typography>
              )}
              <Button
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                type="submit"
                variant="contained"
              >
                Continue
              </Button>
            </form>
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;
