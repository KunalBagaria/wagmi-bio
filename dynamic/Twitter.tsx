import * as React from "react";

function SvgTwitter(props: any) {
  return (
    <svg
      width={18}
      height={18}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.762 3.291a6.22 6.22 0 01-1.783.489 3.114 3.114 0 001.365-1.719 6.2 6.2 0 01-1.972.754A3.107 3.107 0 008.08 5.648a8.82 8.82 0 01-6.401-3.245 3.104 3.104 0 00-.054 3.027c.241.45.59.835 1.015 1.12a3.098 3.098 0 01-1.407-.39v.04a3.107 3.107 0 002.492 3.046 3.128 3.128 0 01-1.403.053 3.107 3.107 0 002.901 2.156 6.232 6.232 0 01-4.598 1.287 8.783 8.783 0 004.76 1.395c5.713 0 8.836-4.732 8.836-8.836 0-.133-.003-.268-.009-.401a6.315 6.315 0 001.549-1.607l.001-.002z"
        fill="#322"
      />
    </svg>
  );
}

export { SvgTwitter };