import Head from 'next/head';
import { Box, Typography, Container, InputBase, Unstable_Grid2 as Grid, Button, Stack } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useEffect, useState } from 'react';
import axios from "axios";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import { SvgIcon } from '@mui/material';
import { TopNav } from '../layouts/dashboard/top-nav';
import Alert from "./../components/alert";
import { useRouter } from 'next/navigation';

const Page = () => {
  const data2show = [
    {
      title: "Full Name",
      value: 'username'
    }, {
      title: "Bank Number",
      value: 'bankNumber'
    }, {
      title: "USD balance",
      value: 'balance_usd'
    }, {
      title: "Euro balance",
      value: 'balance_eur'
    }, {
      title: "GBP balance",
      value: 'balance_gbp'
    }
  ]
  const router = useRouter();
  const [alert, setAlert] = useState({ message: '', successful: true, open: false });
  const [userData, setUserData] = useState({});
  const [transfer, setTransfer] = useState({ receiver: '', amount: 0, currency: 'USD' });
  const [selected, setSelected] = useState('');

  const styleRow = {
    ml: 1,
    width: "100%",
    height: "100%",
    flex: 1,
    borderBottom: '1px grey solid',
    display: open ? 'flex' : 'none',
  }

  const updateUserData = async () => {
    try {
      const userStr = localStorage.getItem("user");
      const user = JSON.parse(userStr);
      await axios.post('/api/userData?userID=' + user.id, userData);
      setSelected('')
    } catch (error) {
    }
  }

  const getUserData = async () => {
    try {
      const userStr = localStorage.getItem("user");
      const user = JSON.parse(userStr);
      const response = await axios.get('/api/userData?userID=' + user.id);
      const data = response.data;
      setUserData(data);
    } catch (error) {
      console.error('Error fetching file list:', error);
    }
  }

  const submitTransfer = async () => {
    if (transfer.amount < 0 || transfer.amount > Number(userData[transfer.currency])) {
      setAlert({ message: 'Invalid Amount', successful: false, open: true });
    } else if (transfer.receiver === '') {
      setAlert({ message: "Input receiver's bank number", successful: false, open: true });
    } else {
      const userStr = localStorage.getItem("user");
      const user = JSON.parse(userStr);
      const result = await axios.post('/api/transfer?userID=' + user.id, { ...transfer, sender: userData.bankNumber });
      if (result.data.success) {
        setAlert({ message: "Transfered Successfully", successful: true, open: true });
        getUserData();
      } else {
        setAlert({ message: result.data.message, successful: true, open: true });
      }
    }
  }

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) router.push('/auth/login');
    getUserData();

  }, []);

  return (
    <>
      <Head>
        <title>
          Model Bank
        </title>
      </Head>
      <Alert message={alert.message} successful={alert.successful} open={alert.open} handleClose={() => { setAlert({ ...alert, open: false }); }} />
      <Box
        component="main"
      >
        <TopNav />
        <Container maxWidth="xl">
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="100vh"
            sx={{
              '@media (max-width:900px)': {
                paddingTop: "64px",
                height: '100%'
              }
            }}
          >
            <Grid
              container
              spacing={3}
            >
              <Grid
                xs={12}
                md={6}
              >
                <Typography align='center'
                  variant='h3'
                  mb="30px">
                  Overview
                  <Button
                    sx={{ color: 'black' }}
                    onClick={() => getUserData}>
                    <SvgIcon fontSize="large">
                      <RefreshIcon />
                    </SvgIcon>
                  </Button>
                </Typography>
                {data2show.map(each => {
                  return <>
                    <Box sx={{ my: 2, mx: 2 }}
                      key={each.title}>
                      <Grid container
                        alignItems="center"
                        item
                        xs>
                        {selected === each.value ?
                          <>
                            {each.value === "currency" ? <Select
                              variant='standard'
                              sx={styleRow}
                              value={userData[each.value]}
                              onChange={e => { setUserData({ ...userData, [each.value]: e.target.value }) }}
                            >
                              <MenuItem value={'USD'}>USD</MenuItem>
                              <MenuItem value={'Euro'}>Euro</MenuItem>
                              <MenuItem value={'GBP'}>GBP</MenuItem>
                              <MenuItem value={'CHF'}>CHF</MenuItem>
                            </Select> : <InputBase
                              sx={styleRow}
                              placeholder={`Input ${each.title}`}
                              value={userData[each.value]}
                              onChange={e => { setUserData({ ...userData, [each.value]: e.target.value }) }}
                            />}

                            <Button onClick={() => updateUserData()}>
                              <CheckIcon />
                            </Button>
                            <Button
                              onClick={() => { setSelected(''); getUserData(); }}
                              sx={{ color: 'red' }}
                            >
                              <CloseIcon />
                            </Button>
                          </>
                          : <Typography gutterBottom
                            variant="h6"
                            component="div"
                            onClick={() => { if (each.value !== 'bankNumber') setSelected(each.value); }}>

                            {userData[each.value]}
                          </Typography>
                        }
                      </Grid>
                      <Typography color="text.secondary"
                        variant="body2">
                        {each.title}
                      </Typography>
                    </Box>
                    <Divider variant="middle" />
                  </>
                })}
                <Typography
                  variant='h5'
                  mt="10px"
                  mb="10px">
                  Transfer money
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  mx={2}
                  justifyContent='space-between'>
                  <InputBase
                    sx={{
                      width: "40%",
                      minWidth: '320px',
                      borderBottom: '1px grey solid',
                      display: open ? 'flex' : 'none',
                    }}
                    placeholder={`Bank number`}
                    value={transfer.receiver}
                    onChange={e => { setTransfer({ ...transfer, receiver: e.target.value }); }}
                  />
                  <InputBase
                    sx={{
                      width: "20%",
                      minWidth: '80px',
                      borderBottom: '1px grey solid',
                      display: open ? 'flex' : 'none',
                    }}
                    placeholder={`Amount`}
                    type="number"
                    value={transfer.amount}
                    onChange={e => { setTransfer({ ...transfer, amount: e.target.value }); }}
                  />
                  <Select
                    variant='standard'
                    sx={{ width: "10%", minWidth: '80px' }}
                    value={transfer.currency}
                    onChange={e => { setTransfer({ ...transfer, currency: e.target.value }); }}
                  >
                    <MenuItem value={'balance_usd'}>USD</MenuItem>
                    <MenuItem value={'balance_eur'}>Euro</MenuItem>
                    <MenuItem value={'balance_gbp'}>GBP</MenuItem>
                  </Select>
                  <Button sx={{ width: "10%" }}
                    onClick={() => submitTransfer()}>
                    Transfer
                  </Button>
                </Stack>
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <img
                  alt="Go to pro"
                  src={`/assets/overview-normal.jpg`}
                  width="100%"
                />
              </Grid>
            </Grid>
          </Box>

        </Container>
      </Box>
    </>
  )
};

export default Page;
