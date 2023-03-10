import * as React from "react";

function Icon({
  color
}: {
  color: string
}) {
  return (
    <svg
      width={24}
      height={25}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#prefix__clip0_9_290)">
        <path
          d="M13.5 0h2.97c.216 1.117.81 2.527 1.853 3.925 1.02 1.37 2.372 2.325 4.177 2.325v3.125c-2.63 0-4.605-1.272-6-2.858v10.67c0 1.546-.44 3.056-1.264 4.34a7.574 7.574 0 01-3.366 2.878 7.222 7.222 0 01-4.333.445 7.413 7.413 0 01-3.84-2.138 7.919 7.919 0 01-2.053-4 8.115 8.115 0 01.427-4.514 7.753 7.753 0 012.762-3.506A7.289 7.289 0 019 9.375V12.5c-.89 0-1.76.275-2.5.79a4.651 4.651 0 00-1.657 2.104 4.87 4.87 0 00-.257 2.708c.174.91.603 1.744 1.232 2.4a4.447 4.447 0 002.304 1.283c.873.18 1.778.088 2.6-.267a4.545 4.545 0 002.02-1.726c.494-.771.758-1.677.758-2.605V0z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="prefix__clip0_9_290">
          <path fill="#fff" d="M0 0h24v25H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default Icon;
