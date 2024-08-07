import {
    Controller,
    ControllerProps,
    FieldPath,
    FieldValues,
} from "react-hook-form";

import { NumericFormat, NumericFormatProps } from "react-number-format";

export type NumberInputProp<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, "render"> &
    NumericFormatProps & {
        className?: string;
    };

export const NumberInput = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    name,
    control,
    defaultValue,
    disabled,
    rules,
    shouldUnregister,
    className = "",
    ...inputProps
}: NumberInputProp<TFieldValues, TName>) => {
    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            disabled={disabled}
            rules={rules}
            shouldUnregister={shouldUnregister}
            render={({ field }) => {
                return (
                    <NumericFormat
                        {...inputProps}
                        className={`${className} outline-none bg-transparent`}
                        thousandSeparator
                        {...field}
                    />
                );
            }}
        />
    );
};
