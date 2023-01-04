import * as React from "react";

function Icon(props: any) {
  return (
    <svg
      width={24}
      height={24}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 6h10v10m0-10L6 18 18 6z"
        stroke="#787A85"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Icon;
