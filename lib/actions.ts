"use server"
import {db} from "@/lib/db";
import {accounts} from "@/db/schema";
import {and, eq} from "drizzle-orm";
import {auth} from "@clerk/nextjs/server";



export async function createOwnAccount(account: any) {
    account.isMine = true;
    await db.insert(accounts).values(account)
}

export async function createExternalAccount(account: any) {
    account.isMine = false;
    await db.insert(accounts).values(account)
}

export async function getOwnAccounts() {
    const { userId } = await auth()
    return db.select().from(accounts).where(and(eq(accounts.isMine, true), eq(accounts.userId, userId!)));
}

export async function getExternalAccounts() {
    return await db.select().from(accounts).where(eq(accounts.isMine, false))
}
