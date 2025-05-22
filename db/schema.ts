import {boolean, index, pgEnum, pgTable, serial, text, timestamp, varchar} from 'drizzle-orm/pg-core'

export const accountType = pgEnum('accountType', ['vista', 'corriente', 'ahorro'])

export const accounts = pgTable('accounts', {
    id: serial().primaryKey(),
    name: varchar().notNull(),
    rut: varchar().notNull(),
    bank: varchar().notNull(),
    email: varchar(),
    alias: varchar(),
    accountType: accountType().default('vista'),
    accountNumber: varchar().notNull(),
    isMine: boolean().default(true).notNull(),
    userId: varchar().notNull(),
    created_at: timestamp().defaultNow().notNull(),
}, (table) => [
    index('userId_idx').on(table.userId),
])
