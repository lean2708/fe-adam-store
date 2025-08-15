import type { RevenueByMonthDTO } from "@/api-client/models";
import type { TRevenueByMonth } from "@/types";

/**
 * Transform API RevenueByMonthDTO to TRevenueByMonth.
 */
export function transformRevenueByMonthDTOToTRevenueByMonth(apiRevenue: RevenueByMonthDTO): TRevenueByMonth {
    // Handle the month object - it might be a date string or object
    let month = 1;
    let year = new Date().getFullYear();
    
    if (apiRevenue.month) {
        if (typeof apiRevenue.month === 'string') {
            const date = new Date(apiRevenue.month);
            month = date.getMonth() + 1; // Convert to 1-based month
            year = date.getFullYear();
        } else if (typeof apiRevenue.month === 'object') {
            // If it's an object, try to extract month information
            const monthObj = apiRevenue.month as any;
            if (monthObj.month) {
                month = monthObj.month;
            }
            if (monthObj.year) {
                year = monthObj.year;
            }
        }
    }

    return {
        month,
        year,
        totalRevenue: apiRevenue.totalAmount || 0
    };
}

/**
 * Transform array of RevenueByMonthDTO to TRevenueByMonth array
 */
export function transformRevenueByMonthArrayToTRevenueByMonthArray(apiRevenues: RevenueByMonthDTO[]): TRevenueByMonth[] {
    return apiRevenues.map(transformRevenueByMonthDTOToTRevenueByMonth);
}
