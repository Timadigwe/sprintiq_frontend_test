import * as React from "react";

type IBadge = React.SVGAttributes<SVGElement>;

const Badge: React.FC<IBadge> = props => {
  return (
    <svg
      {...props}
      width="21"
      height="37"
      viewBox="0 0 21 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.7612 19.7708C15.9847 19.2684 16.6038 18.803 17.1377 18.7406C17.6716 18.6783 18.1582 18.1759 18.2187 17.6267C18.2831 17.0814 18.7337 16.4426 19.2203 16.2109C19.4654 16.0826 19.6649 15.878 19.7904 15.6262C19.9158 15.3744 19.9608 15.0883 19.9189 14.8087C19.8091 14.2673 20.0477 13.5176 20.4415 13.1456C20.6368 12.9452 20.7653 12.6862 20.8085 12.4059C20.8517 12.1256 20.8074 11.8384 20.6819 11.5857C20.5521 11.3139 20.4846 11.0151 20.4846 10.7123C20.4846 10.4094 20.5521 10.1106 20.6819 9.83882C20.8077 9.58613 20.8521 9.2989 20.8089 9.01854C20.7657 8.73819 20.637 8.47919 20.4415 8.2789C20.0477 7.90304 19.811 7.15522 19.9189 6.61578C19.9614 6.33558 19.9166 6.04877 19.7912 5.79626C19.6657 5.54376 19.4659 5.33848 19.2203 5.20971C18.9602 5.06696 18.7349 4.86538 18.5614 4.62015C18.3879 4.37493 18.2708 4.09243 18.2187 3.79391C18.1756 3.51478 18.0478 3.2568 17.8537 3.05676C17.6595 2.85673 17.409 2.72486 17.1377 2.67997C16.8473 2.62748 16.5725 2.50759 16.334 2.32942C16.0955 2.15124 15.8996 1.91946 15.7612 1.65171C15.6363 1.39914 15.4366 1.19396 15.1909 1.06583C14.9451 0.937707 14.6662 0.893268 14.3943 0.938939C14.1025 0.981006 13.8052 0.954113 13.5251 0.860302C13.2449 0.766491 12.9892 0.608231 12.7774 0.397546C12.412 -0.0114196 11.7304 -0.120477 11.2628 0.150219C10.7951 0.420916 10.0283 0.420916 9.56259 0.150219C9.3176 0.0191897 9.03831 -0.0278626 8.76549 0.0159311C8.49266 0.0597247 8.24059 0.192071 8.04606 0.393651C7.83443 0.604579 7.57875 0.762999 7.29854 0.856825C7.01833 0.950651 6.72098 0.977405 6.42919 0.935044C6.15765 0.890108 5.87925 0.935128 5.63422 1.0636C5.38918 1.19207 5.1902 1.39735 5.06601 1.64976C4.84071 2.14831 4.2216 2.61375 3.68769 2.67607C3.4159 2.72099 3.16485 2.85307 2.97037 3.05346C2.77589 3.25385 2.64792 3.51232 2.60473 3.79196C2.55337 4.09048 2.43645 4.373 2.26289 4.61801C2.08933 4.86303 1.86369 5.06406 1.60317 5.20582C1.35841 5.33523 1.15963 5.54085 1.03519 5.79335C0.910755 6.04584 0.867021 6.33231 0.910227 6.61188C1.01436 7.15133 0.777697 7.9011 0.383891 8.27501C-0.00991485 8.64892 -0.119726 9.35001 0.143442 9.83492C0.406611 10.314 0.406611 11.1027 0.143442 11.5818C0.0178471 11.8348 -0.0265381 12.1223 0.016664 12.403C0.0598661 12.6836 0.188432 12.9429 0.383891 13.1437C0.77959 13.5137 1.01436 14.2634 0.910227 14.8068C0.86698 15.0858 0.910734 15.3718 1.03522 15.6237C1.1597 15.8756 1.35852 16.0804 1.60317 16.209C2.09164 16.4407 2.54036 17.0795 2.60283 17.6248C2.66721 18.1739 3.15189 18.6764 3.6858 18.7387C4.21971 18.801 4.83882 19.2684 5.06412 19.7689C5.18928 20.0204 5.3885 20.2247 5.63332 20.3527C5.87814 20.4807 6.15604 20.5258 6.42729 20.4817C6.95363 20.3746 7.68255 20.616 8.04417 21.0231C8.2392 21.2237 8.49096 21.3557 8.76338 21.4001C9.0358 21.4445 9.3149 21.3991 9.5607 21.2704C10.0265 20.9997 10.7932 20.9997 11.2609 21.2704C11.7285 21.5411 12.4101 21.4281 12.7755 21.0231C13.1409 20.6141 13.8661 20.3746 14.3924 20.4817C14.6643 20.5267 14.943 20.4822 15.1889 20.3546C15.4347 20.2269 15.635 20.0226 15.7612 19.7708ZM10.4127 17.3287C8.70543 17.3287 7.0681 16.6311 5.86089 15.3894C4.65368 14.1476 3.97547 12.4635 3.97547 10.7074C3.97547 8.95129 4.65368 7.26712 5.86089 6.02538C7.0681 4.78364 8.70543 4.08603 10.4127 4.08603C12.1199 4.08603 13.7573 4.78364 14.9645 6.02538C16.1717 7.26712 16.8499 8.95129 16.8499 10.7074C16.8499 12.4635 16.1717 14.1476 14.9645 15.3894C13.7573 16.6311 12.1199 17.3287 10.4127 17.3287ZM2.79216 21.2431L0.438796 34.9707L6.36103 34.0671L11.6263 37L13.9702 23.3269C12.0776 23.8961 10.0822 24.0041 8.142 23.6425C6.20181 23.2808 4.37015 22.4593 2.79216 21.2431ZM17.912 21.3366C17.3208 21.7786 16.6937 22.1676 16.0377 22.4992L14.6215 30.7487L21 27.1887L17.912 21.3366Z"
        fill="#F8F8F8"
      />
    </svg>
  );
};
export default Badge;
