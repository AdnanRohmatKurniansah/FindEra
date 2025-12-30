type Option = {
  value: string
  label: string
  icon?: React.ReactNode
}

type Props = {
  value: string
  onChange: (val: string) => void
  options: Option[]
}

export const RadioCardGroup = ({ value, onChange, options }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {options.map(opt => {
        const active = value === opt.value
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`
              flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition
              ${active 
                ? "border-primary bg-green-50 text-primary"
                : "border-gray-200 hover:border-gray-400"}
            `}
          >
            {opt.icon}
            <span className="font-normal text-sm">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
