import * as React from "react";

export const SvgTransactions = (props: any) => {
  return (
    <svg
      width={21}
      height={25}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.116 8.75v2.625l-3.491-3.5 3.491-3.5V7h6.134v1.75h-6.134zM1.75 12.25h6.134V9.625l3.491 3.5-3.491 3.5V14H1.75v-1.75z"
        {...props}
      />
    </svg>
  );
}