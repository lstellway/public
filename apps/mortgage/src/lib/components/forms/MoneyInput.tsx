import { FieldPath, FieldValues } from "react-hook-form";

import { NumberInput, NumberInputProp } from "./NumberInput";

export type MoneyInputProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = NumberInputProp<TFieldValues, TName>;

export const MoneyInput = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    prefix = "$",
    placeholder = prefix,
    thousandSeparator = ",",
    ...props
}: MoneyInputProps<TFieldValues, TName>) => {
    return (
        <NumberInput
            prefix={prefix}
            placeholder={placeholder}
            thousandSeparator={thousandSeparator}
            {...props}
        />
    );
};
