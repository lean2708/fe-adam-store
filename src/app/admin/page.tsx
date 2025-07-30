'use client'

import polyglotI18nProvider from 'ra-i18n-polyglot';
import {
    Admin,
    Resource,
    localStorageStore,
    useStore,
    StoreContextProvider,
} from 'react-admin';
import { Configuration } from '@/api-client/configuration';

// Import admin components
import authProvider from './authProvider';
import categories from './categories';
import { Dashboard } from './dashboard';
import { createDataProvider } from './dataProvider';
import englishMessages from './i18n/en';
import invoices from './invoices';
import { Layout, Login } from './layout/index';
import orders from './orders';
import products from './products';
import reviews from './reviews';
import visitors from './visitors';
import { themes, ThemeName } from './themes/themes';

const i18nProvider = polyglotI18nProvider(
    locale => {
        if (locale === 'fr') {
            return import('./i18n/fr').then(messages => messages.default);
        }
        if (locale === 'vn') {
            return import('./demo/i18n/vn').then(messages => messages.default);
        }

        // Always fallback on english
        return englishMessages;
    },
    'en',
    [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'Français' },
        { locale: 'vn', name: 'VietNam' },
    ]
);

const store = localStorageStore(undefined, 'AdamStore');

type Props = {
    authConfigData?: {
        basePath?: string;
        baseOptions?: {
            headers?: {
                Authorization?: string;
            };
        };
    };
};

const AdminApp = (props: Props) => {
    const [themeName] = useStore<ThemeName>('themeName', 'soft');
    const singleTheme = themes.find(theme => theme.name === themeName)?.single;
    const lightTheme = themes.find(theme => theme.name === themeName)?.light;
    const darkTheme = themes.find(theme => theme.name === themeName)?.dark;
    
    // Create configuration from props
    const config = new Configuration(props.authConfigData || {});
    const dataProvider = createDataProvider(config);
    
    return (
        <Admin
            title="Adam Store Admin"
            dataProvider={dataProvider}
            store={store}
            authProvider={authProvider}
            dashboard={Dashboard}
            loginPage={Login}
            layout={Layout}
            i18nProvider={i18nProvider}
            disableTelemetry
            theme={singleTheme}
            lightTheme={lightTheme}
            darkTheme={darkTheme}
            defaultTheme="light"
            requireAuth
        >
            <Resource name="customers" {...visitors} />
            <Resource name="orders" {...orders} />
            <Resource name="invoices" {...invoices} />
            <Resource name="products" {...products} />
            <Resource name="categories" {...categories} />
            <Resource name="reviews" {...reviews} />
        </Admin>
    );
};

const AdminPageWrapper = (props?: Props) => (
    <StoreContextProvider value={store}>
        <AdminApp {...(props || {})} />
    </StoreContextProvider>
);

export default AdminPageWrapper;
