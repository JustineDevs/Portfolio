import BrandIcon from '@/components/ui/BrandIcon'

const paymentMethods = [
  { name: 'GCash', src: 'https://cdn.brandfetch.io/idU5cKFAqi/w/500/h/119/theme/dark/idlTdAqAVe.png?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'PayMaya', src: 'https://cdn.brandfetch.io/idNZIam-Y9/idX88ZrhHL.svg?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'Wise', src: 'https://cdn.brandfetch.io/idk6fxo1w1/theme/light/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'PayPal', src: 'https://cdn.brandfetch.io/id-Wd4a4TS/theme/light/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'CIMB Bank', src: 'https://cdn.brandfetch.io/idYFvu8CRF/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'GoTyme', src: 'https://cdn.brandfetch.io/idnIc2_J5Q/theme/light/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'Bitget', src: 'https://cdn.brandfetch.io/idFCfM4_fw/w/310/h/96/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B' },
  { name: 'Bybit', src: 'https://cdn.brandfetch.io/ids4kF_w4N/theme/light/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B' },
]

function PaymentMethodSet({ isDuplicate = false }: { isDuplicate?: boolean }) {
  return (
    <div className="horizontal-payment-methods__set" aria-hidden={isDuplicate}>
      {paymentMethods.map(({ name, src }) => (
        <span className="horizontal-payment-methods__item" key={name}>
          <BrandIcon
            src={src}
            alt={`${name} logo`}
            width={40}
            height={40}
            className="horizontal-payment-methods__logo"
          />
          <span className="sr-only">{name}</span>
        </span>
      ))}
    </div>
  )
}

export default function PaymentMethodsCarousel() {
  return (
    <div className="horizontal-payment-methods__viewport" aria-label="Payment methods">
      <div className="horizontal-payment-methods__track">
        {Array.from({ length: 3 }, (_, index) => (
          <PaymentMethodSet key={index} isDuplicate={index > 0} />
        ))}
      </div>
    </div>
  )
}
