export const FullLogo: React.FC<React.SVGAttributes<SVGElement>> = props => {
  return (
    <svg
      viewBox="0 0 147 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10"
      {...props}
    >
      <rect x="25" width="8" height="8" rx="2" fill="#312E81" />
      <rect x="15" width="8" height="8" rx="2" fill="#6366F1" />
      <rect x="10" y="10" width="8" height="8" rx="2" fill="#6366F1" />
      <rect x="5" width="8" height="8" rx="2" fill="#C7D2FE" />
      <rect y="10" width="8" height="8" rx="2" fill="#C7D2FE" />
      <rect x="20" y="10" width="8" height="8" rx="2" fill="#312E81" />
      <path
        d="M43.424 14.16C41.9947 14.16 40.9067 13.776 40.16 13.008C39.424 12.24 39.0294 11.1787 38.976 9.82402C38.9654 9.53602 38.96 9.06668 38.96 8.41602C38.96 7.75468 38.9654 7.27468 38.976 6.97602C39.0294 5.63202 39.4294 4.57602 40.176 3.80801C40.9227 3.02935 42.0054 2.64001 43.424 2.64001C44.3734 2.64001 45.1787 2.81068 45.84 3.15201C46.5014 3.48268 47.0027 3.92002 47.344 4.46402C47.6854 5.00801 47.872 5.58935 47.904 6.20801V6.24002C47.904 6.32535 47.8667 6.40001 47.792 6.46402C47.728 6.51735 47.6534 6.54401 47.568 6.54401H46.688C46.4747 6.54401 46.3414 6.42135 46.288 6.17601C46.1067 5.37602 45.7814 4.81601 45.312 4.49601C44.8427 4.16535 44.2134 4.00002 43.424 4.00002C41.5894 4.00002 40.64 5.01868 40.576 7.05602C40.5654 7.34402 40.56 7.78668 40.56 8.38402C40.56 8.98135 40.5654 9.43468 40.576 9.74402C40.64 11.7813 41.5894 12.8 43.424 12.8C44.2134 12.8 44.8427 12.64 45.312 12.32C45.792 11.9893 46.1174 11.424 46.288 10.624C46.32 10.4853 46.368 10.3893 46.432 10.336C46.496 10.2827 46.5814 10.256 46.688 10.256H47.568C47.664 10.256 47.744 10.288 47.808 10.352C47.8827 10.4053 47.9147 10.48 47.904 10.576C47.872 11.2053 47.6854 11.792 47.344 12.336C47.0027 12.88 46.5014 13.3227 45.84 13.664C45.1787 13.9947 44.3734 14.16 43.424 14.16Z"
        fill="#1F2937"
      />
      <path
        d="M53.2483 14.16C52.0749 14.16 51.1629 13.8293 50.5123 13.168C49.8723 12.5067 49.5309 11.6267 49.4883 10.528L49.4723 9.84001L49.4883 9.15202C49.5309 8.06401 49.8776 7.18935 50.5283 6.52802C51.1789 5.85601 52.0856 5.52001 53.2483 5.52001C54.4109 5.52001 55.3176 5.85601 55.9683 6.52802C56.6189 7.18935 56.9656 8.06401 57.0083 9.15202C57.0189 9.26935 57.0243 9.49868 57.0243 9.84001C57.0243 10.1813 57.0189 10.4107 57.0083 10.528C56.9656 11.6267 56.6189 12.5067 55.9683 13.168C55.3283 13.8293 54.4216 14.16 53.2483 14.16ZM53.2483 12.928C53.9203 12.928 54.4483 12.7147 54.8323 12.288C55.2269 11.8613 55.4403 11.248 55.4723 10.448C55.4829 10.3413 55.4883 10.1387 55.4883 9.84001C55.4883 9.54135 55.4829 9.33868 55.4723 9.23202C55.4403 8.43201 55.2269 7.81868 54.8323 7.39201C54.4483 6.96535 53.9203 6.75202 53.2483 6.75202C52.5763 6.75202 52.0429 6.96535 51.6483 7.39201C51.2536 7.81868 51.0456 8.43201 51.0243 9.23202L51.0083 9.84001L51.0243 10.448C51.0456 11.248 51.2536 11.8613 51.6483 12.288C52.0429 12.7147 52.5763 12.928 53.2483 12.928Z"
        fill="#1F2937"
      />
      <path
        d="M59.3958 14C59.2891 14 59.1984 13.968 59.1238 13.904C59.0598 13.8293 59.0278 13.7387 59.0278 13.632V6.04802C59.0278 5.94135 59.0598 5.85601 59.1238 5.79202C59.1984 5.71735 59.2891 5.68001 59.3958 5.68001H60.1158C60.2224 5.68001 60.3078 5.71735 60.3718 5.79202C60.4464 5.85601 60.4838 5.94135 60.4838 6.04802V6.60802C61.0384 5.88268 61.8118 5.52001 62.8038 5.52001C63.9878 5.52001 64.8251 6.01068 65.3158 6.99201C65.5718 6.54401 65.9344 6.18668 66.4038 5.92002C66.8731 5.65335 67.4011 5.52001 67.9878 5.52001C68.8624 5.52001 69.5771 5.81868 70.1318 6.41601C70.6864 7.01335 70.9638 7.87735 70.9638 9.00802V13.632C70.9638 13.7387 70.9264 13.8293 70.8518 13.904C70.7878 13.968 70.7024 14 70.5958 14H69.8438C69.7371 14 69.6464 13.968 69.5718 13.904C69.5078 13.8293 69.4758 13.7387 69.4758 13.632V9.15202C69.4758 8.32002 69.2998 7.72268 68.9478 7.36001C68.6064 6.99735 68.1531 6.81601 67.5878 6.81601C67.0864 6.81601 66.6544 7.00268 66.2918 7.37601C65.9291 7.73868 65.7478 8.33068 65.7478 9.15202V13.632C65.7478 13.7387 65.7104 13.8293 65.6358 13.904C65.5718 13.968 65.4864 14 65.3798 14H64.6278C64.5211 14 64.4304 13.968 64.3558 13.904C64.2918 13.8293 64.2598 13.7387 64.2598 13.632V9.15202C64.2598 8.32002 64.0784 7.72268 63.7158 7.36001C63.3638 6.99735 62.9158 6.81601 62.3718 6.81601C61.8704 6.81601 61.4384 7.00268 61.0758 7.37601C60.7131 7.73868 60.5318 8.32535 60.5318 9.13601V13.632C60.5318 13.7387 60.4944 13.8293 60.4198 13.904C60.3558 13.968 60.2704 14 60.1638 14H59.3958Z"
        fill="#1F2937"
      />
      <path
        d="M73.6305 17.04C73.5239 17.04 73.4332 17.0027 73.3585 16.928C73.2945 16.864 73.2625 16.7787 73.2625 16.672V6.04802C73.2625 5.94135 73.2945 5.85601 73.3585 5.79202C73.4332 5.71735 73.5239 5.68001 73.6305 5.68001H74.3665C74.4732 5.68001 74.5585 5.71735 74.6225 5.79202C74.6972 5.85601 74.7345 5.94135 74.7345 6.04802V6.75202C75.3319 5.93068 76.2065 5.52001 77.3585 5.52001C78.4785 5.52001 79.3159 5.87201 79.8705 6.57601C80.4359 7.28001 80.7399 8.18668 80.7825 9.29602C80.7932 9.41335 80.7985 9.59468 80.7985 9.84001C80.7985 10.0853 80.7932 10.2667 80.7825 10.384C80.7399 11.4827 80.4359 12.3893 79.8705 13.104C79.3052 13.808 78.4679 14.16 77.3585 14.16C76.2492 14.16 75.3852 13.76 74.7665 12.96V16.672C74.7665 16.7787 74.7345 16.864 74.6705 16.928C74.6065 17.0027 74.5212 17.04 74.4145 17.04H73.6305ZM77.0225 12.864C77.7799 12.864 78.3292 12.6293 78.6705 12.16C79.0225 11.6907 79.2145 11.072 79.2465 10.304C79.2572 10.1973 79.2625 10.0427 79.2625 9.84001C79.2625 7.82401 78.5159 6.81601 77.0225 6.81601C76.2865 6.81601 75.7319 7.06135 75.3585 7.55201C74.9959 8.03201 74.7985 8.60802 74.7665 9.28001L74.7505 9.88802L74.7665 10.512C74.7879 11.1413 74.9905 11.6907 75.3745 12.16C75.7585 12.6293 76.3079 12.864 77.0225 12.864Z"
        fill="#1F2937"
      />
      <path
        d="M83.1618 14C83.0551 14 82.9644 13.968 82.8898 13.904C82.8258 13.8293 82.7938 13.7387 82.7938 13.632V3.00801C82.7938 2.90135 82.8258 2.81601 82.8898 2.75202C82.9644 2.67735 83.0551 2.64001 83.1618 2.64001H83.9138C84.0204 2.64001 84.1058 2.67735 84.1698 2.75202C84.2444 2.81601 84.2818 2.90135 84.2818 3.00801V13.632C84.2818 13.7387 84.2444 13.8293 84.1698 13.904C84.1058 13.968 84.0204 14 83.9138 14H83.1618Z"
        fill="#1F2937"
      />
      <path
        d="M89.9964 14.16C88.8977 14.16 88.0177 13.824 87.3564 13.152C86.7057 12.4693 86.3484 11.5413 86.2844 10.368L86.2684 9.82402L86.2844 9.29602C86.3591 8.14402 86.7217 7.22668 87.3724 6.54401C88.0337 5.86135 88.9031 5.52001 89.9804 5.52001C91.1644 5.52001 92.0817 5.89868 92.7324 6.65601C93.3831 7.40268 93.7084 8.41601 93.7084 9.69601V9.96802C93.7084 10.0747 93.6711 10.1653 93.5964 10.24C93.5324 10.304 93.4471 10.336 93.3404 10.336H87.8044V10.48C87.8364 11.1733 88.0444 11.7653 88.4284 12.256C88.8231 12.736 89.3404 12.976 89.9804 12.976C90.4711 12.976 90.8711 12.88 91.1804 12.688C91.5004 12.4853 91.7351 12.2773 91.8844 12.064C91.9804 11.936 92.0497 11.8613 92.0924 11.84C92.1457 11.808 92.2364 11.792 92.3644 11.792H93.1484C93.2444 11.792 93.3244 11.8187 93.3884 11.872C93.4524 11.9253 93.4844 12 93.4844 12.096C93.4844 12.3307 93.3351 12.6133 93.0364 12.944C92.7484 13.2747 92.3377 13.5627 91.8044 13.808C91.2817 14.0427 90.6791 14.16 89.9964 14.16ZM92.1884 9.23202V9.18401C92.1884 8.44802 91.9857 7.85068 91.5804 7.39201C91.1857 6.92268 90.6524 6.68801 89.9804 6.68801C89.3084 6.68801 88.7751 6.92268 88.3804 7.39201C87.9964 7.85068 87.8044 8.44802 87.8044 9.18401V9.23202H92.1884Z"
        fill="#1F2937"
      />
      <path
        d="M98.8226 14C97.1373 14 96.2946 13.0613 96.2946 11.184V6.96001H95.0466C94.94 6.96001 94.8493 6.92801 94.7746 6.86402C94.7106 6.78935 94.6786 6.69868 94.6786 6.59201V6.04802C94.6786 5.94135 94.7106 5.85601 94.7746 5.79202C94.8493 5.71735 94.94 5.68001 95.0466 5.68001H96.2946V3.00801C96.2946 2.90135 96.3266 2.81601 96.3906 2.75202C96.4653 2.67735 96.556 2.64001 96.6626 2.64001H97.4146C97.5213 2.64001 97.6066 2.67735 97.6706 2.75202C97.7453 2.81601 97.7826 2.90135 97.7826 3.00801V5.68001H99.7666C99.8733 5.68001 99.9586 5.71735 100.023 5.79202C100.097 5.85601 100.135 5.94135 100.135 6.04802V6.59201C100.135 6.69868 100.097 6.78935 100.023 6.86402C99.9586 6.92801 99.8733 6.96001 99.7666 6.96001H97.7826V11.072C97.7826 11.6053 97.8733 12.0107 98.0546 12.288C98.236 12.5547 98.5346 12.688 98.9506 12.688H99.9266C100.033 12.688 100.119 12.7253 100.183 12.8C100.257 12.864 100.295 12.9493 100.295 13.056V13.632C100.295 13.7387 100.257 13.8293 100.183 13.904C100.119 13.968 100.033 14 99.9266 14H98.8226Z"
        fill="#1F2937"
      />
      <path
        d="M105.153 14.16C104.054 14.16 103.174 13.824 102.513 13.152C101.862 12.4693 101.505 11.5413 101.441 10.368L101.425 9.82402L101.441 9.29602C101.515 8.14402 101.878 7.22668 102.529 6.54401C103.19 5.86135 104.059 5.52001 105.137 5.52001C106.321 5.52001 107.238 5.89868 107.889 6.65601C108.539 7.40268 108.865 8.41601 108.865 9.69601V9.96802C108.865 10.0747 108.827 10.1653 108.753 10.24C108.689 10.304 108.603 10.336 108.497 10.336H102.961V10.48C102.993 11.1733 103.201 11.7653 103.585 12.256C103.979 12.736 104.497 12.976 105.137 12.976C105.627 12.976 106.027 12.88 106.337 12.688C106.657 12.4853 106.891 12.2773 107.041 12.064C107.137 11.936 107.206 11.8613 107.249 11.84C107.302 11.808 107.393 11.792 107.521 11.792H108.305C108.401 11.792 108.481 11.8187 108.545 11.872C108.609 11.9253 108.641 12 108.641 12.096C108.641 12.3307 108.491 12.6133 108.193 12.944C107.905 13.2747 107.494 13.5627 106.961 13.808C106.438 14.0427 105.835 14.16 105.153 14.16ZM107.345 9.23202V9.18401C107.345 8.44802 107.142 7.85068 106.737 7.39201C106.342 6.92268 105.809 6.68801 105.137 6.68801C104.465 6.68801 103.931 6.92268 103.537 7.39201C103.153 7.85068 102.961 8.44802 102.961 9.18401V9.23202H107.345Z"
        fill="#1F2937"
      />
      <path
        d="M113.984 14C113.877 14 113.781 13.9627 113.696 13.888C113.621 13.8027 113.584 13.7067 113.584 13.6V5.31201H110.736C110.629 5.31201 110.533 5.27468 110.448 5.20002C110.373 5.11468 110.336 5.01868 110.336 4.91201V3.20002C110.336 3.08268 110.373 2.98668 110.448 2.91201C110.533 2.83735 110.629 2.80001 110.736 2.80001H119.344C119.461 2.80001 119.557 2.83735 119.632 2.91201C119.707 2.98668 119.744 3.08268 119.744 3.20002V4.91201C119.744 5.02935 119.707 5.12535 119.632 5.20002C119.557 5.27468 119.461 5.31201 119.344 5.31201H116.496V13.6C116.496 13.7067 116.459 13.8027 116.384 13.888C116.309 13.9627 116.213 14 116.096 14H113.984Z"
        fill="#6366F1"
      />
      <path
        d="M122.112 14.16C121.547 14.16 121.029 14.0533 120.56 13.84C120.101 13.616 119.739 13.3173 119.472 12.944C119.216 12.56 119.088 12.1387 119.088 11.68C119.088 10.944 119.387 10.352 119.984 9.90402C120.592 9.45602 121.424 9.14668 122.48 8.97602L124.48 8.67202V8.44802C124.48 8.04268 124.395 7.74401 124.224 7.55201C124.053 7.36001 123.765 7.26401 123.36 7.26401C123.115 7.26401 122.912 7.30668 122.752 7.39201C122.592 7.47735 122.427 7.59468 122.256 7.74401C122.107 7.87201 121.995 7.95735 121.92 8.00001C121.888 8.08535 121.829 8.12802 121.744 8.12802H120C119.893 8.12802 119.803 8.09601 119.728 8.03201C119.664 7.95735 119.637 7.87201 119.648 7.77601C119.659 7.48802 119.797 7.16802 120.064 6.81601C120.341 6.46401 120.757 6.16001 121.312 5.90401C121.877 5.64801 122.571 5.52001 123.392 5.52001C124.704 5.52001 125.675 5.81335 126.304 6.40001C126.933 6.97601 127.248 7.75468 127.248 8.73601V13.6C127.248 13.7067 127.211 13.8027 127.136 13.888C127.061 13.9627 126.965 14 126.848 14H124.992C124.885 14 124.789 13.9627 124.704 13.888C124.629 13.8027 124.592 13.7067 124.592 13.6V13.04C124.357 13.3707 124.027 13.6427 123.6 13.856C123.184 14.0587 122.688 14.16 122.112 14.16ZM122.864 12.336C123.355 12.336 123.749 12.176 124.048 11.856C124.357 11.536 124.512 11.0667 124.512 10.448V10.224L123.152 10.464C122.192 10.6347 121.712 10.9707 121.712 11.472C121.712 11.7387 121.824 11.952 122.048 12.112C122.272 12.2613 122.544 12.336 122.864 12.336Z"
        fill="#6366F1"
      />
      <path
        d="M134.141 14.16C133.075 14.16 132.248 13.8027 131.661 13.088V13.6C131.661 13.7067 131.624 13.8027 131.549 13.888C131.475 13.9627 131.379 14 131.261 14H129.453C129.347 14 129.251 13.9627 129.165 13.888C129.091 13.8027 129.053 13.7067 129.053 13.6V3.04001C129.053 2.92268 129.091 2.82668 129.165 2.75202C129.251 2.67735 129.347 2.64001 129.453 2.64001H131.405C131.523 2.64001 131.619 2.67735 131.693 2.75202C131.768 2.82668 131.805 2.92268 131.805 3.04001V6.46402C132.403 5.83468 133.181 5.52001 134.141 5.52001C135.176 5.52001 135.992 5.85601 136.589 6.52802C137.187 7.20002 137.507 8.11202 137.549 9.26402C137.56 9.40268 137.565 9.59468 137.565 9.84001C137.565 10.0747 137.56 10.2613 137.549 10.4C137.496 11.5947 137.176 12.5227 136.589 13.184C136.003 13.8347 135.187 14.16 134.141 14.16ZM133.277 12.016C133.779 12.016 134.136 11.8667 134.349 11.568C134.573 11.2693 134.701 10.8587 134.733 10.336C134.755 10.1227 134.765 9.95735 134.765 9.84001C134.765 9.72268 134.755 9.55735 134.733 9.34402C134.701 8.82135 134.573 8.41068 134.349 8.11201C134.136 7.81335 133.779 7.66401 133.277 7.66401C132.808 7.66401 132.451 7.80801 132.205 8.09601C131.96 8.38402 131.827 8.74668 131.805 9.18401L131.789 9.77602L131.805 10.384C131.837 10.864 131.965 11.2587 132.189 11.568C132.424 11.8667 132.787 12.016 133.277 12.016Z"
        fill="#6366F1"
      />
      <path
        d="M142.571 14.16C141.707 14.16 140.982 14.0373 140.395 13.792C139.819 13.5467 139.392 13.2533 139.115 12.912C138.838 12.5707 138.699 12.2667 138.699 12C138.699 11.8933 138.736 11.808 138.811 11.744C138.896 11.6693 138.987 11.632 139.083 11.632H140.907C140.971 11.632 141.03 11.6587 141.083 11.712C141.211 11.7973 141.307 11.8667 141.371 11.92C141.606 12.0907 141.808 12.2187 141.979 12.304C142.16 12.3787 142.379 12.416 142.635 12.416C142.944 12.416 143.195 12.3573 143.387 12.24C143.59 12.112 143.691 11.936 143.691 11.712C143.691 11.5307 143.638 11.3867 143.531 11.28C143.435 11.1733 143.243 11.072 142.955 10.976C142.667 10.8693 142.23 10.7573 141.643 10.64C140.758 10.4587 140.075 10.1653 139.595 9.76002C139.126 9.34401 138.891 8.78935 138.891 8.09601C138.891 7.65868 139.03 7.24268 139.307 6.84801C139.584 6.45335 139.995 6.13335 140.539 5.88801C141.094 5.64268 141.75 5.52001 142.507 5.52001C143.264 5.52001 143.926 5.63735 144.491 5.87201C145.056 6.10668 145.483 6.39468 145.771 6.73601C146.07 7.06668 146.219 7.37068 146.219 7.64802C146.219 7.74402 146.182 7.82935 146.107 7.90402C146.043 7.97868 145.963 8.01602 145.867 8.01602H144.203C144.118 8.01602 144.038 7.98935 143.963 7.93602C143.824 7.86135 143.702 7.78135 143.595 7.69601C143.414 7.55735 143.243 7.45068 143.083 7.37601C142.923 7.30135 142.726 7.26401 142.491 7.26401C142.214 7.26401 141.99 7.32801 141.819 7.45602C141.659 7.58402 141.579 7.74935 141.579 7.95201C141.579 8.11202 141.622 8.24535 141.707 8.35202C141.803 8.45868 141.995 8.56535 142.283 8.67202C142.582 8.76802 143.019 8.86935 143.595 8.97602C144.63 9.15735 145.382 9.47735 145.851 9.93602C146.331 10.3947 146.571 10.9333 146.571 11.552C146.571 12.3413 146.219 12.976 145.515 13.456C144.811 13.9253 143.83 14.16 142.571 14.16Z"
        fill="#6366F1"
      />
    </svg>
  );
};
