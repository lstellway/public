import { PropsWithChildren } from "react";

export const SectionHeading = ({ children }: PropsWithChildren) => {
    return <h2 className="text-xl font-bold pb-4">{children}</h2>;
};
