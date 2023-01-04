import * as React from "react";

function Icon(props: any) {
  return (
    <svg
      width={27}
      height={25}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18.664 8.64L13.5 13.412l-5.164-4.77-1.586 1.468 6.75 6.25 6.75-6.25-1.586-1.468z"
        fill="#898989"
        fillOpacity={0.54}
      />
    </svg>
  );
}

export default Icon;
