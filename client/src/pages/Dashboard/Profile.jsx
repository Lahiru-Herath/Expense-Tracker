import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/UserContext";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import toast from "react-hot-toast";
import { LuCamera, LuUser } from "react-icons/lu";

const Profile = () => {
    useUserAuth();

    const { user, updateUser } = useContext(UserContext);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || "");
            setEmail(user.email || "");
            setPreviewUrl(user.profileImageUrl || "");
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!fullName.trim()) {
            toast.error("Full name is required");
            return;
        }

        if (!validateEmail(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        // Validate password fields if user wants to change password
        if (newPassword || confirmPassword || currentPassword) {
            if (!currentPassword) {
                toast.error("Please enter your current password");
                return;
            }

            if (!newPassword) {
                toast.error("Please enter a new password");
                return;
            }

            if (newPassword.length < 8) {
                toast.error("New password must be at least 8 characters");
                return;
            }

            if (newPassword !== confirmPassword) {
                toast.error("New passwords do not match");
                return;
            }
        }

        setLoading(true);

        try {
            let profileImageUrl = user.profileImageUrl;

            // Upload new profile image if selected
            if (profilePic) {
                const imgUploadRes = await uploadImage(profilePic);
                profileImageUrl = imgUploadRes.imageUrl || "";
            }

            const updateData = {
                fullName,
                email,
                profileImageUrl,
            };

            // Add password fields only if user wants to change password
            if (currentPassword && newPassword) {
                updateData.currentPassword = currentPassword;
                updateData.newPassword = newPassword;
            }

            const response = await axiosInstance.put(
                API_PATHS.AUTH.UPDATE_PROFILE,
                updateData
            );

            if (response.data) {
                updateUser(response.data.user);
                toast.success("Profile updated successfully!");

                // Clear password fields
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setProfilePic(null);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to update profile. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout activeMenu="Profile">
            <div className="my-5 mx-auto max-w-3xl">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                        Profile Settings
                    </h2>

                    <form onSubmit={handleUpdateProfile}>
                        {/* Profile Picture Section */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative">
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-purple-100 flex items-center justify-center border-4 border-primary/20">
                                        <LuUser className="text-5xl text-primary" />
                                    </div>
                                )}
                                <label
                                    htmlFor="profile-upload"
                                    className="absolute bottom-0 right-0 bg-primary text-white p-3 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                                >
                                    <LuCamera className="text-xl" />
                                    <input
                                        id="profile-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <p className="text-sm text-gray-500 mt-3">
                                Click the camera icon to update your profile
                                picture
                            </p>
                        </div>

                        {/* Personal Information */}
                        <div className="space-y-4 mb-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                Personal Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Full Name"
                                    placeholder="John Doe"
                                    type="text"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                />

                                <Input
                                    label="Email Address"
                                    placeholder="john@example.com"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Change Password Section */}
                        <div className="space-y-4 mb-6 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">
                                Change Password
                            </h3>
                            <p className="text-sm text-gray-500">
                                Leave blank if you don't want to change your
                                password
                            </p>

                            <Input
                                label="Current Password"
                                placeholder="Enter current password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="New Password"
                                    placeholder="Min 8 characters"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                />

                                <Input
                                    label="Confirm New Password"
                                    placeholder="Re-enter new password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Updating..." : "Update Profile"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setFullName(user.fullName || "");
                                    setEmail(user.email || "");
                                    setPreviewUrl(user.profileImageUrl || "");
                                    setCurrentPassword("");
                                    setNewPassword("");
                                    setConfirmPassword("");
                                    setProfilePic(null);
                                }}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
