import * as React from "react";

type ISubtract = React.SVGAttributes<SVGElement>;

const Subtract: React.FC<ISubtract> = props => {
  return (
    <svg
      {...props}
      width="1488"
      height="141"
      viewBox="0 0 1488 141"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_443_177)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1481.97 134.992C1297.87 64.8825 1035.36 21.0373 743.994 21.0373C452.614 21.0373 190.097 64.8857 6 135C158.285 57.6089 431.844 6 743.992 6C1056.13 6 1329.68 57.6055 1481.97 134.992Z"
          fill="url(#paint0_radial_443_177)"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_443_177"
          x="0"
          y="0"
          width="1487.97"
          height="141"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="3"
            result="effect1_foregroundBlur_443_177"
          />
        </filter>
        <radialGradient
          id="paint0_radial_443_177"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(743.992 48.4586) rotate(-0.0279576) scale(464.877 81.1273)"
        >
          <stop stopColor="#1FC04D" />
          <stop offset="1" stopColor="#0F1310" />
        </radialGradient>
      </defs>
    </svg>
  );
};
export default Subtract;
