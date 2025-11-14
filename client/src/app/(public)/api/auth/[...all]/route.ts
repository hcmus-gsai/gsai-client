import {auth} from "@/lib/auth"; //Handle sign in, sign out, sign up and more..

import {toNextJsHandler} from "better-auth/next-js";

export const {GET, POST} = toNextJsHandler(auth); //Create all endpoint + logics in them