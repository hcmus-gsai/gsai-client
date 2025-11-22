'use server';


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
    type InferSelectModel,
} from "drizzle-orm";

import {drizzle} from "drizzle-orm/postgres-js";
import postgres from "postgres";


import {user} from "./auth-schema";

const client = postgres(process.env.DATABASE_URL as string);
const db = drizzle(client);

export type User = InferSelectModel<typeof user>

export async function getUser(email: string): Promise<Array<User> | undefined> {

    try {
        return await db.select().from(user).where(eq(user.email, email));
    }
    catch(error) {
        console.error(error);
        return undefined;
    }
}




