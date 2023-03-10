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
        d="M1.292 3.666a2.374 2.374 0 012.374-2.374H27.33a2.373 2.373 0 012.377 2.374v23.666a2.375 2.375 0 01-2.375 2.376H3.666a2.374 2.374 0 01-2.374-2.375V3.666zm11.247 8.46h3.848v1.933c.556-1.111 1.976-2.111 4.112-2.111 4.093 0 5.063 2.213 5.063 6.272v7.52h-4.143v-6.595c0-2.312-.555-3.617-1.965-3.617-1.957 0-2.771 1.407-2.771 3.617v6.595h-4.144V12.126zM5.435 25.563H9.58V11.948H5.435v13.615zm4.737-18.056a2.665 2.665 0 11-5.329.118 2.665 2.665 0 015.329-.118z"
        fill={color}
      />
    </svg>
  );
}

export default Icon;
