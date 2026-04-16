import { AuthTokenManager } from '@/scripts/authTokenManager';
import { useRouter } from 'expo-router';
import {
  Briefcase,
  ChevronRight,
  Crown,
  X
} from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';
import { useLeads } from '../../context/LeadContext';
import { subscriptionService } from '../../services/apiService';

// Define Lead interface
interface Lead {
  id: string | number;
  name?: string;
  fullName?: string;
  caseType?: string;
  service?: string;
  status: string;
  lastActive?: string;
  phone?: string;
  email?: string;
  unreadCount?: number;
}

interface SubscriptionData {
  end_date?: string;

}

const COLORS = {
  "In Progress": "#64748B",
  Declined: "#f30d0dff",
  Completed: "#22c55e",
} as const;

const STATUS_CONNECTION_MAP: Record<string, boolean> = {
  "In Progress": true,
  "Declined": false,
  "Completed": true,
};

type StatusType = keyof typeof COLORS;
type PieChartData = {
  value: number;
  color: string;
  text: string;
  name: string;
  onPress: () => void;
  focused: boolean;
};

interface LeadContextType {
  leads: Lead[];
  loading: boolean;
  refetchLeads: () => Promise<void>;
  updateLead: (lead: Lead) => Promise<void>;
  updateLeadStatus: (id: string | number, status: string) => Promise<void>;
}

export default function Dashboard() {
  // Cast strict type to context return value
  const { leads, loading, refetchLeads } = useLeads() as LeadContextType;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [subLoading, setSubLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Refetch leads on mount to ensure we have data after login
  useEffect(() => {
    refetchLeads();
    fetchSubscription();
  }, []);
  const fetchSubscription = async () => {
    try {
      setSubLoading(true);
      const res = await subscriptionService.getSubscription();
      console.log("Subscription response:", res);
      if (res && res.data && res.data.length > 0 && res.data[0].subscription_end_date) {
        console.log("Subscription end date:", res.data[0].subscription_end_date);
        setSubscription({
          end_date: res.data[0].subscription_end_date,
        });
      }
    } catch (err) {
      console.error("Failed to fetch subscription:", err);
    } finally {
      setSubLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Check if token exists
      const token = await AuthTokenManager.getToken();
      console.log('from onRefresh', token)
      if (!token) {
        router.replace('/');
        return;
      }

      await Promise.all([
        refetchLeads(),
        fetchSubscription(),
        // authService.validateLogin()
      ]);
    } catch (err: any) {
      console.error("Refresh failed:", err);
      // If it's an auth error (401), redirect to login
      if (err.response?.status === 401 || err.message?.includes('401')) {
        router.replace('/');
      }
    } finally {
      setRefreshing(false);
    }
  };

  // Calculate stats for the chart
  const chartData = useMemo(() => {
    const stats: Record<string, number> = {};
    leads.forEach((lead) => {
      const statusKey = lead.status || "Unknown";
      stats[statusKey] = (stats[statusKey] || 0) + 1;
    });

    const data = Object.entries(stats).map(([name, value]) => {
      // Safe access to COLORS
      const color = (name in COLORS) ? COLORS[name as StatusType] : '#cccccc';

      return {
        value,
        color,
        text: String(value), // For label if needed
        name: name, // Custom property for identification
        onPress: () => {
          setStatusFilter(prev => prev === name ? null : name);
        },
        // Highlighting effect
        focused: statusFilter === name,
      }; // Close object
    }); // Close map

    // Adjust data if focused to pop out or stroke
    return data.map(item => {
      if (statusFilter && item.name !== statusFilter) {
        return { ...item, color: item.color + '50' }; // Fade others
      }
      return item;
    });
  }, [leads, statusFilter]);

  const filteredLeads = leads.filter((lead) => {
    if (!lead) return false;

    const name = lead.name || lead.fullName || "";
    const caseType = lead.caseType || lead.service || "";
    const status = lead.status || "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter
      ? status === statusFilter
      : true;
    return matchesSearch && matchesStatus;
  });

  const onSelectLead = (lead: Lead) => {
    router.push({
      pathname: "/LeadDetails",
      params: {
        id: String(lead.id),
        name: lead.name || lead.fullName || "",
        caseType: lead.caseType || lead.service || "",
        status: lead.status,
        lastActive: lead.lastActive || "",
        phone: lead.phone || '9876543210',
        email: lead.email || ""
      }
    });
  };

  const getStatusStyle = (status: string) => {
    const color = (status in COLORS) ? COLORS[status as StatusType] : theme.icon;
    return { bg: color, text: '#fff', border: color };
  };

  // Components for FlatList
  const SubscriptionBanner = () => {
    if (subLoading && !subscription) return null;

    const endDateStr = subscription?.end_date;
    console.log("Subscription end date:", subscription);
    if (!endDateStr) {
      // If no subscription data, maybe show a generic "Get Premium" banner or hide it
      return (
        <TouchableOpacity
          style={styles.bannerContainer}
          onPress={() => Linking.openURL('https://jplawsuvidha.com/signup/')}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerLeft}>
              <View style={styles.crownIcon}>
                <Crown size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.bannerTitle}>Unlock Premium Features</Text>
                <Text style={styles.bannerSubtitle}>Get access to advanced tools and insights</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#fff" style={styles.bannerChevron} />
          </View>
        </TouchableOpacity>
      );
    }

    const endDate = new Date(endDateStr);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let title = "";
    let subtitle = "";
    let bannerColor = '#171717';

    if (diffDays < 0) {
      title = "Subscription Expired";
      subtitle = "Renew now to restore premium features";
      bannerColor = '#450a0a'; // Dark red for expired
    } else if (diffDays === 0) {
      title = "Subscription Expires Today";
      subtitle = "Renew now to avoid service interruption";
    } else if (diffDays <= 7) {
      title = `Subscription expires in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
      subtitle = "Renew now to keep your premium features";
    } else {
      title = "Plan Active";
      subtitle = `Valid until ${endDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`;
    }

    return (
      <TouchableOpacity
        style={[styles.bannerContainer, { backgroundColor: bannerColor }, { borderWidth: 1, borderColor: colorScheme === 'dark' ? '#1E293B' : '#F1F5F9' }]}
        onPress={() => Linking.openURL('https://jplawsuvidha.com/signup/')}
      >
        <View style={[styles.bannerContent, { backgroundColor: bannerColor }]}>
          <View style={styles.bannerLeft}>
            <View style={styles.crownIcon}>
              <Crown size={20} color="#fff" />
            </View>
            <View>
              <Text style={styles.bannerTitle}>{title}</Text>
              <Text style={styles.bannerSubtitle}>{subtitle}</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#fff" style={styles.bannerChevron} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={{ backgroundColor: theme.background }}>
      <SubscriptionBanner />
      <View style={[styles.chartSection, { backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#f9fafb', borderBottomColor: colorScheme === 'dark' ? '#1E293B' : '#f5f5f5' }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }, { fontFamily: 'Poppins-Medium' }]}>Lead Status Overview</Text>

        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            donut
            radius={80}
            innerRadius={55}
            innerCircleColor={colorScheme === 'dark' ? '#0F172A' : '#f9fafb'} // matches chartSection bg
            centerLabelComponent={() => {
              return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, fontWeight: 'bold', color: theme.text }}>
                    {filteredLeads.length}
                  </Text>
                  <Text style={{ fontSize: 12, color: theme.sub }}>Total</Text>
                </View>
              );
            }}
          />

          {/* Legend / Filter Indicator */}
          {statusFilter ? (
            <TouchableOpacity
              style={[styles.filterBadge, { backgroundColor: theme.background, borderColor: colorScheme === 'dark' ? '#334155' : '#e5e5e5' }]}
              onPress={() => setStatusFilter(null)}
            >
              <Text style={[styles.filterText, { color: theme.text }]}>Filtering by: <Text style={{ fontWeight: '700' }}>{statusFilter}</Text></Text>
              <X size={14} color={theme.icon} />
            </TouchableOpacity>
          ) : (
            <View style={styles.legendContainer}>
              {Object.entries(COLORS).map(([status, color]) => (
                <View key={status} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: color }]} />
                  <Text style={[styles.legendText, { color: theme.sub }]}>{status}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={[styles.listSection, { paddingBottom: 0 }]}>
        <View style={styles.listHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Leads ({filteredLeads.length})</Text>
          {/* <View style={[styles.searchContainer, { backgroundColor: colorScheme === 'dark' ? '#e8edf6ff' : '#f9fafb' }]}>
            <Search size={14} color={theme.icon} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: 'black' }]}
              placeholder="Search..."
              placeholderTextColor={'black'}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View> */}
        </View>
      </View>
    </View>
  );

  const renderItem: ListRenderItem<Lead> = ({ item: lead }) => {

    const statusStyle = getStatusStyle(lead.status);
    return (
      <TouchableOpacity
        style={[styles.leadCard, { backgroundColor: theme.background, borderColor: colorScheme === 'dark' ? '#334155' : '#f5f5f5' }]}
        onPress={() => onSelectLead(lead)}
      >
        <View style={[styles.leadIconContainer, { backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#f5f5f5' }]}>
          <Briefcase size={20} color={theme.sub} />
        </View>

        <View style={styles.leadContent}>
          <View style={styles.leadRowMain}>
            <Text style={[styles.leadName, { color: theme.text }]} numberOfLines={1}>
              {lead.name || lead.fullName || "Unnamed Lead"}
            </Text>
            {/* <Text style={styles.leadTime}>{lead.lastActive}</Text> */}
          </View>
          <View style={styles.leadRowSub}>
            <Text style={[styles.leadCaseType, { color: theme.sub }]}>
              {lead.caseType || lead.service || "General Inquiry"}
            </Text>
          </View>
        </View>

        {/* {lead.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{lead.unreadCount}</Text>
                    </View>
                )} */}
        <View style={styles.leadRight}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                { color: statusStyle.text }
              ]}
            >
              {lead.status}
            </Text>
          </View>

          <ChevronRight size={16} color={theme.text} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyText, { color: theme.cal }]}>No leads found.</Text>
      <TouchableOpacity onPress={() => { setSearchTerm(''); setStatusFilter(null); }}>
        <Text style={[styles.clearFilterLink, { color: theme.text }]}>Clear filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {loading && leads.length === 0 ? (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.text} />
          <Text style={{ marginTop: 10, color: theme.text }}>Fetching leads...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredLeads}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={{ paddingBottom: 100, backgroundColor: theme.background }}
          showsVerticalScrollIndicator={false}
          style={[styles.flatList, { backgroundColor: theme.background }]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.tint]} // Android
              tintColor={theme.tint} // iOS
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5'
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#525252'
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#171717'
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#737373'
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8
  },
  iconBtn: {
    padding: 8
  },
  flatList: {
    flex: 1,
  },
  chartSection: {
    padding: 16,
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  filterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 24
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  listSection: {
    padding: 16
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 32,
    width: 150
  },
  searchIcon: {
    marginRight: 6
  },
  leadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginHorizontal: 16,
  },
  leadIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leadContent: {
    flex: 1,
    gap: 4
  },
  leadRowMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leadTime: {
    fontSize: 10,
    color: '#a3a3a3'
  },
  leadRowSub: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statusBadge: {
    width: 70,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 0
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  unreadText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold'
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8
  },
  bannerContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#171717',
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  crownIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#facc15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  bannerSubtitle: {
    color: '#a3a3a3',
    fontSize: 12,
    marginTop: 2,
    fontFamily: 'Poppins-Medium',
  },
  bannerChevron: {
    opacity: 0.8,
  },
  leadRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
    letterSpacing: -0.5,
    alignSelf: 'flex-start',
    marginBottom: 16
  },
  leadName: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  leadCaseType: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    textTransform: 'uppercase',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  clearFilterLink: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    textDecorationLine: 'underline',
  },
  filterText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    padding: 0,
  },
});
