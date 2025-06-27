interface ProfileData {
    username: string;
    firstName?: string;
    lastName?: string;
    gender?: string;
    age?: string;
    address?: string;
    phone?: string;
    hobby?: string;
    currentPassword?: string;
    newPassword?: string;
    newPasswordConfirmation?: string;
}

interface ProfileResponse {
    response: any;
    data: any;
}

interface UpdateResponse {
    response: any;
    text: string;
}

export class ProfilePageAPI {
    private readonly apiContext: any;

    constructor(apiContext: any) {
        this.apiContext = apiContext;
    }

    async getCurrentUserProfile(): Promise<ProfileResponse> {
        const response = await this.apiContext.get('/users/profile');

        if (response.status() !== 200) {
            const errorText = await response.text();
            throw new Error(`Failed to get profile: ${response.status()} - ${errorText}`);
        }

        const profileData = await response.json();
        return {
            response,
            data: profileData
        };
    }

    async updateProfile(profileData: ProfileData): Promise<UpdateResponse> {
        // Get current profile to merge with updates
        const currentProfile = await this.getCurrentUserProfile();

        // Merge with current data to ensure all required fields are present
        const completeData = {
            username: profileData.username,
            firstName: profileData.firstName ?? currentProfile.data.firstName ?? "",
            lastName: profileData.lastName ?? currentProfile.data.lastName ?? "",
            gender: profileData.gender ?? currentProfile.data.gender ?? "",
            age: profileData.age ?? currentProfile.data.age ?? "",
            address: profileData.address ?? currentProfile.data.address ?? "",
            phone: profileData.phone ?? currentProfile.data.phone ?? "",
            hobby: profileData.hobby ?? currentProfile.data.hobby ?? "",
            currentPassword: profileData.currentPassword ?? "",
            newPassword: profileData.newPassword ?? "",
            newPasswordConfirmation: profileData.newPasswordConfirmation ?? ""
        };

        const response = await this.apiContext.put('/users/profile', completeData);
        const responseText = await response.text();

        if (![200, 201, 204].includes(response.status())) {
            throw new Error(`Failed to update profile: ${response.status()} - ${responseText}`);
        }

        return {
            response,
            text: responseText
        };
    }
}