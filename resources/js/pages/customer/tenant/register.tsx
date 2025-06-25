import * as React from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Link,
  Stack,
  TextField,
  Typography,
  Card as MuiCard,
  Select,
  MenuItem,
  InputLabel,
  CssBaseline,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Loader } from 'lucide-react';

import WebLayout from '@/layouts/web-layout';
import ColorModeSelect from '@/layouts/web/ColorModeSelect';
import SitemarkIcon from '@/components/www/SitemarkIcon';

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

const SignUpContainer = styled(Stack)(({ theme }) => ({
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

export default function TenantRegister({ plans, disableCustomTheme }: { plans: any[], disableCustomTheme?: boolean }) {
  const { data, setData, post, processing, errors } = useForm({
    domain: '',
    company_name: '',
    ruc: '',
    email: '',
    plan_id: '',
    phone: '',
    address: '',
    legal_representative: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route('tenant.register'));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(name as keyof typeof data, value);
    
    // Autocompletar company_name con el domain si está vacío
    if (name === 'domain' && !data.company_name) {
      setData('company_name', value);
    }
  };

  return (
    <WebLayout {...{ disableCustomTheme }}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Head title="Register Tenant" />
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Register Tenant
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            {/* Dominio */}
            <FormControl>
              <FormLabel htmlFor="domain">Subdomain</FormLabel>
              <Box display="flex" alignItems="center" gap={1}>
                <TextField
                  id="domain"
                  name="domain"
                  required
                  fullWidth
                  placeholder="your-subdomain"
                  value={data.domain}
                  onChange={handleChange}
                  error={!!errors.domain}
                  helperText={errors.domain}
                  disabled={processing}
                />
                <Typography variant="body2" color="text.secondary">
                  .anahisoft.test
                </Typography>
              </Box>
            </FormControl>

            {/* Nombre de la compañía */}
            <TextField
              id="company_name"
              name="company_name"
              label="Company Name"
              required
              fullWidth
              value={data.company_name}
              onChange={handleChange}
              error={!!errors.company_name}
              helperText={errors.company_name}
            />

            {/* RUC */}
            <TextField
              id="ruc"
              name="ruc"
              label="RUC"
              required
              fullWidth
              inputProps={{ maxLength: 13 }}
              value={data.ruc}
              onChange={handleChange}
              error={!!errors.ruc}
              helperText={errors.ruc}
            />

            {/* Email */}
            <TextField
              id="email"
              name="email"
              label="Email"
              type="email"
              required
              fullWidth
              value={data.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />

            {/* Plan */}
            <FormControl fullWidth>
              <InputLabel id="plan-label">Plan</InputLabel>
              <Select
                labelId="plan-label"
                id="plan_id"
                name="plan_id"
                value={data.plan_id}
                onChange={(e) => setData('plan_id', e.target.value)}
                label="Plan"
                required
                error={!!errors.plan_id}
              >
                {plans.map((plan) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Teléfono */}
            <TextField
              id="phone"
              name="phone"
              label="Phone"
              fullWidth
              value={data.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />

            {/* Dirección */}
            <TextField
              id="address"
              name="address"
              label="Address"
              fullWidth
              value={data.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
            />

            {/* Representante Legal */}
            <TextField
              id="legal_representative"
              name="legal_representative"
              label="Legal Representative"
              fullWidth
              value={data.legal_representative}
              onChange={handleChange}
              error={!!errors.legal_representative}
              helperText={errors.legal_representative}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={processing}
              startIcon={processing ? <Loader className="animate-spin" /> : null}
            >
              Register Tenant
            </Button>
          </Box>
        </Card>
      </SignUpContainer>
    </WebLayout>
  );
}