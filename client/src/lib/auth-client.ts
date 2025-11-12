// import {createAuthClient} from "better-auth/react";
// import {adminClient, magicLinkClient} from "better-auth/client/plugins";

// export const authClient = createAuthClient({
//     plugins : [adminClient(), magicLinkClient()]
// });

// export const {signIn, signUp, signOut, useSession} = authClient;

import {createAuthClient} from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL!
})

