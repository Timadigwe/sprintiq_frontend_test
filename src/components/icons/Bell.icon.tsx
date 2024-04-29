import * as React from "react";

type IBell = React.SVGAttributes<SVGElement>;

const Bell: React.FC<IBell> = props => {
  return (
    <svg
      {...props}
      width="37"
      height="41"
      viewBox="0 0 37 41"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.82667 30.5116H30.6133V17.2219C30.6133 9.81712 24.6169 3.81395 17.22 3.81395C9.82305 3.81395 3.82667 9.81712 3.82667 17.2219V30.5116ZM17.22 0C26.7293 0 34.44 7.70991 34.44 17.2219V34.3256H0V17.2219C0 7.70991 7.71073 0 17.22 0ZM12.4367 36.2326H22.0033C22.0033 37.497 21.4994 38.7096 20.6023 39.6036C19.7053 40.4977 18.4886 41 17.22 41C15.9514 41 14.7347 40.4977 13.8377 39.6036C12.9406 38.7096 12.4367 37.497 12.4367 36.2326Z"
        fill="#1DAA45"
      />
      <circle cx="31.1602" cy="4.92" r="4.92" fill="#1DAA45" />
    </svg>
  );
};
export default Bell;
