import { getCookie } from "@/lib/cookies";
import { Configuration } from "./configuration";

/**
 * Returns a Configuration instance with Authorization header if token is provided.
 */
export async function getAuthConfiguration() { 
    const token = await getCookie("token"); 

    return new Configuration({
        baseOptions: token ?
            {
                headers:
                    { Authorization: `Bearer ${token}`, },
            } : {},
    });
}
