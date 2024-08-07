"use client";

import { MoneyInput, NumberInput } from "@/lib/components/forms";
import { TableCell, TableHeading, TableRow } from "@/lib/components/tables";
import { SectionHeading } from "@/lib/components/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const MortgageSchema = z.object({
    purchasePrice: z.coerce.number(),
    downPayment: z.coerce.number(),
    interestRate: z.coerce.number(),
    insurance: z.coerce.number(),
    taxRate: z.coerce.number(),
    years: z.coerce.number(),
});

type MortgageInterface = z.infer<typeof MortgageSchema>;

export default function Home() {
    const form = useForm<MortgageInterface>({
        resolver: zodResolver(MortgageSchema),
        defaultValues: {
            purchasePrice: 450_000,
            downPayment: 50_000,
            insurance: 1200,
            interestRate: 6.85,
            taxRate: 1,
            years: 30,
        },
    });

    return (
        <main className="p-24">
            <SectionHeading>
                Principal. Interest. Taxes. Insurance. (PiTi)
            </SectionHeading>

            <div className="border border-slate-200 w-1/2">
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
                        <MoneyInput control={form.control} name="downPayment" />
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
                        <MoneyInput control={form.control} name="insurance" />
                    </TableCell>
                </TableRow>
            </div>
        </main>
    );
}
