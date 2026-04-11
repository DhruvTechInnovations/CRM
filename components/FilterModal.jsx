// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView,
//   Dimensions, Platform, SafeAreaView
// } from 'react-native';
// import { X, ChevronDown, ChevronUp } from 'lucide-react-native';

// const { width } = Dimensions.get('window');
// // Define drawer width relative to the screen size
// const RIGHT_DRAWER_WIDTH = width * 0.7;

// const FilterModal = ({ visible, onClose, onApplyFilter, filters, activeFilter }) => {
//   // Initialize expanded section, prioritizing 'Location' if no active filters
//   const [expandedSection, setExpandedSection] = useState(null);
//   const [selectedFilters, setSelectedFilters] = useState(activeFilter);

//   // Sync internal state with props when modal is opened
//   useEffect(() => {
//     setSelectedFilters(activeFilter);
//   }, [activeFilter, visible]);

//   // const toggleSection = (section) => {
//   //   // Toggles the section open/closed
//   //   setExpandedSection(expandedSection === section ? null : section);
//   // };
//   const toggleSection = useCallback((section) => {
//     setExpandedSection(prev => prev === section ? null : section);
//   }, []);

//   const handleSelectFilter = (filterType, value) => {
//     setSelectedFilters(prev => ({
//       ...prev,
//       // Toggle logic: if the value is already selected, set it to null (deselect)
//       [filterType]: prev[filterType] === value ? null : value,
//     }));
//     setExpandedSection(null);
//   };

//   const handleApply = () => {
//     onApplyFilter(selectedFilters);
//     onClose();
//   };

//   const handleClear = () => {
//     const clearedFilters = { location: null, court: null, CaseType: null, status: null };
//     onApplyFilter(clearedFilters);
//     setSelectedFilters(clearedFilters);
//     onClose();
//   };

//   const isLocationActive = (location) => selectedFilters.location === location;
//   const isCourtActive = (court) => selectedFilters.court === court;
//   const isCaseType = (CaseType) => selectedFilters.CaseType === CaseType;
//   const isStatus = (status) => selectedFilters.status === status;

//   return (
//     <Modal
//       // 'slide' is more appropriate for a right-drawer pattern
//       animationType="none"
//       transparent={true}
//       visible={visible}
//       onRequestClose={onClose}
//     >
//       {/* Outer TouchableOpacity serves as the overlay, allowing 
//         a tap outside the drawer to close the modal.
//       */}
//       <TouchableOpacity
//         style={styles.modalOverlay}
//         activeOpacity={1}
//         onPress={onClose}
//       >
//         {/* Inner TouchableOpacity prevents the tap event from bubbling up 
//           to the overlay when tapping *inside* the drawer content.
//         */}
//         <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
//           {/* Ensure content respects safe area, especially on iOS */}
//           <SafeAreaView style={{ flex: 1 }}>
//             <View style={styles.header}>
//               <Text style={styles.title}>Filters</Text>
//               <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//                 <X size={24} color="#555" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView contentContainerStyle={styles.content}
//               keyboardShouldPersistTaps="handled"
//               showsVerticalScrollIndicator={false}>
//               {/* Location Filter Section */}
//               <View style={styles.filterSection}>
//                 <TouchableOpacity onPress={() => toggleSection('Location')} style={styles.sectionHeader}>
//                   <Text style={[
//                     styles.sectionTitle,
//                     selectedFilters.location
//                       ? styles.activeText
//                       : styles.inactiveText
//                   ]}
//                   >{selectedFilters.location ? selectedFilters.location : 'Region'}</Text>
//                   {expandedSection === 'Location' ? (
//                     <ChevronUp size={20} color="#007bff" />
//                   ) : (
//                     <ChevronDown size={20} color="#007bff" />
//                   )}
//                 </TouchableOpacity>
//                 {expandedSection === 'Location' && (
//                   <View style={styles.sectionContent}>
//                     {/* All Locations option */}
//                     <TouchableOpacity
//                       onPress={() => handleSelectFilter('location', null)}
//                       style={[
//                         styles.filterOption,
//                         !selectedFilters.location && styles.activeFilterOption,
//                       ]}
//                     >
//                       <Text style={[styles.filterOptionText, !selectedFilters.location && styles.activeFilterText]}>All Locations</Text>
//                     </TouchableOpacity>
//                     {/* Dynamic location options */}
//                     {filters.locations.map((location) => (
//                       <TouchableOpacity
//                         key={location}
//                         onPress={() => handleSelectFilter('location', location)}
//                         style={[
//                           styles.filterOption,
//                           isLocationActive(location) && styles.activeFilterOption,
//                         ]}
//                       >
//                         <Text style={[styles.filterOptionText, isLocationActive(location) && styles.activeFilterText]}>{location}</Text>
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                 )}
//               </View>

//               {/* Court Filter Section */}
//               <View style={styles.filterSection}>
//                 <TouchableOpacity onPress={() => toggleSection('Court')} style={styles.sectionHeader}>
//                   <Text style={[
//                     styles.sectionTitle,
//                     selectedFilters.court
//                       ? styles.activeText
//                       : styles.inactiveText
//                   ]}>{selectedFilters.court ? selectedFilters.court : 'Jurisdiction'}</Text>
//                   {expandedSection === 'Court' ? (
//                     <ChevronUp size={20} color="#007bff" />
//                   ) : (
//                     <ChevronDown size={20} color="#007bff" />
//                   )}
//                 </TouchableOpacity>
//                 {expandedSection === 'Court' && (
//                   <View style={styles.sectionContent}>
//                     {/* All Courts option */}
//                     <TouchableOpacity
//                       onPress={() => handleSelectFilter('court', null)}
//                       style={[
//                         styles.filterOption,
//                         !selectedFilters.court && styles.activeFilterOption,
//                       ]}
//                     >
//                       <Text style={[styles.filterOptionText, !selectedFilters.court && styles.activeFilterText]}>All Courts</Text>
//                     </TouchableOpacity>
//                     {/* Dynamic court options */}
//                     {filters.courts.map((court) => (
//                       <TouchableOpacity
//                         key={court}
//                         onPress={() => handleSelectFilter('court', court)}
//                         style={[
//                           styles.filterOption,
//                           isCourtActive(court) && styles.activeFilterOption,
//                         ]}
//                       >
//                         <Text style={[styles.filterOptionText, isCourtActive(court) && styles.activeFilterText]}>{court}</Text>
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                 )}
//               </View>

//               {/* casetype filter */}
//               <View style={styles.filterSection}>
//                 <TouchableOpacity onPress={() => toggleSection('CaseType')} style={styles.sectionHeader}>
//                   <Text style={[
//                     styles.sectionTitle,
//                     selectedFilters.CaseType
//                       ? styles.activeText
//                       : styles.inactiveText
//                   ]}>{selectedFilters.CaseType ? selectedFilters.CaseType : 'CaseType'}</Text>
//                   {expandedSection === 'CaseType' ? (
//                     <ChevronUp size={20} color="#007bff" />
//                   ) : (
//                     <ChevronDown size={20} color="#007bff" />
//                   )}
//                 </TouchableOpacity>
//                 {expandedSection === 'CaseType' && (
//                   <View style={styles.sectionContent}>
//                     {/* All Courts option */}
//                     <TouchableOpacity
//                       onPress={() => handleSelectFilter('CaseType', null)}
//                       style={[
//                         styles.filterOption,
//                         !selectedFilters.CaseType && styles.activeFilterOption,
//                       ]}
//                     >
//                       <Text style={[styles.filterOptionText, !selectedFilters.CaseType && styles.activeFilterText]}>All Types</Text>
//                     </TouchableOpacity>
//                     {/* Dynamic casetype options */}
//                     {filters.CaseType.map((c) => (
//                       <TouchableOpacity
//                         key={c}
//                         onPress={() => handleSelectFilter('CaseType', c)}
//                         style={[
//                           styles.filterOption,
//                           isCaseType(c) && styles.activeFilterOption,
//                         ]}
//                       >
//                         <Text style={[styles.filterOptionText, isCaseType(c) && styles.activeFilterText]}>{c}</Text>
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                 )}
//               </View>

//               {/* status filter */}
//               <View style={styles.filterSection}>
//                 <TouchableOpacity onPress={() => toggleSection('status')} style={styles.sectionHeader}>
//                   <Text style={[
//                     styles.sectionTitle,
//                     selectedFilters.status
//                       ? styles.activeText
//                       : styles.inactiveText
//                   ]}>{selectedFilters.status ? selectedFilters.status : 'Status'}</Text>
//                   {expandedSection === 'status' ? (
//                     <ChevronUp size={20} color="#007bff" />
//                   ) : (
//                     <ChevronDown size={20} color="#007bff" />
//                   )}
//                 </TouchableOpacity>
//                 {expandedSection === 'status' && (
//                   <View style={styles.sectionContent}>
//                     {/* All Courts option */}
//                     <TouchableOpacity
//                       onPress={() => handleSelectFilter('status', null)}
//                       style={[
//                         styles.filterOption,
//                         !selectedFilters.status && styles.activeFilterOption,
//                       ]}
//                     >
//                       <Text style={[styles.filterOptionText, !selectedFilters.status && styles.activeFilterText]}>All Types</Text>
//                     </TouchableOpacity>
//                     {/* Dynamic casetype options */}
//                     {filters.status.map((c) => (
//                       <TouchableOpacity
//                         key={c}
//                         onPress={() => handleSelectFilter('status', c)}
//                         style={[
//                           styles.filterOption,
//                           isStatus(c) && styles.activeFilterOption,
//                         ]}
//                       >
//                         <Text style={[styles.filterOptionText, isStatus(c) && styles.activeFilterText]}>{c}</Text>
//                       </TouchableOpacity>
//                     ))}
//                   </View>
//                 )}
//               </View>
//             </ScrollView>

//             {/* Footer with Actions */}
//             <View style={styles.footer}>
//               <TouchableOpacity onPress={handleClear} style={[styles.footerBtn, styles.clearBtn]}>
//                 <Text style={[styles.footerBtnText, styles.clearBtnText]}>Clear All</Text>
//               </TouchableOpacity>
//               <TouchableOpacity onPress={handleApply} style={[styles.footerBtn, styles.applyBtn]}>
//                 <Text style={[styles.footerBtnText, styles.applyBtnText]}>Apply Filters</Text>
//               </TouchableOpacity>
//             </View>
//           </SafeAreaView>
//         </TouchableOpacity>
//       </TouchableOpacity>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     // Stretch to cover screen and position drawer to the right
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//     justifyContent: 'flex-end',
//     flexDirection: 'row',
//   },
//   modalContainer: {
//     width: RIGHT_DRAWER_WIDTH,
//     backgroundColor: 'white',
//     height: '100%',
//     // Use Platform.select for optimal shadow rendering across OSes
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: -5, height: 0 }, // Shadow to the left
//         shadowOpacity: 0.3,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 10, // Android standard for elevation
//       },
//       // Optional Web/Desktop styling if using React Native for Web
//       web: {
//         boxShadow: '-5px 0 10px rgba(0,0,0,0.15)',
//       }
//     }),
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 18,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: '700', // Stronger font weight
//     color: '#333',
//   },
//   closeButton: {
//     padding: 5,
//   },
//   content: {
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//   },
//   filterSection: {
//     marginBottom: 15,
//     borderRadius: 10, // Slightly more rounded corners
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     backgroundColor: '#f9f9f9',
//   },
//   sectionTitle: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: '#333',
//   },
//   sectionContent: {
//     padding: 5,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     backgroundColor: '#fff',
//   },
//   filterOption: {
//     paddingVertical: 14,
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     marginBottom: 4,
//     backgroundColor: '#fff',
//   },
//   activeFilterOption: {
//     backgroundColor: '#e6f3ff', // Light Blue Background for active state
//   },
//   filterOptionText: {
//     fontSize: 16,
//     color: '#555',
//   },
//   activeFilterText: {
//     fontWeight: '600',
//     color: '#007bff', // Primary Blue Text for active state
//   },
//   footer: {
//     flexDirection: 'row',
//     borderTopWidth: 1,
//     borderTopColor: '#ddd',
//     padding: 15,
//     justifyContent: 'space-between',
//     backgroundColor: 'white', // Ensure footer is always visible over content
//   },
//   footerBtn: {
//     paddingVertical: 12,
//     borderRadius: 10,
//     alignItems: 'center',
//     flex: 1,
//     // Add touch feedback (e.g., opacity) for better UX
//     opacity: 0.95,
//   },
//   clearBtn: {
//     backgroundColor: '#fff',
//     marginRight: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   clearBtnText: {
//     color: '#555',
//   },
//   applyBtn: {
//     backgroundColor: '#007bff', // Primary Blue for Apply
//     marginLeft: 10,
//   },
//   applyBtnText: {
//     color: 'white',
//   },
//   footerBtnText: {
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   activeText: {
//     fontSize: 17,
//     fontWeight: '300',
//     color: '#0864efff',
//   },
// });

// export default FilterModal;






import { ChevronDown, ChevronUp, X } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const RIGHT_DRAWER_WIDTH = width * 0.85;

// Ultra Professional Advocate Theme Colors
const COLORS = {
  primary: '#1e3a8a', // Deep Navy Blue
  primaryLight: '#2563eb',
  primaryLighter: '#dbeafe',
  primaryDark: '#1e293b',
  accent: '#d97706', // Amber accent
  accentLight: '#fef3c7',
  background: '#f8fafc',
  cardBg: '#ffffff',
  text: {
    primary: '#0f172a',
    secondary: '#334155',
    muted: '#64748b',
    light: '#94a3b8',
  },
  border: {
    light: '#e2e8f0',
    medium: '#cbd5e1',
    dark: '#94a3b8',
  },
  shadow: 'rgba(15, 23, 42, 0.08)',
};

const FilterModal = ({ visible, onClose, onApplyFilter, filters, activeFilter }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState(activeFilter);

  useEffect(() => {
    setSelectedFilters(activeFilter);
  }, [activeFilter, visible]);

  const toggleSection = useCallback((section) => {
    setExpandedSection(prev => prev === section ? null : section);
  }, []);

  const handleSelectFilter = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? null : value,
    }));
    setExpandedSection(null);
  };

  const handleApply = () => {
    onApplyFilter(selectedFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters = { location: null, court: null, CaseType: null, status: null };
    onApplyFilter(clearedFilters);
    setSelectedFilters(clearedFilters);
    onClose();
  };

  const isLocationActive = (location) => selectedFilters.location === location;
  const isCourtActive = (court) => selectedFilters.court === court;
  const isCaseType = (CaseType) => selectedFilters.CaseType === CaseType;
  const isStatus = (status) => selectedFilters.status === status;

  // Count active filters
  const activeFilterCount = Object.values(selectedFilters).filter(v => v !== null).length;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity style={styles.modalContainer} activeOpacity={1}>
          <SafeAreaView style={{ flex: 1 }}>
            {/* Premium Header */}
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <View style={styles.headerLeft}>
                  <View style={styles.headerIconWrapper}>
                    <View style={styles.headerIconContainer}>
                      <Text style={styles.headerIcon}>⚖️</Text>
                    </View>
                    <View style={styles.headerIconGlow} />
                  </View>
                  <View style={styles.headerTextContainer}>
                    <Text style={styles.title}>Case Filters</Text>
                    <Text style={styles.subtitle}>
                      {activeFilterCount > 0
                        ? `${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied`
                        : 'Refine your search criteria'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <View style={styles.closeButtonInner}>
                    <X size={20} color={COLORS.text.secondary} strokeWidth={2.5} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Location Filter Section */}
              <View style={styles.filterSection}>
                <TouchableOpacity
                  onPress={() => toggleSection('Location')}
                  style={styles.sectionHeader}
                  activeOpacity={0.7}
                >
                  <View style={styles.sectionHeaderLeft}>
                    <View style={[
                      styles.sectionIconContainer,
                      selectedFilters.location && styles.sectionIconContainerActive
                    ]}>
                      <Text style={styles.sectionIcon}>📍</Text>
                    </View>
                    <View style={styles.sectionTextContainer}>
                      <Text style={styles.sectionLabel}>REGION</Text>
                      <Text style={[
                        styles.sectionValue,
                        selectedFilters.location && styles.sectionValueActive
                      ]}>
                        {selectedFilters.location || 'All Locations'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.chevronContainer}>
                    {expandedSection === 'Location' ? (
                      <ChevronUp size={20} color={COLORS.primary} strokeWidth={2.5} />
                    ) : (
                      <ChevronDown size={20} color={COLORS.text.muted} strokeWidth={2.5} />
                    )}
                  </View>
                </TouchableOpacity>
                {expandedSection === 'Location' && (
                  <View style={styles.sectionContent}>
                    <TouchableOpacity
                      onPress={() => handleSelectFilter('location', null)}
                      style={[
                        styles.filterOption,
                        !selectedFilters.location && styles.activeFilterOption,
                      ]}
                      activeOpacity={0.7}
                    >
                      <View style={styles.filterOptionContent}>
                        <View style={[
                          styles.radioButton,
                          !selectedFilters.location && styles.radioButtonActive
                        ]}>
                          {!selectedFilters.location && (
                            <View style={styles.radioButtonInner} />
                          )}
                        </View>
                        <Text style={[
                          styles.filterOptionText,
                          !selectedFilters.location && styles.activeFilterText
                        ]}>
                          All Locations
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {filters.locations.map((location) => (
                      <TouchableOpacity
                        key={location}
                        onPress={() => handleSelectFilter('location', location)}
                        style={[
                          styles.filterOption,
                          isLocationActive(location) && styles.activeFilterOption,
                        ]}
                        activeOpacity={0.7}
                      >
                        <View style={styles.filterOptionContent}>
                          <View style={[
                            styles.radioButton,
                            isLocationActive(location) && styles.radioButtonActive
                          ]}>
                            {isLocationActive(location) && (
                              <View style={styles.radioButtonInner} />
                            )}
                          </View>
                          <Text style={[
                            styles.filterOptionText,
                            isLocationActive(location) && styles.activeFilterText
                          ]}>
                            {location}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Court Filter Section */}
              <View style={styles.filterSection}>
                <TouchableOpacity
                  onPress={() => toggleSection('Court')}
                  style={styles.sectionHeader}
                  activeOpacity={0.7}
                >
                  <View style={styles.sectionHeaderLeft}>
                    <View style={[
                      styles.sectionIconContainer,
                      selectedFilters.court && styles.sectionIconContainerActive
                    ]}>
                      <Text style={styles.sectionIcon}>🏛️</Text>
                    </View>
                    <View style={styles.sectionTextContainer}>
                      <Text style={styles.sectionLabel}>JURISDICTION</Text>
                      <Text style={[
                        styles.sectionValue,
                        selectedFilters.court && styles.sectionValueActive
                      ]}>
                        {selectedFilters.court || 'All Courts'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.chevronContainer}>
                    {expandedSection === 'Court' ? (
                      <ChevronUp size={20} color={COLORS.primary} strokeWidth={2.5} />
                    ) : (
                      <ChevronDown size={20} color={COLORS.text.muted} strokeWidth={2.5} />
                    )}
                  </View>
                </TouchableOpacity>
                {expandedSection === 'Court' && (
                  <View style={styles.sectionContent}>
                    <TouchableOpacity
                      onPress={() => handleSelectFilter('court', null)}
                      style={[
                        styles.filterOption,
                        !selectedFilters.court && styles.activeFilterOption,
                      ]}
                      activeOpacity={0.7}
                    >
                      <View style={styles.filterOptionContent}>
                        <View style={[
                          styles.radioButton,
                          !selectedFilters.court && styles.radioButtonActive
                        ]}>
                          {!selectedFilters.court && (
                            <View style={styles.radioButtonInner} />
                          )}
                        </View>
                        <Text style={[
                          styles.filterOptionText,
                          !selectedFilters.court && styles.activeFilterText
                        ]}>
                          All Courts
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {filters.courts.map((court) => (
                      <TouchableOpacity
                        key={court}
                        onPress={() => handleSelectFilter('court', court)}
                        style={[
                          styles.filterOption,
                          isCourtActive(court) && styles.activeFilterOption,
                        ]}
                        activeOpacity={0.7}
                      >
                        <View style={styles.filterOptionContent}>
                          <View style={[
                            styles.radioButton,
                            isCourtActive(court) && styles.radioButtonActive
                          ]}>
                            {isCourtActive(court) && (
                              <View style={styles.radioButtonInner} />
                            )}
                          </View>
                          <Text style={[
                            styles.filterOptionText,
                            isCourtActive(court) && styles.activeFilterText
                          ]}>
                            {court}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* CaseType Filter Section */}
              <View style={styles.filterSection}>
                <TouchableOpacity
                  onPress={() => toggleSection('CaseType')}
                  style={styles.sectionHeader}
                  activeOpacity={0.7}
                >
                  <View style={styles.sectionHeaderLeft}>
                    <View style={[
                      styles.sectionIconContainer,
                      selectedFilters.CaseType && styles.sectionIconContainerActive
                    ]}>
                      <Text style={styles.sectionIcon}>📋</Text>
                    </View>
                    <View style={styles.sectionTextContainer}>
                      <Text style={styles.sectionLabel}>CASE TYPE</Text>
                      <Text style={[
                        styles.sectionValue,
                        selectedFilters.CaseType && styles.sectionValueActive
                      ]}>
                        {selectedFilters.CaseType || 'All Types'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.chevronContainer}>
                    {expandedSection === 'CaseType' ? (
                      <ChevronUp size={20} color={COLORS.primary} strokeWidth={2.5} />
                    ) : (
                      <ChevronDown size={20} color={COLORS.text.muted} strokeWidth={2.5} />
                    )}
                  </View>
                </TouchableOpacity>
                {expandedSection === 'CaseType' && (
                  <View style={styles.sectionContent}>
                    <TouchableOpacity
                      onPress={() => handleSelectFilter('CaseType', null)}
                      style={[
                        styles.filterOption,
                        !selectedFilters.CaseType && styles.activeFilterOption,
                      ]}
                      activeOpacity={0.7}
                    >
                      <View style={styles.filterOptionContent}>
                        <View style={[
                          styles.radioButton,
                          !selectedFilters.CaseType && styles.radioButtonActive
                        ]}>
                          {!selectedFilters.CaseType && (
                            <View style={styles.radioButtonInner} />
                          )}
                        </View>
                        <Text style={[
                          styles.filterOptionText,
                          !selectedFilters.CaseType && styles.activeFilterText
                        ]}>
                          All Types
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {filters.CaseType.map((c) => (
                      <TouchableOpacity
                        key={c}
                        onPress={() => handleSelectFilter('CaseType', c)}
                        style={[
                          styles.filterOption,
                          isCaseType(c) && styles.activeFilterOption,
                        ]}
                        activeOpacity={0.7}
                      >
                        <View style={styles.filterOptionContent}>
                          <View style={[
                            styles.radioButton,
                            isCaseType(c) && styles.radioButtonActive
                          ]}>
                            {isCaseType(c) && (
                              <View style={styles.radioButtonInner} />
                            )}
                          </View>
                          <Text style={[
                            styles.filterOptionText,
                            isCaseType(c) && styles.activeFilterText
                          ]}>
                            {c}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Status Filter Section */}
              <View style={styles.filterSection}>
                <TouchableOpacity
                  onPress={() => toggleSection('status')}
                  style={styles.sectionHeader}
                  activeOpacity={0.7}
                >
                  <View style={styles.sectionHeaderLeft}>
                    <View style={[
                      styles.sectionIconContainer,
                      selectedFilters.status && styles.sectionIconContainerActive
                    ]}>
                      <Text style={styles.sectionIcon}>🔔</Text>
                    </View>
                    <View style={styles.sectionTextContainer}>
                      <Text style={styles.sectionLabel}>STATUS</Text>
                      <Text style={[
                        styles.sectionValue,
                        selectedFilters.status && styles.sectionValueActive
                      ]}>
                        {selectedFilters.status || 'All Statuses'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.chevronContainer}>
                    {expandedSection === 'status' ? (
                      <ChevronUp size={20} color={COLORS.primary} strokeWidth={2.5} />
                    ) : (
                      <ChevronDown size={20} color={COLORS.text.muted} strokeWidth={2.5} />
                    )}
                  </View>
                </TouchableOpacity>
                {expandedSection === 'status' && (
                  <View style={styles.sectionContent}>
                    <TouchableOpacity
                      onPress={() => handleSelectFilter('status', null)}
                      style={[
                        styles.filterOption,
                        !selectedFilters.status && styles.activeFilterOption,
                      ]}
                      activeOpacity={0.7}
                    >
                      <View style={styles.filterOptionContent}>
                        <View style={[
                          styles.radioButton,
                          !selectedFilters.status && styles.radioButtonActive
                        ]}>
                          {!selectedFilters.status && (
                            <View style={styles.radioButtonInner} />
                          )}
                        </View>
                        <Text style={[
                          styles.filterOptionText,
                          !selectedFilters.status && styles.activeFilterText
                        ]}>
                          All Statuses
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {filters.status.map((c) => (
                      <TouchableOpacity
                        key={c}
                        onPress={() => handleSelectFilter('status', c)}
                        style={[
                          styles.filterOption,
                          isStatus(c) && styles.activeFilterOption,
                        ]}
                        activeOpacity={0.7}
                      >
                        <View style={styles.filterOptionContent}>
                          <View style={[
                            styles.radioButton,
                            isStatus(c) && styles.radioButtonActive
                          ]}>
                            {isStatus(c) && (
                              <View style={styles.radioButtonInner} />
                            )}
                          </View>
                          <Text style={[
                            styles.filterOptionText,
                            isStatus(c) && styles.activeFilterText
                          ]}>
                            {c}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Premium Footer */}
            <View style={styles.footer}>
              <View style={styles.footerContent}>
                <TouchableOpacity
                  onPress={handleClear}
                  style={[styles.footerBtn, styles.clearBtn]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.clearBtnText}>Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleApply}
                  style={[styles.footerBtn, styles.applyBtn]}
                  activeOpacity={0.8}
                >
                  <View style={styles.applyBtnContent}>
                    <Text style={styles.applyBtnText}>Apply Filters</Text>
                    {activeFilterCount > 0 && (
                      <View style={styles.filterBadge}>
                        <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  modalContainer: {
    width: RIGHT_DRAWER_WIDTH,
    backgroundColor: COLORS.background,
    height: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: -6, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 24,
      },
    }),
  },
  header: {
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  headerIconWrapper: {
    position: 'relative',
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerIconGlow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.15,
    top: 0,
    left: 0,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.text.muted,
    marginTop: 3,
    fontWeight: '500',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  content: {
    paddingHorizontal: 18,
    paddingVertical: 20,
    paddingBottom: 32,
  },
  filterSection: {
    marginBottom: 18,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border.light,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: COLORS.cardBg,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  sectionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  sectionIconContainerActive: {
    backgroundColor: COLORS.primaryLighter,
    borderColor: COLORS.primaryLight,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTextContainer: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginTop: 3,
  },
  sectionValueActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  chevronContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContent: {
    padding: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    backgroundColor: COLORS.background,
  },
  filterOption: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeFilterOption: {
    backgroundColor: COLORS.primaryLighter,
    borderColor: COLORS.primaryLight,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  filterOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBg,
  },
  radioButtonActive: {
    borderColor: COLORS.primary,
    borderWidth: 2.5,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  filterOptionText: {
    fontSize: 15,
    color: COLORS.text.secondary,
    fontWeight: '500',
    flex: 1,
    letterSpacing: -0.2,
  },
  activeFilterText: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  footer: {
    backgroundColor: COLORS.cardBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  footerContent: {
    flexDirection: 'row',
    padding: 18,
    gap: 12,
  },
  footerBtn: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  clearBtn: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 2,
    borderColor: COLORS.border.medium,
  },
  clearBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.secondary,
    letterSpacing: -0.3,
  },
  applyBtn: {
    backgroundColor: COLORS.primary,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  applyBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  filterBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});

export default FilterModal;