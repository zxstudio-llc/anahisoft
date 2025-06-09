import { dataDisplayCustomizations } from '@/layouts/web/dataDisplay';
import { feedbackCustomizations } from '@/layouts/web/feedback';
import { inputsCustomizations } from '@/layouts/web/inputs';
import { navigationCustomizations } from '@/layouts/web/navigation';
import { surfacesCustomizations } from '@/layouts/web/surfaces';
import { colorSchemes, shadows, shape, typography } from '@/types/themePrimitives';
import type { ThemeOptions } from '@mui/material/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import * as React from 'react';
import AppAppBar from '@/components/www/AppAppBar';
import CssBaseline from '@mui/material/CssBaseline';

interface WebLayoutProps {
    children: React.ReactNode;
    disableCustomTheme?: boolean;
    themeComponents?: ThemeOptions['components'];
}

export default function WebLayout(props: WebLayoutProps) {
    const { children, disableCustomTheme, themeComponents } = props;
    const theme = React.useMemo(() => {
        return disableCustomTheme
            ? {}
            : createTheme({
                  cssVariables: {
                      colorSchemeSelector: 'data-mui-color-scheme',
                      cssVarPrefix: 'template',
                  },
                  colorSchemes,
                  typography,
                  shadows,
                  shape,
                  components: {
                      ...inputsCustomizations,
                      ...dataDisplayCustomizations,
                      ...feedbackCustomizations,
                      ...navigationCustomizations,
                      ...surfacesCustomizations,
                      ...themeComponents,
                  },
              });
    }, [disableCustomTheme, themeComponents]);
    if (disableCustomTheme) {
        return <React.Fragment>{children}</React.Fragment>;
    }
    return (
        <ThemeProvider theme={theme} disableTransitionOnChange>
            <CssBaseline enableColorScheme />
            <AppAppBar/>
            {children}
        </ThemeProvider>
    );
}
