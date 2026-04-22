import { createContext, useContext, useState } from 'react';
import { leadService } from '../services/apiService';
// import { useNotification } from './NotificationContext';
const LeadContext = createContext(null);

export const useLeads = () => {
    const context = useContext(LeadContext);
    if (!context) {
        throw new Error('useLeads must be used inside LeadProvider');
    }
    return context;
};

export const LeadProvider = ({ children }) => {
    // const { showNotification } = useNotification();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);

    const refetchLeads = async () => {
        setLoading(true);
        try {
            const res = await leadService.getLeads();

            if (res && res.success) {
                const extractedLeads = res.leads || res.data || [];
                setLeads(Array.isArray(extractedLeads) ? extractedLeads : []);
            } else if (Array.isArray(res)) {
                setLeads(res);
            } else if (res && (res.leads || res.data)) {
                // Fallback for cases where success property might be missing but data is present
                const extractedLeads = res.leads || res.data || [];
                setLeads(Array.isArray(extractedLeads) ? extractedLeads : []);
            } else {
                setLeads([]);
            }
        } catch (err) {
            // Error
        } finally {
            setLoading(false);
        }
    };

    /* 
    // API Fetch on Mount - Disabled to prevent fetching before login
    useEffect(() => {
        refetchLeads();
    }, []);
    */

    /**
     * Update entire lead object (used in LeadDetails)
     */
    const updateLead = async (updatedLead) => {
        const previousLeads = [...leads]; // Snapshot for rollback
        console.log('inside the updateLead..............', updatedLead.id)
        // 1. Optimistic Update (Immediate UI change)
        setLeads((prev) =>
            prev.map((lead) =>
                lead.id.toString() === updatedLead.id.toString()
                    ? { ...lead, ...updatedLead }
                    : lead
            )
        );

        // 2. Persist to API
        try {
            // API Call Placeholder:
            await leadService.updateLead(updatedLead.id, updatedLead);
        } catch (err) {
            // 3. Rollback on failure
            setLeads(previousLeads);
            showNotification('Failed to save changes. Reverting...', 'error');
        }
    };

    /**
     * Update only lead status (optional utility)
     */
    const updateLeadStatus = async (id, status, connected, reason) => {
        const previousLeads = [...leads];

        // 1. Optimistic Update
        setLeads((prev) =>
            prev.map((lead) =>
                lead.id.toString() === id.toString()
                    ? { ...lead, status, connected, reason }
                    : lead
            )
        );

        try {
            console.log('inside the updateLeadStatus', id, status, connected, reason);
            await leadService.updateLead(id, { status, connected, reason });
        } catch (err) {
            // 3. Rollback on failure
            setLeads(previousLeads);
            showNotification('Status update failed. Reverting...', 'error');
        }
    };

    return (
        <LeadContext.Provider
            value={{
                leads,
                loading,
                refetchLeads,
                updateLead,
                updateLeadStatus,
            }}
        >
            {children}
        </LeadContext.Provider>
    );
};

export default LeadContext;
