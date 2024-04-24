import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { TopNav } from '../layouts/dashboard/top-nav';
import Alert from "../components/alert";
import { useRouter } from 'next/navigation';
import * as React from 'react';
import axios from 'axios';
import Table from '../components/table';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const currency_convert = {
  balance_usd: 'USD',
  balance_eur: 'Euro',
  balance_gbp: 'GBP'
}

const Page = () => {
  const router = useRouter();
  const [alert, setAlert] = useState({ message: '', successful: true, open: false });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({})
  const [transactionList, setTransactionList] = useState([]);
  const getUsersData = async () => {
    try {
      const userStr = localStorage.getItem("user");
      const user = JSON.parse(userStr);
      if (user.user_type == 'admin') {
        const response = await axios.get('/api/usersData');
        const data = response.data;
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching file list:', error);
    }
  }

  const getTransactions = async (id) => {
    if (selectedUser._id) {
      const response = await axios.get('/api/transaction?userID=' + selectedUser._id);
      const data = response.data;
      setTransactionList(data.data);
    }
  }
  useEffect(() => {
    getTransactions();
  }, [selectedUser]);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) router.push('/auth/login');
    getUsersData();
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
                height: "100%",
              }
            }}
          >
            <Grid
              container
              spacing={10}
            >
              <Grid
                xs={12}
                md={6}
              >
                <Table users={users} setSelectedUser={setSelectedUser} selectedUser={selectedUser} />
              </Grid>
              <Grid
                xs={12}
                md={6}
              >
                <Grid spacing={3} container style={{ fontSize: '20px', fontWeight: '500', padding: '0px' }}>
                  <Grid xs={12} sm={4} textAlign='center'>
                    USD : {selectedUser?.balance_usd}
                  </Grid>
                  <Grid xs={12} sm={4} textAlign='center'>
                    GBP : {selectedUser?.balance_gbp}
                  </Grid>
                  <Grid xs={12} sm={4} textAlign='center'>
                    Euro : {selectedUser?.balance_eur}
                  </Grid>
                </Grid>
                <Grid container spacing={1} style={{ fontSize: '20px', fontWeight: '500', padding: '5px' }}>
                  <Stack
                    direction="row"
                    justifyContent="space-around"
                    width="100%">
                    <Grid md={2}><Typography fontSize={20} fontWeight={800} align='center'>In/Out</Typography></Grid>
                    <Grid md={5}><Typography fontSize={20} fontWeight={800} align='center'>Bank Number</Typography></Grid>
                    <Grid md={3}><Typography fontSize={20} fontWeight={800} align='center'>Amount</Typography></Grid>
                    <Grid md={2}><Typography fontSize={20} fontWeight={800} align='center'>Currency</Typography></Grid>
                  </Stack>
                  {transactionList?.map((each, key) =>
                    <Stack
                      key={key}
                      direction="row"
                      justifyContent="space-around"
                      color={each.sender == selectedUser.bankNumber ? 'red' : 'green'}
                      width="100%">
                      <Grid md={2}>{each.sender == selectedUser.bankNumber ? <ArrowRightAltIcon /> : <KeyboardBackspaceIcon />}</Grid>
                      <Grid md={5}><Typography>{each.sender == selectedUser.bankNumber ? each.receiver : each.sender}</Typography></Grid>
                      <Grid md={3}><Typography>{each.amount}</Typography></Grid>
                      <Grid md={2}><Typography>{currency_convert[each.currency]}</Typography></Grid>
                    </Stack>
                  )}
                </Grid>

              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  )
};

export default Page;
