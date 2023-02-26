import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { MyProfile } from "../model/Player"
import { RootState } from "./caches"

const initialProfileState: MyProfile = {
    id: "",
    name: "",
    picture:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAMAAAAPkIrYAAAAV1BMVEVHcEz/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD5S+t0AAAAHHRSTlMAOAPXFwch/O/lLUINUFmymMWlhPbOYY7eebxrUg5LCAAAAu5JREFUWMOtmFeCgjAQQCEBQg+95v7nFGYCgoqkkC9Xl8f0Ese5PfHYCiEmz7E9cU0FnsIO5Hel2A+3IXl1+CbRIrYgFY1gG2iMiTkpfcsU9rGVofJoI7WdD19QykfX1ycFfCNNidQNnRnyTjMyuk29Mtm/KzY6K+dU3VKVfCrKj9FR71oLViWK+rXygf7j9SToqt0fbabgV1e+fnB//UqSPtppd6hMvrm6tklSyahr3f+hgP/GOqV8YMUfL2SICt377Gr+WAJsha+LApUMQ03ZeOHBSB212o1eW9ZvtVBLIGL8lj9g+Euok8d5+BuWo2sSnWQjGI2fMA/tPutWAYBN5yTAysC1Kx7CTq0gQWMZtBoXIu2QUAT9m5uUzQ6kCM5/i8msBhenZ30QixmW9TQ6aplhBBs3B2hVshdAQ2WBKQutjYLFdmJJwVr42AMrMWf5YLG1/pAB9LVppyBNv0YbiDXasAAxLB9qYAU2LAeyeYmp9m054wPp3DkeFNvajlVjhmOgunYsiIoSkcy3Y4HxI1S1tJxqPVAOp6HiGVZjUpsvWLYJ9MWydKMsD8iy3SmgX7BnWDOWh0dYsubTJ2zfYmBNxt3s040d1rH6AXMtNSd7IIcmTEcnXWsOS21QAduaz4S62lYvaGq5rZIpVOhoLVt+aJlFo9jakBTRfAP2mkPbh5mQGQtWndo+CNkSi7R+TyMpNe+2ODEdCnOyBkhjNH/hoBulHwMB9Ux9yI4LIIERbNLubB37caUSwLDDNWEJrmvlx2NxqA+TqO8VCmGTRpLnzdUKRRBGlb05oq2an4t3DDYLO6Wg3a4emosd3sMbKq4w17mDuNmnSQ9yh6N/tyFvF1D/LJJhSgy5r3IvxlOlV0bjRRYE/UYK74uxXMpFw/MvXDBP7zs/lXGZ5Nt1I2uL2fVAkdRL5oIyIZTvYHba4c5x0Xc54nSUSRhs/SAuTlNpjwzErcvmCxRVmWEvTd254BSJjPI+/3uf+QKDNWmJwx+g3AAAAABJRU5ErkJggg==",
    isPlayer: false,
    isAdmin: false,
    lastAccess: "1970-01-01T00:00:00",
}

export const myProfileSlice = createSlice({
    name: "myProfile",
    initialState: initialProfileState,
    reducers: {
        updateMyProfile: (_, action: PayloadAction<MyProfile>) => {
            return action.payload
        },
    },
})

export const { updateMyProfile } = myProfileSlice.actions

export const getMyProfile = (state: RootState) => state.myProfile

export const getAccessToken = createSelector(
    getMyProfile,
    myProfile => myProfile.accessToken,
)
