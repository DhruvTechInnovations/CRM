import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { INDIAN_STATES_AND_UTS } from "../constants/states";
import { profileService } from "../services/apiService";



export default function AdvocateProfile() {

    const { colors, dark } = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState<boolean>(false);

    const [fullName, setFullName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [barId, setBarId] = useState<string>("-");
    const [zipcode, setZipcode] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [state, setState] = useState("Andhra Pradesh"); // Default state for better UX
    const [otherState, setOtherState] = useState("");

    const [profileLoading, setProfileLoading] = useState<boolean>(true);

    // Request permissions and fetch profile on mount
    useEffect(() => {
        requestPermissions();
        fetchProfile();
    }, []);

    const fetchProfile = async () => { // GET API CALL FOR PROFILE DETAILS.
        try {
            setProfileLoading(true);
            const res = await profileService.getProfile();
            if (res) {
                const data = res.data || res;
                setFullName(data.name || data.fullName || data.full_name || "");
                setEmail(data.email || "");
                setBarId(data.barCouncilId || data.barId || data.bar_id || data.advocate_id || "-");
                setZipcode(data.zipcode || data.pincode || data.zip_code || "");
                setAddress(data.address || "");
                setPhone(data.phone || data.mobile || data.phone_number || "");
                setState(data.state || "Andhra Pradesh");
                setImage(data.image || data.profile_image || data.avatar || null);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to load profile details.");
        } finally {
            setProfileLoading(false);
        }
    };

    const requestPermissions = async () => {
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (cameraStatus.status !== "granted" || mediaStatus.status !== "granted") {
            Alert.alert(
                "Permissions Required",
                "Camera and gallery permissions are needed to update your profile picture."
            );
        }
    };

    const pickImage = async () => {
        try {
            setImageLoading(true);
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to pick image. Please try again.");
        } finally {
            setImageLoading(false);
        }
    };

    const takePhoto = async () => {
        try {
            setImageLoading(true);
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to open camera. Please try again.");
        } finally {
            setImageLoading(false);
        }
    };

    const handleImageChange = () => {
        Alert.alert(
            "Update Profile Picture",
            "Choose how you'd like to add your photo",
            [
                {
                    text: "Take Photo",
                    onPress: takePhoto,
                    style: "default",
                },
                {
                    text: "Choose from Gallery",
                    onPress: pickImage,
                    style: "default",
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ],
            { cancelable: true }
        );
    };

    const validateForm = (): boolean => {
        if (!fullName.trim()) {
            Alert.alert("Validation Error", "Full name is required");
            return false;
        }
        if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
            Alert.alert("Validation Error", "Please enter a valid 10-digit phone number");
            return false;
        }
        if (zipcode && !/^\d{6}$/.test(zipcode)) {
            Alert.alert("Validation Error", "Please enter a valid 6-digit zip code");
            return false;
        }
        return true;
    };

    // const handleFinishUpdate = () => {
    //     if (!validateForm()) return;

    //     // Log profile data with timestamp
    //     const timestamp = new Date().toISOString();
    //     const profileData = {
    //         timestamp,
    //         fullName,
    //         email,
    //         barId,
    //         state: state === "Other" ? otherState : state,
    //         zipcode,
    //         address,
    //         phone,
    //         image: uploadImage()
    //     };




    //     // console.log('profile data 🫵🏻🎶👀🚀', profileData.image);

    //     // API Call
    //     profileService.updateProfile(profileData);
    //     // api.history.log({ type: 'PROFILE_UPDATE', timestamp });

    //     // Add API call here to save profile data
    //     Alert.alert(
    //         "Profile Updated",
    //         "Your profile has been updated successfully!",
    //         [{ text: "OK" }]
    //     );
    // };
    const handleFinishUpdate = async () => {
        if (!validateForm()) return;

        try {
            const timestamp = new Date().toISOString();

            let uploadedImageUrl = null;

            // upload image first
            if (image) {
                uploadedImageUrl = await uploadImage();
            }

            const profileData = {
                timestamp,
                fullName,
                email,
                barId,
                state: state === "Other" ? otherState : state,
                zipcode,
                address,
                phone,
                image: uploadedImageUrl, // 👈 real S3 URL
            };

            console.log("profile payload 🫵🏻🎶👀🚀", profileData);

            // save profile (WAIT FOR IT)
            const res = await profileService.updateProfile(profileData);
            console.log("profile response: 🫵🏻🎶👀🚀", res.data);

            if (res.status !== 200) {
                throw new Error("Profile update failed");
            }

            Alert.alert("Success", "Profile updated successfully!");
        } catch (error) {
            console.log("profile update error:", error);
            Alert.alert("Error", "Failed to update profile");
        }
    };
    if (profileLoading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.text} />
            </View>
        );
    }

    // Dynamic Styles for reusable elements
    const inputStyle = [
        styles.input,
        {
            backgroundColor: dark ? '#1E293B' : '#F8FAFC',
            borderColor: dark ? '#334155' : '#F1F5F9',
            color: colors.text
        }
    ];

    const disabledInputStyle = [
        styles.input,
        styles.disabledInput,
        {
            backgroundColor: dark ? '#0F172A' : '#F1F5F9',
            borderColor: dark ? '#1E293B' : '#E2E8F0',
        }
    ];

    const pickerWrapperStyle = [
        styles.pickerWrapper,
        {
            backgroundColor: dark ? '#1E293B' : '#F8FAFC',
            borderColor: dark ? '#334155' : '#F1F5F9',
        }
    ];
    const uploadImage = async () => {
        if (!image) {
            console.log("No image found");
            return null;
        }

        const uri = image.startsWith("file://")
            ? image
            : `file://${image}`;

        const formData = new FormData();

        formData.append("file", {
            uri,
            name: `upload-${Date.now()}.jpg`,
            type: "image/jpeg",
        } as any);

        console.log("before image upload 🫵🏻🎶👀🚀");

        try {
            const res = await profileService.updateProfileImage(formData);

            console.log("image uploaded 🫵🏻🎶👀🚀", res.data);

            return res.data?.imageUrl;
        } catch (error) {
            console.log("upload error:", error);
            return null;
        }
    };

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: colors.background }}
            contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
            keyboardShouldPersistTaps="handled">
            <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.background }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Advocate Profile</Text>
                <View style={{ width: 40 }} />
            </View>
            <>
                {/* Profile Section */}
                <View style={[styles.profileSection, { backgroundColor: colors.background }]}>
                    <View style={styles.profileContainer}>
                        <TouchableOpacity
                            onPress={handleImageChange}
                            activeOpacity={0.7}
                            disabled={imageLoading}
                        >
                            {imageLoading ? (
                                <View style={[styles.profileImagePlaceholder, { backgroundColor: dark ? '#1E293B' : '#F1F5F9', borderColor: dark ? '#334155' : '#E2E8F0' }]}>
                                    <ActivityIndicator size="large" color={colors.text} />
                                </View>
                            ) : image ? (
                                <Image
                                    source={{ uri: image }}
                                    style={[styles.profileImage, { borderColor: colors.text }]}
                                />
                            ) : (
                                <View style={[styles.profileImagePlaceholder, { backgroundColor: dark ? '#1E293B' : '#F1F5F9', borderColor: dark ? '#334155' : '#E2E8F0' }]}>
                                    <Ionicons name="person" size={40} color="#94A3B8" />
                                    <Text style={styles.placeholderText}>Advocate</Text>
                                </View>
                            )}
                            <View style={[styles.editIconContainer, { backgroundColor: colors.text, borderColor: colors.background }]}>
                                <Ionicons name="camera" size={18} color={colors.background} />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.profileInfoContainer}>
                            <Text style={[styles.profileName, { color: colors.text }]}>{fullName || "Set Name"}</Text>
                            <Text style={styles.profileEmail}>{email}</Text>
                        </View>
                    </View>
                </View>

                {/* Content Container */}
                <View style={styles.contentWrapper}>
                    {/* Personal Details Card */}
                    <View style={[styles.card, { backgroundColor: colors.background, borderColor: dark ? '#334155' : '#F1F5F9' }]}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="person-outline" size={20} color={colors.text} />
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Details</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Full Name <Text style={[styles.required, { color: colors.text }]}>*</Text></Text>
                                <TextInput
                                    style={inputStyle}
                                    value={fullName}
                                    onChangeText={setFullName}
                                    placeholder="Enter full name"
                                    placeholderTextColor="#94A3B8"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Email</Text>
                                <View style={disabledInputStyle}>
                                    <Text style={styles.disabledText}>{email}</Text>
                                    <Ionicons name="lock-closed" size={14} color="#94A3B8" />
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Bar Council ID</Text>
                                <View style={disabledInputStyle}>
                                    <Text style={styles.disabledText}>{barId}</Text>
                                    <Ionicons name="lock-closed" size={14} color="#94A3B8" />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Demographic Details Card */}
                    <View style={[styles.card, { backgroundColor: colors.background, borderColor: dark ? '#334155' : '#F1F5F9' }]}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="location-outline" size={20} color={colors.text} />
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Demographic Details</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>State</Text>
                                <View style={pickerWrapperStyle}>
                                    <Picker
                                        selectedValue={state}
                                        onValueChange={setState}
                                        style={[styles.picker, { color: colors.text }]}
                                        dropdownIconColor={colors.text}
                                    >
                                        {INDIAN_STATES_AND_UTS.map((s) => (
                                            <Picker.Item key={s} label={s} value={s} color={colors.text} style={{ backgroundColor: colors.background }} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Address</Text>
                                <TextInput
                                    style={[inputStyle, styles.textArea]}
                                    value={address}
                                    onChangeText={setAddress}
                                    placeholder="House no, street, locality"
                                    placeholderTextColor="#94A3B8"
                                    multiline
                                />
                            </View>

                            <View style={styles.row}>
                                <View style={[styles.inputContainer, { flex: 1 }]}>
                                    <Text style={styles.label}>PIN Code</Text>
                                    <TextInput
                                        style={inputStyle}
                                        value={zipcode}
                                        onChangeText={setZipcode}
                                        placeholder="6-digit PIN"
                                        placeholderTextColor="#94A3B8"
                                        keyboardType="numeric"
                                        maxLength={6}
                                    />
                                </View>

                                <View style={[styles.inputContainer, { flex: 1.5 }]}>
                                    <Text style={styles.label}>Phone Number</Text>
                                    <TextInput
                                        style={inputStyle}
                                        value={phone}
                                        onChangeText={setPhone}
                                        placeholder="10-digit mobile"
                                        placeholderTextColor="#94A3B8"
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: colors.text, shadowColor: colors.text }]}
                        onPress={handleFinishUpdate}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.saveButtonText, { color: colors.background }]}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingBottom: 20,
        borderBottomColor: "#e5e5e5",
        borderBottomWidth: 1,
    },
    headerBackButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 19,
        fontFamily: 'Poppins-Bold',
    },
    profileSection: {
        paddingVertical: 32,
        alignItems: "center",
    },
    profileContainer: {
        alignItems: "center",
        width: '100%',
    },
    profileImage: {
        width: 130,
        height: 130,
        borderRadius: 40,
        borderWidth: 4,
    },
    profileImagePlaceholder: {
        width: 130,
        height: 130,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderStyle: 'dashed',
    },
    placeholderText: {
        color: "#94A3B8",
        fontSize: 12,
        marginTop: 4,
        fontFamily: 'Poppins-SemiBold',
    },
    editIconContainer: {
        position: "absolute",
        bottom: -4,
        right: -4,
        borderRadius: 14,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 4,
    },
    profileInfoContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    profileName: {
        fontSize: 20,
        fontFamily: 'Poppins-Medium',
        letterSpacing: 0,
    },
    profileEmail: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 4,
        fontFamily: 'Poppins-Medium',
    },
    contentWrapper: {
        paddingHorizontal: 24,
        gap: 20,
    },
    card: {
        borderRadius: 24,
        padding: 24,
        borderWidth: 1.5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
        gap: 12,
    },
    sectionTitle: {
        fontSize: 17,
        fontFamily: 'Poppins-Bold',
    },
    inputGroup: {
        gap: 20,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 13,
        color: '#64748B',
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 4,
    },
    required: {
    },
    input: {
        height: 56,
        borderWidth: 1.5,
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
    },
    textArea: {
        height: 100,
        paddingTop: 16,
        paddingBottom: 16,
        textAlignVertical: 'top',
    },
    disabledInput: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    disabledText: {
        fontSize: 15,
        color: "#64748B",
        fontFamily: 'Poppins-Medium',
    },
    pickerWrapper: {
        height: 56,
        borderWidth: 1.5,
        borderRadius: 16,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    picker: {
        width: '100%',
    },
    row: {
        flexDirection: "row",
        gap: 16,
    },
    saveButton: {
        height: 60,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: 'center',
        marginTop: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    saveButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
});