import * as React from "react";

type IAbstract = React.SVGAttributes<SVGElement>;

const Abstract: React.FC<IAbstract> = props => {
  return (
    <svg
      {...props}
      width="393"
      height="642"
      viewBox="0 0 393 642"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="19.3115"
        y="353.512"
        width="371.968"
        height="61.514"
        transform="rotate(40.532 19.3115 353.512)"
        fill="url(#paint0_linear_768_167)"
        fill-opacity="0.2"
      />
      <rect
        x="315.531"
        y="476.824"
        width="65.1928"
        height="61.6513"
        transform="rotate(40.532 315.531 476.824)"
        fill="url(#paint1_linear_768_167)"
        fill-opacity="0.2"
      />
      <rect
        x="341.59"
        y="328.457"
        width="54.1113"
        height="186.859"
        transform="rotate(40.532 341.59 328.457)"
        fill="url(#paint2_linear_768_167)"
        fill-opacity="0.2"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M202.288 0L484.847 241.602L371.859 376.244L330.762 341.104L399.595 260.601L210.161 98.626L141.327 179.128L140.499 178.42L66.3659 265.121L297.242 462.531L259.002 505.733L-23.5576 264.132L202.288 0Z"
        fill="url(#paint3_linear_768_167)"
        fill-opacity="0.2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_768_167"
          x1="205.296"
          y1="353.512"
          x2="196.593"
          y2="443.61"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0F110F" />
          <stop offset="1" stopColor="#187318" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_768_167"
          x1="348.128"
          y1="476.824"
          x2="309.554"
          y2="546.66"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0F110F" />
          <stop offset="1" stopColor="#187318" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_768_167"
          x1="368.645"
          y1="328.457"
          x2="258.709"
          y2="382.964"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0F110F" />
          <stop offset="1" stopColor="#187318" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_768_167"
          x1="230.645"
          y1="9.15783e-06"
          x2="-94.1143"
          y2="558.962"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0F110F" />
          <stop offset="1" stopColor="#187318" />
        </linearGradient>
      </defs>
    </svg>
  );
};
export default Abstract;
