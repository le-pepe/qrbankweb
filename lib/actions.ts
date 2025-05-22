"use server"
import {db} from "@/lib/db";
import {accounts} from "@/db/schema";
import {and, eq} from "drizzle-orm";
import {auth} from "@clerk/nextjs/server";

export async function createOwnAccount(account: any) {
    const { userId } = await auth()
    account.isMine = true;
    account.userId = userId;
    //check if the account exists by rut, bank, accountType and accountNumber
    const res = await db.query.accounts.findFirst({
        where: and(
            eq(accounts.rut, account.rut),
            eq(accounts.bank, account.bank),
            eq(accounts.accountType, account.accountType),
            eq(accounts.accountNumber, account.accountNumber),
            eq(accounts.isMine, true)
        )
    })
    if (res) {
        throw new Error("La cuenta ya existe")
    }
    await db.insert(accounts).values(account)
}

export async function createExternalAccount(account: any) {
    const { userId} = await auth()
    account.isMine = false;
    account.userId = userId

    const res = await db.query.accounts.findFirst({
        where: and(
            eq(accounts.rut, account.rut),
            eq(accounts.bank, account.bank),
            eq(accounts.accountType, account.accountType),
            eq(accounts.accountNumber, account.accountNumber),
            eq(accounts.isMine, false)
        )
    })
    if (res) {
        throw new Error("La cuenta ya existe")
    }

    await db.insert(accounts).values(account)
}

export async function getOwnAccounts() {
    const { userId } = await auth()
    return db.select().from(accounts).where(and(eq(accounts.isMine, true), eq(accounts.userId, userId!)));
}

export async function getExternalAccounts() {
    return db.select().from(accounts).where(eq(accounts.isMine, false))
}

export async function deleteOwnAccountById(accountId: number) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("No autorizado");
    }

    const deletedAccount = await db
        .delete(accounts)
        .where(
            and(
                eq(accounts.id, accountId),
                eq(accounts.userId, userId),
            )
        )
        .returning();

    if (!deletedAccount) {
        throw new Error("Cuenta no encontrada o no tienes permiso para eliminarla");
    }
}
