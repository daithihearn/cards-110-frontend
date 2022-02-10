const initialState = {
    id: null,
    name: "",
    email: "",
    picture: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAMAAAAPkIrYAAAAV1BMVEVHcEz/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD5S+t0AAAAHHRSTlMAOAPXFwch/O/lLUINUFmymMWlhPbOYY7eebxrUg5LCAAAAu5JREFUWMOtmFeCgjAQQCEBQg+95v7nFGYCgoqkkC9Xl8f0Ese5PfHYCiEmz7E9cU0FnsIO5Hel2A+3IXl1+CbRIrYgFY1gG2iMiTkpfcsU9rGVofJoI7WdD19QykfX1ycFfCNNidQNnRnyTjMyuk29Mtm/KzY6K+dU3VKVfCrKj9FR71oLViWK+rXygf7j9SToqt0fbabgV1e+fnB//UqSPtppd6hMvrm6tklSyahr3f+hgP/GOqV8YMUfL2SICt377Gr+WAJsha+LApUMQ03ZeOHBSB212o1eW9ZvtVBLIGL8lj9g+Euok8d5+BuWo2sSnWQjGI2fMA/tPutWAYBN5yTAysC1Kx7CTq0gQWMZtBoXIu2QUAT9m5uUzQ6kCM5/i8msBhenZ30QixmW9TQ6aplhBBs3B2hVshdAQ2WBKQutjYLFdmJJwVr42AMrMWf5YLG1/pAB9LVppyBNv0YbiDXasAAxLB9qYAU2LAeyeYmp9m054wPp3DkeFNvajlVjhmOgunYsiIoSkcy3Y4HxI1S1tJxqPVAOp6HiGVZjUpsvWLYJ9MWydKMsD8iy3SmgX7BnWDOWh0dYsubTJ2zfYmBNxt3s040d1rH6AXMtNSd7IIcmTEcnXWsOS21QAduaz4S62lYvaGq5rZIpVOhoLVt+aJlFo9jakBTRfAP2mkPbh5mQGQtWndo+CNkSi7R+TyMpNe+2ODEdCnOyBkhjNH/hoBulHwMB9Ux9yI4LIIERbNLubB37caUSwLDDNWEJrmvlx2NxqA+TqO8VCmGTRpLnzdUKRRBGlb05oq2an4t3DDYLO6Wg3a4emosd3sMbKq4w17mDuNmnSQ9yh6N/tyFvF1D/LJJhSgy5r3IvxlOlV0bjRRYE/UYK74uxXMpFw/MvXDBP7zs/lXGZ5Nt1I2uL2fVAkdRL5oIyIZTvYHba4c5x0Xc54nSUSRhs/SAuTlNpjwzErcvmCxRVmWEvTd254BSJjPI+/3uf+QKDNWmJwx+g3AAAAABJRU5ErkJggg==",
    isPlayer: false,
    isAdmin: false
}

export default function myProfileReducer(state = initialState, action) {
    switch (action.type) {
        case 'myProfile/updateId': {
            return {
                id: action.payload
            }
        }
        case 'myProfile/updateName': {
            return {
                name: action.payload
            }
        }
        case 'myProfile/updateEmail': {
            return {
                email: action.payload
            }
        }
        case 'myProfile/updatePicture': {
            return {
                picture: action.payload
            }
        }
        case 'myProfile/updateIsPlayer': {
            return {
                isPlayer: action.payload
            }
        }
        case 'myProfile/updateIsAdmin': {
            return {
                isAdmin: action.payload
            }
        }
        case 'myProfile/update': {
            return {
                id: action.payload.id,
                name: action.payload.name,
                email: action.payload.email,
                picture: action.payload.picture,
                isPlayer: action.payload.isPlayer,
                isAdmin: action.payload.isAdmin
            }
        }
        default:
          return state
    }
}