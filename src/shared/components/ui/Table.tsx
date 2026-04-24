import type { ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ComponentProps {
  children: ReactNode;
  className?: string;
}

export const Table = ({ children, className }: ComponentProps) => (
  <div className={cn("w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm", className)}>
    <table className="w-full text-left border-collapse">
      {children}
    </table>
  </div>
);

export const THead = ({ children, className }: ComponentProps) => (
  <thead className={cn("bg-zinc-900/80 border-b border-zinc-800", className)}>
    {children}
  </thead>
);

export const TBody = ({ children, className }: ComponentProps) => (
  <tbody className={cn("divide-y divide-zinc-800", className)}>
    {children}
  </tbody>
);

export const TR = ({ children, className, ...props }: ComponentProps & React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn("group transition-colors hover:bg-zinc-800/50", className)} {...props}>
    {children}
  </tr>
);

export const TH = ({ children, className }: ComponentProps) => (
  <th className={cn("px-6 py-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider", className)}>
    {children}
  </th>
);

export const TD = ({ children, className, colSpan }: ComponentProps & { colSpan?: number }) => (
  <td colSpan={colSpan} className={cn("px-6 py-4 text-sm text-zinc-300", className)}>
    {children}
  </td>
);
