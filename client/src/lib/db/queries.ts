import 'server-only';

import {
    and,
    asc,
    count,
    desc,
    eq,
    gt,
    gte,
    inArray,
    lt,
    countDistinct,
    type SQL,
} from "drizzle-orm";

import {drizzle} from "drizzle-orm/postgres-js";
import postgres from "postgres";


import {user} from "./auth-schema";
import { useServerInsertedHTML } from 'next/navigation';


const client = postgres(process.env.DATABASE_URL as string);
const db = drizzle(client);


// export async function getUserById({}:{}):Promise<User[]> {
//     try{
//         return await db.update(user).set({
//             role, updatedAt: new Date()
//         }).where(eq(user.id, id)).returning();
//     }
//     catch(error) {
//         console.error(error);
//     }
// }