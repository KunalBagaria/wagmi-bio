import * as React from "react";

function SvgEmbed(props: any) {
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
        d="M4.182 12.908l4.007 4.6-1.22 1.4-5.227-6 5.227-6 1.22 1.4-4.007 4.6zm12.544 0l-4.007 4.6 1.22 1.4 5.226-6-5.227-6-1.22 1.4 4.008 4.6z"
        {...props}
      />
    </svg>
  );
}

export { SvgEmbed };