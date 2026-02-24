import axios from 'axios';

const GAS_URL = import.meta.env.VITE_GAS_URL;

export interface CompanyColors {
    id: string;
    title: string | null;
    accent: string | null;
    form_bg: string | null;
    surface: string | null;
    text_dim: string | null;
    background: string | null;
    company_id: string;
    text_color: string | null;
    button_text: string | null;
    primary_color: string | null;
    secondary_color: string | null;
    company_name?: string; // Added to show the name on the card
}

export interface CompanyResponse {
    id: string;
    name: string;
    colors_company: CompanyColors[];
}

export const fetchCompanies = async (): Promise<CompanyColors[]> => {
    try {
        const response = await axios.get<CompanyResponse[]>(`${GAS_URL}?action=getCompanyAdm`);
        console.log('API Response:', response.data);

        if (!Array.isArray(response.data)) {
            console.error('API did not return an array');
            return [];
        }

        // Flatten all colors from all companies
        const allColors = response.data.flatMap(company =>
            (company.colors_company || []).map(color => ({
                ...color,
                company_name: company.name
            }))
        );

        return allColors;
    } catch (error) {
        console.error('Error fetching companies:', error);
        return [];
    }
};

export const updateCompanyColors = async (payload: Partial<CompanyColors>): Promise<boolean> => {
    const response = await axios.post(GAS_URL, {
        action: 'updateColorCompany',
        ...payload
    }, {
        headers: {
            'Content-Type': 'text/plain;charset=utf-8' // GAS often requires text/plain for POST to avoid preflight issues
        }
    });
    return response.status === 200;
};
