import Link from "next/link";
import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";

// Base styles for buttons
const baseClasses = "inline-flex items-center justify-center font-bold text-base leading-[120%] min-w-[183px] h-[51px] sm:text-lg sm:leading-[143%] sm:min-w-[197px] sm:h-[58px] rounded-[30px] shadow-[0_0_0_6px_rgba(13,74,121,0.1)] transition-all duration-200 hover:cursor-pointer";

// Primary button styles (yellow background)
const primaryClasses = "bg-[#F8B30D] text-[#031A3E] hover:bg-white";

// Secondary button styles (white background, inverted hover)
const secondaryClasses = "bg-white text-[#031A3E] hover:bg-[#F8B30D]";

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  className?: string;
  children: ReactNode;
};

export function Button({ className, children, ...props }: ButtonProps) {
  const classes = `${baseClasses} ${primaryClasses}${className ? ` ${className}` : ""}`;
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  className?: string;
  children: ReactNode;
};

export function ButtonLink({ className, children, ...props }: ButtonLinkProps) {
  const classes = `${baseClasses} ${primaryClasses}${className ? ` ${className}` : ""}`;
  return (
    <Link className={classes} {...props}>
      {children}
    </Link>
  );
}

// Primary Button with Anchor icon before text (Yellow background)
export function PrimaryBtn({ className, children, ...props }: ButtonProps) {
  const classes = `${baseClasses} ${primaryClasses} gap-2${className ? ` ${className}` : ""}`;
  return (
    <button className={classes} {...props}>
      <Image className="mr-2" src="/anchor.svg" alt="" width={16} height={18} />
      {children}
    </button>
  );
}

export function PrimaryBtnLink({ className, children, ...props }: ButtonLinkProps) {
  const classes = `${baseClasses} ${primaryClasses} gap-2${className ? ` ${className}` : ""}`;
  return (
    <Link className={classes} {...props}>
      <Image className="mr-2" src="/anchor.svg" alt="" width={16} height={18} />
      {children}
    </Link>
  );
}

// Secondary Button with Arrow Down icon after text (White background, inverted hover)
export function SecondaryBtn({ className, children, ...props }: ButtonProps) {
  const classes = `${baseClasses} ${secondaryClasses} gap-2${className ? ` ${className}` : ""}`;
  return (
    <button className={classes} {...props}>
      {children}
      <Image className="ml-2" src="/ArrowDown.svg" alt="" width={16} height={16} />
    </button>
  );
}

export function SecondaryBtnLink({ className, children, ...props }: ButtonLinkProps) {
  const classes = `${baseClasses} ${secondaryClasses} gap-2${className ? ` ${className}` : ""}`;
  return (
    <Link className={classes} {...props}>
      {children}
      <Image className="ml-2" src="/ArrowDown.svg" alt="" width={16} height={16} />
    </Link>
  );
}

export default Button;


