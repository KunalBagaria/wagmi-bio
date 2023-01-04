import * as React from "react";

function SvgInvoice(props: any) {
  return (
    <svg
      width={21}
      height={21}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.25 1.75h7L17.5 7v10.5c0 .962-.788 1.75-1.75 1.75H5.241A1.748 1.748 0 013.5 17.5l.009-14c0-.962.778-1.75 1.741-1.75zm0 1.75v14h10.5V7.875h-4.375V3.5H5.25z"
        {...props}
      />
    </svg>
  );
}

export { SvgInvoice };