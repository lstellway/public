import { PropsWithChildren } from "react";

export const TableHeading = ({ children }: PropsWithChildren) => {
    return <h6 className="font-medium">{children}</h6>;
};

export interface TableRowProps extends PropsWithChildren {
    className?: string;
}

export const TableRow = ({ children, className = "" }: TableRowProps) => {
    return <div className={`${className} even:bg-slate-200`}>{children}</div>;
};

export const TableCell = ({ children }: PropsWithChildren) => {
    return <div className={`p-2`}>{children}</div>;
};
