import * as React from 'react';
import { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import WebLayout from '@/layouts/web-layout';
import SitemarkIcon from '@/components/www/SitemarkIcon';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const ConfirmContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function Registered({ domain, redirectUrl, email }: { 
  domain: string, 
  redirectUrl: string,
  email: string 
}) {
  useEffect(() => {
    // Redirigir automáticamente después de 3 segundos
    const timer = setTimeout(() => {
      window.location.href = redirectUrl;
    }, 3000);

    return () => clearTimeout(timer);
  }, [redirectUrl]);

  return (
    <WebLayout>
      <CssBaseline enableColorScheme />
      <ConfirmContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Tenant Registered!
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Your tenant has been registered successfully! You will be redirected shortly...
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2">
              Your tenant URL:
            </Typography>
            <Link
              href={redirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{ color: 'primary.main', wordBreak: 'break-all' }}
            >
              {redirectUrl}
            </Link>
          </Box>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Use this email to complete your registration: <strong>{email}</strong>
          </Typography>
        </Card>
      </ConfirmContainer>
    </WebLayout>
  );
}