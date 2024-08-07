"use client";

import { MoneyInput, NumberInput } from "@/lib/components/forms";
import { TableCell, TableHeading, TableRow } from "@/lib/components/tables";
import { SectionHeading } from "@/lib/components/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const LoanSchema = z.object({
    purchasePrice: z.coerce.number(),
    downPayment: z.coerce.number(),
    interestRate: z.coerce.number(),
    insurance: z.coerce.number(),
    taxRate: z.coerce.number(),
    years: z.coerce.number(),
});

const IncomeSchema = z.object({
    grossMontlyIncome: z.coerce.number(),
    netMonthlyIncome: z.coerce.number(),
    mortgageRatio: z.coerce.number(),
});

const FundingSchema = z.object({
    cash: z.coerce.number(),
});

const MortgageSchema = z
    .object({})
    .and(LoanSchema)
    .and(IncomeSchema)
    .and(FundingSchema);

type MortgageInterface = z.infer<typeof MortgageSchema>;

export default function Home() {
    const form = useForm<MortgageInterface>({
        resolver: zodResolver(MortgageSchema),
        defaultValues: {
            // Loan
            purchasePrice: 450_000,
            downPayment: 50_000,
            insurance: 1200,
            interestRate: 6.85,
            taxRate: 1.0,
            years: 30,
            // Income
            grossMontlyIncome: 6_000,
            netMonthlyIncome: 4_000,
            mortgageRatio: 2.0,
            // Funding
            cash: 20_000,
        },
    });

    return (
        <main className="p-24 grid grid-cols-2 gap-10">
            <div>
                <SectionHeading>
                    Principal. Interest. Taxes. Insurance. (PiTi)
                </SectionHeading>

                <div className="border border-slate-200 w-full">
                    <TableRow className="grid grid-cols-2">
                        <TableCell>
                            <TableHeading>Purchase price</TableHeading>
                        </TableCell>
                        <TableCell>
                            <MoneyInput
                                control={form.control}
                                name="purchasePrice"
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow className="grid grid-cols-2">
                        <TableCell>
                            <TableHeading>Down payment</TableHeading>
                        </TableCell>
                        <TableCell>
                            <MoneyInput
                                control={form.control}
                                name="downPayment"
                            />
                            (10%)
                        </TableCell>
                    </TableRow>

                    <TableRow className="grid grid-cols-2">
                        <TableCell>
                            <TableHeading>Interest rate</TableHeading>
                        </TableCell>
                        <TableCell>
                            <NumberInput
                                control={form.control}
                                name="interestRate"
                                suffix="%"
                                placeholder="%"
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow className="grid grid-cols-2">
                        <TableCell>
                            <TableHeading>Mortgage length (years)</TableHeading>
                        </TableCell>
                        <TableCell>
                            <NumberInput control={form.control} name="years" />
                        </TableCell>
                    </TableRow>

                    <TableRow className="grid grid-cols-2">
                        <TableCell>
                            <TableHeading>Tax rate</TableHeading>
                        </TableCell>
                        <TableCell>
                            <NumberInput
                                control={form.control}
                                name="taxRate"
                                decimalScale={2}
                                suffix="%"
                                placeholder="%"
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow className="grid grid-cols-2">
                        <TableCell>
                            <TableHeading>Insurance (annual)</TableHeading>
                        </TableCell>
                        <TableCell>
                            <MoneyInput
                                control={form.control}
                                name="insurance"
                            />
                        </TableCell>
                    </TableRow>
                </div>
            </div>

            <div>
                <SectionHeading>Income</SectionHeading>

                <div className="border border-slate-200 w-full">
                    <TableRow className="grid grid-cols-2">
                        <TableCell>
                            <TableHeading>Gross monthly income</TableHeading>
                        </TableCell>
                        <TableCell>
                            <MoneyInput
                                control={form.control}
                                name="grossMontlyIncome"
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow className="grid grid-cols-2">
                        <TableCell>
                            <TableHeading>Net monthly income</TableHeading>
                        </TableCell>
                        <TableCell>
                            <MoneyInput
                                control={form.control}
                                name="netMonthlyIncome"
                            />
                        </TableCell>
                    </TableRow>

                    <TableRow className="grid grid-cols-2">
                        <TableCell>
                            <TableHeading>Net monthly income</TableHeading>
                        </TableCell>
                        <TableCell>
                            <NumberInput
                                control={form.control}
                                name="mortgageRatio"
                                decimalScale={2}
                                suffix="%"
                                placeholder="%"
                            />
                        </TableCell>
                    </TableRow>
                </div>
            </div>
        </main>
    );
}
