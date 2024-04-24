import PropTypes from 'prop-types';

import {
  Avatar,
  Box, Typography,
  Stack, useMediaQuery,
  ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { useState } from 'react';
import { alpha } from '@mui/material/styles';
import { usePopover } from 'src/hooks/use-popover';
import { AccountPopover } from './account-popover';
import { useRouter } from 'next/router'

const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
  const [alignment, setAlignment] = useState('');

  const router = useRouter();
  const accountPopover = usePopover();

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    if (newAlignment == "overview") {
      router.push('/')
    } else {
      router.push('/transaction')
    }
  };

  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: 'blur(6px)',
          backgroundColor: (theme) => alpha(theme.palette.background.default, 0.5),
          position: 'fixed',
          width: "100%",
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="center"
          sx={{
            minHeight: TOP_NAV_HEIGHT,
          }}
        >
          <Stack
            alignItems='center'
            direction='row'
            pl={2}
            sx={{ position: 'absolute', left: 0 }}
          >
            <img
              alt="Go to pro"
              src={`/assets/logo.jpg`}
              style={{ height: '50px' }}
            />
            {useMediaQuery((theme) => theme.breakpoints.up('md')) ? <Typography variant='h5'
              pl={3}
              sx={{ display: 'hidden', display: 'block:md' }}
            >
              Model Bank
            </Typography> : <></>}

          </Stack>
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
          >
            <ToggleButton value="overview"
              aria-label="left aligned"
            >
              Overview
            </ToggleButton>
            <ToggleButton value="transaction"
              aria-label="centered"
            >
              Transactions
            </ToggleButton>
          </ToggleButtonGroup>
          <Avatar
            onClick={accountPopover.handleOpen}
            ref={accountPopover.anchorRef}
            sx={{
              cursor: 'pointer',
              height: 40,
              width: 40,
              position: "absolute",
              right: 10
            }}
            src="/assets/avatars/avatar-anika-visser.png"
          />
        </Stack>
      </Box>
      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
      />
    </>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func
};
