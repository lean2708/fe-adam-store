// Next.js layout for admin panel
import { getAuthConfiguration } from '@/api-client/init-auth-config';
import AdminPage from './page';

export default async function AdminLayout() {
    let authConfigData = undefined;

    try {
        // Get authentication configuration on the server side
        const authConfig = await getAuthConfiguration();

        // Extract only the plain data we need for the client component
        authConfigData = {
            basePath: authConfig?.basePath || undefined,
            baseOptions: authConfig?.baseOptions ? {
                headers: authConfig.baseOptions.headers ? {
                    Authorization: authConfig.baseOptions.headers.Authorization || undefined
                } : undefined
            } : undefined
        };
    } catch (error) {
        console.warn('Failed to get auth configuration:', error);
        // Continue with undefined authConfigData
    }

    // For the admin route, we'll render the AdminPage directly with auth config
    // This is a workaround since Next.js doesn't allow passing props to page components directly
    return <AdminPage authConfigData={authConfigData} />;
}
