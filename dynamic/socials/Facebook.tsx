import * as React from "react";

function Icon({
  color
}: {
  color: string
}) {
  return (
    <svg
      width={31}
      height={31}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 15.586C0 23.293 5.597 29.701 12.917 31V19.805H9.042V15.5h3.875v-3.445c0-3.875 2.497-6.027 6.028-6.027 1.119 0 2.325.172 3.444.344v3.961h-1.98c-1.895 0-2.326.947-2.326 2.153V15.5h4.134l-.689 4.305h-3.445V31C25.403 29.7 31 23.294 31 15.586 31 7.014 24.025 0 15.5 0S0 7.014 0 15.586z"
        fill={color}
      />
    </svg>
  );
}

export default Icon;
