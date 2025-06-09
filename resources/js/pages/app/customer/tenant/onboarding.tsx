import * as React from 'react';
import { Head, useForm } from '@inertiajs/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import WebLayout from '@/layouts/web-layout';
import SitemarkIcon from '@/components/www/SitemarkIcon';
import Stack from '@mui/material/Stack';

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

const OnboardingContainer = styled(Stack)(({ theme }) => ({
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

export default function OnboardingForm({ initialEmail }: { initialEmail?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: initialEmail || '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route('tenant.onboarding.store'));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(name as keyof typeof data, value);
  };

  return (
    <WebLayout>
      <Head title="Complete Setup" />
      <OnboardingContainer direction="column" justifyContent="space-between">
        <Card variant="outlined" component="form" onSubmit={handleSubmit}>
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Complete Setup
          </Typography>
          <TextField
            id="name"
            name="name"
            label="Name"
            fullWidth
            required
            value={data.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            id="email"
            name="email"
            label="Email"
            type="email"
            fullWidth
            required
            value={data.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            disabled={!!initialEmail} // Deshabilitar si viene de registro
            InputProps={{
              readOnly: !!initialEmail, // Hacerlo de solo lectura
            }}
          />
          <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            required
            value={data.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            id="password_confirmation"
            name="password_confirmation"
            label="Confirm Password"
            type="password"
            fullWidth
            required
            value={data.password_confirmation}
            onChange={handleChange}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Complete Setup'}
          </Button>
        </Card>
      </OnboardingContainer>
    </WebLayout>
  );
}