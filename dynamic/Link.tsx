import * as React from "react";

function SvgLink(props: any) {
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
        d="M9.583 15.908H6.098c-1.437 0-2.614-1.35-2.614-3s1.177-3 2.614-3h3.485v-2H6.098c-2.404 0-4.356 2.24-4.356 5s1.952 5 4.356 5h3.485v-2zm5.226-8h-3.484v2h3.484c1.438 0 2.614 1.35 2.614 3s-1.176 3-2.614 3h-3.484v2h3.484c2.405 0 4.356-2.24 4.356-5s-1.951-5-4.356-5zm-.87 4h-6.97v2h6.97v-2z"
        {...props}
      />
    </svg>
  );
}

export { SvgLink };