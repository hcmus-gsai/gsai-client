import {createAuthClient} from "better-auth/react";
import {adminClient, magicLinkClient, inferAdditionalFields} from "better-auth/client/plugins";
//Reference: https://stackoverflow.com/questions/79316331/how-to-extend-the-core-user-schema-in-better-auth
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    
    plugins: [
        //Thêm các trường khác ngoài 3 fields [ email, password, name ]
        inferAdditionalFields({
            user: {
              profileCompleted: {
                type: 'boolean',
                required: true,
              },

              gender: {
                type: 'string',
                required: true,
              },

              phoneNumber: {
                type: 'string',
                required: true
              },

              province: {
                type: 'string',
                required: true
              },

              role: {
                type: 'string',
                required: true
              },

              birthday: {
                type: 'string',
                required: true
              },

              identityCardImage: {
                type: 'string',
                required: false
              },

              profileImage: {
                type: 'string',
                required: false
              }
            }
        })
    ]
});
