import * as React from "react";

function SvgDashboard(props: any) {
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
        d="M3 18.294v-6.97h10v6.97H3zm0-15.68v6.969h6v-6.97H3zm8 10.453H5v3.485h6v-3.485zM7 4.356H5V7.84h2V4.356zm6 0h6V7.84h-6V4.356zm6 8.711h-2v3.485h2v-3.485zM11 2.613v6.97h10v-6.97H11zm4 15.681v-6.97h6v6.97h-6z"
        {...props}
      />
    </svg>
  );
}

export { SvgDashboard };